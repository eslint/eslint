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
    leche = require("leche"),
    shell = require("shelljs"),
    Config = require("../../lib/config"),
    fs = require("fs"),
    os = require("os"),
    hash = require("../../lib/util/hash");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("CLIEngine", () => {

    const examplePluginName = "eslint-plugin-example",
        examplePluginNameWithNamespace = "@eslint/eslint-plugin-example",
        requireStubs = {},
        examplePlugin = {
            rules: {
                "example-rule": require("../fixtures/rules/custom-rule"),
                "make-syntax-error": require("../fixtures/rules/make-syntax-error-rule")
            }
        },
        examplePreprocessorName = "eslint-plugin-processor",
        originalDir = process.cwd();
    let CLIEngine,
        fixtureDir;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        const args = Array.prototype.slice.call(arguments);

        args.unshift(fixtureDir);
        let filepath = path.join.apply(path, args);

        try {
            filepath = fs.realpathSync(filepath);
            return filepath;
        } catch (e) {
            return filepath;
        }
    }

    /**
     * Create the CLIEngine object by mocking some of the plugins
     * @param {Object} options - options for CLIEngine
     * @returns {CLIEngine} engine object
     * @private
     */
    function cliEngineWithPlugins(options) {
        const engine = new CLIEngine(Object.assign({}, options, { configFile: null }));

        // load the mocked plugins
        engine.config.plugins.define(examplePluginName, examplePlugin);
        engine.config.plugins.define(examplePluginNameWithNamespace, examplePlugin);
        engine.config.plugins.define(examplePreprocessorName, require("../fixtures/processors/custom-processor"));

        // load the real file now so that it can consume the loaded plugins
        engine.config.loadSpecificConfig(options.configFile);

        return engine;
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        fixtureDir = path.join(os.tmpdir(), "/eslint/fixtures");
        shell.mkdir("-p", fixtureDir);
        shell.cp("-r", "./tests/fixtures/.", fixtureDir);
        fixtureDir = fs.realpathSync(fixtureDir);
    });

    beforeEach(() => {
        CLIEngine = proxyquire("../../lib/cli-engine", requireStubs);
    });

    after(() => {
        shell.rm("-r", fixtureDir);
    });

    describe("new CLIEngine(options)", () => {
        it("the default value of 'options.cwd' should be the current working directory.", () => {
            process.chdir(__dirname);
            try {
                const engine = new CLIEngine();

                assert.equal(engine.options.cwd, __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });
    });

    describe("executeOnText()", () => {

        let engine;

        it("should report the total and per file errors when using local cwd .eslintrc", () => {

            engine = new CLIEngine();

            const report = engine.executeOnText("var foo = 'bar';");

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 5);
            assert.equal(report.warningCount, 0);
            assert.equal(report.fixableErrorCount, 3);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].messages.length, 5);
            assert.equal(report.results[0].messages[0].ruleId, "strict");
            assert.equal(report.results[0].messages[1].ruleId, "no-var");
            assert.equal(report.results[0].messages[2].ruleId, "no-unused-vars");
            assert.equal(report.results[0].messages[3].ruleId, "quotes");
            assert.equal(report.results[0].messages[4].ruleId, "eol-last");
            assert.equal(report.results[0].fixableErrorCount, 3);
            assert.equal(report.results[0].fixableWarningCount, 0);
        });

        it("should report the toatl and per file warnings when using local cwd .eslintrc", () => {

            engine = new CLIEngine({
                rules: {
                    quotes: 1,
                    "no-var": 1,
                    "eol-last": 1,
                    strict: 1,
                    "no-unused-vars": 1
                }
            });

            const report = engine.executeOnText("var foo = 'bar';");

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 5);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 3);
            assert.equal(report.results[0].messages.length, 5);
            assert.equal(report.results[0].messages[0].ruleId, "strict");
            assert.equal(report.results[0].messages[1].ruleId, "no-var");
            assert.equal(report.results[0].messages[2].ruleId, "no-unused-vars");
            assert.equal(report.results[0].messages[3].ruleId, "quotes");
            assert.equal(report.results[0].messages[4].ruleId, "eol-last");
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 3);
        });

        it("should report one message when using specific config file", () => {

            engine = new CLIEngine({
                configFile: "fixtures/configurations/quotes-error.json",
                useEslintrc: false,
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var foo = 'bar';");

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 1);
            assert.equal(report.warningCount, 0);
            assert.equal(report.fixableErrorCount, 1);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
            assert.isUndefined(report.results[0].messages[0].output);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 1);
            assert.equal(report.results[0].warningCount, 0);
        });

        it("should report the filename when passed in", () => {

            engine = new CLIEngine({
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var foo = 'bar';", "test.js");

            assert.equal(report.results[0].filePath, getFixturePath("test.js"));
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js", true);

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 1);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].filePath, getFixturePath("passing.js"));
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.isUndefined(report.results[0].messages[0].output);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
        });

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            // intentional parsing error
            const report = engine.executeOnText("va r bar = foo;", "fixtures/passing.js", false);

            // should not report anything because the file is ignored
            assert.equal(report.results.length, 0);
        });

        it("should suppress excluded file warnings by default", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnText("var bar = foo;", "fixtures/passing.js");

            // should not report anything because there are no errors
            assert.equal(report.results.length, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, getFixturePath("passing.js"));
            assert.equal(report.results[0].messages[0].ruleId, "no-undef");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.isUndefined(report.results[0].messages[0].output);
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

            assert.deepEqual(report, {
                results: [
                    {
                        filePath: getFixturePath("passing.js"),
                        messages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var bar = foo;"
                    }
                ],
                errorCount: 0,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
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

            assert.deepEqual(report, {
                results: [
                    {
                        filePath: getFixturePath("passing.js"),
                        messages: [
                            {
                                ruleId: "no-undef",
                                severity: 2,
                                message: "'foo' is not defined.",
                                line: 1,
                                column: 11,
                                endLine: 1,
                                endColumn: 14,
                                nodeType: "Identifier",
                                source: "var bar = foo"
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar = foo"
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
            });
        });

        it("should not delete code if there is a syntax error after trying to autofix.", () => {
            engine = cliEngineWithPlugins({
                useEslintrc: false,
                fix: true,
                rules: {
                    "example/make-syntax-error": "error"
                },
                ignore: false,
                cwd: getFixturePath()
            });

            const report = engine.executeOnText("var bar = foo", "test.js");

            assert.deepEqual(report, {
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
                                source: "var bar = foothis is a syntax error."
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "var bar = foothis is a syntax error."
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
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

            assert.deepEqual(report, {
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
                                source: "var bar ="
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar ="
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
            });
        });

        it("should return source code of file in `source` property when errors are present", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 2 }
            });

            const report = engine.executeOnText("var foo = 'bar'");

            assert.equal(report.results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 1 }
            });

            const report = engine.executeOnText("var foo = 'bar'");

            assert.equal(report.results[0].source, "var foo = 'bar'");
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
            assert.equal(report.results[0].output, "var msg = 'hi' + foo;\n");
        });

        it("should return a `source` property when a parsing error has occurred", () => {
            engine = new CLIEngine({
                useEslintrc: false,
                rules: { semi: 2 }
            });

            const report = engine.executeOnText("var bar = foothis is a syntax error.\n return bar;");

            assert.deepEqual(report, {
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
                                source: "var bar = foothis is a syntax error."
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source: "var bar = foothis is a syntax error.\n return bar;"
                    }
                ],
                errorCount: 1,
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, getFixturePath("node_modules/passing.js"));
            assert.equal(report.results[0].messages[0].message, expectedMsg);
        });

    });

    describe("executeOnFiles()", () => {

        let engine;

        it("should use correct parser when custom parser is specified", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                ignore: false
            });

            const filePath = path.resolve(__dirname, "../fixtures/configurations/parser/custom.js");
            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].message, "Parsing error: Boom!");

        });


        it("should report zero messages when given a config file and a valid file", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                configFile: ".eslintrc.yml"
            });

            const report = engine.executeOnFiles(["lib/cli*.js"]);

            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", () => {

            engine = new CLIEngine({
                cwd: originalDir,
                configFile: ".eslintrc.yml"
            });

            const report = engine.executeOnFiles(["lib/cli*.js", "lib/cli.?s", "lib/{cli,cli-engine}.js"]);

            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and espree as parser", () => {

            engine = new CLIEngine({
                parser: "espree",
                envs: ["es6"],
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli.js"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", () => {

            engine = new CLIEngine({
                parser: "esprima",
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli.js"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should report one fatal message when given a config file and a valid file and invalid parser", () => {

            engine = new CLIEngine({
                parser: "test11",
                useEslintrc: false
            });

            const report = engine.executeOnFiles(["lib/cli.js"]);

            assert.lengthOf(report.results, 1);
            assert.lengthOf(report.results[0].messages, 1);
            assert.isTrue(report.results[0].messages[0].fatal);
        });

        it("should report zero messages when given a directory with a .js2 file", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                extensions: [".js2"]
            });

            const report = engine.executeOnFiles([getFixturePath("files/foo.js2")]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should report zero messages when given a directory with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath("..")
            });

            const report = engine.executeOnFiles(["fixtures/files/"]);

            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should report zero messages when given a '**' pattern with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/*"]);

            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should report on all files passed explicitly, even if ignored by default", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine")
            });

            const report = engine.executeOnFiles(["node_modules/foo.js"]);
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[0].messages[0].message, expectedMsg);
        });

        it("should report on globs with explicit inclusion of dotfiles, even though ignored by default", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                rules: {
                    quotes: [2, "single"]
                }
            });

            const report = engine.executeOnFiles(["hidden/.hiddenfolder/*.js"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].fixableErrorCount, 1);
            assert.equal(report.results[0].fixableWarningCount, 0);
        });

        it("should not check default ignored files without --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine")
            });

            const report = engine.executeOnFiles(["node_modules"]);

            assert.equal(report.results.length, 0);
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should not check node_modules files even with --no-ignore flag", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("cli-engine"),
                ignore: false
            });

            const report = engine.executeOnFiles(["node_modules"]);

            assert.equal(report.results.length, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[0].messages[0].message, expectedMsg);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 1);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 1);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
        });

        it("should report zero messages when given a pattern with a .js and a .js2 file", () => {

            engine = new CLIEngine({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/*.?s*"]);

            assert.equal(report.results.length, 2);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", () => {

            engine = new CLIEngine({
                cwd: getFixturePath("configurations"),
                configFile: getFixturePath("configurations", "quotes-error.json")
            });
            const report = engine.executeOnFiles([getFixturePath("single-quoted.js")]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.errorCount, 1);
            assert.equal(report.warningCount, 0);
            assert.equal(report.fixableErrorCount, 1);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].messages[0].ruleId, "quotes");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].errorCount, 1);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].fixableErrorCount, 1);
            assert.equal(report.results[0].fixableWarningCount, 0);
        });

        it("should return 3 messages when given a config file and a directory of 3 valid files", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "semi-error.json")
            });

            const report = engine.executeOnFiles([getFixturePath("formatters")]);

            assert.equal(report.results.length, 3);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 0);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].messages.length, 0);
            assert.equal(report.results[1].messages.length, 0);
            assert.equal(report.results[2].messages.length, 0);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[1].errorCount, 0);
            assert.equal(report.results[1].warningCount, 0);
            assert.equal(report.results[1].fixableErrorCount, 0);
            assert.equal(report.results[1].fixableWarningCount, 0);
            assert.equal(report.results[2].errorCount, 0);
            assert.equal(report.results[2].warningCount, 0);
            assert.equal(report.results[2].fixableErrorCount, 0);
            assert.equal(report.results[2].fixableWarningCount, 0);
        });


        it("should return the total number of errors when given multiple files", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "single-quotes-error.json")
            });

            const report = engine.executeOnFiles([getFixturePath("formatters")]);

            assert.equal(report.errorCount, 6);
            assert.equal(report.warningCount, 0);
            assert.equal(report.fixableErrorCount, 6);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
            assert.equal(report.results[1].errorCount, 3);
            assert.equal(report.results[1].warningCount, 0);
            assert.equal(report.results[1].fixableErrorCount, 3);
            assert.equal(report.results[1].fixableWarningCount, 0);
            assert.equal(report.results[2].errorCount, 3);
            assert.equal(report.results[2].warningCount, 0);
            assert.equal(report.results[2].fixableErrorCount, 3);
            assert.equal(report.results[2].fixableWarningCount, 0);
        });

        it("should process when file is given by not specifying extensions", () => {

            engine = new CLIEngine({
                ignore: false,
                cwd: path.join(fixtureDir, "..")
            });

            const report = engine.executeOnFiles(["fixtures/files/foo.js2"]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to browser", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-browser.json")
            });

            const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", () => {

            engine = new CLIEngine({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-node.json")
            });

            const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, failFilePath);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "semi");
            assert.equal(report.results[0].messages[0].severity, 2);

            report = engine.executeOnFiles([passFilePath]);
            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, passFilePath);
            assert.equal(report.results[0].messages.length, 0);

        });

        it("should return zero messages when given a directory with eslint excluded files in the directory", () => {

            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore")
            });

            const report = engine.executeOnFiles([getFixturePath("./")]);

            assert.equal(report.results.length, 0);
        });

        it("should return zero messages when all given files are ignored", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore")
            });

            const report = engine.executeOnFiles(["tests/fixtures/"]);

            assert.equal(report.results.length, 0);
        });

        it("should return zero messages when all given files are ignored event with a `./` prefix", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore")
            });

            const report = engine.executeOnFiles(["./tests/fixtures/"]);

            assert.equal(report.results.length, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 0);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
        });

        // https://github.com/eslint/eslint/issues/3812
        it("should ignore all files when tests/fixtures/ is in ignore file", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath("cli-engine/.eslintignore2"),
                useEslintrc: false,
                rules: {
                    quotes: [2, "double"]
                }
            });

            const report = engine.executeOnFiles(["./tests/fixtures/cli-engine/"]);

            assert.equal(report.results.length, 0);
        });

        it("should return zero messages when all given files are ignored via ignore-pattern", () => {
            engine = new CLIEngine({
                ignorePattern: "tests/fixtures/single-quoted.js"
            });

            const report = engine.executeOnFiles(["tests/fixtures/*-quoted.js"]);

            assert.equal(report.results.length, 0);
        });

        it("should return a warning when an explicitly given file is ignored", () => {
            engine = new CLIEngine({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath()
            });

            const filePath = getFixturePath("passing.js");

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 1);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
            assert.equal(report.results[0].fixableErrorCount, 0);
            assert.equal(report.results[0].fixableWarningCount, 0);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages[0].ruleId, "no-undef");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].messages[1].ruleId, "no-undef");
            assert.equal(report.results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing a file with a shebang", () => {

            engine = new CLIEngine({
                ignore: false
            });

            const report = engine.executeOnFiles([getFixturePath("shebang.js")]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should give a warning when loading a custom rule that doesn't exist", () => {

            engine = new CLIEngine({
                ignore: false,
                rulesPaths: [getFixturePath("rules", "dir1")],
                configFile: getFixturePath("rules", "missing-rule.json")
            });
            const report = engine.executeOnFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].messages.length, 1);
            assert.equal(report.results[0].messages[0].ruleId, "missing-rule");
            assert.equal(report.results[0].messages[0].severity, 1);
            assert.equal(report.results[0].messages[0].message, "Definition for rule 'missing-rule' was not found");


        });

        it("should throw an error when loading a bad custom rule", () => {

            engine = new CLIEngine({
                ignore: false,
                rulePaths: [getFixturePath("rules", "wrong")],
                configFile: getFixturePath("rules", "eslint.json")
            });


            assert.throws(() => {
                engine.executeOnFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);
            }, /Error while loading rule 'custom-rule'/);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "custom-rule");
            assert.equal(report.results[0].messages[0].severity, 1);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "custom-rule");
            assert.equal(report.results[0].messages[0].severity, 1);
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

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 2);
            assert.equal(report.results[0].messages[0].ruleId, "no-literals");
            assert.equal(report.results[0].messages[0].severity, 2);
            assert.equal(report.results[0].messages[1].ruleId, "no-strings");
            assert.equal(report.results[0].messages[1].severity, 2);
        });

        it("should return zero messages when executing without useEslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing without useEslintrc flag in Node.js environment", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("process-exit.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages when executing with base-config flag set to false", () => {

            engine = new CLIEngine({
                ignore: false,
                baseConfig: false,
                useEslintrc: false
            });

            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages and ignore .eslintrc files when executing with no-eslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("eslintrc", "quotes.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should return zero messages and ignore package.json files when executing with no-eslintrc flag", () => {

            engine = new CLIEngine({
                ignore: false,
                useEslintrc: false,
                envs: ["node"]
            });

            const filePath = fs.realpathSync(getFixturePath("packagejson", "quotes.js"));

            const report = engine.executeOnFiles([filePath]);

            assert.equal(report.results.length, 1);
            assert.equal(report.results[0].filePath, filePath);
            assert.equal(report.results[0].messages.length, 0);
        });

        it("should not fail if an ignored file cannot be resolved", () => {

            const fakeFS = leche.fake(fs),
                LocalCLIEngine = proxyquire("../../lib/cli-engine", {
                    fs: fakeFS
                });

            fakeFS.realpathSync = function() {
                throw new Error("this error should not happen");
            };
            fakeFS.existsSync = fs.existsSync;
            fakeFS.unlinkSync = fs.unlinkSync;

            engine = new LocalCLIEngine({
                ignorePattern: "tests"
            });

            assert.doesNotThrow(() => {
                engine.executeOnFiles(["tests/fixtures/file-not-found.js"]);
            });

        });

        describe("Fix Mode", () => {

            it("should return fixed text on multiple files when in fix mode", () => {

                /**
                 * Converts CRLF to LF in output.
                 * This is a workaround for git's autocrlf option on Windows.
                 * @param {Object} result - A result object to convert.
                 * @returns {void}
                 */
                function convertCRLF(result) {
                    if (result && result.output) {
                        result.output = result.output.replace(/\r\n/g, "\n");
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
                assert.deepEqual(report, {
                    results: [
                        {
                            filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/multipass.js")),
                            messages: [],
                            errorCount: 0,
                            warningCount: 0,
                            fixableErrorCount: 0,
                            fixableWarningCount: 0,
                            output: "true ? \"yes\" : \"no\";\n"
                        },
                        {
                            filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/ok.js")),
                            messages: [],
                            errorCount: 0,
                            warningCount: 0,
                            fixableErrorCount: 0,
                            fixableWarningCount: 0
                        },
                        {
                            filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/quotes-semi-eqeqeq.js")),
                            messages: [
                                {
                                    column: 9,
                                    line: 2,
                                    message: "Expected '===' and instead saw '=='.",
                                    nodeType: "BinaryExpression",
                                    ruleId: "eqeqeq",
                                    severity: 2,
                                    source: "if (msg == \"hi\") {"
                                }
                            ],
                            errorCount: 1,
                            warningCount: 0,
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
                                    message: "'foo' is not defined.",
                                    nodeType: "Identifier",
                                    ruleId: "no-undef",
                                    severity: 2,
                                    source: "var msg = \"hi\" + foo;"
                                }
                            ],
                            errorCount: 1,
                            warningCount: 0,
                            fixableErrorCount: 0,
                            fixableWarningCount: 0,
                            output: "var msg = \"hi\" + foo;\n"
                        }
                    ],
                    errorCount: 2,
                    warningCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0
                });
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

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // No default configuration rules - conf/environments.js (/*eslint-env node*/)
            it("should return zero messages when executing with no .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    reset: true,
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes-node.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return zero messages when executing with .eslintrc in the Node.js environment", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/process-exit.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - first level .eslintrc
            it("should return one message when executing with .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - second level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - third level .eslintrc
            it("should return one message when executing with local .eslintrc that overrides parent and grandparent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/subsubbroken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - first level package.json
            it("should return one message when executing with package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Project configuration - second level package.json
            it("should return zero messages when executing with local package.json that overrides parent package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Project configuration - third level package.json
            it("should return one message when executing with local package.json that overrides parent and grandparent package.json", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/subdir/subsubdir/subsubsubdir/wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Project configuration - .eslintrc overrides package.json in same directory
            it("should return one message when executing with .eslintrc that overrides a package.json in the same directory", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/packagejson/wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return two messages when executing with config file that adds to local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 2);
                assert.equal(report.results[0].messages[1].ruleId, "semi");
                assert.equal(report.results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
                assert.equal(report.results[0].messages[1].ruleId, "semi");
                assert.equal(report.results[0].messages[1].severity, 1);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return one message when executing with config file that overrides local and parent .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("config-hierarchy/broken/override-conf.yaml")
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/subbroken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "no-console");
                assert.equal(report.results[0].messages[0].severity, 1);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should return no messages when executing with config file that overrides local .eslintrc", () => {

                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });

                const report = engine.executeOnFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 0);
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

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
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

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 1);
                assert.equal(report.results[0].messages[0].ruleId, "quotes");
                assert.equal(report.results[0].messages[0].severity, 1);
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

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin with namespace", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-with-prefix-and-namespace.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix and with namespace", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: getFixturePath("configurations", "plugins-without-prefix-with-namespace.json"),
                    useEslintrc: false
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies a plugin", () => {
                engine = cliEngineWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["example"],
                    rules: { "example/example-rule": 1 }
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", () => {
                engine = new CLIEngine({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    plugins: ["test"],
                    rules: { "test/example-rule": 1 }
                });

                engine.addPlugin("eslint-plugin-test", { rules: { "example-rule": require("../fixtures/rules/custom-rule") } });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
                assert.equal(report.results[0].messages[0].ruleId, "test/example-rule");
            });
        });

        describe("cache", () => {
            let sandbox;

            /**
             * helper method to delete a file without caring about exceptions
             *
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
                sandbox = sinon.sandbox.create();
            });

            afterEach(() => {
                sandbox.restore();
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
                    } catch (ex) {

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

                    sandbox.restore();
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

                sandbox.restore();
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

                let spy = sandbox.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const result = engine.executeOnFiles([file]);

                assert.equal(result.errorCount + result.warningCount, 0, "the file passed without errors or warnings");
                assert.equal(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sandbox.restore();

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
                spy = sandbox.spy(fs, "readFileSync");

                const cachedResult = engine.executeOnFiles([file]);

                assert.equal(spy.getCall(0).args[0], file, "the module read the file because is considered changed because the config changed");
                assert.equal(cachedResult.errorCount, 1, "since configuration changed the cache was not used an one error was reported");
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

                let spy = sandbox.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const result = engine.executeOnFiles([file]);

                assert.equal(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert.isTrue(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sandbox.restore();

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
                spy = sandbox.spy(fs, "readFileSync");

                const cachedResult = engine.executeOnFiles([file]);

                assert.deepEqual(result, cachedResult, "the result is the same regardless of using cache or not");

                // assert the file was not processed because the cache was used
                assert.isFalse(spy.called, "the file was not loaded because it used the cache");
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

            it("should not store in the cache a file that failed the test", () => {

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

                const cache = JSON.parse(fs.readFileSync(cacheFile));

                assert.isTrue(typeof cache[goodFile] === "object", "the entry for the good file is in the cache");

                assert.isTrue(typeof cache[badFile] === "undefined", "the entry for the bad file is not in the cache");

                const cachedResult = engine.executeOnFiles([badFile, goodFile]);

                assert.deepEqual(result, cachedResult, "result is the same with or without cache");
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

                let cache = JSON.parse(fs.readFileSync(cacheFile));

                assert.isTrue(typeof cache[toBeDeletedFile] === "object", "the entry for the file to be deleted is in the cache");

                // delete the file from the file system
                fs.unlinkSync(toBeDeletedFile);

                // file-entry-cache@2.0.0 will remove from the cache deleted files
                // even when they were not part of the array of files to be analyzed
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

                let cache = JSON.parse(fs.readFileSync(cacheFile));

                assert.isTrue(typeof cache[testFile2] === "object", "the entry for the test-file2 is in the cache");

                // we pass a different set of files minus test-file2
                // previous version of file-entry-cache would remove the non visited
                // entries. 2.0.0 version will keep them unless they don't exist
                engine.executeOnFiles([badFile, goodFile]);

                cache = JSON.parse(fs.readFileSync(cacheFile));

                assert.isTrue(typeof cache[testFile2] === "object", "the entry for the test-file2 is in the cache");
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

                    const cache = JSON.parse(fs.readFileSync(customCacheFile));

                    assert.isTrue(typeof cache[goodFile] === "object", "the entry for the good file is in the cache");

                    assert.isTrue(typeof cache[badFile] === "undefined", "the entry for the bad file is not in the cache");

                    const cachedResult = engine.executeOnFiles([badFile, goodFile]);

                    assert.deepEqual(result, cachedResult, "result is the same with or without cache");
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

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
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
                });

                engine.addPlugin("test-processor", {
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
                });

                const report = engine.executeOnFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.equal(report.results.length, 1);
                assert.equal(report.results[0].messages.length, 2);
            });
            it("should run processors when calling executeOnFiles with config file that specifies a processor", () => {
                engine = cliEngineWithPlugins({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });

                const report = engine.executeOnFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.equal(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
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
                });

                engine.addPlugin("test-processor", {
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
                });

                const report = engine.executeOnFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.equal(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
            it("should run processors when calling executeOnText with config file that specifies a processor", () => {
                engine = cliEngineWithPlugins({
                    configFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    ignore: false
                });

                const report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.equal(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
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
                });

                engine.addPlugin("test-processor", {
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
                });

                const report = engine.executeOnText("function a() {console.log(\"Test\");}", "tests/fixtures/processors/test/test-processor.txt");

                assert.equal(report.results[0].messages[0].message, "'b' is defined but never used.");
                assert.equal(report.results[0].messages[0].ruleId, "post-processed");
            });
        });
    });

    describe("getConfigForFile", () => {

        it("should return the info from Config#getConfig when called", () => {

            const engine = new CLIEngine({
                configFile: getFixturePath("configurations", "quotes-error.json")
            });

            const configHelper = new Config(engine.options, engine.linter);

            const filePath = getFixturePath("single-quoted.js");

            assert.deepEqual(
                engine.getConfigForFile(filePath),
                configHelper.getConfig(filePath)
            );

        });


        it("should return the config when run from within a subdir", () => {

            const engine = new CLIEngine({
                cwd: getFixturePath("config-hierarchy", "root-true", "parent", "root", "subdir")
            });

            const configHelper = new Config(engine.options, engine.linter);

            const filePath = getFixturePath("config-hierarchy", "root-true", "parent", "root", ".eslintrc");
            const config = engine.getConfigForFile("./.eslintrc");

            assert.deepEqual(
                config,
                configHelper.getConfig(filePath)
            );

        });

    });

    describe("isPathIgnored", () => {
        let sandbox;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(console, "info").returns(void 0);
        });

        afterEach(() => {
            sandbox.restore();
        });

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

        it("should return null when a customer formatter doesn't exist", () => {
            const engine = new CLIEngine(),
                formatterPath = getFixturePath("formatters", "doesntexist.js");

            assert.throws(() => {
                engine.getFormatter(formatterPath);
            }, `There was a problem loading formatter: ${formatterPath}\nError: Cannot find module '${formatterPath}'`);
        });

        it("should return null when a built-in formatter doesn't exist", () => {
            const engine = new CLIEngine();

            assert.throws(() => {
                engine.getFormatter("special");
            }, "There was a problem loading formatter: ./formatters/special\nError: Cannot find module './formatters/special'");
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
            const engine = new CLIEngine();

            const report = engine.executeOnText("var foo = 'bar';");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.lengthOf(errorResults[0].messages, 5);
            assert.equal(errorResults[0].errorCount, 5);
            assert.equal(errorResults[0].fixableErrorCount, 3);
            assert.equal(errorResults[0].fixableWarningCount, 0);
            assert.equal(errorResults[0].messages[0].ruleId, "strict");
            assert.equal(errorResults[0].messages[0].severity, 2);
            assert.equal(errorResults[0].messages[1].ruleId, "no-var");
            assert.equal(errorResults[0].messages[1].severity, 2);
            assert.equal(errorResults[0].messages[2].ruleId, "no-unused-vars");
            assert.equal(errorResults[0].messages[2].severity, 2);
            assert.equal(errorResults[0].messages[3].ruleId, "quotes");
            assert.equal(errorResults[0].messages[3].severity, 2);
            assert.equal(errorResults[0].messages[4].ruleId, "eol-last");
            assert.equal(errorResults[0].messages[4].severity, 2);
        });

        it("should report a warningCount of 0 when looking for errors only", () => {

            process.chdir(originalDir);
            const engine = new CLIEngine();

            const report = engine.executeOnText("var foo = 'bar';");
            const errorResults = CLIEngine.getErrorResults(report.results);

            assert.equal(errorResults[0].warningCount, 0);
            assert.equal(errorResults[0].fixableWarningCount, 0);
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
            assert.equal(report.errorCount, 0);
            assert.equal(report.warningCount, 1);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 0);
            assert.equal(report.results[0].errorCount, 0);
            assert.equal(report.results[0].warningCount, 1);
            assert.equal(report.fixableErrorCount, 0);
            assert.equal(report.fixableWarningCount, 0);
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
            assert.equal(errorResults[0].source, "var foo = 'bar';");
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
            assert.equal(errorResults[0].output, "console.log('foo');");
        });
    });

    describe("outputFixes()", () => {

        const sandbox = sinon.sandbox.create();

        afterEach(() => {
            sandbox.verifyAndRestore();
        });

        it("should call fs.writeFileSync() for each result with output", () => {
            const fakeFS = leche.fake(fs),
                localCLIEngine = proxyquire("../../lib/cli-engine", {
                    fs: fakeFS
                }),
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

            fakeFS.writeFileSync = function() {};
            const spy = sandbox.spy(fakeFS, "writeFileSync");

            localCLIEngine.outputFixes(report);

            assert.equal(spy.callCount, 2);
            assert.isTrue(spy.firstCall.calledWithExactly("foo.js", "bar"), "First call was incorrect.");
            assert.isTrue(spy.secondCall.calledWithExactly("bar.js", "baz"), "Second call was incorrect.");

        });

        it("should call fs.writeFileSync() for each result with output and not at all for a result without output", () => {
            const fakeFS = leche.fake(fs),
                localCLIEngine = proxyquire("../../lib/cli-engine", {
                    fs: fakeFS
                }),
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

            fakeFS.writeFileSync = function() {};
            const spy = sandbox.spy(fakeFS, "writeFileSync");

            localCLIEngine.outputFixes(report);

            assert.equal(spy.callCount, 2);
            assert.isTrue(spy.firstCall.calledWithExactly("foo.js", "bar"), "First call was incorrect.");
            assert.isTrue(spy.secondCall.calledWithExactly("bar.js", "baz"), "Second call was incorrect.");

        });

    });

    describe("resolveFileGlobPatterns", () => {

        leche.withData([
            [".", "**/*.js"],
            ["./", "**/*.js"],
            ["../", "../**/*.js"]
        ], (input, expected) => {

            it(`should correctly resolve ${input} to ${expected}`, () => {
                const engine = new CLIEngine();

                const result = engine.resolveFileGlobPatterns([input]);

                assert.equal(result[0], expected);

            });
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
            const messages = report.results[0].messages;

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, "no-alert");
        });

        it("should not report a violation by default", () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                envs: ["browser"],
                ignore: true,

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
            const messages = report.results[0].messages;

            assert.equal(messages.length, 0);
        });

    });

    describe("when retreiving version number", () => {
        it("should return current version number", () => {
            const eslintCLI = require("../../lib/cli-engine");
            const version = eslintCLI.version;

            assert.isString(version);
            assert.isTrue(parseInt(version[0], 10) >= 3);
        });
    });

    describe("mutability", () => {
        describe("plugins", () => {
            it("Loading plugin in one instance doesnt mutate to another instance", () => {
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
                assert.strictEqual(fileConfig1.plugins[0], "example", "Plugin is present for engine 1");
                assert.isUndefined(fileConfig2.plugins, "Plugin is not present for engine 2");
            });
        });

        describe("rules", () => {
            it("Loading rules in one instance doesnt mutate to another instance", () => {
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
                assert.strictEqual(fileConfig1.rules["example/example-rule"], 1, "example is present for engine 1");
                assert.isUndefined(fileConfig2.rules["example/example-rule"], "example is not present for engine 2");
            });
        });
    });
});
