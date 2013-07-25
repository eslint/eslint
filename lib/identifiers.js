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

var identifiers = {};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.load = function(directory) {

    try {
        var fullPath = path.resolve(process.cwd(), directory),
            files = fs.readdirSync(fullPath);

        files.forEach(function(file) {
            if (path.extname(file) === JS_EXT) {
                var identifierId = file.replace(JS_EXT, "");
                identifiers[identifierId] = require(path.join(fullPath, identifierId));
            }
        });
    } catch (ex) {
        console.error("Couldn't load identifiers from " + directory + ": " + ex.message);
        process.exit(1);
    }

};

exports.get = function(identifierId) {
    return identifiers[identifierId];
};

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

// loads built-in identifiers
exports.load(path.join(__dirname, "./identifiers"));
