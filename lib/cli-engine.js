/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 * @copyright 2014 Nicholas C. Zakas. All rights reserved.
 * See LICENSE in root directory for full license.
 */

"use strict";

/*
 * The CLI object should *not* call process.exit() directly. It should only return
 * exit codes. This allows other programs to use the CLI object and still control
 * when the program exits.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),

    assign = require("object-assign"),
    debug = require("debug"),
    glob = require("glob"),
    shell = require("shelljs"),

    rules = require("./rules"),
    eslint = require("./eslint"),
    IgnoredPaths = require("./ignored-paths"),
    Config = require("./config"),
    util = require("./util"),
    fileEntryCache = require("file-entry-cache"),
    SourceCodeFixer = require("./util/source-code-fixer"),
    validator = require("./config-validator"),
    stringify = require("json-stable-stringify"),

    crypto = require( "crypto" ),
    pkg = require("../package.json");

var DEFAULT_PARSER = require("../conf/eslint.json").parser;

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * The options to configure a CLI engine with.
 * @typedef {Object} CLIEngineOptions
 * @property {string} configFile The configuration file to use.
 * @property {boolean|object} baseConfig Base config object. True enables recommend rules and environments.
 * @property {boolean} ignore False disables use of .eslintignore.
 * @property {string[]} rulePaths An array of directories to load custom rules from.
 * @property {boolean} useEslintrc False disables looking for .eslintrc
 * @property {string[]} envs An array of environments to load.
 * @property {string[]} globals An array of global variables to declare.
 * @property {string[]} extensions An array of file extensions to check.
 * @property {Object<string,*>} rules An object of rules to use.
 * @property {string} ignorePath The ignore file to use instead of .eslintignore.
 */

/**
 * A linting warning or error.
 * @typedef {Object} LintMessage
 * @property {string} message The message to display to the user.
 */

/**
 * A linting result.
 * @typedef {Object} LintResult
 * @property {string} filePath The path to the file that was linted.
 * @property {LintMessage[]} messages All of the messages for the result.
 */

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------


var defaultOptions = {
        configFile: null,
        baseConfig: false,
        rulePaths: [],
        useEslintrc: true,
        envs: [],
        globals: [],
        rules: {},
        extensions: [".js"],
        ignore: true,
        ignorePath: null,
        parser: DEFAULT_PARSER,
        cache: false,
        cacheFile: ".eslintcache",
        fix: false
    },
    loadedPlugins = Object.create(null);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug("eslint:cli-engine");

/**
 * Load the given plugins if they are not loaded already.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {void}
 */
function loadPlugins(pluginNames) {
    if (pluginNames) {
        pluginNames.forEach(function(pluginName) {
            var pluginNamespace = util.getNamespace(pluginName),
                pluginNameWithoutNamespace = util.removeNameSpace(pluginName),
                pluginNameWithoutPrefix = util.removePluginPrefix(pluginNameWithoutNamespace),
                plugin;

            if (!loadedPlugins[pluginNameWithoutPrefix]) {
                debug("Load plugin " + pluginNameWithoutPrefix);

                plugin = require(pluginNamespace + util.PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
                // if this plugin has rules, import them
                if (plugin.rules) {
                    rules.import(plugin.rules, pluginNameWithoutPrefix);
                }

                loadedPlugins[pluginNameWithoutPrefix] = plugin;
            }
        });
    }
}

/**
 * It will calculate the error and warning count for collection of messages per file
 * @param {Object[]} messages - Collection of messages
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerFile(messages) {
    return messages.reduce(function(stat, message) {
        if (message.fatal || message.severity === 2) {
            stat.errorCount++;
        } else {
            stat.warningCount++;
        }
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0
    });
}

/**
 * It will calculate the error and warning count for collection of results from all files
 * @param {Object[]} results - Collection of messages from all the files
 * @returns {Object} Contains the stats
 * @private
 */
function calculateStatsPerRun(results) {
    return results.reduce(function(stat, result) {
        stat.errorCount += result.errorCount;
        stat.warningCount += result.warningCount;
        return stat;
    }, {
        errorCount: 0,
        warningCount: 0
    });
}

/**
 * Processes an source code using ESLint.
 * @param {string} text The source code to check.
 * @param {Object} configHelper The configuration options for ESLint.
 * @param {string} filename An optional string representing the texts filename.
 * @param {boolean} fix Indicates if fixes should be processed.
 * @returns {Result} The results for linting on this text.
 * @private
 */
function processText(text, configHelper, filename, fix) {

    // clear all existing settings for a new file
    eslint.reset();

    var filePath,
        config,
        messages,
        stats,
        fileExtension = path.extname(filename),
        processor,
        fixedResult;

    if (filename) {
        filePath = path.resolve(filename);
    }

    filename = filename || "<text>";
    debug("Linting " + filename);
    config = configHelper.getConfig(filePath);
    loadPlugins(config.plugins);

    for (var plugin in loadedPlugins) {
        if (loadedPlugins[plugin].processors && Object.keys(loadedPlugins[plugin].processors).indexOf(fileExtension) >= 0) {
            processor = loadedPlugins[plugin].processors[fileExtension];
            break;
        }
    }

    if (processor) {
        debug("Using processor");
        var parsedBlocks = processor.preprocess(text, filename);
        var unprocessedMessages = [];
        parsedBlocks.forEach(function(block) {
            unprocessedMessages.push(eslint.verify(block, config, filename));
        });

        // TODO(nzakas): Figure out how fixes might work for processors

        messages = processor.postprocess(unprocessedMessages, filename);

    } else {

        messages = eslint.verify(text, config, filename);

        if (fix) {
            debug("Generating fixed text for " + filename);
            fixedResult = SourceCodeFixer.applyFixes(eslint.getSourceCode(), messages);
            messages = fixedResult.messages;
        }
    }

    stats = calculateStatsPerFile(messages);

    var result = {
        filePath: filename,
        messages: messages,
        errorCount: stats.errorCount,
        warningCount: stats.warningCount
    };

    if (fixedResult && fixedResult.fixed) {
        result.output = fixedResult.output;
    }

    return result;
}

/**
 * Processes an individual file using ESLint. Files used here are known to
 * exist, so no need to check that here.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} configHelper The configuration options for ESLint.
 * @param {Object} options The CLIEngine options object.
 * @returns {Result} The results for linting on this file.
 * @private
 */
function processFile(filename, configHelper, options) {

    var text = fs.readFileSync(path.resolve(filename), "utf8"),
        result = processText(text, configHelper, filename, options.fix);

    return result;

}

/**
 * Returns result with warning by ignore settings
 * @param {string} filePath File path of checked code
 * @returns {Result} Result with single warning
 * @private
 */
function createIgnoreResult(filePath) {
    return {
        filePath: path.resolve(filePath),
        messages: [
            {
                fatal: false,
                severity: 1,
                message: "File ignored because of your .eslintignore file. Use --no-ignore to override."
            }
        ],
        errorCount: 0,
        warningCount: 1
    };
}


/**
 * Checks if the given message is an error message.
 * @param {object} message The message to check.
 * @returns {boolean} Whether or not the message is an error message.
 * @private
 */
function isErrorMessage(message) {
    return message.severity === 2;
}


/**
 * Checks if a provided path is a directory and returns a glob string matching
 * all files under that directory if so, the path itself otherwise.
 *
 * Reason for this is that `glob` needs `/**` to collect all the files under a
 * directory where as our previous implementation without `glob` simply walked
 * a directory that is passed. So this is to maintain backwards compatibility.
 *
 * Also makes sure all path separators are POSIX style for `glob` compatibility.
 *
 * @param {string[]} [extensions] An array of accepted extensions
 * @returns {Function} A function that takes a pathname and returns a glob that
 *                     matches all files with the provided extensions if
 *                     pathname is a directory.
 */
function processPath(extensions) {
    var suffix = "/**";

    if (extensions) {
        if (extensions.length === 1) {
            suffix += "/*." + extensions[0];
        } else {
            suffix += "/*.{" + extensions.join(",") + "}";
        }
    }

    /**
     * A function that converts a directory name to a glob pattern
     *
     * @param {string} pathname The directory path to be modified
     * @returns {string} The glob path or the file path itself
     * @private
     */
    return function(pathname) {
        var newPath = pathname;

        if (shell.test("-d", pathname)) {
            newPath = pathname.replace(/[\/\\]$/, "") + suffix;
        }

        return newPath.replace(/\\/g, "/").replace(/^\.\//, "");
    };
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Creates a new instance of the core CLI engine.
 * @param {CLIEngineOptions} options The options for this instance.
 * @constructor
 */
function CLIEngine(options) {

    /**
     * Stored options for this instance
     * @type {Object}
     */
    this.options = assign(Object.create(defaultOptions), options || {});

    /**
     * cache used to not operate on files that haven't changed since last successful
     * execution (e.g. file passed with no errors and no warnings
     * @type {Object}
     */
    this._fileCache = fileEntryCache.create(path.resolve(this.options.cacheFile)); // eslint-disable-line no-underscore-dangle

    if (!this.options.cache) {
        this._fileCache.destroy(); // eslint-disable-line no-underscore-dangle
    }

    // load in additional rules
    if (this.options.rulePaths) {
        this.options.rulePaths.forEach(function(rulesdir) {
            debug("Loading rules from " + rulesdir);
            rules.load(rulesdir);
        });
    }

    Object.keys(this.options.rules || {}).forEach(function(name) {
        validator.validateRuleOptions(name, this.options.rules[name], "CLI");
    }.bind(this));
}

/**
 * Returns the formatter representing the given format or null if no formatter
 * with the given name can be found.
 * @param {string} [format] The name of the format to load or the path to a
 *      custom formatter.
 * @returns {Function} The formatter function or null if not found.
 */
CLIEngine.getFormatter = function(format) {

    var formatterPath;

    // default is stylish
    format = format || "stylish";

    // only strings are valid formatters
    if (typeof format === "string") {

        // replace \ with / for Windows compatibility
        format = format.replace(/\\/g, "/");

        // if there's a slash, then it's a file
        if (format.indexOf("/") > -1) {
            formatterPath = path.resolve(process.cwd(), format);
        } else {
            formatterPath = "./formatters/" + format;
        }

        try {
            return require(formatterPath);
        } catch (ex) {
            return null;
        }

    } else {
        return null;
    }
};

/**
 * Returns results that only contains errors.
 * @param {LintResult[]} results The results to filter.
 * @returns {LintResult[]} The filtered results.
 */
CLIEngine.getErrorResults = function(results) {
    var filtered = [];

    results.forEach(function(result) {
        var filteredMessages = result.messages.filter(isErrorMessage);

        if (filteredMessages.length > 0) {
            filtered.push({
                filePath: result.filePath,
                messages: filteredMessages
            });
        }
    });

    return filtered;
};

/**
 * Outputs fixes from the given results to files.
 * @param {Object} report The report object created by CLIEngine.
 * @returns {void}
 */
CLIEngine.outputFixes = function(report) {
    report.results.filter(function(result) {
        return result.hasOwnProperty("output");
    }).forEach(function(result) {
        fs.writeFileSync(result.filePath, result.output);
    });
};

CLIEngine.prototype = {

    constructor: CLIEngine,

    /**
     * Add a plugin by passing it's configuration
     * @param {string} name Name of the plugin.
     * @param {Object} pluginobject Plugin configuration object.
     * @returns {void}
     */
    addPlugin: function(name, pluginobject) {
        var pluginNameWithoutPrefix = util.removePluginPrefix(util.removeNameSpace(name));
        if (pluginobject.rules) {
            rules.import(pluginobject.rules, pluginNameWithoutPrefix);
        }
        loadedPlugins[pluginNameWithoutPrefix] = pluginobject;
    },

    /**
     * Resolves the patterns passed into executeOnFiles() into glob-based patterns
     * for easier handling.
     * @param {string[]} patterns The file patterns passed on the command line.
     * @returns {string[]} The equivalent glob patterns.
     */
    resolveFileGlobPatterns: function(patterns) {
        var extensions = this.options.extensions.map(function(ext) {
            return ext.charAt(0) === "." ? ext.substr(1) : ext;
        });

        return patterns.map(processPath(extensions));
    },

    /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @returns {Object} The results for all files that were linted.
     */
    executeOnFiles: function(patterns) {
        var results = [],
            processed = {},
            options = this.options,
            fileCache = this._fileCache, // eslint-disable-line no-underscore-dangle
            configHelper = new Config(options),
            ignoredPaths = IgnoredPaths.load(options),
            ignoredPathsList = ignoredPaths.patterns || [],
            globOptions,
            stats,
            startTime,
            prevConfig; // the previous configuration used

        startTime = Date.now();
        patterns = this.resolveFileGlobPatterns(patterns);

        globOptions = {
            nodir: true,
            ignore: ignoredPathsList
        };

        /**
         * create a md5Hash of a given string
         * @param  {string} str the string to calculate the hash for
         * @returns {string}    the calculated hash
         */
        function md5Hash(str) {
            return crypto
                .createHash("md5")
                .update(str)
                .digest("hex");
        }

        /**
         * Calculates the hash of the config file used to validate a given file
         * @param  {string} filename The path of the file to retrieve a config object for to calculate the hash
         * @returns {string}         the hash of the config
         */
        function hashOfConfigFor(filename) {
            var config = configHelper.getConfig(filename);

            if (!prevConfig) {
                prevConfig = {};
            }

            // reuse the previously hashed config if the config hasn't changed
            if (prevConfig.config !== config) {
                // config changed so we need to calculate the hash of the config
                // and the hash of the plugins being used
                prevConfig.config = config;

                var eslintVersion = pkg.version;

                prevConfig.hash = md5Hash(eslintVersion + "_" + stringify(config));
            }

            return prevConfig.hash;
        }

        /**
         * Executes the linter on a file defined by the `filename`. Skips
         * unsupported file extensions and any files that are already linted.
         * @param {string} filename The file to be linted
         * @returns {void}
         */
        function executeOnFile(filename) {
            var shouldIgnore = ignoredPaths.contains(filename);
            if (shouldIgnore) {
                return;
            }

            filename = fs.realpathSync(filename);
            if (processed[filename]) {
                return;
            }

            var hashOfConfig;

            if (options.cache) {
                // get the descriptor for this file
                // with the metadata and the flag that determines if
                // the file has changed
                var descriptor = fileCache.getFileDescriptor(filename);
                var meta = descriptor.meta || {};

                hashOfConfig = hashOfConfigFor(filename);

                var changed = descriptor.changed || meta.hashOfConfig !== hashOfConfig;
                if (!changed) {
                    debug("Skipping file since hasn't changed: " + filename);

                    // Adding the filename to the processed hashmap
                    // so the reporting is not affected (showing a warning about .eslintignore being used
                    // when it is not really used)

                    processed[filename] = true;

                    // Add the the cached results (always will be 0 error and 0 warnings)
                    // cause we don't save to cache files that failed
                    // to guarantee that next execution will process those files as well
                    results.push(descriptor.meta.results);

                    // move to the next file
                    return;
                }
            }

            debug("Processing " + filename);

            processed[filename] = true;

            var res = processFile(filename, configHelper, options);

            if (options.cache) {
                // if a file contains errors or warnings we don't want to
                // store the file in the cache so we can guarantee that
                // next execution will also operate on this file
                if ( res.errorCount > 0 || res.warningCount > 0 ) {
                    debug("File has problems, skipping it: " + filename);
                    // remove the entry from the cache
                    fileCache.removeEntry( filename );
                } else {
                    // since the file passed we store the result here
                    // TODO: check this as we might not need to store the
                    // successful runs as it will always should be 0 error 0 warnings
                    descriptor.meta.hashOfConfig = hashOfConfig;
                    descriptor.meta.results = res;
                }
            }

            results.push(res);
        }

        patterns.forEach(function(pattern) {
            if (shell.test("-f", pattern) && !ignoredPaths.contains(pattern)) {
                executeOnFile(pattern);
            } else {
                glob.sync(pattern, globOptions).forEach(executeOnFile);
            }
        });

        // only warn for files explicitly passed on the command line
        if (options.ignore) {
            patterns.forEach(function(file) {
                var fullPath = path.resolve(file);
                if (shell.test("-f", fullPath) && !processed[fullPath]) {
                    results.push(createIgnoreResult(file));
                }
            });
        }

        stats = calculateStatsPerRun(results);

        if (options.cache) {
            // persist the cache to disk
            fileCache.reconcile();
        }

        debug("Linting complete in: " + (Date.now() - startTime) + "ms");

        return {
            results: results,
            errorCount: stats.errorCount,
            warningCount: stats.warningCount
        };
    },

    /**
     * Executes the current configuration on text.
     * @param {string} text A string of JavaScript code to lint.
     * @param {string} filename An optional string representing the texts filename.
     * @returns {Object} The results for the linting.
     */
    executeOnText: function(text, filename) {

        var results = [],
            stats,
            options = this.options,
            configHelper = new Config(options),
            ignoredPaths = IgnoredPaths.load(options),
            exclude = ignoredPaths.contains.bind(ignoredPaths);

        if (filename && options.ignore && exclude(filename)) {
            results.push(createIgnoreResult(filename));
        } else {
            results.push(processText(text, configHelper, filename, options.fix));
        }

        stats = calculateStatsPerRun(results);

        return {
            results: results,
            errorCount: stats.errorCount,
            warningCount: stats.warningCount
        };
    },

    /**
     * Returns a configuration object for the given file based on the CLI options.
     * This is the same logic used by the ESLint CLI executable to determine
     * configuration for each file it processes.
     * @param {string} filePath The path of the file to retrieve a config object for.
     * @returns {Object} A configuration object for the file.
     */
    getConfigForFile: function(filePath) {
        var configHelper = new Config(this.options);
        return configHelper.getConfig(filePath);
    },

    /**
     * Checks if a given path is ignored by ESLint.
     * @param {string} filePath The path of the file to check.
     * @returns {boolean} Whether or not the given path is ignored.
     */
    isPathIgnored: function(filePath) {
        var ignoredPaths;

        if (this.options.ignore) {
            ignoredPaths = IgnoredPaths.load(this.options);
            return ignoredPaths.contains(filePath);
        }

        return false;
    },

    getFormatter: CLIEngine.getFormatter

};

module.exports = CLIEngine;
