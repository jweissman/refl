import { ReflNode, ReflProgram } from "./ReflNode";
import { ArrayLookup } from "./ArrayLookup";
import { instruct } from "myr";

export class ArrayInsert extends ReflNode {
    constructor(public lookup: ReflNode, public right: ReflNode) { super();}
    get instructions(): ReflProgram {
        return [
            ...this.right.instructions,
            ...(this.lookup as ArrayLookup).array.instructions,
            instruct('send_call', { key: '[]='}),
        ]
    }
}