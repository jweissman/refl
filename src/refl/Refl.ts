import Grammar from './lang/Grammar';
import Semantics from './lang/Semantics';
import { Dict } from 'ohm-js';
import { ReflObject } from './core/ReflObject';
import { ReflContext } from './ReflContext';

import chalk from 'chalk';
import { ReflNil } from './core/ReflNil';
// import ReflReturn from './core/ReflReturn';
import { ReflInterpreter } from './ReflInterpreter';

export default class Refl {
    interpreter = new ReflInterpreter();
    static tracedOutput: string[] = []

    static builtins: { [key: string]: Function } = {
        print: (...args: any[]) => {
            // let output = args.map(arg => arg.value);
            console.log(chalk.bgBlue(chalk.whiteBright(args)));
            Refl.tracedOutput.push(...args);
            return new ReflNil();
        },

        // "return": (object: ReflObject) => {
        //     return new ReflReturn(object);
        // }
    }

    context: ReflContext = new ReflContext();

    // TODO see https://nodejs.org/api/repl.html#repl_recoverable_errors
    // for handling multi-line input (if we hit a syntax error, could assume we may need more input?)
    interpret(input: string) {
        if (input.trim().length === 0) { return; }
        let match = Grammar.match(input.trim());
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            try {
                // debugger;
                // return interpreter.run(semanteme.tree.instructions).toJS();
                let value: ReflObject = 
                    this.interpreter.run(semanteme.tree);
                    // semanteme.eval()[0];
                return value.toJS();
            } catch(e) {
                console.log(chalk.red("Error: " + e.message));
            }
        } else {
            console.debug(chalk.blue(match.message))
            console.log(chalk.red("Syntax error found at " + match.shortMessage))
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
        repl.start({
            prompt: "\n(refl) ",
            eval: (input: string, _ctx: any, _filename: any, cb: any) => {
                const out = this.interpret(input) || 'nil';
                if (out) { cb(null, out) };
            }
        })

    }
}