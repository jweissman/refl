import { ReflNode, ReflProgram, ReflInstruction } from './ReflNode';
import Refl from '../Refl';
import { Identifier } from './Identifier';
import { instruct } from 'myr';

export class FunctionInvocation extends ReflNode {
    constructor(public id: Identifier, public paramList: ReflNode[]) {
        super();
    }

    pushArgs(reverse: boolean = false): ReflProgram {
        let params = this.paramList;
        if (reverse) {
            params = this.paramList.reverse();
        }
        return params.flatMap(param => param.instructions) || [];
    }

    get instructions(): ReflProgram {
        let fnName = this.id.name;
        let builtin = Refl.builtins[fnName];
        if (builtin) {
            let callBuiltin: ReflInstruction = instruct('exec',
                { jsMethod: builtin, arity: this.paramList.length }
            );
            return [...this.pushArgs(), callBuiltin]
        } else if (this.id.name === 'return') {
            // handle return here, that should be okay right? :D
            // note: almost certainly better as keyword...
            return [...this.pushArgs(true), instruct('ret')]
        } else {
            return [
                ...this.pushArgs(true),
                instruct('load', { key: this.id.name }),
                instruct('invoke'),
            ];
        }
    }
}
