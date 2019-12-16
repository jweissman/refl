import { classClass, Assembler, instruct, MyrObject, MyrBoolean, MyrClass, MyrString } from "myr";
import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { AssignmentExpression } from "./AssignmentExpression";
import { Program } from "./Program";
import { FunctionLiteral } from "./FunctionLiteral";
import { ComparisonExpression } from "./ComparisonExpression";


let classCount = 0;

class ConstructObject extends ReflNode {
    constructor(private name: string, private className?: string) {
        super();
    }

    get instructions(): ReflProgram {

        return [
            // ...(this.className
            instruct('construct', { key: this.className }),
                // instruct('construct'),
            // ),
            instruct('store', { key: this.name }),
            instruct('pop'),
            ...(this.className ? [
                instruct('load', { key: this.name }),
                instruct('load', { key: this.className }),
                instruct('send_eq', { key: 'class' }),
            ] : []),
            instruct('mark'), // tombstone for construct
        ]
    }
}

class LoadObject extends ReflNode {
    constructor(
        private name: string,
        private ctorArgs: string[] = [],
        private callInit: boolean = false,
    ) {
        super();
    }

    get instructions(): ReflProgram {
        let loadCtorArgs = 
            this.ctorArgs.map(arg => instruct('load', { key: arg}));
        return [
            instruct('sweep'), // cleanup (if there was anything left over from construct) 
            ...(this.callInit ? [
                instruct('mark'), // insert tombstone
                ...loadCtorArgs,
                instruct('load', { key: this.name }),
                instruct('send_call', { key: 'initialize' }),
                instruct('sweep'), // pop until tombstone
            ] : []),
            instruct('load', { key: this.name }),
        ]
    }
}

class SelfAssignment extends AssignmentExpression {
    constructor(private name: string, public left: ReflNode, public right: ReflNode) {
        super(left, right);
    }

    get instructions(): ReflProgram {
        let name = (this.left as Identifier).name;
        return [
            instruct('load', { key: this.name }),
            ...this.right.instructions,
            instruct('send_eq', { key: name }),
        ]
    }
}

export class ClassDefinition extends ReflNode {

    hasInitializer: boolean = false
    ctorArgs: string[] = []
    constructor(public id: Identifier, public body: Program) {
        super();
    }

    get instructions(): ReflProgram {
        let key = this.id.name;
        // console.log("instructions for class " + key)
        let klass = new MyrClass(key);

        let autoconstruct = this.autoconstruct;
        let instantiate = this.instantiate;

        let muPrime = (new Program([
                new ConstructObject("mu-prime"),
                ...autoconstruct,
                new LoadObject("mu-prime", [], false),
            ]))
        let label = `${key}-definition[${classCount++}]`
        return [
            instruct('exists', { key }),
            instruct('push', { value: new MyrBoolean(true) }),
            instruct('cmp'),
            instruct('jump_if_zero', { target: label }),
            // instruct('pop'),

            // define class obj
            instruct('push', { value: klass }),
            instruct('store', { key }),

            // .jsMethods
            // instruct('load', { })

            // .class
            instruct('push', { value: classClass }),
            instruct('send_eq', { key: 'class' }),

            instruct('noop', { label }),
            // instruct('load', { key }),
            instruct('pop'),

            // .new
            instruct('load', { key }),
            instruct('compile', { body: instantiate }),
            instruct('send_eq', { key: 'new' }),

            // .name
            instruct('load', { key }),
            instruct('push', { value: new MyrString(key) }),
            instruct('send_eq', { key: 'name' }),

            // .shared
            instruct('load', { key }),
            ...muPrime.instructions,
            instruct('send_eq', { key: 'shared' }),

            instruct('load', { key }),
        ]
    }

    get instantiate(): FunctionLiteral {
        let fn = new FunctionLiteral(this.ctorArgs,
            new Program([
                new ConstructObject("mu", this.id.name),
                // ...autoconstruct,
                new LoadObject("mu", this.ctorArgs.reverse(), this.hasInitializer),
            ]),
        );
        fn.label = `${this.id.name}.new`;
        return fn;
    }

    get autoconstruct(): ReflNode[] {
        return this.body.lines.flatMap(line => {
            if (line instanceof AssignmentExpression) {
                if (line.left instanceof Identifier) {
                    if (line.right instanceof FunctionLiteral) {
                        line.right.label = `${this.id.name}.${line.left.name}`;
                        if (line.left.name === 'initialize') {
                            this.ctorArgs = line.right.args;
                            this.hasInitializer = true;
                        }
                    }
                }
                return new SelfAssignment('mu-prime', line.left, line.right);
            } else {
                return line;
            }
        })
    }
} 