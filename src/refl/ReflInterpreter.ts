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

const stripMain = (program: ReflProgram) => {
    return program.map(instruction => {
        if (instruction.label && instruction.label === 'main') {
            delete instruction.label;
        }
        return instruction;
    })
}

export class ReflInterpreter {
    interpreter: Interpreter<number | string | boolean> = new Interpreter(integerAlgebra);

    activeProgram: ReflProgram = [];

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

        this.activeProgram = [ ...stripMain(this.activeProgram), ...code ];

        console.log("RUNNING CODE...!", { code: this.activeProgram })
        this.interpreter.run(this.activeProgram)
        let { result } = this.interpreter
        // console.log("RAN", { code, result })
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
