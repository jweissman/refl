import Grammar from './lang/Grammar';
import Semantics from './lang/Semantics';
import { Dict } from 'ohm-js';
import chalk from 'chalk';
import { ReflInterpreter } from './ReflInterpreter';
import { prettyProgram, MyrNil } from 'myr';

export default class Refl {
    interpreter = new ReflInterpreter();
    static tracedOutput: string[] = []
    static suppressOutput: boolean = false

    static builtins: { [key: string]: Function } = {
        print: (...args: any[]) => {
            let printableArgs = args.map(arg => arg !== undefined &&
                arg.toJS()
            )
            // console.log(...printableArgs);
            if (!Refl.suppressOutput) {
                console.log(chalk.bgBlack(chalk.greenBright(printableArgs)));
            }
            Refl.tracedOutput.push(...printableArgs);
            return new MyrNil();
        },
    }

    interpret(input: string) {
        if (input.trim().length === 0) { return; }
        let match = Grammar.match(input.trim());
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            try {
                let value = this.interpreter.interpret(semanteme.tree);
                // this.interpreter.interpreter.machine.pop();
                return value;
            } catch(e) {
                console.log("NAME OF ERR: '" + e.name + "'");
                console.log(chalk.red("Error: " + e.message));
                throw(e);
            }
        } else {
            console.debug(chalk.blue(match.message))
            throw new SyntaxError(match.shortMessage)
            // console.log(chalk.red("Syntax error found at " + match.shortMessage))
        }
        return '...';
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
                // if (out !== undefined) { cb(null, out) }
                // else { cb(null,null)}
            }
        })

        server.defineCommand('code', {
            help: 'Echo current program instructions',
            action: () => { console.log(prettyProgram(this.interpreter.code)) }
        })

        server.defineCommand('stack', {
            help: 'Dump current stack elements',
            action: () => { console.log(this.interpreter.machine.stack) }
        })

        server.defineCommand('trace', {
            help: 'Activate code trace',
            action: () => {
                this.interpreter.trace = true;
                console.log(chalk.blue("(trace activated)"));
            }
        })

        server.defineCommand('notrace', {
            help: 'Deactivate code trace',
            action: () => {
                this.interpreter.trace = false;
                console.log(chalk.blue("(trace deactivated)"));
            }
        })

    }
}