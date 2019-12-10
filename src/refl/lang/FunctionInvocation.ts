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

    evaluate(ctx: ReflContext): ReflObject {
        let fnName = this.id.name;
        let params = this.paramList.map(param => param.evaluate(ctx));
        let builtin = Refl.builtins[fnName];
        if (builtin) {
            return builtin(...params);
        }
        else {
            let fn = ctx.retrieve(this.id.name);
            let fnCtx = ctx.clone();
            let args = fn.args.map((e: string, i: number) => [e, params[i]]);
            args.forEach(([arg, param]: [string, ReflObject]) => {
                fnCtx.assign(arg, param);
            });
            return fn.body.evaluate(fnCtx);
        }
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
