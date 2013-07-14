/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var options = require("./options"),
    fs = require("fs"),
    path = require("path"),
    rules = require("./rules"),
    eslint = require("./eslint");  // TODO: More formatters

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var DEFAULT_CONFIG = "../conf/eslint.json";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function readConfig(options) {
    var configLocation = path.resolve(__dirname, options.c || options.config ||
            DEFAULT_CONFIG);
    return require(configLocation);
}

function isDirectory(name){
    try {
        return fs.statSync(name).isDirectory();
    } catch (ex) {
        return false;
    }
}

function getFiles(dir){
    var files = [];

    try {
        fs.statSync(dir);
    } catch (ex){
        return [];
    }

    function traverse(dir, stack){
        stack.push(dir);
        fs.readdirSync(stack.join("/")).forEach(function(file){
            var path = stack.concat([file]).join("/"),
                stat = fs.statSync(path);

            if (file[0] === ".") {
                return;
            } else if (stat.isFile() && /\.js$/.test(file)){
                files.push(path);
            } else if (stat.isDirectory()){
                traverse(file, stack);
            }
        });
        stack.pop();
    }

    traverse(dir, []);

    return files;
}

/**
 * Processes an individual file using ESLint.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} config The configuration object for ESLint.
 * @param {Function} formatter The formatter to use to output results.
 * @returns {int} The total number of errors.
 */
function processFile(filename, config, formatter) {

    // clear all existing settings for a new file
    eslint.reset();

    var filePath = path.resolve(filename),
        text,
        messages;

    if (fs.existsSync(filePath)) {
        text = fs.readFileSync(path.resolve(filename), "utf8");
        messages = eslint.verify(text, config);
    } else {
        console.log("Could not find file at '%s'.", filePath);
        process.exit(1);
    }

    console.log(formatter(messages, filename, config));

    // count all errors and return the total
    return messages.reduce(function(previous, message) {
        if (message.fatal || config.rules[message.ruleId] === 2) {
            return previous + 1;
        } else {
            return previous;
        }
    }, 0);
}

/**
 * Processes all files from the command line.
 * @param {string[]} files All of the filenames to process.
 * @param {Object} config The configuration options for ESLint.
 * @returns {int} The total number of errors.
 */
function processFiles(files, config) {

    var fullFileList = [],
        formatter;

    // just in case an incorrect formatter was passed in
    try {
        formatter = require("./formatters/" + config.format);
    } catch (ex) {
        console.log("Could not find formatter '%s'.", config.format);
        process.exit(1);
    }

    files.forEach(function(file) {

        if (isDirectory(file)) {
            fullFileList = fullFileList.concat(getFiles(file));
        } else {
            fullFileList.push(file);
        }
    });

    return fullFileList.reduce(function(previous, file) {
        return previous + processFile(file, config, formatter);
    }, 0);
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
     * @param {String[]} argv The array of arguments to process.
     * @returns {int} The exit code for the operation.
     */
    execute: function(argv) {

        var currentOptions = options.parse(argv),
            files = currentOptions._,
            config,
            result;

        if (currentOptions.h || !files.length) {
            options.help();
        } else {

            config = readConfig(currentOptions);

            // TODO: Figure out correct option vs. config for this
            // load rules
            if (currentOptions.rulesdir) {
                rules.load(currentOptions.rulesdir);
            }

            // assign format information
            if (currentOptions.f) {
                config.format = currentOptions.f;
            }

            result = processFiles(files, config);

            // result is the number of errors (not warnings)
            return result > 0 ? 1 : 0;
        }

    }

};



module.exports = cli;
