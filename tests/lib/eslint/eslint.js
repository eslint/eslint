/**
 * @fileoverview Tests for the ESLint class.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path");
const os = require("os");
const fs = require("fs");
const assert = require("chai").assert;
const shell = require("shelljs");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ESLint", () => {
    const examplePluginName = "eslint-plugin-example";
    const examplePluginNameWithNamespace = "@eslint/eslint-plugin-example";
    const examplePlugin = {
        rules: {
            "example-rule": require("../../fixtures/rules/custom-rule"),
            "make-syntax-error": require("../../fixtures/rules/make-syntax-error-rule")
        }
    };
    const examplePreprocessorName = "eslint-plugin-processor";
    const originalDir = process.cwd();
    const fixtureDir = path.resolve(fs.realpathSync(os.tmpdir()), "eslint/fixtures");

    /** @type {import("../../../lib/eslint")["ESLint"]} */
    let ESLint;

    /** @type {import("../../../lib/eslint/eslint")["getESLintPrivateMembers"]} */
    let getESLintPrivateMembers;

    /**
     * Returns the path inside of the fixture directory.
     * @param {...string} args file path segments.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath(...args) {
        const filepath = path.join(fixtureDir, ...args);

        try {
            return fs.realpathSync(filepath);
        } catch (e) {
            return filepath;
        }
    }

    /**
     * Create a plugins configuration array containing mocked plugins
     * @returns {import("../../../lib/eslint/eslint")["PluginElement"][]} an array of plugins
     * @private
     */
    function createMockedPluginsOption() {
        return [
            { id: examplePluginName, definition: examplePlugin },
            { id: examplePluginNameWithNamespace, definition: examplePlugin },
            { id: examplePreprocessorName, definition: require("../../fixtures/processors/custom-processor") }
        ];
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        shell.mkdir("-p", fixtureDir);
        shell.cp("-r", "./tests/fixtures/.", fixtureDir);
    });

    beforeEach(() => {
        ({ ESLint, getESLintPrivateMembers } = require("../../../lib/eslint/eslint"));
    });

    after(() => {
        shell.rm("-r", fixtureDir);
    });

    describe("ESLint constructor function", () => {
        it("the default value of 'options.cwd' should be the current working directory.", () => {
            process.chdir(__dirname);

            try {
                const eslint = new ESLint();
                const { options } = getESLintPrivateMembers(eslint);

                assert.strictEqual(options.cwd, __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });

        it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new ESLint({ ignorePath: fixtureDir, ignore: true });
            }, `Cannot read .eslintignore file: ${fixtureDir}\nError: EISDIR: illegal operation on a directory, read`);
        });
    });

    describe("lintText()", () => {
        it("should report the total and per file errors when using local cwd .eslintrc", async() => {
            const eslint = new ESLint();
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 5);
            assert.strictEqual(results[0].messages[0].ruleId, "strict");
            assert.strictEqual(results[0].messages[1].ruleId, "no-var");
            assert.strictEqual(results[0].messages[2].ruleId, "no-unused-vars");
            assert.strictEqual(results[0].messages[3].ruleId, "quotes");
            assert.strictEqual(results[0].messages[4].ruleId, "eol-last");
            assert.strictEqual(results[0].fixableErrorCount, 3);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should report the total and per file warnings when using local cwd .eslintrc", async() => {
            const eslint = new ESLint({
                rules: {
                    quotes: 1,
                    "no-var": 1,
                    "eol-last": 1,
                    strict: 1,
                    "no-unused-vars": 1
                }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 5);
            assert.strictEqual(results[0].messages[0].ruleId, "strict");
            assert.strictEqual(results[0].messages[1].ruleId, "no-var");
            assert.strictEqual(results[0].messages[2].ruleId, "no-unused-vars");
            assert.strictEqual(results[0].messages[3].ruleId, "quotes");
            assert.strictEqual(results[0].messages[4].ruleId, "eol-last");
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 3);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should report one message when using specific config file", async() => {
            const eslint = new ESLint({
                configFile: "fixtures/configurations/quotes-error.json",
                useEslintrc: false,
                cwd: getFixturePath("..")
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
            assert.isUndefined(results[0].messages[0].output);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should report the filename when passed in", async() => {
            const eslint = new ESLint({
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "test.js" };
            const results = await eslint.lintText("var foo = 'bar';", options);

            assert.strictEqual(results[0].filePath, getFixturePath("test.js"));
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", async() => {
            const eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });
            const options = { filePath: "fixtures/passing.js", warnIgnored: true };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].severity, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.isUndefined(results[0].messages[0].output);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", async() => {
            const eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });
            const options = {
                filePath: "fixtures/passing.js",
                warnIgnored: false
            };

            // intentional parsing error
            const results = await eslint.lintText("va r bar = foo;", options);

            // should not report anything because the file is ignored
            assert.strictEqual(results.length, 0);
        });

        it("should suppress excluded file warnings by default", async() => {
            const eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            // should not report anything because there are no errors
            assert.strictEqual(results.length, 0);
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", async() => {
            const eslint = new ESLint({
                ignorePath: "fixtures/.eslintignore",
                cwd: getFixturePath(".."),
                ignore: false,
                useEslintrc: false,
                rules: {
                    "no-undef": 2
                }
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.isUndefined(results[0].messages[0].output);
        });

        it("should return a message and fixed text when in fix mode", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                rules: {
                    semi: 2
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "passing.js" };
            const results = await eslint.lintText("var bar = foo", options);

            assert.deepStrictEqual(results, [
                {
                    filePath: getFixturePath("passing.js"),
                    messages: [],
                    errorCount: 0,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    output: "var bar = foo;",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                rules: {
                    "no-undef": 2
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "passing.js" };
            const results = await eslint.lintText("var bar = foo", options);

            assert.deepStrictEqual(results, [
                {
                    filePath: getFixturePath("passing.js"),
                    messages: [
                        {
                            ruleId: "no-undef",
                            severity: 2,
                            messageId: "undef",
                            message: "'foo' is not defined.",
                            line: 1,
                            column: 11,
                            endLine: 1,
                            endColumn: 14,
                            nodeType: "Identifier"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    source: "var bar = foo",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should not delete code if there is a syntax error after trying to autofix.", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                plugins: createMockedPluginsOption(),
                rules: {
                    "example/make-syntax-error": "error"
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "test.js" };
            const results = await eslint.lintText("var bar = foo", options);

            assert.deepStrictEqual(results, [
                {
                    filePath: getFixturePath("test.js"),
                    messages: [
                        {
                            ruleId: null,
                            fatal: true,
                            severity: 2,
                            message: "Parsing error: Unexpected token is",
                            line: 1,
                            column: 19
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    output: "var bar = foothis is a syntax error.",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should not crash even if there are any syntax error since the first time.", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                rules: {
                    "example/make-syntax-error": "error"
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "test.js" };
            const results = await eslint.lintText("var bar =", options);

            assert.deepStrictEqual(results, [
                {
                    filePath: getFixturePath("test.js"),
                    messages: [
                        {
                            ruleId: null,
                            fatal: true,
                            severity: 2,
                            message: "Parsing error: Unexpected token",
                            line: 1,
                            column: 10
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    source: "var bar =",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should return source code of file in `source` property when errors are present", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 2 }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 1 }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 2 }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.lengthOf(results[0].messages, 0);
            assert.isUndefined(results[0].source);
        });

        it("should not return a `source` property when fixes are applied", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                rules: {
                    semi: 2,
                    "no-unused-vars": 2
                }
            });
            const results = await eslint.lintText("var msg = 'hi' + foo\n");

            assert.isUndefined(results[0].source);
            assert.strictEqual(results[0].output, "var msg = 'hi' + foo;\n");
        });

        it("should return a `source` property when a parsing error has occurred", async() => {
            const eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 2 }
            });
            const results = await eslint.lintText("var bar = foothis is a syntax error.\n return bar;");

            assert.deepStrictEqual(results, [
                {
                    filePath: "<text>",
                    messages: [
                        {
                            ruleId: null,
                            fatal: true,
                            severity: 2,
                            message: "Parsing error: Unexpected token is",
                            line: 1,
                            column: 19
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    source: "var bar = foothis is a syntax error.\n return bar;",
                    usedDeprecatedRules: []
                }
            ]);
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should respect default ignore rules, even with --no-ignore", async() => {
            const eslint = new ESLint({
                cwd: getFixturePath(),
                ignore: false
            });
            const results = await eslint.lintText("var bar = foo;", { filePath: "node_modules/passing.js", warnIgnored: true });
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("node_modules/passing.js"));
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        describe('plugin shorthand notation ("@scope" for "@scope/eslint-plugin")', () => {
            const Module = require("module");
            let originalFindPath = null;

            /* eslint-disable no-underscore-dangle */
            before(() => {
                originalFindPath = Module._findPath;
                Module._findPath = function(id, ...otherArgs) {
                    if (id === "@scope/eslint-plugin") {
                        return path.resolve(__dirname, "../../fixtures/plugin-shorthand/basic/node_modules/@scope/eslint-plugin/index.js");
                    }
                    return originalFindPath.call(this, id, ...otherArgs);
                };
            });

            after(() => {
                Module._findPath = originalFindPath;
            });
            /* eslint-enable no-underscore-dangle */

            it("should resolve 'plugins:[\"@scope\"]' to 'node_modules/@scope/eslint-plugin'.", async() => {
                const eslint = new ESLint({ cwd: getFixturePath("plugin-shorthand/basic") });
                const [result] = await eslint.lintText("var x = 0", { filePath: "index.js" });

                assert.strictEqual(result.filePath, getFixturePath("plugin-shorthand/basic/index.js"));
                assert.strictEqual(result.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(result.messages[0].message, "OK");
            });

            it("should resolve 'extends:[\"plugin:@scope/recommended\"]' to 'node_modules/@scope/eslint-plugin'.", async() => {
                const eslint = new ESLint({ cwd: getFixturePath("plugin-shorthand/extends") });
                const [result] = await eslint.lintText("var x = 0", { filePath: "index.js" });

                assert.strictEqual(result.filePath, getFixturePath("plugin-shorthand/extends/index.js"));
                assert.strictEqual(result.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(result.messages[0].message, "OK");
            });
        });

        it("should warn when deprecated rules are found in a config", async() => {
            const eslint = new ESLint({
                cwd: originalDir,
                useEslintrc: false,
                configFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml"
            });
            const [result] = await eslint.lintText("foo");

            assert.deepStrictEqual(
                result.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
        });

        /*
         * describe("Fix Types", () => {
         *     it("should throw an error when an invalid fix type is specified", () => {
         *         assert.throws(() => {
         *             const eslint = new ESLint({
         *                 cwd: path.join(fixtureDir, ".."),
         *                 useEslintrc: false,
         *                 fix: true,
         *                 fixTypes: ["layou"]
         *             });
         *         }, /invalid fix type/iu);
         *     });
         */

        /*
         *     it("should not fix any rules when fixTypes is used without fix", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: false,
         *             fixTypes: ["layout"]
         *         });
         */

        /*
         *         const inputPath = getFixturePath("fix-types/fix-only-semi.js");
         *         const report = engine.executeOnFiles([inputPath]);
         */

        /*
         *         assert.isUndefined(report.results[0].output);
         *     });
         */

        /*
         *     it("should not fix non-style rules when fixTypes has only 'layout'", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["layout"]
         *         });
         *         const inputPath = getFixturePath("fix-types/fix-only-semi.js");
         *         const outputPath = getFixturePath("fix-types/fix-only-semi.expected.js");
         *         const report = engine.executeOnFiles([inputPath]);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        /*
         *     it("should not fix style or problem rules when fixTypes has only 'suggestion'", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["suggestion"]
         *         });
         *         const inputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.js");
         *         const outputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.expected.js");
         *         const report = engine.executeOnFiles([inputPath]);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        /*
         *     it("should fix both style and problem rules when fixTypes has 'suggestion' and 'layout'", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["suggestion", "layout"]
         *         });
         *         const inputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.js");
         *         const outputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.expected.js");
         *         const report = engine.executeOnFiles([inputPath]);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        /*
         *     it("should not throw an error when a rule doesn't have a 'meta' property", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["layout"],
         *             rulePaths: [getFixturePath("rules", "fix-types-test")]
         *         });
         */

        /*
         *         const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
         *         const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
         *         const report = engine.executeOnFiles([inputPath]);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        /*
         *     it("should not throw an error when a rule is loaded after initialization with executeOnFiles()", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["layout"]
         *         });
         *         const internalSlots = getESLintInternalSlots(engine);
         */

        /*
         *         internalSlots.linter.defineRule(
         *             "no-program",
         *             require(getFixturePath("rules", "fix-types-test", "no-program.js"))
         *         );
         */

        /*
         *         const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
         *         const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
         *         const report = engine.executeOnFiles([inputPath]);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        /*
         *     it("should not throw an error when a rule is loaded after initialization with executeOnText()", () => {
         *         const eslint = new ESLint({
         *             cwd: path.join(fixtureDir, ".."),
         *             useEslintrc: false,
         *             fix: true,
         *             fixTypes: ["layout"]
         *         });
         *         const internalSlots = getESLintInternalSlots(engine);
         */

        /*
         *         internalSlots.linter.defineRule(
         *             "no-program",
         *             require(getFixturePath("rules", "fix-types-test", "no-program.js"))
         *         );
         */

        /*
         *         const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
         *         const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
         *         const results = await eslint.lintText(fs.readFileSync(inputPath, { encoding: "utf8" }), inputPath);
         *         const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *         assert.strictEqual(report.results[0].output, expectedOutput);
         *     });
         */

        // });

        /*
         * it("correctly autofixes semicolon-conflicting-fixes", () => {
         *     const eslint = new ESLint({
         *         cwd: path.join(fixtureDir, ".."),
         *         useEslintrc: false,
         *         fix: true
         *     });
         *     const inputPath = getFixturePath("autofix/semicolon-conflicting-fixes.js");
         *     const outputPath = getFixturePath("autofix/semicolon-conflicting-fixes.expected.js");
         *     const report = engine.executeOnFiles([inputPath]);
         *     const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *     assert.strictEqual(report.results[0].output, expectedOutput);
         * });
         */

        /*
         * it("correctly autofixes return-conflicting-fixes", () => {
         *     const eslint = new ESLint({
         *         cwd: path.join(fixtureDir, ".."),
         *         useEslintrc: false,
         *         fix: true
         *     });
         *     const inputPath = getFixturePath("autofix/return-conflicting-fixes.js");
         *     const outputPath = getFixturePath("autofix/return-conflicting-fixes.expected.js");
         *     const report = engine.executeOnFiles([inputPath]);
         *     const expectedOutput = fs.readFileSync(outputPath, "utf8");
         */

        /*
         *     assert.strictEqual(report.results[0].output, expectedOutput);
         * });
         */

    });
});
