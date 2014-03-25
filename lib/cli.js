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

var options = require("./options"),
    fs = require("fs"),
    path = require("path"),
    rules = require("./rules"),
    eslint = require("./eslint"),   // TODO: More formatters
    Config = require("./config");

var existsSync = fs.existsSync || path.existsSync;


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var results = [];

function isDirectory(name){
    try {
        return fs.statSync(name).isDirectory();
    } catch (ex) {
        return false;
    }
}

function getFiles(dir, configHelper){
    var files = [];

    try {
        fs.statSync(dir);
    } catch (ex){
        /* istanbul ignore next too hard to make fs.stat fail */
        return [];
    }

    function traverse(dir, stack){
        stack.push(dir);
        try {
            configHelper.cacheExclusions(path.join.apply(path, stack));
        } catch(e) {
            /* istanbul ignore next Error handling doesn't need testing */
            console.log(e.message);
        }
        fs.readdirSync(path.join.apply(path, stack)).forEach(function(file){
            var filePath = path.join.apply(path, stack.concat([file])),
                stat = fs.statSync(filePath);

            //if this file or directory is excluded from linting, skip over it.
            if (configHelper.checkForExclusion(path.resolve(filePath))) {
                return;
            }

            if (file[0] === ".") {
                return;
            } else if (stat.isFile() && /\.js$/.test(file)){
                files.push(filePath);
            } else if (stat.isDirectory()){
                traverse(file, stack);
            }
        });
        stack.pop();
    }

    traverse(dir, []);

    return files;
}

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

    if (existsSync(path.resolve(process.cwd(), config.format))) {
        formatterPath = path.resolve(process.cwd(), config.format);
    } else {
        formatterPath = "./formatters/" + config.format;
    }

    try {
        formatter = require(formatterPath);
        output = formatter(results, config);
        if (output) {
            console.log(output);
        }
        return true;
    } catch (ex) {
        console.error("Could not find formatter '%s'.", config.format);
        return false;
    }

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

    if (existsSync(filePath)) {
        config = configHelper.getConfig(filePath);
        text = fs.readFileSync(path.resolve(filename), "utf8");
        messages = eslint.verify(text, config, filename);
    } else {
        messages = [{
            fatal: true,
            message: "Could not find file at '" + filePath + "'."
        }];
    }

    // save the results for printing later
    storeResults(filename, messages);

    // count all errors and return the total
    return messages.reduce(function(previous, message) {
        var severity = null;

        if (message.fatal) {
            return previous + 1;
        }

        severity = config.rules[message.ruleId][0] ||
                config.rules[message.ruleId];

        if (severity === 2) {
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

    var fullFileList = [],
        errors = 0;

    files.forEach(function(file) {

        if (isDirectory(file)) {
            fullFileList = fullFileList.concat(getFiles(file, configHelper));
        } else {
            fullFileList.push(file);
        }
    });

    errors = fullFileList.reduce(function(previous, file) {
        return previous + processFile(file, configHelper);
    }, 0);

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
                rules.load(currentOptions.rulesdir);
            }

            result = processFiles(files, configHelper);

            // result is the number of errors (not warnings)
            return result > 0 ? 1 : 0;
        }

        return 0;
    }
};

module.exports = cli;
