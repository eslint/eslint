/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var options = require("./options"),
    fs = require("fs"),
    path = require("path"),
    rules = require("./rules"),
    eslint = require("./eslint"),
    reporter = require("./reporters/compact");  // TODO: More reporters

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var DEFAULT_CONFIG = "../config/eslint.json",
    DEFAULT_RULES_DIR = "./rules";

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

            if (file[0] == ".") {
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

function processFile(filename, config) {

    // clear all existing settings for a new file
    eslint.reset();

    var text = fs.readFileSync(path.resolve(filename), "utf8"),
        messages = eslint.verify(text, config);

    console.log(reporter(eslint, messages, filename, config));
}

function processFiles(files, config) {

    var fullFileList = [];

    files.forEach(function(file) {
        if (isDirectory(file)) {
            fullFileList = fullFileList.concat(getFiles(file));
        } else {
            fullFileList.push(file);
        }
    });

    fullFileList.forEach(function(file) {
        processFile(file, config);
    });
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
     * @param {Function} [callback] The function to call when all processing is
     *      complete.
     * @returns {void}
     */
    execute: function(argv, callback) {

        var currentOptions = options.parse(argv),
            files = currentOptions._,
            config;

        if (currentOptions.h || !files.length) {
            options.help();
        } else {

            config = readConfig(currentOptions);

            // TODO: Figure out correct option vs. config for this
            // load rules
            if (currentOptions.rulesdir) {
                rules.load(currentOptions.rulesdir);
            }

            processFiles(files, config);

        }

    }

};










module.exports = cli;
