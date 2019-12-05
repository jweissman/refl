import { ReflObject } from '../core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflNil } from '../core/ReflNil';
export class ConditionalExpression extends ReflNode {
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }
    evaluate(ctx: ReflContext): ReflObject {
        if (this.test.evaluate(ctx).value === true) {
            return this.left.evaluate(ctx);
        } else if (this.right) {
            return this.right.evaluate(ctx);
        } else {
            return new ReflNil();
        }
    }
}
