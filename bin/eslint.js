#!/usr/bin/env node
var cli = require("../lib/cli");
var exitCode = cli.execute(process.argv);

/*
 * Wait for the stdout buffer to drain.
 * See https://github.com/eslint/eslint/issues/317
 */
process.on('exit', function() {
    process.exit(exitCode);
});
