import Grammar from './lang/Grammar';
import Semantics from './lang/Semantics';
import { Dict } from 'ohm-js';
import { ReflObject } from './core/ReflObject';
import { ReflContext } from './ReflContext';

import chalk from 'chalk';
import { ReflNil } from './core/ReflNil';
import { ReflInterpreter } from './ReflInterpreter';
import { prettyProgram } from 'myr';

export default class Refl {
    interpreter = new ReflInterpreter();
    static tracedOutput: string[] = []

    static builtins: { [key: string]: Function } = {
        print: (...args: any[]) => {
            console.log(chalk.bgBlue(chalk.whiteBright(args)));
            Refl.tracedOutput.push(...args);
            return new ReflNil();
        },
    }

    context: ReflContext = new ReflContext();

    interpret(input: string) {
        if (input.trim().length === 0) { return; }
        let match = Grammar.match(input.trim());
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            try {
                let value = this.interpreter.run(semanteme.tree);
                // this.interpreter.interpreter.machine.pop();
                return value;
            } catch(e) {
                console.log("NAME OF ERR: '" + e.name + "'");
                console.log(chalk.red("Error: " + e.message));
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
        console.log(chalk.green(figlet.textSync('refl')))
        console.log("\n" + chalk.blue("Refl") + chalk.gray("Repl"));
        const server = repl.start({
            prompt: "\n(refl) ",
            eval: (input: string, _ctx: any, _filename: any, cb: any) => {
                let out = '(nothing)';
                try {
                    out = this.interpret(input) || '(no-result)';
                } catch (e) {
                    if (e.name === 'SyntaxError') {
                        return cb(new repl.Recoverable(e))
                    }
                }
                if (out) { cb(null, out) };
            }
        })

        server.defineCommand('code', {
            help: 'Echo current program instructions',
            action: () => { console.log(prettyProgram(this.interpreter.interpreter.code)) }
        })

        server.defineCommand('stack', {
            help: 'Echo current program instructions',
            action: () => { console.log(this.interpreter.interpreter.machine.stack) }
        })

    }
}