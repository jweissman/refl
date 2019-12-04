#!/usr/bin/env ts-node

import Refl from '../src/refl/Refl';
let refl = new Refl();

const args = process.argv.slice(2);
if (args.length === 0) {
    const clear = require('chalk');
    const chalk = require('chalk');
    const figlet = require('figlet');
    const repl = require('repl');
    clear();
    console.log(chalk.green(figlet.textSync('refl')))
    console.log("\n" + chalk.blue("Refl") + chalk.gray("Repl"));
    repl.start({
        prompt: "\n(refl) ",
        eval: (input: string, _ctx: any, _filename: any, cb: any) => {
            const out = refl.interpret(input);
            if (out) { cb(null, out) };
        }
    })
} else {
    const fs = require('fs');
    const contents = fs.readFileSync(args[0]).toString();
    refl.interpret(contents);
}
