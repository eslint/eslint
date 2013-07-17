/**
 * @fileoverview Wrapper around Optimist to preconfigure CLI options output.
 * @author Nicholas C. Zakas
 */

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

// Format
optimist.alias("f", "format");
optimist.default("f", "compact");
optimist.describe("f", "Use a specific output format.");

// Version
optimist.alias("v", "version");
optimist.describe("v", "Outputs the version number.");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.help = function() {
    console.log(optimist.help());
};

exports.parse = function(argv) {
    return optimist.parse(argv);
};
