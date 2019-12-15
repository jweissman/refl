import { ReflNode, ReflProgram, ReflInstruction } from './ReflNode';
import { Refl } from '../Refl';
import { Identifier } from './Identifier';
import { instruct } from 'myr';

export class FunctionInvocation extends ReflNode {
    constructor(public fn: ReflNode, public paramList: ReflNode[]) {
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
        if (this.fn instanceof Identifier) {
            let id = this.fn;
            let fnName = id.name;
            let builtin = Refl.builtins[fnName];
            if (builtin) {
                let callBuiltin: ReflInstruction = instruct('exec',
                    { jsMethod: builtin, arity: this.paramList.length }
                );
                return [...this.pushArgs(), callBuiltin]
            // } else if (id.name === 'fail') {
            //     throw new Error("FAIL")
            //     return [];
            } else if (id.name === 'return') {
                // handle return here, that should be okay right? :D
                // note: almost certainly better as keyword...
                return [...this.pushArgs(true), instruct('ret')]
            } else {
                return [
                    ...this.pushArgs(true),
                    instruct('load', { key: id.name }),
                    instruct('invoke'),
                ];
            }
        } else {
            // try to resolve the fn (assume we got something that resolves to a function...)
            // and invoke it
            return [
                ...this.pushArgs(true),
                ...this.fn.instructions,
                instruct('invoke'),
            ];
        }
    }
}
