import { instruct, MyrObject, MyrClass, MyrString } from "myr";
import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { AssignmentExpression } from "./AssignmentExpression";
import { Program } from "./Program";
import { FunctionLiteral } from "./FunctionLiteral";

class CreateObject extends ReflNode {
    constructor(private name: string, private className: string) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            instruct('construct'),
            instruct('store', { key: this.name }),
            instruct('load', { key: this.className }),
            instruct('send_eq', { key: 'class' }),
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
    constructor(public id: Identifier, public body: Program) {
        super();
    }

    get instructions(): ReflProgram {
        let klass = new MyrClass(this.id.name);
        return [
            // define class obj
            instruct('push', { value: klass }),
            instruct('store', { key: this.id.name }),
            // .new
            instruct('compile', { body: this.instantiate }),
            instruct('send_eq', { key: 'new' }),
            // .name
            instruct('load', { key: this.id.name }),
            instruct('push', { value: new MyrString(this.id.name) }),
            instruct('send_eq', { key: 'name' }),
            instruct('load', { key: this.id.name }),
        ]
    }

    get instantiate(): FunctionLiteral {
        let ctorArgs: string[] = []
        let foundInit: boolean = false;
        let autoconstruct = this.body.lines.flatMap(line => {
            if (line instanceof AssignmentExpression) {
                if (line.left instanceof Identifier) {
                    if (line.right instanceof FunctionLiteral) {
                        line.right.label = `${this.id.name}.${line.left.name}`;
                        if (line.left.name === 'initialize') {
                            ctorArgs = line.right.args;
                            foundInit = true;
                            // for (let i = 0; i < ctorArgs.length; i++) {
                            // line.right.body.instructions.push(
                            //     instruct("exec", { key: 'print' })
                            // )
                            // }
                        // } else {
                            // throw new Error("initialize should be a fn probably?")
                        }
                    }
                }
                return new SelfAssignment('mu', line.left, line.right);
            } else {
                return line;
            }
        })

        let fn = new FunctionLiteral(ctorArgs,
            new Program([
                new CreateObject("mu", this.id.name),
                ...autoconstruct,
                new LoadObject("mu", ctorArgs.reverse(), foundInit),
            ]),
        );
        fn.label = `${this.id.name}.new`;
        return fn;
    }
} 