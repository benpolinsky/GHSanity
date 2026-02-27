import { describe, it, expect, beforeEach } from "vitest";
import { BrowserSearchIndex } from "../browserAdapter";
import type { ThreadDoc } from "../types";

const makeDoc = (overrides: Partial<ThreadDoc> = {}): ThreadDoc => ({
    id: overrides.id || Math.random().toString(36).slice(2),
    repo: overrides.repo || "owner/repo",
    type: overrides.type || "Issue",
    title: overrides.title || "Fix bug",
    body: overrides.body || "Details about the fix",
    commentsText: overrides.commentsText,
    labels: overrides.labels || ["bug"],
    state: overrides.state || "open",
    draft: overrides.draft || false,
    reason: overrides.reason || "assign",
    updatedAt: overrides.updatedAt || new Date().toISOString(),
    unread: overrides.unread ?? true,
    url: overrides.url || "https://example.com",
});

describe("BrowserSearchIndex", () => {
    let index: BrowserSearchIndex;

    beforeEach(() => {
        index = new BrowserSearchIndex();
    });

    it("indexes and finds by title with boosts", async () => {
        const titleDoc = makeDoc({ id: "1", title: "Add search adapter" });
        const bodyDoc = makeDoc({ id: "2", title: "Misc", body: "search adapter details" });
        await index.indexThreads([titleDoc, bodyDoc]);

        const results = await index.search("search adapter");
        expect(results[0].id).toBe("1");
    });

    it("applies filters for type and state", async () => {
        const pr = makeDoc({ id: "pr", type: "PullRequest", state: "open", title: "PR feature" });
        const issue = makeDoc({ id: "iss", type: "Issue", state: "closed", title: "Issue fix" });
        await index.indexThreads([pr, issue]);

        const onlyPR = await index.search("PR", { type: "PullRequest" as any });
        expect(onlyPR.map((r) => r.id)).toContain("pr");
        expect(onlyPR.map((r) => r.id)).not.toContain("iss");

        const onlyClosed = await index.search("Issue", { state: "closed" });
        expect(onlyClosed.map((r) => r.id)).toEqual(["iss"]);
    });

    it("matches comment text", async () => {
        const doc = makeDoc({ id: "c1", commentsText: "this happens in prod" });
        await index.indexThreads([doc]);

        const results = await index.search("prod");
        expect(results.map((r) => r.id)).toEqual(["c1"]);
    });

    it("requires all labels when filtering", async () => {
        const withLabels = makeDoc({ id: "l1", labels: ["bug", "backend"], title: "backend bug" });
        const other = makeDoc({ id: "l2", labels: ["frontend"], title: "frontend bug" });
        await index.indexThreads([withLabels, other]);

        const results = await index.search("bug", { labels: ["bug", "backend"] });
        expect(results.map((r) => r.id)).toEqual(["l1"]);
    });

    it("applies draft-only filter only when requested", async () => {
        const draft = makeDoc({ id: "d1", draft: true, title: "draft change" });
        const regular = makeDoc({ id: "d2", draft: false, title: "ready change" });
        await index.indexThreads([draft, regular]);

        const draftsOnly = await index.search("change", { draft: true });
        expect(draftsOnly.map((r) => r.id)).toEqual(["d1"]);

        const allResults = await index.search("change");
        expect(new Set(allResults.map((r) => r.id))).toEqual(new Set(["d1", "d2"]));
    });
});