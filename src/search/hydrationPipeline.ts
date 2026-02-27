import {
    getIssueComments,
    getPullRequestComments,
    getPullRequestReviewComments,
} from "@/app/api/github";
import type { Notification } from "@/types";
import type { SearchIndex, ThreadDoc } from "./types";

const ETAG_KEY = "gh-sanity-etags";
const CONCURRENCY_LIMIT = 3;
const SESSION_CAP = 200;

type ETagRecord = Record<string, string>;

type HydrationCap = { remaining: number };

const loadEtags = (): ETagRecord => {
    if (typeof localStorage === "undefined") return {};
    try {
        const raw = localStorage.getItem(ETAG_KEY);
        return raw ? (JSON.parse(raw) as ETagRecord) : {};
    } catch (err) {
        console.warn("Failed to load ETags", err);
        return {};
    }
};

const saveEtags = (etagMap: ETagRecord) => {
    if (typeof localStorage === "undefined") return;
    try {
        localStorage.setItem(ETAG_KEY, JSON.stringify(etagMap));
    } catch (err) {
        console.warn("Failed to save ETags", err);
    }
};

const withLimit = async <T>(limit: number, tasks: Array<() => Promise<T>>) => {
    const results: T[] = [];
    let index = 0;

    const worker = async () => {
        while (index < tasks.length) {
            const current = index;
            index += 1;
            const value = await tasks[current]();
            results.push(value);
        }
    };

    const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
    await Promise.all(workers);
    return results;
};

const aggregateComments = (bodies: string[]) =>
    bodies
        .filter(Boolean)
        .map((b) => b.trim())
        .filter((b) => b.length)
        .join("\n\n");

const buildThreadDoc = (
    notification: Notification,
    commentsText: string,
): ThreadDoc => ({
    id: notification.id,
    repo: notification.repository.full_name,
    type: notification.subject.type,
    title: notification.subject.title,
    body: notification.details.body,
    commentsText,
    labels: notification.details.labels?.map((l) => l.name),
    state: notification.details.state,
    draft: notification.details.draft,
    reason: notification.reason as any,
    updatedAt: (notification as any).updated_at,
    unread: true,
    url: notification.details.html_url,
});

const fetchCommentsForNotification = async (
    notification: Notification,
    token: string,
    etags: ETagRecord,
    cap: HydrationCap,
): Promise<string> => {
    const comments: string[] = [];
    if (cap.remaining <= 0) return "";

    const details: any = notification.details;
    const issueUrl: string | undefined = details?.comments_url;
    const reviewUrl: string | undefined = details?.review_comments_url;

    if (issueUrl && cap.remaining > 0) {
        const key = `${notification.id}:issue`;
        const res = await getIssueComments(issueUrl, token, etags[key], cap);
        if (res.items.length) comments.push(...res.items.map((c: any) => c.body || ""));
        if (res.etag) etags[key] = res.etag;
    }

    if (notification.subject.type === "PullRequest" && reviewUrl && cap.remaining > 0) {
        const key = `${notification.id}:review`;
        const res = await getPullRequestReviewComments(reviewUrl, token, etags[key], cap);
        if (res.items.length) comments.push(...res.items.map((c: any) => c.body || ""));
        if (res.etag) etags[key] = res.etag;
    }

    return aggregateComments(comments);
};

export const hydrateDiscussions = async (
    notifications: Notification[],
    token: string,
    searchIndex: SearchIndex,
) => {
    const etags = loadEtags();
    const cap: HydrationCap = { remaining: SESSION_CAP };
    let partial = false;

    const tasks = notifications.map(
        (notification) => async () => {
            if (cap.remaining <= 0) {
                partial = true;
                return null;
            }
            try {
                const commentsText = await fetchCommentsForNotification(
                    notification,
                    token,
                    etags,
                    cap,
                );
                return buildThreadDoc(notification, commentsText);
            } catch (err) {
                console.warn("Hydration failed for thread", notification.id, err);
                return null;
            }
        },
    );

    const docs = (await withLimit(CONCURRENCY_LIMIT, tasks)).filter(
        (doc): doc is ThreadDoc => Boolean(doc),
    );

    if (docs.length) {
        await searchIndex.indexThreads(docs);
    }

    if (cap.remaining <= 0) {
        partial = true;
    }

    saveEtags(etags);

    if (partial && (searchIndex as any).setPartialHydration) {
        (searchIndex as any).setPartialHydration();
    }
};

export const clearHydrationCache = async (searchIndex: SearchIndex) => {
    await searchIndex.clear();
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.removeItem(ETAG_KEY);
        } catch (err) {
            console.warn("Failed to clear ETags", err);
        }
    }
};
