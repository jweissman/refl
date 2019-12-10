import { ReflNode, ReflProgram, PreludeContext } from './ReflNode';
import { instruct } from 'myr';

let conds = 0;
export class ConditionalExpression extends ReflNode {
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }

    prelude(ctx: PreludeContext) {
        return [];
    }

    get instructions(): ReflProgram {
        let label = `cond-${conds++}`;
        return [
            instruct('noop', { label: `${label}-test` }),
            ...this.test.instructions,
            instruct('push', { value: true }),
            instruct('cmp'),
            instruct('jump_if_zero', { target: `${label}-truthy` }),
            instruct('pop'),
            instruct('noop', { label: `${label}-falsy` }),
            ...(this.right ? this.right.instructions : []),
            instruct('jump', { target: `${label}-done` }),
            instruct('noop', { label: `${label}-truthy` }),
            instruct('pop'),
            ...this.left.instructions,
            instruct('noop', { label: `${label}-done` }),
        ]
    }
}