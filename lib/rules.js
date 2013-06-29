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
    var files = fs.readdirSync(path.join(__dirname, directory));
    files.forEach(function(file) {
        if (path.extname(file) === ".js") {
            var ruleId = file.replace(".js", "");
            rules[ruleId] = require(path.join(__dirname, directory, ruleId));
        }
    });
};

exports.get = function(ruleId) {
    return rules[ruleId];
};
