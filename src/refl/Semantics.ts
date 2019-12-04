import {assertNever} from 'assert-never';
import Grammar from './Grammar';
import { Semantics, Node } from 'ohm-js';
import { ReflObject } from './ReflObject';
import { ReflInt } from './ReflInt';
const semantics: Semantics = Grammar.createSemantics();

abstract class ReflNode {
    abstract evaluate(): ReflObject;
}

class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }
    evaluate(): ReflObject {
        return new ReflInt(this.value);
    }
}

type BinaryOperator = '+' | '-' | '*' | '/' | '^'
class BinaryExpression extends ReflNode {
    constructor(public op: BinaryOperator, public left: ReflNode, public right: ReflNode) {
        super();
    }

    evaluate(): ReflObject {
        let message = null;
        switch (this.op) {
            case '+': message = 'plus'; break;
            case '-': message = 'minus'; break;
            case '*': message = 'times'; break;
            case '/': message = 'div'; break;
            case '^': message = 'pow'; break;
            default: assertNever(this.op);
        }
        let left = this.left.evaluate();
        let right = this.right.evaluate();
        // console.debug("BinaryExpression.evaluate", { message, left, right })
        return left.send(message as string, [ right ]);
    }
}

semantics.addAttribute('tree', {
    ExpExpr_power: (left: Node, _add: Node, right: Node): BinaryExpression =>
      new BinaryExpression('^', left.tree, right.tree),

    MultExpr_quotient: (left: Node, _add: Node, right: Node): BinaryExpression =>
      new BinaryExpression('/', left.tree, right.tree),

    MultExpr_product: (left: Node, _add: Node, right: Node): BinaryExpression =>
      new BinaryExpression('*', left.tree, right.tree),

    AddExpr_sum: (left: Node, _add: Node, right: Node): BinaryExpression =>
      new BinaryExpression('+', left.tree, right.tree),

    AddExpr_difference: (left: Node, _add: Node, right: Node): BinaryExpression =>
      new BinaryExpression('-', left.tree, right.tree),

    number: (element: Node): NumberLiteral =>
      new NumberLiteral(Number(element.sourceString)),
});

semantics.addOperation('eval', {
    Expr: (e: Node) => e.tree.evaluate()
});

export default semantics;