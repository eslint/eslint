#!/usr/bin/env node

/*jshint node:true*/

var cli = require("../lib/cli");
cli.execute(Array.prototype.slice.call(process.argv, 2));

