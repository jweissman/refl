import { instruct, Instruction } from 'myr';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, PreludeContext, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflString } from '../core/ReflString';
import { Identifier } from './Identifier';

// import { ReflInstruction } from '../ReflInterpreter';
export class AssignmentExpression extends ReflNode {
    constructor(public left: Identifier, public right: ReflNode) {
        super();
    }

    prelude(ctx: PreludeContext) { return this.right.prelude(ctx); }

    get instructions(): ReflProgram {
        return [
            ...this.right.instructions,
            instruct('store', { key: this.left.name }),
            instruct('pop'),
        ]
    }
}
