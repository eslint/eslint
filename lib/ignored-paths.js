/**
 * @fileoverview Responsible for loading ignore config files and managing ignore patterns
 * @author Jonathan Rajavuori
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    debug = require("debug"),
    ignore = require("ignore"),
    assign = require("object-assign"),
    FileFinder = require("./file-finder");

debug = debug("eslint:ignored-paths");


//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var ESLINT_IGNORE_FILENAME = ".eslintignore";
var DEFAULT_IGNORE_PATTERNS = [
    "/node_modules/",
    "/bower_components/"
];
var DEFAULT_OPTIONS = {
    dotfiles: false,
    cwd: process.cwd()
};


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var ignoreFileFinder;

/**
 * Find an ignore file in the current directory or a parent directory.
 * @param {stirng} cwd Current working directory
 * @returns {string} Path of ignore file or an empty string.
 */
function findIgnoreFile(cwd) {
    cwd = cwd || DEFAULT_OPTIONS.cwd;
    if (!ignoreFileFinder) {
        ignoreFileFinder = new FileFinder(ESLINT_IGNORE_FILENAME, cwd);
    }

    return ignoreFileFinder.findInDirectoryOrParents(cwd);
}

/**
 * Replace Windows with Unix style paths and remove ./ prefix
 * @param {string} filepath Path to normalize
 * @returns {string} Normalized filepath
 */
function normalizeFilepath(filepath) {
    filepath = filepath.replace(/\\/g, "/");
    filepath = filepath.replace(/^\.\//, "");
    return filepath;
}

/**
 * Remove a prefix from a filepath
 * @param {string} filepath Path to remove the prefix from
 * @param {string} prefix Prefix to remove from filepath
 * @returns {string} Normalized filepath
 */
function removePrefixFromFilepath(filepath, prefix) {
    prefix += "/";
    if (filepath.indexOf(prefix) === 0) {
        filepath = filepath.substr(prefix.length);
    }
    return filepath;
}

/**
 * Resolves a filepath
 * @param {string} filepath Path resolve
 * @param {string} baseDir Base directory to resolve the filepath from
 * @returns {string} Resolved filepath
 */
function resolveFilepath(filepath, baseDir) {
    if (baseDir) {
        var base = normalizeFilepath(path.resolve(baseDir));
        filepath = removePrefixFromFilepath(filepath, base);
        filepath = removePrefixFromFilepath(filepath, fs.realpathSync(base));
    }
    filepath.replace(/^\//, "");
    return filepath;
}

/**
 * Normalize and resolve a filepath relative to a given base directory
 * @param {string} filepath Path resolve
 * @param {string} baseDir Base directory to resolve the filepath from
 * @returns {string} Normalized and resolved filepath
 */
function normalizeAndResolveFilepath(filepath, baseDir) {
    filepath = normalizeFilepath(filepath);
    return resolveFilepath(filepath, baseDir);
}

/**
 * Merge options with defaults
 * @param {object} options Options to merge with DEFAULT_OPTIONS constant
 * @returns {object} Merged options
 */
function mergeDefaultOptions(options) {
    options = (options || {});
    return assign({}, DEFAULT_OPTIONS, options);
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * IgnoredPaths
 * @constructor
 * @class IgnoredPaths
 * @param {Object} options object containing 'ignore', 'ignorePath' and 'patterns' properties
 */
function IgnoredPaths(options) {

    options = mergeDefaultOptions(options);

    /**
     * add pattern to node-ignore instance
     * @param {object} ig, instance of node-ignore
     * @param {string} pattern, pattern do add to ig
     * @returns {array} raw ignore rules
     */
    function addPattern(ig, pattern) {
        return ig.addPattern(pattern);
    }

    /**
     * add ignore file to node-ignore instance
     * @param {object} ig, instance of node-ignore
     * @param {string} filepath, file to add to ig
     * @returns {array} raw ignore rules
     */
    function addIgnoreFile(ig, filepath) {
        var fileContent = fs.readFileSync(filepath, "utf8");
        fileContent = fileContent.replace(/\*\*/g, "*");
        return ig.addIgnoreFile(filepath);
    }

    this.defaultPatterns = DEFAULT_IGNORE_PATTERNS.concat(options.patterns || []);
    this.baseDir = ".";

    this.ig = {
        custom: new ignore.Ignore({
            twoGlobstars: true,
            ignore: []
        }),
        default: new ignore.Ignore({
            twoGlobstars: true,
            ignore: []
        })
    };

    if (options.dotfiles !== true) {
        addPattern(this.ig.default, ".*");
    }

    if (options.ignore !== false) {

        addPattern(this.ig.default, this.defaultPatterns);

        var ignorePath;

        if (options.ignorePattern) {
            addPattern(this.ig.custom, options.ignorePattern);
        }

        if (options.ignorePath) {
            try {
                fs.statSync(options.ignorePath);
                ignorePath = options.ignorePath;
            } catch (e) {
                e.message = "Cannot read ignore file: " + options.ignorePath + "\nError: " + e.message;
                throw e;
            }
        } else {
            ignorePath = findIgnoreFile(options.cwd);
            try {
                fs.statSync(ignorePath);
            } catch (e) {
                this.options = options;
            }
        }

        if (ignorePath) {
            this.baseDir = path.dirname(ignorePath);
            addIgnoreFile(this.ig.custom, ignorePath);
        }

    }

    this.options = options;
    return this;

}

/**
 * Determine whether a file path is included in the default or custom ignore patterns
 * @param {string} filepath Path to check
 * @param {string} [category=null] check 'default', 'custom' or both (null)
 * @returns {boolean} true if the file path matches one or more patterns, false otherwise
 */
IgnoredPaths.prototype.contains = function(filepath, category) {

    var result = false;
    filepath = normalizeAndResolveFilepath(filepath, this.baseDir);

    if ((typeof category === "undefined") || (category === "default")) {
        result = result || (this.ig.default.filter([filepath]).length === 0);
    }

    if ((typeof category === "undefined") || (category === "custom")) {
        result = result || (this.ig.custom.filter([filepath]).length === 0);
    }

    return result;

};

module.exports = IgnoredPaths;

