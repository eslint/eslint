/**
 * @fileoverview Tests for FileEnumerator class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const os = require("os");
const { assert } = require("chai");
const sh = require("shelljs");
const {
    Legacy: {
        CascadingConfigArrayFactory
    }
} = require("@eslint/eslintrc");
const { createCustomTeardown } = require("../../_utils");
const { FileEnumerator } = require("../../../lib/cli-engine/file-enumerator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FileEnumerator", () => {
    describe("'iterateFiles(patterns)' method should iterate files and configs.", () => {
        describe("with three directories ('lib', 'lib/nested', 'test') that contains 'one.js' and 'two.js'", () => {
            const root = path.join(os.tmpdir(), "eslint/file-enumerator");
            const files = {
                "lib/nested/one.js": "",
                "lib/nested/two.js": "",
                "lib/nested/parser.js": "",
                "lib/nested/.eslintrc.yml": "parser: './parser'",
                "lib/one.js": "",
                "lib/two.js": "",
                "test/one.js": "",
                "test/two.js": "",
                "test/.eslintrc.yml": "env: { mocha: true }",
                ".eslintignore": "/lib/nested/parser.js",
                ".eslintrc.json": JSON.stringify({
                    rules: {
                        "no-undef": "error",
                        "no-unused-vars": "error"
                    }
                })
            };
            const { prepare, cleanup, getPath } = createCustomTeardown({ cwd: root, files });

            /** @type {FileEnumerator} */
            let enumerator;

            beforeEach(async () => {
                await prepare();
                enumerator = new FileEnumerator({ cwd: getPath() });
            });

            afterEach(cleanup);

            it("should ignore empty strings.", () => {
                Array.from(enumerator.iterateFiles(["lib/*.js", ""])); // don't throw "file not found" error.
            });

            describe("if 'lib/*.js' was given,", () => {

                /** @type {Array<{config:(typeof import('../../../lib/cli-engine')).ConfigArray, filePath:string, ignored:boolean}>} */
                let list;

                beforeEach(() => {
                    list = [...enumerator.iterateFiles("lib/*.js")];
                });

                it("should list two files.", () => {
                    assert.strictEqual(list.length, 2);
                });

                it("should list 'lib/one.js' and 'lib/two.js'.", () => {
                    assert.deepStrictEqual(
                        list.map(entry => entry.filePath),
                        [
                            path.join(root, "lib/one.js"),
                            path.join(root, "lib/two.js")
                        ]
                    );
                });

                it("should use the config '.eslintrc.json' for both files.", () => {
                    assert.strictEqual(list[0].config, list[1].config);
                    assert.strictEqual(list[0].config.length, 3);
                    assert.strictEqual(list[0].config[0].name, "DefaultIgnorePattern");
                    assert.strictEqual(list[0].config[1].filePath, path.join(root, ".eslintrc.json"));
                    assert.strictEqual(list[0].config[2].filePath, path.join(root, ".eslintignore"));
                });
            });

            describe("if 'lib/**/*.js' was given,", () => {

                /** @type {Array<{config:(typeof import('../../../lib/cli-engine')).ConfigArray, filePath:string, ignored:boolean}>} */
                let list;

                beforeEach(() => {
                    list = [...enumerator.iterateFiles("lib/**/*.js")];
                });

                it("should list four files.", () => {
                    assert.strictEqual(list.length, 4);
                });

                it("should list 'lib/nested/one.js', 'lib/nested/two.js', 'lib/one.js', 'lib/two.js'.", () => {
                    assert.deepStrictEqual(
                        list.map(entry => entry.filePath),
                        [
                            path.join(root, "lib/nested/one.js"),
                            path.join(root, "lib/nested/two.js"),
                            path.join(root, "lib/one.js"),
                            path.join(root, "lib/two.js")
                        ]
                    );
                });

                it("should use the merged config of '.eslintrc.json' and 'lib/nested/.eslintrc.yml' for 'lib/nested/one.js' and 'lib/nested/two.js'.", () => {
                    assert.strictEqual(list[0].config, list[1].config);
                    assert.strictEqual(list[0].config.length, 4);
                    assert.strictEqual(list[0].config[0].name, "DefaultIgnorePattern");
                    assert.strictEqual(list[0].config[1].filePath, path.join(root, ".eslintrc.json"));
                    assert.strictEqual(list[0].config[2].filePath, path.join(root, "lib/nested/.eslintrc.yml"));
                    assert.strictEqual(list[0].config[3].filePath, path.join(root, ".eslintignore"));
                });

                it("should use the config '.eslintrc.json' for 'lib/one.js' and 'lib/two.js'.", () => {
                    assert.strictEqual(list[2].config, list[3].config);
                    assert.strictEqual(list[2].config.length, 3);
                    assert.strictEqual(list[2].config[0].name, "DefaultIgnorePattern");
                    assert.strictEqual(list[2].config[1].filePath, path.join(root, ".eslintrc.json"));
                    assert.strictEqual(list[2].config[2].filePath, path.join(root, ".eslintignore"));
                });
            });

            describe("if 'lib/*.js' and 'test/*.js' were given,", () => {

                /** @type {Array<{config:(typeof import('../../../lib/cli-engine')).ConfigArray, filePath:string, ignored:boolean}>} */
                let list;

                beforeEach(() => {
                    list = [...enumerator.iterateFiles(["lib/*.js", "test/*.js"])];
                });

                it("should list four files.", () => {
                    assert.strictEqual(list.length, 4);
                });

                it("should list 'lib/one.js', 'lib/two.js', 'test/one.js', 'test/two.js'.", () => {
                    assert.deepStrictEqual(
                        list.map(entry => entry.filePath),
                        [
                            path.join(root, "lib/one.js"),
                            path.join(root, "lib/two.js"),
                            path.join(root, "test/one.js"),
                            path.join(root, "test/two.js")
                        ]
                    );
                });

                it("should use the config '.eslintrc.json' for 'lib/one.js' and 'lib/two.js'.", () => {
                    assert.strictEqual(list[0].config, list[1].config);
                    assert.strictEqual(list[0].config.length, 3);
                    assert.strictEqual(list[0].config[0].name, "DefaultIgnorePattern");
                    assert.strictEqual(list[0].config[1].filePath, path.join(root, ".eslintrc.json"));
                    assert.strictEqual(list[0].config[2].filePath, path.join(root, ".eslintignore"));
                });

                it("should use the merged config of '.eslintrc.json' and 'test/.eslintrc.yml' for 'test/one.js' and 'test/two.js'.", () => {
                    assert.strictEqual(list[2].config, list[3].config);
                    assert.strictEqual(list[2].config.length, 4);
                    assert.strictEqual(list[2].config[0].name, "DefaultIgnorePattern");
                    assert.strictEqual(list[2].config[1].filePath, path.join(root, ".eslintrc.json"));
                    assert.strictEqual(list[2].config[2].filePath, path.join(root, "test/.eslintrc.yml"));
                    assert.strictEqual(list[2].config[3].filePath, path.join(root, ".eslintignore"));
                });
            });
        });

        // This group moved from 'tests/lib/util/glob-utils.js' when refactoring to keep the cumulated test cases.
        describe("with 'tests/fixtures/glob-utils' files", () => {
            let fixtureDir;

            /**
             * Returns the path inside of the fixture directory.
             * @param {...string} args file path segments.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFixturePath(...args) {
                return path.join(fs.realpathSync(fixtureDir), ...args);
            }

            /**
             * List files as a compatible shape with glob-utils.
             * @param {string|string[]} patterns The patterns to list files.
             * @param {Object} options The option for FileEnumerator.
             * @returns {{filename:string,ignored:boolean}[]} The listed files.
             */
            function listFiles(patterns, options) {
                return Array.from(
                    new FileEnumerator({
                        ...options,
                        configArrayFactory: new CascadingConfigArrayFactory({
                            ...options,

                            // Disable "No Configuration Found" error.
                            useEslintrc: false
                        })
                    }).iterateFiles(patterns),
                    ({ filePath, ignored }) => ({ filename: filePath, ignored })
                );
            }

            before(function() {

                /*
                 * GitHub Actions Windows and macOS runners occasionally
                 * exhibit extremely slow filesystem operations, during which
                 * copying fixtures exceeds the default test timeout, so raise
                 * it just for this hook. Mocha uses `this` to set timeouts on
                 * an individual hook level.
                 */
                this.timeout(60 * 1000); // eslint-disable-line no-invalid-this -- Mocha API
                fixtureDir = `${os.tmpdir()}/eslint/tests/fixtures/`;
                sh.mkdir("-p", fixtureDir);
                sh.cp("-r", "./tests/fixtures/*", fixtureDir);
            });

            after(() => {
                sh.rm("-r", fixtureDir);
            });

            describe("listFilesToProcess()", () => {
                it("should return an array with a resolved (absolute) filename", () => {
                    const patterns = [getFixturePath("glob-util", "one-js-file", "**/*.js")];
                    const result = listFiles(patterns, {
                        cwd: getFixturePath()
                    });

                    const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

                    assert.isArray(result);
                    assert.deepStrictEqual(result, [{ filename: file1, ignored: false }]);
                });

                it("should return all files matching a glob pattern", () => {
                    const patterns = [getFixturePath("glob-util", "two-js-files", "**/*.js")];
                    const result = listFiles(patterns, {
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
                    const result = listFiles(patterns, {
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
                        listFiles(patterns, {
                            cwd: getFixturePath()
                        });
                    }, `All files matched by '${patterns[0]}' are ignored.`);
                });

                it("should return hidden files if included in glob pattern", () => {
                    const patterns = [getFixturePath("glob-util", "hidden", "**/.*.js")];
                    const result = listFiles(patterns, {
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
                        listFiles(patterns, {
                            cwd: getFixturePath()
                        });
                    }, `All files matched by '${directory}' are ignored.`);
                });

                it("should ignore and warn for default ignored files when passed explicitly", () => {
                    const filename = getFixturePath("glob-util", "hidden", ".foo.js");
                    const patterns = [filename];
                    const result = listFiles(patterns, {
                        cwd: getFixturePath()
                    });

                    assert.strictEqual(result.length, 1);
                    assert.deepStrictEqual(result[0], { filename, ignored: true });
                });

                it("should ignore default ignored files if not passed explicitly even if ignore is false", () => {
                    const directory = getFixturePath("glob-util", "hidden");
                    const patterns = [directory];

                    assert.throws(() => {
                        listFiles(patterns, {
                            cwd: getFixturePath(),
                            ignore: false
                        });
                    }, `All files matched by '${directory}' are ignored.`);
                });

                it("should not ignore default ignored files when passed explicitly if ignore is false", () => {
                    const filename = getFixturePath("glob-util", "hidden", ".foo.js");
                    const patterns = [filename];
                    const result = listFiles(patterns, {
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
                        listFiles(patterns, {
                            cwd: getFixturePath(),
                            allowMissingGlobs: true
                        });
                    }, `No files matching '${filename}' were found.`);
                });

                it("should throw if a folder that does not have any applicable files is linted", () => {
                    const filename = getFixturePath("glob-util", "empty");
                    const patterns = [filename];

                    assert.throws(() => {
                        listFiles(patterns, {
                            cwd: getFixturePath()
                        });
                    }, `No files matching '${filename}' were found.`);
                });

                it("should throw if only ignored files match a glob", () => {
                    const pattern = getFixturePath("glob-util", "ignored");
                    const options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };

                    assert.throws(() => {
                        listFiles([pattern], options);
                    }, `All files matched by '${pattern}' are ignored.`);
                });

                it("should throw an error if no files match a glob", () => {

                    // Relying here on the .eslintignore from the repo root
                    const patterns = ["tests/fixtures/glob-util/ignored/**/*.js"];

                    assert.throws(() => {
                        listFiles(patterns);
                    }, `All files matched by '${patterns[0]}' are ignored.`);
                });

                it("should return an ignored file, if ignore option is turned off", () => {
                    const options = { ignore: false };
                    const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];
                    const result = listFiles(patterns, options);

                    assert.strictEqual(result.length, 1);
                });

                it("should ignore a file from a glob if it matches a pattern in an ignore file", () => {
                    const options = { ignore: true, ignorePath: getFixturePath("glob-util", "ignored", ".eslintignore") };
                    const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];

                    assert.throws(() => {
                        listFiles(patterns, options);
                    }, `All files matched by '${patterns[0]}' are ignored.`);
                });

                it("should ignore a file from a glob if matching a specified ignore pattern", () => {
                    const options = { ignore: true, cliConfig: { ignorePatterns: ["foo.js"] }, cwd: getFixturePath() };
                    const patterns = [getFixturePath("glob-util", "ignored", "**/*.js")];

                    assert.throws(() => {
                        listFiles(patterns, options);
                    }, `All files matched by '${patterns[0]}' are ignored.`);
                });

                it("should return a file only once if listed in more than 1 pattern", () => {
                    const patterns = [
                        getFixturePath("glob-util", "one-js-file", "**/*.js"),
                        getFixturePath("glob-util", "one-js-file", "baz.js")
                    ];
                    const result = listFiles(patterns, {
                        cwd: path.join(fixtureDir, "..")
                    });

                    const file1 = getFixturePath("glob-util", "one-js-file", "baz.js");

                    assert.isArray(result);
                    assert.deepStrictEqual(result, [
                        { filename: file1, ignored: false }
                    ]);
                });

                it("should set 'ignored: true' for files that are explicitly specified but ignored", () => {
                    const options = { ignore: true, cliConfig: { ignorePatterns: ["foo.js"] }, cwd: getFixturePath() };
                    const filename = getFixturePath("glob-util", "ignored", "foo.js");
                    const patterns = [filename];
                    const result = listFiles(patterns, options);

                    assert.strictEqual(result.length, 1);
                    assert.deepStrictEqual(result, [
                        { filename, ignored: true }
                    ]);
                });

                it("should not return files from default ignored folders", () => {
                    const options = { cwd: getFixturePath("glob-util") };
                    const glob = getFixturePath("glob-util", "**/*.js");
                    const patterns = [glob];
                    const result = listFiles(patterns, options);
                    const resultFilenames = result.map(resultObj => resultObj.filename);

                    assert.notInclude(resultFilenames, getFixturePath("glob-util", "node_modules", "dependency.js"));
                });

                it("should return unignored files from default ignored folders", () => {
                    const options = { cliConfig: { ignorePatterns: ["!/node_modules/dependency.js"] }, cwd: getFixturePath("glob-util") };
                    const glob = getFixturePath("glob-util", "**/*.js");
                    const patterns = [glob];
                    const result = listFiles(patterns, options);
                    const unignoredFilename = getFixturePath("glob-util", "node_modules", "dependency.js");

                    assert.includeDeepMembers(result, [{ filename: unignoredFilename, ignored: false }]);
                });

                it("should return unignored files from folders unignored in .eslintignore", () => {
                    const options = { cwd: getFixturePath("glob-util", "unignored"), ignore: true };
                    const glob = getFixturePath("glob-util", "unignored", "**/*.js");
                    const patterns = [glob];
                    const result = listFiles(patterns, options);

                    const filename = getFixturePath("glob-util", "unignored", "dir", "foo.js");

                    assert.strictEqual(result.length, 1);
                    assert.deepStrictEqual(result, [{ filename, ignored: false }]);
                });

                it("should return unignored files from folders unignored in .eslintignore for explicitly specified folder", () => {
                    const options = { cwd: getFixturePath("glob-util", "unignored"), ignore: true };
                    const dir = getFixturePath("glob-util", "unignored", "dir");
                    const patterns = [dir];
                    const result = listFiles(patterns, options);

                    const filename = getFixturePath("glob-util", "unignored", "dir", "foo.js");

                    assert.strictEqual(result.length, 1);
                    assert.deepStrictEqual(result, [{ filename, ignored: false }]);
                });
            });
        });

        describe("if contains symbolic links", async () => {
            const root = path.join(os.tmpdir(), "eslint/file-enumerator");
            const files = {
                "dir1/1.js": "",
                "dir1/2.js": "",
                "top-level.js": "",
                ".eslintrc.json": JSON.stringify({ rules: {} })
            };
            const dir2 = path.join(root, "dir2");
            const { prepare, cleanup } = createCustomTeardown({ cwd: root, files });

            beforeEach(async () => {
                await prepare();
                fs.mkdirSync(dir2);
                fs.symlinkSync(path.join(root, "top-level.js"), path.join(dir2, "top.js"), "file");
                fs.symlinkSync(path.join(root, "dir1"), path.join(dir2, "nested"), "dir");
            });

            afterEach(cleanup);

            it("should resolve", () => {
                const enumerator = new FileEnumerator({ cwd: root });
                const list = Array.from(enumerator.iterateFiles(["dir2/**/*.js"])).map(({ filePath }) => filePath);

                assert.deepStrictEqual(list, [
                    path.join(dir2, "nested", "1.js"),
                    path.join(dir2, "nested", "2.js"),
                    path.join(dir2, "top.js")
                ]);
            });

            it("should ignore broken links", () => {
                fs.unlinkSync(path.join(root, "top-level.js"));

                const enumerator = new FileEnumerator({ cwd: root });
                const list = Array.from(enumerator.iterateFiles(["dir2/**/*.js"])).map(({ filePath }) => filePath);

                assert.deepStrictEqual(list, [
                    path.join(dir2, "nested", "1.js"),
                    path.join(dir2, "nested", "2.js")
                ]);
            });
        });
    });

    // https://github.com/eslint/eslint/issues/13789
    describe("constructor default values when config extends eslint:recommended", () => {
        const root = path.join(os.tmpdir(), "eslint/file-enumerator");
        const files = {
            "file.js": "",
            ".eslintrc.json": JSON.stringify({
                extends: ["eslint:recommended", "eslint:all"]
            })
        };
        const { prepare, cleanup, getPath } = createCustomTeardown({ cwd: root, files });


        /** @type {FileEnumerator} */
        let enumerator;

        beforeEach(async () => {
            await prepare();
            enumerator = new FileEnumerator({ cwd: getPath() });
        });

        afterEach(cleanup);

        it("should not throw an exception iterating files", () => {
            Array.from(enumerator.iterateFiles(["."]));
        });
    });
});
