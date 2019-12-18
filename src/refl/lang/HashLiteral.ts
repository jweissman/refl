import { ReflNode, ReflProgram } from "./ReflNode";
import { KeyValuePair } from "./KeyValuePair";
import { MyrHash, hashClass, instruct, MyrString } from "myr";

// let hashCount = 0;
export class HashLiteral extends ReflNode {
    constructor(public kvPairs: KeyValuePair[]) {
        super();
    }

    get instructions(): ReflProgram {
        // let key=`hsh-${hashCount++}`
        // let installKvs: ReflProgram = this.kvPairs.flatMap((pair: KeyValuePair) => [
        //     instruct('push', { value: new MyrString(pair.key.name) }),
        //     ...pair.value.instructions,
        //     instruct('hash_put'),
        // ])

        let loadKeyValues: ReflProgram = this.kvPairs.reverse().flatMap((pair: KeyValuePair) => [
            instruct('mark_list'),
            ...pair.value.instructions,
            instruct('push', { value: new MyrString(pair.key.name) }),
            instruct('gather'),
        ])

        return [
            // ...loadKeyValues,
            instruct('mark'),
            instruct('mark_list'),
            ...loadKeyValues,
            instruct('gather'),
            instruct('load', { key: hashClass.name }),
            instruct('send_call', { key: 'new' }),
            instruct('store', { key: 'hash-lit'}),
            instruct('sweep'),
            instruct('load', { key: 'hash-lit'}),
            // instruct('push', { value: new MyrHash() }),
            // ...installKvs,
        ]
        // return [
        //     instruct('mark'),
        //     instruct('mark_list'),
        //     ...loadKeyValues,
        //     instruct('gather'),
        //     // instruct('store', { key: 'tuples'}),
        //     // instruct('pop'),
        //     // instruct('load', { key: 'tuples'}),
        //     instruct('load', { key: hashClass.name }),
        //     instruct('send_call', { key: 'new' }),
        //     instruct('store', { key }),
        //     // instruct('pop'),

        //     instruct('sweep'),
        //     instruct('load', { key }),
        //     // ...installKvs,
        //     // // instruct('load', { key }),
        //     // // instruct('load', { key }),
            
        //     // instruct('mark_list'),
        //     // ...loadKeyValues,
        //     // instruct('gather'),
        //     // instruct('load', { key }),
        //     // instruct('send_call', { key: '_set'}),
        //     // instruct('load', { key }),
        // ]
    }
}