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
    globUtils = require("../../../lib/util/glob-utils"),
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
function getFixturePath(...args) {
    return path.join(fs.realpathSync(fixtureDir), ...args);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("globUtils", () => {

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
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should not convert path with globInputPaths option false", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                globInputPaths: false
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file")];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);
            const expected = [`${getFixturePath("glob-util", "one-js-file").replace(/\\/gu, "/")}/**/*.js`];

            assert.deepStrictEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx"]
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.jsx"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx", ".js"]
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", () => {
            const patterns = ["one-js-file", "two-js-files"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.js", "two-js-files/**/*.js"]);
        });

        it("should remove leading './' from glob patterns", () => {
            const patterns = ["./one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", () => {
            const patterns = ["one-js-file/"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/**/*.js"]);
        });

        it("should return filenames as they are", () => {
            const patterns = ["some-file.js"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", () => {
            const patterns = ["one-js-file\\example.js"];
            const opts = {
                cwd: getFixturePath()
            };
            const result = globUtils.resolveFileGlobPatterns(patterns, opts);

            assert.deepStrictEqual(result, ["one-js-file/example.js"]);
        });
    });

    describe("listFilesToProcess()", () => {

        it("should return an array with a resolved (absolute) filename", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepStrictEqual(result, [{ filename: file1, ignored: false }]);
        });

        it("should return an array with a unmodified filename", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                globInputPaths: false
            });

            const file1 = getFixturePath("glob-util", "one-js-file", "**/*.js");

            assert.isArray(result);
            assert.deepStrictEqual(result, [{ filename: file1, ignored: false }]);
        });

        it("should return all files matching a glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            const file2 = getFixturePath("glob-util", "two-js-files", "foo.js");

            assert.strictEqual(result.length, 2);
            assert.deepStrictEqual(result, [
                { filename: file1, ignored: false },
                { filename: file2, ignored: false }
            ]);
        });

        it("should return all files matching multiple glob patterns", () => {
            const patterns = [
                getFixturePath("glob-util", "two-js-files", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "**/*.js")
            ];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "two-js-files", "bar.js");
            const file2 = getFixturePath("glob-util", "two-js-files", "foo.js");
            const file3 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.strictEqual(result.length, 3);
            assert.deepStrictEqual(result, [
                { filename: file1, ignored: false },
                { filename: file2, ignored: false },
                { filename: file3, ignored: false }
            ]);
        });

        it("should ignore hidden files for standard glob patterns", () => {
            const patterns = [getFixturePath("glob-util", "hidden", "**/*.js")];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, {
                    cwd: getFixturePath()
                });
            }, `All files matched by '${patterns[0]}' are ignored.`);
        });

        it("should return hidden files if included in glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            const file1 = getFixturePath("glob-util", "hidden", ".foo.js");

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result, [
                { filename: file1, ignored: false }
            ]);
        });

        it("should ignore default ignored files if not passed explicitly", () => {
            const directory = getFixturePath("glob-util", "hidden");
            const patterns = [directory];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, {
                    cwd: getFixturePath()
                });
            }, `All files matched by '${directory}' are ignored.`);
        });

        it("should ignore and warn for default ignored files when passed explicitly", () => {
            const filename = getFixturePath("glob-util", "hidden", ".foo.js");
            const patterns = [filename];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath()
            });

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], { filename, ignored: true });
        });

        it("should ignore default ignored files if not passed explicitly even if ignore is false", () => {
            const directory = getFixturePath("glob-util", "hidden");
            const patterns = [directory];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, {
                    cwd: getFixturePath(),
                    ignore: false
                });
            }, `All files matched by '${directory}' are ignored.`);
        });

        it("should not ignore default ignored files when passed explicitly if ignore is false", () => {
            const filename = getFixturePath("glob-util", "hidden", ".foo.js");
            const patterns = [filename];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: getFixturePath(),
                ignore: false
            });

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], { filename, ignored: false });
        });

        it("should throw an error for a file which does not exist", () => {
            const filename = getFixturePath("glob-util", "hidden", "bar.js");
            const patterns = [filename];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, {
                    cwd: getFixturePath(),
                    allowMissingGlobs: true
                });
            }, `No files matching '${filename}' were found.`);
        });

        it("should throw if a folder that does not have any applicable files is linted", () => {
            const filename = getFixturePath("glob-util", "empty");
            const patterns = [filename];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, {
                    cwd: getFixturePath()
                });
            }, `No files matching '${filename}' were found.`);
        });

        it("should throw if only ignored files match a glob", () => {
            const pattern = getFixturePath("glob-util", "ignored");
            const options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };

            assert.throws(() => {
                globUtils.listFilesToProcess([pattern], options);
            }, `All files matched by '${pattern}' are ignored.`);
        });

        it("should throw an error if no files match a glob", () => {

            // Relying here on the .eslintignore from the repo root
            const patterns = ["tests/fixtures/glob-util/ignored/**/*.js"];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns);
            }, `No files matching '${patterns[0]}' were found.`);
        });

        it("should ignore empty patterns", () => {
            const patterns = [""];
            const result = globUtils.listFilesToProcess(patterns);

            assert.deepStrictEqual(result, []);
        });

        it("should return an ignored file, if ignore option is turned off", () => {
            const options = { ignore: false };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
            const result = globUtils.listFilesToProcess(patterns, options);

            assert.strictEqual(result.length, 1);
        });

        it("should ignore a file from a glob if it matches a pattern in an ignore file", () => {
            const options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, options);
            }, `All files matched by '${patterns[0]}' are ignored.`);
        });

        it("should ignore a file from a glob if matching a specified ignore pattern", () => {
            const options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];

            assert.throws(() => {
                globUtils.listFilesToProcess(patterns, options);
            }, `All files matched by '${patterns[0]}' are ignored.`);
        });

        it("should return a file only once if listed in more than 1 pattern", () => {
            const patterns = [
                getFixturePath("glob-util", "one-js-file", "**/*.js"),
                getFixturePath("glob-util", "one-js-file", "baz.js")
            ];
            const result = globUtils.listFilesToProcess(patterns, {
                cwd: path.join(fixtureDir, "..")
            });

            const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

            assert.isArray(result);
            assert.deepStrictEqual(result, [
                { filename: file1, ignored: false }
            ]);
        });

        it("should set 'ignored: true' for files that are explicitly specified but ignored", () => {
            const options = { ignore: true, ignorePattern: "foo.js", cwd: getFixturePath() };
            const filename = getFixturePath("glob-util", "ignored", "foo.js");
            const patterns = [filename];
            const result = globUtils.listFilesToProcess(patterns, options);

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result, [
                { filename, ignored: true }
            ]);
        });

        it("should not return files from default ignored folders", () => {
            const options = { cwd: getFixturePath("glob-util") };
            const glob = getFixturePath("glob-util", "**/*.js");
            const patterns = [glob];
            const result = globUtils.listFilesToProcess(patterns, options);
            const resultFilenames = result.map(resultObj => resultObj.filename);

            assert.notInclude(resultFilenames, getFixturePath("glob-util", "node_modules", "dependency.js"));
        });

        it("should return unignored files from default ignored folders", () => {
            const options = { ignorePattern: "!/node_modules/dependency.js", cwd: getFixturePath("glob-util") };
            const glob = getFixturePath("glob-util", "**/*.js");
            const patterns = [glob];
            const result = globUtils.listFilesToProcess(patterns, options);
            const unignoredFilename = getFixturePath("glob-util", "node_modules", "dependency.js");

            assert.includeDeepMembers(result, [{ filename: unignoredFilename, ignored: false }]);
        });
    });
});
