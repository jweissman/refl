import { ReflObject } from '../core/ReflObject';
import { ReflInt } from '../core/ReflInt';
import { ReflNode } from './ReflNode';
export class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }
    evaluate(): ReflObject {
        return new ReflInt(this.value);
    }
}
