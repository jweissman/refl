import { ReflNode, ReflProgram, PreludeContext } from './lang/ReflNode';
import { Interpreter, SimpleAlgebra, instruct } from 'myr';
import { Compiler } from 'myr/src/myr/vm/Interpreter';

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
        if (instruction.label) {
            if (instruction.label === 'main') {
                console.log("FOUND old main instruction label", instruction.label)
                return instruct('noop')
            }
        }
        return instruction;
    })
}

class ReflCompiler extends Compiler<ReflNode> {
    generateCode(ast: ReflNode): ReflProgram {
        return ast.compile();
    }
}
let compiler = new ReflCompiler();

export class ReflInterpreter {
    interpreter: Interpreter<ReflNode> = new Interpreter<ReflNode>(integerAlgebra, compiler);


    constructor() {
        this.interpreter.db.put("true", true);
        this.interpreter.db.put("false", false);
        // console.log(this.interpreter.machine.db)
    }

    get activeProgram(): ReflProgram {
        return this.interpreter.code;
    }

    run(program: ReflNode[]): any {
        let prelude = program.flatMap(elem => elem.prelude(ctx))
        let instructions = program.flatMap(elem => elem.instructions)
        let code: ReflProgram = [
            ...prelude,
            instruct('noop', { label: 'main' }),
            ...instructions,
        ]
        let executable = [ ...stripMain(this.activeProgram), ...code ];
        this.interpreter.run(executable)
        let { result } = this.interpreter
        return result;
    }
}
