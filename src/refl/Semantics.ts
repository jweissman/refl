import {assertNever} from 'assert-never';
import Grammar from './Grammar';
import { Semantics, Node } from 'ohm-js';
import { ReflObject } from './core/ReflObject';
import { ReflNode } from './ReflNode';
import { ReflContext } from "./ReflContext";
import { ReflFunction } from './core/ReflFunction';
import { ReflString } from './core/ReflString';
import Refl from './Refl';
import { ReflNil } from './core/ReflNil';
import { NumberLiteral } from './NumberLiteral';
import ReflReturn from './core/ReflReturn';
const semantics: Semantics = Grammar.createSemantics();

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
        return new ReflFunction(this.args, this.body);
    }
}

class FunctionInvocation extends ReflNode {
    constructor(public id: Identifier, public paramList: ReflNode[]) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        // console.log("FunctionInvocation#eval")
        let fnName = this.id.name;
        let params = this.paramList.map(param => param.evaluate(ctx));
        let builtin = Refl.builtins[fnName]
        if (builtin) {
            return builtin(...params);
        } else {
            let fn = ctx.retrieve(this.id.name);
            let fnCtx = ctx.clone();
            let formalArguments = fn.args.map((e: string, i: number) => [e, params[i]]);
            debugger;
            formalArguments.forEach(([arg, param]: [string, ReflObject]) => {
                fnCtx.assign(arg, param);
            });
            debugger;
            return fn.body.evaluate(fnCtx)
        }
    }
}

type ComparatorOp = '>' | '<' | '==' | '<=' | '>='
class ComparisonExpression extends ReflNode {
    constructor(
        public cmpOp: ComparatorOp,
        public left: ReflObject,
        public right: ReflObject
    ) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [ right ]);
    }

    private get operation(): string {
        let message;
        switch (this.cmpOp) {
            case '>': message = 'gt'; break;
            case '<': message = 'lt'; break;
            case '==': message = 'eq'; break;
            case '>=': message = 'gte'; break;
            case '<=': message = 'lte'; break;
            default: assertNever(this.cmpOp);
        }
        return message as string;
    }
}

class ConditionalExpression extends ReflNode {
    constructor(public test: ReflNode, public left: ReflNode, public right: ReflNode) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        if (this.test.evaluate(ctx).value === true) {
            return this.left.evaluate(ctx);
        } else {
            return this.right.evaluate(ctx);
        }
    }
}

type UnaryOperator = '!'
class UnaryExpression extends ReflNode {
    constructor(public unOp: UnaryOperator, public operand: ReflNode) { super();}
    evaluate(ctx: ReflContext): ReflObject {
        return this.operand.evaluate(ctx).send(this.operation, [])
    }

    private get operation(): string {
        let message;
        switch (this.unOp) {
            case '!': message = 'not'; break;
            default: assertNever(this.unOp);
        }
        return message as string;
    }
}

type LogicalOperator = '&&' | '||'
class LogicalExpression extends ReflNode {
    constructor(
        public logOp: LogicalOperator,
        public left: ReflNode,
        public right: ReflNode
    ) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        let left = this.left.evaluate(ctx);
        let right = this.right.evaluate(ctx);
        return left.send(this.operation, [ right ]);
    }

    private get operation(): string {
        let message;
        switch (this.logOp) {
            case '&&': message = 'and'; break;
            case '||': message = 'or'; break;
            default: assertNever(this.logOp);
        }
        return message as string;
    }
}

class Program extends ReflNode {
    constructor(public lines: ReflNode[]) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        let result = null;
        for (const line of this.lines) {
            result = line.evaluate(ctx);
            if (result instanceof ReflReturn) {
                return result.wrapped;
            } 
        }
        return result || new ReflNil();
    }
}

semantics.addAttribute('tree', {
    Funcall: (fn: Node, _lp: Node, paramList: Node, _rp: Node): FunctionInvocation => {
        return new FunctionInvocation(fn.tree, paramList.tree);
    },

    FunArgs: (_lp: Node, argList: Node, _rp: Node): string[] => {
        return argList.tree.map((id: Identifier) => id.name);
    },

    Defun_one: (args: Node, _arrow: Node, body: Node): FunctionLiteral =>
        new FunctionLiteral(args.tree, body.tree),

    Defun_multi: (args: Node, block: Node): FunctionLiteral =>
        new FunctionLiteral(args.tree, block.tree),

    Block: (_lb: Node, body: Node, _rb: Node) =>
        new Program(body.tree),

    Conditional: (
        test: Node, _q: Node, left: Node, _col: Node, right: Node
    ): ConditionalExpression => {
        return new ConditionalExpression(test.tree, left.tree, right.tree);
    },

    Assignment: (left: Node, _eq: Node, right: Node): AssignmentExpression =>
        new AssignmentExpression(left.tree, right.tree),

    LogExpr_and: (left: Node, _and: Node, right: Node): LogicalExpression =>
        new LogicalExpression('&&', left.tree, right.tree),

    LogExpr_or: (left: Node, _and: Node, right: Node): LogicalExpression =>
        new LogicalExpression('||', left.tree, right.tree),

    LogExpr_not: (_bang: Node, operand: Node): UnaryExpression =>
        new UnaryExpression('!', operand.tree),
        // new LogicalExpression('!', left.tree, right.tree),

    CmpExpr_eq: (left: Node, _gt: Node, right: Node): ComparisonExpression =>
        new ComparisonExpression('==', left.tree, right.tree),

    CmpExpr_gt: (left: Node, _gt: Node, right: Node): ComparisonExpression =>
        new ComparisonExpression('>', left.tree, right.tree),

    CmpExpr_gte: (left: Node, _gt: Node, right: Node): ComparisonExpression =>
        new ComparisonExpression('>=', left.tree, right.tree),

    CmpExpr_lt: (left: Node, _gt: Node, right: Node): ComparisonExpression =>
        new ComparisonExpression('<', left.tree, right.tree),

    CmpExpr_lte: (left: Node, _gt: Node, right: Node): ComparisonExpression =>
        new ComparisonExpression('<=', left.tree, right.tree),

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

    NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
        let result = [eFirst.tree, ...eRest.tree];
        return result;
    },

    EmptyListOf: () => { return []; },
});

let globalCtx = new ReflContext();
semantics.addOperation('eval', {
    Expr: (e: Node) => e.tree.evaluate(globalCtx),
    NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
        let result = [eFirst.eval(), ...eRest.eval()];
        return result;
    },
});

export default semantics;