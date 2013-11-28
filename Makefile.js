/**
 * @fileoverview Build file
 * @author nzakas
 */
/*global target, exec, echo, find*/

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates a function that matches files with a particular extension.
 * @param {string} extension The file extension (i.e. "js")
 * @returns {Function} The function to pass into a filter method.
 * @private
 */
function fileType(extension) {
    return function(filename) {
        return filename.substring(filename.lastIndexOf(".") + 1) === extension;
    };
}

/**
 * Creates a release version tag and pushes to origin.
 * @param {string} type The type of release to do (patch, minor, major)
 * @returns {void}
 */
function release(type) {
    exec("npm version " + type);
    exec("git push origin master --tags");
}

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

var NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",

    // Utilities - intentional extra space at the end of each string
    JSON_LINT = NODE + NODE_MODULES + "jsonlint/lib/cli.js ",
    ISTANBUL = NODE + NODE_MODULES + "istanbul/lib/cli.js ",
    MOCHA = NODE_MODULES + "mocha/bin/_mocha ",
    JSDOC = NODE + NODE_MODULES + "jsdoc/jsdoc.js ",
    JSHINT = NODE + NODE_MODULES + "jshint/bin/jshint ",
    ESLINT = NODE + " bin/eslint.js ",

    // Files
    JS_FILES = find("lib/").filter(fileType("js")).join(" "),
    JSON_FILES = find("conf/").filter(fileType("json")).join(" ") + " .eslintrc .jshintrc",
    TEST_FILES = find("tests/lib/").filter(fileType("js")).join(" ");

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    echo("Validating JSON Files");
    exec(JSON_LINT + "-q -c " + JSON_FILES);

    echo("Validating JavaScript files");
    exec(ESLINT + " " + JS_FILES);
};

target.test = function() {
//    target.lint();
    exec(ISTANBUL + " cover " + MOCHA + TEST_FILES);
    exec(ISTANBUL + "check-coverage --statement 95 --branch 95 --function 95 --lines 95");
};

target.docs = function() {
    echo("Generating documentation");
    exec(JSDOC + "-d jsdoc " + JS_DIRS.join(" "));
    echo("Documentation has been output to /jsdoc");
};

target.patch = function() {
    release("patch");
};

target.minor = function() {
    release("minor");
};

target.major = function() {
    release("major");
};
