import type { NotificationType, ReasonFilter } from "@/types";

export type ThreadDoc = {
    id: string;
    repo: string;
    type: NotificationType;
    title: string;
    body?: string;
    commentsText?: string;
    labels?: string[];
    state?: string;
    draft?: boolean;
    reason?: ReasonFilter;
    updatedAt?: string;
    unread?: boolean;
    url: string;
    repoPriority?: number;
    unreadScore?: number;
    recencyScore?: number;
};

export type SearchFilters = {
    repo?: string;
    type?: NotificationType | null;
    state?: string;
    draft?: boolean;
    reason?: ReasonFilter;
    labels?: string[];
};

export type SearchResult = {
    id: string;
    title: string;
    repo: string;
    type: NotificationType;
    url: string;
    score: number;
    snippet?: string;
    unread?: boolean;
    state?: string;
    updatedAt?: string;
};

export interface SearchIndexStatus {
    isReady: boolean;
    isHydrating: boolean;
    partialHydration?: boolean;
    lastUpdated?: string;
    docCount?: number;
}

export interface SearchIndex {
    indexThreads(docs: ThreadDoc[]): Promise<void>;
    search(query: string, filters?: SearchFilters): Promise<SearchResult[]>;
    status(): SearchIndexStatus;
    clear(): Promise<void>;
}
