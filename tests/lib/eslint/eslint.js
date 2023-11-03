/**
 * @fileoverview Tests for the ESLint class.
 * @author Kai Cataldo
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const escapeStringRegExp = require("escape-string-regexp");
const fCache = require("file-entry-cache");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const shell = require("shelljs");
const {
    Legacy: {
        CascadingConfigArrayFactory
    }
} = require("@eslint/eslintrc");
const hash = require("../../../lib/cli-engine/hash");
const { unIndent, createCustomTeardown } = require("../../_utils");
const coreRules = require("../../../lib/rules");
const childProcess = require("child_process");

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

    /** @type {import("../../../lib/eslint/eslint").ESLint} */
    let ESLint;

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
     * Create the ESLint object by mocking some of the plugins
     * @param {Object} options options for ESLint
     * @returns {ESLint} engine object
     * @private
     */
    function eslintWithPlugins(options) {
        return new ESLint({
            ...options,
            plugins: {
                [examplePluginName]: examplePlugin,
                [examplePluginNameWithNamespace]: examplePlugin,
                [examplePreprocessorName]: require("../../fixtures/processors/custom-processor")
            }
        });
    }

    /**
     * Call the last argument.
     * @param {any[]} args Arguments
     * @returns {void}
     */
    function callLastArgument(...args) {
        process.nextTick(args[args.length - 1], null);
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
        ({ ESLint } = require("../../../lib/eslint/eslint"));
    });

    after(() => {
        shell.rm("-r", fixtureDir);
    });

    describe("ESLint constructor function", () => {
        it("the default value of 'options.cwd' should be the current working directory.", async () => {
            process.chdir(__dirname);
            try {
                const engine = new ESLint({ useEslintrc: false });
                const results = await engine.lintFiles("eslint.js");

                assert.strictEqual(path.dirname(results[0].filePath), __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });

        it("should normalize 'options.cwd'.", async () => {
            const cwd = getFixturePath("example-app3");
            const engine = new ESLint({
                cwd: `${cwd}${path.sep}foo${path.sep}..`, // `<cwd>/foo/..` should be normalized to `<cwd>`
                useEslintrc: false,
                overrideConfig: {
                    plugins: ["test"],
                    rules: {
                        "test/report-cwd": "error"
                    }
                }
            });
            const results = await engine.lintText("");

            assert.strictEqual(results[0].messages[0].ruleId, "test/report-cwd");
            assert.strictEqual(results[0].messages[0].message, cwd);

            const formatter = await engine.loadFormatter("cwd");

            assert.strictEqual(formatter.format(results), cwd);
        });

        it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new -- Check for throwing
                new ESLint({ ignorePath: fixtureDir });
            }, new RegExp(escapeStringRegExp(`Cannot read .eslintignore file: ${fixtureDir}\nError: EISDIR: illegal operation on a directory, read`), "u"));
        });

        // https://github.com/eslint/eslint/issues/2380
        it("should not modify baseConfig when format is specified", () => {
            const customBaseConfig = { root: true };

            new ESLint({ baseConfig: customBaseConfig }); // eslint-disable-line no-new -- Check for argument side effects

            assert.deepStrictEqual(customBaseConfig, { root: true });
        });

        it("should throw readable messages if removed options are present", () => {
            assert.throws(
                () => new ESLint({
                    cacheFile: "",
                    configFile: "",
                    envs: [],
                    globals: [],
                    ignorePattern: [],
                    parser: "",
                    parserOptions: {},
                    rules: {},
                    plugins: []
                }),
                new RegExp(escapeStringRegExp([
                    "Invalid Options:",
                    "- Unknown options: cacheFile, configFile, envs, globals, ignorePattern, parser, parserOptions, rules",
                    "- 'cacheFile' has been removed. Please use the 'cacheLocation' option instead.",
                    "- 'configFile' has been removed. Please use the 'overrideConfigFile' option instead.",
                    "- 'envs' has been removed. Please use the 'overrideConfig.env' option instead.",
                    "- 'globals' has been removed. Please use the 'overrideConfig.globals' option instead.",
                    "- 'ignorePattern' has been removed. Please use the 'overrideConfig.ignorePatterns' option instead.",
                    "- 'parser' has been removed. Please use the 'overrideConfig.parser' option instead.",
                    "- 'parserOptions' has been removed. Please use the 'overrideConfig.parserOptions' option instead.",
                    "- 'rules' has been removed. Please use the 'overrideConfig.rules' option instead.",
                    "- 'plugins' doesn't add plugins to configuration to load. Please use the 'overrideConfig.plugins' option instead."
                ].join("\n")), "u")
            );
        });

        it("should throw readable messages if wrong type values are given to options", () => {
            assert.throws(
                () => new ESLint({
                    allowInlineConfig: "",
                    baseConfig: "",
                    cache: "",
                    cacheLocation: "",
                    cwd: "foo",
                    errorOnUnmatchedPattern: "",
                    extensions: "",
                    fix: "",
                    fixTypes: ["xyz"],
                    globInputPaths: "",
                    ignore: "",
                    ignorePath: "",
                    overrideConfig: "",
                    overrideConfigFile: "",
                    plugins: "",
                    reportUnusedDisableDirectives: "",
                    resolvePluginsRelativeTo: "",
                    rulePaths: "",
                    useEslintrc: ""
                }),
                new RegExp(escapeStringRegExp([
                    "Invalid Options:",
                    "- 'allowInlineConfig' must be a boolean.",
                    "- 'baseConfig' must be an object or null.",
                    "- 'cache' must be a boolean.",
                    "- 'cacheLocation' must be a non-empty string.",
                    "- 'cwd' must be an absolute path.",
                    "- 'errorOnUnmatchedPattern' must be a boolean.",
                    "- 'extensions' must be an array of non-empty strings or null.",
                    "- 'fix' must be a boolean or a function.",
                    "- 'fixTypes' must be an array of any of \"directive\", \"problem\", \"suggestion\", and \"layout\".",
                    "- 'globInputPaths' must be a boolean.",
                    "- 'ignore' must be a boolean.",
                    "- 'ignorePath' must be a non-empty string or null.",
                    "- 'overrideConfig' must be an object or null.",
                    "- 'overrideConfigFile' must be a non-empty string or null.",
                    "- 'plugins' must be an object or null.",
                    "- 'reportUnusedDisableDirectives' must be any of \"error\", \"warn\", \"off\", and null.",
                    "- 'resolvePluginsRelativeTo' must be a non-empty string or null.",
                    "- 'rulePaths' must be an array of non-empty strings.",
                    "- 'useEslintrc' must be a boolean."
                ].join("\n")), "u")
            );
        });

        it("should throw readable messages if 'plugins' option contains empty key", () => {
            assert.throws(
                () => new ESLint({
                    plugins: {
                        "eslint-plugin-foo": {},
                        "eslint-plugin-bar": {},
                        "": {}
                    }
                }),
                new RegExp(escapeStringRegExp([
                    "Invalid Options:",
                    "- 'plugins' must not include an empty string."
                ].join("\n")), "u")
            );
        });
    });

    describe("lintText()", () => {
        let eslint;

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

            it("should report the total and per file errors", async () => {
                eslint = new ESLint({ cwd: getPath() });
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
                assert.strictEqual(results[0].usedDeprecatedRules.length, 2);
                assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
                assert.strictEqual(results[0].usedDeprecatedRules[1].ruleId, "eol-last");
            });

            it("should report the total and per file warnings", async () => {
                eslint = new ESLint({
                    cwd: getPath(),
                    overrideConfig: {
                        rules: {
                            quotes: 1,
                            "no-var": 1,
                            "eol-last": 1,
                            strict: 1,
                            "no-unused-vars": 1
                        }
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
                assert.strictEqual(results[0].usedDeprecatedRules.length, 2);
                assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
                assert.strictEqual(results[0].usedDeprecatedRules[1].ruleId, "eol-last");
            });
        });

        it("should report one message when using specific config file", async () => {
            eslint = new ESLint({
                overrideConfigFile: "fixtures/configurations/quotes-error.json",
                useEslintrc: false,
                cwd: getFixturePath("..")
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(results[0].messages[0].output, void 0);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 1);
            assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
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

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].severity, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to override.");
            assert.strictEqual(results[0].messages[0].output, void 0);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
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
                overrideConfig: {
                    rules: {
                        "no-undef": 2
                    }
                }
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[0].output, void 0);
        });

        it("should return a message and fixed text when in fix mode", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
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
                    suppressedMessages: [],
                    errorCount: 0,
                    warningCount: 0,
                    fatalErrorCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    output: "var bar = foo;",
                    usedDeprecatedRules: [{
                        ruleId: "semi",
                        replacedBy: []
                    }]
                }
            ]);
        });

        it("should use eslint:recommended rules when eslint:recommended configuration is specified", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    extends: ["eslint:recommended"]
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "file.js" };
            const results = await eslint.lintText("foo ()", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "no-undef");
            assert.strictEqual(results[0].messages[0].severity, 2);
        });

        it("should use eslint:all rules when eslint:all configuration is specified", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    extends: ["eslint:all"]
                },
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "file.js" };
            const results = await eslint.lintText("if (true) { foo() }", options);

            assert.strictEqual(results.length, 1);

            const { messages } = results[0];

            // Some rules that should report errors in the given code. Not all, as we don't want to update this test when we add new rules.
            const expectedRules = ["no-undef", "no-constant-condition"];

            expectedRules.forEach(ruleId => {
                const messageFromRule = messages.find(message => message.ruleId === ruleId);

                assert.ok(
                    typeof messageFromRule === "object" && messageFromRule !== null, // LintMessage object
                    `Expected a message from rule '${ruleId}'`
                );
                assert.strictEqual(messageFromRule.severity, 2);
            });

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
            it("should throw an error when an invalid fix type is specified", () => {
                assert.throws(() => {
                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,
                        fix: true,
                        fixTypes: ["layou"]
                    });
                }, /'fixTypes' must be an array of any of "directive", "problem", "suggestion", and "layout"\./iu);
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

                assert.strictEqual(results[0].output, void 0);
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

            it("should not throw an error when a rule is loaded after initialization with lintFiles()", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"],
                    plugins: {
                        test: {
                            rules: {
                                "no-program": require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                            }
                        }
                    }
                });
                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            it("should not throw an error when a rule is loaded after initialization with lintText()", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    fix: true,
                    fixTypes: ["layout"],
                    plugins: {
                        test: {
                            rules: {
                                "no-program": require(getFixturePath("rules", "fix-types-test", "no-program.js"))
                            }
                        }
                    }
                });
                const inputPath = getFixturePath("fix-types/ignore-missing-meta.js");
                const outputPath = getFixturePath("fix-types/ignore-missing-meta.expected.js");
                const results = await eslint.lintText(fs.readFileSync(inputPath, { encoding: "utf8" }), { filePath: inputPath });
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });
        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    rules: {
                        "no-undef": 2
                    }
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
                    suppressedMessages: [],
                    errorCount: 1,
                    warningCount: 0,
                    fatalErrorCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    source: "var bar = foo",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should not delete code if there is a syntax error after trying to autofix.", async () => {
            eslint = eslintWithPlugins({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    plugins: ["example"],
                    rules: {
                        "example/make-syntax-error": "error"
                    }
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
                    output: "var bar = foothis is a syntax error.",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should not crash even if there are any syntax error since the first time.", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    rules: {
                        "example/make-syntax-error": "error"
                    }
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
                    source: "var bar =",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should return source code of file in `source` property when errors are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: { semi: 1 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].source, void 0);
        });

        it("should not return a `source` property when fixes are applied", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    rules: {
                        semi: 2,
                        "no-unused-vars": 2
                    }
                }
            });
            const results = await eslint.lintText("var msg = 'hi' + foo\n");

            assert.strictEqual(results[0].source, void 0);
            assert.strictEqual(results[0].output, "var msg = 'hi' + foo;\n");
        });

        it("should return a `source` property when a parsing error has occurred", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: { eqeqeq: 2 }
                }
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

            /* eslint-disable no-underscore-dangle -- Override Node API */
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
            /* eslint-enable no-underscore-dangle -- Override Node API */

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
                overrideConfigFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml"
            });
            const [result] = await eslint.lintText("foo");

            assert.deepStrictEqual(
                result.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
        });

        it("should throw if non-string value is given to 'code' parameter", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintText(100), /'code' must be a string/u);
        });

        it("should throw if non-object value is given to 'options' parameter", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", "foo.js"), /'options' must be an object, null, or undefined/u);
        });

        it("should throw if 'options' argument contains unknown key", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { filename: "foo.js" }), /'options' must not include the unknown option\(s\): filename/u);
        });

        it("should throw if non-string value is given to 'options.filePath' option", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { filePath: "" }), /'options.filePath' must be a non-empty string or undefined/u);
        });

        it("should throw if non-boolean value is given to 'options.warnIgnored' option", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { warnIgnored: "" }), /'options.warnIgnored' must be a boolean or undefined/u);
        });
    });

    describe("lintFiles()", () => {

        /** @type {InstanceType<import("../../../lib/eslint").ESLint>} */
        let eslint;

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
                useEslintrc: false,
                ignore: false,
                overrideConfigFile: "tests/fixtures/simple-valid-project/.eslintrc.js"
            });
            const results = await eslint.lintFiles(["tests/fixtures/simple-valid-project/**/foo*.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                useEslintrc: false,
                ignore: false,
                overrideConfigFile: "tests/fixtures/simple-valid-project/.eslintrc.js"
            });
            const results = await eslint.lintFiles([
                "tests/fixtures/simple-valid-project/**/foo*.js",
                "tests/fixtures/simple-valid-project/foo.?s",
                "tests/fixtures/simple-valid-project/{foo,src/foobar}.js"
            ]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and espree as parser", async () => {
            eslint = new ESLint({
                overrideConfig: {
                    parser: "espree",
                    parserOptions: {
                        ecmaVersion: 2021
                    }
                },
                useEslintrc: false
            });
            const results = await eslint.lintFiles(["lib/cli.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", async () => {
            eslint = new ESLint({
                overrideConfig: {
                    parser: "esprima"
                },
                useEslintrc: false,
                ignore: false
            });
            const results = await eslint.lintFiles(["tests/fixtures/passing.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should throw an error when given a config file and a valid file and invalid parser", async () => {
            eslint = new ESLint({
                overrideConfig: {
                    parser: "test11"
                },
                useEslintrc: false
            });

            await assert.rejects(async () => await eslint.lintFiles(["lib/cli.js"]), /Cannot find module 'test11'/u);
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
                overrideConfigFile: getFixturePath("configurations", "quotes-error.json"),
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

            await assert.rejects(async () => {
                await eslint.lintFiles(["fixtures/files/*"]);
            }, /No files matching 'fixtures\/files\/\*' were found \(glob was disabled\)\./u);
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
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        it("should report on globs with explicit inclusion of dotfiles, even though ignored by default", async () => {
            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                overrideConfig: {
                    rules: {
                        quotes: [2, "single"]
                    }
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

            await assert.rejects(async () => {
                await eslint.lintFiles(["node_modules"]);
            }, /All files matched by 'node_modules' are ignored\./u);
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should not check node_modules files even with --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                ignore: false
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["node_modules"]);
            }, /All files matched by 'node_modules' are ignored\./u);
        });

        it("should not check .hidden files if they are passed explicitly without --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath(".."),
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        quotes: [2, "single"]
                    }
                }
            });
            const results = await eslint.lintFiles(["fixtures/files/.bar.js"]);
            const expectedMsg = "File ignored by default.  Use a negated ignore pattern (like \"--ignore-pattern '!<relative/path/to/filename>'\") to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        // https://github.com/eslint/eslint/issues/12873
        it("should not check files within a .hidden folder if they are passed explicitly without the --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath("cli-engine"),
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        quotes: [2, "single"]
                    }
                }
            });
            const results = await eslint.lintFiles(["hidden/.hiddenfolder/double-quotes.js"]);
            const expectedMsg = "File ignored by default.  Use a negated ignore pattern (like \"--ignore-pattern '!<relative/path/to/filename>'\") to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        it("should check .hidden files if they are passed explicitly with --no-ignore flag", async () => {
            eslint = new ESLint({
                cwd: getFixturePath(".."),
                ignore: false,
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        quotes: [2, "single"]
                    }
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
                overrideConfig: {
                    ignorePatterns: "!.hidden*",
                    rules: {
                        quotes: [2, "single"]
                    }
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
                overrideConfigFile: getFixturePath("configurations", "quotes-error.json")
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
                overrideConfigFile: getFixturePath("configurations", "semi-error.json")
            });
            const fixturePath = getFixturePath("formatters");
            const results = await eslint.lintFiles([fixturePath]);

            assert.strictEqual(results.length, 5);
            assert.strictEqual(path.relative(fixturePath, results[0].filePath), "async.js");
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(path.relative(fixturePath, results[1].filePath), "broken.js");
            assert.strictEqual(results[1].errorCount, 0);
            assert.strictEqual(results[1].warningCount, 0);
            assert.strictEqual(results[1].fixableErrorCount, 0);
            assert.strictEqual(results[1].fixableWarningCount, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(path.relative(fixturePath, results[2].filePath), "cwd.js");
            assert.strictEqual(results[2].errorCount, 0);
            assert.strictEqual(results[2].warningCount, 0);
            assert.strictEqual(results[2].fixableErrorCount, 0);
            assert.strictEqual(results[2].fixableWarningCount, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(path.relative(fixturePath, results[3].filePath), "simple.js");
            assert.strictEqual(results[3].errorCount, 0);
            assert.strictEqual(results[3].warningCount, 0);
            assert.strictEqual(results[3].fixableErrorCount, 0);
            assert.strictEqual(results[3].fixableWarningCount, 0);
            assert.strictEqual(results[3].messages.length, 0);
            assert.strictEqual(path.relative(fixturePath, results[4].filePath), path.join("test", "simple.js"));
            assert.strictEqual(results[4].errorCount, 0);
            assert.strictEqual(results[4].warningCount, 0);
            assert.strictEqual(results[4].fixableErrorCount, 0);
            assert.strictEqual(results[4].fixableWarningCount, 0);
            assert.strictEqual(results[4].messages.length, 0);
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
                overrideConfigFile: getFixturePath("configurations", "env-browser.json")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when given an option to set environment to browser", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfig: {
                    env: { browser: true },
                    rules: {
                        "no-alert": 0,
                        "no-undef": 2
                    }
                }
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages when given a config with environment set to Node.js", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: getFixturePath("configurations", "env-node.json")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should not return results from previous call when calling more than once", async () => {
            eslint = new ESLint({
                cwd: path.join(fixtureDir, ".."),
                ignore: false,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
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

            await assert.rejects(async () => {
                await eslint.lintFiles([getFixturePath("./cli-engine/")]);
            }, new RegExp(escapeStringRegExp(`All files matched by '${getFixturePath("./cli-engine/")}' are ignored.`), "u"));
        });

        it("should throw an error when all given files are ignored", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                ignorePath: getFixturePath(".eslintignore")
            });
            await assert.rejects(async () => {
                await eslint.lintFiles(["tests/fixtures/cli-engine/"]);
            }, /All files matched by 'tests\/fixtures\/cli-engine\/' are ignored\./u);
        });

        it("should throw an error when all given files are ignored even with a `./` prefix", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                ignorePath: getFixturePath(".eslintignore")
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
            }, /All files matched by '\.\/tests\/fixtures\/cli-engine\/' are ignored\./u);
        });

        // https://github.com/eslint/eslint/issues/3788
        it("should ignore one-level down node_modules when ignore file has 'node_modules/' in it", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath("cli-engine", "nested_node_modules", ".eslintignore"),
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        quotes: [2, "double"]
                    }
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
                overrideConfig: {
                    rules: {
                        quotes: [2, "double"]
                    }
                }
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
            }, /All files matched by '\.\/tests\/fixtures\/cli-engine\/' are ignored\./u);
        });

        // https://github.com/eslint/eslint/issues/15642
        it("should ignore files that are ignored by patterns with escaped brackets", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath("ignored-paths", ".eslintignoreWithEscapedBrackets"),
                useEslintrc: false,
                cwd: getFixturePath("ignored-paths")
            });

            // Only `brackets/index.js` should be linted. Other files in `brackets/` should be ignored.
            const results = await eslint.lintFiles(["brackets/*.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("ignored-paths", "brackets", "index.js"));
        });

        it("should throw an error when all given files are ignored via ignore-pattern", async () => {
            eslint = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    ignorePatterns: "tests/fixtures/single-quoted.js"
                }
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["tests/fixtures/*-quoted.js"]);
            }, /All files matched by 'tests\/fixtures\/\*-quoted\.js' are ignored\./u);
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
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should return two messages when given a file in excluded files list while ignore is off", async () => {
            eslint = new ESLint({
                ignorePath: getFixturePath(".eslintignore"),
                ignore: false,
                overrideConfig: {
                    rules: {
                        "no-undef": 2
                    }
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
                overrideConfigFile: getFixturePath("rules", "missing-rule.json")
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
                overrideConfigFile: getFixturePath("rules", "eslint.json")
            });


            await assert.rejects(async () => {
                await eslint.lintFiles([getFixturePath("rules", "test", "test-custom-rule.js")]);
            }, /Error while loading rule 'custom-rule'/u);
        });

        it("should return one message when a custom rule matches a file", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                rulePaths: [getFixturePath("rules/")],
                overrideConfigFile: getFixturePath("rules", "eslint.json")
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
                overrideConfigFile: "eslint.json"
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
                overrideConfigFile: getFixturePath("rules", "multi-rulesdirs.json")
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
                overrideConfig: {
                    env: { node: true }
                }
            });
            const filePath = fs.realpathSync(getFixturePath("process-exit.js"));
            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should return zero messages and ignore .eslintrc files when executing with no-eslintrc flag", async () => {
            eslint = new ESLint({
                ignore: false,
                useEslintrc: false,
                overrideConfig: {
                    env: { node: true }
                }
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
                overrideConfig: {
                    env: { node: true }
                }
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
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        "indent-legacy": 1,
                        "require-jsdoc": 1,
                        "valid-jsdoc": 1
                    }
                }
            });
            const results = await eslint.lintFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(
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
                useEslintrc: false,
                overrideConfig: {
                    rules: { eqeqeq: 1, "valid-jsdoc": 0, "require-jsdoc": 0 }
                }
            });
            const results = await eslint.lintFiles(["lib/cli*.js"]);

            assert.deepStrictEqual(results[0].usedDeprecatedRules, []);
        });

        it("should warn when deprecated rules are found in a config", async () => {
            eslint = new ESLint({
                cwd: originalDir,
                overrideConfigFile: "tests/fixtures/cli-engine/deprecated-rule-config/.eslintrc.yml",
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
                    overrideConfig: {
                        rules: {
                            semi: 2,
                            quotes: [2, "double"],
                            eqeqeq: 2,
                            "no-undef": 2,
                            "space-infix-ops": 2
                        }
                    }
                });
                const results = await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                results.forEach(convertCRLF);
                assert.deepStrictEqual(results, [
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/multipass.js")),
                        messages: [],
                        suppressedMessages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        output: "true ? \"yes\" : \"no\";\n",
                        usedDeprecatedRules: [
                            {
                                replacedBy: [],
                                ruleId: "semi"
                            },
                            {
                                replacedBy: [],
                                ruleId: "quotes"
                            },
                            {
                                replacedBy: [],
                                ruleId: "space-infix-ops"
                            }
                        ]
                    },
                    {
                        filePath: fs.realpathSync(path.resolve(fixtureDir, "fixmode/ok.js")),
                        messages: [],
                        suppressedMessages: [],
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        usedDeprecatedRules: [
                            {
                                replacedBy: [],
                                ruleId: "semi"
                            },
                            {
                                replacedBy: [],
                                ruleId: "quotes"
                            },
                            {
                                replacedBy: [],
                                ruleId: "space-infix-ops"
                            }
                        ]
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
                        output: "var msg = \"hi\";\nif (msg == \"hi\") {\n\n}\n",
                        usedDeprecatedRules: [
                            {
                                replacedBy: [],
                                ruleId: "semi"
                            },
                            {
                                replacedBy: [],
                                ruleId: "quotes"
                            },
                            {
                                replacedBy: [],
                                ruleId: "space-infix-ops"
                            }
                        ]
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
                        output: "var msg = \"hi\" + foo;\n",
                        usedDeprecatedRules: [
                            {
                                replacedBy: [],
                                ruleId: "semi"
                            },
                            {
                                replacedBy: [],
                                ruleId: "quotes"
                            },
                            {
                                replacedBy: [],
                                ruleId: "space-infix-ops"
                            }
                        ]
                    }
                ]);
            });

            it("should run autofix even if files are cached without autofix results", async () => {
                const baseOptions = {
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    overrideConfig: {
                        rules: {
                            semi: 2,
                            quotes: [2, "double"],
                            eqeqeq: 2,
                            "no-undef": 2,
                            "space-infix-ops": 2
                        }
                    }
                };

                eslint = new ESLint(Object.assign({}, baseOptions, { cache: true, fix: false }));

                // Do initial lint run and populate the cache file
                await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                eslint = new ESLint(Object.assign({}, baseOptions, { cache: true, fix: true }));
                const results = await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                assert(results.some(result => result.output));
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
                    overrideConfigFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
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
                    overrideConfigFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });
                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should return two messages when executing with config file that adds to local and parent .eslintrc", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: `${fixtureDir}/config-hierarchy/broken/add-conf.yaml`
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
                    overrideConfigFile: getFixturePath("config-hierarchy/broken/override-conf.yaml")
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
                    overrideConfigFile: `${fixtureDir}/config-hierarchy/broken/override-conf.yaml`
                });
                const results = await eslint.lintFiles([fs.realpathSync(`${fixtureDir}/config-hierarchy/broken/console-wrong-quotes.js`)]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should return one message when executing with command line rule and config file that overrides local .eslintrc", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("config-hierarchy/broken/override-conf.yaml"),
                    overrideConfig: {
                        rules: {
                            quotes: [1, "double"]
                        }
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
                    overrideConfigFile: getFixturePath("/config-hierarchy/broken/override-conf.yaml"),
                    overrideConfig: {
                        rules: {
                            quotes: [1, "double"]
                        }
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
                eslint = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("configurations", "plugins-with-prefix.json"),
                    useEslintrc: false
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test/test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin with namespace", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("configurations", "plugins-with-prefix-and-namespace.json"),
                    useEslintrc: false
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "@eslint/example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("configurations", "plugins-without-prefix.json"),
                    useEslintrc: false
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with config file that specifies a plugin without prefix and with namespace", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("configurations", "plugins-without-prefix-with-namespace.json"),
                    useEslintrc: false
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "@eslint/example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies a plugin", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["example"],
                        rules: { "example/example-rule": 1 }
                    }
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test"],
                        rules: { "test/example-rule": 1 }
                    },
                    plugins: {
                        "eslint-plugin-test": { rules: { "example-rule": require("../../fixtures/rules/custom-rule") } }
                    }
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "test/example-rule");
            });

            it("should return two messages when executing with `baseConfig` that extends preloaded plugin config", async () => {
                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    baseConfig: {
                        extends: ["plugin:test/preset"]
                    },
                    plugins: {
                        test: {
                            rules: {
                                "example-rule": require("../../fixtures/rules/custom-rule")
                            },
                            configs: {
                                preset: {
                                    rules: {
                                        "test/example-rule": 1
                                    },
                                    plugins: ["test"]
                                }
                            }
                        }
                    }
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "test/example-rule");
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
                } catch {

                    /*
                     * we don't care if the file didn't exist, since our
                     * intention was to remove the file
                     */
                }
            }

            let cacheFilePath;

            beforeEach(() => {
                cacheFilePath = null;
            });

            afterEach(() => {
                sinon.restore();
                if (cacheFilePath) {
                    doDelete(cacheFilePath);
                }
            });

            describe("when cacheLocation is a directory or looks like a directory", () => {

                const cwd = getFixturePath();

                /**
                 * helper method to delete the cache files created during testing
                 * @returns {void}
                 */
                function deleteCacheDir() {
                    try {

                        /*
                         * `fs.rmdir(path, { recursive: true })` is deprecated and will be removed.
                         * Use `fs.rm(path, { recursive: true })` instead.
                         * When supporting Node.js 14.14.0+, the compatibility condition can be removed for `fs.rmdir`.
                         */
                        // eslint-disable-next-line n/no-unsupported-features/node-builtins -- just checking if it exists
                        if (typeof fs.rm === "function") {

                            // eslint-disable-next-line n/no-unsupported-features/node-builtins -- conditionally used
                            fs.rmSync(path.resolve(cwd, "tmp/.cacheFileDir/"), { recursive: true, force: true });
                        } else {
                            fs.rmdirSync(path.resolve(cwd, "tmp/.cacheFileDir/"), { recursive: true, force: true });
                        }

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

                it("should create the directory and the cache file inside it when cacheLocation ends with a slash", async () => {
                    assert(!shell.test("-d", path.resolve(cwd, "./tmp/.cacheFileDir/")), "the cache directory already exists and wasn't successfully deleted");

                    eslint = new ESLint({
                        useEslintrc: false,
                        cwd,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: "./tmp/.cacheFileDir/",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        extensions: ["js"],
                        ignore: false
                    });
                    const file = getFixturePath("cache/src", "test-file.js");

                    await eslint.lintFiles([file]);

                    assert(shell.test("-f", path.resolve(cwd, `./tmp/.cacheFileDir/.cache_${hash(cwd)}`)), "the cache for eslint should have been created");
                });

                it("should create the cache file inside existing cacheLocation directory when cacheLocation ends with a slash", async () => {
                    assert(!shell.test("-d", path.resolve(cwd, "./tmp/.cacheFileDir/")), "the cache directory already exists and wasn't successfully deleted");

                    fs.mkdirSync(path.resolve(cwd, "./tmp/.cacheFileDir/"), { recursive: true });

                    eslint = new ESLint({
                        useEslintrc: false,
                        cwd,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: "./tmp/.cacheFileDir/",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        ignore: false
                    });
                    const file = getFixturePath("cache/src", "test-file.js");

                    await eslint.lintFiles([file]);

                    assert(shell.test("-f", path.resolve(cwd, `./tmp/.cacheFileDir/.cache_${hash(cwd)}`)), "the cache for eslint should have been created");
                });

                it("should create the cache file inside existing cacheLocation directory when cacheLocation doesn't end with a path separator", async () => {
                    assert(!shell.test("-d", path.resolve(cwd, "./tmp/.cacheFileDir/")), "the cache directory already exists and wasn't successfully deleted");

                    fs.mkdirSync(path.resolve(cwd, "./tmp/.cacheFileDir/"), { recursive: true });

                    eslint = new ESLint({
                        useEslintrc: false,
                        cwd,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: "./tmp/.cacheFileDir",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        ignore: false
                    });
                    const file = getFixturePath("cache/src", "test-file.js");

                    await eslint.lintFiles([file]);

                    assert(shell.test("-f", path.resolve(cwd, `./tmp/.cacheFileDir/.cache_${hash(cwd)}`)), "the cache for eslint should have been created");
                });
            });

            it("should create the cache file inside cwd when no cacheLocation provided", async () => {
                const cwd = path.resolve(getFixturePath("cli-engine"));

                cacheFilePath = path.resolve(cwd, ".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    useEslintrc: false,
                    cache: true,
                    cwd,
                    overrideConfig: {
                        rules: {
                            "no-console": 0
                        }
                    },
                    extensions: ["js"],
                    ignore: false
                });
                const file = getFixturePath("cli-engine", "console.js");

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created at provided cwd");
            });

            it("should invalidate the cache if the configuration changed between executions", async () => {
                const cwd = getFixturePath("cache/src");

                cacheFilePath = path.resolve(cwd, ".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    useEslintrc: false,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    ignore: false
                });

                let spy = sinon.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);
                const results = await eslint.lintFiles([file]);

                for (const { errorCount, warningCount } of results) {
                    assert.strictEqual(errorCount + warningCount, 0, "the file should have passed linting without errors or warnings");
                }
                assert(spy.calledWith(file), "ESLint should have read the file because there was no cache file");
                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                // destroy the spy
                sinon.restore();

                eslint = new ESLint({
                    useEslintrc: false,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 2,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs, "readFileSync");

                const [newResult] = await eslint.lintFiles([file]);

                assert(spy.calledWith(file), "ESLint should have read the file again because it's considered changed because the config changed");
                assert.strictEqual(newResult.errorCount, 1, "since configuration changed the cache should have not been used and one error should have been reported");
                assert.strictEqual(newResult.messages[0].ruleId, "no-console");
                assert(shell.test("-f", cacheFilePath), "The cache for ESLint should still exist");
            });

            it("should remember the files from a previous run and do not operate on them if not changed", async () => {
                const cwd = getFixturePath("cache/src");

                cacheFilePath = path.resolve(cwd, ".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    useEslintrc: false,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    ignore: false
                });

                let spy = sinon.spy(fs, "readFileSync");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const result = await eslint.lintFiles([file]);

                assert(spy.calledWith(file), "ESLint should have read the file because there was no cache file");
                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                // destroy the spy
                sinon.restore();

                eslint = new ESLint({
                    useEslintrc: false,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs, "readFileSync");

                const cachedResult = await eslint.lintFiles([file]);

                assert.deepStrictEqual(result, cachedResult, "the result should have been the same");

                // assert the file was not processed because the cache was used
                assert(!spy.calledWith(file), "the file should not have been reloaded");
            });

            it("when `cacheLocation` is specified, should create the cache file with `cache:true` and then delete it with `cache:false`", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                const eslintOptions = {
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    cwd: path.join(fixtureDir, "..")
                };

                eslint = new ESLint(eslintOptions);

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                eslintOptions.cache = false;
                eslint = new ESLint(eslintOptions);

                await eslint.lintFiles([file]);

                assert(!shell.test("-f", cacheFilePath), "the cache for eslint should have been deleted since last run did not use the cache");
            });

            it("should store in the cache a file that has lint messages and a file that doesn't have lint messages", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const result = await eslint.lintFiles([badFile, goodFile]);
                const [badFileResult, goodFileResult] = result;

                assert.notStrictEqual(badFileResult.errorCount + badFileResult.warningCount, 0, "the bad file should have some lint errors or warnings");
                assert.strictEqual(goodFileResult.errorCount + badFileResult.warningCount, 0, "the good file should have passed linting without errors or warnings");

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                const fileCache = fCache.createFromFile(cacheFilePath);
                const { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(goodFile), "object", "the entry for the good file should have been in the cache");
                assert.strictEqual(typeof cache.getKey(badFile), "object", "the entry for the bad file should have been in the cache");
                const cachedResult = await eslint.lintFiles([badFile, goodFile]);

                assert.deepStrictEqual(result, cachedResult, "result should be the same with or without cache");
            });

            it("should not contain in the cache a file that was deleted", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const toBeDeletedFile = fs.realpathSync(getFixturePath("cache/src", "file-to-delete.js"));

                await eslint.lintFiles([badFile, goodFile, toBeDeletedFile]);
                const fileCache = fCache.createFromFile(cacheFilePath);
                let { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(toBeDeletedFile), "object", "the entry for the file to be deleted should have been in the cache");

                // delete the file from the file system
                fs.unlinkSync(toBeDeletedFile);

                /*
                 * file-entry-cache@2.0.0 will remove from the cache deleted files
                 * even when they were not part of the array of files to be analyzed
                 */
                await eslint.lintFiles([badFile, goodFile]);

                cache = JSON.parse(fs.readFileSync(cacheFilePath));

                assert.strictEqual(typeof cache[0][toBeDeletedFile], "undefined", "the entry for the file to be deleted should not have been in the cache");

                // make sure that the previos assertion checks the right place
                assert.notStrictEqual(typeof cache[0][badFile], "undefined", "the entry for the bad file should have been in the cache");
                assert.notStrictEqual(typeof cache[0][goodFile], "undefined", "the entry for the good file should have been in the cache");
            });

            it("should contain files that were not visited in the cache provided they still exist", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const testFile2 = fs.realpathSync(getFixturePath("cache/src", "test-file2.js"));

                await eslint.lintFiles([badFile, goodFile, testFile2]);

                let fileCache = fCache.createFromFile(cacheFilePath);
                let { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(testFile2), "object", "the entry for the test-file2 should have been in the cache");

                /*
                 * we pass a different set of files minus test-file2
                 * previous version of file-entry-cache would remove the non visited
                 * entries. 2.0.0 version will keep them unless they don't exist
                 */
                await eslint.lintFiles([badFile, goodFile]);

                fileCache = fCache.createFromFile(cacheFilePath);
                cache = fileCache.cache;

                assert.strictEqual(typeof cache.getKey(testFile2), "object", "the entry for the test-file2 should have been in the cache");
            });

            it("should not delete cache when executing on text", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                fs.writeFileSync(cacheFilePath, "[]"); // intenationally invalid to additionally make sure it isn't used

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should exist");

                await eslint.lintText("var foo = 'bar';");

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should still exist");
            });

            it("should not delete cache when executing on text with a provided filename", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                fs.writeFileSync(cacheFilePath, "[]"); // intenationally invalid to additionally make sure it isn't used

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should exist");

                await eslint.lintText("var bar = foo;", { filePath: "fixtures/passing.js" });

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should still exist");
            });

            it("should not delete cache when executing on files with --cache flag", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                fs.writeFileSync(cacheFilePath, "");

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const file = getFixturePath("cli-engine", "console.js");

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should exist");

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should still exist");
            });

            it("should delete cache when executing on files without --cache flag", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                fs.writeFileSync(cacheFilePath, "[]"); // intenationally invalid to additionally make sure it isn't used

                eslint = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const file = getFixturePath("cli-engine", "console.js");

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should exist");

                await eslint.lintFiles([file]);

                assert(!shell.test("-f", cacheFilePath), "the cache for eslint should have been deleted");
            });

            it("should use the specified cache file", async () => {
                cacheFilePath = path.resolve(".cache/custom-cache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new ESLint({
                    useEslintrc: false,

                    // specify a custom cache file
                    cacheLocation: cacheFilePath,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    cwd: path.join(fixtureDir, "..")
                });
                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const result = await eslint.lintFiles([badFile, goodFile]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                const fileCache = fCache.createFromFile(cacheFilePath);
                const { cache } = fileCache;

                assert(typeof cache.getKey(goodFile) === "object", "the entry for the good file should have been in the cache");
                assert(typeof cache.getKey(badFile) === "object", "the entry for the bad file should have been in the cache");

                const cachedResult = await eslint.lintFiles([badFile, goodFile]);

                assert.deepStrictEqual(result, cachedResult, "result should be the same with or without cache");
            });

            describe("cacheStrategy", () => {
                it("should detect changes using a file's modification time when set to 'metadata'", async () => {
                    cacheFilePath = getFixturePath(".eslintcache");
                    doDelete(cacheFilePath);
                    assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "metadata",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        extensions: ["js"]
                    });
                    const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                    const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));

                    await eslint.lintFiles([badFile, goodFile]);
                    let fileCache = fCache.createFromFile(cacheFilePath);
                    const entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} should have been initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheFilePath);
                    assert(fileCache.getFileDescriptor(badFile).changed === false, `the entry for ${badFile} should have been unchanged`);
                    assert(fileCache.getFileDescriptor(goodFile).changed === true, `the entry for ${goodFile} should have been changed`);
                });

                it("should not detect changes using a file's modification time when set to 'content'", async () => {
                    cacheFilePath = getFixturePath(".eslintcache");
                    doDelete(cacheFilePath);
                    assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "content",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        extensions: ["js"]
                    });
                    const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                    const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));

                    await eslint.lintFiles([badFile, goodFile]);
                    let fileCache = fCache.createFromFile(cacheFilePath, true);
                    let entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} should have been initially unchanged`);
                    });

                    // this should NOT result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheFilePath, true);
                    entries = fileCache.normalizeEntries([badFile, goodFile]);
                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} should have remained unchanged`);
                    });
                });

                it("should detect changes using a file's contents when set to 'content'", async () => {
                    cacheFilePath = getFixturePath(".eslintcache");
                    doDelete(cacheFilePath);
                    assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                    eslint = new ESLint({
                        cwd: path.join(fixtureDir, ".."),
                        useEslintrc: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "content",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        },
                        extensions: ["js"]
                    });
                    const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                    const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                    const goodFileCopy = path.resolve(`${path.dirname(goodFile)}`, "test-file-copy.js");

                    shell.cp(goodFile, goodFileCopy);

                    await eslint.lintFiles([badFile, goodFileCopy]);
                    let fileCache = fCache.createFromFile(cacheFilePath, true);
                    const entries = fileCache.normalizeEntries([badFile, goodFileCopy]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} should have been initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.sed("-i", "abc", "xzy", goodFileCopy);
                    fileCache = fCache.createFromFile(cacheFilePath, true);
                    assert(fileCache.getFileDescriptor(badFile).changed === false, `the entry for ${badFile} should have been unchanged`);
                    assert(fileCache.getFileDescriptor(goodFileCopy).changed === true, `the entry for ${goodFileCopy} should have been changed`);
                });
            });
        });

        describe("processors", () => {
            it("should return two messages when executing with config file that specifies a processor", async () => {
                eslint = eslintWithPlugins({
                    overrideConfigFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
            });

            it("should return two messages when executing with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test-processor"],
                        rules: {
                            "no-console": 2,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, ".."),
                    plugins: {
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
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
            });

            it("should run processors when calling lintFiles with config file that specifies a processor", async () => {
                eslint = eslintWithPlugins({
                    overrideConfigFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintFiles with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test-processor"],
                        rules: {
                            "no-console": 2,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, ".."),
                    plugins: {
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
                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintText with config file that specifies a processor", async () => {
                eslint = eslintWithPlugins({
                    overrideConfigFile: getFixturePath("configurations", "processors.json"),
                    useEslintrc: false,
                    extensions: ["js", "txt"],
                    ignore: false
                });
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintText with config file that specifies preloaded processor", async () => {
                eslint = new ESLint({
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test-processor"],
                        rules: {
                            "no-console": 2,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js", "txt"],
                    ignore: false,
                    plugins: {
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
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintText with processor resolves same extension but different content correctly", async () => {
                let count = 0;

                eslint = new ESLint({
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test-processor"],
                        overrides: [{
                            files: ["**/*.txt/*.txt"],
                            rules: {
                                "no-console": 2,
                                "no-unused-vars": 2
                            }
                        }]
                    },
                    extensions: ["txt"],
                    ignore: false,
                    plugins: {
                        "test-processor": {
                            processors: {
                                ".txt": {
                                    preprocess(text) {
                                        count++;
                                        return [
                                            {

                                                // it will be run twice, and text will be as-is at the second time, then it will not run third time
                                                text: text.replace("a()", "b()"),
                                                filename: ".txt"
                                            }
                                        ];
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
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(count, 2);
                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
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


                it("should run in autofix mode when using a processor that supports autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        overrideConfig: {
                            plugins: ["test-processor"],
                            rules: {
                                semi: 2
                            }
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true,
                        plugins: {
                            "test-processor": {
                                processors: {
                                    ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                                }
                            }
                        }
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 0);
                    assert.strictEqual(results[0].output, "<script>foo;</script>");
                });

                it("should not run in autofix mode when using a processor that does not support autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        overrideConfig: {
                            plugins: ["test-processor"],
                            rules: {
                                semi: 2
                            }
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true,
                        plugins: {
                            "test-processor": { processors: { ".html": HTML_PROCESSOR } }
                        }
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 1);
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
                });

                it("should not run in autofix mode when `fix: true` is not provided, even if the processor supports autofixing", async () => {
                    eslint = new ESLint({
                        useEslintrc: false,
                        overrideConfig: {
                            plugins: ["test-processor"],
                            rules: {
                                semi: 2
                            }
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        plugins: {
                            "test-processor": {
                                processors: {
                                    ".html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR)
                                }
                            }
                        }
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 1);
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
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
                await assert.rejects(async () => {
                    await eslint.lintFiles(["non-exist.js"]);
                }, /No files matching 'non-exist\.js' were found\./u);
            });

            it("should throw if the directory exists and is empty", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["empty"]);
                }, /No files matching 'empty' were found\./u);
            });

            it("one glob pattern", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["non-exist/**/*.js"]);
                }, /No files matching 'non-exist\/\*\*\/\*\.js' were found\./u);
            });

            it("two files", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["aaa.js", "bbb.js"]);
                }, /No files matching 'aaa\.js' were found\./u);
            });

            it("a mix of an existing file and a non-existing file", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["console.js", "non-exist.js"]);
                }, /No files matching 'non-exist\.js' were found\./u);
            });
        });

        describe("overrides", () => {
            beforeEach(() => {
                eslint = new ESLint({
                    cwd: getFixturePath("cli-engine/overrides-with-dot"),
                    ignore: false
                });
            });

            it("should recognize dotfiles", async () => {
                const ret = await eslint.lintFiles([".test-target.js"]);

                assert.strictEqual(ret.length, 1);
                assert.strictEqual(ret[0].messages.length, 1);
                assert.strictEqual(ret[0].messages[0].ruleId, "no-unused-vars");
            });
        });

        describe("a config file setting should have higher priority than a shareable config file's settings always; https://github.com/eslint/eslint/issues/11510", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "eslint/11510"),
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
            });

            beforeEach(() => {
                eslint = new ESLint({ cwd: getPath() });
                return prepare();
            });

            afterEach(cleanup);

            it("should not report 'no-console' error.", async () => {
                const results = await eslint.lintFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
            });
        });

        describe("configs of plugin rules should be validated even if 'plugins' key doesn't exist; https://github.com/eslint/eslint/issues/11559", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: path.join(os.tmpdir(), "eslint/11559"),
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
            });

            beforeEach(() => {
                eslint = new ESLint({ cwd: getPath() });
                return prepare();
            });

            afterEach(cleanup);


            it("should throw fatal error.", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles("a.js");
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
                eslint = new ESLint({
                    cwd: getPath(),
                    fix: true,
                    fixTypes: ["problem"]
                });

                return prepare();
            });

            afterEach(cleanup);

            it("should not crash.", async () => {
                const results = await eslint.lintFiles("a.js");

                assert.strictEqual(results.length, 1);
                assert.deepStrictEqual(results[0].messages, []);
                assert.deepStrictEqual(results[0].output, "fixed;");
            });
        });

        describe("multiple processors", () => {
            const root = path.join(os.tmpdir(), "eslint/eslint/multiple-processors");
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
                cleanup = () => { };
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
                eslint = new ESLint({ cwd: teardown.getPath() });
                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
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
                eslint = new ESLint({ cwd: teardown.getPath(), fix: true });
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
                eslint = new ESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7);
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
                eslint = new ESLint({ cwd: teardown.getPath(), extensions: ["js", "html"], fix: true });
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
                eslint = new ESLint({ cwd: teardown.getPath(), extensions: ["js", "html"], fix: true });
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
                eslint = new ESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2);
                assert.strictEqual(results[0].messages[1].ruleId, "no-console");
                assert.strictEqual(results[0].messages[1].line, 7);
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
                eslint = new ESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["test.md"]);
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
                eslint = new ESLint({ cwd: teardown.getPath() });
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
                        resolvePluginsRelativeTo: path.join(cwd, "extends-plugin") // the directory of the config file.
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
                        resolvePluginsRelativeTo: path.join(cwd, "plugins") // the directory of the config file.
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


            it("should use the configured rules which are defined by '--rulesdir' option.", async () => {
                eslint = new ESLint({
                    cwd: getPath(),
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

                await teardown.prepare();
                cleanup = teardown.cleanup;

                eslint = new ESLint({ cwd: teardown.getPath() });
                const results = await eslint.lintFiles(["[ab].js"]);
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

                await teardown.prepare();
                cleanup = teardown.cleanup;
                eslint = new ESLint({ cwd: teardown.getPath() });
                const results = await eslint.lintFiles(["[ab].js"]);
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                const results = await eslint.lintFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml).");
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                const results = await eslint.lintFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config (.eslintrc.yml » eslint-config-foo).");
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                const results = await eslint.lintFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].severity, 1);
                assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
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

                    eslint = new ESLint({
                        cwd: teardown.getPath(),
                        reportUnusedDisableDirectives: "off"
                    });

                    const results = await eslint.lintFiles(["test.js"]);
                    const messages = results[0].messages;

                    assert.strictEqual(messages.length, 0);
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

                    eslint = new ESLint({
                        cwd: teardown.getPath(),
                        reportUnusedDisableDirectives: "error"
                    });

                    const results = await eslint.lintFiles(["test.js"]);
                    const messages = results[0].messages;

                    assert.strictEqual(messages.length, 1);
                    assert.strictEqual(messages[0].severity, 2);
                    assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
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

            it("should not throw.", async () => {
                eslint = new ESLint({ cwd: getPath() });
                const results = await eslint.lintFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].ruleId, "no-console");
            });
        });

        describe("don't ignore the entry directory.", () => {
            const root = getFixturePath("cli-engine/dont-ignore-entry-dir");

            let cleanup;

            beforeEach(() => {
                cleanup = () => { };
            });

            afterEach(async () => {
                await cleanup();

                const configFilePath = path.resolve(root, "../.eslintrc.json");

                if (shell.test("-e", configFilePath)) {
                    shell.rm(configFilePath);
                }
            });

            it("'lintFiles(\".\")' should not load config files from outside of \".\".", async () => {
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                // Don't throw "failed to load config file" error.
                await eslint.lintFiles(".");
            });

            it("'lintFiles(\".\")' should not ignore '.' even if 'ignorePatterns' contains it.", async () => {
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                // Don't throw "file not found" error.
                await eslint.lintFiles(".");
            });

            it("'lintFiles(\"subdir\")' should not ignore './subdir' even if 'ignorePatterns' contains it.", async () => {
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
                eslint = new ESLint({ cwd: teardown.getPath() });

                // Don't throw "file not found" error.
                await eslint.lintFiles("subdir");
            });
        });

        it("should throw if non-boolean value is given to 'options.warnIgnored' option", async () => {
            eslint = new ESLint();
            await assert.rejects(() => eslint.lintFiles(777), /'patterns' must be a non-empty string or an array of non-empty strings/u);
            await assert.rejects(() => eslint.lintFiles([null]), /'patterns' must be a non-empty string or an array of non-empty strings/u);
        });
    });

    describe("calculateConfigForFile", () => {
        it("should return the info from Config#getConfig when called", async () => {
            const options = {
                overrideConfigFile: getFixturePath("configurations", "quotes-error.json")
            };
            const engine = new ESLint(options);
            const filePath = getFixturePath("single-quoted.js");
            const actualConfig = await engine.calculateConfigForFile(filePath);
            const expectedConfig = new CascadingConfigArrayFactory({ specificConfigPath: options.overrideConfigFile })
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should return the config for a file that doesn't exist", async () => {
            const engine = new ESLint();
            const filePath = getFixturePath("does_not_exist.js");
            const existingSiblingFilePath = getFixturePath("single-quoted.js");
            const actualConfig = await engine.calculateConfigForFile(filePath);
            const expectedConfig = await engine.calculateConfigForFile(existingSiblingFilePath);

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should return the config for a virtual file that is a child of an existing file", async () => {
            const engine = new ESLint();
            const parentFileName = "single-quoted.js";
            const filePath = getFixturePath(parentFileName, "virtual.js"); // single-quoted.js/virtual.js
            const parentFilePath = getFixturePath(parentFileName);
            const actualConfig = await engine.calculateConfigForFile(filePath);
            const expectedConfig = await engine.calculateConfigForFile(parentFilePath);

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should return the config when run from within a subdir", async () => {
            const options = {
                cwd: getFixturePath("config-hierarchy", "root-true", "parent", "root", "subdir")
            };
            const engine = new ESLint(options);
            const filePath = getFixturePath("config-hierarchy", "root-true", "parent", "root", ".eslintrc");
            const actualConfig = await engine.calculateConfigForFile("./.eslintrc");
            const expectedConfig = new CascadingConfigArrayFactory(options)
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should throw an error if a directory path was given.", async () => {
            const engine = new ESLint();

            try {
                await engine.calculateConfigForFile(".");
            } catch (error) {
                assert.strictEqual(error.messageTemplate, "print-config-with-directory-path");
                return;
            }
            assert.fail("should throw an error");
        });

        it("should throw if non-string value is given to 'filePath' parameter", async () => {
            const eslint = new ESLint();

            await assert.rejects(() => eslint.calculateConfigForFile(null), /'filePath' must be a non-empty string/u);
        });

        // https://github.com/eslint/eslint/issues/13793
        it("should throw with an invalid built-in rule config", async () => {
            const options = {
                baseConfig: {
                    rules: {
                        "no-alert": ["error", {
                            thisDoesNotExist: true
                        }]
                    }
                }
            };
            const engine = new ESLint(options);
            const filePath = getFixturePath("single-quoted.js");

            await assert.rejects(
                () => engine.calculateConfigForFile(filePath),
                /Configuration for rule "no-alert" is invalid:/u
            );
        });
    });

    describe("isPathIgnored", () => {
        it("should check if the given path is ignored", async () => {
            const engine = new ESLint({
                ignorePath: getFixturePath(".eslintignore2"),
                cwd: getFixturePath()
            });

            assert(await engine.isPathIgnored("undef.js"));
            assert(!await engine.isPathIgnored("passing.js"));
        });

        it("should return false if ignoring is disabled", async () => {
            const engine = new ESLint({
                ignore: false,
                ignorePath: getFixturePath(".eslintignore2"),
                cwd: getFixturePath()
            });

            assert(!await engine.isPathIgnored("undef.js"));
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should return true for default ignores even if ignoring is disabled", async () => {
            const engine = new ESLint({
                ignore: false,
                cwd: getFixturePath("cli-engine")
            });

            assert(await engine.isPathIgnored("node_modules/foo.js"));
        });

        describe("about the default ignore patterns", () => {
            it("should always apply defaultPatterns if ignore option is true", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should still apply defaultPatterns if ignore option is is false", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ ignore: false, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({
                    cwd,
                    overrideConfig: {
                        ignorePatterns: "!/node_modules/package"
                    }
                });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js")));
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePath", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd, ignorePath: getFixturePath("ignored-paths", ".eslintignoreWithUnignoredDefaults") });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js")));
            });

            it("should ignore dotfiles", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".foo")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar")));
            });

            it("should ignore directories beginning with a dot", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".foo/bar")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar/baz")));
            });

            it("should still ignore dotfiles when ignore option disabled", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ ignore: false, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".foo")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar")));
            });

            it("should still ignore directories beginning with a dot when ignore option disabled", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ ignore: false, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".foo/bar")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/.bar/baz")));
            });

            it("should not ignore absolute paths containing '..'", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                assert(!await engine.isPathIgnored(`${getFixturePath("ignored-paths", "foo")}/../unignored.js`));
            });

            it("should ignore /node_modules/ relative to .eslintignore when loaded", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ ignorePath: getFixturePath("ignored-paths", ".eslintignore"), cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "existing.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo", "node_modules", "existing.js")));
            });

            it("should ignore /node_modules/ relative to cwd without an .eslintignore", async () => {
                const cwd = getFixturePath("ignored-paths", "no-ignore-file");
                const engine = new ESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "node_modules", "existing.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "foo", "node_modules", "existing.js")));
            });
        });

        describe("with no .eslintignore file", () => {
            it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", async () => {
                const cwd = getFixturePath("ignored-paths", "configurations");
                const engine = new ESLint({ cwd });

                // an .eslintignore in parent directories includes `*.js`, but don't load it.
                assert(!await engine.isPathIgnored("foo.js"));
                assert(await engine.isPathIgnored("node_modules/foo.js"));
            });

            it("should return false for files outside of the cwd (with no ignore file provided)", async () => {

                // Default ignore patterns should not inadvertently ignore files in parent directories
                const engine = new ESLint({ cwd: getFixturePath("ignored-paths", "no-ignore-file") });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });
        });

        describe("with .eslintignore file or package.json file", () => {
            it("should load .eslintignore from cwd when explicitly passed", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                // `${cwd}/.eslintignore` includes `sampleignorepattern`.
                assert(await engine.isPathIgnored("sampleignorepattern"));
            });

            it("should use package.json's eslintIgnore files if no specified .eslintignore file", async () => {
                const cwd = getFixturePath("ignored-paths", "package-json-ignore");
                const engine = new ESLint({ cwd });

                assert(await engine.isPathIgnored("hello.js"));
                assert(await engine.isPathIgnored("world.js"));
            });

            it("should use correct message template if failed to parse package.json", () => {
                const cwd = getFixturePath("ignored-paths", "broken-package-json");

                assert.throws(() => {
                    try {
                        // eslint-disable-next-line no-new -- Check for error
                        new ESLint({ cwd });
                    } catch (error) {
                        assert.strictEqual(error.messageTemplate, "failed-to-read-json");
                        throw error;
                    }
                });
            });

            it("should not use package.json's eslintIgnore files if specified .eslintignore file", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ cwd });

                /*
                 * package.json includes `hello.js` and `world.js`.
                 * .eslintignore includes `sampleignorepattern`.
                 */
                assert(!await engine.isPathIgnored("hello.js"));
                assert(!await engine.isPathIgnored("world.js"));
                assert(await engine.isPathIgnored("sampleignorepattern"));
            });

            it("should error if package.json's eslintIgnore is not an array of file paths", () => {
                const cwd = getFixturePath("ignored-paths", "bad-package-json-ignore");

                assert.throws(() => {
                    // eslint-disable-next-line no-new -- Check for throwing
                    new ESLint({ cwd });
                }, /Package\.json eslintIgnore property requires an array of paths/u);
            });
        });

        describe("with --ignore-pattern option", () => {
            it("should accept a string for options.ignorePattern", async () => {
                const cwd = getFixturePath("ignored-paths", "ignore-pattern");
                const engine = new ESLint({
                    overrideConfig: {
                        ignorePatterns: "ignore-me.txt"
                    },
                    cwd
                });

                assert(await engine.isPathIgnored("ignore-me.txt"));
            });

            it("should accept an array for options.ignorePattern", async () => {
                const engine = new ESLint({
                    overrideConfig: {
                        ignorePatterns: ["a", "b"]
                    },
                    useEslintrc: false
                });

                assert(await engine.isPathIgnored("a"));
                assert(await engine.isPathIgnored("b"));
                assert(!await engine.isPathIgnored("c"));
            });

            it("should return true for files which match an ignorePattern even if they do not exist on the filesystem", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({
                    overrideConfig: {
                        ignorePatterns: "not-a-file"
                    },
                    cwd
                });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "not-a-file")));
            });

            it("should return true for file matching an ignore pattern exactly", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "undef.js" }, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file matching an invalid ignore pattern with leading './'", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "./undef.js" }, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file in subfolder of cwd matching an ignore pattern with leading '/'", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "/undef.js" }, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir", "undef.js")));
            });

            it("should return true for file matching a child of an ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "ignore-pattern" }, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "ignore-me.txt")));
            });

            it("should return true for file matching a grandchild of an ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "ignore-pattern" }, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "subdir", "ignore-me.txt")));
            });

            it("should return false for file not matching any ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "failing.js" }, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "unignored.js")));
            });

            it("two globstar '**' ignore pattern should ignore files in nested directories", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({ overrideConfig: { ignorePatterns: "**/*.js" }, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.js")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.j2")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.j2")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.j2")));
            });
        });

        describe("with --ignore-path option", () => {
            it("initialization with ignorePath should work when cwd is a parent directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("custom-name/foo.js"));
            });

            it("initialization with ignorePath should work when the file is in the cwd", async () => {
                const cwd = getFixturePath("ignored-paths", "custom-name");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("foo.js"));
            });

            it("initialization with ignorePath should work when cwd is a subdirectory", async () => {
                const cwd = getFixturePath("ignored-paths", "custom-name", "subdirectory");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("../custom-name/foo.js"));
            });

            it("initialization with invalid file should throw error", () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "not-a-directory", ".foobaz");

                assert.throws(() => {
                    // eslint-disable-next-line no-new -- Check for throwing
                    new ESLint({ ignorePath, cwd });
                }, /Cannot read \.eslintignore file/u);
            });

            it("should return false for files outside of ignorePath's directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new ESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should resolve relative paths from CWD", async () => {
                const cwd = getFixturePath("ignored-paths", "subdir");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should resolve relative paths from CWD when it's in a child directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new ESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/foo.js")));

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/bar.js")));
            });

            it("should resolve relative paths from CWD when it contains negated globs", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("subdir/blah.txt"));
                assert(await engine.isPathIgnored("blah.txt"));
                assert(await engine.isPathIgnored("subdir/bar.txt"));
                assert(!await engine.isPathIgnored("bar.txt"));
                assert(!await engine.isPathIgnored("subdir/baz.txt"));
                assert(!await engine.isPathIgnored("baz.txt"));
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a subdirectory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a parent directory", async () => {
                const cwd = getFixturePath("ignored-paths", "subdir");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should handle .eslintignore which contains CRLF correctly.", async () => {
                const ignoreFileContent = fs.readFileSync(getFixturePath("ignored-paths", "crlf/.eslintignore"), "utf8");

                assert(ignoreFileContent.includes("\r"), "crlf/.eslintignore should contains CR.");
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "crlf/.eslintignore");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide1/a.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide2/a.js")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide3/a.js")));
            });

            it("should not include comments in ignore rules", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithComments");
                const engine = new ESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored("# should be ignored"));
                assert(await engine.isPathIgnored("this_one_not"));
            });

            it("should ignore a non-negated pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new ESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "ignore.js")));
            });

            it("should not ignore a negated pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new ESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "unignore.js")));
            });

            // https://github.com/eslint/eslint/issues/15642
            it("should correctly handle patterns with escaped brackets", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithEscapedBrackets");
                const engine = new ESLint({ ignorePath, cwd });

                const subdir = "brackets";

                assert(
                    !await engine.isPathIgnored(getFixturePath("ignored-paths", subdir, "index.js")),
                    `'${subdir}/index.js' should not be ignored`
                );

                for (const filename of ["[index.js", "index].js", "[index].js"]) {
                    assert(
                        await engine.isPathIgnored(getFixturePath("ignored-paths", subdir, filename)),
                        `'${subdir}/${filename}' should be ignored`
                    );
                }

            });
        });

        describe("with --ignore-path option and --ignore-pattern option", () => {
            it("should return false for ignored file when unignored with ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new ESLint({
                    ignorePath: getFixturePath("ignored-paths", ".eslintignore"),
                    overrideConfig: {
                        ignorePatterns: "!sampleignorepattern"
                    },
                    cwd
                });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "sampleignorepattern")));
            });
        });

        it("should throw if non-string value is given to 'filePath' parameter", async () => {
            const eslint = new ESLint();

            await assert.rejects(() => eslint.isPathIgnored(null), /'filePath' must be a non-empty string/u);
        });
    });

    describe("loadFormatter()", () => {
        it("should return a formatter object when a bundled formatter is requested", async () => {
            const engine = new ESLint();
            const formatter = await engine.loadFormatter("compact");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when no argument is passed", async () => {
            const engine = new ESLint();
            const formatter = await engine.loadFormatter();

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a custom formatter is requested", async () => {
            const engine = new ESLint();
            const formatter = await engine.loadFormatter(getFixturePath("formatters", "simple.js"));

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a custom formatter is requested, also if the path has backslashes", async () => {
            const engine = new ESLint({
                cwd: path.join(fixtureDir, "..")
            });
            const formatter = await engine.loadFormatter(".\\fixtures\\formatters\\simple.js");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter prefixed with eslint-formatter is requested", async () => {
            const engine = new ESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("bar");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested, also when the eslint-formatter prefix is included in the format argument", async () => {
            const engine = new ESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("eslint-formatter-bar");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested within a scoped npm package", async () => {
            const engine = new ESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("@somenamespace/foo");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested within a scoped npm package, also when the eslint-formatter prefix is included in the format argument", async () => {
            const engine = new ESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("@somenamespace/eslint-formatter-foo");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should throw if a custom formatter doesn't exist", async () => {
            const engine = new ESLint();
            const formatterPath = getFixturePath("formatters", "doesntexist.js");
            const fullFormatterPath = path.resolve(formatterPath);

            await assert.rejects(async () => {
                await engine.loadFormatter(formatterPath);
            }, new RegExp(escapeStringRegExp(`There was a problem loading formatter: ${fullFormatterPath}\nError: Cannot find module '${fullFormatterPath}'`), "u"));
        });

        it("should throw if a built-in formatter doesn't exist", async () => {
            const engine = new ESLint();
            const fullFormatterPath = path.resolve(__dirname, "../../../lib/cli-engine/formatters/special");

            await assert.rejects(async () => {
                await engine.loadFormatter("special");
            }, new RegExp(escapeStringRegExp(`There was a problem loading formatter: ${fullFormatterPath}\nError: Cannot find module '${fullFormatterPath}'`), "u"));
        });

        it("should throw if the required formatter exists but has an error", async () => {
            const engine = new ESLint();
            const formatterPath = getFixturePath("formatters", "broken.js");

            await assert.rejects(async () => {
                await engine.loadFormatter(formatterPath);
            }, new RegExp(escapeStringRegExp(`There was a problem loading formatter: ${formatterPath}\nError: Cannot find module 'this-module-does-not-exist'`), "u"));
        });

        it("should throw if a non-string formatter name is passed", async () => {
            const engine = new ESLint();

            await assert.rejects(async () => {
                await engine.loadFormatter(5);
            }, /'name' must be a string/u);
        });

        it("should pass cwd to the `cwd` property of the second argument.", async () => {
            const cwd = getFixturePath();
            const engine = new ESLint({ cwd });
            const formatterPath = getFixturePath("formatters", "cwd.js");
            const formatter = await engine.loadFormatter(formatterPath);

            assert.strictEqual(formatter.format([]), cwd);
        });
    });

    describe("getErrorResults()", () => {
        it("should report 5 error messages when looking for errors only", async () => {
            process.chdir(originalDir);
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
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
            const results = await engine.lintText("var foo = 'bar';");
            const errorResults = ESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 5);
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
        });

        it("should not mutate passed report parameter", async () => {
            process.chdir(originalDir);
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        quotes: [1, "double"],
                        "no-var": 2
                    }
                }
            });
            const results = await engine.lintText("var foo = 'bar';");
            const reportResultsLength = results[0].messages.length;

            assert.strictEqual(results[0].messages.length, 2);

            ESLint.getErrorResults(results);

            assert.strictEqual(results[0].messages.length, reportResultsLength);
        });

        it("should report a warningCount of 0 when looking for errors only", async () => {
            process.chdir(originalDir);
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
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
            const results = await engine.lintText("var foo = 'bar';");
            const errorResults = ESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].warningCount, 0);
            assert.strictEqual(errorResults[0].fixableWarningCount, 0);
        });

        it("should return 0 error or warning messages even when the file has warnings", async () => {
            const engine = new ESLint({
                ignorePath: path.join(fixtureDir, ".eslintignore"),
                cwd: path.join(fixtureDir, "..")
            });
            const options = {
                filePath: "fixtures/passing.js",
                warnIgnored: true
            };
            const results = await engine.lintText("var bar = foo;", options);
            const errorReport = ESLint.getErrorResults(results);

            assert.strictEqual(errorReport.length, 0);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should return source code of file in the `source` property", async () => {
            process.chdir(originalDir);
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: { quotes: [2, "double"] }
                }
            });
            const results = await engine.lintText("var foo = 'bar';");
            const errorResults = ESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 1);
            assert.strictEqual(errorResults[0].source, "var foo = 'bar';");
        });

        it("should contain `output` property after fixes", async () => {
            process.chdir(originalDir);
            const engine = new ESLint({
                useEslintrc: false,
                fix: true,
                overrideConfig: {
                    rules: {
                        semi: 2,
                        "no-console": 2
                    }
                }
            });
            const results = await engine.lintText("console.log('foo')");
            const errorResults = ESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 1);
            assert.strictEqual(errorResults[0].output, "console.log('foo');");
        });
    });

    describe("getRulesMetaForResults()", () => {
        it("should return empty object when there are no linting errors", async () => {
            const engine = new ESLint({
                useEslintrc: false
            });

            const rulesMeta = engine.getRulesMetaForResults([]);

            assert.deepStrictEqual(rulesMeta, {});
        });

        it("should return one rule meta when there is a linting error", async () => {
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const results = await engine.lintText("a");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(Object.keys(rulesMeta).length, 1);
            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
        });

        it("should return one rule meta when there is a suppressed linting error", async () => {
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const results = await engine.lintText("a // eslint-disable-line semi");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(Object.keys(rulesMeta).length, 1);
            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
        });

        it("should return multiple rule meta when there are multiple linting errors", async () => {
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    rules: {
                        semi: 2,
                        quotes: [2, "double"]
                    }
                }
            });

            const results = await engine.lintText("'a'");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
            assert.strictEqual(rulesMeta.quotes, coreRules.get("quotes").meta);
        });

        it("should return multiple rule meta when there are multiple linting errors from a plugin", async () => {
            const customPlugin = {
                rules: {
                    "no-var": require("../../../lib/rules/no-var")
                }
            };

            const engine = new ESLint({
                useEslintrc: false,
                plugins: {
                    "custom-plugin": customPlugin
                },
                overrideConfig: {
                    plugins: ["custom-plugin"],
                    rules: {
                        "custom-plugin/no-var": 2,
                        semi: 2,
                        quotes: [2, "double"]
                    }
                }
            });

            const results = await engine.lintText("var foo = 0; var bar = '1'");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
            assert.strictEqual(rulesMeta.quotes, coreRules.get("quotes").meta);
            assert.strictEqual(
                rulesMeta["custom-plugin/no-var"],
                customPlugin.rules["no-var"].meta
            );
        });

        it("should ignore messages not related to a rule", async () => {
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: {
                    ignorePatterns: "ignored.js",
                    rules: {
                        "no-var": "warn"
                    }
                },
                reportUnusedDisableDirectives: "warn"
            });

            {
                const results = await engine.lintText("syntax error");
                const rulesMeta = engine.getRulesMetaForResults(results);

                assert.deepStrictEqual(rulesMeta, {});
            }
            {
                const results = await engine.lintText("// eslint-disable-line no-var");
                const rulesMeta = engine.getRulesMetaForResults(results);

                assert.deepStrictEqual(rulesMeta, {});
            }
            {
                const results = await engine.lintText("", { filePath: "ignored.js", warnIgnored: true });
                const rulesMeta = engine.getRulesMetaForResults(results);

                assert.deepStrictEqual(rulesMeta, {});
            }
        });

        it("should return a non-empty value if some of the messages are related to a rule", async () => {
            const engine = new ESLint({
                useEslintrc: false,
                overrideConfig: { rules: { "no-var": "warn" } },
                reportUnusedDisableDirectives: "warn"
            });

            const results = await engine.lintText("// eslint-disable-line no-var\nvar foo;");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.deepStrictEqual(rulesMeta, { "no-var": coreRules.get("no-var").meta });
        });
    });

    describe("outputFixes()", () => {
        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should call fs.writeFile() for each result with output", async () => {
            const fakeFS = {
                writeFile: sinon.spy(callLastArgument)
            };
            const spy = fakeFS.writeFile;
            const { ESLint: localESLint } = proxyquire("../../../lib/eslint/eslint", {
                fs: fakeFS
            });

            const results = [
                {
                    filePath: path.resolve("foo.js"),
                    output: "bar"
                },
                {
                    filePath: path.resolve("bar.js"),
                    output: "baz"
                }
            ];

            await localESLint.outputFixes(results);

            assert.strictEqual(spy.callCount, 2);
            assert(spy.firstCall.calledWithExactly(path.resolve("foo.js"), "bar", sinon.match.func), "First call was incorrect.");
            assert(spy.secondCall.calledWithExactly(path.resolve("bar.js"), "baz", sinon.match.func), "Second call was incorrect.");
        });

        it("should call fs.writeFile() for each result with output and not at all for a result without output", async () => {
            const fakeFS = {
                writeFile: sinon.spy(callLastArgument)
            };
            const spy = fakeFS.writeFile;
            const { ESLint: localESLint } = proxyquire("../../../lib/eslint/eslint", {
                fs: fakeFS
            });
            const results = [
                {
                    filePath: path.resolve("foo.js"),
                    output: "bar"
                },
                {
                    filePath: path.resolve("abc.js")
                },
                {
                    filePath: path.resolve("bar.js"),
                    output: "baz"
                }
            ];

            await localESLint.outputFixes(results);

            assert.strictEqual(spy.callCount, 2);
            assert(spy.firstCall.calledWithExactly(path.resolve("foo.js"), "bar", sinon.match.func), "First call was incorrect.");
            assert(spy.secondCall.calledWithExactly(path.resolve("bar.js"), "baz", sinon.match.func), "Second call was incorrect.");
        });

        it("should throw if non object array is given to 'results' parameter", async () => {
            await assert.rejects(() => ESLint.outputFixes(null), /'results' must be an array/u);
            await assert.rejects(() => ESLint.outputFixes([null]), /'results' must include only objects/u);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is disabled", () => {
        it("should report a violation for disabling rules", async () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                ignore: true,
                useEslintrc: false,
                allowInlineConfig: false,
                overrideConfig: {
                    env: { browser: true },
                    rules: {
                        "eol-last": 0,
                        "no-alert": 1,
                        "no-trailing-spaces": 0,
                        strict: 0,
                        quotes: 0
                    }
                }
            };
            const eslintCLI = new ESLint(config);
            const results = await eslintCLI.lintText(code);
            const messages = results[0].messages;

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
        });

        it("should not report a violation by default", async () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                ignore: true,
                useEslintrc: false,
                allowInlineConfig: true,
                overrideConfig: {
                    env: { browser: true },
                    rules: {
                        "eol-last": 0,
                        "no-alert": 1,
                        "no-trailing-spaces": 0,
                        strict: 0,
                        quotes: 0
                    }
                }
            };
            const eslintCLI = new ESLint(config);
            const results = await eslintCLI.lintText(code);
            const messages = results[0].messages;

            assert.strictEqual(messages.length, 0);
        });
    });

    describe("when evaluating code when reportUnusedDisableDirectives is enabled", () => {
        it("should report problems for unused eslint-disable directives", async () => {
            const eslint = new ESLint({ useEslintrc: false, reportUnusedDisableDirectives: "error" });

            assert.deepStrictEqual(
                await eslint.lintText("/* eslint-disable */"),
                [
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
                        source: "/* eslint-disable */",
                        usedDeprecatedRules: []
                    }
                ]
            );
        });
    });

    describe("when retrieving version number", () => {
        it("should return current version number", () => {
            const eslintCLI = require("../../../lib/eslint").ESLint;
            const version = eslintCLI.version;

            assert.strictEqual(typeof version, "string");
            assert(parseInt(version[0], 10) >= 3);
        });
    });

    describe("mutability", () => {
        describe("plugins", () => {
            it("Loading plugin in one instance doesn't mutate to another instance", async () => {
                const filePath = getFixturePath("single-quoted.js");
                const engine1 = eslintWithPlugins({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["example"],
                        rules: { "example/example-rule": 1 }
                    }
                });
                const engine2 = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });
                const fileConfig1 = await engine1.calculateConfigForFile(filePath);
                const fileConfig2 = await engine2.calculateConfigForFile(filePath);

                // plugin
                assert.deepStrictEqual(fileConfig1.plugins, ["example"], "Plugin is present for engine 1");
                assert.deepStrictEqual(fileConfig2.plugins, [], "Plugin is not present for engine 2");
            });
        });

        describe("rules", () => {
            it("Loading rules in one instance doesn't mutate to another instance", async () => {
                const filePath = getFixturePath("single-quoted.js");
                const engine1 = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false,
                    overrideConfig: { rules: { "example/example-rule": 1 } }
                });
                const engine2 = new ESLint({
                    cwd: path.join(fixtureDir, ".."),
                    useEslintrc: false
                });
                const fileConfig1 = await engine1.calculateConfigForFile(filePath);
                const fileConfig2 = await engine2.calculateConfigForFile(filePath);

                // plugin
                assert.deepStrictEqual(fileConfig1.rules["example/example-rule"], [1], "example is present for engine 1");
                assert.strictEqual(fileConfig2.rules["example/example-rule"], void 0, "example is not present for engine 2");
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'lintFiles()' should not verify 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for '/bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'lintFiles()' should not verify 'foo.js' and '/bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/index.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/index.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/foo/.dot.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/.dot.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/bar/index.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/bar/index.js"), true);
            });

            it("'lintFiles()' should verify 'node_modules/foo/index.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'false' for '.eslintrc.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored(".eslintrc.js"), false);
            });

            it("'lintFiles()' should verify '.eslintrc.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for re-ignored '.foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored(".foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for unignored '.bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored(".bar.js"), false);
            });

            it("'lintFiles()' should not verify re-ignored '.foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'false' for unignored 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for ignored 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), true);
            });

            it("'lintFiles()' should verify unignored 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/subsubdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in 'subdir'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/subsubdir/bar.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the outside of 'subdir'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
            });

            it("'lintFiles()' should verify 'bar.js' in the outside of 'subdir'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js' in the root directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'foo.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'lintFiles()' should verify 'foo.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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
                    ".eslintrc.json": JSON.stringify({}),
                    "subdir/.eslintrc.json": JSON.stringify({
                        ignorePatterns: "*.js"
                    }),
                    ".eslintignore": "!foo.js",
                    "foo.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for unignored 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), false);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for ignored 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'lintFiles()' should verify unignored 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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
                    ".eslintrc.json": JSON.stringify({
                        ignorePatterns: "foo.js"
                    }),
                    "subdir/.eslintrc.json": JSON.stringify({
                        root: true,
                        ignorePatterns: "bar.js"
                    }),
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js' in the root directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the root directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
            });

            it("'isPathIgnored()' should return 'false' for 'foo.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'lintFiles()' should verify 'bar.js' in the root directory and 'foo.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js' in the root directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'bar.js' in the child directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), true);
            });

            it("'lintFiles()' should verify 'bar.js' in the root directory.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
            });

            it("'lintFiles()' should verify 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'subdir/foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), false);
            });

            it("'lintFiles()' should verify 'subdir/foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
            });

            it("'lintFiles()' should verify 'bar.js'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'isPathIgnored()' should return 'false' for 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath(), ignore: false });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), false);
            });

            it("'lintFiles()' should verify 'foo.js'.", async () => {
                const engine = new ESLint({ cwd: getPath(), ignore: false });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("should throw a configuration error.", async () => {
                await assert.rejects(async () => {
                    const engine = new ESLint({ cwd: getPath() });

                    await engine.lintFiles("*.js");
                }, /Unexpected top-level property "overrides\[0\]\.ignorePatterns"/u);
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

            it("'lintFiles()' with a directory path should contain 'foo/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar/test.js"),
                    path.join(root, "foo/test.js"),
                    path.join(root, "foo/test.txt"),
                    path.join(root, "test.js")
                ]);
            });

            it("'lintFiles()' with a glob pattern '*.js' should not contain 'foo/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
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

            it("'lintFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
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

            it("'lintFiles()' with a directory path should NOT contain 'foo/test.txt' and 'foo/nested/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
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

            it("'lintFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
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

            it("'lintFiles()' with a directory path should contain 'foo/test.txt' and 'foo/nested/test.txt'.", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
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
                    "node_modules/myconf/.eslintrc.json": {
                        overrides: [
                            {
                                files: "foo/*.js",
                                rules: {
                                    eqeqeq: "error"
                                }
                            }
                        ]
                    },
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'lintFiles()' with 'foo/test.js' should use the override entry.", async () => {
                const engine = new ESLint({
                    overrideConfigFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    ignore: false,
                    useEslintrc: false
                });
                const results = await engine.lintFiles("foo/test.js");

                // Expected to be an 'eqeqeq' error because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 1,
                        filePath: path.join(getPath(), "foo/test.js"),
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
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'node_modules/myconf/foo/test.js' should NOT use the override entry.", async () => {
                const engine = new ESLint({
                    overrideConfigFile: "node_modules/myconf/.eslintrc.json",
                    cwd: root,
                    ignore: false,
                    useEslintrc: false
                });
                const results = await engine.lintFiles("node_modules/myconf/foo/test.js");

                // Expected to be no errors because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 0,
                        filePath: path.join(getPath(), "node_modules/myconf/foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [],
                        suppressedMessages: [],
                        usedDeprecatedRules: [],
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

            it("'lintFiles()' with 'foo/test.js' should NOT use the override entry.", async () => {
                const engine = new ESLint({
                    overrideConfigFile: "node_modules/myconf/.eslintrc.json",
                    cwd: root,
                    ignore: false,
                    useEslintrc: false
                });
                const results = await engine.lintFiles("foo/test.js");

                // Expected to be no errors because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 0,
                        filePath: path.join(getPath(), "foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [],
                        suppressedMessages: [],
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'node_modules/myconf/foo/test.js' should use the override entry.", async () => {
                const engine = new ESLint({
                    overrideConfigFile: "node_modules/myconf/.eslintrc.json",
                    cwd: root,
                    ignore: false,
                    useEslintrc: false
                });
                const results = await engine.lintFiles("node_modules/myconf/foo/test.js");

                // Expected to be an 'eqeqeq' error because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        errorCount: 1,
                        filePath: path.join(getPath(), "node_modules/myconf/foo/test.js"),
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
                        usedDeprecatedRules: [],
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

            it("'lintFiles()' with '**/*.js' should iterate 'node_modules/myconf/foo/test.js' but not 'foo/test.js'.", async () => {
                const engine = new ESLint({
                    overrideConfigFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath(),
                    useEslintrc: false
                });
                const files = (await engine.lintFiles("**/*.js"))
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
         * @param {() => Promise<any>} f The function to run and throw.
         * @param {Record<string, any>} props The properties to verify.
         * @returns {Promise<void>} void
         */
        async function assertThrows(f, props) {
            try {
                await f();
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file.)", async () => {
                const engine = new ESLint({ cwd: getPath() });

                await engine.lintFiles("test.js");
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file.)", async () => {
                const engine = new ESLint({ cwd: getPath() });

                await engine.lintFiles("test.js");
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files, but node_modules directory is unique.)", async () => {
                const engine = new ESLint({ cwd: getPath() });

                await engine.lintFiles("subdir/test.js");
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

            it("'lintFiles()' should throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files.)", async () => {
                const engine = new ESLint({ cwd: getPath() });

                await assertThrows(
                    () => engine.lintFiles("subdir/test.js"),
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files, but node_modules directory is unique.)", async () => {
                const engine = new ESLint({
                    cwd: getPath(),
                    overrideConfigFile: "node_modules/mine/.eslintrc.json"
                });

                await engine.lintFiles("test.js");
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

            it("'lintFiles()' should throw plugin-conflict error. (Load the plugin from the base directory of the entry config file, but there are two entry config files.)", async () => {
                const engine = new ESLint({
                    cwd: getPath(),
                    overrideConfigFile: "node_modules/mine/.eslintrc.json"
                });

                await assertThrows(
                    () => engine.lintFiles("test.js"),
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from both CWD and the base directory of the entry config file, but node_modules directory is unique.)", async () => {
                const engine = new ESLint({
                    cwd: getPath(),
                    overrideConfig: { plugins: ["foo"] }
                });

                await engine.lintFiles("subdir/test.js");
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

            it("'lintFiles()' should throw plugin-conflict error. (Load the plugin from both CWD and the base directory of the entry config file.)", async () => {
                const engine = new ESLint({
                    cwd: getPath(),
                    overrideConfig: { plugins: ["foo"] }
                });

                await assertThrows(
                    () => engine.lintFiles("subdir/test.js"),
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from '--resolve-plugins-relative-to'.)", async () => {
                const engine = new ESLint({
                    cwd: getPath(),
                    resolvePluginsRelativeTo: getPath()
                });

                await engine.lintFiles("subdir/test.js");
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

            it("'lintFiles()' should NOT throw plugin-conflict error. (Load the plugin from the base directory of the entry config file for each target file. Not related to each other.)", async () => {
                const engine = new ESLint({ cwd: getPath() });
                const results = await engine.lintFiles("*/test.js");

                assert.strictEqual(results.length, 2);
            });
        });
    });

    describe("loading rules", () => {
        it("should not load unused core rules", done => {
            let calledDone = false;

            const cwd = getFixturePath("lazy-loading-rules");
            const pattern = "foo.js";
            const usedRules = ["semi"];

            const forkedProcess = childProcess.fork(
                path.join(__dirname, "../../_utils/test-lazy-loading-rules.js"),
                [cwd, pattern, String(usedRules)]
            );

            // this is an error message
            forkedProcess.on("message", ({ message, stack }) => {
                if (calledDone) {
                    return;
                }
                calledDone = true;

                const error = new Error(message);

                error.stack = stack;
                done(error);
            });

            forkedProcess.on("exit", exitCode => {
                if (calledDone) {
                    return;
                }
                calledDone = true;

                if (exitCode === 0) {
                    done();
                } else {
                    done(new Error("Forked process exited with a non-zero exit code"));
                }
            });
        });
    });

    // only works on a Windows machine
    if (os.platform() === "win32") {

        // https://github.com/eslint/eslint/issues/17042
        describe("with cwd that is using forward slash on Windows", () => {
            const cwd = getFixturePath("example-app3");
            const cwdForwardSlash = cwd.replace(/\\/gu, "/");

            it("should correctly handle ignore patterns", async () => {
                const engine = new ESLint({ cwd: cwdForwardSlash });
                const results = await engine.lintFiles(["./src"]);

                // src/dist/2.js should be ignored
                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, path.join(cwd, "src\\1.js"));
            });

            it("should pass cwd with backslashes to rules", async () => {
                const engine = new ESLint({
                    cwd: cwdForwardSlash,
                    useEslintrc: false,
                    overrideConfig: {
                        plugins: ["test"],
                        rules: {
                            "test/report-cwd": "error"
                        }
                    }
                });
                const results = await engine.lintText("");

                assert.strictEqual(results[0].messages[0].ruleId, "test/report-cwd");
                assert.strictEqual(results[0].messages[0].message, cwd);
            });

            it("should pass cwd with backslashes to formatters", async () => {
                const engine = new ESLint({
                    cwd: cwdForwardSlash
                });
                const results = await engine.lintText("");
                const formatter = await engine.loadFormatter("cwd");

                assert.strictEqual(formatter.format(results), cwd);
            });
        });
    }
});
