import { instruct, MyrObject, MyrClass, MyrString } from "myr";
import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
import { AssignmentExpression } from "./AssignmentExpression";
import { Program } from "./Program";
import { FunctionLiteral } from "./FunctionLiteral";
import { FunctionInvocation } from "./FunctionInvocation";

class CreateObject extends ReflNode {
    constructor(private name: string) {
        super();
    }

    // compiled into something :D
    get instructions(): ReflProgram {
        // let obj = new MyrObject(); // always the same damned object!!!
        // console.log("CREATE ")
        return [
            instruct('construct'),
            instruct('store', { key: this.name }),
            // instruct('dump', { key: 'create-obj' })
        ]
    }
}

class LoadObject extends ReflNode {
    constructor(private name: string, private ctorArgs: string[] = []) {
        super();
    }

    get instructions(): ReflProgram {
        // let obj = new MyrObject();
        let loadCtorArgs = 
            this.ctorArgs.map(arg => instruct('load', { key: arg}));
        return [
            // instruct('push', { value: obj }),

            // instruct('load', { key: this.name }),
            ...loadCtorArgs,
            instruct('load', { key: this.name }),
            // instruct('dump', { key: 'load-obj'}),
            instruct('send', { key: 'initialize' }),

            instruct('load', { key: this.name }),
            // push args and load init
            // instruct('push', { value: new MyrString("initialize") }),
            instruct('dump', { key: 'post-init' }),
            // instruct('send', { key: 'initialize' }),
            // instruct('load', { key: this.name }),
            // instruct('load', { key: this.name })
        ]
    }
}



// class ReflClass {
//     constructor(public name: string) {}
// }

class SelfAssignment extends AssignmentExpression {
    constructor(private name: string, public left: ReflNode, public right: ReflNode) {
        super(left, right);
    }

    get instructions(): ReflProgram {
        // if (this.left instanceof Identifier) {
        let name = (this.left as Identifier).name;
        return [
            instruct('load', { key: this.name }),
            ...this.right.instructions,
            // based on the type of the thing on the right...
            instruct('send_eq', { key: name }),
            // instruct('dump', { key: `assign-${name}` }),
            // instruct('pop'),
        ]
        // }
        //  else if (this.left instanceof ArrayLookup) {
        //     let { array, index } = this.left;
        //     return [
        //         ...array.instructions, // have loaded the array
        //         ...index.instructions,
        //         ...this.right.instructions,
        //         // instruct('push', { value: new MyrNumeric(index) }), // push the index
        //         instruct('arr_put'),
        //     ]
        // } else {
        //     throw new Error("Don't know how to assign to LHS "
        //         + this.left.constructor.name)
        // }
    }
}

export class ClassDefinition extends ReflNode {
    constructor(public id: Identifier, public body: Program) {
        super();
    }

    get instructions(): ReflProgram {
        let klass = new MyrClass(this.id.name); //, this.construct);
        return [
            // the name of the class to
            // some kind of object that can stand for the class...
            instruct('push', { value: klass }),
            // instruct('push', { value: klass }),
            instruct('store', { key: this.id.name }),
            instruct('load', { key: this.id.name }),
            instruct('compile', { body: this.instantiate }),
            instruct('send_eq', { key: 'new' }),
            instruct('load', { key: this.id.name }),
            // store handled by parser...
        ]
    }

    get instantiate(): FunctionLiteral {
        let ctorArgs: string[] = []
        let autoconstruct = this.body.lines.flatMap(line => {
            if (line instanceof AssignmentExpression) {
                if (line.left instanceof Identifier && line.left.name === 'initialize') {
                    if (line.right instanceof FunctionLiteral) {
                        ctorArgs = line.right.args;
                        // console.log("FOUND INITIALIZE", { line, ctorArgs })
                    } else {
                        throw new Error("initialize should be a fn probably?")
                    }
                }
                return new SelfAssignment('mu', line.left, line.right);
            } else {
                return line;
            }
        })

        // this.body.lines.find(line => {
        //     // have to analyze and find the constructor???
        //     if (line instanceof )
        // })
        // no args for now?
        // this IS new
        return new FunctionLiteral(ctorArgs, // <<--- ctor args
            new Program([
                // new AssignmentExpression(new Identifier("mu"), )
                new CreateObject("mu"),
                ...autoconstruct,
                // ...runConstructor
                // ...loadCtorArgs,
                new LoadObject("mu", ctorArgs.reverse()),
                // new FunctionInvocation()
            ])
        );
    }

    // get construct(): ReflProgram {
    //     // it's a method that returns a new object...
    //     // instruct('enter')
    //     // load new object, 'enter' as self?
    //     // run through body instructions with 'self' as target?
    //     // let ctor = this.body.lines.flatMap(node => {
    //     //     if (node instanceof AssignmentExpression) {
    //     //     } else {
    //     //         // do normal things??
    //     //         return node.instructions;
    //     //     }
    //     // })
    //     return [
    //         // instruct('push_self', { value: new MyrObject() }),
    //         ...this.body.instructions,
    //         // instruct('pop_self'),
    //     ]
    // }
} 