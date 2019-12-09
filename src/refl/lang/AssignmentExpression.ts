import { instruct, Instruction } from 'myr';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, PreludeContext } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { ReflString } from '../core/ReflString';
import { Identifier } from './Identifier';

// import { ReflInstruction } from '../ReflInterpreter';
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

    prelude(ctx: PreludeContext) { return this.right.prelude(ctx); }

    get instructions(): Instruction<any>[] {
        return [
            ...this.right.instructions,
            instruct('store', { key: this.left.name }),
            instruct('pop'),
        ]
    }
}
