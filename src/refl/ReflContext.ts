import { ReflObject } from "./core/ReflObject";
import ReflBool from "./core/ReflBool";

type ReflStore = { [ key: string ]: ReflObject }
export class ReflContext {
    private store: ReflStore;

    constructor(baseStore: ReflStore | null = null) {
        this.store = baseStore || {
            true: ReflBool.TRUE,
            false: ReflBool.FALSE,
        };
    }

    assign(key: string, value: ReflObject) {
        this.store[key] = value;
    }

    retrieve(key: string): any {
        return this.store[key];
    }

    hasDefinition(key: string): any {
        return !!this.store[key];
    }

    clone(): ReflContext {
        let newContext = new ReflContext({...this.store});
        return newContext;
    } 
};
