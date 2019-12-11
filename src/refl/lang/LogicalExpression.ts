import { ReflNode, ReflProgram } from './ReflNode';
import { LogicalOperator } from './LogicalOperator';
import { instruct } from 'myr';

export class LogicalExpression extends ReflNode {
    constructor(public logOp: LogicalOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        let strategy: { [key in LogicalOperator]: ReflProgram } = {
            '&&': [instruct('and')],
            '||': [instruct('or')],
        }
        return [
            ...this.left.instructions,
            ...this.right.instructions,
            ...strategy[this.logOp],
        ];

    }
}
