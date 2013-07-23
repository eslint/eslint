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
    SourceMapConsumer = require("source-map").SourceMapConsumer,
    rules = require("./rules"),
    eslint = require("./eslint"),
    existsSync = fs.existsSync || path.existsSync;  // TODO: More formatters

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
    } catch (ex) {
        console.log("Could not find formatter '%s'.", config.format);
        process.exit(1);
    }
    console.log(formatter(results, config));
}

/**
 * Processes an individual file using ESLint.
 * @param {string} filename The filename of the file being checked.
 * @param {Object} config The configuration object for ESLint.
 * @returns {int} The total number of errors.
 */
function processFile(filename, config, options) {

    // clear all existing settings for a new file
    eslint.reset();

    var filePath = path.resolve(filename),
        text,
        messages;

    if (existsSync(filePath)) {
        text = fs.readFileSync(filePath, "utf8");
        messages = eslint.verify(text, config);
    } else {
        console.log("Could not find file at '%s'.", filePath);
        process.exit(1);
    }
    // always set this for formatters
    messages.forEach(function(message) {
        message.filePath = filename;
    });

    // apply source-map option
    if (options.m) {
        mapSourcePositions(filePath, text, messages);
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
function processFiles(files, config, options) {

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
        return previous + processFile(file, config, options);
    }, 0);

    printResults(config);

    return errors;

}

/**
 * Update messages to point to the original files by solving sourceMap directive in the linted code
 * @param {string} path of javascript file.
 * @param {string} content of the javascript file.
 * @param {Array} message objects to update.
 */
// based on https://github.com/evanw/node-source-map-support
function mapSourcePositions(filePath, text, messages) {

    // get the URL of the source map
    var match = /\/\/[#@]\s*sourceMappingURL=(.*)\s*$/m.exec(text);
    if (!match) {
        return;
    }
    var sourceMappingURL = match[1];

    // read the contents of the source map
    var sourceMapData;
    var base64 = false;
    var dataUrlPrefix = "data:application/json;base64,";

    if (sourceMappingURL.slice(0, dataUrlPrefix.length).toLowerCase() === dataUrlPrefix) {
        // support source map URL as a data url
        base64 = true;
        sourceMapData = new Buffer(sourceMappingURL.slice(dataUrlPrefix.length), "base64").toString();
    }
    else {
        // support source map URLs relative to the source URL
        var dir = path.dirname(filePath);
        sourceMappingURL = path.resolve(dir, sourceMappingURL);

        if (existsSync(sourceMappingURL)) {
            sourceMapData = fs.readFileSync(sourceMappingURL, "utf8");
        }
    }

    if (sourceMapData) {
        messages.forEach(function(message) {
            var map = new SourceMapConsumer(sourceMapData);

            // conveniently ducktype message {line, column}
            var originalPosition = map.originalPositionFor(message);

            // only return the original position if a matching line was found.
            if (originalPosition.source !== null) {

                // copy to message
                if (base64){
                    message.filePath = dataUrlPrefix + originalPosition.source;
                }
                else {
                    message.filePath = path.resolve(path.dirname(sourceMappingURL), originalPosition.source);
                }
                message.line = originalPosition.line;
                message.column = originalPosition.column;
            }
        });
    }
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

            result = processFiles(files, config, currentOptions);

            // result is the number of errors (not warnings)
            return result > 0 ? 1 : 0;
        }

        return 0;

    }

};



module.exports = cli;
