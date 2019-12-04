import {assertNever} from 'assert-never';
import Grammar from './Grammar';
import { Semantics, Node } from 'ohm-js';
import { ReflObject } from './ReflObject';
import { ReflInt } from './ReflInt';
import { ReflNode } from './ReflNode';
import { ReflContext } from "./ReflContext";
import { ReflFunction } from './ReflFunction';
import { ReflString } from './ReflString';
const semantics: Semantics = Grammar.createSemantics();

class NumberLiteral extends ReflNode {
    constructor(public value: number) { super(); }
    evaluate(): ReflObject {
        return new ReflInt(this.value);
    }
}

type BinaryOperator = '+' | '-' | '*' | '/' | '^'
class BinaryExpression extends ReflNode {
    constructor(public op: BinaryOperator, public left: ReflNode, public right: ReflNode) { super(); }
    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [ right ]);
    }

    private get operation(): string {
        let message;
        switch (this.op) {
            case '+': message = 'plus'; break;
            case '-': message = 'minus'; break;
            case '*': message = 'times'; break;
            case '/': message = 'div'; break;
            case '^': message = 'pow'; break;
            default: assertNever(this.op);
        }
        return message as string;
    }
}

class Identifier extends ReflNode {
    constructor(public name: string) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        if (ctx.hasDefinition(this.name)) {
            return ctx.retrieve(this.name);
        } else {
            throw new Error(`Undefined identifier ${this.name}`);
        }
    }
}

class AssignmentExpression extends ReflNode {
    constructor(public left: Identifier, public right: ReflNode) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        let slot = this.left.name;
        let value = this.right.evaluate(ctx);
        ctx.assign(slot, value);
        return new ReflString(slot);
    }
}

class FunctionLiteral extends ReflNode {
    constructor(public args: string[], public body: ReflNode) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        // let argNames = this.args.map(arg => arg.name)
        return new ReflFunction(this.args, this.body);
    }
}

semantics.addAttribute('tree', {
    FunArgs: (_lp: Node, argList: Node, _rp: Node): string[] =>  {
        return argList.children.map(c => c.sourceString);
    },

    Defun: (args: Node, _arrow: Node, body: Node): FunctionLiteral =>
      new FunctionLiteral(args.tree, body.tree),

    Assignment: (left: Node, _eq: Node, right: Node): AssignmentExpression =>
      new AssignmentExpression(left.tree, right.tree),

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
    
    ident: (fst: Node, rst: Node): Identifier =>
      new Identifier(fst.sourceString + rst.sourceString),
});

let globalCtx = new ReflContext();
semantics.addOperation('eval', {
    Expr: (e: Node) => e.tree.evaluate(globalCtx),
});

export default semantics;