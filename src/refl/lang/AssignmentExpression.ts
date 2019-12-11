import { instruct } from 'myr';
import { ReflNode, ReflProgram } from './ReflNode';
import { Identifier } from './Identifier';

export class AssignmentExpression extends ReflNode {
    constructor(public left: Identifier, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            ...this.right.instructions,
            instruct('store', { key: this.left.name }),
            // instruct('pop'),
        ]
    }
}
