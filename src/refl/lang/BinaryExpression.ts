import { instruct } from 'myr';
import { ReflNode, ReflProgram } from './ReflNode';
import { BinaryOperator } from './BinaryOperator';

export class BinaryExpression extends ReflNode {
    constructor(public op: BinaryOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            instruct('send_call', { key: this.op as string })
            // instruct(opMap[this.op]),
        ]
    }
}
