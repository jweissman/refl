import Grammar from './lang/Grammar';
import Semantics from './lang/Semantics';
import { Dict } from 'ohm-js';
import chalk from 'chalk';
import interpreter from './ReflInterpreter';
import { prettyProgram, MyrObject, MyrNil, MyrNumeric, } from 'myr';
import { ReflNode } from './lang/ReflNode';

export class Refl {
    bootstrap() {
        this.interpret("using 'string'")
        this.interpret("using 'number'")
        this.interpret("using 'boolean'")
        this.interpret("using 'list'")
        this.interpret("using 'mirror'")
    }

    static fileExtension = ".refl"
    static tracedOutput: string[] = []
    static suppressOutput: boolean = false

    static builtins: { [key: string]: Function } = {
        rand: (n: MyrNumeric) => new MyrNumeric(
            Math.floor(Math.random()*(n.value+1))
        ),

        println: (...args: any[]) => {
            let res = Refl.builtins.print(...args); //([...args,"\n"]));
            process.stdout.write("\n");
            return res;
        },

        print: (...args: any[]) => {
            let printableArgs: string[] = args.map(arg => arg !== undefined &&
                (arg.toJS())
            )
            if (!Refl.suppressOutput) {
                process.stdout.write(printableArgs.join(""));
            }
            Refl.tracedOutput.push(...printableArgs);
            return null; //new MyrNil();
        },
    }

    static tree(input: string): ReflNode[] {
        if (input.trim().length === 0) { return []; }
        let match = Grammar.match(input.trim());
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            return semanteme.tree;
        } else {
            console.debug(chalk.blue(match.message))
            throw new SyntaxError(match.shortMessage)
        }
 
    }

    constructor() { this.bootstrap(); }


    evaluate(input: string): MyrObject {
        let ast = Refl.tree(input);
        return interpreter.evaluate(ast) || new MyrNil();
    }

    interpret(input: string) {
        let result = this.evaluate(input)
        return (result instanceof MyrObject)
            ? result.toJS() : result;
    }

    repl() {
        const clear = require('clear');
        const figlet = require('figlet');
        const repl = require('repl');
        clear();
        console.log(
            chalk.green(figlet.textSync('refl'))
        )
        console.log("\n" + chalk.blue("Refl") + chalk.gray("Repl"));
        const server = repl.start({
            prompt: "\n(refl) ",
            eval: (input: string, _ctx: any, _filename: any, cb: any) => {
                let out = '(nothing)';
                try {
                    out = this.interpret(input);
                    if (out === undefined) { out = '(no-result)' };
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        return cb(new repl.Recoverable(e))
                    }
                }
                cb(null, out)
            }
        })

        server.defineCommand('code', {
            help: 'Echo current program instructions',
            action: () => { console.log(prettyProgram(interpreter.code)) }
        })

        server.defineCommand('stack', {
            help: 'Dump current stack elements',
            action: () => { console.log(interpreter.machine.stack) }
        })

        server.defineCommand('trace', {
            help: 'Activate code trace',
            action: () => {
                interpreter.trace = true;
                console.log(chalk.blue("(trace activated)"));
            }
        })

        server.defineCommand('notrace', {
            help: 'Deactivate code trace',
            action: () => {
                interpreter.trace = false;
                console.log(chalk.blue("(trace deactivated)"));
            }
        })

    }
}

const refl = new Refl();
export default refl;