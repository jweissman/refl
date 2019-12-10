import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram, ReflInstruction } from './ReflNode';
import { ReflContext } from "../ReflContext";
import Refl from '../Refl';
import { Identifier } from './Identifier';
import { Instruction, instruct } from 'myr';

export class FunctionInvocation extends ReflNode {
    constructor(public id: Identifier, public paramList: ReflNode[]) {
        super();
    }

    prelude() { return []; }
    get instructions(): ReflProgram {
        
        let fnName = this.id.name;
        let builtin = Refl.builtins[fnName];
        if (builtin) {
            let pushArgs: ReflProgram = this.paramList.flatMap(
                param => param.instructions
            );
            let callBuiltin: ReflInstruction = instruct('exec', { jsMethod: builtin, arity: this.paramList.length });
            return [...pushArgs, callBuiltin]
        } else if (this.id.name === 'return') {
            let pushArgs: ReflProgram = this.paramList.reverse().flatMap(
                param => param.instructions
            );
 
            // handle return here, that should be okay right? :D
            // note: almost certainly better as keyword...
            return [...pushArgs, instruct('ret')]
        } else {
            let pushArgs: ReflProgram = this.paramList.reverse().flatMap(
                param => param.instructions
            );
            return [
                ...pushArgs,
                instruct('load', { key: this.id.name }),
                instruct('invoke'),
            ];
        }
    }
}
