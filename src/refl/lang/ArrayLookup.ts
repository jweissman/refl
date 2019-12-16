import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct } from "myr";
import { Identifier } from "./Identifier";

export class ArrayLookup extends ReflNode {
    constructor(public array: ReflNode, public index: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            // instruct('send_attr', { key: 'arr' }),
            ...this.index.instructions,
            ...this.array.instructions,
            instruct('send_call', { key: '[]'}),
        ]
    }
}