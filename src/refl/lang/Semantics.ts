import Grammar from './Grammar';
import { Semantics, Node } from 'ohm-js';
import { ReflContext } from "../ReflContext";
import { NumberLiteral } from './NumberLiteral';
import { BinaryExpression } from './BinaryExpression';
import { Identifier } from './Identifier';
import { AssignmentExpression } from './AssignmentExpression';
import { FunctionLiteral } from './FunctionLiteral';
import { FunctionInvocation } from './FunctionInvocation';
import { ComparisonExpression } from './ComparisonExpression';
import { ConditionalExpression } from './ConditionalExpression';
import { UnaryExpression } from './UnaryExpression';
import { LogicalExpression } from './LogicalExpression';
import { Program } from './Program';
import chalk from 'chalk';

const semantics: Semantics = Grammar.createSemantics();

const tree = {
    Stmt: (e: Node, _delim: Node) => e.tree,

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

    Conditional_ternary: (
        test: Node, _q: Node, left: Node, _col: Node, right: Node
    ): ConditionalExpression => {
        return new ConditionalExpression(test.tree, left.tree, right.tree);
    },

    Conditional_if_else: (_if: Node, _lp: Node, test: Node, _rp: Node, left: Node, _else: Node, right: Node): ConditionalExpression => {
        return new ConditionalExpression(test.tree, left.tree, right.tree);
    },

    Conditional_if: (_if: Node, _lp: Node, test: Node, _rp: Node, branch: Node): ConditionalExpression => {
        return new ConditionalExpression(test.tree, branch.tree);
    },

    Assignment: (left: Node, _eq: Node, right: Node): AssignmentExpression =>
        new AssignmentExpression(left.tree, right.tree),

    LogExpr_and: (left: Node, _and: Node, right: Node): LogicalExpression =>
        new LogicalExpression('&&', left.tree, right.tree),

    LogExpr_or: (left: Node, _and: Node, right: Node): LogicalExpression =>
        new LogicalExpression('||', left.tree, right.tree),

    LogExpr_not: (_bang: Node, operand: Node): UnaryExpression =>
        new UnaryExpression('!', operand.tree),

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

    PriExpr_neg: (_neg: Node, pri: Node) => {
        return new UnaryExpression('-', pri.tree);
    },
    
    PriExpr_parens: (_lp: Node, pri: Node, _rp: Node) => {
        return new UnaryExpression('()', pri.tree);
    },

    number: (element: Node): NumberLiteral =>
        new NumberLiteral(Number(element.sourceString)),

    ident: (fst: Node, rst: Node): Identifier =>
        new Identifier(fst.sourceString + rst.sourceString),

    NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
        let result = [eFirst.tree, ...eRest.tree];
        return result;
    },

    EmptyListOf: () => { return []; },
}


semantics.addAttribute('tree', tree);

let globalCtx = new ReflContext();
semantics.addOperation('eval', {
    Stmt: (e: Node, _delim: Node) => { return e.eval() },
    Expr: (e: Node) => e.tree.evaluate(globalCtx),
    NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
        let result = [eFirst.eval(), ...eRest.eval()];
        return result;
    },
});

export default semantics;