/**
 * @fileoverview Util class to find config files.
 * @author Aliaksei Shytkin
 * @copyright 2014 Michael McLaughlin. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Returns an array of entries for a directory. If there's an error, then an
 * empty array is returned instead. The try-catch is moved out here to avoid
 * performance penalty of having it in the findInDirectory() method.
 * @param {string} directory The directory to search in.
 * @returns {string[]} The file names in the directory or an empty array on error.
 * @private
 */
function getDirectoryEntries(directory) {
    try {
        return fs.readdirSync(directory);
    } catch (ex) {
        return [];
    }
}


//------------------------------------------------------------------------------
// API
//------------------------------------------------------------------------------

/**
 * FileFinder
 * @constructor
 * @param {...string} arguments The basename(s) of the file(s) to find.
 */
function FileFinder() {
    this.fileNames = Array.prototype.slice.call(arguments);
    this.cache = {};
}

/**
 * Look for files in directory and its parents, cache result.
 * @param  {string} directory The path of the directory to start the search in.
 * @param  {string[]} [directoriesToCache] Array of directories, found file will be cached.
 * @returns {string[]} Paths of found files.
 */
FileFinder.prototype.findInDirectory = function(directory, directoriesToCache) {
    var cache = this.cache,
        directoryEntries,
        fileName,
        fileNames,
        found,
        i,
        len,
        parentDirectory,
        resultFilePaths;

    if (!directory) {
        directory = process.cwd();
    }

    if (cache.hasOwnProperty(directory)) {
        return cache[directory];
    }

    if (!directoriesToCache) {
        directoriesToCache = [];
    }

    directoriesToCache.push(directory);
    directoryEntries = getDirectoryEntries(directory);
    resultFilePaths = [];
    fileNames = this.fileNames;

    for (i = 0, len = fileNames.length; i < len; i++) {
        fileName = fileNames[i];

        if (directoryEntries.indexOf(fileName) !== -1) {
            resultFilePaths.push(path.resolve(directory, fileName));
            found = true;
        }
    }

    if (found || (parentDirectory = path.dirname(directory)) === directory) {

        for (i = 0, len = directoriesToCache.length; i < len; i++) {
            cache[directoriesToCache[i]] = resultFilePaths;
        }
        return resultFilePaths;
    }

    return this.findInDirectory(parentDirectory, directoriesToCache);
};

module.exports = FileFinder;
