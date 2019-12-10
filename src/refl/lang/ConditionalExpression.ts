import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram, PreludeContext } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflNil } from '../core/ReflNil';
// import ReflReturn from '../core/ReflReturn';
import { instruct } from 'myr';

let conds = 0;
export class ConditionalExpression extends ReflNode {
    // private label: string | undefined;
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }

    prelude(ctx: PreludeContext) {
        // this.label = ctx.nextConditionalLabel();
        return [];
    }

    // now instructions need ctx...
    get instructions(): ReflProgram {
        let label = `cond-${conds++}`;
        // if (this.label) {
            return [
                instruct('noop', { label: `${label}-test`}),
                ...this.test.instructions,
                instruct('push', { value: true }),
                instruct('cmp'),
                instruct('jump_if_zero', {target: `${label}-truthy`}),
                instruct('pop'),
                instruct('noop', { label: `${label}-falsy`}),
                ...(this.right ? this.right.instructions : []),
                instruct('jump', { target: `${label}-done`}),
                instruct('noop', { label: `${label}-truthy`}),
                instruct('pop'),
                ...this.left.instructions,
                instruct('noop', { label: `${label}-done`}),
            ]
        // } else {
        //     console.trace("missing cond label?")
        //     throw new Error("No label for conditional -- prelude not run?");
        // }
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