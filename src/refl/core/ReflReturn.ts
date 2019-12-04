import { ReflObject } from "./ReflObject";

// hint to interpreter for early returns etc
export default class ReflReturn extends ReflObject {
    constructor(public wrapped: ReflObject) {
        super();
    }

    toJS(): string | number | boolean | null {
        return this.wrapper.toJS();
    }
}