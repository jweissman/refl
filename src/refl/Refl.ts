import Grammar from './Grammar';
import Semantics from './Semantics';
import { Dict } from 'ohm-js';
import { ReflObject } from './ReflObject';

export default class Refl {
    interpret(input: string) {
        let match = Grammar.match(input);
        if (match.succeeded()) {
            let semanteme: Dict = Semantics(match);
            let value: ReflObject = semanteme.eval()[0];
            return value.toJS();
        } else {
            throw new Error("Syntax error")
        }
    }
}