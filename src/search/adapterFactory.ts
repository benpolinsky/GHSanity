import { BrowserSearchIndex } from "./browserAdapter";
import { SQLiteSearchIndex } from "./sqliteAdapter";
import type { SearchIndex } from "./types";

const getPreferredAdapter = () =>
    (process.env.NEXT_PUBLIC_SEARCH_ADAPTER || "browser").toLowerCase();

export const createSearchIndex = (): SearchIndex => {
    const browser = new BrowserSearchIndex();
    const choice = getPreferredAdapter();

    if (choice === "sqlite") {
        try {
            return new SQLiteSearchIndex(browser);
        } catch (err) {
            console.warn("SQLite adapter unavailable, falling back to browser", err);
            return browser;
        }
    }

    return browser;
};
