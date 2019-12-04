import Refl from "./Refl"

describe(Refl, () => {
    let refl: Refl;
    beforeEach(() => { refl = new Refl(); })

    test.todo("comments")

    describe('arithmetic', () => {
        it('adds two numbers', () => {
            expect(refl.interpret('5+6')).toEqual(11)
        })

        it('adds three numbers', () => {
            expect(refl.interpret('5+6+7')).toEqual(18)
            expect(refl.interpret('3+6+9')).toEqual(18)
        })

        it('subtracts one number from another', () => {
            expect(refl.interpret('5-6')).toEqual(-1);
            expect(refl.interpret('9-6')).toEqual(3);
        })

        it('multiplies two numbers', () => {
            expect(refl.interpret('5*5')).toEqual(25);
        })

        it('divides two numbers', () => {
            expect(refl.interpret('100/4')).toEqual(25);
        })

        it('exponentiates', () => {
            expect(refl.interpret('2^8')).toEqual(256)
            expect(refl.interpret('10^3')).toEqual(1000)
        })

        it('orders operations', () => {
            expect(refl.interpret('10+20/2')).toEqual(20);
            expect(refl.interpret('1-100/4+1')).toEqual(-23);
        })

        test.todo("parentheses help ordering")
    })

    describe('variables', () => {
        it('defines', () => {
            expect(refl.interpret('a = 5')).toEqual('a')
            expect(refl.interpret('a * 10')).toEqual(50)
            expect(refl.interpret('b = 12')).toEqual('b')
            expect(refl.interpret('a * b')).toEqual(60)
            expect(refl.interpret('b / 2')).toEqual(6)
            expect(refl.interpret('b ^ 2')).toEqual(144)
        })
    })

    describe('funcalls', () => {
        it('defines and invokes single-arg fns', () => {
            expect(refl.interpret('double = (x) => x * 2')).toEqual('double')
            expect(refl.interpret("double(2)")).toEqual(4)
            expect(refl.interpret("double(7)")).toEqual(14)
            expect(refl.interpret("double(128)")).toEqual(256)
        });

        it('defines and invokes multi-arg fns', () => {
            expect(refl.interpret('pow = (x, y) => x ^ y')).toEqual('pow')
            expect(refl.interpret("pow(2,2)")).toEqual(4)
        });

        it("evaluates positional arguments", () => {
            expect(refl.interpret("a=10")).toEqual('a')
            expect(refl.interpret("double(a)")).toEqual(20)
        })

        it("multi-line functions", () => {
            refl.interpret("pow = (x,y) { x+y; return(x ^ y) }");
            expect(refl.interpret("pow(2,3)")).toEqual(8)
            expect(refl.interpret("pow(2,8)")).toEqual(256)
        })

        xit('closes around known values at definition time', () => {
            expect(refl.interpret("x=123")).toEqual('x')
            expect(refl.interpret('c=()=>x')).toEqual('c')
            expect(refl.interpret('c()')).toEqual(123)
            expect(refl.interpret("x=234")).toEqual('x')
            expect(refl.interpret('c()')).toEqual(123)
            expect(refl.interpret('x')).toEqual(234)
        })

        it('calls builtins', () => {
            refl.interpret('print(123)');
            expect(Refl.tracedOutput).toEqual([123]);
        })
    })

    describe("control flow structures", () => {
        it('comparators', () => {
            expect(refl.interpret('1 > 0')).toEqual(true);
            expect(refl.interpret('0 > 1')).toEqual(false);

            expect(refl.interpret('1 < 0')).toEqual(false);
            expect(refl.interpret('0 < 1')).toEqual(true);

            expect(refl.interpret('1 == 0')).toEqual(false);
            expect(refl.interpret('1 == 1')).toEqual(true);

            expect(refl.interpret('2 >= 1')).toEqual(true);
            expect(refl.interpret('2 >= 2')).toEqual(true);
            expect(refl.interpret('2 >= 3')).toEqual(false);

            expect(refl.interpret('2 <= 1')).toEqual(false);
            expect(refl.interpret('2 <= 2')).toEqual(true);
            expect(refl.interpret('2 <= 3')).toEqual(true);
        });

        it('ternaries', () => {
            refl.interpret('burj=2717') 
            refl.interpret('wt=1776')
            expect(refl.interpret('burj>wt ? 1 : 0')).toEqual(1)
        })

        it("boolean algebra", () => {
            // and - &&
            expect(refl.interpret("true && true")).toEqual(true)
            expect(refl.interpret("true && false")).toEqual(false)
            expect(refl.interpret("false && true")).toEqual(false)
            expect(refl.interpret("false && false")).toEqual(false)

            // or - ||
            expect(refl.interpret("true || true")).toEqual(true)
            expect(refl.interpret("true || false")).toEqual(true)
            expect(refl.interpret("false || true")).toEqual(true)
            expect(refl.interpret("false || false")).toEqual(false)

            // not - !
            expect(refl.interpret("!true")).toEqual(false)
            expect(refl.interpret("!false")).toEqual(true)
            expect(refl.interpret("!!true")).toEqual(true)
            expect(refl.interpret("!!false")).toEqual(false)
        })
    })

    test.todo("string lit")

    test.todo("array lit")

    test.todo("iteration")

    test.todo("ranges")
    // mirror object: tells you what the structure of function is
    // reflection: give me a class by name, instantiate or call fn by string literal
})