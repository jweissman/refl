import { ReflNode, ReflProgram } from './ReflNode';
import { LogicalOperator } from './LogicalOperator';
import { Assembler, instruct } from 'myr';
import { StackComparison } from './ComparisonExpression';
import { ComparatorOp } from './ComparatorOp';
import { Identifier } from './Identifier';

export class LogicalExpression extends ReflNode {
    constructor(public logOp: LogicalOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    // static lefts: number = 0;
    get instructions(): ReflProgram {
        let op: { [key in LogicalOperator]: ComparatorOp } = {
            '&&': '!=',
            '||': '=='
        }
        let compare = new StackComparison(op[this.logOp], new Identifier('true'));
        let key = '.left'; //`.left-${LogicalExpression.lefts++}`
        return [
            ...this.left.instructions,
            instruct('store', { key }),
            instruct('load', { key }),
            ...Assembler.if(compare.instructions,
                [instruct('load', { key })],
                this.right.instructions
            ),
        ];
    }
}
