import { assertNever } from 'assert-never';
import { ReflNode, ReflProgram } from './ReflNode';
import { ComparatorOp } from './ComparatorOp';
import { instruct, OpCode } from 'myr';
import { Program } from './Program';

export class ComparisonExpression extends ReflNode {
    constructor(public cmpOp: ComparatorOp, public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        // let compare = instruct(`cmp_${this.operation}` as OpCode);
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            ...this.compare,
        ]
    }

    protected get compare(): ReflProgram { 
        // let message = this.operation;
        return [instruct('send_call', { key: this.cmpOp })]
    }

    // protected get operation(): string {
    //     let message;
    //     switch (this.cmpOp) {
    //         case '>':
    //             message = 'gt';
    //             break;
    //         case '<':
    //             message = 'lt';
    //             break;
    //         case '==':
    //             message = 'eq';
    //             break;
    //         case '!=':
    //             message = 'neq';
    //             break;
    //         case '>=':
    //             message = 'gte';
    //             break;
    //         case '<=':
    //             message = 'lte';
    //             break;
    //         default: assertNever(this.cmpOp);
    //     }
    //     return message as string;
    // }
}

export class StackComparison extends ComparisonExpression {
    constructor(public cmpOp: ComparatorOp, public left: ReflNode) {
        super(cmpOp, left, new Program([]));
    }

    get instructions(): ReflProgram {
        // let compare = instruct(`cmp_${this.operation}` as OpCode);
        return [
            ...this.left.instructions,
            // ...this.right.instructions, // assume right is on the stack...
            ...this.compare,
        ]
    }
}