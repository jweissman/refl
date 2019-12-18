import { ReflNode, ReflProgram } from "./ReflNode";
import { ArrayLookup } from "./ArrayLookup";
import { instruct } from "myr";

export class ArrayInsert extends ReflNode {
    constructor(public lookup: ArrayLookup, public right: ReflNode) { super();}
    get instructions(): ReflProgram {
        let { array, index } = this.lookup as ArrayLookup;
        return [
            ...index.instructions,
            ...this.right.instructions,
            ...array.instructions,
            // ...(this.lookup as ArrayLookup).array.instructions,
            instruct('send_call', { key: '[]='}),
        ]
    }
}