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

    before(function() {
        fixtureDir = os.tmpdir() + "/eslint/tests/fixtures/";
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/", fixtureDir);
    });

    after(function() {
        sh.rm("-r", fixtureDir);
    });

    describe("resolveFileGlobPatterns()", function() {

        it("should convert a directory name with no provided extensions into a glob pattern", function() {
            var patterns = ["one-js-file"];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", function() {
            var patterns = [getFixturePath("glob-util", "one-js-file")];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);
            var expected = [getFixturePath("glob-util", "one-js-file").replace(/\\/g, "/") + "/**/*.js"];

            assert.deepEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", function() {
            var patterns = ["one-js-file"];
            var opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx"]
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", function() {
            var patterns = ["one-js-file"];
            var opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx", ".js"]
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", function() {
            var patterns = ["one-js-file", "two-js-files"];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js", "two-js-files/**/*.js"]);
        });

        it("should remove leading './' from glob patterns", function() {
            var patterns = ["./one-js-file"];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", function() {
            var patterns = ["one-js-file/"];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should return filenames as they are", function() {
            var patterns = ["some-file.js"];
            var opts = {
                cwd: getFixturePath("glob-util")
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", function() {
            var patterns = ["one-js-file\\example.js"];
            var opts = {
                cwd: getFixturePath()
            };
            var result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/example.js"]);
        });

    });

    describe("listFilesToProcess()", function() {

        it("should return an array with a resolved (absolute) filename", function() {
            var patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            var file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [{filename: file1, ignored: false}]);
        });

        it("should return all files matching a glob pattern", function() {
            var patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            var file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            var file2 = getFixturePath("glob-util", "two-js-files", "foo.js");

            assert.equal(result.length, 2);
            assert.deepEqual(result, [
                {filename: file1, ignored: false},
                {filename: file2, ignored: false}
            ]);
        });

        it("should return all files matching multiple glob patterns", function() {
            var patterns = [
                getFixturePath("glob-util", "two-js-files", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "**/*.js")
            ];
            var result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            var file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            var file2 = getFixturePath("glob-util", "two-js-files", "foo.js");
            var file3 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.equal(result.length, 3);
            assert.deepEqual(result, [
                {filename: file1, ignored: false},
                {filename: file2, ignored: false},
                {filename: file3, ignored: false}
            ]);
        });

        it("should not return hidden files for standard glob patterns", function() {
            var patterns = [getFixturePath("glob-util", "hidden", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return hidden files if included in glob pattern", function() {
            var patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
            var result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                dotfiles: true
            });

            var file1 = getFixturePath("glob-util", "hidden", ".foo.js");

            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                {filename: file1, ignored: false}
            ]);
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

        it("should not return a file from a glob if it matches a pattern in an ignore file", function() {
            var options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
            var patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, options);
            assert.equal(result.length, 0);
        });

        it("should not return a file from a glob if matching a specified ignore pattern", function() {
            var options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            var patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            var result = globUtil.listFilesToProcess(patterns, options);
            assert.equal(result.length, 0);
        });

        it("should return a file only once if listed in more than 1 pattern", function() {
            var patterns = [
                getFixturePath("glob-util", "one-js-file", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "baz.js")
            ];
            var result = globUtil.listFilesToProcess(patterns, {
                cwd: path.join(fixtureDir, "..")
            });

            var file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [
                {filename: file1, ignored: false}
            ]);
        });

        it("should set 'ignored: true' for files that are explicitly specified but ignored", function() {
            var options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            var filename = getFixturePath("glob-util", "ignored", "foo.js");
            var patterns = [filename];
            var result = globUtil.listFilesToProcess(patterns, options);
            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                {filename: filename, ignored: true}
            ]);
        });

        it("should not return files from default ignored folders", function() {
            var options = { cwd: getFixturePath("glob-util") };
            var glob = getFixturePath("glob-util", "**/*.js");
            var patterns = [glob];
            var result = globUtil.listFilesToProcess(patterns, options);
            var resultFilenames = result.map(function(resultObj) {
                return resultObj.filename;
            });
            assert.notInclude(resultFilenames, getFixturePath("glob-util", "node_modules", "dependency.js"));
        });

        it("should return unignored files from default ignored folders", function() {
            var options = { ignorePattern: "!/node_modules/dependency.js", cwd: getFixturePath("glob-util") };
            var glob = getFixturePath("glob-util", "**/*.js");
            var patterns = [glob];
            var result = globUtil.listFilesToProcess(patterns, options);
            var unignoredFilename = getFixturePath("glob-util", "node_modules", "dependency.js");
            assert.includeDeepMembers(result, [{filename: unignoredFilename, ignored: false}]);
        });
    });
});
