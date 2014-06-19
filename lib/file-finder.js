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
 * @param {string|array} fileName Name of file to find, or array of names
 */
function FileFinder(fileName) {
    this.fileName = Array.isArray(fileName) ? fileName : [ fileName ];
    this.cache = {};
}

/**
 * Look file in directory and its parents, cache result
 * @param  {string} directory The path of directory to start
 * @param  {string[]} directoriesToCache    Array of directories, found file will be cached for
 * @returns {string|boolean}           Path of file or false if no file is found
 */
FileFinder.prototype.findInDirectory = function(directory, directoriesToCache) {

    var lookInDirectory = directory || process.eslintCwd || process.cwd(),
        lookFor = this.fileName,
        files,
        matchedNames,
        parentDirectory,
        resultFilePath,
        isFound = false;

    if (this.cache.hasOwnProperty(lookInDirectory)) {
        return this.cache[lookInDirectory];
    }

    if (!directoriesToCache) {
        directoriesToCache = [];
    }

    directoriesToCache = directoriesToCache.concat(lookInDirectory);

    files = fs.readdirSync(lookInDirectory);

    matchedNames = lookFor.filter(function (name) {
        return files.indexOf(name) !== -1;
    });

    if (matchedNames.length > 0) {
        isFound = true;
        resultFilePath = path.resolve(lookInDirectory, matchedNames[0]);
    } else {

        parentDirectory = path.resolve(lookInDirectory, "..");
        if (parentDirectory === lookInDirectory) {
            isFound = true;
            resultFilePath = false;
        }
    }

    if (isFound) {

        directoriesToCache.forEach(function(path) {
            this.cache[path] = resultFilePath;
        }.bind(this));
        return resultFilePath;
    }

    return this.findInDirectory(parentDirectory, directoriesToCache);
};

module.exports = FileFinder;
