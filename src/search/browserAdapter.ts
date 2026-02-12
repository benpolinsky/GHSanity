import MiniSearch from "minisearch";
import type { SearchFilters, SearchIndex, SearchIndexStatus, SearchResult, ThreadDoc } from "./types";

const DB_NAME = "gh-sanity-search";
const DB_VERSION = 1;
const DOC_STORE = "docs";

type StoredDoc = ThreadDoc;

type IDBDatabaseRef = IDBDatabase | null;

const openDb = (): Promise<IDBDatabaseRef> =>
    new Promise((resolve) => {
        if (typeof indexedDB === "undefined") {
            resolve(null);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(DOC_STORE)) {
                db.createObjectStore(DOC_STORE, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });

const idbGetAll = (db: IDBDatabaseRef): Promise<StoredDoc[]> =>
    new Promise((resolve) => {
        if (!db) return resolve([]);
        const tx = db.transaction(DOC_STORE, "readonly");
        const store = tx.objectStore(DOC_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as StoredDoc[]);
        req.onerror = () => resolve([]);
    });

const idbPutMany = (db: IDBDatabaseRef, docs: StoredDoc[]): Promise<void> =>
    new Promise((resolve) => {
        if (!db) return resolve();
        const tx = db.transaction(DOC_STORE, "readwrite");
        const store = tx.objectStore(DOC_STORE);
        docs.forEach((doc) => store.put(doc));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
    });

const idbClear = (db: IDBDatabaseRef): Promise<void> =>
    new Promise((resolve) => {
        if (!db) return resolve();
        const tx = db.transaction(DOC_STORE, "readwrite");
        const store = tx.objectStore(DOC_STORE);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
    });

const buildSnippet = (doc: StoredDoc, query: string) => {
    const haystack = `${doc.title}\n${doc.body || ""}\n${doc.commentsText || ""}`;
    if (!haystack) return undefined;
    const idx = haystack.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return haystack.slice(0, 140);
    return haystack.slice(Math.max(0, idx - 40), idx + 140);
};

export class BrowserSearchIndex implements SearchIndex {
    private miniSearch: MiniSearch<StoredDoc>;
    private db: IDBDatabaseRef = null;
    private docs = new Map<string, StoredDoc>();
    private ready = false;
    private hydrating = false;
    private partialHydration = false;

    constructor() {
        this.miniSearch = new MiniSearch<StoredDoc>({
            fields: ["title", "body", "commentsText", "labels", "repo", "type"],
            storeFields: [
                "id",
                "title",
                "body",
                "commentsText",
                "repo",
                "type",
                "labels",
                "state",
                "draft",
                "reason",
                "updatedAt",
                "unread",
                "url",
            ],
            searchOptions: {
                boost: { title: 5, labels: 3, repo: 3, type: 2, body: 2, commentsText: 1 },
                prefix: true,
                fuzzy: 0.2,
            },
        });

        this.init();
    }

    private async init() {
        this.db = await openDb();
        const stored = await idbGetAll(this.db);
        if (stored.length) {
            this.miniSearch.addAll(stored);
            stored.forEach((doc) => this.docs.set(doc.id, doc));
        }
        this.ready = true;
    }

    status(): SearchIndexStatus {
        return {
            isReady: this.ready,
            isHydrating: this.hydrating,
            partialHydration: this.partialHydration,
            docCount: this.docs.size,
        };
    }

    async clear() {
        this.docs.clear();
        this.miniSearch.removeAll();
        await idbClear(this.db);
    }

    async indexThreads(docs: ThreadDoc[]): Promise<void> {
        this.hydrating = true;
        docs.forEach((doc) => {
            this.docs.set(doc.id, doc);
            if (this.miniSearch.getDocument(doc.id)) {
                this.miniSearch.remove({ id: doc.id } as StoredDoc);
            }
            this.miniSearch.add(doc as StoredDoc);
        });
        await idbPutMany(this.db, docs as StoredDoc[]);
        this.hydrating = false;
    }

    async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
        if (!query.trim()) return [];
        const results = this.miniSearch.search(query, {
            prefix: true,
            fuzzy: 0.2,
        }) as MiniSearch.SearchResult<StoredDoc>[];

        const filtered = results.filter((hit: MiniSearch.SearchResult<StoredDoc>) => {
            const doc = this.docs.get(hit.id);
            if (!doc) return false;
            if (filters?.repo && doc.repo !== filters.repo) return false;
            if (filters?.type && doc.type !== filters.type) return false;
            if (filters?.state && doc.state !== filters.state) return false;
            if (typeof filters?.draft === "boolean" && doc.draft !== filters.draft)
                return false;
            if (filters?.reason && doc.reason !== filters.reason) return false;
            if (filters?.labels?.length) {
                const labels = doc.labels || [];
                const hasAll = filters.labels.every((l) => labels.includes(l));
                if (!hasAll) return false;
            }
            return true;
        });

        return filtered.map((hit: MiniSearch.SearchResult<StoredDoc>) => {
            const doc = this.docs.get(hit.id)!;
            return {
                id: doc.id,
                title: doc.title,
                repo: doc.repo,
                type: doc.type,
                url: doc.url,
                score: hit.score || 0,
                unread: doc.unread,
                state: doc.state,
                updatedAt: doc.updatedAt,
                snippet: buildSnippet(doc, query),
            } as SearchResult;
        });
    }

    setPartialHydration() {
        this.partialHydration = true;
    }
}
