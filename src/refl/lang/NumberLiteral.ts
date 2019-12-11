import { ReflNode } from './ReflNode';
import { instruct, MyrNumeric } from 'myr';

export class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }
    get instructions() {
        let { value } = this;
        return [
            instruct('push', { value: new MyrNumeric(value) })
        ]
    }
}
