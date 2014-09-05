/**
 * @fileoverview Responsible for loading ignore config files and managing ignore patterns
 * @author Jonathan Rajavuori
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    debug = require("debug"),
    minimatch = require("minimatch"),
    FileFinder = require("./file-finder");

debug = debug("eslint:ignored-paths");


//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var ESLINT_IGNORE_FILENAME = ".eslintignore";


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Load and parse ignore patterns from the file at the given path
 * @param {string} filepath Path to the ignore file.
 * @returns {string[]} An array of ignore patterns or an empty array if no ignore file.
 */
function loadIgnoreFile(filepath) {
    var ignorePatterns = [];

    function nonEmpty(line) {
        return line.trim() !== "" && line[0] !== "#";
    }

    if (filepath) {
        try {
            ignorePatterns = fs.readFileSync(filepath, "utf8").split(/\r?\n/).filter(nonEmpty);
        } catch (e) {
            e.message = "Cannot read ignore file: " + filepath + "\nError: " + e.message;
            throw e;
        }
    }

    ignorePatterns.forEach(function (pattern) {
        ignorePatterns.push(pattern + "/**");
    });

    return ignorePatterns;
}

var ignoreFileFinder;

/**
 * Find an ignore file in the current directory.
 * @returns {string|boolean} path of ignore file if found, or false if no ignore is found
 */
function findIgnoreFile() {
    if (!ignoreFileFinder) {
        ignoreFileFinder = new FileFinder(ESLINT_IGNORE_FILENAME);
    }

    return ignoreFileFinder.findInDirectory();
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * IgnoredPaths
 * @constructor
 * @class IgnoredPaths
 * @param {Array} patterns to be matched against file paths
 */
function IgnoredPaths(patterns) {
    this.patterns = patterns;
}

/**
 * IgnoredPaths initializer
 * @param {Object} options object containing 'ignore' and 'ignorePath' properties
 * @returns {IgnoredPaths} object, with patterns loaded from the ignore file
 */
IgnoredPaths.load = function (options) {
    var patterns;

    options = options || {};

    if (options.ignore) {
        patterns = loadIgnoreFile(options.ignorePath || findIgnoreFile());
    } else {
        patterns = [];
    }

    return new IgnoredPaths(patterns);
};

/**
 * Determine whether a file path is included in the configured ignore patterns
 * @param {string} filepath Path to check
 * @returns {boolean} true if the file path matches one or more patterns, false otherwise
 */
IgnoredPaths.prototype.contains = function (filepath) {
    if (this.patterns === null) {
        throw new Error("No ignore patterns loaded, call 'load' first");
    }

    filepath = filepath.replace("\\", "/");
    return this.patterns.some(function (pattern) {
        var result = minimatch(filepath, pattern);
        debug("Minimatch " + result);
        return result;
    });
};

module.exports = IgnoredPaths;
