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

    debug = require("debug"),

    options = require("./options"),
    CLIEngine = require("./cli-engine");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

debug = debug("eslint:cli");

/**
 * Translates the CLI options into the options expected by the CLIEngine.
 * @param {Object} cliOptions The CLI options to translate.
 * @returns {CLIEngineOptions} The options object for the CLIEngine.
 * @private
 */
function translateOptions(cliOptions) {
    return {
        envs: cliOptions.env,
        rules: cliOptions.rule,
        globals: cliOptions.global,
        ignore: cliOptions.ignore,
        ignorePath: cliOptions.ignorePath,
        configFile: cliOptions.config,
        rulePaths: cliOptions.rulesdir,
        reset: cliOptions.reset,
        useEslintrc: cliOptions.eslintrc
    };
}

/**
 * Outputs the results of the linting.
 * @param {LintResult[]} results The results to print.
 * @param {string} format The name of the formatter to use or the path to the formatter.
 * @param {Config} config The configuration options for the results.
 * @returns {boolean} True if the printing succeeds, false if not.
 * @private
 */
function printResults(results, format, config) {
    var formatter,
        formatterPath,
        output;

    if (fs.existsSync(path.resolve(process.cwd(), format))) {
        formatterPath = path.resolve(process.cwd(), format);
    } else {
        formatterPath = "./formatters/" + format;
    }
    try {
        formatter = require(formatterPath);
    } catch (ex) {
        console.error("Could not find formatter '%s'.", format);
        return false;
    }

    output = formatter(results, config);
    if (output) {
        console.log(output);
    }
    return true;

}

/**
 * Calculates the exit code for ESLint. If there is even one error then the
 * exit code is 1.
 * @param {LintResult[]} results The results to calculate from.
 * @returns {int} The exit code to use.
 * @private
 */
function calculateExitCode(results) {
    return results.some(function(result) {
        return result.messages.some(function(message) {
            return message.severity === 2;
        });
    }) ? 1 : 0;
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
            result,
            engine;

        try {
            currentOptions = options.parse(args);
        } catch (error) {
            console.error(error.message);
            return 1;
        }

        files = currentOptions._;

        if (currentOptions.version) { // version from package.json

            console.log("v" + require("../package.json").version);

        } else if (currentOptions.help || !files.length) {

            console.log(options.generateHelp());

        } else {

            engine = new CLIEngine(translateOptions(currentOptions));
            result = engine.executeOnFiles(files);
            if (printResults(result.results, currentOptions.format)) {
                return calculateExitCode(result.results);
            } else {
                return 1;
            }

        }

        return 0;
    }
};

module.exports = cli;
