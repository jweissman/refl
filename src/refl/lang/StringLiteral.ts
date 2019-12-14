import { ReflNode } from "./ReflNode";
import { instruct, MyrString } from "myr";

export class StringLiteral extends ReflNode {
    constructor(public value: string) { super(); }
    get instructions() {
        let { value } = this;
        // process.stdout.write(value)
        return [ instruct('push', { value: new MyrString(value) }) ]
    }
}