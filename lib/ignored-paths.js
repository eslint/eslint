/**
 * @fileoverview Responsible for loading ignore config files and managing ignore patterns
 * @author Jonathan Rajavuori
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs"),
    path = require("path"),
    ignore = require("ignore"),
    pathUtil = require("./util/path-utils");

const debug = require("debug")("eslint:ignored-paths");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const ESLINT_IGNORE_FILENAME = ".eslintignore";

/**
 * Adds `"*"` at the end of `"node_modules/"`,
 * so that subtle directories could be re-included by .gitignore patterns
 * such as `"!node_modules/should_not_ignored"`
 */
const DEFAULT_IGNORE_DIRS = [
    "/node_modules/*",
    "/bower_components/*"
];
const DEFAULT_OPTIONS = {
    dotfiles: false,
    cwd: process.cwd()
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Find a file in the current directory.
 * @param {string} cwd Current working directory
 * @param {string} name File name
 * @returns {string} Path of ignore file or an empty string.
 */
function findFile(cwd, name) {
    const ignoreFilePath = path.resolve(cwd, name);

    return fs.existsSync(ignoreFilePath) && fs.statSync(ignoreFilePath).isFile() ? ignoreFilePath : "";
}

/**
 * Find an ignore file in the current directory.
 * @param {string} cwd Current working directory
 * @returns {string} Path of ignore file or an empty string.
 */
function findIgnoreFile(cwd) {
    return findFile(cwd, ESLINT_IGNORE_FILENAME);
}

/**
 * Find an package.json file in the current directory.
 * @param {string} cwd Current working directory
 * @returns {string} Path of package.json file or an empty string.
 */
function findPackageJSONFile(cwd) {
    return findFile(cwd, "package.json");
}

/**
 * Merge options with defaults
 * @param {Object} options Options to merge with DEFAULT_OPTIONS constant
 * @returns {Object} Merged options
 */
function mergeDefaultOptions(options) {
    return Object.assign({}, DEFAULT_OPTIONS, options);
}

/**
 * Converts a glob pattern to a new glob pattern relative to a different directory
 * @param {string} globPattern The glob pattern, relative the the old base directory
 * @param {string} relativePathToOldBaseDir A relative path from the new base directory to the old one
 * @returns {string} A glob pattern relative to the new base directory
 */
function relativize(globPattern, relativePathToOldBaseDir) {
    if (relativePathToOldBaseDir === "") {
        return globPattern;
    }

    const prefix = globPattern.startsWith("!") ? "!" : "";
    const globWithoutPrefix = globPattern.replace(/^!/, "");

    if (globWithoutPrefix.startsWith("/")) {
        return `${prefix}/${relativePathToOldBaseDir}${globWithoutPrefix}`;
    }

    return globPattern;
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * IgnoredPaths class
 */
class IgnoredPaths {

    /**
     * @param {Object} providedOptions object containing 'ignore', 'ignorePath' and 'patterns' properties
     */
    constructor(providedOptions) {
        const options = mergeDefaultOptions(providedOptions);

        this.cache = {};

        this.defaultPatterns = [].concat(DEFAULT_IGNORE_DIRS, options.patterns || []);

        this.ignoreFileDir = options.ignore !== false && options.ignorePath
            ? path.dirname(path.resolve(options.cwd, options.ignorePath))
            : options.cwd;
        this.options = options;

        this.ig = {
            custom: ignore(),
            default: ignore()
        };

        this.defaultPatterns.forEach(pattern => this.addPatternRelativeToCwd(this.ig.default, pattern));
        if (options.dotfiles !== true) {

            /*
             * ignore files beginning with a dot, but not files in a parent or
             * ancestor directory (which in relative format will begin with `../`).
             */
            this.addPatternRelativeToCwd(this.ig.default, ".*");
            this.addPatternRelativeToCwd(this.ig.default, "!../");
        }

        /*
         * Add a way to keep track of ignored files.  This was present in node-ignore
         * 2.x, but dropped for now as of 3.0.10.
         */
        this.ig.custom.ignoreFiles = [];
        this.ig.default.ignoreFiles = [];

        if (options.ignore !== false) {
            let ignorePath;

            if (options.ignorePath) {
                debug("Using specific ignore file");

                try {
                    fs.statSync(options.ignorePath);
                    ignorePath = options.ignorePath;
                } catch (e) {
                    e.message = `Cannot read ignore file: ${options.ignorePath}\nError: ${e.message}`;
                    throw e;
                }
            } else {
                debug(`Looking for ignore file in ${options.cwd}`);
                ignorePath = findIgnoreFile(options.cwd);

                try {
                    fs.statSync(ignorePath);
                    debug(`Loaded ignore file ${ignorePath}`);
                } catch (e) {
                    debug("Could not find ignore file in cwd");
                }
            }

            if (ignorePath) {
                debug(`Adding ${ignorePath}`);
                this.addIgnoreFile(this.ig.custom, ignorePath);
                this.addIgnoreFile(this.ig.default, ignorePath);
            } else {
                try {

                    // if the ignoreFile does not exist, check package.json for eslintIgnore
                    const packageJSONPath = findPackageJSONFile(options.cwd);

                    if (packageJSONPath) {
                        let packageJSONOptions;

                        try {
                            packageJSONOptions = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
                        } catch (e) {
                            debug("Could not read package.json file to check eslintIgnore property");
                            e.messageTemplate = "failed-to-read-json";
                            e.messageData = {
                                path: packageJSONPath,
                                message: e.message
                            };
                            throw e;
                        }

                        if (packageJSONOptions.eslintIgnore) {
                            if (Array.isArray(packageJSONOptions.eslintIgnore)) {
                                packageJSONOptions.eslintIgnore.forEach(pattern => {
                                    this.addPatternRelativeToIgnoreFile(this.ig.custom, pattern);
                                    this.addPatternRelativeToIgnoreFile(this.ig.default, pattern);
                                });
                            } else {
                                throw new TypeError("Package.json eslintIgnore property requires an array of paths");
                            }
                        }
                    }
                } catch (e) {
                    debug("Could not find package.json to check eslintIgnore property");
                    throw e;
                }
            }

            if (options.ignorePattern) {
                this.addPatternRelativeToCwd(this.ig.custom, options.ignorePattern);
                this.addPatternRelativeToCwd(this.ig.default, options.ignorePattern);
            }
        }
    }

    /*
     * If `ignoreFileDir` is a subdirectory of `cwd`, all paths will be normalized to be relative to `cwd`.
     * Otherwise, all paths will be normalized to be relative to `ignoreFileDir`.
     * This ensures that the final normalized ignore rule will not contain `..`, which is forbidden in
     * ignore rules.
     */

    addPatternRelativeToCwd(ig, pattern) {
        ig.addPattern(
            this.getBaseDir() === this.options.cwd
                ? pattern
                : relativize(pattern, path.relative(this.ignoreFileDir, this.options.cwd))
        );
    }

    addPatternRelativeToIgnoreFile(ig, pattern) {
        ig.addPattern(
            this.getBaseDir() === this.ignoreFileDir
                ? pattern
                : relativize(pattern, path.relative(this.options.cwd, this.ignoreFileDir))
        );
    }

    getBaseDir() {
        return this.ignoreFileDir.startsWith(this.options.cwd) ? this.options.cwd : this.ignoreFileDir;
    }

    /**
     * read ignore filepath
     * @param {string} filePath, file to add to ig
     * @returns {array} raw ignore rules
     */
    readIgnoreFile(filePath) {
        if (typeof this.cache[filePath] === "undefined") {
            this.cache[filePath] = fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean);
        }
        return this.cache[filePath];
    }

    /**
     * add ignore file to node-ignore instance
     * @param {Object} ig, instance of node-ignore
     * @param {string} filePath, file to add to ig
     * @returns {void}
     */
    addIgnoreFile(ig, filePath) {
        ig.ignoreFiles.push(filePath);
        this
            .readIgnoreFile(filePath)
            .forEach(ignoreRule => this.addPatternRelativeToIgnoreFile(ig, ignoreRule));
    }

    /**
     * Determine whether a file path is included in the default or custom ignore patterns
     * @param {string} filepath Path to check
     * @param {string} [category=undefined] check 'default', 'custom' or both (undefined)
     * @returns {boolean} true if the file path matches one or more patterns, false otherwise
     */
    contains(filepath, category) {

        let result = false;
        const absolutePath = path.resolve(this.options.cwd, filepath);
        const relativePath = pathUtil.getRelativePath(absolutePath, this.getBaseDir());

        if (typeof category === "undefined") {
            result = (this.ig.default.filter([relativePath]).length === 0) ||
                (this.ig.custom.filter([relativePath]).length === 0);
        } else {
            result = (this.ig[category].filter([relativePath]).length === 0);
        }

        return result;

    }

    /**
     * Returns a list of dir patterns for glob to ignore
     * @returns {function()} method to check whether a folder should be ignored by glob.
     */
    getIgnoredFoldersGlobChecker() {
        const baseDir = this.getBaseDir();
        const ig = ignore();

        DEFAULT_IGNORE_DIRS.forEach(ignoreDir => this.addPatternRelativeToCwd(ig, ignoreDir));

        if (this.options.dotfiles !== true) {

            // Ignore hidden folders.  (This cannot be ".*", or else it's not possible to unignore hidden files)
            ig.add([".*/*", "!../*"]);
        }

        if (this.options.ignore) {
            ig.add(this.ig.custom);
        }

        const filter = ig.createFilter();

        return function(absolutePath) {
            const relative = pathUtil.getRelativePath(absolutePath, baseDir);

            if (!relative) {
                return false;
            }

            return !filter(relative);
        };
    }
}

module.exports = IgnoredPaths;
