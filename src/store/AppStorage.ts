export interface Store<T> {
    save(state: T): void;
    load(): T;
}

export class LocalStorageStore<T> implements Store<T> {
    key: string

    constructor(key: string = "gh-sanity-storage") {
        this.key = key;
    }

    save(state: T) {
        localStorage.setItem(this.key, JSON.stringify(state));
    }

    load() {
        const state = localStorage.getItem(this.key);
        return state ? JSON.parse(state) : null;
    }
}