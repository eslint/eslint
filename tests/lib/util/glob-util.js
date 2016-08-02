/**
 * @fileoverview Utilities for working with globs and the filesystem.
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let assert = require("chai").assert,
    path = require("path"),
    os = require("os"),
    sh = require("shelljs"),
    globUtil = require("../../../lib/util/glob-util"),
    fs = require("fs");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

let fixtureDir;

/**
 * Returns the path inside of the fixture directory.
 * @returns {string} The path inside the fixture directory.
 * @private
 */
function getFixturePath() {
    let args = Array.prototype.slice.call(arguments);

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
            let patterns = ["one-js-file"];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", function() {
            let patterns = [getFixturePath("glob-util", "one-js-file")];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);
            let expected = [getFixturePath("glob-util", "one-js-file").replace(/\\/g, "/") + "/**/*.js"];

            assert.deepEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", function() {
            let patterns = ["one-js-file"];
            let opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx"]
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", function() {
            let patterns = ["one-js-file"];
            let opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx", ".js"]
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", function() {
            let patterns = ["one-js-file", "two-js-files"];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js", "two-js-files/**/*.js"]);
        });

        it("should remove leading './' from glob patterns", function() {
            let patterns = ["./one-js-file"];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", function() {
            let patterns = ["one-js-file/"];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should return filenames as they are", function() {
            let patterns = ["some-file.js"];
            let opts = {
                cwd: getFixturePath("glob-util")
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", function() {
            let patterns = ["one-js-file\\example.js"];
            let opts = {
                cwd: getFixturePath()
            };
            let result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/example.js"]);
        });

    });

    describe("listFilesToProcess()", function() {

        it("should return an array with a resolved (absolute) filename", function() {
            let patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            let file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [{filename: file1, ignored: false}]);
        });

        it("should return all files matching a glob pattern", function() {
            let patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            let file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            let file2 = getFixturePath("glob-util", "two-js-files", "foo.js");

            assert.equal(result.length, 2);
            assert.deepEqual(result, [
                {filename: file1, ignored: false},
                {filename: file2, ignored: false}
            ]);
        });

        it("should return all files matching multiple glob patterns", function() {
            let patterns = [
                getFixturePath("glob-util", "two-js-files", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "**/*.js")
            ];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            let file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            let file2 = getFixturePath("glob-util", "two-js-files", "foo.js");
            let file3 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.equal(result.length, 3);
            assert.deepEqual(result, [
                {filename: file1, ignored: false},
                {filename: file2, ignored: false},
                {filename: file3, ignored: false}
            ]);
        });

        it("should not return hidden files for standard glob patterns", function() {
            let patterns = [getFixturePath("glob-util", "hidden", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return hidden files if included in glob pattern", function() {
            let patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                dotfiles: true
            });

            let file1 = getFixturePath("glob-util", "hidden", ".foo.js");

            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                {filename: file1, ignored: false}
            ]);
        });

        it("should silently ignore default ignored files if not passed explicitly", function() {
            let directory = getFixturePath("glob-util", "hidden");
            let patterns = [directory];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.equal(result.length, 0);
        });

        it("should ignore and warn for default ignored files when passed explicitly", function() {
            let filename = getFixturePath("glob-util", "hidden", ".foo.js");
            let patterns = [filename];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.equal(result.length, 1);
            assert.deepEqual(result[0], { filename, ignored: true });
        });

        it("should silently ignore default ignored files if not passed explicitly even if ignore is false", function() {
            let directory = getFixturePath("glob-util", "hidden");
            let patterns = [directory];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                ignore: false
            });

            assert.equal(result.length, 0);
        });

        it("should not ignore default ignored files when passed explicitly if ignore is false", function() {
            let filename = getFixturePath("glob-util", "hidden", ".foo.js");
            let patterns = [filename];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                ignore: false
            });

            assert.equal(result.length, 1);
            assert.deepEqual(result[0], { filename, ignored: false });
        });

        it("should not return a file which does not exist", function() {
            let patterns = ["tests/fixtures/glob-util/hidden/bar.js"];
            let result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should not return an ignored file", function() {

            // Relying here on the .eslintignore from the repo root
            let patterns = ["tests/fixtures/glob-util/ignored/**/*.js"];
            let result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return an ignored file, if ignore option is turned off", function() {
            let options = { ignore: false };
            let patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 1);
        });

        it("should not return a file from a glob if it matches a pattern in an ignore file", function() {
            let options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
            let patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 0);
        });

        it("should not return a file from a glob if matching a specified ignore pattern", function() {
            let options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            let patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            let result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 0);
        });

        it("should return a file only once if listed in more than 1 pattern", function() {
            let patterns = [
                getFixturePath("glob-util", "one-js-file", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "baz.js")
            ];
            let result = globUtil.listFilesToProcess(patterns, {
                cwd: path.join(fixtureDir, "..")
            });

            let file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [
                {filename: file1, ignored: false}
            ]);
        });

        it("should set 'ignored: true' for files that are explicitly specified but ignored", function() {
            let options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            let filename = getFixturePath("glob-util", "ignored", "foo.js");
            let patterns = [filename];
            let result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                {filename, ignored: true}
            ]);
        });

        it("should not return files from default ignored folders", function() {
            let options = { cwd: getFixturePath("glob-util") };
            let glob = getFixturePath("glob-util", "**/*.js");
            let patterns = [glob];
            let result = globUtil.listFilesToProcess(patterns, options);
            let resultFilenames = result.map(function(resultObj) {
                return resultObj.filename;
            });

            assert.notInclude(resultFilenames, getFixturePath("glob-util", "node_modules", "dependency.js"));
        });

        it("should return unignored files from default ignored folders", function() {
            let options = { ignorePattern: "!/node_modules/dependency.js", cwd: getFixturePath("glob-util") };
            let glob = getFixturePath("glob-util", "**/*.js");
            let patterns = [glob];
            let result = globUtil.listFilesToProcess(patterns, options);
            let unignoredFilename = getFixturePath("glob-util", "node_modules", "dependency.js");

            assert.includeDeepMembers(result, [{filename: unignoredFilename, ignored: false}]);
        });
    });
});
