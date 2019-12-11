import { ReflNode, ReflProgram } from './ReflNode';
import { UnaryOperator } from './UnaryOperator';
import { instruct, MyrNumeric } from 'myr';
export class UnaryExpression extends ReflNode {
    constructor(public unOp: UnaryOperator, public operand: ReflNode) { super(); }
    get instructions(): ReflProgram {
        let strategy: {[key in UnaryOperator]: ReflProgram} = {
            '!': [instruct('not')],
            '-': [
                instruct('dup'),
                instruct('push', {value: new MyrNumeric(2)}),
                instruct('mul'),
                instruct('sub'),
             ], // 'negate',
            '()': [instruct('noop')]
        }
        return [
            ...this.operand.instructions,
            ...strategy[this.unOp],
        ];
    }
}
