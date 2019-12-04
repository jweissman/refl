import { ReflObject } from "./ReflObject";

export class ReflString extends ReflObject {
    constructor(public value: string) {
        super();
    }

    toJS(): string | number {
        return this.value;
    }
}