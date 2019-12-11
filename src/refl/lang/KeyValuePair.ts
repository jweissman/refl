import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";

export class KeyValuePair extends ReflNode {
    constructor(public key: Identifier, public value: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return []
    }
}