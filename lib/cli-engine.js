/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
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

    rules = require("./rules"),
    eslint = require("./eslint"),
    traverse = require("./util/traverse"),
    IgnoredPaths = require("./ignored-paths"),
    Config = require("./config"),
    util = require("./util");

//------------------------------------------------------------------------------
// Typedefs
//------------------------------------------------------------------------------

/**
 * The options to configure a CLI engine with.
 * @typedef {Object} CLIEngineOptions
 * @property {string} configFile The configuration file to use.
 * @property {boolean} reset True disables all default rules and environments.
 * @property {boolean} ignore False disables use of .eslintignore.
 * @property {string[]} rulePaths An array of directories to load custom rules from.
 * @property {boolean} useEslintrc False disables looking for .eslintrc
 * @property {string[]} envs An array of environments to load.
 * @property {string[]} globals An array of global variables to declare.
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
        reset: false,
        rulePaths: [],
        useEslintrc: true,
        envs: [],
        globals: [],
        rules: {},
        ignore: true,
        ignorePath: null
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
        pluginNames.forEach(function (pluginName) {
            var pluginNameWithoutPrefix = util.removePluginPrefix(pluginName),
                plugin;

            if (!loadedPlugins[pluginNameWithoutPrefix]) {
                debug("Load plugin " + pluginNameWithoutPrefix);

                plugin = require(util.PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
                rules.import(plugin.rules, pluginNameWithoutPrefix);

                loadedPlugins[pluginNameWithoutPrefix] = true;
            }
        });
    }
}

/**
 * Processes an individual file using ESLint.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} configHelper The configuration options for ESLint.
 * @returns {Result} The results for linting on this file.
 * @private
 */
function processFile(filename, configHelper) {

    // clear all existing settings for a new file
    eslint.reset();

    var filePath = path.resolve(filename),
        config,
        text,
        messages;

    if (fs.existsSync(filePath)) {
        debug("Linting " + filePath);
        config = configHelper.getConfig(filePath);
        loadPlugins(config.plugins);
        text = fs.readFileSync(path.resolve(filename), "utf8");
        messages = eslint.verify(text, config, filename);
    } else {
        debug("Couldn't find " + filePath);
        messages = [{
            fatal: true,
            message: "Could not find file at '" + filePath + "'."
        }];
    }

    return {
        filePath: filename,
        messages: messages
    };
}

/**
 * Processes an source code using ESLint.
 * @param {string} text The source code to check.
 * @param {Object} configHelper The configuration options for ESLint.
 * @returns {Result} The results for linting on this text.
 * @private
 */
function processText(text, configHelper) {

    // clear all existing settings for a new file
    eslint.reset();

    var config,
        messages;

    debug("Linting <text>");
    config = configHelper.getConfig();
    loadPlugins(config.plugins);
    messages = eslint.verify(text, config, "<text>");

    return {
        filePath: "<text>",
        messages: messages
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

    // load in additional rules
    if (this.options.rulePaths) {
        this.options.rulePaths.forEach(function(rulesdir) {
            debug("Loading rules from " + rulesdir);
            rules.load(rulesdir);
        });
    }

    loadPlugins(this.options.plugins);
}

CLIEngine.prototype = {

    constructor: CLIEngine,

    /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} files An array of file and directory names.
     * @returns {Object} The results for all files that were linted.
     */
    executeOnFiles: function(files) {

        var results = [],
            processed = [],
            configHelper = new Config(this.options),
            ignoredPaths = IgnoredPaths.load(this.options),
            exclude = ignoredPaths.contains.bind(ignoredPaths);

        traverse({
            files: files,
            exclude: this.options.ignore ? exclude : false
        }, function(filename) {

            debug("Processing " + filename);

            if (path.extname(filename) === ".js") {
                processed.push(filename);
                results.push(processFile(filename, configHelper));
            }

        });

        // only warn for files explicitly passes on the command line
        if (this.options.ignore) {
            files.forEach(function(file) {
                if (path.extname(file) === ".js" && processed.indexOf(file) === -1) {
                     results.push({
                         filePath: file,
                         messages: [
                             {
                                 fatal: false,
                                 severity: 1,
                                 message: "File ignored because of your .eslintignore file. Use --no-ignore to override."
                             }
                         ]
                     });
                }
            });
        }

        return {
            results: results
        };
    },

    /**
     * Executes the current configuration on text.
     * @param {string} text A string of JavaScript code to lint.
     * @returns {Object} The results for the linting.
     */
    executeOnText: function(text) {

        var configHelper = new Config(this.options),
            results = [];

        results.push(processText(text, configHelper));

        return {
            results: results
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
    isPathIgnored: function (filePath) {
        var ignoredPaths;

        if (this.options.ignore) {
            ignoredPaths = IgnoredPaths.load(this.options);
            return ignoredPaths.contains(filePath);
        }

        return false;
    }

};

module.exports = CLIEngine;
