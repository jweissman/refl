import { ReflNode, ReflProgram } from "./ReflNode";
import { KeyValuePair } from "./KeyValuePair";
import { MyrHash, instruct, MyrString } from "myr";

export class HashLiteral extends ReflNode {
    constructor(public kvPairs: KeyValuePair[]) {
        super();
    }

    get instructions(): ReflProgram {
        // the result of this should be:
        // [x] there is a hash on the stack,
        // [ ] with kvPairs setup

        let installKvs: ReflProgram = this.kvPairs.flatMap((pair: KeyValuePair) => [
            instruct('push', { value: new MyrString(pair.key.name) }),
            ...pair.value.instructions,
            instruct('hash_put'),
        ])

        return [
            instruct('push', { value: new MyrHash() }),
            ...installKvs,
        ]
    }

}