/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


var fs = require("fs"),
    path = require("path");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var JS_EXT = ".js";

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = {};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.load = function(directory) {

    try {
        var fullPath = path.resolve(process.cwd(), directory),
            files = fs.readdirSync(fullPath);

        files.forEach(function(file) {
            if (path.extname(file) === JS_EXT) {
                var ruleId = file.replace(JS_EXT, "");
                rules[ruleId] = require(path.join(fullPath, ruleId));
            }
        });
    } catch (ex) {
        console.error("Couldn't load rules from " + directory + ": " + ex.message);
        process.exit(1);
    }

};

exports.get = function(ruleId) {
    return rules[ruleId];
};

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

// loads built-in rules
exports.load(path.join(__dirname, "./rules"));
