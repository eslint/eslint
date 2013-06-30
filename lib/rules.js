/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


var fs = require("fs"),
    path = require("path");

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = {};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.load = function(directory) {

    try {
        var fullPath = path.join(__dirname, directory),
            files = fs.readdirSync(fullPath);

        files.forEach(function(file) {
            if (path.extname(file) === ".js") {
                var ruleId = file.replace(".js", "");
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

exports.load("./rules");
