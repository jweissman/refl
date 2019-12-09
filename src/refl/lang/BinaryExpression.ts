import { assertNever } from 'assert-never';
import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import { BinaryOperator } from './BinaryOperator';
import { OpCode, Instruction, instruct } from 'myr';

// import { Instruction, ReflInstruction, OpCode } from '../ReflInterpreter';
export class BinaryExpression extends ReflNode {
    constructor(public op: BinaryOperator, public left: ReflNode, public right: ReflNode) { super(); }

    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [right]);
    }

    prelude() { return []; }
    get instructions(): ReflProgram {
        let opMap: { [key: string]: OpCode } = {
            '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', 
            // todo test exponentiation
            '^': 'pow'
        }
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            instruct(opMap[this.op]),
            // pop the operands, leaving the result?
            // instruct('swap'),
            // instruct('pop'),
            // instruct('swap'),
            // instruct('pop'),
        ]
    }

    private get operation(): string {
        let message;
        switch (this.op) {
            case '+':
                message = 'plus';
                break;
            case '-':
                message = 'minus';
                break;
            case '*':
                message = 'times';
                break;
            case '/':
                message = 'div';
                break;
            case '^':
                message = 'pow';
                break;
            default: assertNever(this.op);
        }
        return message as string;
    }
}
