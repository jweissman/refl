import Refl from "./Refl"

describe(Refl, () => {
    let refl: Refl;
    beforeEach(() => {
        Refl.tracedOutput = [];
        refl = new Refl();
    })

    describe("comments", () => {
        it('ignores anything after an octothorpe (#)', () => {
            expect(refl.interpret("1+2 # +3-4")).toEqual(3)
            expect(refl.interpret("1+ # +3-4\n5")).toEqual(6)
        })
    })

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

        it("negative numbers", () => {
            expect(refl.interpret("-3")).toEqual(-3)
            expect(refl.interpret("10+-1")).toEqual(9)
        })

        it("parentheses help ordering", () => {
            expect(refl.interpret("3*(2+1)")).toEqual(9)
            expect(refl.interpret("(2-1)*5")).toEqual(5)
        })
    })

    describe('variables', () => {
        it('defines', () => {
            refl.interpret('a = 5') //#).toEqual('a')
            expect(refl.interpret('a * 10')).toEqual(50)
            refl.interpret('b = 12') //).toEqual('b')
            expect(refl.interpret('a * b')).toEqual(60)
            expect(refl.interpret('b / 2')).toEqual(6)
            expect(refl.interpret('b ^ 2')).toEqual(144)
        })
    })

    describe('funcalls', () => {
        it('defines and invokes single-arg fns', () => {
            refl.interpret('double = (x) => x * 2') //).toEqual('double')
            expect(refl.interpret("double(2)")).toEqual(4)
            expect(refl.interpret("double(7)")).toEqual(14)
            expect(refl.interpret("double(128)")).toEqual(256)
        });

        it('defines and invokes multi-arg fns', () => {
            refl.interpret('pow = (x, y) => x ^ y') //).toEqual('pow')
            expect(refl.interpret("pow(2,2)")).toEqual(4)
        });

        it("evaluates positional arguments", () => {
            refl.interpret('double = (x) => x * 2') //).toEqual('double')
            refl.interpret("a=10") //).toEqual('a')
            expect(refl.interpret("double(a)")).toEqual(20)
        })

        it("multi-line functions", () => {
            refl.interpret("pow = (x,y) { x+y; return(x ^ y) }");
            expect(refl.interpret("pow(2,3)")).toEqual(8)
            expect(refl.interpret("pow(2,8)")).toEqual(256)
        })

        xit('higher order functions', () => {
            refl.interpret("twice=(f)=>(x)=>f(f(x))")
            refl.interpret("double=(x)=>x*2")
            refl.interpret("quadruple=twice(double)")
            expect(refl.interpret("quadruple(5)")).toEqual(20)
            expect(refl.interpret("quadruple(24)")).toEqual(92)
        })

        xit('closes around known values at definition time', () => {
            refl.interpret("x=123") //).toEqual('x')
            refl.interpret('c=()=>x') //).toEqual('c')
            expect(refl.interpret('c()')).toEqual(123)
            refl.interpret("x=234") //).toEqual('x')
            expect(refl.interpret('c()')).toEqual(123)
            expect(refl.interpret('x')).toEqual(234)
        })

        it('calls builtins', () => {
            Refl.tracedOutput = []
            refl.interpret('print(123)');
            expect(Refl.tracedOutput).toEqual([123]);

            Refl.tracedOutput = []
            refl.interpret('print(1,2,3)');
            expect(Refl.tracedOutput).toEqual([1,2,3]);
        })
    })

    describe("control flow structures", () => {
        it('strict comparators', () => {
            expect(refl.interpret('1 > 0')).toEqual(true);
            expect(refl.interpret('0 > 1')).toEqual(false);

            expect(refl.interpret('1 < 0')).toEqual(false);
            expect(refl.interpret('0 < 1')).toEqual(true);

            expect(refl.interpret('1 == 0')).toEqual(false);
            expect(refl.interpret('1 == 1')).toEqual(true);
        });

        xit('loose comparators', () => {
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

        describe('conditionals with if/else', () => {
            it('given test is positive, activates the left branch', () => {
                refl.interpret('if (1>0) { print(1); } else { print(-1); }')
                expect(Refl.tracedOutput).toEqual([1]);
            });

            it('given test is negative, activates the right branch', () => {
                refl.interpret('if (1<0) { print(1); } else { print(-1); }')
                expect(Refl.tracedOutput).toEqual([-1]);
            });
        });

        describe('conditions with only if', () => {
            it('given test is positive, activates the branch', () => {
                refl.interpret('if (1>0) { print(1); }')
                expect(Refl.tracedOutput).toEqual([1]);
            });

            it('given test is negative, activates the right branch', () => {
                refl.interpret('if (0>1) { print(1); }')
                expect(Refl.tracedOutput).toEqual([]);
            });
        })

        test.todo('conditionals with unless/else')

        describe("boolean algebra", () => {
            it('true/false', () => {
                expect(refl.interpret("true")).toEqual(true)
                expect(refl.interpret("false")).toEqual(false)
            })

            it('and', () => {
                expect(refl.interpret("true && true")).toEqual(true)
                expect(refl.interpret("true && false")).toEqual(false)
                expect(refl.interpret("false && true")).toEqual(false)
                expect(refl.interpret("false && false")).toEqual(false)
            });

            // or - ||
            it('or', () => {
                expect(refl.interpret("true || true")).toEqual(true)
                expect(refl.interpret("true || false")).toEqual(true)
                expect(refl.interpret("false || true")).toEqual(true)
                expect(refl.interpret("false || false")).toEqual(false)
            });

            // not - !
            it('not', () => {
                expect(refl.interpret("!true")).toEqual(false)
                expect(refl.interpret("!false")).toEqual(true)
                expect(refl.interpret("!!true")).toEqual(true)
                expect(refl.interpret("!!false")).toEqual(false)
            });
        })

        it('recursion', () => {
            refl.interpret("fib=(n)=>n<3?1:fib(n-1)+fib(n-2)")
            expect(refl.interpret("fib(1)")).toEqual(1)
            expect(refl.interpret("fib(2)")).toEqual(1)
            expect(refl.interpret("fib(3)")).toEqual(2)
            expect(refl.interpret("fib(4)")).toEqual(3)
            expect(refl.interpret("fib(5)")).toEqual(5)
            expect(refl.interpret("fib(6)")).toEqual(8)
        })

        test.todo('iteration with while/until')
        test.todo('iteration with for')
    })

    test.todo("string lit")

    test.todo("array lit")

    test.todo("iteration")

    test.todo("ranges")

    test.todo("mirrors")
    // mirror object: tells you what the structure of function is
    // reflection: give me a class by name, instantiate or call fn by string literal
})