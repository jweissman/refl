import { ReflObject } from '../core/ReflObject';
import { ReflInt } from '../core/ReflInt';
import { ReflNode } from './ReflNode';
import { instruct } from 'myr';

export class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }

    evaluate(): ReflObject {
        return new ReflInt(this.value);
    }

    prelude() { return []; }
    get instructions() {
        let { value } = this;
        return [ instruct('push', { value }) ]
    }
}
