/**
 * @fileoverview Tests for CLIEngine.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    path = require("path"),
    sinon = require("sinon"),
    shell = require("shelljs"),
    fs = require("fs"),
    os = require("os"),
    hash = require("../../../lib/cli-engine/hash"),
    {
        Legacy: {
            CascadingConfigArrayFactory
        }
    } = require("@eslint/eslintrc"),
    { unIndent, createCustomTeardown } = require("../../_utils");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const fCache = require("file-entry-cache");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CLIEngine", () => {

    const examplePluginName = "eslint-plugin-example",
        examplePluginNameWithNamespace = "@eslint/eslint-plugin-example",
        examplePlugin = {
            rules: {
                "example-rule": require("../../fixtures/rules/custom-rule"),
                "make-syntax-error": require("../../fixtures/rules/make-syntax-error-rule")
            }
        },
        examplePreprocessorName = "eslint-plugin-processor",
        originalDir = process.cwd(),
        fixtureDir = path.resolve(fs.realpathSync(os.tmpdir()), "eslint/fixtures");

    /** @type {import("../../../lib/cli-engine").CLIEngine} */
    let CLIEngine;

    /** @type {import("../../../lib/cli-engine/cli-engine").getCLIEngineInternalSlots} */
    let getCLIEngineInternalSlots;

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
        } catch {
            return filepath;
        }
    }

    /**
     * Create the CLIEngine object by mocking some of the plugins
     * @param {Object} options options for CLIEngine
     * @returns {CLIEngine} engine object
     * @private
     */
    function cliEngineWithPlugins(options) {
        return new CLIEngine(options, {
            preloadedPlugins: {
                [examplePluginName]: examplePlugin,
                [examplePluginNameWithNamespace]: examplePlugin,
                [examplePreprocessorName]: require("../../fixtures/processors/custom-processor")
            }
        });
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {

        /*
         * GitHub Actions Windows and macOS runners occasionally exhibit
         * extremely slow filesystem operations, during which copying fixtures
         * exceeds the default test timeout, so raise it just for this hook.
         * Mocha uses `this` to set timeouts on an individual hook level.
         */
        this.timeout(60 * 1000); // eslint-disable-line no-invalid-this -- Mocha API
        shell.mkdir("-p", fixtureDir);
        shell.cp("-r", "./tests/fixtures/.", fixtureDir);
    });

    beforeEach(() => {
        ({ CLIEngine, getCLIEngineInternalSlots } = require("../../../lib/cli-engine/cli-engine"));
    });

    after(() => {
        shell.rm("-r", fixtureDir);
    });

    describe("new CLIEngine(options)", () => {
        it("the default value of 'options.cwd' should be the current working directory.", () => {
            process.chdir(__dirname);
            try {
                const engine = new CLIEngine();
                const internalSlots = getCLIEngineInternalSlots(engine);

                assert.strictEqual(internalSlots.options.cwd, __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });

        it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new -- Testing synchronous throwing
                new CLIEngine({ ignorePath: fixtureDir });
            }, `Cannot read .eslintignore file: ${fixtureDir}\nError: EISDIR: illegal operation on a directory, read`);
        });

        // https://github.com/eslint/eslint/issues/2380
        it("should not modify baseConfig when format is specified", () => {
            const customBaseConfig = { root: true };

            new CLIEngine({ baseConfig: customBaseConfig, format: "foo" }); // eslint-disable-line no-new -- Test side effects

            assert.deepStrictEqual(customBaseConfig, { root: true });
        });
    });

    describe("executeOnText()", () => {

        let engine;

        describe("when using local cwd .eslintrc", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "eslint/multiple-rules-config"),
                files: {
                    ".eslintrc.json": {
                        root: true,
                        rules: {
                            quotes: 2,
                            "no-var": 2,
                            "eol-last": 2,
                            strict: [2, "global"],
                            "no-unused-vars": 2
                        },
                        env: {
                            node: true
                        }
                    }
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("should report the total and per file errors", () => {

                engine = new CLIEngine({ cwd: getPath() });

                const report = engine.executeOnText("var foo = 'bar';");

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.errorCount, 5);
                assert.strictEqual(report.warningCount, 0);
                assert.strictEqual(report.fatalErrorCount, 0);
                assert.strictEqual(report.fixableErrorCount, 3);
                assert.strictEqual(report.fixableWarningCount, 0);
                assert.strictEqual(report.results[0].messages.length, 5);
                assert.strictEqual(report.results[0].messages[0].ruleId, "strict");
                assert.strictEqual(report.results[0].messages[1].ruleId, "no-var");
                assert.strictEqual(report.results[0].messages[2].ruleId, "no-unused-vars");
                assert.strictEqual(report.results[0].messages[3].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[4].ruleId, "eol-last");
                assert.strictEqual(report.results[0].fixableErrorCount, 3);
                assert.strictEqual(report.results[0].fixableWarningCount, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should report the total and per file warnings", () => {

                engine = new CLIEngine({
                    cwd: getPath(),
                    rules: {
                        quotes: 1,
                        "no-var": 1,
                        "eol-last": 1,
                        strict: 1,
                        "no-unused-vars": 1
                    }
                });

                const report = engine.executeOnText("var foo = 'bar';");

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.errorCount, 0);
                assert.strictEqual(report.warningCount, 5);
                assert.strictEqual(report.fixableErrorCount, 0);
                assert.strictEqual(report.fixableWarningCount, 3);
                assert.strictEqual(report.results[0].messages.length, 5);
                assert.strictEqual(report.results[0].messages[0].ruleId, "strict");
                assert.strictEqual(report.results[0].messages[1].ruleId, "no-var");
                assert.strictEqual(report.results[0].messages[2].ruleId, "no-unused-vars");
                assert.strictEqual(report.results[0].messages[3].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[4].ruleId, "eol-last");
                assert.strictEqual(report.results[0].fixableErrorCount, 0);
                assert.strictEqual(report.results[0].fixableWarningCount, 3);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });
        });

        it("should report one message when using specific config file", () => {

            engine = new CLIEngine({
                configFile: "fixtures/configurations/quotes-error.json",
                useEslintrc: false,
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var foo = 'bar';");

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.errorCount, 1);
            assert.strictEqual(report.warningCount, 0);
            assert.strictEqual(report.fixableErrorCount, 1);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
            assert.isUndefined(report.results[0].messages[0].output);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report the filename when passed in", () => {

            engine = new CLIEngine({
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var foo = 'bar';", "test.js");

            assert.strictEqual(report.results[0].filePath, getFixturePath("test.js"));
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js", true);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.errorCount, 0);
            assert.strictEqual(report.warningCount, 1);
            assert.strictEqual(report.fatalErrorCount, 0);
            assert.strictEqual(report.fixableErrorCount, 0);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(report.results[0].messages[0].severity, 1);
            assert.strictEqual(report.results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.isUndefined(report.results[0].messages[0].output);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            // intentional parsing error
            const report = engine.executeOnText("va r bar = foo;", "fixtures/passing.js", false);

            // should not report anything because the file is ignored
            assert.strictEqual(report.results.length, 0);
        });

        it("should suppress excluded file warnings by default", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js");

            // should not report anything because there are no errors
            assert.strictEqual(report.results.length, 0);
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", () => {

            engine = new CLIEngine({
                ignorePath: "fixtures/.eslintignore",
                cwd: getFixturePath(".."),
                ignore: false,
                useEslintrc: false,
                rules: {
                    "no-undef": 2
                }
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js");

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(report.results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.isUndefined(report.results[0].messages[0].output);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return a message and fixed text when in fix mode", () => {

            engine = new CLIEngine({
                useEslintrc: false,
                fix: true,
                rules: {
                    semi: 2
                },
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var bar = foo", "passing.js");

            assert.deepStrictEqual(report, {
                results: [
                    {
                        filePath: getFixturePath("passing.js"),
                        messages: [],
                        suppressedMessages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var bar = foo;"
                    }
                ],
                errorCount: 0,
                warningCount: 0,
                fatalErrorCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                usedDeprecatedRules: [
                    {
                        ruleId: "semi",
                        replacedBy: []
                    }
                ]
            });
        });

        it("correctly autofixes semicolon-conflicting-fixes", () => {
            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                useEslintrc: false,
                fix: true
            });
            const inputPath = getFixturePath("autofix/semicolon-conflicting-fixes.js");
            const outputPath = getFixturePath("autofix/semicolon-conflicting-fixes.expected.js");
            const report = engine.executeOnFiles([inputPath]);
            const expectedOutput = fs.readFileSync(outputPath, "utf8");

            assert.strictEqual(report.results[0].output, expectedOutput);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("correctly autofixes return-conflicting-fixes", () => {
            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                useEslintrc: false,
                fix: true
            });
            const inputPath = getFixturePath("autofix/return-conflicting-fixes.js");
            const outputPath = getFixturePath("autofix/return-conflicting-fixes.expected.js");
            const report = engine.executeOnFiles([inputPath]);
            const expectedOutput = fs.readFileSync(outputPath, "utf8");

            assert.strictEqual(report.results[0].output, expectedOutput);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        describe("Fix Types", () => {

            it("should throw an error when an invalid fix type is specified", () => {
                assert.throws(() => {
                    engine = new CLIEngine({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        fix: true,
                        fixTypes: ["layou"]
                    });
                }, /invalid fix type/iu);
            });

            it("should not fix any rules when fixTypes is used without fix", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: false,
                    fixTypes: ["layout"]
                });

                const inputPath = getFixturePath("fix-types/fix-only-semi.js");
                const report = engine.executeOnFiles([inputPath]);

                assert.isUndefined(report.results[0].output);
            });

            it("should not fix non-style rules when fixTypes has only 'layout'", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"]
                });
                const inputPath = getFixturePath("fix-types/fix-only-semi.js");
                const outputPath = getFixturePath("fix-types/fix-only-semi.expected.js");
                const report = engine.executeOnFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

            it("should not fix style or problem rules when fixTypes has only 'suggestion'", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["suggestion"]
                });
                const inputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.js");
                const outputPath = getFixturePath("fix-types/fix-only-prefer-arrow-callback.expected.js");
                const report = engine.executeOnFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

            it("should fix both style and problem rules when fixTypes has 'suggestion' and 'layout'", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["suggestion", "layout"]
                });
                const inputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.js");
                const outputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.expected.js");
                const report = engine.executeOnFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

            it("should not throw an error when a rule doesn't have a 'meta' property", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"],
                    rulePaths: [getFixturePath("rules", "fix-types-test")]
                });

                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const report = engine.executeOnFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

            it("should not throw an error when a rule is loaded after initialization with executeOnFiles()", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"]
                });
                const internalSlots = getCLIEngineInternalSlots(engine);

                internalSlots.linter.defineRule(
                    "no-program",
                    require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                );

                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const report = engine.executeOnFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

            it("should not throw an error when a rule is loaded after initialization with executeOnText()", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"]
                });
                const internalSlots = getCLIEngineInternalSlots(engine);

                internalSlots.linter.defineRule(
                    "no-program",
                    require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                );

                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const report = engine.executeOnText(fs.readFileSync(inputPath, { encoding: "utf8" }), inputPath);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(report.results[0].output, expectedOutput);
            });

        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", () => {

            engine = new CLIEngine({
                useEslintrc: false,
                fix: true,
                rules: {
                    "no-undef": 2
                },
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var bar = foo", "passing.js");

            assert.deepStrictEqual(report, {
                results: [
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
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar = foo"
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fatalErrorCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                usedDeprecatedRules: []
            });
        });

        it("should not delete code if there is a syntax error after trying to autofix.", () => {
            engine = cliEngineWithPlugins({
                useEslintrc: false,
                fix: true,
                plugins: ["example"],
                rules: {
                    "example/make-syntax-error": "error"
                },
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var bar = foo", "test.js");

            assert.deepStrictEqual(report, {
                results: [
                    {
                        filePath: getFixturePath("test.js"),
                        messages: [
                            {
                                ruleId: null,
                                fatal: true,
                                severity: 2,
                                message: "Parsing error: Unexpected token is",
                                line: 1,
                                column: 19,
                                nodeType: null
                            }
                        ],
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 1,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var bar = foothis is a syntax error."
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fatalErrorCount: 1,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                usedDeprecatedRules: []
            });
        });

        it("should not crash even if there are any syntax error since the first time.", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                fix: true,
                rules: {
                    "example/make-syntax-error": "error"
                },
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var bar =", "test.js");

            assert.deepStrictEqual(report, {
                results: [
                    {
                        filePath: getFixturePath("test.js"),
                        messages: [
                            {
                                ruleId: null,
                                fatal: true,
                                severity: 2,
                                message: "Parsing error: Unexpected token",
                                line: 1,
                                column: 10,
                                nodeType: null
                            }
                        ],
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 1,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar ="
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fatalErrorCount: 1,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                usedDeprecatedRules: []
            });
        });

        it("should return source code of file in `source` property when errors are present", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 2 }
            });

            const report = engine.executeOnText("var foo = 'bar'");

            assert.strictEqual(report.results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 1 }
            });

            const report = engine.executeOnText("var foo = 'bar'");

            assert.strictEqual(report.results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 2 }
            });

            const report = engine.executeOnText("var foo = 'bar';");

            assert.lengthOf(report.results[0].messages, 0);
            assert.isUndefined(report.results[0].source);
        });

        it("should not return a `source` property when fixes are applied", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                fix: true,
                rules: {
                    semi: 2,
                    "no-unused-vars": 2
                }
            });

            const report = engine.executeOnText("var msg = 'hi' + foo\n");

            assert.isUndefined(report.results[0].source);
            assert.strictEqual(report.results[0].output, "var msg = 'hi' + foo;\n");
        });

        it("should return a `source` property when a parsing error has occurred", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { eqeqeq: 2 }
            });

            const report = engine.executeOnText("var bar = foothis is a syntax error.\n return bar;");

            assert.deepStrictEqual(report, {
                results: [
                    {
                        filePath: "<text>",
                        messages: [
                            {
                                ruleId: null,
                                fatal: true,
                                severity: 2,
                                message: "Parsing error: Unexpected token is",
                                line: 1,
                                column: 19,
                                nodeType: null
                            }
                        ],
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 1,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar = foothis is a syntax error.\n return bar;"
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fatalErrorCount: 1,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                usedDeprecatedRules: []
            });
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should respect default ignore rules, even with --no-ignore", () => {

            engine = new CLIEngine({
                cwd: getFixturePath(),
                ignore: false
            });

            const report = engine.executeOnText("var bar = foo;", "node_modules/passing.js", true);
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, getFixturePath("node_modules/passing.js"));
            assert.strictEqual(report.results[0].messages[0].message, expectedMsg);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        // @scope for @scope/eslint-plugin
        describe("(plugin shorthand)", () => {
            const Module = require("module");
            let originalFindPath = null;

            /* eslint-disable no-underscore-dangle -- Private Node API overriding */
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
            /* eslint-enable no-underscore-dangle -- Private Node API overriding */

            it("should resolve 'plugins:[\"@scope\"]' to 'node_modules/@scope/eslint-plugin'.", () => {
                engine = new CLIEngine({ cwd: getFixturePath("plugin-shorthand/basic") });
                const report = engine.executeOnText("var x = 0", "index.js").results[0];

                assert.strictEqual(report.filePath, getFixturePath("plugin-shorthand/basic/index.js"));
                assert.strictEqual(report.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(report.messages[0].message, "OK");
                assert.strictEqual(report.suppressedMessages.length, 0);
            });

            it("should resolve 'extends:[\"plugin:@scope/recommended\"]' to 'node_modules/@scope/eslint-plugin'.", () => {
                engine = new CLIEngine({ cwd: getFixturePath("plugin-shorthand/extends") });
                const report = engine.executeOnText("var x = 0", "index.js").results[0];

                assert.strictEqual(report.filePath, getFixturePath("plugin-shorthand/extends/index.js"));
                assert.strictEqual(report.messages[0].ruleId, "@scope/rule");
                assert.strictEqual(report.messages[0].message, "OK");
                assert.strictEqual(report.suppressedMessages.length, 0);
            });
        });
        it("should warn when deprecated rules are found in a config", () => {
            engine = new CLIEngine({
                cwd: originalDir,
                useEslintrc: false,
                configFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml"
            });

            const report = engine.executeOnText("foo");

            assert.deepStrictEqual(
                report.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });
    });

    describe("executeOnFiles()", () => {

        /** @type {InstanceType<import("../../../lib/cli-engine").CLIEngine>} */
        let engine;

        it("should use correct parser when custom parser is specified", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                ignore: false
            });

            const filePath = path.resolve(__dirname, "../../fixtures/configurations/parser/custom.js");
            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.results[0].messages[0].message, "Parsing error: Boom!");
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                useEslintrc: false,
                ignore: false,
                overrideConfigFile: "tests/fixtures/simple-valid-project/.eslintrc.js"
            });

            const report = engine.executeOnFiles(["tests/fixtures/simple-valid-project/**/foo*.js"]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                useEslintrc: false,
                ignore: false,
                overrideConfigFile: "tests/fixtures/simple-valid-project/.eslintrc.js"
            });

            const report = engine.executeOnFiles([
                "tests/fixtures/simple-valid-project/**/foo*.js",
                "tests/fixtures/simple-valid-project/foo.?s",
                "tests/fixtures/simple-valid-project/{foo,src/foobar}.js"
            ]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[1].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and espree as parser", () => {

            engine = new CLIEngine({
                parser: "espree",
                parserOptions: {
                    ecmaVersion: 2021
                },
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli.js"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", () => {

            engine = new CLIEngine({
                parser: "esprima",
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli.js"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should throw an error when given a config file and a valid file and invalid parser", () => {

            engine = new CLIEngine({
                parser: "test11",
                useEslintrc: false
            });

            assert.throws(() => engine.executeOnFiles(["lib/cli.js"]), "Cannot find module 'test11'");
        });

        it("should report zero messages when given a directory with a .js2 file", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                extensions: [".js2"]
            });

            const report = engine.executeOnFiles([getFixturePath("files/foo.js2")]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should fall back to defaults when extensions is set to an empty array", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("configurations"),
                configFile: getFixturePath("configurations", "quotes-error.json"),
                extensions: []
            });
            const report = engine.executeOnFiles([getFixturePath("single-quoted.js")]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.errorCount, 1);
            assert.strictEqual(report.warningCount, 0);
            assert.strictEqual(report.fixableErrorCount, 1);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a directory with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnFiles(["fixtures/files/"]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a '**' pattern with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/*"]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should resolve globs when 'globInputPaths' option is true", () => {
            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnFiles(["fixtures/files/*"]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should not resolve globs when 'globInputPaths' option is false", () => {
            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath(".."),
                globInputPaths: false
            });

            assert.throws(() => {
                engine.executeOnFiles(["fixtures/files/*"]);
            }, "No files matching 'fixtures/files/*' were found (glob was disabled).");
        });

        it("should report on all files passed explicitly, even if ignored by default", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine")
            });

            const report = engine.executeOnFiles(["node_modules/foo.js"]);
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].message, expectedMsg);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report on globs with explicit inclusion of dotfiles, even though ignored by default", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["hidden/.hiddenfolder/*.js"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should not check default ignored files without --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine")
            });

            assert.throws(() => {
                engine.executeOnFiles(["node_modules"]);
            }, "All files matched by 'node_modules' are ignored.");
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should not check node_modules files even with --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                ignore: false
            });

            assert.throws(() => {
                engine.executeOnFiles(["node_modules"]);
            }, "All files matched by 'node_modules' are ignored.");
        });

        it("should not check .hidden files if they are passed explicitly without --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath(".."),
                useEslintrc: false,
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["fixtures/files/.bar.js"]);
            const expectedMsg = "File ignored by default.  Use a negated ignore pattern (like \"--ignore-pattern '!<relative/path/to/filename>'\") to override.";

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].message, expectedMsg);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        // https://github.com/eslint/eslint/issues/12873
        it("should not check files within a .hidden folder if they are passed explicitly without the --no-ignore flag", () => {
            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["hidden/.hiddenfolder/double-quotes.js"]);
            const expectedMsg = "File ignored by default.  Use a negated ignore pattern (like \"--ignore-pattern '!<relative/path/to/filename>'\") to override.";

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].message, expectedMsg);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should check .hidden files if they are passed explicitly with --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath(".."),
                ignore: false,
                useEslintrc: false,
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["fixtures/files/.bar.js"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should check .hidden files if they are unignored with an --ignore-pattern", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                ignore: true,
                useEslintrc: false,
                ignorePattern: "!.hidden*",
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["hidden/"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a pattern with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/*.?s*"]);

            assert.strictEqual(report.results.length, 2);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[1].suppressedMessages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("configurations"),
                configFile: getFixturePath("configurations", "quotes-error.json")
            });
            const report = engine.executeOnFiles([getFixturePath("single-quoted.js")]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.errorCount, 1);
            assert.strictEqual(report.warningCount, 0);
            assert.strictEqual(report.fixableErrorCount, 1);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].errorCount, 1);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 1);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return 3 messages when given a config file and a directory of 3 valid files", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "semi-error.json")
            });

            const fixturePath = getFixturePath("formatters");
            const report = engine.executeOnFiles([fixturePath]);

            assert.strictEqual(report.errorCount, 0);
            assert.strictEqual(report.warningCount, 0);
            assert.strictEqual(report.fixableErrorCount, 0);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results.length, 5);
            assert.strictEqual(path.relative(fixturePath, report.results[0].filePath), "async.js");
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[1].filePath), "broken.js");
            assert.strictEqual(report.results[1].errorCount, 0);
            assert.strictEqual(report.results[1].warningCount, 0);
            assert.strictEqual(report.results[1].fixableErrorCount, 0);
            assert.strictEqual(report.results[1].fixableWarningCount, 0);
            assert.strictEqual(report.results[1].messages.length, 0);
            assert.strictEqual(report.results[1].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[2].filePath), "cwd.js");
            assert.strictEqual(report.results[2].errorCount, 0);
            assert.strictEqual(report.results[2].warningCount, 0);
            assert.strictEqual(report.results[2].fixableErrorCount, 0);
            assert.strictEqual(report.results[2].fixableWarningCount, 0);
            assert.strictEqual(report.results[2].messages.length, 0);
            assert.strictEqual(report.results[2].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[3].filePath), "simple.js");
            assert.strictEqual(report.results[3].errorCount, 0);
            assert.strictEqual(report.results[3].warningCount, 0);
            assert.strictEqual(report.results[3].fixableErrorCount, 0);
            assert.strictEqual(report.results[3].fixableWarningCount, 0);
            assert.strictEqual(report.results[3].messages.length, 0);
            assert.strictEqual(report.results[3].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[4].filePath), path.join("test", "simple.js"));
            assert.strictEqual(report.results[4].errorCount, 0);
            assert.strictEqual(report.results[4].warningCount, 0);
            assert.strictEqual(report.results[4].fixableErrorCount, 0);
            assert.strictEqual(report.results[4].fixableWarningCount, 0);
            assert.strictEqual(report.results[4].messages.length, 0);
            assert.strictEqual(report.results[4].suppressedMessages.length, 0);
        });


        it("should return the total number of errors when given multiple files", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "single-quotes-error.json")
            });

            const fixturePath = getFixturePath("formatters");
            const report = engine.executeOnFiles([fixturePath]);

            assert.strictEqual(report.errorCount, 6);
            assert.strictEqual(report.warningCount, 0);
            assert.strictEqual(report.fixableErrorCount, 6);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results.length, 5);
            assert.strictEqual(path.relative(fixturePath, report.results[0].filePath), "async.js");
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[1].filePath), "broken.js");
            assert.strictEqual(report.results[1].errorCount, 0);
            assert.strictEqual(report.results[1].warningCount, 0);
            assert.strictEqual(report.results[1].fixableErrorCount, 0);
            assert.strictEqual(report.results[1].fixableWarningCount, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[2].filePath), "cwd.js");
            assert.strictEqual(report.results[2].errorCount, 0);
            assert.strictEqual(report.results[2].warningCount, 0);
            assert.strictEqual(report.results[2].fixableErrorCount, 0);
            assert.strictEqual(report.results[2].fixableWarningCount, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[3].filePath), "simple.js");
            assert.strictEqual(report.results[3].errorCount, 3);
            assert.strictEqual(report.results[3].warningCount, 0);
            assert.strictEqual(report.results[3].fixableErrorCount, 3);
            assert.strictEqual(report.results[3].fixableWarningCount, 0);
            assert.strictEqual(path.relative(fixturePath, report.results[4].filePath), path.join("test", "simple.js"));
            assert.strictEqual(report.results[4].errorCount, 3);
            assert.strictEqual(report.results[4].warningCount, 0);
            assert.strictEqual(report.results[4].fixableErrorCount, 3);
            assert.strictEqual(report.results[4].fixableWarningCount, 0);
        });

        it("should process when file is given by not specifying extensions", () => {

            engine = new CLIEngine({
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/foo.js2"]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when given a config with environment set to browser", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-browser.json")
            });

            const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when given an option to set environment to browser", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                envs: ["browser"],
                rules: {
                    "no-alert": 0,
                    "no-undef": 2
                }
            });

            const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-node.json")
            });

            const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should not return results from previous call when calling more than once", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                ignore: false,
                rules: {
                    semi: 2
                }
            });

            const failFilePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));
            const passFilePath = fs.realpathSync(getFixturePath("passing.js"));

            let report = engine.executeOnFiles([failFilePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, failFilePath);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.results[0].messages[0].ruleId, "semi");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);

            report = engine.executeOnFiles([passFilePath]);
            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, passFilePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);

        });

        it("should throw an error when given a directory with all eslint excluded files in the directory", () => {

            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore")
            });

            assert.throws(() => {
                engine.executeOnFiles([getFixturePath("./cli-engine/")]);
            }, `All files matched by '${getFixturePath("./cli-engine/")}' are ignored.`);
        });

        it("should throw an error when all given files are ignored", () => {

            engine = new CLIEngine({
                useEslintrc: false,
                ignorePath: getFixturePath(".eslintignore")
            });

            assert.throws(() => {
                engine.executeOnFiles(["tests/fixtures/cli-engine/"]);
            }, "All files matched by 'tests/fixtures/cli-engine/' are ignored.");
        });

        it("should throw an error when all given files are ignored even with a `./` prefix", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                ignorePath: getFixturePath(".eslintignore")
            });

            assert.throws(() => {
                engine.executeOnFiles(["./tests/fixtures/cli-engine/"]);
            }, "All files matched by './tests/fixtures/cli-engine/' are ignored.");
        });

        // https://github.com/eslint/eslint/issues/3788
        it("should ignore one-level down node_modules when ignore file has 'node_modules/' in it", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath("cli-engine", "nested_node_modules", ".eslintignore"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "double"]
                },
                cwd: getFixturePath("cli-engine", "nested_node_modules")
            });

            const report = engine.executeOnFiles(["."]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        // https://github.com/eslint/eslint/issues/3812
        it("should ignore all files and throw an error when tests/fixtures/ is in ignore file", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath("cli-engine/.eslintignore2"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "double"]
                }
            });

            assert.throws(() => {
                engine.executeOnFiles(["./tests/fixtures/cli-engine/"]);
            }, "All files matched by './tests/fixtures/cli-engine/' are ignored.");
        });

        it("should throw an error when all given files are ignored via ignore-pattern", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                ignorePattern: "tests/fixtures/single-quoted.js"
            });

            assert.throws(() => {
                engine.executeOnFiles(["tests/fixtures/*-quoted.js"]);
            }, "All files matched by 'tests/fixtures/*-quoted.js' are ignored.");
        });

        it("should return a warning when an explicitly given file is ignored", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath()
            });

            const filePath = getFixturePath("passing.js");

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.errorCount, 0);
            assert.strictEqual(report.warningCount, 1);
            assert.strictEqual(report.fatalErrorCount, 0);
            assert.strictEqual(report.fixableErrorCount, 0);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages[0].severity, 1);
            assert.strictEqual(report.results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return two messages when given a file in excluded files list while ignore is off", () => {

            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                ignore: false,
                rules: {
                    "no-undef": 2
                }
            });

            const filePath = fs.realpathSync(getFixturePath("undef.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].messages[1].ruleId, "no-undef");
            assert.strictEqual(report.results[0].messages[1].severity, 2);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing a file with a shebang", () => {

            engine = new CLIEngine({
                ignore: false
            });

            const report = engine.executeOnFiles([getFixturePath("shebang.js")]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should give a warning when loading a custom rule that doesn't exist", () => {

            engine = new CLIEngine({
                ignore: false,
                rulesPaths: [getFixturePath("rules", "dir1")],
                configFile: getFixturePath("rules", "missing-rule.json")
            });
            const report = engine.executeOnFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].messages.length, 1);
            assert.strictEqual(report.results[0].messages[0].ruleId, "missing-rule");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].messages[0].message, "Definition for rule 'missing-rule' was not found.");
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should throw an error when loading a bad custom rule", () => {

            engine = new CLIEngine({
                ignore: false,
                rulePaths: [getFixturePath("rules", "wrong")],
                configFile: getFixturePath("rules", "eslint.json")
            });


            assert.throws(() => {
                engine.executeOnFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);
            }, /Error while loading rule 'custom-rule'/u);
        });

        it("should return one message when a custom rule matches a file", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                rulePaths: [getFixturePath("rules/")],
                configFile: getFixturePath("rules", "eslint.json")
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 2);
            assert.strictEqual(report.results[0].messages[0].ruleId, "custom-rule");
            assert.strictEqual(report.results[0].messages[0].severity, 1);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should load custom rule from the provided cwd", () => {
            const cwd = path.resolve(getFixturePath("rules"));

            engine = new CLIEngine({
                ignore: false,
                cwd,
                rulePaths: ["./"],
                configFile: "eslint.json"
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 2);
            assert.strictEqual(report.results[0].messages[0].ruleId, "custom-rule");
            assert.strictEqual(report.results[0].messages[0].severity, 1);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return messages when multiple custom rules match a file", () => {

            engine = new CLIEngine({
                ignore: false,
                rulePaths: [
                    getFixturePath("rules", "dir1"),
                    getFixturePath("rules", "dir2")
                ],
                configFile: getFixturePath("rules", "multi-rulesdirs.json")
            });

            const filePath = fs.realpathSync(getFixturePath("rules", "test-multi-rulesdirs.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 2);
            assert.strictEqual(report.results[0].messages[0].ruleId, "no-literals");
            assert.strictEqual(report.results[0].messages[0].severity, 2);
            assert.strictEqual(report.results[0].messages[1].ruleId, "no-strings");
            assert.strictEqual(report.results[0].messages[1].severity, 2);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing without useEslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing without useEslintrc flag in Node.js environment", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("process-exit.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing with base-config flag set to false", () => {

            engine = new CLIEngine({
                ignore: false,
                baseConfig: false,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages and ignore .eslintrc files when executing with no-eslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("eslintrc", "quotes.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages and ignore package.json files when executing with no-eslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("packagejson", "quotes.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.strictEqual(report.results.length, 1);
            assert.strictEqual(report.results[0].filePath, filePath);
            assert.strictEqual(report.results[0].messages.length, 0);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should warn when deprecated rules are configured", () => {
            engine = new CLIEngine({
                cwd: originalDir,
                useEslintrc: false,
                rules: {
                    "indent-legacy": 1,
                    "require-jsdoc": 1,
                    "valid-jsdoc": 1
                }
            });

            const report = engine.executeOnFiles(["lib/cli*.js"]);

            assert.sameDeepMembers(
                report.usedDeprecatedRules,
                [
                    { ruleId: "indent-legacy", replacedBy: ["indent"] },
                    { ruleId: "require-jsdoc", replacedBy: [] },
                    { ruleId: "valid-jsdoc", replacedBy: [] }
                ]
            );
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should not warn when deprecated rules are not configured", () => {
            engine = new CLIEngine({
                cwd: originalDir,
                useEslintrc: false,
                rules: { eqeqeq: 1, "valid-jsdoc": 0, "require-jsdoc": 0 }
            });

            const report = engine.executeOnFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(report.usedDeprecatedRules, []);
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        it("should warn when deprecated rules are found in a config", () => {
            engine = new CLIEngine({
                cwd: originalDir,
                configFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml",
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(
                report.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
            assert.strictEqual(report.results[0].suppressedMessages.length, 0);
        });

        describe("Fix Mode", () => {

            it("should return fixed text on multiple files when in fix mode", () => {

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

                engine = new CLIEngine({
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

                const report = engine.executeOnFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                report.results.forEach(convertCRLF);
                assert.deepStrictEqual(report.results, [
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/multipass.js")),
                        messages: [],
                        suppressedMessages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "true ? \"yes\" : \"no\";\n"
                    },
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/ok.js")),
                        messages: [],
                        suppressedMessages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0
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
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var msg = \"hi\";\nif (msg == \"hi\") {\n\n}\n"
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
                        suppressedMessages: [],
                        errorCount: 1,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var msg = \"hi\" + foo;\n"
                    }
                ]);
                assert.strictEqual(report.errorCount, 2);
                assert.strictEqual(report.warningCount, 0);
                assert.strictEqual(report.fixableErrorCount, 0);
                assert.strictEqual(report.fixableWarningCount, 0);
            });

            it("should run autofix even if files are cached without autofix results", () => {
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

                engine = new CLIEngine(Object.assign({}, baseOptions, { cache: true, fix: false }));

                // Do initial lint run and populate the cache file
                engine.executeOnFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                engine = new CLIEngine(Object.assign({}, baseOptions, { cache: true, fix: true }));

                const report = engine.executeOnFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                assert.ok(report.results.some(result => result.output));
            });

        });

        // These tests have to do with https://github.com/eslint/eslint/issues/963

        describe("configuration hierarchy", () => {

            // Default configuration - blank
            it("should return zero messages when executing with no .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // No default configuration rules - conf/environments.js (/*eslint-env node*/)
            it("should return zero messages when executing with no .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    reset: true,
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes-node.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 2);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - second level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - third level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent and grandparent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/subsubbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - first level package.json
            it("should return one message when executing with package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - second level package.json
            it("should return zero messages when executing with local package.json that overrides parent package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - third level package.json
            it("should return one message when executing with local package.json that overrides parent and grandparent package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/subsubsubdir/wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 2);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Project configuration - .eslintrc overrides package.json in same directory
            it("should return one message when executing with .eslintrc that overrides a package.json in the same directory", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 2);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return two messages when executing with config file that adds to local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 2);
                assert.strictEqual(report.results[0].messages[1].ruleId, "semi");
                assert.strictEqual(report.results[0].messages[1].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].messages[1].ruleId, "semi");
                assert.strictEqual(report.results[0].messages[1].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return one message when executing with config file that overrides local and parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("config-hierarchy/broken/override-conf.yaml")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "no-console");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 0);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("config-hierarchy/broken/override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("/config-hierarchy/broken/override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    }
                });

                const report = engine.executeOnFiles([getFixturePath("config-hierarchy/broken/console-wrong-quotes.js")]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "quotes");
                assert.strictEqual(report.results[0].messages[0].severity, 1);
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

        });

        describe("plugins", () => {
            it("should return two messages when executing with config file that specifies a plugin", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-with-prefix.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test/test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "example/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when executing with config file that specifies a plugin with namespace", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-with-prefix-and-namespace.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "@eslint/example/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "example/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix and with namespace", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix-with-namespace.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "@eslint/example/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when executing with cli option that specifies a plugin", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["example"],
                    rules: { "example/example-rule": 1 }
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "example/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["test"],
                    rules: { "test/example-rule": 1 }
                }, {
                    preloadedPlugins: {
                        "eslint-plugin-test": {
                            rules: {
                                "example-rule": require("../../fixtures/rules/custom-rule")
                            }
                        }
                    }
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
                assert.strictEqual(report.results[0].messages[0].ruleId, "test/example-rule");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });

            it("should load plugins from the `loadPluginsRelativeTo` directory, if specified", () => {
                engine = new CLIEngine({
                    resolvePluginsRelativeTo: getFixturePath("plugins"),
                    baseConfig: {
                        plugins: ["with-rules"],
                        rules: { "with-rules/rule1": "error" }
                    },
                    useEslintrc: false
                });

                const report = engine.executeOnText("foo");

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].ruleId, "with-rules/rule1");
                assert.strictEqual(report.results[0].messages[0].message, "Rule report from plugin");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
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
                } catch {

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

            describe("when the cacheFile is a directory or looks like a directory", () => {

                /**
                 * helper method to delete the cache files created during testing
                 * @returns {void}
                 */
                function deleteCacheDir() {
                    try {
                        fs.unlinkSync("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory");
                    } catch {

                        /*
                         * we don't care if the file didn't exist, since our
                         * intention was to remove the file
                         */
                    }
                }
                beforeEach(() => {
                    deleteCacheDir();
                });

                afterEach(() => {
                    deleteCacheDir();
                });

                it("should create the cache file inside the provided directory", () => {
                    assert.isFalse(shell.test("-d", path.resolve("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory")), "the cache for eslint does not exist");

                    engine = new CLIEngine({
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheFile: "./tmp/.cacheFileDir/",
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"],
                        ignore: false
                    });

                    const file = getFixturePath("cache/src", "test-file.js");

                    engine.executeOnFiles([file]);

                    assert.isTrue(shell.test("-f", path.resolve(`./tmp/.cacheFileDir/.cache_${hash(process.cwd())}`)), "the cache for eslint was created");

                    sinon.restore();
                });
            });

            it("should create the cache file inside the provided directory using the cacheLocation option", () => {
                assert.isFalse(shell.test("-d", path.resolve("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory")), "the cache for eslint does not exist");

                engine = new CLIEngine({
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

                engine.executeOnFiles([file]);

                assert.isTrue(shell.test("-f", path.resolve(`./tmp/.cacheFileDir/.cache_${hash(process.cwd())}`)), "the cache for eslint was created");

                sinon.restore();
            });

            it("should create the cache file inside cwd when no cacheLocation provided", () => {
                const cwd = path.resolve(getFixturePath("cli-engine"));

                engine = new CLIEngine({
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

                engine.executeOnFiles([file]);

                assert.isTrue(shell.test("-f", path.resolve(cwd, ".eslintcache")), "the cache for eslint was created at provided cwd");
            });

            it("should invalidate the cache if the configuration changed between executions", () => {
                assert.isFalse(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                engine = new CLIEngine({
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

                const result = engine.executeOnFiles([file]);

                assert.strictEqual(result.errorCount + result.warningCount, 0, "the file passed without errors or warnings");
                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                engine = new CLIEngine({
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

                const cachedResult = engine.executeOnFiles([file]);

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed because the config changed");
                assert.strictEqual(cachedResult.errorCount, 1, "since configuration changed the cache was not used an one error was reported");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");
            });

            it("should remember the files from a previous run and do not operate on them if not changed", () => {

                assert.isFalse(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                engine = new CLIEngine({
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

                const result = engine.executeOnFiles([file]);

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                engine = new CLIEngine({
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

                const cachedResult = engine.executeOnFiles([file]);

                assert.deepStrictEqual(result, cachedResult, "the result is the same regardless of using cache or not");

                // assert the file was not processed because the cache was used
                assert.isFalse(spy.calledWith(file), "the file was not loaded because it used the cache");
            });

            it("should remember the files from a previous run and do not operate on then if not changed", () => {

                const cacheFile = getFixturePath(".eslintcache");
                const cliEngineOptions = {
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"],
                    cwd: path.join(fixtureDir, "..")
                };

                assert.isFalse(shell.test("-f", cacheFile), "the cache for eslint does not exist");

                engine = new CLIEngine(cliEngineOptions);

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                engine.executeOnFiles([file]);

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint was created");

                cliEngineOptions.cache = false;
                engine = new CLIEngine(cliEngineOptions);

                engine.executeOnFiles([file]);

                assert.isFalse(shell.test("-f", cacheFile), "the cache for eslint was deleted since last run did not used the cache");
            });

            it("should store in the cache a file that failed the test", () => {

                const cacheFile = getFixturePath(".eslintcache");

                assert.isFalse(shell.test("-f", cacheFile), "the cache for eslint does not exist");

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));

                const result = engine.executeOnFiles([badFile, goodFile]);

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint was created");

                const fileCache = fCache.createFromFile(cacheFile);
                const { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(goodFile) === "object", "the entry for the good file is in the cache");

                assert.isTrue(typeof cache.getKey(badFile) === "object", "the entry for the bad file is in the cache");

                const cachedResult = engine.executeOnFiles([badFile, goodFile]);

                assert.deepStrictEqual(result, cachedResult, "result is the same with or without cache");
            });

            it("should not contain in the cache a file that was deleted", () => {

                const cacheFile = getFixturePath(".eslintcache");

                doDelete(cacheFile);

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const toBeDeletedFile = fs.realpathSync(getFixturePath("cache/src", "file-to-delete.js"));

                engine.executeOnFiles([badFile, goodFile, toBeDeletedFile]);

                const fileCache = fCache.createFromFile(cacheFile);
                let { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(toBeDeletedFile) === "object", "the entry for the file to be deleted is in the cache");

                // delete the file from the file system
                fs.unlinkSync(toBeDeletedFile);

                /*
                 * file-entry-cache@2.0.0 will remove from the cache deleted files
                 * even when they were not part of the array of files to be analyzed
                 */
                engine.executeOnFiles([badFile, goodFile]);

                cache = JSON.parse(fs.readFileSync(cacheFile));

                assert.isTrue(typeof cache[toBeDeletedFile] === "undefined", "the entry for the file to be deleted is not in the cache");
            });

            it("should contain files that were not visited in the cache provided they still exist", () => {

                const cacheFile = getFixturePath(".eslintcache");

                doDelete(cacheFile);

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const testFile2 = fs.realpathSync(getFixturePath("cache/src", "test-file2.js"));

                engine.executeOnFiles([badFile, goodFile, testFile2]);

                let fileCache = fCache.createFromFile(cacheFile);
                let { cache } = fileCache;

                assert.isTrue(typeof cache.getKey(testFile2) === "object", "the entry for the test-file2 is in the cache");

                /*
                 * we pass a different set of files minus test-file2
                 * previous version of file-entry-cache would remove the non visited
                 * entries. 2.0.0 version will keep them unless they don't exist
                 */
                engine.executeOnFiles([badFile, goodFile]);

                fileCache = fCache.createFromFile(cacheFile);
                cache = fileCache.cache;

                assert.isTrue(typeof cache.getKey(testFile2) === "object", "the entry for the test-file2 is in the cache");
            });

            it("should not delete cache when executing on text", () => {
                const cacheFile = getFixturePath(".eslintcache");

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint exists");

                engine.executeOnText("var foo = 'bar';");

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint still exists");
            });

            it("should not delete cache when executing on text with a provided filename", () => {
                const cacheFile = getFixturePath(".eslintcache");

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint exists");

                engine.executeOnText("var bar = foo;", "fixtures/passing.js");

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint still exists");
            });

            it("should not delete cache when executing on files with --cache flag", () => {
                const cacheFile = getFixturePath(".eslintcache");

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cache: true,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const file = getFixturePath("cli-engine", "console.js");

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint exists");

                engine.executeOnFiles([file]);

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint still exists");
            });

            it("should delete cache when executing on files without --cache flag", () => {
                const cacheFile = getFixturePath(".eslintcache");

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheFile,
                    rules: {
                        "no-console": 0,
                        "no-unused-vars": 2
                    },
                    extensions: ["js"]
                });

                const file = getFixturePath("cli-engine", "console.js");

                assert.isTrue(shell.test("-f", cacheFile), "the cache for eslint exists");

                engine.executeOnFiles([file]);

                assert.isFalse(shell.test("-f", cacheFile), "the cache for eslint has been deleted");
            });

            describe("cacheFile", () => {
                it("should use the specified cache file", () => {
                    const customCacheFile = path.resolve(".cache/custom-cache");

                    assert.isFalse(shell.test("-f", customCacheFile), "the cache for eslint does not exist");

                    engine = new CLIEngine({
                        useEslintrc: false,

                        // specify a custom cache file
                        cacheFile: customCacheFile,

                        // specifying cache true the cache will be created
                        cache: true,
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"],
                        cwd: path.join(fixtureDir, "..")
                    });

                    const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                    const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));

                    const result = engine.executeOnFiles([badFile, goodFile]);

                    assert.isTrue(shell.test("-f", customCacheFile), "the cache for eslint was created");

                    const fileCache = fCache.createFromFile(customCacheFile);
                    const { cache } = fileCache;

                    assert.isTrue(typeof cache.getKey(goodFile) === "object", "the entry for the good file is in the cache");

                    assert.isTrue(typeof cache.getKey(badFile) === "object", "the entry for the bad file is in the cache");

                    const cachedResult = engine.executeOnFiles([badFile, goodFile]);

                    assert.deepStrictEqual(result, cachedResult, "result is the same with or without cache");
                });
            });

            describe("cacheStrategy", () => {
                it("should detect changes using a file's modification time when set to 'metadata'", () => {
                    const cacheFile = getFixturePath(".eslintcache");
                    const badFile = getFixturePath("cache/src", "fail-file.js");
                    const goodFile = getFixturePath("cache/src", "test-file.js");

                    doDelete(cacheFile);

                    engine = new CLIEngine({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheFile,
                        cacheStrategy: "metadata",
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    engine.executeOnFiles([badFile, goodFile]);

                    let fileCache = fCache.createFromFile(cacheFile, false);
                    const entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert.isFalse(entry.changed, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheFile, false);
                    assert.isFalse(fileCache.getFileDescriptor(badFile).changed, `the entry for ${badFile} is unchanged`);
                    assert.isTrue(fileCache.getFileDescriptor(goodFile).changed, `the entry for ${goodFile} is changed`);
                });

                it("should not detect changes using a file's modification time when set to 'content'", () => {
                    const cacheFile = getFixturePath(".eslintcache");
                    const badFile = getFixturePath("cache/src", "fail-file.js");
                    const goodFile = getFixturePath("cache/src", "test-file.js");

                    doDelete(cacheFile);

                    engine = new CLIEngine({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheFile,
                        cacheStrategy: "content",
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    engine.executeOnFiles([badFile, goodFile]);

                    let fileCache = fCache.createFromFile(cacheFile, true);
                    let entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert.isFalse(entry.changed, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should NOT result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheFile, true);
                    entries = fileCache.normalizeEntries([badFile, goodFile]);
                    entries.forEach(entry => {
                        assert.isFalse(entry.changed, `the entry for ${entry.key} remains unchanged`);
                    });
                });

                it("should detect changes using a file's contents when set to 'content'", () => {
                    const cacheFile = getFixturePath(".eslintcache");
                    const badFile = getFixturePath("cache/src", "fail-file.js");
                    const goodFile = getFixturePath("cache/src", "test-file.js");
                    const goodFileCopy = path.resolve(`${path.dirname(goodFile)}`, "test-file-copy.js");

                    shell.cp(goodFile, goodFileCopy);

                    doDelete(cacheFile);

                    engine = new CLIEngine({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheFile,
                        cacheStrategy: "content",
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        },
                        extensions: ["js"]
                    });

                    engine.executeOnFiles([badFile, goodFileCopy]);

                    let fileCache = fCache.createFromFile(cacheFile, true);
                    const entries = fileCache.normalizeEntries([badFile, goodFileCopy]);

                    entries.forEach(entry => {
                        assert.isFalse(entry.changed, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.sed("-i", "abc", "xzy", goodFileCopy);
                    fileCache = fCache.createFromFile(cacheFile, true);
                    assert.isFalse(fileCache.getFileDescriptor(badFile).changed, `the entry for ${badFile} is unchanged`);
                    assert.isTrue(fileCache.getFileDescriptor(goodFileCopy).changed, `the entry for ${goodFileCopy} is changed`);
                });
            });
        });

        describe("processors", () => {
            it("should return two messages when executing with config file that specifies a processor", () => {
                engine = cliEngineWithPlugins({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
            });
            it("should return two messages when executing with config file that specifies preloaded processor", () => {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                }, {
                    preloadedPlugins: {
                        "test-processor": {
                            processors: {
                                ".txt": {
                                    preprocess(text) {
                                        return [text];
                                    },
                                    postprocess(messages) {
                                        return messages[0];
                                    }
                                }
                            }
                        }
                    }
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 2);
            });
            it("should run processors when calling executeOnFiles with config file that specifies a processor", () => {
                engine = cliEngineWithPlugins({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnFiles with config file that specifies preloaded processor", () => {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                }, {
                    preloadedPlugins: {
                        "test-processor": {
                            processors: {
                                ".txt": {
                                    preprocess(text) {
                                        return [text.replace("a()", "b()")];
                                    },
                                    postprocess(messages) {
                                        messages[0][0].ruleId = "post-processed";
                                        return messages[0];
                                    }
                                }
                            }
                        }
                    }
                });

                const report = engine.executeOnFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnText with config file that specifies a processor", () => {
                engine = cliEngineWithPlugins({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    ignore: false
                });

                const report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.strictEqual(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnText with config file that specifies preloaded processor", () => {
                engine = new CLIEngine({
                    useEslintrc: false,
                    plugins: ["test-processor"],
                    rules: {
                        "no-console": 2,
                        "no-unused-vars": 2
                    },
                    extensions: ["js", "txt"],
                    ignore: false
                }, {
                    preloadedPlugins: {
                        "test-processor": {
                            processors: {
                                ".txt": {
                                    preprocess(text) {
                                        return [text.replace("a()", "b()")];
                                    },
                                    postprocess(messages) {
                                        messages[0][0].ruleId = "post-processed";
                                        return messages[0];
                                    }
                                }
                            }
                        }
                    }
                });

                const report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.strictEqual(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(report.results[0].messages[0].ruleId, "post-processed");
            });

            describe("autofixing with processors", () => {
                const HTML_PROCESSOR = Object.freeze({
                    preprocess(text) {
                        return [text.replace(/^<script>/u, "").replace(/<\/script>$/u, "")];
                    },
                    postprocess(problemLists) {
                        return problemLists[0].map(problem => {
                            if (problem.fix) {
                                const updatedFix = Object.assign({}, problem.fix, {
                                    range: problem.fix.range.map(index => index + "<script>".length)
                                });

                                return Object.assign({}, problem, { fix: updatedFix });
                            }
                            return problem;
                        });
                    }
                });


                it("should run in autofix mode when using a processor that supports autofixing", () => {
                    engine = new CLIEngine({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true
                    }, {
                        preloadedPlugins: {
                            "test-processor": {
                                processors: {
                                    ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                                }
                            }
                        }
                    });

                    const report = engine.executeOnText("<script>foo</script>", "foo.html");

                    assert.strictEqual(report.results[0].messages.length, 0);
                    assert.strictEqual(report.results[0].output, "<script>foo;</script>");
                });

                it("should not run in autofix mode when using a processor that does not support autofixing", () => {
                    engine = new CLIEngine({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true
                    }, {
                        preloadedPlugins: {
                            "test-processor": {
                                processors: {
                                    ".html": HTML_PROCESSOR
                                }
                            }
                        }
                    });

                    const report = engine.executeOnText("<script>foo</script>", "foo.html");

                    assert.strictEqual(report.results[0].messages.length, 1);
                    assert.isFalse(Object.prototype.hasOwnProperty.call(report.results[0], "output"));
                });

                it("should not run in autofix mode when `fix: true` is not provided, even if the processor supports autofixing", () => {
                    engine = new CLIEngine({
                        useEslintrc: false,
                        plugins: ["test-processor"],
                        rules: {
                            semi: 2
                        },
                        extensions: ["js", "txt"],
                        ignore: false
                    }, {
                        preloadedPlugins: {
                            "test-processor": {
                                processors: {
                                    ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                                }
                            }
                        }
                    });

                    const report = engine.executeOnText("<script>foo</script>", "foo.html");

                    assert.strictEqual(report.results[0].messages.length, 1);
                    assert.isFalse(Object.prototype.hasOwnProperty.call(report.results[0], "output"));
                });
            });
        });

        describe("Patterns which match no file should throw errors.", () => {
            beforeEach(() => {
                engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine"),
                    useEslintrc: false
                });
            });

            it("one file", () => {
                assert.throws(() => {
                    engine.executeOnFiles(["non-exist.js"]);
                }, "No files matching 'non-exist.js' were found.");
            });

            it("should throw if the directory exists and is empty", () => {
                assert.throws(() => {
                    engine.executeOnFiles(["empty"]);
                }, "No files matching 'empty' were found.");
            });

            it("one glob pattern", () => {
                assert.throws(() => {
                    engine.executeOnFiles(["non-exist/**/*.js"]);
                }, "No files matching 'non-exist/**/*.js' were found.");
            });

            it("two files", () => {
                assert.throws(() => {
                    engine.executeOnFiles(["aaa.js", "bbb.js"]);
                }, "No files matching 'aaa.js' were found.");
            });

            it("a mix of an existing file and a non-existing file", () => {
                assert.throws(() => {
                    engine.executeOnFiles(["console.js", "non-exist.js"]);
                }, "No files matching 'non-exist.js' were found.");
            });
        });

        describe("overrides", () => {
            beforeEach(() => {
                engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine/overrides-with-dot"),
                    ignore: false
                });
            });

            it("should recognize dotfiles", () => {
                const ret = engine.executeOnFiles([".test-target.js"]);

                assert.strictEqual(ret.results.length, 1);
                assert.strictEqual(ret.results[0].messages.length, 1);
                assert.strictEqual(ret.results[0].messages[0].ruleId, "no-unused-vars");
                assert.strictEqual(ret.results[0].suppressedMessages.length, 0);
            });
        });

        describe("a config file setting should have higher priority than a shareable config file's settings always; https://github.com/eslint/eslint/issues/11510", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "cli-engine/11510"),
                files: {
                    "no-console-error-in-overrides.json": {
                        overrides: [{
                            files: ["*.js"],
                            rules: { "no-console": "error" }
                        }]
                    },
                    ".eslintrc.json": {
                        extends: "./no-console-error-in-overrides.json",
                        rules: { "no-console": "off" }
                    },
                    "a.js": "console.log();"
                }
            });

            beforeEach(() => {
                engine = new CLIEngine({
                    cwd: getPath()
                });

                return prepare();
            });

            afterEach(cleanup);

            it("should not report 'no-console' error.", () => {
                const { results } = engine.executeOnFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });
        });

        describe("configs of plugin rules should be validated even if 'plugins' key doesn't exist; https://github.com/eslint/eslint/issues/11559", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "cli-engine/11559"),
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
                    ".eslintrc.json": {

                        // Import via the recommended config.
                        extends: "plugin:test/recommended",

                        // Has invalid option.
                        rules: { "test/foo": ["error", "invalid-option"] }
                    },
                    "a.js": "console.log();"
                }
            });

            beforeEach(() => {
                engine = new CLIEngine({
                    cwd: getPath()
                });

                return prepare();
            });

            afterEach(cleanup);

            it("should throw fatal error.", () => {
                assert.throws(() => {
                    engine.executeOnFiles("a.js");
                }, /invalid-option/u);
            });
        });

        describe("'--fix-type' should not crash even if plugin rules exist; https://github.com/eslint/eslint/issues/11586", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "cli-engine/11586"),
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
                    ".eslintrc.json": {
                        plugins: ["test"],
                        rules: { "test/no-example": "error" }
                    },
                    "a.js": "example;"
                }
            });

            beforeEach(() => {
                engine = new CLIEngine({
                    cwd: getPath(),
                    fix: true,
                    fixTypes: ["problem"]
                });

                return prepare();
            });

            afterEach(cleanup);


            it("should not crash.", () => {
                const { results } = engine.executeOnFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
                assert.deepStrictEqual(results[0].output, "fixed;");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
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

            let cleanup;

            beforeEach(() => {
                cleanup = () => {};
            });

            afterEach(() => cleanup());

            it("should lint only JavaScript blocks if '--ext' was not given.", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        }
                    }
                });

                cleanup = teardown.cleanup;
                await teardown.prepare();
                engine = new CLIEngine({ cwd: teardown.getPath() });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should fix only JavaScript blocks if '--ext' was not given.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    fix: true
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
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
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    extensions: ["js", "html"]
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should fix HTML blocks as well with multiple processors if '--ext' option was given.", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" }
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    extensions: ["js", "html"],
                    fix: true
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
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

            it("should use overridden processor; should report HTML blocks but not fix HTML blocks if the processor for '*.html' didn't support autofix.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            rules: { semi: "error" },
                            overrides: [
                                {
                                    files: "*.html",
                                    processor: "html/non-fixable" // supportsAutofix: false
                                }
                            ]
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    extensions: ["js", "html"],
                    fix: true
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS Block in HTML Block
                assert.strictEqual(results[0].messages[0].line, 7);
                assert.strictEqual(results[0].messages[0].fix, void 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
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

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
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
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    extensions: ["js", "html"]
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "no-console");
                assert.strictEqual(results[0].messages[1].line, 7);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should use the same config as one which has 'processor' property in order to lint blocks in HTML if the processor was legacy style.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
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
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath(),
                    extensions: ["js", "html"]
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 3);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "no-console");
                assert.strictEqual(results[0].messages[1].line, 7);
                assert.strictEqual(results[0].messages[2].ruleId, "no-console");
                assert.strictEqual(results[0].messages[2].line, 10);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should throw an error if invalid processor was specified.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
                            plugins: ["markdown", "html"],
                            processor: "markdown/unknown"
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath()
                });

                assert.throws(() => {
                    engine.executeOnFiles(["test.md"]);
                }, /ESLint configuration of processor in '\.eslintrc\.json' is invalid: 'markdown\/unknown' was not found\./u);
            });

            it("should lint HTML blocks as well with multiple processors if 'overrides[].files' is present.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ...commonFiles,
                        ".eslintrc.json": {
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
                        }
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({
                    cwd: teardown.getPath()
                });

                const { results } = engine.executeOnFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });
        });

        describe("MODULE_NOT_FOUND error handling", () => {
            const cwd = getFixturePath("module-not-found");

            beforeEach(() => {
                engine = new CLIEngine({ cwd });
            });

            it("should throw an error with a message template when 'extends' property has a non-existence JavaScript config.", () => {
                try {
                    engine.executeOnText("test", "extends-js/test.js");
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

            it("should throw an error with a message template when 'extends' property has a non-existence plugin config.", () => {
                try {
                    engine.executeOnText("test", "extends-plugin/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, "plugin-missing");
                    assert.deepStrictEqual(err.messageData, {
                        importerName: `extends-plugin${path.sep}.eslintrc.yml`,
                        pluginName: "eslint-plugin-nonexistent-plugin",
                        resolvePluginsRelativeTo: path.join(cwd, "extends-plugin") // the directory of the config file.
                    });
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with a message template when 'plugins' property has a non-existence plugin.", () => {
                try {
                    engine.executeOnText("test", "plugins/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, "plugin-missing");
                    assert.deepStrictEqual(err.messageData, {
                        importerName: `plugins${path.sep}.eslintrc.yml`,
                        pluginName: "eslint-plugin-nonexistent-plugin",
                        resolvePluginsRelativeTo: path.join(cwd, "plugins") // the directory of the config file.
                    });
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when a JavaScript config threw a 'MODULE_NOT_FOUND' error.", () => {
                try {
                    engine.executeOnText("test", "throw-in-config-itself/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'extends' property has a JavaScript config that throws a 'MODULE_NOT_FOUND' error.", () => {
                try {
                    engine.executeOnText("test", "throw-in-extends-js/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'extends' property has a plugin config that throws a 'MODULE_NOT_FOUND' error.", () => {
                try {
                    engine.executeOnText("test", "throw-in-extends-plugin/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });

            it("should throw an error with no message template when 'plugins' property has a plugin config that throws a 'MODULE_NOT_FOUND' error.", () => {
                try {
                    engine.executeOnText("test", "throw-in-plugins/test.js");
                } catch (err) {
                    assert.strictEqual(err.code, "MODULE_NOT_FOUND");
                    assert.strictEqual(err.messageTemplate, void 0);
                    return;
                }
                assert.fail("Expected to throw an error");
            });
        });

        describe("with '--rulesdir' option", () => {

            const rootPath = getFixturePath("cli-engine/with-rulesdir");

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: rootPath,
                files: {
                    "internal-rules/test.js": `
                            module.exports = context => ({
                                ExpressionStatement(node) {
                                    context.report({ node, message: "ok" })
                                }
                            })
                        `,
                    ".eslintrc.json": {
                        root: true,
                        rules: { test: "error" }
                    },
                    "test.js": "console.log('hello')"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);


            it("should use the configured rules which are defined by '--rulesdir' option.", () => {

                engine = new CLIEngine({
                    cwd: getPath(),
                    rulePaths: ["internal-rules"]
                });
                const report = engine.executeOnFiles(["test.js"]);

                assert.strictEqual(report.results.length, 1);
                assert.strictEqual(report.results[0].messages.length, 1);
                assert.strictEqual(report.results[0].messages[0].message, "ok");
                assert.strictEqual(report.results[0].suppressedMessages.length, 0);
            });
        });

        describe("glob pattern '[ab].js'", () => {
            const root = getFixturePath("cli-engine/unmatched-glob");

            let cleanup;

            beforeEach(() => {
                cleanup = () => { };
            });

            afterEach(() => cleanup());

            it("should match '[ab].js' if existed.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "a.js": "",
                        "b.js": "",
                        "ab.js": "",
                        "[ab].js": "",
                        ".eslintrc.yml": "root: true"
                    }
                });

                engine = new CLIEngine({ cwd: teardown.getPath() });

                await teardown.prepare();
                cleanup = teardown.cleanup;

                const { results } = engine.executeOnFiles(["[ab].js"]);
                const filenames = results.map(r => path.basename(r.filePath));

                assert.deepStrictEqual(filenames, ["[ab].js"]);
            });

            it("should match 'a.js' and 'b.js' if '[ab].js' didn't existed.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "a.js": "",
                        "b.js": "",
                        "ab.js": "",
                        ".eslintrc.yml": "root: true"
                    }
                });

                engine = new CLIEngine({ cwd: teardown.getPath() });

                await teardown.prepare();
                cleanup = teardown.cleanup;

                const { results } = engine.executeOnFiles(["[ab].js"]);
                const filenames = results.map(r => path.basename(r.filePath));

                assert.deepStrictEqual(filenames, ["a.js", "b.js"]);
            });
        });

        describe("with 'noInlineConfig' setting", () => {
            const root = getFixturePath("cli-engine/noInlineConfig");

            let cleanup;

            beforeEach(() => {
                cleanup = () => { };
            });

            afterEach(() => cleanup());

            it("should warn directive comments if 'noInlineConfig' was given.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "test.js": "/* globals foo */",
                        ".eslintrc.yml": "noInlineConfig: true"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });

                const { results } = engine.executeOnFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml).");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should show the config file what the 'noInlineConfig' came from.", async () => {

                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "node_modules/eslint-config-foo/index.js": "module.exports = {noInlineConfig: true}",
                        "test.js": "/* globals foo */",
                        ".eslintrc.yml": "extends: foo"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });

                const { results } = engine.executeOnFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml » eslint-config-foo).");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });
        });

        describe("with 'reportUnusedDisableDirectives' setting", () => {
            const root = getFixturePath("cli-engine/reportUnusedDisableDirectives");

            let cleanup;

            beforeEach(() => {
                cleanup = () => { };
            });

            afterEach(() => cleanup());

            it("should warn unused 'eslint-disable' comments if 'reportUnusedDisableDirectives' was given.", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "test.js": "/* eslint-disable eqeqeq */",
                        ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });

                const { results } = engine.executeOnFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 1);
                assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            describe("the runtime option overrides config files.", () => {
                it("should not warn unused 'eslint-disable' comments if 'reportUnusedDisableDirectives=off' was given in runtime.", async () => {
                    const teardown = createCustomTeardown({
                        cwd: root,
                        files: {
                            "test.js": "/* eslint-disable eqeqeq */",
                            ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                        }
                    });

                    await teardown.prepare();
                    cleanup = teardown.cleanup;

                    engine = new CLIEngine({
                        cwd: teardown.getPath(),
                        reportUnusedDisableDirectives: "off"
                    });

                    const { results } = engine.executeOnFiles(["test.js"]);
                    const messages = results[0].messages;

                    assert.strictEqual(messages.length, 0);
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                });

                it("should warn unused 'eslint-disable' comments as error if 'reportUnusedDisableDirectives=error' was given in runtime.", async () => {
                    const teardown = createCustomTeardown({
                        cwd: root,
                        files: {
                            "test.js": "/* eslint-disable eqeqeq */",
                            ".eslintrc.yml": "reportUnusedDisableDirectives: true"
                        }
                    });

                    await teardown.prepare();
                    cleanup = teardown.cleanup;

                    engine = new CLIEngine({
                        cwd: teardown.getPath(),
                        reportUnusedDisableDirectives: "error"
                    });

                    const { results } = engine.executeOnFiles(["test.js"]);
                    const messages = results[0].messages;

                    assert.strictEqual(messages.length, 1);
                    assert.strictEqual(messages[0].severity, 2);
                    assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                });
            });
        });

        describe("with 'overrides[*].extends' setting on deep locations", () => {
            const root = getFixturePath("cli-engine/deeply-overrides-i-extends");

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
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
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("should not throw.", () => {
                engine = new CLIEngine({ cwd: getPath() });

                const { results } = engine.executeOnFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });
        });

        describe("don't ignore the entry directory.", () => {
            const root = getFixturePath("cli-engine/dont-ignore-entry-dir");

            let cleanup;

            beforeEach(() => {
                cleanup = () => {};
            });

            afterEach(async () => {
                await cleanup();

                const configFilePath = path.resolve(root, "../.eslintrc.json");

                if (shell.test("-e", configFilePath)) {
                    shell.rm(configFilePath);
                }
            });

            it("'executeOnFiles(\".\")' should not load config files from outside of \".\".", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "../.eslintrc.json": "BROKEN FILE",
                        ".eslintrc.json": JSON.stringify({ root: true }),
                        "index.js": "console.log(\"hello\")"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });

                // Don't throw "failed to load config file" error.
                engine.executeOnFiles(".");
            });

            it("'executeOnFiles(\".\")' should not ignore '.' even if 'ignorePatterns' contains it.", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        "../.eslintrc.json": { ignorePatterns: ["/dont-ignore-entry-dir"] },
                        ".eslintrc.json": { root: true },
                        "index.js": "console.log(\"hello\")"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });


                // Don't throw "file not found" error.
                engine.executeOnFiles(".");
            });

            it("'executeOnFiles(\"subdir\")' should not ignore './subdir' even if 'ignorePatterns' contains it.", async () => {
                const teardown = createCustomTeardown({
                    cwd: root,
                    files: {
                        ".eslintrc.json": { ignorePatterns: ["/subdir"] },
                        "subdir/.eslintrc.json": { root: true },
                        "subdir/index.js": "console.log(\"hello\")"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                engine = new CLIEngine({ cwd: teardown.getPath() });

                // Don't throw "file not found" error.
                engine.executeOnFiles("subdir");
            });
        });
    });

    describe("getConfigForFile", () => {

        it("should return the info from Config#getConfig when called", () => {
            const options = {
                configFile: getFixturePath("configurations", "quotes-error.json")
            };
            const engine = new CLIEngine(options);
            const filePath = getFixturePath("single-quoted.js");

            const actualConfig = engine.getConfigForFile(filePath);
            const expectedConfig = new CascadingConfigArrayFactory({ specificConfigPath: options.configFile })
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });


        it("should return the config when run from within a subdir", () => {
            const options = {
                cwd: getFixturePath("config-hierarchy", "root-true", "parent", "root", "subdir")
            };
            const engine = new CLIEngine(options);
            const filePath = getFixturePath("config-hierarchy", "root-true", "parent", "root", ".eslintrc");

            const actualConfig = engine.getConfigForFile("./.eslintrc");
            const expectedConfig = new CascadingConfigArrayFactory(options)
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should throw an error if a directory path was given.", () => {
            const engine = new CLIEngine();

            try {
                engine.getConfigForFile(".");
            } catch (error) {
                assert.strictEqual(error.messageTemplate, "print-config-with-directory-path");
                return;
            }
            assert.fail("should throw an error");
        });
    });

    describe("isPathIgnored", () => {
        it("should check if the given path is ignored", () => {
            const engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore2"),
                cwd: getFixturePath()
            });

            assert.isTrue(engine.isPathIgnored("undef.js"));
            assert.isFalse(engine.isPathIgnored("passing.js"));
        });

        it("should return false if ignoring is disabled", () => {
            const engine = new CLIEngine({
                ignore: false,
                ignorePath: getFixturePath(".eslintignore2"),
                cwd: getFixturePath()
            });

            assert.isFalse(engine.isPathIgnored("undef.js"));
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should return true for default ignores even if ignoring is disabled", () => {
            const engine = new CLIEngine({
                ignore: false,
                cwd: getFixturePath("cli-engine")
            });

            assert.isTrue(engine.isPathIgnored("node_modules/foo.js"));
        });

        describe("about the default ignore patterns", () => {
            it("should always apply defaultPatterns if ignore option is true", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should still apply defaultPatterns if ignore option is is false", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignore: false, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd, ignorePattern: "!/node_modules/package" });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js")));
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePath", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd, ignorePath: getFixturePath("ignored-paths", ".eslintignoreWithUnignoredDefaults") });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js")));
            });

            it("should ignore dotfiles", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", ".foo")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar")));
            });

            it("should ignore directories beginning with a dot", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", ".foo/bar")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar/baz")));
            });

            it("should still ignore dotfiles when ignore option disabled", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignore: false, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", ".foo")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar")));
            });

            it("should still ignore directories beginning with a dot when ignore option disabled", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignore: false, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", ".foo/bar")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar/baz")));
            });

            it("should not ignore absolute paths containing '..'", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                assert(!engine.isPathIgnored(`${getFixturePath("ignored-paths", "foo")}/../unignored.js`));
            });

            it("should ignore /node_modules/ relative to .eslintignore when loaded", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePath: getFixturePath("ignored-paths", ".eslintignore"), cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "existing.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo", "node_modules", "existing.js")));
            });

            it("should ignore /node_modules/ relative to cwd without an .eslintignore", () => {
                const cwd = getFixturePath("ignored-paths", "no-ignore-file");
                const engine = new CLIEngine({ cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "node_modules", "existing.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "foo", "node_modules", "existing.js")));
            });
        });

        describe("with no .eslintignore file", () => {
            it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", () => {
                const cwd = getFixturePath("ignored-paths", "configurations");
                const engine = new CLIEngine({ cwd });

                // an .eslintignore in parent directories includes `*.js`, but don't load it.
                assert(!engine.isPathIgnored("foo.js"));
                assert(engine.isPathIgnored("node_modules/foo.js"));
            });

            it("should return false for files outside of the cwd (with no ignore file provided)", () => {

                // Default ignore patterns should not inadvertently ignore files in parent directories
                const engine = new CLIEngine({ cwd: getFixturePath("ignored-paths", "no-ignore-file") });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });
        });

        describe("with .eslintignore file or package.json file", () => {
            it("should load .eslintignore from cwd when explicitly passed", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                // `${cwd}/.eslintignore` includes `sampleignorepattern`.
                assert(engine.isPathIgnored("sampleignorepattern"));
            });

            it("should use package.json's eslintIgnore files if no specified .eslintignore file", () => {
                const cwd = getFixturePath("ignored-paths", "package-json-ignore");
                const engine = new CLIEngine({ cwd });

                assert(engine.isPathIgnored("hello.js"));
                assert(engine.isPathIgnored("world.js"));
            });

            it("should use correct message template if failed to parse package.json", () => {
                const cwd = getFixturePath("ignored-paths", "broken-package-json");

                assert.throw(() => {
                    try {
                        // eslint-disable-next-line no-new -- Check for throwing
                        new CLIEngine({ cwd });
                    } catch (error) {
                        assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                        throw error;
                    }
                });
            });

            it("should not use package.json's eslintIgnore files if specified .eslintignore file", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ cwd });

                /*
                 * package.json includes `hello.js` and `world.js`.
                 * .eslintignore includes `sampleignorepattern`.
                 */
                assert(!engine.isPathIgnored("hello.js"));
                assert(!engine.isPathIgnored("world.js"));
                assert(engine.isPathIgnored("sampleignorepattern"));
            });

            it("should error if package.json's eslintIgnore is not an array of file paths", () => {
                const cwd = getFixturePath("ignored-paths", "bad-package-json-ignore");

                assert.throws(() => {
                    // eslint-disable-next-line no-new -- Check for throwing
                    new CLIEngine({ cwd });
                }, "Package.json eslintIgnore property requires an array of paths");
            });
        });

        describe("with --ignore-pattern option", () => {
            it("should accept a string for options.ignorePattern", () => {
                const cwd = getFixturePath("ignored-paths", "ignore-pattern");
                const engine = new CLIEngine({
                    ignorePattern: "ignore-me.txt",
                    cwd
                });

                assert(engine.isPathIgnored("ignore-me.txt"));
            });

            it("should accept an array for options.ignorePattern", () => {
                const engine = new CLIEngine({
                    ignorePattern: ["a", "b"],
                    useEslintrc: false
                });

                assert(engine.isPathIgnored("a"));
                assert(engine.isPathIgnored("b"));
                assert(!engine.isPathIgnored("c"));
            });

            it("should return true for files which match an ignorePattern even if they do not exist on the filesystem", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({
                    ignorePattern: "not-a-file",
                    cwd
                });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "not-a-file")));
            });

            it("should return true for file matching an ignore pattern exactly", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "undef.js", cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file matching an invalid ignore pattern with leading './'", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "./undef.js", cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file in subfolder of cwd matching an ignore pattern with leading '/'", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "/undef.js", cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "subdir", "undef.js")));
            });

            it("should return true for file matching a child of an ignore pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "ignore-pattern", cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "ignore-me.txt")));
            });

            it("should return true for file matching a grandchild of an ignore pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "ignore-pattern", cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "subdir", "ignore-me.txt")));
            });

            it("should return false for file not matching any ignore pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "failing.js", cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "unignored.js")));
            });

            it("two globstar '**' ignore pattern should ignore files in nested directories", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({ ignorePattern: "**/*.js", cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.js")));
                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "foo.j2")));
                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.j2")));
                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.j2")));
            });
        });

        describe("with --ignore-path option", () => {
            it("should load empty array with ignorePath set to false", () => {
                const cwd = getFixturePath("ignored-paths", "no-ignore-file");
                const engine = new CLIEngine({ ignorePath: false, cwd });

                // an .eslintignore in parent directories includes `*.js`, but don't load it.
                assert(!engine.isPathIgnored("foo.js"));
                assert(engine.isPathIgnored("node_modules/foo.js"));
            });

            it("initialization with ignorePath should work when cwd is a parent directory", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("custom-name/foo.js"));
            });

            it("initialization with ignorePath should work when the file is in the cwd", () => {
                const cwd = getFixturePath("ignored-paths", "custom-name");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("foo.js"));
            });

            it("initialization with ignorePath should work when cwd is a subdirectory", () => {
                const cwd = getFixturePath("ignored-paths", "custom-name", "subdirectory");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("../custom-name/foo.js"));
            });

            it("initialization with invalid file should throw error", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "not-a-directory", ".foobaz");

                assert.throws(() => {
                    // eslint-disable-next-line no-new -- Check for throwing
                    new CLIEngine({ ignorePath, cwd });
                }, "Cannot read .eslintignore file");
            });

            it("should return false for files outside of ignorePath's directory", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should resolve relative paths from CWD", () => {
                const cwd = getFixturePath("ignored-paths", "subdir");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")));
                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should resolve relative paths from CWD when it's in a child directory", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/foo.js")));

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/bar.js")));
            });

            it("should resolve relative paths from CWD when it contains negated globs", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("subdir/blah.txt"));
                assert(engine.isPathIgnored("blah.txt"));
                assert(engine.isPathIgnored("subdir/bar.txt"));
                assert(!engine.isPathIgnored("bar.txt"));
                assert(!engine.isPathIgnored("subdir/baz.txt"));
                assert(!engine.isPathIgnored("baz.txt"));
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a subdirectory", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a parent directory", () => {
                const cwd = getFixturePath("ignored-paths", "subdir");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should handle .eslintignore which contains CRLF correctly.", () => {
                const ignoreFileContent = fs.readFileSync(getFixturePath("ignored-paths", "crlf/.eslintignore"), "utf8");

                assert(ignoreFileContent.includes("\r"), "crlf/.eslintignore should contains CR.");

                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "crlf/.eslintignore");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide1/a.js")));
                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide2/a.js")));
                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide3/a.js")));
            });

            it("should not include comments in ignore rules", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithComments");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(!engine.isPathIgnored("# should be ignored"));
                assert(engine.isPathIgnored("this_one_not"));
            });

            it("should ignore a non-negated pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "ignore.js")));
            });

            it("should not ignore a negated pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new CLIEngine({ ignorePath, cwd });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "unignore.js")));
            });
        });

        describe("with --ignore-path option and --ignore-pattern option", () => {
            it("should return false for ignored file when unignored with ignore pattern", () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new CLIEngine({
                    ignorePath: getFixturePath("ignored-paths", ".eslintignore"),
                    ignorePattern: "!sampleignorepattern",
                    cwd
                });

                assert(!engine.isPathIgnored(getFixturePath("ignored-paths", "sampleignorepattern")));
            });
        });
    });

    describe("getFormatter()", () => {

        it("should return a function when a bundled formatter is requested", () => {
            const engine = new CLIEngine(),
                formatter = engine.getFormatter("compact");

            assert.isFunction(formatter);
        });

        it("should return a function when no argument is passed", () => {
            const engine = new CLIEngine(),
                formatter = engine.getFormatter();

            assert.isFunction(formatter);
        });

        it("should return a function when a custom formatter is requested", () => {
            const engine = new CLIEngine(),
                formatter = engine.getFormatter(getFixturePath("formatters", "simple.js"));

            assert.isFunction(formatter);
        });

        it("should return a function when a custom formatter is requested, also if the path has backslashes", () => {
            const engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                }),
                formatter = engine.getFormatter(".\\fixtures\\formatters\\simple.js");

            assert.isFunction(formatter);
        });

        it("should return a function when a formatter prefixed with eslint-formatter is requested", () => {
            const engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine")
                }),
                formatter = engine.getFormatter("bar");

            assert.isFunction(formatter);
        });

        it("should return a function when a formatter is requested, also when the eslint-formatter prefix is included in the format argument", () => {
            const engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine")
                }),
                formatter = engine.getFormatter("eslint-formatter-bar");

            assert.isFunction(formatter);
        });

        it("should return a function when a formatter is requested within a scoped npm package", () => {
            const engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine")
                }),
                formatter = engine.getFormatter("@somenamespace/foo");

            assert.isFunction(formatter);
        });

        it("should return a function when a formatter is requested within a scoped npm package, also when the eslint-formatter prefix is included in the format argument", () => {
            const engine = new CLIEngine({
                    cwd: getFixturePath("cli-engine")
                }),
                formatter = engine.getFormatter("@somenamespace/eslint-formatter-foo");

            assert.isFunction(formatter);
        });

        it("should return null when a custom formatter doesn't exist", () => {
            const engine = new CLIEngine(),
                formatterPath = getFixturePath("formatters", "doesntexist.js"),
                fullFormatterPath = path.resolve(formatterPath);

            assert.throws(() => {
                engine.getFormatter(formatterPath);
            }, `There was a problem loading formatter: ${fullFormatterPath}\nError: Cannot find module '${fullFormatterPath}'`);
        });

        it("should return null when a built-in formatter doesn't exist", () => {
            const engine = new CLIEngine();
            const fullFormatterPath = path.resolve(__dirname, "../../../lib/cli-engine/formatters/special");

            assert.throws(() => {
                engine.getFormatter("special");
            }, `There was a problem loading formatter: ${fullFormatterPath}\nError: Cannot find module '${fullFormatterPath}'`);
        });

        it("should throw when a built-in formatter no longer exists", () => {
            const engine = new CLIEngine();

            assert.throws(() => {
                engine.getFormatter("table");
            }, "The table formatter is no longer part of core ESLint. Install it manually with `npm install -D eslint-formatter-table`");

            assert.throws(() => {
                engine.getFormatter("codeframe");
            }, "The codeframe formatter is no longer part of core ESLint. Install it manually with `npm install -D eslint-formatter-codeframe`");
        });

        it("should throw if the required formatter exists but has an error", () => {
            const engine = new CLIEngine(),
                formatterPath = getFixturePath("formatters", "broken.js");

            assert.throws(() => {
                engine.getFormatter(formatterPath);
            }, `There was a problem loading formatter: ${formatterPath}\nError: Cannot find module 'this-module-does-not-exist'`);
        });

        it("should return null when a non-string formatter name is passed", () => {
            const engine = new CLIEngine(),
                formatter = engine.getFormatter(5);

            assert.isNull(formatter);
        });

        it("should return a function when called as a static function on CLIEngine", () => {
            const formatter = CLIEngine.getFormatter();

            assert.isFunction(formatter);
        });

        it("should return a function when called as a static function on CLIEngine and a custom formatter is requested", () => {
            const formatter = CLIEngine.getFormatter(getFixturePath("formatters", "simple.js"));

            assert.isFunction(formatter);
        });

    });

    describe("getErrorResults()", () => {
        it("should report 5 error messages when looking for errors only", () => {

            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                baseConfig: {
                    rules: {
                        quotes: 2,
                        "no-var": 2,
                        "eol-last": 2,
                        strict: [2, "global"],
                        "no-unused-vars": 2
                    },
                    env: {
                        node: true
                    }
                }
            });

            const report = engine.executeOnText("var foo = 'bar';");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorResults[0].messages, 5);
            assert.strictEqual(errorResults[0].errorCount, 5);
            assert.strictEqual(errorResults[0].fixableErrorCount, 3);
            assert.strictEqual(errorResults[0].fixableWarningCount, 0);
            assert.strictEqual(errorResults[0].messages[0].ruleId, "strict");
            assert.strictEqual(errorResults[0].messages[0].severity, 2);
            assert.strictEqual(errorResults[0].messages[1].ruleId, "no-var");
            assert.strictEqual(errorResults[0].messages[1].severity, 2);
            assert.strictEqual(errorResults[0].messages[2].ruleId, "no-unused-vars");
            assert.strictEqual(errorResults[0].messages[2].severity, 2);
            assert.strictEqual(errorResults[0].messages[3].ruleId, "quotes");
            assert.strictEqual(errorResults[0].messages[3].severity, 2);
            assert.strictEqual(errorResults[0].messages[4].ruleId, "eol-last");
            assert.strictEqual(errorResults[0].messages[4].severity, 2);
            assert.lengthOf(errorResults[0].suppressedMessages, 0);
        });

        it("should report no error messages when looking for errors only", () => {
            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                baseConfig: {
                    rules: {
                        quotes: 2,
                        "no-var": 2,
                        "eol-last": 2,
                        strict: [2, "global"],
                        "no-unused-vars": 2
                    },
                    env: {
                        node: true
                    }
                }
            });

            const report = engine.executeOnText("var foo = 'bar'; // eslint-disable-line strict, no-var, no-unused-vars, quotes, eol-last -- justification");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorResults, 0);
        });

        it("should not mutate passed report.results parameter", () => {
            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                rules: {
                    quotes: [1, "double"],
                    "no-var": 2
                }
            });

            const report = engine.executeOnText("var foo = 'bar';");
            const reportResultsLength = report.results[0].messages.length;

            assert.strictEqual(report.results[0].messages.length, 2);

            CLIEngine.getErrorResults(report.results);

            assert.lengthOf(report.results[0].messages, reportResultsLength);
        });

        it("should report no suppressed error messages when looking for errors only", () => {
            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                rules: {
                    quotes: 1,
                    "no-var": 2,
                    "eol-last": 2,
                    strict: [2, "global"],
                    "no-unused-vars": 2
                },
                env: {
                    node: true
                }
            });

            const report = engine.executeOnText("var foo = 'bar'; // eslint-disable-line quotes -- justification\n");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(report.results[0].messages, 3);
            assert.lengthOf(report.results[0].suppressedMessages, 1);
            assert.lengthOf(errorResults[0].messages, 3);
            assert.lengthOf(errorResults[0].suppressedMessages, 0);
        });

        it("should report a warningCount of 0 when looking for errors only", () => {

            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                baseConfig: {
                    rules: {
                        quotes: 2,
                        "no-var": 2,
                        "eol-last": 2,
                        strict: [2, "global"],
                        "no-unused-vars": 2
                    },
                    env: {
                        node: true
                    }
                }
            });

            const report = engine.executeOnText("var foo = 'bar';");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.strictEqual(errorResults[0].warningCount, 0);
            assert.strictEqual(errorResults[0].fixableWarningCount, 0);
        });

        it("should return 0 error or warning messages even when the file has warnings", () => {
            const engine = new CLIEngine({
                ignorePath: path.join(fixtureDir, ".eslintignore"),
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js", true);
            const errorReport = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorReport, 0);
            assert.lengthOf(report.results, 1);
            assert.strictEqual(report.errorCount, 0);
            assert.strictEqual(report.warningCount, 1);
            assert.strictEqual(report.fatalErrorCount, 0);
            assert.strictEqual(report.fixableErrorCount, 0);
            assert.strictEqual(report.fixableWarningCount, 0);
            assert.strictEqual(report.results[0].errorCount, 0);
            assert.strictEqual(report.results[0].warningCount, 1);
            assert.strictEqual(report.results[0].fatalErrorCount, 0);
            assert.strictEqual(report.results[0].fixableErrorCount, 0);
            assert.strictEqual(report.results[0].fixableWarningCount, 0);
        });

        it("should return source code of file in the `source` property", () => {
            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                rules: { quotes: [2, "double"] }
            });


            const report = engine.executeOnText("var foo = 'bar';");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorResults[0].messages, 1);
            assert.strictEqual(errorResults[0].source, "var foo = 'bar';");
        });

        it("should contain `output` property after fixes", () => {
            process.chdir(originalDir);
            const engine = new CLIEngine({
                useEslintrc: false,
                fix: true,
                rules: {
                    semi: 2,
                    "no-console": 2
                }
            });

            const report = engine.executeOnText("console.log('foo')");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorResults[0].messages, 1);
            assert.strictEqual(errorResults[0].output, "console.log('foo');");
        });
    });

    describe("outputFixes()", () => {
        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should call fs.writeFileSync() for each result with output", () => {
            const fakeFS = {
                    writeFileSync() {}
                },
                localCLIEngine = proxyquire("../../../lib/cli-engine/cli-engine", {
                    fs: fakeFS
                }).CLIEngine,
                report = {
                    results: [
                        {
                            filePath: "foo.js",
                            output: "bar"
                        },
                        {
                            filePath: "bar.js",
                            output: "baz"
                        }
                    ]
                };

            const spy = sinon.spy(fakeFS, "writeFileSync");

            localCLIEngine.outputFixes(report);

            assert.strictEqual(spy.callCount, 2);
            assert.isTrue(spy.firstCall.calledWithExactly("foo.js", "bar"), "First call was incorrect.");
            assert.isTrue(spy.secondCall.calledWithExactly("bar.js", "baz"), "Second call was incorrect.");

        });

        it("should call fs.writeFileSync() for each result with output and not at all for a result without output", () => {
            const fakeFS = {
                    writeFileSync() {}
                },
                localCLIEngine = proxyquire("../../../lib/cli-engine/cli-engine", {
                    fs: fakeFS
                }).CLIEngine,
                report = {
                    results: [
                        {
                            filePath: "foo.js",
                            output: "bar"
                        },
                        {
                            filePath: "abc.js"
                        },
                        {
                            filePath: "bar.js",
                            output: "baz"
                        }
                    ]
                };

            const spy = sinon.spy(fakeFS, "writeFileSync");

            localCLIEngine.outputFixes(report);

            assert.strictEqual(spy.callCount, 2);
            assert.isTrue(spy.firstCall.calledWithExactly("foo.js", "bar"), "First call was incorrect.");
            assert.isTrue(spy.secondCall.calledWithExactly("bar.js", "baz"), "Second call was incorrect.");

        });

    });

    describe("getRules()", () => {
        it("should expose the list of rules", () => {
            const engine = new CLIEngine();

            assert(engine.getRules().has("no-eval"), "no-eval is present");
        });

        it("should expose the list of plugin rules", () => {
            const engine = new CLIEngine({ plugins: ["internal-rules"] });

            assert(engine.getRules().has("internal-rules/no-invalid-meta"), "internal-rules/no-invalid-meta is present");
        });

        it("should expose the list of rules from a preloaded plugin", () => {
            const engine = new CLIEngine({
                plugins: ["foo"]
            }, {
                preloadedPlugins: {
                    foo: require("eslint-plugin-internal-rules")
                }
            });

            assert(engine.getRules().has("foo/no-invalid-meta"), "foo/no-invalid-meta is present");
        });
    });

    describe("resolveFileGlobPatterns", () => {

        [
            [".", ["**/*.{js}"]],
            ["./", ["**/*.{js}"]],
            ["../", ["../**/*.{js}"]],
            ["", []]
        ].forEach(([input, expected]) => {

            it(`should correctly resolve ${input} to ${expected}`, () => {
                const engine = new CLIEngine();

                const result = engine.resolveFileGlobPatterns([input]);

                assert.deepStrictEqual(result, expected);

            });
        });

        it("should convert a directory name with no provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{js}"]);
        });

        it("should not convert path with globInputPaths option false", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                globInputPaths: false
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file"]);
        });

        it("should convert an absolute directory name with no provided extensions into a posix glob pattern", () => {
            const patterns = [getFixturePath("glob-util", "one-js-file")];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);
            const expected = [`${getFixturePath("glob-util", "one-js-file").replace(/\\/gu, "/")}/**/*.{js}`];

            assert.deepStrictEqual(result, expected);
        });

        it("should convert a directory name with a single provided extension into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx"]
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{jsx}"]);
        });

        it("should convert a directory name with multiple provided extensions into a glob pattern", () => {
            const patterns = ["one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util"),
                extensions: [".jsx", ".js"]
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{jsx,js}"]);
        });

        it("should convert multiple directory names into glob patterns", () => {
            const patterns = ["one-js-file", "two-js-files"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{js}", "two-js-files/**/*.{js}"]);
        });

        it("should remove leading './' from glob patterns", () => {
            const patterns = ["./one-js-file"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{js}"]);
        });

        it("should convert a directory name with a trailing '/' into a glob pattern", () => {
            const patterns = ["one-js-file/"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/**/*.{js}"]);
        });

        it("should return filenames as they are", () => {
            const patterns = ["some-file.js"];
            const opts = {
                cwd: getFixturePath("glob-util")
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["some-file.js"]);
        });

        it("should convert backslashes into forward slashes", () => {
            const patterns = ["one-js-file\\example.js"];
            const opts = {
                cwd: getFixturePath()
            };
            const result = new CLIEngine(opts).resolveFileGlobPatterns(patterns);

            assert.deepStrictEqual(result, ["one-js-file/example.js"]);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is disabled", () => {

        it("should report a violation for disabling rules", () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                envs: ["browser"],
                ignore: true,
                useEslintrc: false,
                allowInlineConfig: false,
                rules: {
                    "eol-last": 0,
                    "no-alert": 1,
                    "no-trailing-spaces": 0,
                    strict: 0,
                    quotes: 0
                }
            };

            const eslintCLI = new CLIEngine(config);

            const report = eslintCLI.executeOnText(code);
            const { messages, suppressedMessages } = report.results[0];

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(suppressedMessages.length, 0);
        });

        it("should not report a violation by default", () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                envs: ["browser"],
                ignore: true,
                useEslintrc: false,

                // allowInlineConfig: true is the default
                rules: {
                    "eol-last": 0,
                    "no-alert": 1,
                    "no-trailing-spaces": 0,
                    strict: 0,
                    quotes: 0
                }
            };

            const eslintCLI = new CLIEngine(config);

            const report = eslintCLI.executeOnText(code);
            const { messages, suppressedMessages } = report.results[0];

            assert.strictEqual(messages.length, 0);
            assert.strictEqual(suppressedMessages.length, 1);
            assert.strictEqual(suppressedMessages[0].ruleId, "no-alert");
        });

    });

    describe("when evaluating code when reportUnusedDisableDirectives is enabled", () => {
        it("should report problems for unused eslint-disable directives", () => {
            const cliEngine = new CLIEngine({ useEslintrc: false, reportUnusedDisableDirectives: true });

            assert.deepStrictEqual(
                cliEngine.executeOnText("/* eslint-disable */"),
                {
                    results: [
                        {
                            filePath: "<text>",
                            messages: [
                                {
                                    ruleId: null,
                                    message: "Unused eslint-disable directive (no problems were reported).",
                                    line: 1,
                                    column: 1,
                                    fix: {
                                        range: [0, 20],
                                        text: " "
                                    },
                                    severity: 2,
                                    nodeType: null
                                }
                            ],
                            suppressedMessages: [],
                            errorCount: 1,
                            warningCount: 0,
                            fatalErrorCount: 0,
                            fixableErrorCount: 1,
                            fixableWarningCount: 0,
                            source: "/* eslint-disable */"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0,
                    fatalErrorCount: 0,
                    fixableErrorCount: 1,
                    fixableWarningCount: 0,
                    usedDeprecatedRules: []
                }
            );
        });
    });

    describe("when retrieving version number", () => {
        it("should return current version number", () => {
            const eslintCLI = require("../../../lib/cli-engine").CLIEngine;
            const version = eslintCLI.version;

            assert.isString(version);
            assert.isTrue(parseInt(version[0], 10) >= 3);
        });
    });

    describe("mutability", () => {
        describe("plugins", () => {
            it("Loading plugin in one instance doesn't mutate to another instance", () => {
                const filePath = getFixturePath("single-quoted.js");
                const engine1 = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["example"],
                    rules: { "example/example-rule": 1 }
                });
                const engine2 = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });
                const fileConfig1 = engine1.getConfigForFile(filePath);
                const fileConfig2 = engine2.getConfigForFile(filePath);

                // plugin
                assert.deepStrictEqual(fileConfig1.plugins, ["example"], "Plugin is present for engine 1");
                assert.deepStrictEqual(fileConfig2.plugins, [], "Plugin is not present for engine 2");
            });
        });

        describe("rules", () => {
            it("Loading rules in one instance doesn't mutate to another instance", () => {
                const filePath = getFixturePath("single-quoted.js");
                const engine1 = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    rules: { "example/example-rule": 1 }
                });
                const engine2 = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });
                const fileConfig1 = engine1.getConfigForFile(filePath);
                const fileConfig2 = engine2.getConfigForFile(filePath);

                // plugin
                assert.deepStrictEqual(fileConfig1.rules["example/example-rule"], [1], "example is present for engine 1");
                assert.isUndefined(fileConfig2.rules["example/example-rule"], "example is not present for engine 2");
            });
        });
    });

    describe("with ignorePatterns config", () => {
        const root = getFixturePath("cli-engine/ignore-patterns");

        describe("ignorePatterns can add an ignore pattern ('foo.js').", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": {
                        ignorePatterns: "foo.js"
                    },
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'executeOnFiles()' should not verify 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js"),
                    path.join(root, "subdir/bar.js")
                ]);
            });
        });

        describe("ignorePatterns can add ignore patterns ('foo.js', '/bar.js').", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": {
                        ignorePatterns: ["foo.js", "/bar.js"]
                    },
                    "foo.js": "",
                    "bar.js": "",
                    "baz.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": "",
                    "subdir/baz.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for '/bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'executeOnFiles()' should not verify 'foo.js' and '/bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "baz.js"),
                    path.join(root, "subdir/bar.js"),
                    path.join(root, "subdir/baz.js")
                ]);
            });
        });

        describe("ignorePatterns can unignore '/node_modules/foo'.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": {
                        ignorePatterns: "!/node_modules/foo"
                    },
                    "node_modules/foo/index.js": "",
                    "node_modules/foo/.dot.js": "",
                    "node_modules/bar/index.js": "",
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/index.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("node_modules/foo/index.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/foo/.dot.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("node_modules/foo/.dot.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/bar/index.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("node_modules/bar/index.js"), true);
            });

            it("'executeOnFiles()' should verify 'node_modules/foo/index.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "foo.js"),
                    path.join(root, "node_modules/foo/index.js")
                ]);
            });
        });

        describe("ignorePatterns can unignore '.eslintrc.js'.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "!.eslintrc.js"
                    })}`,
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for '.eslintrc.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored(".eslintrc.js"), false);
            });

            it("'executeOnFiles()' should verify '.eslintrc.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, ".eslintrc.js"),
                    path.join(root, "foo.js")
                ]);
            });
        });

        describe(".eslintignore can re-ignore files that are unignored by ignorePatterns.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "!.*"
                    })}`,
                    ".eslintignore": ".foo*",
                    ".foo.js": "",
                    ".bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for re-ignored '.foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored(".foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for unignored '.bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored(".bar.js"), false);
            });

            it("'executeOnFiles()' should not verify re-ignored '.foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, ".bar.js"),
                    path.join(root, ".eslintrc.js")
                ]);
            });
        });

        describe(".eslintignore can unignore files that are ignored by ignorePatterns.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "*.js"
                    })}`,
                    ".eslintignore": "!foo.js",
                    "foo.js": "",
                    "bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for unignored 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for ignored 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), true);
            });

            it("'executeOnFiles()' should verify unignored 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "foo.js")
                ]);
            });
        });

        describe("ignorePatterns in the config file in a child directory affects to only in the directory.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        ignorePatterns: "foo.js"
                    }),
                    "subdir/.eslintrc.json": JSON.stringify({
                        ignorePatterns: "bar.js"
                    }),
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": "",
                    "subdir/subsubdir/foo.js": "",
                    "subdir/subsubdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/subsubdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in 'subdir'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/subsubdir/bar.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the outside of 'subdir'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
            });

            it("'executeOnFiles()' should verify 'bar.js' in the outside of 'subdir'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js")
                ]);
            });
        });

        describe("ignorePatterns in the config file in a child directory can unignore the ignored files in the parent directory's config.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        ignorePatterns: "foo.js"
                    }),
                    "subdir/.eslintrc.json": JSON.stringify({
                        ignorePatterns: "!foo.js"
                    }),
                    "foo.js": "",
                    "subdir/foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js' in the root directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'foo.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'executeOnFiles()' should verify 'foo.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "subdir/foo.js")
                ]);
            });
        });

        describe(".eslintignore can unignore files that are ignored by ignorePatterns in the config file in the child directory.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": {},
                    "subdir/.eslintrc.json": {
                        ignorePatterns: "*.js"
                    },
                    ".eslintignore": "!foo.js",
                    "foo.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for unignored 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), false);
                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for ignored 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'executeOnFiles()' should verify unignored 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "foo.js"),
                    path.join(root, "subdir/foo.js")
                ]);
            });
        });

        describe("if the config in a child directory has 'root:true', ignorePatterns in the config file in the parent directory should not be used.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": {
                        ignorePatterns: "foo.js"
                    },
                    "subdir/.eslintrc.json": {
                        root: true,
                        ignorePatterns: "bar.js"
                    },
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js' in the root directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the root directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
            });

            it("'isPathIgnored()' should return 'false' for 'foo.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'executeOnFiles()' should verify 'bar.js' in the root directory and 'foo.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js"),
                    path.join(root, "subdir/foo.js")
                ]);
            });
        });

        describe("even if the config in a child directory has 'root:true', .eslintignore should be used.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({}),
                    "subdir/.eslintrc.json": JSON.stringify({
                        root: true,
                        ignorePatterns: "bar.js"
                    }),
                    ".eslintignore": "foo.js",
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the root directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in the child directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'executeOnFiles()' should verify 'bar.js' in the root directory.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js")
                ]);
            });
        });

        describe("ignorePatterns in the shareable config should be used.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "foo.js"
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: "one"
                    }),
                    "foo.js": "",
                    "bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
            });

            it("'executeOnFiles()' should verify 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js")
                ]);
            });
        });

        describe("ignorePatterns in the shareable config should be relative to the entry config file.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "/foo.js"
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: "one"
                    }),
                    "foo.js": "",
                    "subdir/foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);


            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'subdir/foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'executeOnFiles()' should verify 'subdir/foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "subdir/foo.js")
                ]);
            });
        });

        describe("ignorePatterns in a config file can unignore the files which are ignored by ignorePatterns in the shareable config.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                        ignorePatterns: "*.js"
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: "one",
                        ignorePatterns: "!bar.js"
                    }),
                    "foo.js": "",
                    "bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assert.strictEqual(engine.isPathIgnored("bar.js"), false);
            });

            it("'executeOnFiles()' should verify 'bar.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js")
                ]);
            });
        });

        describe("ignorePatterns in a config file should not be used if --no-ignore option was given.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        ignorePatterns: "*.js"
                    }),
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath(), ignore: false });

                assert.strictEqual(engine.isPathIgnored("foo.js"), false);
            });

            it("'executeOnFiles()' should verify 'foo.js'.", () => {
                const engine = new CLIEngine({ cwd: getPath(), ignore: false });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "foo.js")
                ]);
            });
        });

        describe("ignorePatterns in overrides section is not allowed.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.js": `module.exports = ${JSON.stringify({
                        overrides: [
                            {
                                files: "*.js",
                                ignorePatterns: "foo.js"
                            }
                        ]
                    })}`,
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("should throw a configuration error.", () => {
                assert.throws(() => {
                    const engine = new CLIEngine({ cwd: getPath() });

                    engine.executeOnFiles("*.js");
                }, "Unexpected top-level property \"overrides[0].ignorePatterns\"");
            });
        });

    });

    describe("'overrides[].files' adds lint targets", () => {
        const root = getFixturePath("cli-engine/additional-lint-targets");

        describe("if { files: 'foo/*.txt', excludedFiles: '**/ignore.txt' } is present,", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        overrides: [
                            {
                                files: "foo/*.txt",
                                excludedFiles: "**/ignore.txt"
                            }
                        ]
                    }),
                    "foo/nested/test.txt": "",
                    "foo/test.js": "",
                    "foo/test.txt": "",
                    "foo/ignore.txt": "",
                    "bar/test.js": "",
                    "bar/test.txt": "",
                    "bar/ignore.txt": "",
                    "test.js": "",
                    "test.txt": "",
                    "ignore.txt": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with a directory path should contain 'foo/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles(".")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "foo/test.txt"),
                    path.join(root, "test.js")
                ]);
            });

            it("'executeOnFiles()' with a glob pattern '*.js' should not contain 'foo/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*.txt' } is present,", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        overrides: [
                            {
                                files: "foo/**/*.txt"
                            }
                        ]
                    }),
                    "foo/nested/test.txt": "",
                    "foo/test.js": "",
                    "foo/test.txt": "",
                    "bar/test.js": "",
                    "bar/test.txt": "",
                    "test.js": "",
                    "test.txt": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles(".")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/nested/test.txt"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "foo/test.txt"),
                    path.join(root, "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*' } is present,", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    ".eslintrc.json": JSON.stringify({
                        overrides: [
                            {
                                files: "foo/**/*"
                            }
                        ]
                    }),
                    "foo/nested/test.txt": "",
                    "foo/test.js": "",
                    "foo/test.txt": "",
                    "bar/test.js": "",
                    "bar/test.txt": "",
                    "test.js": "",
                    "test.txt": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with a directory path should NOT contain 'foo/test.txt' and 'foo/nested/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles(".")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*.txt' } is present in a shareable config,", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/eslint-config-foo/index.js": `module.exports = ${JSON.stringify({
                        overrides: [
                            {
                                files: "foo/**/*.txt"
                            }
                        ]
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: "foo"
                    }),
                    "foo/nested/test.txt": "",
                    "foo/test.js": "",
                    "foo/test.txt": "",
                    "bar/test.js": "",
                    "bar/test.txt": "",
                    "test.js": "",
                    "test.txt": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles(".")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/nested/test.txt"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "foo/test.txt"),
                    path.join(root, "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*.txt' } is present in a plugin config,", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": `exports.configs = ${JSON.stringify({
                        bar: {
                            overrides: [
                                {
                                    files: "foo/**/*.txt"
                                }
                            ]
                        }
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: "plugin:foo/bar"
                    }),
                    "foo/nested/test.txt": "",
                    "foo/test.js": "",
                    "foo/test.txt": "",
                    "bar/test.js": "",
                    "bar/test.txt": "",
                    "test.js": "",
                    "test.txt": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const filePaths = engine.executeOnFiles(".")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/nested/test.txt"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "foo/test.txt"),
                    path.join(root, "test.js")
                ]);
            });
        });
    });

    describe("'ignorePatterns', 'overrides[].files', and 'overrides[].excludedFiles' of the configuration that the '--config' option provided should be resolved from CWD.", () => {
        const root = getFixturePath("cli-engine/config-and-overrides-files");

        describe("if { files: 'foo/*.txt', ... } is present by '--config node_modules/myconf/.eslintrc.json',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/myconf/.eslintrc.json": JSON.stringify({
                        overrides: [
                            {
                                files: "foo/*.js",
                                rules: {
                                    eqeqeq: "error"
                                }
                            }
                        ]
                    }),
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with 'foo/test.js' should use the override entry.", () => {
                const engine = new CLIEngine({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    ignore: false,
                    useEslintrc: false
                });
                const { results } = engine.executeOnFiles("foo/test.js");

                // Expected to be an 'eqeqeq' error because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 1,
                        filePath: path.join(root, "foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [
                            {
                                column: 3,
                                endColumn: 5,
                                endLine: 1,
                                line: 1,
                                message: "Expected '===' and instead saw '=='.",
                                messageId: "unexpected",
                                nodeType: "BinaryExpression",
                                ruleId: "eqeqeq",
                                severity: 2
                            }
                        ],
                        suppressedMessages: [],
                        source: "a == b",
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'executeOnFiles()' with 'node_modules/myconf/foo/test.js' should NOT use the override entry.", () => {
                const engine = new CLIEngine({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    ignore: false,
                    useEslintrc: false
                });
                const { results } = engine.executeOnFiles("node_modules/myconf/foo/test.js");

                // Expected to be no errors because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 0,
                        filePath: path.join(root, "node_modules/myconf/foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [],
                        suppressedMessages: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });
        });

        describe("if { files: '*', excludedFiles: 'foo/*.txt', ... } is present by '--config node_modules/myconf/.eslintrc.json',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/myconf/.eslintrc.json": JSON.stringify({
                        overrides: [
                            {
                                files: "*",
                                excludedFiles: "foo/*.js",
                                rules: {
                                    eqeqeq: "error"
                                }
                            }
                        ]
                    }),
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with 'foo/test.js' should NOT use the override entry.", () => {
                const engine = new CLIEngine({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    ignore: false,
                    useEslintrc: false
                });
                const { results } = engine.executeOnFiles("foo/test.js");

                // Expected to be no errors because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 0,
                        filePath: path.join(root, "foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [],
                        suppressedMessages: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'executeOnFiles()' with 'node_modules/myconf/foo/test.js' should use the override entry.", () => {
                const engine = new CLIEngine({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    ignore: false,
                    useEslintrc: false
                });
                const { results } = engine.executeOnFiles("node_modules/myconf/foo/test.js");

                // Expected to be an 'eqeqeq' error because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 1,
                        filePath: path.join(root, "node_modules/myconf/foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [
                            {
                                column: 3,
                                endColumn: 5,
                                endLine: 1,
                                line: 1,
                                message: "Expected '===' and instead saw '=='.",
                                messageId: "unexpected",
                                nodeType: "BinaryExpression",
                                ruleId: "eqeqeq",
                                severity: 2
                            }
                        ],
                        suppressedMessages: [],
                        source: "a == b",
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });
        });

        describe("if { ignorePatterns: 'foo/*.txt', ... } is present by '--config node_modules/myconf/.eslintrc.json',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "node_modules/myconf/.eslintrc.json": JSON.stringify({
                        ignorePatterns: ["!/node_modules/myconf", "foo/*.js"],
                        rules: {
                            eqeqeq: "error"
                        }
                    }),
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' with '**/*.js' should iterate 'node_modules/myconf/foo/test.js' but not 'foo/test.js'.", () => {
                const engine = new CLIEngine({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    useEslintrc: false
                });
                const files = engine.executeOnFiles("**/*.js")
                    .results
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(files, [
                    path.join(root, "node_modules/myconf/foo/test.js")
                ]);
            });
        });
    });

    describe("plugin conflicts", () => {
        let uid = 0;
        const root = getFixturePath("cli-engine/plugin-conflicts-");

        /**
         * Verify thrown errors.
         * @param {() => void} f The function to run and throw.
         * @param {Record<string, any>} props The properties to verify.
         * @returns {void}
         */
        function assertThrows(f, props) {
            try {
                f();
            } catch (error) {
                for (const [key, value] of Object.entries(props)) {
                    assert.deepStrictEqual(error[key], value, key);
                }
                return;
            }

            assert.fail("Function should throw an error, but not.");
        }

        describe("between a config file and linear extendees.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-one/node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                        extends: ["two"],
                        plugins: ["foo"]
                    })}`,
                    "node_modules/eslint-config-two/node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-two/index.js": `module.exports = ${JSON.stringify({
                        plugins: ["foo"]
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: ["one"],
                        plugins: ["foo"]
                    }),
                    "test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file.)", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                engine.executeOnFiles("test.js");
            });
        });

        describe("between a config file and same-depth extendees.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-one/node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-one/index.js": `module.exports = ${JSON.stringify({
                        plugins: ["foo"]
                    })}`,
                    "node_modules/eslint-config-two/node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/eslint-config-two/index.js": `module.exports = ${JSON.stringify({
                        plugins: ["foo"]
                    })}`,
                    ".eslintrc.json": JSON.stringify({
                        extends: ["one", "two"],
                        plugins: ["foo"]
                    }),
                    "test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file.)", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                engine.executeOnFiles("test.js");
            });
        });

        describe("between two config files in different directories, with single node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    ".eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files, but node_modules directory is unique.)", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                engine.executeOnFiles("subdir/test.js");
            });
        });

        describe("between two config files in different directories, with multiple node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    ".eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/node_modules/eslint-plugin-foo/index.js": "",
                    "subdir/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files.)", () => {
                const engine = new CLIEngine({ cwd: getPath() });

                assertThrows(
                    () => engine.executeOnFiles("subdir/test.js"),
                    {
                        message: `Plugin "foo" was conflicted between "subdir${path.sep}.eslintrc.json" and ".eslintrc.json".`,
                        messageTemplate: "plugin-conflict",
                        messageData: {
                            pluginId: "foo",
                            plugins: [
                                {
                                    filePath: path.join(getPath(), "subdir/node_modules/eslint-plugin-foo/index.js"),
                                    importerName: `subdir${path.sep}.eslintrc.json`
                                },
                                {
                                    filePath: path.join(getPath(), "node_modules/eslint-plugin-foo/index.js"),
                                    importerName: ".eslintrc.json"
                                }
                            ]
                        }
                    }
                );
            });
        });

        describe("between '--config' option and a regular config file, with single node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/mine/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    ".eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files, but node_modules directory is unique.)", () => {
                const engine = new CLIEngine({
                    cwd: getPath(),
                    configFile: "node_modules/mine/.eslintrc.json"
                });

                engine.executeOnFiles("test.js");
            });
        });

        describe("between '--config' option and a regular config file, with multiple node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/mine/node_modules/eslint-plugin-foo/index.js": "",
                    "node_modules/mine/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    ".eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files.)", () => {
                const engine = new CLIEngine({
                    cwd: getPath(),
                    configFile: "node_modules/mine/.eslintrc.json"
                });

                assertThrows(
                    () => engine.executeOnFiles("test.js"),
                    {
                        message: "Plugin \"foo\" was conflicted between \"--config\" and \".eslintrc.json\".",
                        messageTemplate: "plugin-conflict",
                        messageData: {
                            pluginId: "foo",
                            plugins: [
                                {
                                    filePath: path.join(getPath(), "node_modules/mine/node_modules/eslint-plugin-foo/index.js"),
                                    importerName: "--config"
                                },
                                {
                                    filePath: path.join(getPath(), "node_modules/eslint-plugin-foo/index.js"),
                                    importerName: ".eslintrc.json"
                                }
                            ]
                        }
                    }
                );
            });
        });

        describe("between '--plugin' option and a regular config file, with single node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "subdir/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from both CWD and the base directory of the entry config file, but node_modules directory is unique.)", () => {
                const engine = new CLIEngine({
                    cwd: getPath(),
                    plugins: ["foo"]
                });

                engine.executeOnFiles("subdir/test.js");
            });
        });

        describe("between '--plugin' option and a regular config file, with multiple node_modules.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    "subdir/node_modules/eslint-plugin-foo/index.js": "",
                    "subdir/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should throw plugin-conflict error. (Load the plugin from both CWD and the base directory of the entry config file.)", () => {
                const engine = new CLIEngine({
                    cwd: getPath(),
                    plugins: ["foo"]
                });

                assertThrows(
                    () => engine.executeOnFiles("subdir/test.js"),
                    {
                        message: `Plugin "foo" was conflicted between "CLIOptions" and "subdir${path.sep}.eslintrc.json".`,
                        messageTemplate: "plugin-conflict",
                        messageData: {
                            pluginId: "foo",
                            plugins: [
                                {
                                    filePath: path.join(getPath(), "node_modules/eslint-plugin-foo/index.js"),
                                    importerName: "CLIOptions"
                                },
                                {
                                    filePath: path.join(getPath(), "subdir/node_modules/eslint-plugin-foo/index.js"),
                                    importerName: `subdir${path.sep}.eslintrc.json`
                                }
                            ]
                        }
                    }
                );
            });
        });

        describe("'--resolve-plugins-relative-to' option overrides the location that ESLint load plugins from.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "node_modules/eslint-plugin-foo/index.js": "",
                    ".eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/node_modules/eslint-plugin-foo/index.js": "",
                    "subdir/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "subdir/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from '--resolve-plugins-relative-to'.)", () => {
                const engine = new CLIEngine({
                    cwd: getPath(),
                    resolvePluginsRelativeTo: getPath()
                });

                engine.executeOnFiles("subdir/test.js");
            });
        });

        describe("between two config files with different target files.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}${++uid}`,
                files: {
                    "one/node_modules/eslint-plugin-foo/index.js": "",
                    "one/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "one/test.js": "",
                    "two/node_modules/eslint-plugin-foo/index.js": "",
                    "two/.eslintrc.json": JSON.stringify({
                        plugins: ["foo"]
                    }),
                    "two/test.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'executeOnFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file for each target file. Not related to each other.)", () => {
                const engine = new CLIEngine({ cwd: getPath() });
                const { results } = engine.executeOnFiles("*/test.js");

                assert.strictEqual(results.length, 2);
            });
        });
    });
});
