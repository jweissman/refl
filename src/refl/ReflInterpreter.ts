import { ReflNode, ReflProgram, PreludeContext } from './lang/ReflNode';
import { Interpreter, SimpleAlgebra, instruct } from 'myr';

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
    interpreter: Interpreter = new Interpreter(integerAlgebra);

    activeProgram: ReflProgram = [];

    constructor() {
        this.interpreter.db.put("true", true);
        this.interpreter.db.put("false", false);
        // console.log(this.interpreter.machine.db)
    }

    run(program: ReflNode[]): any {
        let prelude = program.flatMap(elem => elem.prelude(ctx))
        let instructions = program.flatMap(elem => elem.instructions)
        let code: ReflProgram = [
            ...prelude,
            instruct('noop', { label: 'main' }),
            ...instructions,
        ]
        this.activeProgram = [ ...stripMain(this.activeProgram), ...code ];
        this.interpreter.run(this.activeProgram)
        let { result } = this.interpreter
        return result;
    }
}
