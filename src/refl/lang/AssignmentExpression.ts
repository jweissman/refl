import { instruct, MyrNumeric } from 'myr';
import { ReflNode, ReflProgram } from './ReflNode';
import { Identifier } from './Identifier';
import { throwStatement } from '@babel/types';
import { ArrayLookup } from './ArrayLookup';
import { DotAccess } from './DotAccess';
import { FunctionLiteral } from './FunctionLiteral';

export class AssignmentExpression extends ReflNode {
    constructor(public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        if (this.left instanceof Identifier) {
            if (this.right instanceof FunctionLiteral) {
                this.right.label = this.left.name;
            }
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
        } else if (this.left instanceof DotAccess) {
            // assume send_eq? and we can check if a hash in the machine...
            let { object, message } = this.left;
            return [
                ...object.instructions,
                ...this.right.instructions,
                instruct('send_eq', { key: (message as Identifier).name }),
                // ...this.right.instructions,
            ]

        } else {
            throw new Error("Don't know how to assign to LHS "
                + this.left.constructor.name)
        }
    }
}
