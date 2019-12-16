import { ReflNode } from './ReflNode';
import { instruct, numberClass } from 'myr';

let numCount = 0;
export class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }
    get instructions() {
        let { value } = this;
        let key = `num-${numCount++}`
        return [
            instruct('mark'),
            instruct('load', { key: numberClass.name }),
            instruct('send_call', { key: 'new' }),
            instruct('store', {key}),
            instruct('pop'),
            instruct('push', { value }),
            
            // instruct('dump'),
            instruct('load', { key }),
            instruct('send_call', { key: '_set' }),
            instruct('sweep'),
            instruct('load', { key }),
            // instruct('load', {key: 'mu-alpha'}),
            // instruct('load', {key: 'mu-alpha'}),
        ]
    }
}
