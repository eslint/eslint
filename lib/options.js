/**
 * @fileoverview Wrapper around Optimist to preconfigure CLI options output.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var optimist = require("optimist");

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

optimist.usage("eslint [options] file.js [file.js] [dir]");

// Help
optimist.boolean("h");
optimist.alias("h", "help");
optimist.describe("h", "Show help.");

// Config
optimist.alias("c", "config");
optimist.describe("c", "Load configuration data from this file.");

// RulesDir
optimist.describe("rulesdir", "Load additional rules from this directory.");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.help = function() {
    console.log(optimist.help());
};

exports.parse = function(argv) {
    return optimist.parse(argv);
};
