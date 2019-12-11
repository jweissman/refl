import Grammar from './Grammar';
import { Semantics, Node } from 'ohm-js';
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
import { StringLiteral } from './StringLiteral';
import WhileExpression from './WhileExpression';
import { ClassDefinition } from './ClassDefinition';
import { DotAccess } from './DotAccess';
import { ArrayLiteral } from './ArrayLiteral';
import { ArrayLookup } from './ArrayLookup';

const semantics: Semantics = Grammar.createSemantics();

const tree = {
    Program: (body: Node, _br: Node) => body.tree,
    Expr: (e: Node) => e.tree,

    Defclass: (_class: Node, id: Node, body: Node) => {
        return new AssignmentExpression(id.tree, 
            new ClassDefinition(id.tree, body.tree)
        );
    },

    DotAccess_method: (obj: Node, _dot: Node, message: Node) => {
        return new DotAccess(obj.tree, message.tree);
    },

    DotAccess_property: (obj: Node, _dot: Node, message: Node) => {
        return new DotAccess(obj.tree, message.tree);
    },

    Funcall: (fn: Node, _lp: Node, paramList: Node, _rp: Node): FunctionInvocation => {
        return new FunctionInvocation(fn.tree, paramList.tree);
    },

    FunArgs: (_lp: Node, argList: Node, _rp: Node): string[] => {
        return argList.tree.map((id: Identifier) => id.name);
    },

    Defun: (id: Node, fn: Node) => {
        return new AssignmentExpression(id.tree, fn.tree);
    },

    Lambda_one: (args: Node, _arrow: Node, body: Node): FunctionLiteral =>
        new FunctionLiteral(args.tree, body.tree),

    Lambda_multi: (args: Node, _arrow: Node, block: Node): FunctionLiteral =>
        new FunctionLiteral(args.tree, block.tree),

    Block: (_lb: Node, body: Node, _rb: Node) =>
        new Program(body.tree),

    While: (_while: Node, _lp: Node, test: Node, _rp: Node, block: Node): WhileExpression => {
        return new WhileExpression(test.tree, block.tree)
    },

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

    StringLit: (_lq: Node, content: Node, _rq: Node) => {
        return new StringLiteral(content.sourceString);
    },

    ArrayLit: (_lb: Node, elements: Node, _rb: Node) => {
        return new ArrayLiteral(elements.tree);
    },

    ArrayIndex: (id: Node, _lb: Node, index: Node, _rb: Node) => {
        return new ArrayLookup(id.tree, index.tree);
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
export default semantics;