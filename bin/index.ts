#!/usr/bin/env ts-node --project tsconfig.production.json

import Refl from '../src/refl/Refl';
let refl = new Refl();

const args = process.argv.slice(2);
if (args.length === 0) {
    refl.repl();
} else {
    const fs = require('fs');
    const contents = fs.readFileSync(args[0]).toString();
    refl.interpret(contents);
}
