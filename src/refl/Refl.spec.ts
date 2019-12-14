import Refl from "./Refl"

describe(Refl, () => {
    let refl: Refl;
    beforeEach(() => {
        Refl.tracedOutput = [];
        refl = new Refl();
        Refl.suppressOutput = true;
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
            refl.interpret("pow = (x,y) { x+y; return(x ^ y); }");
            expect(refl.interpret("pow(2,3)")).toEqual(8)
            expect(refl.interpret("pow(2,8)")).toEqual(256)
        })

        it('higher order functions', () => {
            // okay, this needs to create a closure...?
            refl.interpret("twice=(f)=>(x)=>f(f(x))")
            refl.interpret("double=(x)=>x*2")
            refl.interpret("quadruple=twice(double)")
            expect(refl.interpret("quadruple(5)")).toEqual(20)
            expect(refl.interpret("quadruple(24)")).toEqual(96)
            expect(refl.interpret("twice((x)=>x*2)(2)")).toEqual(8)
        })

        it('closes around known values at definition time', () => {
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

            expect(refl.interpret('1 != 0')).toEqual(true);
            expect(refl.interpret('1 != 1')).toEqual(false);
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

            it('given test is true executes', () => {
                refl.interpret('if (true) { print(1); }')
                expect(Refl.tracedOutput).toEqual([1]);
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
            expect(refl.interpret("fib(7)")).toEqual(13)
            expect(refl.interpret("fib(8)")).toEqual(21)

            refl.interpret("fact=(n)=>n<2?1:n*fact(n-1)")
            expect(refl.interpret("fact(5)")).toEqual(120)
            expect(refl.interpret("fact(7)")).toEqual(5040)
        })

        describe('iteration', () => {
            it('with while', () => {
                refl.interpret("i=1; while (i<4) { print(i); i=i+1 }")
                expect(Refl.tracedOutput).toEqual([1, 2, 3])
            })

            test.todo('with until')
            test.todo('with for')
            test.todo('with upto/downto')
        });
    })

    describe("string lit", () => {
        it("single quote", () => {
            refl.interpret("subj='world'")
            refl.interpret("print('hello ' + subj)")
            expect(Refl.tracedOutput).toEqual(['hello world']);
        });

        it("double quote", () => {
            refl.interpret("subj=\"user\"")
            refl.interpret("print('hello ' + subj)")
            expect(Refl.tracedOutput).toEqual(['hello user']);
        });
    })

    it("formal fns", () => {
        refl.interpret("three() { 3 }")
        expect(refl.interpret("three()")).toEqual(3)
    })

    it("array lit", () => {
        refl.interpret('a=[10,20,30]');
        expect(refl.interpret('a')).toEqual([10,20,30])
        expect(refl.interpret('a[0]')).toEqual(10)
        expect(refl.interpret('a[1]')).toEqual(20)
        expect(refl.interpret('a[2]')).toEqual(30)
        expect(refl.interpret('a[3]')).toEqual("nil") //toThrow("array index out of bounds")
        refl.interpret('a[2]=-1'); 
        expect(refl.interpret('a')).toEqual([10,20,-1])
    });

    it('array manip', () => {
        refl.interpret('g=()=>[10,20,30]');
        expect(refl.interpret('g()[2]')).toEqual(30)
        refl.interpret('print(g()[2])')
        expect(Refl.tracedOutput).toEqual([30])
    })

    it('returning array index does not trash the stack', () => {
        refl.interpret('arr=[1,2,3,4]')
        refl.interpret('set=(i)=>{arr[i]=5;arr[i]}')
        expect(refl.interpret("set(4)")).toEqual(5)
        expect(refl.interpret("arr")).toEqual([1,2,3,4,5])
        expect(refl.interpreter.machine.stack.length).toEqual(0)
    })

    it("associative arrays", () => {
        refl.interpret("user={name:'John', age:21, scores: [88, 94, 87, 78, 85, 92]}")
        expect(refl.interpret("user.name")).toEqual("John")
        expect(refl.interpret("user.age")).toEqual(21)
        expect(refl.interpret("user.scores")).toEqual([88, 94, 87, 78, 85, 92])
    })

    it('hash manip', () => {
        refl.interpret("match={one: 'Bob', two: 'Fiona'}")
        refl.interpret("match.one = 'Tom'")
        expect(refl.interpret("match.one")).toEqual("Tom")
        expect(refl.interpret("match")).toEqual({ one: "Tom", two: "Fiona"})
    })

    it('hashes accept fns', () => {
        refl.interpret("math={double:(x)=>x*2,exp:(x,y)=>x^y}")
        expect(refl.interpret("math.double(8)")).toEqual(16)
        expect(refl.interpret("math.exp(2,8)")).toEqual(256)
    });

    it('treat hash function members treat as values', () => {
        refl.interpret("math={double:(x)=>x*2,exp:(x,y)=>x^y}")
        expect(refl.interpret("math.double")).toMatch("MyrFunction")
        expect(refl.interpret("math.exp")).toMatch("MyrFunction")
    })

    describe("classes", () => {
        it('construct keeps a clear stack', () => {
            refl.interpret("class Zap { print('laser sound') }")
            refl.interpret("zap = Zap.new")
            expect(refl.interpreter.machine.stack.length).toEqual(0)

            refl.interpret("class Bam { initialize() { 2+2; 3+4; 5+8 }}")
            refl.interpret("bam = Bam.new")
            expect(refl.interpreter.machine.stack.length).toEqual(0)
        })

        it('calls niladic member methods', () => {
            refl.interpret('class Baz { bar() { "foo" }}');
            expect(refl.interpret("Baz.new().bar()")).toEqual("foo")
            // should work as bareword too
            expect(refl.interpret("Baz.new().bar")).toMatch("MyrFunction")
        });

        it('calls member methods with params', () => {
            refl.interpret(`
              class Greeter {
                  hello(subj) { print('hi, ' + subj); }
              }
            `)
            expect(refl.interpret("Greeter")).toEqual("MyrClass[Greeter]")
            refl.interpret("g = Greeter.new()")
            // expect(refl.interpret("g = Greeter.new")).toBeInstanceOf(MyrObject)
            // refl.interpret("print(g)")
            expect(refl.interpret("g.hello('user')")).toEqual("hi, user")
            expect(refl.interpret("g.hello('world')")).toEqual("hi, world")
        });

        // remembers values...
        it("member variables", () => {
            refl.interpret(`
              class Counter {
                  value = 0
                  inc() { self.value = self.value + 1 }
              }
            `)
            refl.interpret("a = Counter.new()")
            refl.interpret("b = Counter.new()")

            expect(refl.interpret("a.value")).toEqual(0)
            expect(refl.interpret("b.value")).toEqual(0)
            refl.interpret("a.inc()")
            expect(refl.interpret("a.value")).toEqual(1)
            expect(refl.interpret("b.value")).toEqual(0)
            refl.interpret("a.inc()")
            expect(refl.interpret("a.value")).toEqual(2)
            expect(refl.interpret("b.value")).toEqual(0)
            refl.interpret("b.inc()")
            expect(refl.interpret("a.value")).toEqual(2)
            expect(refl.interpret("b.value")).toEqual(1)
        })

        it('initializes', () => {
            refl.interpret(`
              class Car {
                  initialize(make, model, year) {
                      self.make = make
                      self.model = model
                      self.year = year
                  }
              }
            `)

            refl.interpret('aerio = Car.new("Suzuki", "Aerio", 2005)');
            refl.interpret('stinger = Car.new("Kia", "Stinger", 2019)');
            refl.interpret('porsche = Car.new("Porsche", "911", 1963)');
            refl.interpret('cybertruck = Car.new("Tesla", "Cybertruck", 3001)');

            expect(refl.interpret('aerio.make')).toEqual("Suzuki")
            expect(refl.interpret('aerio.model')).toEqual("Aerio")
            expect(refl.interpret('aerio.year')).toEqual(2005)

            expect(refl.interpret('stinger.make')).toEqual("Kia")
            expect(refl.interpret('stinger.model')).toEqual("Stinger")
            expect(refl.interpret('stinger.year')).toEqual(2019)

            expect(refl.interpret('porsche.make')).toEqual("Porsche")
            expect(refl.interpret('porsche.model')).toEqual("911")
            expect(refl.interpret('porsche.year')).toEqual(1963)

            expect(refl.interpret('cybertruck.make')).toEqual("Tesla")
            expect(refl.interpret('cybertruck.model')).toEqual("Cybertruck")
            expect(refl.interpret('cybertruck.year')).toEqual(3001)
            refl.interpret('cybertruck.year = 10000')
            expect(refl.interpret('cybertruck.year')).toEqual(10000)

            expect(refl.interpreter.machine.stack.length).toEqual(0)
        });

        // can ask what class this is
        it("introspection", () => {
            refl.interpret(`class Food {
                initialize(name, calories) {
                    self.name = name; self.calories = calories;
                }
            }`)
            refl.interpret("pasta = Food.new('Spaghetti', 680)");
            expect(refl.interpret('pasta.class')).toEqual("MyrClass[Food]")
            expect(refl.interpret('pasta.class.name')).toEqual("Food")
        })

        test.todo("class statics") // can def methods on Class instance
        test.todo("inheritance") // has ancestors
        // test.todo("refinement") // has eigenclass
    })

    describe("scope", () => {
        // this is pretty important for general programming :D
        it('can mutate global vars from inside a function', () => {
            refl.interpret(`
              arr=[1,2,3,4,5]
              set=(x,i)=>arr[i]=x
              set(10,0)
              set(20,1)
              set(30,2)
            `)
            expect(refl.interpret('arr')).toEqual([10,20,30,4,5])
        })
    })


    test.todo("ranges")

    test.todo("superclasses")
    test.todo("eigenclasses")
    test.todo("modules")
    test.todo("traits")

    test.todo("mirrors")
    // mirror object: tells you what the structure of function is
    // reflection: give me a class by name, instantiate or call fn by string literal

    test.todo("continuations")
    test.todo("pattern matching")

    test.todo("regex lits")

    describe('end-to-end', () => {
        it('fibonacci memo', () => {
            refl.interpret(`# fib.refl
            fmemo = []
            fib = (x) => x<2 ? 1 : fibm(x-1) + fibm(x-2);
            fibm(x){
                if(fmemo[x]==nil){
                    fmemo[x]=fib(x)
                };
                return(fmemo[x]);
            }
            max = 85;
            fib(max)
            print(fmemo)`)
            expect(Refl.tracedOutput).toEqual([[1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765,10946,17711,28657,46368,75025,121393,196418,317811,514229,832040,1346269,2178309,3524578,5702887,9227465,14930352,24157817,39088169,63245986,102334155,165580141,267914296,433494437,701408733,1134903170,1836311903,2971215073,4807526976,7778742049,12586269025,20365011074,32951280099,53316291173,86267571272,139583862445,225851433717,365435296162,591286729879,956722026041,1548008755920,2504730781961,4052739537881,6557470319842,10610209857723,17167680177565,27777890035288,44945570212853,72723460248141,117669030460994,190392490709135,308061521170129,498454011879264,806515533049393,1304969544928657,2111485077978050,3416454622906707,5527939700884757,8944394323791464,14472334024676220,23416728348467684,37889062373143900,61305790721611580,99194853094755490,160500643816367070,259695496911122560]])
        })

        it('tree', () => {
            refl.interpret(`# tree.refl
            class Node {
                initialize(label,left,right) {
                    self.label = label;
                    self.left = left;
                    self.right = right;
                }
            
                visit(fn) {
                    fn(self);
                    if (self.left != nil) {
                      self.left.visit(fn);
                    }
                    if (self.right != nil) {
                      self.right.visit(fn);
                    }
                }
            }

            one = Node.new("one",nil,nil)
            three = Node.new("three",nil,nil)
            two = Node.new("two",three,nil)
            root = Node.new("root",one, two)
            root.visit((node) => print(node.label))`)
            expect(Refl.tracedOutput).toEqual(["root","one","two","three"])
        })
    })
})