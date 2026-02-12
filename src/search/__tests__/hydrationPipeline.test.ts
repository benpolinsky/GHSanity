import { describe, it, expect, vi, beforeEach } from "vitest";
import { hydrateDiscussions } from "../hydrationPipeline";
import { BrowserSearchIndex } from "../browserAdapter";
import type { Notification } from "@/types";
import { getIssueComments } from "@/app/api/github";

vi.mock("@/app/api/github", () => {
    const getIssueComments = vi.fn(async (_url: string, _token: string, etag?: string, cap?: any) => {
        if (cap) cap.remaining -= 1;
        return {
            items: [{ body: etag ? "cached comment" : "comment text" }],
            etag: "W/etag-1",
        } as any;
    });
    const getPullRequestComments = vi.fn(async (_url: string, _token: string, _etag?: string, cap?: any) => {
        if (cap) cap.remaining -= 1;
        return { items: [], etag: null } as any;
    });
    const getPullRequestReviewComments = vi.fn(async (_url: string, _token: string, _etag?: string, cap?: any) => {
        if (cap) cap.remaining -= 1;
        return { items: [], etag: null } as any;
    });
    return {
        getIssueComments,
        getPullRequestComments,
        getPullRequestReviewComments,
    };
});

const makeNotification = (id: string, overrides: Partial<Notification> = {}): Notification => ({
    id,
    reason: "assign",
    repository: { full_name: "owner/repo", name: "repo" },
    subject: { title: `Title ${id}`, url: "https://api/threads/1", type: "Issue" },
    details: {
        title: `Title ${id}`,
        body: overrides.details?.body || "Body",
        draft: false,
        html_url: `https://example/${id}`,
        labels: [],
        state: "open",
        comments_url: "https://api/comments",
        review_comments_url: "",
        ...(overrides.details || {}),
    },
    url: "https://api/threads/1",
    ...(overrides as any),
});

describe("hydrateDiscussions", () => {
    const token = "t";

    beforeEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it("hydrates comments and indexes docs", async () => {
        const idx = new BrowserSearchIndex();
        const notifications = [makeNotification("1")];

        await hydrateDiscussions(notifications, token, idx);

        const results = await idx.search("comment");
        expect(results.length).toBe(1);
        expect(results[0].id).toBe("1");
    });

    it("reuses stored ETag and persists new one", async () => {
        localStorage.setItem("gh-sanity-etags", JSON.stringify({ "n1:issue": "W/old-etag" }));
        const idx = new BrowserSearchIndex();
        const notifications = [makeNotification("n1")];

        await hydrateDiscussions(notifications, token, idx);

        const etagUsed = (getIssueComments as any).mock.calls[0][2];
        expect(etagUsed).toBe("W/old-etag");
        const stored = JSON.parse(localStorage.getItem("gh-sanity-etags") || "{}");
        expect(stored["n1:issue"]).toBe("W/etag-1");
    });

    it("sets partialHydration when session cap is exhausted", async () => {
        // Mock getIssueComments to consume the cap on first call
        (getIssueComments as any).mockImplementationOnce(async (_url: string, _token: string, _etag?: string, cap?: any) => {
            if (cap) cap.remaining = 0;
            return { items: [{ body: "only one" }], etag: "W/etag-1" } as any;
        });

        const idx = new BrowserSearchIndex();
        const notifications = [makeNotification("n1"), makeNotification("n2")];

        await hydrateDiscussions(notifications, token, idx);

        expect(idx.status().partialHydration).toBe(true);
        const ids = (await idx.search("Title")).map((r) => r.id);
        expect(ids.length).toBe(1);
    });
});