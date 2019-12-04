import { ReflObject } from "./ReflObject";

type ReflStore = { [ key: string ]: ReflObject }
export class ReflContext {
    store: ReflStore = {}

    constructor() {}

    assign(key: string, value: ReflObject) {
        this.store[key] = value;
    }

    retrieve(key: string): any {
        return this.store[key];
    }

    hasDefinition(key: string): any {
        return !!this.store[key];
    }
};
