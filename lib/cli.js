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

    options = require("./options"),
    rules = require("./rules"),
    eslint = require("./eslint"),
    traverse = require("./util/traverse"),
    debug = require("debug"),
    Config = require("./config"),
    IgnoredPaths = require("./ignored-paths");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var results = [];
debug = debug("eslint:cli");

/**
 * Stores the messages for a particular file.
 * @param {string} filename The name of the file.
 * @param {Object[]} messages The messages to store for the file.
 * @returns {void}
 * @private
 */
function storeResults(filename, messages) {
    results.push({filePath: filename, messages: messages});
}

/**
 * Outputs the results of the linting.
 * @param {Config} config The configuration options for the results.
 * @returns {boolean} True if the printing succeeds, false if not.
 * @private
 */
function printResults(config) {
    var formatter,
        formatterPath,
        output;
    if (fs.existsSync(path.resolve(process.cwd(), config.format))) {
        formatterPath = path.resolve(process.cwd(), config.format);
    } else {
        formatterPath = "./formatters/" + config.format;
    }
    try {
        formatter = require(formatterPath);
    } catch (ex) {
        console.error("Could not find formatter '%s'.", config.format);
        return false;
    }
    output = formatter(results, config);
    if (output) {
        console.log(output);
    }
    return true;

}

/**
 * Processes an individual file using ESLint.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} configHelper The configuration options for ESLint.
 * @returns {int} The total number of errors.
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
        text = fs.readFileSync(path.resolve(filename), "utf8");
        messages = eslint.verify(text, config, filename);
    } else {
        debug("Couldn't find " + filePath);
        messages = [{
            fatal: true,
            message: "Could not find file at '" + filePath + "'."
        }];
    }

    // save the results for printing later
    storeResults(filename, messages);

    // count all errors and return the total
    return messages.reduce(function(previous, message) {

        if (message.fatal || message.severity === 2) {
            return previous + 1;
        }

        return previous;
        
    }, 0);
}

/**
 * Processes all files from the command line.
 * @param {string[]} files All of the filenames to process.
 * @param {Object} configHelper The configuration options for ESLint.
 * @returns {int} The total number of errors.
 */
function processFiles(files, configHelper) {

    var errors = 0,
        ignoredPaths = IgnoredPaths.load(configHelper.options);

    traverse({
        files: files
    }, function(filename) {

        debug("Processing " + filename);

        if (path.extname(filename) === ".js") {

            if (configHelper.options.force || !ignoredPaths.contains(filename)) {

                errors += processFile(filename, configHelper);

            } else if (files.indexOf(filename) > -1) {

                debug("Ignoring " + filename);
                // only warn for files explicitly passes on the command line
                storeResults(filename, [{
                    fatal: false,
                    message: "File ignored because of your .eslintignore file. Use --no-ignore to override."
                }]);

            }

        }

    });

    // If the formatter succeeds return validation errors count, otherwise
    // return 1 for the formatter error.
    return printResults(configHelper.getConfig()) ? errors : 1;

}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Encapsulates all CLI behavior for eslint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 */
var cli = {

    /**
     * Executes the CLI based on an array of arguments that is passed in.
     * @param {string|Array|Object} args The arguments to process.
     * @returns {int} The exit code for the operation.
     */
    execute: function(args) {

        var currentOptions,
            files,
            configHelper,
            result;

        try {
            currentOptions = options.parse(args);
        } catch (error) {
            console.error(error.message);
            return 1;
        }

        files = currentOptions._;

        // Ensure results from previous execution are not printed.
        results = [];

        if (currentOptions.version) { // version from package.json

            console.log("v" + require("../package.json").version);

        } else if (currentOptions.help || !files.length) {

            console.log(options.generateHelp());

        } else {

            configHelper = new Config(currentOptions);

            // TODO: Figure out correct option vs. config for this
            // load rules
            if (currentOptions.rulesdir) {
                currentOptions.rulesdir.forEach(function(rulesdir) {
                    debug("Loading rules from " + rulesdir);
                    rules.load(rulesdir);
                });
            }

            result = processFiles(files, configHelper);

            // result is the number of errors (not warnings)
            return result > 0 ? 1 : 0;
        }

        return 0;
    }
};

module.exports = cli;
