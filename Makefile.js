/**
 * @fileoverview Build file
 * @author nzakas
 */
/*global target, exec, echo, find, cat, rm, mv*/

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
    target.test();
    exec("npm version " + type);
    target.changelog();
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
    TEST_FILES = find("tests/lib/").filter(fileType("js")).join(" "),

    MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

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
    exec(JSHINT + JS_FILES);
};

target.test = function() {
    target.lint();
    exec(ISTANBUL + " cover " + MOCHA + TEST_FILES);
    exec(ISTANBUL + "check-coverage --statement 95 --branch 95 --function 95 --lines 95");
};

target.docs = function() {
    echo("Generating documentation");
    exec(JSDOC + "-d jsdoc lib");
    echo("Documentation has been output to /jsdoc");
};

target.changelog = function() {

    // get most recent two tags
    var tags = exec("git tag", { silent: true }).output.trim().split(/\s/g),
        rangeTags = tags.slice(tags.length - 2),
        now = new Date(),
        timestamp = MONTHS[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();

    // output header
    (rangeTags[1] + " - " + timestamp + "\n").to("CHANGELOG.tmp");

    // get log statements
    var logs = exec("git log --pretty=format:\"* %s (%an)\" " + rangeTags.join(".."), {silent:true}).output.split(/\n/g);
    logs = logs.filter(function(line) {
        return line.indexOf("Merge pull request") === -1 && line.indexOf("Merge branch") === -1;
    });
    logs.push(""); // to create empty lines
    logs.unshift("");

    // output log statements
    logs.join("\n").toEnd("CHANGELOG.tmp");

    // switch-o change-o
    cat("CHANGELOG.tmp", "CHANGELOG.md").to("CHANGELOG.md.tmp");
    rm("CHANGELOG.tmp");
    rm("CHANGELOG.md");
    mv("CHANGELOG.md.tmp", "CHANGELOG.md");

    // add into commit
    exec("git add CHANGELOG.md");
    exec("git commit --amend --no-edit");

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
