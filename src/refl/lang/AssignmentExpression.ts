import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflString } from '../core/ReflString';
import { Identifier } from './Identifier';
export class AssignmentExpression extends ReflNode {
    constructor(public left: Identifier, public right: ReflNode) {
        super();
    }
    evaluate(ctx: ReflContext): ReflObject {
        let slot = this.left.name;
        let value = this.right.evaluate(ctx);
        ctx.assign(slot, value);
        return new ReflString(slot);
    }
}
