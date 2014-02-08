#!/usr/bin/env node

var cli = require("../lib/cli");
var exitCode = cli.execute(process.argv);
process.exit(exitCode);
