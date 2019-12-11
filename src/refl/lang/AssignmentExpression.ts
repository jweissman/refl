import { instruct, MyrNumeric } from 'myr';
import { ReflNode, ReflProgram } from './ReflNode';
import { Identifier } from './Identifier';
import { throwStatement } from '@babel/types';
import { ArrayLookup } from './ArrayLookup';

export class AssignmentExpression extends ReflNode {
    constructor(public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        if (this.left instanceof Identifier) {
            return [
                ...this.right.instructions,
                // based on the type of the thing on the right...

                instruct('store', { key: this.left.name }),
                // instruct('pop'),
            ]
        } else if (this.left instanceof ArrayLookup) {
            let { array, index } = this.left;
            return [
                ...array.instructions, // have loaded the array
                ...index.instructions,
                ...this.right.instructions,
                // instruct('push', { value: new MyrNumeric(index) }), // push the index
                instruct('arr_put'),
            ]
        } else {
            throw new Error("Don't know how to assign to LHS "
                + this.left.constructor.name)
        }
    }
}
