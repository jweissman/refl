import { ReflNode, ReflProgram } from './lang/ReflNode';
import { Interpreter, SimpleAlgebra, instruct, MyrBoolean, prettyProgram, MyrNil } from 'myr';
import { Compiler } from 'myr/src/myr/vm/Interpreter';

let integerAlgebra = new SimpleAlgebra();

const stripMain = (program: ReflProgram) => {
    return program.map(instruction => {
        if (instruction.label) {
            if (instruction.label === 'main') {
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

export class ReflInterpreter extends Interpreter<ReflNode> {
    // interpreter: Interpreter<ReflNode> = new Interpreter<ReflNode>(integerAlgebra, compiler);

    constructor() {
        super(integerAlgebra, compiler);
        this.db.put("true", new MyrBoolean(true));
        this.db.put("false", new MyrBoolean(false));
        this.db.put("nil", new MyrNil());
    }

    get activeProgram(): ReflProgram {
        return this.code;
    }

    interpret(program: ReflNode[]): any {
        let instructions = program.flatMap(elem => elem.instructions)
        let code: ReflProgram = [
            instruct('noop', { label: 'main' }),
            ...instructions,
        ]
        let executable = [ ...stripMain(this.activeProgram), ...code ];
        // console.log("\n\n--- EXECUTE ---", "\n\n" + prettyProgram(executable), "=========\n\n")
        this.run(executable)
        return this.result;
    }
}
