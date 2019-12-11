import { instruct, MyrObject } from "myr";
import { ReflNode, ReflProgram } from "./ReflNode";
import { Identifier } from "./Identifier";
// import { MyrClass } from "myr/src/myr/vm/AbstractMachine";
// import { MyrClass } from "myr/src/myr/vm/AbstractMachine";

// class ReflClass {
//     constructor(public name: string) {}
// }

export class ClassDefinition extends ReflNode {
    constructor(public id: Identifier, public body: ReflNode) {
        super();
    }

    get instructions(): ReflProgram {
        return [
            // the name of the class to
            // some kind of object that can stand for the class...
            // instruct('push', { value: this.structure })
        ]
    }

    // private get structure(): MyrClass {
    //     let { name } = this.id;
    //     let struct = new MyrClass(name);
    //     console.log("BUILT CLASS REF", struct)
    //     return struct;
    // }
} 