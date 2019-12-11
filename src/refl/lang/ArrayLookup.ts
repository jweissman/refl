import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct } from "myr";
import { Identifier } from "./Identifier";

export class ArrayLookup extends ReflNode {
    constructor(public array: ReflNode, public index: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            ...this.array.instructions,
            ...this.index.instructions,
            instruct('arr_get'),
        ]
    }
}