import Grammar from './Grammar';
import Semantics from './Semantics';
import { Dict } from 'ohm-js';
import { ReflObject } from './ReflObject';
import { ReflContext } from './ReflContext';

import chalk from 'chalk';

export default class Refl {
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