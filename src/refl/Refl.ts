import Grammar from './Grammar';
import Semantics from './Semantics';
import { Dict } from 'ohm-js';
import { ReflObject } from './core/ReflObject';
import { ReflContext } from './ReflContext';

import chalk from 'chalk';
import { ReflNil } from './core/ReflNil';
import ReflReturn from './core/ReflReturn';

export default class Refl {
    static tracedOutput: string[] = []

    static builtins: { [key: string]: Function } = {
        print: (...args: any[]) => {
            let output = args.map(arg => arg.value);
            console.log(...output);
            Refl.tracedOutput.push(...output);
            return new ReflNil();
        },

        "return": (object: ReflObject) => {
            return new ReflReturn(object);
        }
    }

    context: ReflContext = new ReflContext();

    interpret(input: string) {
        if (input.trim().length === 0) { return; }
        let match = Grammar.match(input.trim());
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            try {
                let value: ReflObject = semanteme.eval()[0];
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
}