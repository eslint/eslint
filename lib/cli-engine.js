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
    Config = require("./config");

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
// Constants
//------------------------------------------------------------------------------

var PLUGIN_NAME_PREFIX = "eslint-plugin-";

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
 * Removes the prefix `eslint-plugin-` from a plugin name.
 * @param {string} pluginName The name of the plugin which may has the prefix.
 * @returns {string} The name of the plugin without prefix.
 */
function removePluginPrefix(pluginName) {
    var nameWithoutPrefix;

    if (pluginName.indexOf(PLUGIN_NAME_PREFIX) === 0) {
        nameWithoutPrefix = pluginName.substring(PLUGIN_NAME_PREFIX.length);
    } else {
        nameWithoutPrefix = pluginName;
    }

    return nameWithoutPrefix;
}

/**
 * Load the given plugins if they are not loaded already.
 * @param {string[]} pluginNames An array of plugin names which should be loaded.
 * @returns {void}
 */
function loadPlugins(pluginNames) {
    if (pluginNames) {
        pluginNames.forEach(function (pluginName) {
            var pluginNameWithoutPrefix = removePluginPrefix(pluginName),
                plugin;

            if (!loadedPlugins[pluginNameWithoutPrefix]) {
                debug("Load plugin " + pluginNameWithoutPrefix);

                plugin = require(PLUGIN_NAME_PREFIX + pluginNameWithoutPrefix);
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
    }

};

module.exports = CLIEngine;
