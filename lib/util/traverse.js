/**
 * @fileoverview Simple directory traversal logic.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    minimatch = require("minimatch");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines if a file or directory should be excluded from traversal.
 * @param {string} name The path name to check.
 * @param {string[]} exclude The paths to exclude.
 * @returns {boolean} True if the file should be excluded, false if not.
 * @private
 */
function isExcluded(name, exclude) {
    return exclude.some(function(exclusion) {
        return minimatch(name, exclusion);
    });
}

/**
 * Walks a path recursively calling the callback on each file.
 * @param {string} name The file or directory path.
 * @param {string[]} exclude Array of glob patterns to exclude.
 * @param {Function} callback The function to call on each file.
 * @returns {void}
 * @private
 */
function walk(name, exclude, callback){

    var stat;

    try {
        stat = fs.statSync(name);
    } catch (ex){
        /* istanbul ignore next too hard to make fs.stat fail */
        return [];
    }

    function traverse(dir, stack){
        stack.push(dir);



        fs.readdirSync(path.join.apply(path, stack)).forEach(function(file){
            var filePath = path.join.apply(path, stack.concat([file])),
                stat = fs.statSync(filePath);

            //if this file or directory is excluded from linting, skip over it.
            if (isExcluded(filePath, exclude)) {
                return;
            }

            if (stat.isFile()){
                callback(filePath);
            } else if (stat.isDirectory()){
                traverse(file, stack);
            }
        });
        stack.pop();
    }

    if (stat.isFile()) {
        callback(name);
    } else {
        traverse(name, []);
    }

}

/**
 * Traverses multiple directories and calls a callback on each file.
 * @param {Object} options The option for the traversal.
 * param {string[]} options.files An array of file and directory paths to traverse.
 * param {string[]} options.exclude An array of file and directory paths to ignore.
 * @param {Function} callback A function to call for each file.
 * @returns {void}
 */
module.exports = function traverse(options, callback) {

    var files = options.files,
        exclude = options.exclude || [];

    files.forEach(function(file) {
        walk(file, exclude, callback);
    });

};
