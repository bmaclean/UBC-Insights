/**
 * Generic data structure implemented with a typescript/javascript Map
 * Map's keys are restricted to strings, values are of type T
 */
export class Dataset <T> {
    private ds: Map<string, T>;

    public constructor() {
        this.ds = new Map<string, T>();
    }

    public set(key: string, value: T): void {
        this.ds.set(key, value);
    }

    public get(key: string): T {
        return this.ds.get(key);
    }

    public has(key: string): boolean {
        return this.ds.has(key);
    }

    public remove(key: string): void {
        this.ds.delete(key);
    }

    public getSize(): number {
        return this.ds.size;
    }

    public getDataset(): Map<string, T> {
        return this.ds;
    }

    public toJSON(): any {
        let json: any = {};
        this.ds.forEach((value: T, key: string) => {
            json[key] = this.ds.get(key);
        });
        return json;
    }
}