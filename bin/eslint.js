#!/usr/bin/env node

/*jshint node:true*/

var cli = require("../lib/cli");
var exitCode = cli.execute(Array.prototype.slice.call(process.argv, 2));
process.exit(exitCode);
