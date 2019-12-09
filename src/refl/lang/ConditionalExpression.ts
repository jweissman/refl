import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram, PreludeContext } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflNil } from '../core/ReflNil';
// import ReflReturn from '../core/ReflReturn';
import { instruct } from 'myr';

export class ConditionalExpression extends ReflNode {
    private label: string | undefined;
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }

    prelude(ctx: PreludeContext) {
        this.label = ctx.nextConditionalLabel();
        return [];
    }

    get instructions(): ReflProgram {
        if (this.label) {
            return [
                instruct('noop', { label: `${this.label}-test`}),
                ...this.test.instructions,
                instruct('push', { value: true }),
                instruct('cmp'),
                instruct('jump_if_zero', {target: `${this.label}-truthy`}),
                instruct('noop', { label: `${this.label}-falsy`}),
                ...(this.right ? this.right.instructions : []),
                instruct('jump', { target: `${this.label}-done`}),
                instruct('noop', { label: `${this.label}-truthy`}),
                ...this.left.instructions,
                instruct('noop', { label: `${this.label}-done`}),
            ]
        } else {
            throw new Error("No label for conditional -- prelude not run?");
        }
    }

    evaluate(ctx: ReflContext): ReflObject {
        let expr = null;

        if (this.test.evaluate(ctx).value === true) {
            expr = this.left.evaluate(ctx);
        } else if (this.right) {
            expr = this.right.evaluate(ctx);
        }

        // return expr;
        // if (expr instanceof ReflReturn) {
        //     return expr;
        // } else {
        return new ReflNil();
        // }
    }
}