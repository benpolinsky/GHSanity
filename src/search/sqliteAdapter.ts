import type { SearchFilters, SearchIndex, SearchIndexStatus, SearchResult, ThreadDoc } from "./types";

const DEFAULT_ENDPOINT = "/api/search";

export class SQLiteSearchIndex implements SearchIndex {
    private fallback: SearchIndex;
    private baseUrl: string;
    private ready = true;

    constructor(fallback: SearchIndex, baseUrl: string = DEFAULT_ENDPOINT) {
        this.fallback = fallback;
        this.baseUrl = baseUrl;
    }

    status(): SearchIndexStatus {
        return this.fallback.status();
    }

    async clear(): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/clear`, { method: "POST" });
        } catch (err) {
            console.warn("SQLite clear failed, falling back", err);
        }
        await this.fallback.clear();
    }

    async indexThreads(docs: ThreadDoc[]): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/index`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ docs }),
            });
        } catch (err) {
            console.warn("SQLite index failed, falling back", err);
            await this.fallback.indexThreads(docs);
        }
    }

    async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
        try {
            const res = await fetch(`${this.baseUrl}/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, filters }),
            });
            if (!res.ok) throw new Error("SQLite search not ok");
            return (await res.json()) as SearchResult[];
        } catch (err) {
            console.warn("SQLite search failed, falling back", err);
            return this.fallback.search(query, filters);
        }
    }
}
