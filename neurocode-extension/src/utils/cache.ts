export class Cache<T> {
    private store = new Map<string, { data: T, timestamp: number }>();
    private ttl: number;

    constructor(ttlMinutes: number = 60) {
        this.ttl = ttlMinutes * 60 * 1000;
    }

    set(key: string, data: T) {
        this.store.set(key, { data, timestamp: Date.now() });
    }

    get(key: string): T | undefined {
        const item = this.store.get(key);
        if (!item) return undefined;
        if (Date.now() - item.timestamp > this.ttl) {
            this.store.delete(key);
            return undefined;
        }
        return item.data;
    }

    clear() {
        this.store.clear();
    }
}

export const projectCache = new Cache<any>(30);
