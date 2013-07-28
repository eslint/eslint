/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

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
    eslint = require("./eslint");  // TODO: More formatters

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var DEFAULT_CONFIG = "../conf/eslint.json";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var results = [];

function readConfig(options) {
    var configLocation = null;

    if (options.c || options.config) {
        configLocation = path.resolve(process.cwd(), options.c ||
                options.config);
    }

    return require(configLocation || DEFAULT_CONFIG);
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

function storeResults(filename, messages) {
    results.push({filePath: filename, messages: messages});
}

function printResults(config) {
    var formatter;
    try {
        formatter = require("./formatters/" + config.format);
        console.log(formatter(results, config));
        return true;
    } catch (ex) {
        console.log("Could not find formatter '%s'.", config.format);
        return false;
    }

}

/**
 * Processes an individual file using ESLint.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} config The configuration object for ESLint.
 * @returns {int} The total number of errors.
 */
function processFile(filename, config) {

    // clear all existing settings for a new file
    eslint.reset();

    var filePath = path.resolve(filename),
        existsSync = fs.existsSync || path.existsSync,
        text,
        messages;

    if (existsSync(filePath)) {
        text = fs.readFileSync(path.resolve(filename), "utf8");
        messages = eslint.verify(text, config);
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
        errors = 0;

    files.forEach(function(file) {

        if (isDirectory(file)) {
            fullFileList = fullFileList.concat(getFiles(file));
        } else {
            fullFileList.push(file);
        }
    });

    errors = fullFileList.reduce(function(previous, file) {
        return previous + processFile(file, config);
    }, 0);



    return printResults(config) ? 1 : errors;

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

        // Ensure results from previous execution are not printed.
        results = [];

        if (currentOptions.v) { // version from package.json

            console.log("v" + require("../package.json").version);

        } else if (currentOptions.h || !files.length) {

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

        return 0;

    }

};



module.exports = cli;
