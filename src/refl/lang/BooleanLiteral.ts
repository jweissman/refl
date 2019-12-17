import { ReflNode, ReflProgram } from "./ReflNode";
import { instruct, boolClass } from 'myr';

let boolCount = 0;
export class BooleanLiteral extends ReflNode {
    constructor(public value: boolean) { super();}
    get instructions(): ReflProgram {
        let { value } = this;
        let key = `bool-${boolCount++}`
        return [
            instruct('mark'),
            instruct('push', { value }),
            instruct('load', { key: boolClass.name }),
            instruct('send_call', { key: 'new' }),
            instruct('store', {key}),
            instruct('pop'),
            instruct('sweep'),
            instruct('load', { key }),
        ]
    }

}