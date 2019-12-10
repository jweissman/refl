import { ReflNode } from "./ReflNode";
import { instruct } from "myr";

export class StringLiteral extends ReflNode {
    constructor(public value: string) { super(); }
    prelude() { return []; }
    get instructions() {
        let { value } = this;
        return [ instruct('push', { value }) ]
    }
}