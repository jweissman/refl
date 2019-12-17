import { ReflNode } from "./ReflNode";
import { instruct, stringClass } from "myr";

let strCount = 0;
export class StringLiteral extends ReflNode {
    constructor(public value: string) { super(); }
    get instructions() {
        let { value } = this;
        // process.stdout.write(value)
        // return [ instruct('push', { value: new MyrString(value) }) ]
        let key = `str-${strCount++}`
        return [
            // instruct('mark'),
            instruct('push', { value }),
            instruct('load', { key: stringClass.name }),
            instruct('send_call', { key: 'new' }),
            instruct('store', {key}),
            instruct('pop'),
            // instruct('push', { value }),
            
            // instruct('dump'),
            // instruct('load', { key }),
            // instruct('send_call', { key: '_set' }),
            // instruct('sweep'),
            instruct('load', { key }),
            // instruct('load', {key: 'mu-alpha'}),
            // instruct('load', {key: 'mu-alpha'}),
        ]
 
    }
}