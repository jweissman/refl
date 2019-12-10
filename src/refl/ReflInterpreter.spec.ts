import Grammar from './lang/Grammar';
import Semantics from './lang/Semantics';
import { ReflInterpreter } from "./ReflInterpreter";
import { Dict } from "ohm-js";
import { Program } from './lang/Program';
import { ReflNode } from './lang/ReflNode';
import chalk from 'chalk';

const parse = (input: string) => {
    let match = Grammar.match(input.trim());
    if (match.succeeded()) {
        let semanteme: Dict = Semantics(match);
        return semanteme.tree;
    } else {
        throw new Error("syntax error:" + match.shortMessage)
    }
}

let interpreter = new ReflInterpreter();
const evaluate = (input: string) => {
    // console.log(chalk.green("EVALUATE: ") + chalk.yellow(input))
    let program: ReflNode[] = parse(input);
    let result = interpreter.run(program);
    return result; //.toJS()
}

xdescribe(ReflInterpreter, () => {
    describe('arithmetic expressions', () => {
        it('binary operations', () => {
            expect(evaluate('2+2')).toEqual(4);
            expect(evaluate('2+3')).toEqual(5);

            expect(evaluate('5-4')).toEqual(1);
            expect(evaluate('10-12')).toEqual(-2);

            expect(evaluate('3*5')).toEqual(15);
            expect(evaluate('8*8')).toEqual(64);

            expect(evaluate('100/2')).toEqual(50);
            expect(evaluate('9/3')).toEqual(3);

            expect(evaluate('2^8')).toEqual(256);
        });

        it('orders ops', () => {
            expect(evaluate('100/2+5')).toEqual(55);
            expect(evaluate('10+100/2+5')).toEqual(65);
            expect(evaluate('(10+100)/2+5')).toEqual(60);
            expect(evaluate('3*(4+5)-2')).toEqual(25);
        });
    });

    it('stores and loads variables', () => {
        expect(evaluate('a=3;b=5;a+b')).toEqual(8)
        expect(evaluate('a*b')).toEqual(15)
        expect(evaluate('a^b')).toEqual(243)
    })

    it('calls simple function definitions', () => {
        expect(evaluate('square = (x) => { x * x }; square(4)')).toEqual(16);
        expect(evaluate('mult = (x,y) => { x * y }; mult(8,8)')).toEqual(64);
        expect(evaluate('pow = (x,y) => { x ^ y }; pow(2,8)')).toEqual(256);
        expect(evaluate('a=()=>{4}; b=()=>{a()}; b()')).toEqual(4);
    })

    it("comparators", () => {
        expect(evaluate("1 > 0")).toEqual(true);
        expect(evaluate("1 > 1")).toEqual(false);
        expect(evaluate("0 > 1")).toEqual(false);

        expect(evaluate("0 < 1")).toEqual(true);
        expect(evaluate("1 < 0")).toEqual(false);
        expect(evaluate("1 < 1")).toEqual(false);

        expect(evaluate("1 == 1")).toEqual(true);
        expect(evaluate("1 == 0")).toEqual(false);
        expect(evaluate("0 == 1")).toEqual(false);
        expect(evaluate("0 == 0")).toEqual(true);
    })

    describe('conditionals', () => {
        it('ternaries', () => {
            expect(evaluate("a=5; b=10; a > b ? 0 : 100")).toEqual(100)
            expect(evaluate("a=5; b=10; a < b ? 0 : 100")).toEqual(0)
            // expect(evaluate("a=10; b=10; a == b ? 0 : 100")).toEqual(0)
        })
    })

    test.todo('boolean algebra')
    test.todo("iteration")
    test.todo("control flow")

    // ..
    // xit('defines and calls functions', () => {
    //     expect(evaluate('fn=()=>{print(1)}')).toEqual("fn")
    // })

    /**
     *   .anon:
     *      push 1
     *      call_builtin 'print'
     * 
     *   .main:
     *      push &.anon  # what is the line is anon is on?
     *      store "fn"
     */
});