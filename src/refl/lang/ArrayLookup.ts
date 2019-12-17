import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct } from "myr";

export class ArrayLookup extends ReflNode {
    constructor(public array: ReflNode, public index: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            ...this.index.instructions,
            ...this.array.instructions,
            instruct('send_call', { key: '[]'}),
        ]
    }
}