import { assertNever } from 'assert-never';
import { OpCode, instruct } from 'myr';
import { ReflNode, ReflProgram } from './ReflNode';
import { BinaryOperator } from './BinaryOperator';

export class BinaryExpression extends ReflNode {
    constructor(public op: BinaryOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        let opMap: { [key in BinaryOperator]: OpCode } = {
            '+': 'add',
            '-': 'sub',
            '*': 'mul',
            '/': 'div', 
            '^': 'pow'
        }
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            instruct(opMap[this.op]),
        ]
    }
}
