import { ReflObject } from '../core/ReflObject';
import { ReflNode, ReflProgram } from './ReflNode';
import { ReflContext } from "../ReflContext";
import Refl from '../Refl';
import { Identifier } from './Identifier';
import { Instruction, instruct } from 'myr';

export class FunctionInvocation extends ReflNode {
    constructor(public id: Identifier, public paramList: ReflNode[]) {
        super();
    }

    evaluate(ctx: ReflContext): ReflObject {
        // console.log("FunctionInvocation#eval")
        let fnName = this.id.name;
        let params = this.paramList.map(param => param.evaluate(ctx));
        let builtin = Refl.builtins[fnName];
        if (builtin) {
            return builtin(...params);
        }
        else {
            let fn = ctx.retrieve(this.id.name);
            let fnCtx = ctx.clone();
            let formalArguments = fn.args.map((e: string, i: number) => [e, params[i]]);
            // debugger;
            formalArguments.forEach(([arg, param]: [string, ReflObject]) => {
                fnCtx.assign(arg, param);
            });
            // debugger;
            return fn.body.evaluate(fnCtx);
        }
    }

    prelude() { return []; }
    get instructions(): ReflProgram {
        let pushArgs: ReflProgram = this.paramList.reverse().flatMap(
            param => param.instructions
        );
        // debugger;
        return [
            ...pushArgs,
            // instruct('push')
            instruct('load', { key: this.id.name }),
            // call from top of stack...?
            instruct('invoke'),
        ];
        // throw new Error("Method not implemented.");
    }
}
