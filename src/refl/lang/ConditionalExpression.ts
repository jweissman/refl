import { ReflNode, ReflProgram } from './ReflNode';
import { instruct, MyrBoolean } from 'myr';

let conds = 0;
export class ConditionalExpression extends ReflNode {
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        let label = `cond-${conds++}`;
        return [
            instruct('noop', { label: `${label}-test` }),
            ...this.test.instructions,
            instruct('push', { value: new MyrBoolean(true) }),
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