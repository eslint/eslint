/**
 * @fileoverview Util class to find config files.
 * @author Aliaksei Shytkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path");

//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * FileFinder
 * @constructor
 * @param {string} fileName Name of file to find
 */
function FileFinder(fileName) {
    this.fileName = fileName;
    this.cache = {};
}

/**
 * Look file in directory and its parents, cache result
 * @param  {string} directory The path of directory to start
 * @param  {string[]} directoriesToCache    Array of directories, found file will be cached for
 * @returns {srting}           Path to found file
 */
FileFinder.prototype.findInDirectory = function(directory, directoriesToCache) {

    var lookInDirectory = directory || process.eslintCwd || process.cwd(),
        lookFor = this.fileName,
        files,
        parentDirectory,
        found;

    if (this.cache.hasOwnProperty(lookInDirectory)) {
        return this.cache[lookInDirectory];
    }

    if (!directoriesToCache) {
        directoriesToCache = [];
    }

    directoriesToCache = directoriesToCache.concat(lookInDirectory);

    files = fs.readdirSync(lookInDirectory);

    if (files.indexOf(lookFor) !== -1) {
        found = path.resolve(lookInDirectory, lookFor);
    } else {

        parentDirectory = path.resolve(lookInDirectory, "..");
        if (parentDirectory === lookInDirectory) {
            found = false;
        }
    }

    if (typeof(found) !== "undefined") {

        directoriesToCache.forEach(function(path) {
            this.cache[path] = found;
        }.bind(this));
        return found;
    }

    return this.findInDirectory(parentDirectory, directoriesToCache);
};

module.exports = FileFinder;
