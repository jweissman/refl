import { ReflObject } from './core/ReflObject';
import { ReflString } from './core/ReflString';
import { ReflNil } from './core/ReflNil';
import { ReflNode, ReflProgram, PreludeContext } from './lang/ReflNode';
import { Interpreter, SimpleAlgebra, instruct } from 'myr';
import { ReflInt } from './core/ReflInt';
import ReflBool from './core/ReflBool';

let integerAlgebra = new SimpleAlgebra();
let lambdaCount = 0, condCount=0;
let ctx: PreludeContext = {
    nextAnonymousFunctionLabel: () => {
        let label = `lambda-${lambdaCount++}`
        return label;
    },
    nextConditionalLabel: () => {
        let label = `cond-${condCount++}`
        return label;
    }
}

export class ReflInterpreter {
    interpreter: Interpreter<number | string | boolean> = new Interpreter(integerAlgebra);
    run(program: ReflNode[]): ReflObject {
        // console.log("ReflInterpreter#run", { program })

        let prelude = program.flatMap(elem => elem.prelude(ctx))
        // console.log("GOT PRELUDE...", { prelude })
        let instructions = program.flatMap(elem => elem.instructions)
        // console.log("GOT INSTRUCTIONS...", { instructions })
        // console.log(prettyProgram(instructions))

        let code: ReflProgram = [
            ...prelude,
            instruct('noop', { label: 'main' }),
            ...instructions,
        ]

        // console.log("RUNNING CODE...!", { code })
        this.interpreter.run(code)
        let { result } = this.interpreter
        console.log("RAN", { code, result })
        if (result !== null) {
            if (typeof result === 'number') {
                return new ReflInt(result);
            }
            else if (typeof result === 'boolean') {
                return new ReflBool(result);
            }
            else {
                return new ReflString(result);
            }
        } else {
            return new ReflNil();
        }
    }
}
