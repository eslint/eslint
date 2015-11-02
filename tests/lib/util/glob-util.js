/**
 * @fileoverview Utilities for working with globs and the filesystem.
 * @author Ian VanSchooten
 * @copyright 2015 Ian VanSchooten. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    os = require("os"),
    sh = require("shelljs"),
    globUtil = require("../../../lib/util/glob-util"),
    fs = require("fs");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var fixtureDir;

/**
 * Returns the path inside of the fixture directory.
 * @returns {string} The path inside the fixture directory.
 * @private
 */
function getFixturePath() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(fs.realpathSync(fixtureDir));
    return path.join.apply(path, args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("globUtil", function() {

    describe("resolveFileGlobPatterns()", function() {

        it("should convert a directory name with no provided extensions into a glob pattern", function() {
            var patterns = ["lib"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["lib/**/*.js"]);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", function() {
            var patterns = ["lib"];
            var extensions = [".jsx"];
            var result = globUtil.resolveFileGlobPatterns(patterns, extensions);

            assert.deepEqual(result, ["lib/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", function() {
            var patterns = ["lib"];
            var extensions = [".jsx", ".js"];
            var result = globUtil.resolveFileGlobPatterns(patterns, extensions);

            assert.deepEqual(result, ["lib/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", function() {
            var patterns = ["lib", "tests"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["lib/**/*.js", "tests/**/*.js"]);
        });

        it("should remove leading './' from glob patterns", function() {
            var patterns = ["./lib"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["lib/**/*.js"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", function() {
            var patterns = ["lib/"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["lib/**/*.js"]);
        });

        it("should return filenames as they are", function() {
            var patterns = ["some-file.js"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", function() {
            var patterns = ["lib\\example.js"];
            var result = globUtil.resolveFileGlobPatterns(patterns);

            assert.deepEqual(result, ["lib/example.js"]);
        });
    });

    describe("listFilesToProcess()", function() {

        // copy into clean area so as not to get "infected" by this project's .eslintignore files
        before(function() {
            fixtureDir = os.tmpdir() + "/eslint/fixtures";
            sh.mkdir("-p", fixtureDir);
            sh.cp("-r", "./tests/fixtures/.", fixtureDir);
        });

        after(function() {
            sh.rm("-r", fixtureDir);
        });

        it("should return an array with a resolved (absolute) filename", function() {
            var patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns);

            var file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [file1]);
        });

        it("should return all files matching a glob pattern", function() {
            var patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns);

            var file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            var file2 = getFixturePath("glob-util", "two-js-files", "foo.js");

            assert.equal(result.length, 2);
            assert.deepEqual(result, [file1, file2]);
        });

        it("should return all files matching multiple glob patterns", function() {
            var patterns = [
                getFixturePath("glob-util", "two-js-files", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "**/*.js")
            ];
            var result = globUtil.listFilesToProcess(patterns);

            var file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            var file2 = getFixturePath("glob-util", "two-js-files", "foo.js");
            var file3 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.equal(result.length, 3);
            assert.deepEqual(result, [file1, file2, file3]);
        });

        it("should not return hidden files for standard glob patterns", function() {
            var patterns = [getFixturePath("glob-util", "hidden", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return hidden files if included in glob pattern", function() {
            var patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
            var result = globUtil.listFilesToProcess(patterns);

            var file1 = getFixturePath("glob-util", "hidden", ".foo.js");

            assert.equal(result.length, 1);
            assert.deepEqual(result, [file1]);
        });

        it("should not return a file which does not exist", function() {
            var patterns = ["tests/fixtures/glob-util/hidden/bar.js"];
            var result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should not return an ignored file", function() {
            // Relying here on the .eslintignore from the repo root
            var patterns = ["tests/fixtures/glob-util/ignored/**/*.js"];
            var result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return an ignored file, if ignore option is turned off", function() {
            var options = { ignore: false };
            var patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 1);
        });

        it("should not return a file listed in a specified ignore file", function() {
            var options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
            var patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, options);
            assert.equal(result.length, 0);
        });

        it("should not return a file listed in a specified ignore pattern", function() {
            var options = { ignore: true, ignorePattern: "**/foo.js" };
            var patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, options);
            assert.equal(result.length, 0);
        });

    });
});
