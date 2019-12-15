import { ReflNode, ReflProgram } from './ReflNode';
import { Assembler } from 'myr';

export class ConditionalExpression extends ReflNode {
    constructor(public test: ReflNode, public left: ReflNode, public right?: ReflNode) {
        super();
    }
    get instructions(): ReflProgram {
        return Assembler.if(
            this.test.instructions,
            this.left.instructions,
            (this.right ? this.right.instructions : [])
        )
    }
}