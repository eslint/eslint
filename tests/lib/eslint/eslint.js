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
const sinon = require("sinon");
const shell = require("shelljs");
const hash = require("../../../lib/cli-engine/hash");
const fCache = require("file-entry-cache");
const { unIndent, defineESLintWithInMemoryFileSystem } = require("../../_utils");

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

    /** @type {InstanceType<import("../../../lib/eslint")["ESLint"]>} */
    let eslint;

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
        it("the default value of 'options.cwd' should be the current working directory.", async () => {
            process.chdir(__dirname);

            try {
                eslint = new ESLint();
                const { options } = getESLintPrivateMembers(eslint);

                assert.strictEqual(options.cwd, __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });

        it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", async () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new
                new ESLint({ ignorePath: fixtureDir, ignore: true });
            }, `Cannot read .eslintignore file: ${fixtureDir}\nError: EISDIR: illegal operation on a directory, read`);
        });
    });

    describe("lintText()", () => {
        it("should report the total and per file errors when using local cwd .eslintrc", async () => {
            eslint = new ESLint();
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

        it("should report the total and per file warnings when using local cwd .eslintrc", async () => {
            eslint = new ESLint({
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

        it("should report one message when using specific config file", async () => {
            eslint = new ESLint({
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

        it("should report the filename when passed in", async () => {
            eslint = new ESLint({
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "test.js" };
            const results = await eslint.lintText("var foo = 'bar';", options);

            assert.strictEqual(results[0].filePath, getFixturePath("test.js"));
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", async () => {
            eslint = new ESLint({
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

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", async () => {
            eslint = new ESLint({
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

        it("should suppress excluded file warnings by default", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            // should not report anything because there are no errors
            assert.strictEqual(results.length, 0);
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", async () => {
            eslint = new ESLint({
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

        it("should return a message and fixed text when in fix mode", async () => {
            eslint = new ESLint({
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

        it("correctly autofixes semicolon-conflicting-fixes", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                useEslintrc: false,
                fix: true
            });
            const inputPath = getFixturePath("autofix/semicolon-conflicting-fixes.js");
            const outputPath = getFixturePath("autofix/semicolon-conflicting-fixes.expected.js");
            const results = await eslint.lintFiles([inputPath]);
            const expectedOutput = fs.readFileSync(outputPath, "utf8");

            assert.strictEqual(results[0].output, expectedOutput);
        });

        it("correctly autofixes return-conflicting-fixes", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                useEslintrc: false,
                fix: true
            });
            const inputPath = getFixturePath("autofix/return-conflicting-fixes.js");
            const outputPath = getFixturePath("autofix/return-conflicting-fixes.expected.js");
            const results = await eslint.lintFiles([inputPath]);
            const expectedOutput = fs.readFileSync(outputPath, "utf8");

            assert.strictEqual(results[0].output, expectedOutput);
        });

        describe("Fix Types", () => {
            it("should throw an error when an invalid fix type is specified", async () => {
                assert.throws(() => {
                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        fix: true,
                        fixTypes: ["layou"]
                    });
                }, /invalid fix type/iu);
            });

            it("should not fix any rules when fixTypes is used without fix", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: false,
                    fixTypes: ["layout"]
                });

                const inputPath = getFixturePath("fix-types/fix-only-semi.js");
                const results = await eslint.lintFiles([inputPath]);

                assert.isUndefined(results[0].output);
            });

            it("should not fix non-style rules when fixTypes has only 'layout'", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"]
                });
                const inputPath = getFixturePath("fix-types/fix-only-semi.js");
                const outputPath = getFixturePath("fix-types/fix-only-semi.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            it("should not fix style or problem rules when fixTypes has only 'suggestion'", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["suggestion"]
                });
                const inputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.js");
                const outputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            it("should fix both style and problem rules when fixTypes has 'suggestion' and 'layout'", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["suggestion", "layout"]
                });
                const inputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.js");
                const outputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            it("should not throw an error when a rule doesn't have a 'meta' property", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"],
                    rulePaths: [getFixturePath("rules", "fix-types-test")]
                });

                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            describe("should not throw an error when a rule is loaded after initialization", () => {

                /** @type {import("../../../lib/cli-engine/cli-engine")["getCLIEngineInternalSlots"]} */
                let getCLIEngineInternalSlots;

                /** @type {InstanceType<import("../../../lib/linter/linter.js")["Linter"]>} */
                let linter;

                beforeEach(() => {
                    ({ getCLIEngineInternalSlots } = require("../../../lib/cli-engine/cli-engine"));

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        fix: true,
                        fixTypes: ["layout"]
                    });
                    const { cliEngine } = getESLintPrivateMembers(eslint);

                    ({ linter } = getCLIEngineInternalSlots(cliEngine));
                });

                it("with executeOnFiles()", async () => {
                    linter.defineRule(
                        "no-program",
                        require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                    );

                    const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                    const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                    const results = await eslint.lintFiles([inputPath]);
                    const expectedOutput = fs.readFileSync(outputPath, "utf8");

                    assert.strictEqual(results[0].output, expectedOutput);
                });

                it("with executeOnText()", async () => {
                    linter.defineRule(
                        "no-program",
                        require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                    );

                    const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                    const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                    const results = await eslint.lintText(fs.readFileSync(inputPath, { encoding: "utf8" }), inputPath);
                    const expectedOutput = fs.readFileSync(outputPath, "utf8");

                    assert.strictEqual(results[0].output, expectedOutput);
                });
            });
        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", async () => {
            eslint = new ESLint({
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

        it("should not delete code if there is a syntax error after trying to autofix.", async () => {
            eslint = new ESLint({
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

        it("should not crash even if there are any syntax error since the first time.", async () => {
            eslint = new ESLint({
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

        it("should return source code of file in `source` property when errors are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 2 }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 1 }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                rules: { semi: 2 }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.lengthOf(results[0].messages, 0);
            assert.isUndefined(results[0].source);
        });

        it("should not return a `source` property when fixes are applied", async () => {
            eslint = new ESLint({
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

        it("should return a `source` property when a parsing error has occurred", async () => {
            eslint = new ESLint({
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
        it("should respect default ignore rules, even with --no-ignore", async () => {
            eslint = new ESLint({
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

            it("should resolve 'plugins:[\"@scope\"]' to 'node_modules/@scope/eslint-plugin'.", async () => {
                eslint = new ESLint({ cwd: getFixturePath("plugin-shorthand/basic") });
                const [result] = await eslint.lintText("var x = 0", { filePath: "index.js" });

                assert.strictEqual(result.filePath, getFixturePath("plugin-shorthand/basic/index.js"));
                assert.strictEqual(result.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(result.messages[0].message, "OK");
            });

            it("should resolve 'extends:[\"plugin:@scope/recommended\"]' to 'node_modules/@scope/eslint-plugin'.", async () => {
                eslint = new ESLint({ cwd: getFixturePath("plugin-shorthand/extends") });
                const [result] = await eslint.lintText("var x = 0", { filePath: "index.js" });

                assert.strictEqual(result.filePath, getFixturePath("plugin-shorthand/extends/index.js"));
                assert.strictEqual(result.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(result.messages[0].message, "OK");
            });
        });

        it("should warn when deprecated rules are found in a config", async () => {
            eslint = new ESLint({
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
    });

    describe("lintFiles()", () => {
        it("should use correct parser when custom parser is specified", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                ignore: false
            });

            const filePath = path.resolve(__dirname, "../../fixtures/configurations/parser/custom.js");
            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].message, "Parsing error: Boom!");

        });

        it("should report zero messages when given a config file and a valid file", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                configFile: ".eslintrc.js"
            });

            const results = await eslint.lintFiles(["lib/**/cli*.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                configFile: ".eslintrc.js"
            });

            const results = await eslint.lintFiles(["lib/**/cli*.js", "lib/cli.?s", "lib/{cli,cli-engine/cli-engine}.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and espree as parser", async () => {
            eslint = new ESLint({
                parser: "espree",
                envs: ["es6"],
                useEslintrc: false
            });

            const results = await eslint.lintFiles(["lib/cli.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", async () => {

            eslint = new ESLint({
                parser: "esprima",
                useEslintrc: false
            });

            const results = await eslint.lintFiles(["lib/cli.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should throw an error when given a config file and a valid file and invalid parser", async () => {
            eslint = new ESLint({
                parser: "test11",
                useEslintrc: false
            });

            try {
                await eslint.lintFiles(["lib/cli.js"]);
            } catch (e) {
                assert.isTrue(/Failed to load parser 'test11'/u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should report zero messages when given a directory with a .js2 file", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                extensions: [".js2"]
            });

            const results = await eslint.lintFiles([getFixturePath("files/foo.js2")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should fall back to defaults when extensions is set to an empty array", async () => {

            eslint = new ESLint({
                cwd: getFixturePath("configurations"),
                configFile: getFixturePath("configurations", "quotes-error.json"),
                extensions: []
            });
            const results = await eslint.lintFiles([getFixturePath("single-quoted.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should report zero messages when given a directory with a .js and a .js2 file", async () => {

            eslint = new ESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath("..")
            });

            const results = await eslint.lintFiles(["fixtures/files/"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should report zero messages when given a '**' pattern with a .js and a .js2 file", async () => {

            eslint = new ESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should resolve globs when 'globInputPaths' option is true", async () => {
            eslint = new ESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath("..")
            });

            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should not resolve globs when 'globInputPaths' option is false", async () => {
            eslint = new ESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath(".."),
                globInputPaths: false
            });

            try {
                await eslint.lintFiles(["fixtures/files/*"]);
            } catch (e) {
                assert.strictEqual("No files matching 'fixtures/files/*' were found (glob was disabled).", e.message);
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should report on all files passed explicitly, even if ignored by default", async () => {

            eslint = new ESLint({
                cwd: getFixturePath("cli-engine")
            });

            const results = await eslint.lintFiles(["node_modules/foo.js"]);
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        it("should report on globs with explicit inclusion of dotfiles, even though ignored by default", async () => {

            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                rules: {
                    quotes: [2, "single"]
                }
            });

            const results = await eslint.lintFiles(["hidden/.hiddenfolder/*.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should not check default ignored files without --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath("cli-engine")
            });

            try {
                await eslint.lintFiles(["node_modules"]);
            } catch (e) {
                assert.strictEqual("All files matched by 'node_modules' are ignored.", e.message);
                return;
            }
            assert.fail("Expected to throw an error");
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should not check node_modules files even with --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                ignore: false
            });

            try {
                await eslint.lintFiles(["node_modules"]);
            } catch (e) {
                assert.strictEqual("All files matched by 'node_modules' are ignored.", e.message);
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should not check .hidden files if they are passed explicitly without --no-ignore flag", async () => {

            eslint = new ESLint({
                cwd: getFixturePath(".."),
                useEslintrc: false,
                rules: {
                    quotes: [2, "single"]
                }
            });

            const results = await eslint.lintFiles(["fixtures/files/.bar.js"]);
            const expectedMsg = "File ignored by default.  Use a negated ignore pattern (like \"--ignore-pattern '!<relative/path/to/filename>'\") to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        it("should check .hidden files if they are passed explicitly with --no-ignore flag", async () => {

            eslint = new ESLint({
                cwd: getFixturePath(".."),
                ignore: false,
                useEslintrc: false,
                rules: {
                    quotes: [2, "single"]
                }
            });

            const results = await eslint.lintFiles(["fixtures/files/.bar.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
        });

        it("should check .hidden files if they are unignored with an --ignore-pattern", async () => {

            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                ignore: true,
                useEslintrc: false,
                ignorePattern: "!.hidden*",
                rules: {
                    quotes: [2, "single"]
                }
            });

            const results = await eslint.lintFiles(["hidden/"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
        });

        it("should report zero messages when given a pattern with a .js and a .js2 file", async () => {

            eslint = new ESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const results = await eslint.lintFiles(["fixtures/files/*.?s*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", async () => {

            eslint = new ESLint({
                cwd: getFixturePath("configurations"),
                configFile: getFixturePath("configurations", "quotes-error.json")
            });
            const results = await eslint.lintFiles([getFixturePath("single-quoted.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should return 3 messages when given a config file and a directory of 3 valid files", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "semi-error.json")
            });

            const results = await eslint.lintFiles([getFixturePath("formatters")]);

            assert.strictEqual(results.length, 3);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[1].errorCount, 0);
            assert.strictEqual(results[1].warningCount, 0);
            assert.strictEqual(results[1].fixableErrorCount, 0);
            assert.strictEqual(results[1].fixableWarningCount, 0);
            assert.strictEqual(results[2].errorCount, 0);
            assert.strictEqual(results[2].warningCount, 0);
            assert.strictEqual(results[2].fixableErrorCount, 0);
            assert.strictEqual(results[2].fixableWarningCount, 0);
        });


        it("should return the total number of errors when given multiple files", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "single-quotes-error.json")
            });

            const results = await eslint.lintFiles([getFixturePath("formatters")]);

            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[1].errorCount, 3);
            assert.strictEqual(results[1].warningCount, 0);
            assert.strictEqual(results[1].fixableErrorCount, 3);
            assert.strictEqual(results[1].fixableWarningCount, 0);
            assert.strictEqual(results[2].errorCount, 3);
            assert.strictEqual(results[2].warningCount, 0);
            assert.strictEqual(results[2].fixableErrorCount, 3);
            assert.strictEqual(results[2].fixableWarningCount, 0);
        });

        it("should process when file is given by not specifying extensions", async () => {

            eslint = new ESLint({
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const results = await eslint.lintFiles(["fixtures/files/foo.js2"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to browser", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-browser.json")
            });

            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when given an option to set environment to browser", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                envs: ["browser"],
                rules: {
                    "no-alert": 0,
                    "no-undef": 2
                }
            });

            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", async () => {

            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-node.json")
            });

            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should not return results from previous call when calling more than once", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                ignore: false,
                rules: {
                    semi: 2
                }
            });

            const failFilePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));
            const passFilePath = fs.realpathSync(getFixturePath("passing.js"));
            let results = await eslint.lintFiles([failFilePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, failFilePath);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "semi");
            assert.strictEqual(results[0].messages[0].severity, 2);

            results = await eslint.lintFiles([passFilePath]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, passFilePath);
            assert.strictEqual(results[0].messages.length, 0);

        });

        it("should throw an error when given a directory with all eslint excluded files in the directory", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore")
            });

            try {
                await eslint.lintFiles([getFixturePath("./cli-engine/")]);
            } catch (e) {
                assert.strictEqual(`All files matched by '${getFixturePath("./cli-engine/")}' are ignored.`, e.message);
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should throw an error when all given files are ignored", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore")
            });

            try {
                await eslint.lintFiles(["tests/fixtures/cli-engine/"]);
            } catch (e) {
                assert.isTrue(/All files matched by 'tests\/fixtures\/cli-engine\/' are ignored./u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should throw an error when all given files are ignored even with a `./` prefix", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore")
            });

            try {
                await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
            } catch (e) {
                assert.isTrue(/All files matched by '\.\/tests\/fixtures\/cli-engine\/' are ignored./u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        // https://github.com/eslint/eslint/issues/3788
        it("should ignore one-level down node_modules when ignore file has 'node_modules/' in it", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath("cli-engine", "nested_node_modules", ".eslintignore"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "double"]
                },
                cwd: getFixturePath("cli-engine", "nested_node_modules")
            });

            const results = await eslint.lintFiles(["."]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        // https://github.com/eslint/eslint/issues/3812
        it("should ignore all files and throw an error when tests/fixtures/ is in ignore file", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath("cli-engine/.eslintignore2"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "double"]
                }
            });

            try {
                await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
            } catch (e) {
                assert.isTrue(/All files matched by '.\/tests\/fixtures\/cli-engine\/' are ignored./u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should throw an error when all given files are ignored via ignore-pattern", async () => {
            eslint = new ESLint({
                ignorePattern: "tests/fixtures/single-quoted.js"
            });

            try {
                await eslint.lintFiles(["tests/fixtures/*-quoted.js"]);
            } catch (e) {
                assert.isTrue(/All files matched by 'tests\/fixtures\/\*-quoted.js' are ignored./u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should return a warning when an explicitly given file is ignored", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath()
            });

            const filePath = getFixturePath("passing.js");

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages[0].severity, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should return two messages when given a file in excluded files list while ignore is off", async () => {

            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                ignore: false,
                rules: {
                    "no-undef": 2
                }
            });

            const filePath = fs.realpathSync(getFixturePath("undef.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[1].ruleId, "no-undef");
            assert.strictEqual(results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing a file with a shebang", async () => {
            eslint = new ESLint({
                ignore: false
            });

            const results = await eslint.lintFiles([getFixturePath("shebang.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should give a warning when loading a custom rule that doesn't exist", async () => {
            eslint = new ESLint({
                ignore: false,
                rulePaths: [getFixturePath("rules", "dir1")],
                configFile: getFixturePath("rules", "missing-rule.json")
            });
            const results = await eslint.lintFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "missing-rule");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[0].message, "Definition for rule 'missing-rule' was not found.");
        });

        it("should throw an error when loading a bad custom rule", async () => {
            eslint = new ESLint({
                ignore: false,
                rulePaths: [getFixturePath("rules", "wrong")],
                configFile: getFixturePath("rules", "eslint.json")
            });

            try {
                await eslint.lintFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);
            } catch (e) {
                assert.isTrue(/Error while loading rule 'custom-rule'/u.test(e.message));
                return;
            }
            assert.fail("Expected to throw an error");
        });

        it("should return one message when a custom rule matches a file", async () => {

            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                rulePaths: [getFixturePath("rules/")],
                configFile: getFixturePath("rules", "eslint.json")
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 2);
            assert.strictEqual(results[0].messages[0].ruleId, "custom-rule");
            assert.strictEqual(results[0].messages[0].severity, 1);
        });

        it("should load custom rule from the provided cwd", async () => {
            const cwd = path.resolve(getFixturePath("rules"));

            eslint = new ESLint({
                ignore: false,
                cwd,
                rulePaths: ["./"],
                configFile: "eslint.json"
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 2);
            assert.strictEqual(results[0].messages[0].ruleId, "custom-rule");
            assert.strictEqual(results[0].messages[0].severity, 1);
        });

        it("should return messages when multiple custom rules match a file", async () => {

            eslint = new ESLint({
                ignore: false,
                rulePaths: [
                    getFixturePath("rules", "dir1"),
                    getFixturePath("rules", "dir2")
                ],
                configFile: getFixturePath("rules", "multi-rulesdirs.json")
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test-multi-rulesdirs.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 2);
            assert.strictEqual(results[0].messages[0].ruleId, "no-literals");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[1].ruleId, "no-strings");
            assert.strictEqual(results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing without useEslintrc flag", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when executing without useEslintrc flag in Node.js environment", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("process-exit.js"));
            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when executing with base-config flag set to null", async () => {
            eslint = new ESLint({
                ignore: false,
                baseConfig: null,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages and ignore .eslintrc files when executing with no-eslintrc flag", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("eslintrc", "quotes.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages and ignore package.json files when executing with no-eslintrc flag", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("packagejson", "quotes.js"));

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should warn when deprecated rules are configured", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                configFile: ".eslintrc.js",
                rules: {
                    "indent-legacy": 1,
                    "require-jsdoc": 1,
                    "valid-jsdoc": 1
                }
            });

            const results = await eslint.lintFiles(["lib/cli*.js"]);

            assert.sameDeepMembers(
                results[0].usedDeprecatedRules,
                [
                    { ruleId: "indent-legacy", replacedBy: ["indent"] },
                    { ruleId: "require-jsdoc", replacedBy: [] },
                    { ruleId: "valid-jsdoc", replacedBy: [] }
                ]
            );
        });

        it("should not warn when deprecated rules are not configured", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                configFile: ".eslintrc.js",
                rules: { indent: 1, "valid-jsdoc": 0, "require-jsdoc": 0 }
            });

            const results = await eslint.lintFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(results[0].usedDeprecatedRules, []);
        });

        it("should warn when deprecated rules are found in a config", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                configFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml",
                useEslintrc: false
            });

            const results = await eslint.lintFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(
                results[0].usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
        });

        describe("Fix Mode", () => {

            it("should return fixed text on multiple files when in fix mode", async () => {

                /**
                 * Converts CRLF to LF in output.
                 * This is a workaround for git's autocrlf option on Windows.
                 * @param {Object} result A result object to convert.
                 * @returns {void}
                 */
                function convertCRLF(result) {
                    if (result && result.output) {
                        result.output = result.output.replace(/\r\n/gu, "\n");
                    }
                }

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    rules: {
                        semi: 2,
                        quotes: [2, "double"],
                        eqeqeq: 2,
                        "no-undef": 2,
                        "space-infix-ops": 2
                    }
                });

                const results = await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                results.forEach(convertCRLF);
                assert.deepStrictEqual(results, [
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/multipass.js")),
                        messages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "true ? \"yes\" : \"no\";\n",
                        usedDeprecatedRules: []
                    },
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/ok.js")),
                        messages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        usedDeprecatedRules: []
                    },
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/quotes-semi-eqeqeq.js")),
                        messages: [
                            {
                                column: 9,
                                line: 2,
                                endColumn: 11,
                                endLine: 2,
                                message: "Expected '===' and instead saw '=='.",
                                messageId: "unexpected",
                                nodeType: "BinaryExpression",
                                ruleId: "eqeqeq",
                                severity: 2
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var msg = \"hi\";\nif (msg == \"hi\") {\n\n}\n",
                        usedDeprecatedRules: []
                    },
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/quotes.js")),
                        messages: [
                            {
                                column: 18,
                                line: 1,
                                endColumn: 21,
                                endLine: 1,
                                messageId: "undef",
                                message: "'foo' is not defined.",
                                nodeType: "Identifier",
                                ruleId: "no-undef",
                                severity: 2
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var msg = \"hi\" + foo;\n",
                        usedDeprecatedRules: []
                    }
                ]);
            });

            it("should run autofix even if files are cached without autofix results", async () => {
                const baseOptions = {
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    rules: {
                        semi: 2,
                        quotes: [2, "double"],
                        eqeqeq: 2,
                        "no-undef": 2,
                        "space-infix-ops": 2
                    }
                };

                eslint = new ESLint(Object.assign({}, baseOptions, { cache: true, fix: false }));

                // Do initial lint run and populate the cache file
                eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                eslint = new ESLint(Object.assign({}, baseOptions, { cache: true, fix: true }));

                const results = await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                assert.ok(results.some(result => result.output));
            });

        });

        // These tests have to do with https://github.com/eslint/eslint/issues/963

        describe("configuration hierarchy", () => {

            // Default configuration - blank
            it("should return zero messages when executing with no .eslintrc", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // No default configuration rules - conf/environments.js (/*eslint-env node*/)
            it("should return zero messages when executing with no .eslintrc in the Node.js environment", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes-node.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 2);
            });

            // Project configuration - second level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

            // Project configuration - third level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent and grandparent .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/subsubbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

            // Project configuration - first level package.json
            it("should return one message when executing with package.json", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

            // Project configuration - second level package.json
            it("should return zero messages when executing with local package.json that overrides parent package.json", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Project configuration - third level package.json
            it("should return one message when executing with local package.json that overrides parent and grandparent package.json", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/subsubsubdir/wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 2);
            });

            // Project configuration - .eslintrc overrides package.json in same directory
            it("should return one message when executing with .eslintrc that overrides a package.json in the same directory", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 2);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return two messages when executing with config file that adds to local .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi");
                assert.strictEqual(results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[1].ruleId, "semi");
                assert.strictEqual(results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return one message when executing with config file that overrides local and parent .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("config-hierarchy/broken/override-conf.yaml")
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("config-hierarchy/broken/override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", async () => {

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("/config-hierarchy/broken/override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                const results = await eslint.lintFiles([getFixturePath("config-hierarchy/broken/console-wrong-quotes.js")]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(results[0].messages[0].severity, 1);
            });

        });

        describe("plugins", () => {
            it("should return two messages when executing with config file that specifies a plugin", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-with-prefix.json"),
                    useEslintrc: false,
                    plugins: createMockedPluginsOption()
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test/test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin with namespace", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-with-prefix-and-namespace.json"),
                    useEslintrc: false,
                    plugins: createMockedPluginsOption()
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "@eslint/example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix.json"),
                    useEslintrc: false,
                    plugins: createMockedPluginsOption()
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix and with namespace", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix-with-namespace.json"),
                    useEslintrc: false,
                    plugins: createMockedPluginsOption()
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "@eslint/example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies a plugin", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["example", ...createMockedPluginsOption()],
                    rules: { "example/example-rule": 1 }
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should load plugins from the `loadPluginsRelativeTo` directory, if specified", async () => {
                eslint = new ESLint({
                    resolvePluginsRelativeTo: getFixturePath("plugins"),
                    baseConfig: {
                        plugins: ["with-rules"],
                        rules: { "with-rules/rule1": "error" }
                    },
                    useEslintrc: false
                });

                const results = await eslint.lintText("foo");

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "with-rules/rule1");
                assert.strictEqual(results[0].messages[0].message, "Rule report from plugin");
            });
        });

        describe("cache", () => {

            /**
             * helper method to delete a file without caring about exceptions
             * @param {string} filePath The file path
             * @returns {void}
             */
            function doDelete(filePath) {
                try {
                    fs.unlinkSync(filePath);
                } catch (ex) {

                    /*
                     * we don't care if the file didn't exist, since our
                     * intention was to remove the file
                     */
                }
            }

            /**
             * helper method to delete the cache files created during testing
             * @returns {void}
             */
            function deleteCache() {
                doDelete(path.resolve(".eslintcache"));
                doDelete(path.resolve(".cache/custom-cache"));
            }

            beforeEach(() => {
                deleteCache();
            });

            afterEach(() => {
                sinon.restore();
                deleteCache();
            });

            it("should create the cache file inside the provided directory using the cacheLocation option", async () => {
                assert.isFalse(shell.test("-d", path.resolve("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory")), "the cache for eslint does not exist");

                eslint = new ESLint({
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: "./tmp/.cacheFileDir/",
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    ignore: false
                });

                const file = getFixturePath("cache/src", "test-file.js");

                await eslint.lintFiles([file]);

                assert.isTrue(shell.test("-f", path.resolve(`./tmp/.cacheFileDir/.cache_${hash(process.cwd())}`)), "the cache for eslint was created");

                sinon.restore();
            });

            it("should create the cache file inside cwd when no cacheLocation provided", async () => {
                const cwd = path.resolve(getFixturePath("cli-engine"));

                eslint = new ESLint({
                    useEslintrc: false,
                    cache: true,
                    cwd,
                    rules: {
                        "no-console": 0
                    },
                    extensions: ["js"],
                    ignore: false
                });

                const file = getFixturePath("cli-engine", "console.js");

                await eslint.lintFiles([file]);

                assert.isTrue(shell.test("-f", path.resolve(cwd, ".eslintcache")), "the cache for eslint was created at provided cwd");
            });

            it("should invalidate the cache if the configuration changed between executions", async () => {
                assert.isFalse(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                eslint = new ESLint({
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    ignore: false
                });

                let spy = sinon.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const [result] = await eslint.lintFiles([file]);

                assert.strictEqual(result.errorCount + result.warningCount, 0, "the file passed without errors or warnings");
                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                eslint = new ESLint({
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs, "readFileSync");

                const [cachedResult] = await eslint.lintFiles([file]);

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed because the config changed");
                assert.strictEqual(cachedResult.errorCount, 1, "since configuration changed the cache was not used an one error was reported");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");
            });

            it("should remember the files from a previous run and do not operate on them if not changed", async () => {

                assert.isFalse(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                eslint = new ESLint({
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    ignore: false
                });

                let spy = sinon.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const result = await eslint.lintFiles([file]);

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                eslint = new ESLint({
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs, "readFileSync");

                const cachedResult = await eslint.lintFiles([file]);

                assert.deepStrictEqual(result, cachedResult, "the result is the same regardless of using cache or not");

                // assert the file was not processed because the cache was used
                assert.isFalse(spy.calledWith(file), "the file was not loaded because it used the cache");
            });

            it("should remember the files from a previous run and do not operate on then if not changed", async () => {
                const cacheLocation = getFixturePath(".eslintcache");
                const eslintOptions = {
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    cwd: path.join(fixtureDir, "..")
                };

                assert.isFalse(shell.test("-f", cacheLocation), "the cache for eslint does not exist");

                eslint = new ESLint(eslintOptions);

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                await eslint.lintFiles([file]);

                assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint was created");

                eslintOptions.cache = false;
                eslint = new ESLint(eslintOptions);

                await eslint.lintFiles([file]);

                assert.isFalse(shell.test("-f", cacheLocation), "the cache for eslint was deleted since last run did not used the cache");
            });

            it("should store in the cache a file that failed the test", async () => {

                const cacheLocation = getFixturePath(".eslintcache");

                assert.isFalse(shell.test("-f", cacheLocation), "the cache for eslint does not exist");

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));

                const result = await eslint.lintFiles([badFile, goodFile]);

                assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint was created");

                const fileCache = fCache.createFromFile(cacheLocation);
                const { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(goodFile) === "object", "the entry for the good file is in the cache");

                assert.isTrue(typeof cache.getKey(badFile) === "object", "the entry for the bad file is in the cache");

                const cachedResult = await eslint.lintFiles([badFile, goodFile]);

                assert.deepStrictEqual(result, cachedResult, "result is the same with or without cache");
            });

            it("should not contain in the cache a file that was deleted", async () => {

                const cacheLocation = getFixturePath(".eslintcache");

                doDelete(cacheLocation);

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const toBeDeletedFile = fs.realpathSync(getFixturePath("cache/src", "file-to-delete.js"));

                await eslint.lintFiles([badFile, goodFile, toBeDeletedFile]);

                const fileCache = fCache.createFromFile(cacheLocation);
                let { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(toBeDeletedFile) === "object", "the entry for the file to be deleted is in the cache");

                // delete the file from the file system
                fs.unlinkSync(toBeDeletedFile);

                /*
                 * file-entry-cache@2.0.0 will remove from the cache deleted files
                 * even when they were not part of the array of files to be analyzed
                 */
                await eslint.lintFiles([badFile, goodFile]);

                cache = JSON.parse(fs.readFileSync(cacheLocation));

                assert.isTrue(typeof cache[toBeDeletedFile] === "undefined", "the entry for the file to be deleted is not in the cache");
            });

            it("should contain files that were not visited in the cache provided they still exist", async () => {

                const cacheLocation = getFixturePath(".eslintcache");

                doDelete(cacheLocation);

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const testFile2 = fs.realpathSync(getFixturePath("cache/src", "test-file2.js"));

                await eslint.lintFiles([badFile, goodFile, testFile2]);

                let fileCache = fCache.createFromFile(cacheLocation);
                let { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(testFile2) === "object", "the entry for the test-file2 is in the cache");

                /*
                 * we pass a different set of files minus test-file2
                 * previous version of file-entry-cache would remove the non visited
                 * entries. 2.0.0 version will keep them unless they don't exist
                 */
                await eslint.lintFiles([badFile, goodFile]);

                fileCache = fCache.createFromFile(cacheLocation);
                cache = fileCache.cache;

                assert.isTrue(typeof cache.getKey(testFile2) === "object", "the entry for the test-file2 is in the cache");
            });

            describe("cache deletion", () => {
                beforeEach(async () => {
                    const cacheLocation = getFixturePath(".eslintcache");
                    const file = getFixturePath("cli-engine", "console.js");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        cacheLocation,
                        cache: true,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    await eslint.lintFiles([file]);
                });

                it("should not delete cache when executing on text", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        cacheLocation,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint exists");

                    await eslint.lintText("var foo = 'bar';");

                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint still exists");
                });

                it("should not delete cache when executing on text with a provided filename", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        cacheLocation,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    await eslint.lintText("var bar = foo;", "fixtures/passing.js");
                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint exists");

                    await eslint.lintText("var bar = foo;", "fixtures/passing.js");
                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint still exists");
                });

                it("should not delete cache when executing on files with --cache flag", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");
                    const file = getFixturePath("cli-engine", "console.js");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        cacheLocation,
                        cache: true,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });


                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint exists");

                    await eslint.lintFiles([file]);
                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint still exists");
                });

                it("should delete cache when executing on files without --cache flag", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");
                    const file = getFixturePath("cli-engine", "console.js");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        cacheLocation,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });


                    assert.isTrue(shell.test("-f", cacheLocation), "the cache for eslint exists");
                    await eslint.lintFiles([file]);
                    assert.isFalse(shell.test("-f", cacheLocation), "the cache for eslint has been deleted");
                });

            });
        });

        describe("processors", () => {
            it("should return two messages when executing with config file that specifies a processor", async () => {
                eslint = new ESLint({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    plugins: createMockedPluginsOption(),
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
            });

            xit("should return two messages when executing with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });

                /*
                 * engine.addPlugin("test-processor", {
                 *     processors: {
                 *         ".txt": {
                 *             preprocess(text) {
                 *                 return [text];
                 *             },
                 *             postprocess(messages) {
                 *                 return messages[0];
                 *             }
                 *         }
                 *     }
                 * });
                 */

                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
            });

            it("should run processors when calling executeOnFiles with config file that specifies a processor", async () => {
                eslint = new ESLint({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    plugins: createMockedPluginsOption(),
                    cwd: path.join(fixtureDir, "..")
                });

                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            xit("should run processors when calling executeOnFiles with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });

                /*
                 * engine.addPlugin("test-processor", {
                 *     processors: {
                 *         ".txt": {
                 *             preprocess(text) {
                 *                 return [text.replace("a()", "b()")];
                 *             },
                 *             postprocess(messages) {
                 *                 messages[0][0].ruleId = "post-processed";
                 *                 return messages[0];
                 *             }
                 *         }
                 *     }
                 * });
                 */

                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling executeOnText with config file that specifies a processor", async () => {
                eslint = new ESLint({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    plugins: createMockedPluginsOption(),
                    ignore: false
                });

                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            xit("should run processors when calling executeOnText with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    ignore: false
                });

                /*
                 * engine.addPlugin("test-processor", {
                 *     processors: {
                 *         ".txt": {
                 *             preprocess(text) {
                 *                 return [text.replace("a()", "b()")];
                 *             },
                 *             postprocess(messages) {
                 *                 messages[0][0].ruleId = "post-processed";
                 *                 return messages[0];
                 *             }
                 *         }
                 *     }
                 * });
                 */

                const results = await eslint.lintText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            xdescribe("autofixing with processors", async () => {

                /*
                 * const HTML_PROCESSOR = Object.freeze({
                 *     preprocess(text) {
                 *         return [text.replace(/^<script>/u, "").replace(/<\/script>$/u, "")];
                 *     },
                 *     postprocess(problemLists) {
                 *         return problemLists[0].map(problem => {
                 *             if (problem.fix) {
                 *                 const updatedFix = Object.assign({}, problem.fix, {
                 *                     range: problem.fix.range.map(index => index + "<script>".length)
                 *                 });
                 */

                /*
                 *                 return Object.assign({}, problem, { fix: updatedFix });
                 *             }
                 *             return problem;
                 *         });
                 *     }
                 * });
                 */


                xit("should run in autofix mode when using a processor that supports autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true
                    });

                    /*
                     * engine.addPlugin("test-processor", {
                     *     processors: {
                     *         ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                     *     }
                     * });
                     */

                    const results = await eslint.lintText("<script>foo</script>", "foo.html");

                    assert.strictEqual(results[0].messages.length, 0);
                    assert.strictEqual(results[0].output, "<script>foo;</script>");
                });

                xit("should not run in autofix mode when using a processor that does not support autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true
                    });

                    // engine.addPlugin("test-processor", { processors: { ".html": HTML_PROCESSOR } });

                    const results = await eslint.lintText("<script>foo</script>", "foo.html");

                    assert.strictEqual(results[0].messages.length, 1);
                    assert.isFalse(Object.prototype.hasOwnProperty.call(results[0], "output"));
                });

                xit("should not run in autofix mode when `fix: true` is not provided, even if the processor supports autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false
                    });

                    /*
                     * engine.addPlugin("test-processor", {
                     *     processors: {
                     *         ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                     *     }
                     * });
                     */

                    const results = await eslint.lintText("<script>foo</script>", "foo.html");

                    assert.strictEqual(results[0].messages.length, 1);
                    assert.isFalse(Object.prototype.hasOwnProperty.call(results[0], "output"));
                });
            });
        });

        describe("Patterns which match no file should throw errors.", () => {
            beforeEach(() => {
                eslint = new ESLint({
                    cwd: getFixturePath("cli-engine"),
                    useEslintrc: false
                });
            });

            it("one file", async () => {
                try {
                    await eslint.lintFiles(["non-exist.js"]);
                } catch (e) {
                    assert.isTrue(/No files matching 'non-exist.js' were found./u.test(e.message));
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw if the directory exists and is empty", async () => {
                try {
                    await eslint.lintFiles(["empty"]);
                } catch (e) {
                    assert.isTrue(/No files matching 'empty' were found./u.test(e.message));
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("one glob pattern", async () => {
                try {
                    await eslint.lintFiles(["non-exist/**/*.js"]);
                } catch (e) {
                    assert.isTrue(/No files matching 'non-exist\/\*\*\/\*.js' were found./u.test(e.message));
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("two files", async () => {
                try {
                    await eslint.lintFiles(["aaa.js", "bbb.js"]);
                } catch (e) {
                    assert.isTrue(/No files matching 'aaa.js' were found./u.test(e.message));
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("a mix of an existing file and a non-existing file", async () => {
                try {
                    await eslint.lintFiles(["console.js", "non-exist.js"]);
                } catch (e) {
                    assert.isTrue(/No files matching 'non-exist.js' were found./u.test(e.message));
                    return;
                }
                assert.fail("Expected to throw an error");
            });
        });

        describe("overrides", () => {
            it("should recognize dotfiles", async () => {
                eslint = new ESLint({
                    cwd: getFixturePath("cli-engine/overrides-with-dot"),
                    ignore: false
                });
                const results = await eslint.lintFiles([".test-target.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "no-unused-vars");
            });
        });

        describe("a config file setting should have higher priority than a shareable config file's settings always; https://github.com/eslint/eslint/issues/11510", async () => {
            beforeEach(() => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => path.join(os.tmpdir(), "cli-engine/11510"),
                    files: {
                        "no-console-error-in-overrides.json": JSON.stringify({
                            overrides: [{
                                files: ["*.js"],
                                rules: { "no-console": "error" }
                            }]
                        }),
                        ".eslintrc.json": JSON.stringify({
                            extends: "./no-console-error-in-overrides.json",
                            rules: { "no-console": "off" }
                        }),
                        "a.js": "console.log();"
                    }
                }));
                eslint = new ESLint();
            });

            it("should not report 'no-console' error.", async () => {
                const results = await eslint.lintFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
            });
        });

        describe("configs of plugin rules should be validated even if 'plugins' key doesn't exist; https://github.com/eslint/eslint/issues/11559", async () => {
            beforeEach(() => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => path.join(os.tmpdir(), "cli-engine/11559"),
                    files: {
                        "node_modules/eslint-plugin-test/index.js": `
                            exports.configs = {
                                recommended: { plugins: ["test"] }
                            };
                            exports.rules = {
                                foo: {
                                    meta: { schema: [{ type: "number" }] },
                                    create() { return {}; }
                                }
                            };
                        `,
                        ".eslintrc.json": JSON.stringify({

                            // Import via the recommended config.
                            extends: "plugin:test/recommended",

                            // Has invalid option.
                            rules: { "test/foo": ["error", "invalid-option"] }
                        }),
                        "a.js": "console.log();"
                    }
                }));
                eslint = new ESLint();
            });

            it("should throw fatal error.", async () => {
                try {
                    await eslint.lintFiles("a.js");
                } catch (e) {
                    assert.isTrue(/invalid-option/u.test(e.message));
                    return;
                }

                assert.fail("Expected to throw an error");
            });
        });

        describe("'--fix-type' should not crash even if plugin rules exist; https://github.com/eslint/eslint/issues/11586", async () => {
            beforeEach(() => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => path.join(os.tmpdir(), "cli-engine/11586"),
                    files: {
                        "node_modules/eslint-plugin-test/index.js": `
                            exports.rules = {
                                "no-example": {
                                    meta: { type: "problem", fixable: "code" },
                                    create(context) {
                                        return {
                                            Identifier(node) {
                                                if (node.name === "example") {
                                                    context.report({
                                                        node,
                                                        message: "fix",
                                                        fix: fixer => fixer.replaceText(node, "fixed")
                                                    })
                                                }
                                            }
                                        };
                                    }
                                }
                            };
                        `,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["test"],
                            rules: { "test/no-example": "error" }
                        }),
                        "a.js": "example;"
                    }
                }));
                eslint = new ESLint({ fix: true, fixTypes: ["problem"] });
            });

            it("should not crash.", async () => {
                const results = await eslint.lintFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
                assert.deepStrictEqual(results[0].output, "fixed;");
            });
        });

        describe("multiple processors", () => {
            const root = path.join(os.tmpdir(), "eslint/cli-engine/multiple-processors");
            const commonFiles = {
                "node_modules/pattern-processor/index.js": fs.readFileSync(
                    require.resolve("../../fixtures/processors/pattern-processor"),
                    "utf8"
                ),
                "node_modules/eslint-plugin-markdown/index.js": `
                    const { defineProcessor } = require("pattern-processor");
                    const processor = defineProcessor(${/```(\w+)\n([\s\S]+?)\n```/gu});
                    exports.processors = {
                        ".md": { ...processor, supportsAutofix: true },
                        "non-fixable": processor
                    };
                `,
                "node_modules/eslint-plugin-html/index.js": `
                    const { defineProcessor } = require("pattern-processor");
                    const processor = defineProcessor(${/<script lang="(\w*)">\n([\s\S]+?)\n<\/script>/gu});
                    const legacyProcessor = defineProcessor(${/<script lang="(\w*)">\n([\s\S]+?)\n<\/script>/gu}, true);
                    exports.processors = {
                        ".html": { ...processor, supportsAutofix: true },
                        "non-fixable": processor,
                        "legacy": legacyProcessor
                    };
                `,
                "test.md": unIndent`
                    \`\`\`js
                    console.log("hello")
                    \`\`\`
                    \`\`\`html
                    <div>Hello</div>
                    <script lang="js">
                        console.log("hello")
                    </script>
                    <script lang="ts">
                        console.log("hello")
                    </script>
                    \`\`\`
                `
            };

            it("should lint only JavaScript blocks if '--ext' was not given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
            });

            it("should fix only JavaScript blocks if '--ext' was not given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, fix: true });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].output, unIndent`
                    \`\`\`js
                    console.log("hello");${/* ← fixed */""}
                    \`\`\`
                    \`\`\`html
                    <div>Hello</div>
                    <script lang="js">
                        console.log("hello")${/* ← ignored */""}
                    </script>
                    <script lang="ts">
                        console.log("hello")${/* ← ignored */""}
                    </script>
                    \`\`\`
                `);
            });

            it("should lint HTML blocks as well with multiple processors if '--ext' option was given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, extensions: ["js", "html"] });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7);
            });

            it("should fix HTML blocks as well with multiple processors if '--ext' option was given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, extensions: ["js", "html"], fix: true });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].output, unIndent`
                    \`\`\`js
                    console.log("hello");${/* ← fixed */""}
                    \`\`\`
                    \`\`\`html
                    <div>Hello</div>
                    <script lang="js">
                        console.log("hello");${/* ← fixed */""}
                    </script>
                    <script lang="ts">
                        console.log("hello")${/* ← ignored */""}
                    </script>
                    \`\`\`
                `);
            });

            it("should use overriden processor; should report HTML blocks but not fix HTML blocks if the processor for '*.html' didn't support autofix.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" },
                            overrides: [
                                {
                                    files: "*.html",
                                    processor: "html/non-fixable" // supportsAutofix: false
                                }
                            ]
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, extensions: ["js", "html"], fix: true });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS Block in HTML Block
                assert.strictEqual(results[0].messages[0].line, 7);
                assert.strictEqual(results[0].messages[0].fix, void 0);
                assert.strictEqual(results[0].output, unIndent`
                    \`\`\`js
                    console.log("hello");${/* ← fixed */""}
                    \`\`\`
                    \`\`\`html
                    <div>Hello</div>
                    <script lang="js">
                        console.log("hello")${/* ← reported but not fixed */""}
                    </script>
                    <script lang="ts">
                        console.log("hello")
                    </script>
                    \`\`\`
                `);
            });

            it("should use the config '**/*.html/*.js' to lint JavaScript blocks in HTML.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" },
                            overrides: [
                                {
                                    files: "*.html",

                                    // this rules are not used because ESLint re-resolve configs if a code block had a different file extension.
                                    rules: {
                                        semi: "error",
                                        "no-console": "off"
                                    }
                                },
                                {
                                    files: "**/*.html/*.js",
                                    rules: {
                                        semi: "off",
                                        "no-console": "error"
                                    }
                                }
                            ]
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, extensions: ["js", "html"] });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "no-console");
                assert.strictEqual(results[0].messages[1].line, 7);
            });

            it("should use the same config as one which has 'processor' property in order to lint blocks in HTML if the processor was legacy style.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" },
                            overrides: [
                                {
                                    files: "*.html",
                                    processor: "html/legacy", // this processor returns strings rather than `{text, filename}`
                                    rules: {
                                        semi: "off",
                                        "no-console": "error"
                                    }
                                },
                                {
                                    files: "**/*.html/*.js",
                                    rules: {
                                        semi: "error",
                                        "no-console": "off"
                                    }
                                }
                            ]
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root, extensions: ["js", "html"] });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 3);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "no-console");
                assert.strictEqual(results[0].messages[1].line, 7);
                assert.strictEqual(results[0].messages[2].ruleId, "no-console");
                assert.strictEqual(results[0].messages[2].line, 10);
            });

            it("should throw an error if invalid processor was specified.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            processor: "markdown/unknown"
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root });

                try {
                    await eslint.lintFiles(["test.md"]);
                } catch (e) {
                    assert.isTrue(/ESLint configuration of processor in '\.eslintrc\.json' is invalid: 'markdown\/unknown' was not found\./u.test(e.message));
                    return;
                }

                assert.fail("Expected to throw an error");
            });

            it("should lint HTML blocks as well with multiple processors if 'overrides[].files' is present.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": JSON.stringify({
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" },
                            overrides: [
                                {
                                    files: "*.html",
                                    processor: "html/.html"
                                },
                                {
                                    files: "*.md",
                                    processor: "markdown/.md"
                                }
                            ]
                        })
                    }
                }));
                eslint = new ESLint({ cwd: root });

                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7);
            });
        });

        describe("MODULE_NOT_FOUND error handling", () => {
            const cwd = getFixturePath("module-not-found");

            beforeEach(() => {
                eslint = new ESLint({ cwd });
            });

            it("should throw an error with a message template when 'extends' property has a non-existence JavaScript config.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "extends-js/test.js" });
                } catch (err) {
                    assert.strictEqual(err.messageTemplate, "extend-config-missing");
                    assert.deepStrictEqual(err.messageData, {
                        configName: "nonexistent-config",
                        importerName: getFixturePath("module-not-found", "extends-js", ".eslintrc.yml")
                    });
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with a message template when 'extends' property has a non-existence plugin config.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "extends-plugin/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, "plugin-missing");
                    assert.deepStrictEqual(err.messageData, {
                        importerName: `extends-plugin${path.sep}.eslintrc.yml`,
                        pluginName: "eslint-plugin-nonexistent-plugin",
                        resolvePluginsRelativeTo: cwd
                    });
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with a message template when 'plugins' property has a non-existence plugin.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "plugins/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, "plugin-missing");
                    assert.deepStrictEqual(err.messageData, {
                        importerName: `plugins${path.sep}.eslintrc.yml`,
                        pluginName: "eslint-plugin-nonexistent-plugin",
                        resolvePluginsRelativeTo: cwd
                    });
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when a JavaScript config threw a 'MODULE_NOT_FOUND' error.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "throw-in-config-itself/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'extends' property has a JavaScript config that throws a 'MODULE_NOT_FOUND' error.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "throw-in-extends-js/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'extends' property has a plugin config that throws a 'MODULE_NOT_FOUND' error.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "throw-in-extends-plugin/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'plugins' property has a plugin config that throws a 'MODULE_NOT_FOUND' error.", async () => {
                try {
                    await eslint.lintText("test", { filePath: "throw-in-plugins/test.js" });
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });
        });

        describe("with '--rulesdir' option", async () => {
            it("should use the configured rules which are defined by '--rulesdir' option.", async () => {
                const rootPath = getFixturePath("cli-engine/with-rulesdir");

                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => rootPath,
                    files: {
                        "internal-rules/test.js": `
                            module.exports = context => ({
                                ExpressionStatement(node) {
                                    context.report({ node, message: "ok" })
                                }
                            })
                        `,
                        ".eslintrc.json": JSON.stringify({
                            root: true,
                            rules: { test: "error" }
                        }),
                        "test.js": "console.log('hello')"
                    }
                }));
                eslint = new ESLint({
                    rulePaths: ["internal-rules"]
                });
                const results = await eslint.lintFiles(["test.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].message, "ok");
            });
        });

        describe("glob pattern '[ab].js'", () => {
            const root = getFixturePath("cli-engine/unmatched-glob");

            it("should match '[ab].js' if existed.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "a.js": "",
                        "b.js": "",
                        "ab.js": "",
                        "[ab].js": "",
                        ".eslintrc.yml": "root: true"
                    }
                }));
                eslint = new ESLint();

                const results = await eslint.lintFiles(["[ab].js"]);
                const filenames = results.map(r => path.basename(r.filePath));

                assert.deepStrictEqual(filenames, ["[ab].js"]);
            });

            it("should match 'a.js' and 'b.js' if '[ab].js' didn't existed.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "a.js": "",
                        "b.js": "",
                        "ab.js": "",
                        ".eslintrc.yml": "root: true"
                    }
                }));
                eslint = new ESLint();

                const results = await eslint.lintFiles(["[ab].js"]);
                const filenames = results.map(r => path.basename(r.filePath));

                assert.deepStrictEqual(filenames, ["a.js", "b.js"]);
            });
        });

        describe("with 'noInlineConfig' setting", async () => {
            const root = getFixturePath("cli-engine/noInlineConfig");

            it("should warn directive comments if 'noInlineConfig' was given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "test.js": "/* globals foo */",
                        ".eslintrc.yml": "noInlineConfig: true"
                    }
                }));
                eslint = new ESLint();

                const [{ messages }] = await eslint.lintFiles(["test.js"]);

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml).");
            });

            it("should show the config file what the 'noInlineConfig' came from.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "node_modules/eslint-config-foo/index.js": "module.exports = {noInlineConfig: true}",
                        "test.js": "/* globals foo */",
                        ".eslintrc.yml": "extends: foo"
                    }
                }));
                eslint = new ESLint();

                const [{ messages }] = await eslint.lintFiles(["test.js"]);

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml » eslint-config-foo).");
            });
        });

        describe("with 'reportUnusedDisableDirectives' setting", async () => {
            const root = getFixturePath("cli-engine/reportUnusedDisableDirectives");

            it("should warn unused 'eslint-disable' comments if 'reportUnusedDisableDirectives' was given.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "test.js": "/* eslint-disable eqeqeq */",
                        ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                    }
                }));
                eslint = new ESLint();

                const [{ messages }] = await eslint.lintFiles(["test.js"]);

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 1);
                assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
            });

            describe("the runtime option overrides config files.", () => {
                it("should not warn unused 'eslint-disable' comments if 'reportUnusedDisableDirectives=off' was given in runtime.", async () => {
                    ({ ESLint } = defineESLintWithInMemoryFileSystem({
                        cwd: () => root,
                        files: {
                            "test.js": "/* eslint-disable eqeqeq */",
                            ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                        }
                    }));
                    eslint = new ESLint({ reportUnusedDisableDirectives: false });

                    const [{ messages }] = await eslint.lintFiles(["test.js"]);

                    assert.strictEqual(messages.length, 0);
                });

                it("should warn unused 'eslint-disable' comments as error if 'reportUnusedDisableDirectives=error' was given in runtime.", async () => {
                    ({ ESLint } = defineESLintWithInMemoryFileSystem({
                        cwd: () => root,
                        files: {
                            "test.js": "/* eslint-disable eqeqeq */",
                            ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                        }
                    }));
                    eslint = new ESLint({ reportUnusedDisableDirectives: true });

                    const [{ messages }] = await eslint.lintFiles(["test.js"]);

                    assert.strictEqual(messages.length, 1);
                    assert.strictEqual(messages[0].severity, 2);
                    assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
                });
            });
        });

        describe("with 'overrides[*].extends' setting on deep locations", async () => {
            const root = getFixturePath("cli-engine/deeply-overrides-i-extends");

            it("should not throw.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                            overrides: [{ files: ["*test*"], extends: "two" }]
                        })}`,
                        "node_modules/eslint-config-two/index.js": `module.exports = ${JSON.stringify({
                            overrides: [{ files: ["*.js"], extends: "three" }]
                        })}`,
                        "node_modules/eslint-config-three/index.js": `module.exports = ${JSON.stringify({
                            rules: { "no-console": "error" }
                        })}`,
                        "test.js": "console.log('hello')",
                        ".eslintrc.yml": "extends: one"
                    }
                }));
                eslint = new ESLint();

                const [{ messages }] = await eslint.lintFiles(["test.js"]);

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });
        });

        describe("don't ignore the entry directory.", () => {
            const root = getFixturePath("cli-engine/dont-ignore-entry-dir");

            it("'executeOnFiles(\".\")' should not load config files from outside of \".\".", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "../.eslintrc.json": "BROKEN FILE",
                        ".eslintrc.json": JSON.stringify({ root: true }),
                        "index.js": "console.log(\"hello\")"
                    }
                }));
                eslint = new ESLint();

                // Don't throw "failed to load config file" error.
                eslint.lintFiles(".");
            });

            it("'executeOnFiles(\".\")' should not ignore '.' even if 'ignorePatterns' contains it.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        "../.eslintrc.json": JSON.stringify({ ignorePatterns: ["/dont-ignore-entry-dir"] }),
                        ".eslintrc.json": JSON.stringify({ root: true }),
                        "index.js": "console.log(\"hello\")"
                    }
                }));
                eslint = new ESLint();

                // Don't throw "file not found" error.
                eslint.lintFiles(".");
            });

            it("'executeOnFiles(\"subdir\")' should not ignore './subdir' even if 'ignorePatterns' contains it.", async () => {
                ({ ESLint } = defineESLintWithInMemoryFileSystem({
                    cwd: () => root,
                    files: {
                        ".eslintrc.json": JSON.stringify({ ignorePatterns: ["/subdir"] }),
                        "subdir/.eslintrc.json": JSON.stringify({ root: true }),
                        "subdir/index.js": "console.log(\"hello\")"
                    }
                }));
                eslint = new ESLint();

                // Don't throw "file not found" error.
                eslint.lintFiles("subdir");
            });
        });
    });
});
