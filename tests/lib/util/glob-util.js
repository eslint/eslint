/**
 * @fileoverview Utilities for working with globs and the filesystem.
 * @author Ian VanSchooten
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
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
    const args = Array.prototype.slice.call(arguments);

    args.unshift(fs.realpathSync(fixtureDir));
    return path.join.apply(path, args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("globUtil", () => {

    before(() => {
        fixtureDir = `${os.tmpdir()}/eslint/tests/fixtures/`;
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/*", fixtureDir);
    });

    after(() => {
        sh.rm("-r", fixtureDir);
    });

    describe("resolveFileGlobPatterns()", () => {

        it("should convert a directory name with no provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file")];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);
            const expected = [`${getFixturePath("glob-util", "one-js-file").replace(/\\/g, "/")}/**/*.js`];

            assert.deepEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx"]
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx", ".js"]
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", () => {
            const patterns = ["one-js-file", "two-js-files"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js", "two-js-files/**/*.js"]);
        });

        it("should remove leading './' from glob patterns", () => {
            const patterns = ["./one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", () => {
            const patterns = ["one-js-file/"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should return filenames as they are", () => {
            const patterns = ["some-file.js"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", () => {
            const patterns = ["one-js-file\\example.js"];
            const opts = {
                cwd: getFixturePath()
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, ["one-js-file/example.js"]);
        });

        it("should ignore empty patterns", () => {
            const patterns = [""];
            const opts = {
                cwd: getFixturePath()
            };
            const result = globUtil.resolveFileGlobPatterns(patterns, opts);

            assert.deepEqual(result, []);
        });

    });

    describe("listFilesToProcess()", () => {

        it("should return an array with a resolved (absolute) filename", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [{ filename: file1, ignored: false }]);
        });

        it("should return all files matching a glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            const file2 = getFixturePath("glob-util", "two-js-files", "foo.js");

            assert.equal(result.length, 2);
            assert.deepEqual(result, [
                { filename: file1, ignored: false },
                { filename: file2, ignored: false }
            ]);
        });

        it("should return all files matching multiple glob patterns", () => {
            const patterns = [
                getFixturePath("glob-util", "two-js-files", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "**/*.js")
            ];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            const file2 = getFixturePath("glob-util", "two-js-files", "foo.js");
            const file3 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.equal(result.length, 3);
            assert.deepEqual(result, [
                { filename: file1, ignored: false },
                { filename: file2, ignored: false },
                { filename: file3, ignored: false }
            ]);
        });

        it("should not return hidden files for standard glob patterns", () => {
            const patterns = [getFixturePath("glob-util", "hidden", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.equal(result.length, 0);
        });

        it("should return hidden files if included in glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "hidden", ".foo.js");

            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                { filename: file1, ignored: false }
            ]);
        });

        it("should silently ignore default ignored files if not passed explicitly", () => {
            const directory = getFixturePath("glob-util", "hidden");
            const patterns = [directory];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.equal(result.length, 0);
        });

        it("should ignore and warn for default ignored files when passed explicitly", () => {
            const filename = getFixturePath("glob-util", "hidden", ".foo.js");
            const patterns = [filename];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.equal(result.length, 1);
            assert.deepEqual(result[0], { filename, ignored: true });
        });

        it("should silently ignore default ignored files if not passed explicitly even if ignore is false", () => {
            const directory = getFixturePath("glob-util", "hidden");
            const patterns = [directory];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                ignore: false
            });

            assert.equal(result.length, 0);
        });

        it("should not ignore default ignored files when passed explicitly if ignore is false", () => {
            const filename = getFixturePath("glob-util", "hidden", ".foo.js");
            const patterns = [filename];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                ignore: false
            });

            assert.equal(result.length, 1);
            assert.deepEqual(result[0], { filename, ignored: false });
        });

        it("should not return a file which does not exist", () => {
            const patterns = ["tests/fixtures/glob-util/hidden/bar.js"];
            const result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should not return an ignored file", () => {

            // Relying here on the .eslintignore from the repo root
            const patterns = ["tests/fixtures/glob-util/ignored/**/*.js"];
            const result = globUtil.listFilesToProcess(patterns);

            assert.equal(result.length, 0);
        });

        it("should return an ignored file, if ignore option is turned off", () => {
            const options = { ignore: false };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 1);
        });

        it("should not return a file from a glob if it matches a pattern in an ignore file", () => {
            const options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 0);
        });

        it("should not return a file from a glob if matching a specified ignore pattern", () => {
            const options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            const result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 0);
        });

        it("should return a file only once if listed in more than 1 pattern", () => {
            const patterns = [
                getFixturePath("glob-util", "one-js-file", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "baz.js")
            ];
            const result = globUtil.listFilesToProcess(patterns, {
                cwd: path.join(fixtureDir, "..")
            });

            const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepEqual(result, [
                { filename: file1, ignored: false }
            ]);
        });

        it("should set 'ignored: true' for files that are explicitly specified but ignored", () => {
            const options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            const filename = getFixturePath("glob-util", "ignored", "foo.js");
            const patterns = [filename];
            const result = globUtil.listFilesToProcess(patterns, options);

            assert.equal(result.length, 1);
            assert.deepEqual(result, [
                { filename, ignored: true }
            ]);
        });

        it("should not return files from default ignored folders", () => {
            const options = { cwd: getFixturePath("glob-util") };
            const glob = getFixturePath("glob-util", "**/*.js");
            const patterns = [glob];
            const result = globUtil.listFilesToProcess(patterns, options);
            const resultFilenames = result.map(resultObj => resultObj.filename);

            assert.notInclude(resultFilenames, getFixturePath("glob-util", "node_modules", "dependency.js"));
        });

        it("should return unignored files from default ignored folders", () => {
            const options = { ignorePattern: "!/node_modules/dependency.js", cwd: getFixturePath("glob-util") };
            const glob = getFixturePath("glob-util", "**/*.js");
            const patterns = [glob];
            const result = globUtil.listFilesToProcess(patterns, options);
            const unignoredFilename = getFixturePath("glob-util", "node_modules", "dependency.js");

            assert.includeDeepMembers(result, [{ filename: unignoredFilename, ignored: false }]);
        });
    });
});
