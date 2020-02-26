/**
 * @fileoverview Tests for OverrideTester class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const assert = require("assert");
const { Console } = require("console");
const path = require("path");
const { Writable } = require("stream");
const { OverrideTester } = require("../../../../lib/cli-engine/config-array/override-tester");

describe("OverrideTester", () => {
    describe("'create(files, excludedFiles, basePath)' should create a tester.", () => {
        for (const { files, excludedFiles, basePath } of [
            { files: void 0, excludedFiles: void 0, basePath: process.cwd() },
            { files: [], excludedFiles: [], basePath: process.cwd() }
        ]) {
            it(`should return null if ${JSON.stringify({ files, excludedFiles, basePath })} was given.`, () => {
                assert.strictEqual(
                    OverrideTester.create(files, excludedFiles, basePath),
                    null
                );
            });
        }

        it("should return an 'OverrideTester' instance that has given parameters if strings were given.", () => {
            const files = "*.js";
            const excludedFiles = "ignore/*";
            const basePath = process.cwd();
            const tester = OverrideTester.create(files, excludedFiles, basePath);

            assert.strictEqual(tester.patterns.length, 1);
            assert.strictEqual(tester.patterns[0].includes.length, 1);
            assert.strictEqual(tester.patterns[0].excludes.length, 1);
            assert.strictEqual(tester.patterns[0].includes[0].pattern, files);
            assert.strictEqual(tester.patterns[0].excludes[0].pattern, excludedFiles);
            assert.strictEqual(tester.basePath, basePath);
        });

        it("should return an 'OverrideTester' instance that has given parameters if arrays were given.", () => {
            const files = ["*.js"];
            const excludedFiles = ["ignore/*"];
            const basePath = process.cwd();
            const tester = OverrideTester.create(files, excludedFiles, basePath);

            assert.strictEqual(tester.patterns.length, 1);
            assert.strictEqual(tester.patterns[0].includes.length, 1);
            assert.strictEqual(tester.patterns[0].excludes.length, 1);
            assert.strictEqual(tester.patterns[0].includes[0].pattern, files[0]);
            assert.strictEqual(tester.patterns[0].excludes[0].pattern, excludedFiles[0]);
            assert.strictEqual(tester.basePath, basePath);
        });
    });

    describe("'and(a, b)' should return either or create another tester what includes both.", () => {
        it("should return null if both were null.", () => {
            assert.strictEqual(OverrideTester.and(null, null), null);
        });

        it("should return a new tester with the the first one's properties if the second one was null.", () => {
            const tester = OverrideTester.create("*.js", null, process.cwd());
            const result = OverrideTester.and(tester, null);

            assert.notStrictEqual(result, tester);
            assert.strictEqual(result.patterns, tester.patterns);
            assert.strictEqual(result.basePath, tester.basePath);
        });

        it("should return a new tester with the the second one's properties if the first one was null.", () => {
            const tester = OverrideTester.create("*.js", null, process.cwd());
            const result = OverrideTester.and(null, tester);

            assert.notStrictEqual(result, tester);
            assert.strictEqual(result.patterns, tester.patterns);
            assert.strictEqual(result.basePath, tester.basePath);
        });

        it("should return another one what includes both patterns if both are testers.", () => {
            const tester1 = OverrideTester.create("*.js");
            const tester2 = OverrideTester.create("*.ts");
            const tester3 = OverrideTester.and(tester1, tester2);

            assert.strictEqual(tester3.patterns.length, 2);
            assert.strictEqual(tester3.patterns[0], tester1.patterns[0]);
            assert.strictEqual(tester3.patterns[1], tester2.patterns[0]);
        });
    });

    describe("'test(filePath)' method", () => {
        it("should throw an error if no arguments were given.", () => {
            assert.throws(() => {
                OverrideTester.create(["*.js"], [], process.cwd()).test();
            }, /'filePath' should be an absolute path, but got undefined/u);
        });

        it("should throw an error if a non-string value was given.", () => {
            assert.throws(() => {
                OverrideTester.create(["*.js"], [], process.cwd()).test(100);
            }, /'filePath' should be an absolute path, but got 100/u);
        });

        it("should throw an error if a relative path was given.", () => {
            assert.throws(() => {
                OverrideTester.create(["*.js"], [], process.cwd()).test("foo/bar.js");
            }, /'filePath' should be an absolute path, but got foo\/bar\.js/u);
        });

        it("should return true only when both conditions are matched if the tester was created by 'and' factory function.", () => {
            const tester = OverrideTester.and(
                OverrideTester.create(["*.js"], [], process.cwd()),
                OverrideTester.create(["test/**"], [], process.cwd())
            );

            assert.strictEqual(tester.test(path.resolve("test/a.js")), true);
            assert.strictEqual(tester.test(path.resolve("lib/a.js")), false);
            assert.strictEqual(tester.test(path.resolve("test/a.ts")), false);
        });

        /**
         * Test if a given file path matches to the given condition.
         *
         * The test cases which depend on this function were moved from
         * 'tests/lib/config/config-ops.js' when refactoring to keep the
         * cumulated test cases.
         *
         * Previously, the testing logic of `overrides` properties had been
         * implemented in `ConfigOps.pathMatchesGlobs()` function. But
         * currently, it's implemented in `OverrideTester` class.
         * @param {string} filePath The file path to test patterns against
         * @param {string|string[]} files One or more glob patterns
         * @param {string|string[]} [excludedFiles] One or more glob patterns
         * @returns {boolean} The result.
         */
        function test(filePath, files, excludedFiles) {
            const basePath = process.cwd();
            const tester = OverrideTester.create(files, excludedFiles, basePath);

            return tester.test(path.resolve(basePath, filePath));
        }

        /**
         * Emits a test that confirms the specified file path matches the specified combination of patterns.
         * @param {string} filePath The file path to test patterns against
         * @param {string|string[]} patterns One or more glob patterns
         * @param {string|string[]} [excludedPatterns] One or more glob patterns
         * @returns {void}
         */
        function match(filePath, patterns, excludedPatterns) {
            it(`matches ${filePath} given '${patterns.join("','")}' includes and '${excludedPatterns.join("','")}' excludes`, () => {
                const result = test(filePath, patterns, excludedPatterns);

                assert.strictEqual(result, true);
            });
        }

        /**
         * Emits a test that confirms the specified file path does not match the specified combination of patterns.
         * @param {string} filePath The file path to test patterns against
         * @param {string|string[]} patterns One or more glob patterns
         * @param {string|string[]} [excludedPatterns] One or more glob patterns
         * @returns {void}
         */
        function noMatch(filePath, patterns, excludedPatterns) {
            it(`does not match ${filePath} given '${patterns.join("','")}' includes and '${excludedPatterns.join("','")}' excludes`, () => {
                const result = test(filePath, patterns, excludedPatterns);

                assert.strictEqual(result, false);
            });
        }

        /**
         * Emits a test that confirms the specified pattern throws an error.
         * @param {string} filePath The file path to test the pattern against
         * @param {string} pattern The glob pattern that should trigger the error condition
         * @param {string} expectedMessage The expected error's message
         * @returns {void}
         */
        function error(filePath, pattern, expectedMessage) {
            it(`emits an error given '${pattern}'`, () => {
                let errorMessage;

                try {
                    test(filePath, pattern);
                } catch (e) {
                    errorMessage = e.message;
                }

                assert.strictEqual(errorMessage, expectedMessage);
            });
        }

        // files in the project root
        match("foo.js", ["foo.js"], []);
        match("foo.js", ["*"], []);
        match("foo.js", ["*.js"], []);
        match("foo.js", ["**/*.js"], []);
        match("bar.js", ["*.js"], ["foo.js"]);
        match("foo.js", ["./foo.js"], []);
        match("foo.js", ["./*"], []);
        match("foo.js", ["./**"], []);

        noMatch("foo.js", ["*"], ["foo.js"]);
        noMatch("foo.js", ["*.js"], ["foo.js"]);
        noMatch("foo.js", ["**/*.js"], ["foo.js"]);

        // files in a subdirectory
        match("subdir/foo.js", ["foo.js"], []);
        match("subdir/foo.js", ["*"], []);
        match("subdir/foo.js", ["*.js"], []);
        match("subdir/foo.js", ["**/*.js"], []);
        match("subdir/foo.js", ["subdir/*.js"], []);
        match("subdir/foo.js", ["subdir/foo.js"], []);
        match("subdir/foo.js", ["subdir/*"], []);
        match("subdir/second/foo.js", ["subdir/**"], []);
        match("subdir/foo.js", ["./**"], []);
        match("subdir/foo.js", ["./subdir/**"], []);
        match("subdir/foo.js", ["./subdir/*"], []);

        noMatch("subdir/foo.js", ["./foo.js"], []);
        noMatch("subdir/foo.js", ["*"], ["subdir/**"]);
        noMatch("subdir/very/deep/foo.js", ["*.js"], ["subdir/**"]);
        noMatch("subdir/second/foo.js", ["subdir/*"], []);
        noMatch("subdir/second/foo.js", ["subdir/**"], ["subdir/second/*"]);

        // error conditions
        error("foo.js", ["/*.js"], "Invalid override pattern (expected relative path not containing '..'): /*.js");
        error("foo.js", ["/foo.js"], "Invalid override pattern (expected relative path not containing '..'): /foo.js");
        error("foo.js", ["../**"], "Invalid override pattern (expected relative path not containing '..'): ../**");
    });

    describe("'JSON.stringify(...)' should return readable JSON; not include 'Minimatch' objects", () => {
        it("should return an object that has three properties 'includes', 'excludes', and 'basePath' if that 'patterns' property include one object.", () => {
            const files = "*.js";
            const excludedFiles = "test/*";
            const basePath = process.cwd();
            const tester = OverrideTester.create(files, excludedFiles, basePath);

            assert.strictEqual(
                JSON.stringify(tester),
                `{"includes":["${files}"],"excludes":["${excludedFiles}"],"basePath":${JSON.stringify(basePath)}}`
            );
        });

        it("should return an object that has two properties 'AND' and 'basePath' if that 'patterns' property include two or more objects.", () => {
            const files1 = "*.js";
            const excludedFiles1 = "test/*";
            const files2 = "*.story.js";
            const excludedFiles2 = "src/*";
            const basePath = process.cwd();
            const tester = OverrideTester.and(
                OverrideTester.create(files1, excludedFiles1, basePath),
                OverrideTester.create(files2, excludedFiles2, basePath)
            );

            assert.deepStrictEqual(
                JSON.parse(JSON.stringify(tester)),
                {
                    AND: [
                        { includes: [files1], excludes: [excludedFiles1] },
                        { includes: [files2], excludes: [excludedFiles2] }
                    ],
                    basePath
                }
            );
        });
    });

    describe("'console.log(...)' should print readable string; not include 'Minimatch' objects", () => {
        const localConsole = new Console(new Writable());

        it("should use 'toJSON()' method.", () => {
            const tester = OverrideTester.create("*.js", "", process.cwd());
            let called = false;

            tester.toJSON = () => {
                called = true;
                return "";
            };

            localConsole.log(tester);

            assert(called);
        });
    });
});
