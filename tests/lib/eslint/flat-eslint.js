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
const util = require("util");
const fs = require("fs");
const fsp = fs.promises;
const os = require("os");
const path = require("path");
const escapeStringRegExp = require("escape-string-regexp");
const fCache = require("file-entry-cache");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noCallThru().noPreserveCache();
const shell = require("shelljs");
const hash = require("../../../lib/cli-engine/hash");
const { unIndent, createCustomTeardown } = require("../../_utils");
const { shouldUseFlatConfig } = require("../../../lib/eslint/flat-eslint");
const coreRules = require("../../../lib/rules");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates a directory if it doesn't already exist.
 * @param {string} dirPath The path to the directory that should exist.
 * @returns {void}
 */
function ensureDirectoryExists(dirPath) {
    try {
        fs.statSync(dirPath);
    } catch {
        fs.mkdirSync(dirPath);
    }
}

/**
 * Does nothing for a given time.
 * @param {number} time Time in ms.
 * @returns {void}
 */
async function sleep(time) {
    await util.promisify(setTimeout)(time);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FlatESLint", () => {
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

    /** @type {import("../../../lib/eslint/flat-eslint").FlatESLint} */
    let FlatESLint;

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
        return new FlatESLint({
            ...options,
            plugins: {
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
        ({ FlatESLint } = require("../../../lib/eslint/flat-eslint"));
    });

    after(() => {
        shell.rm("-r", fixtureDir);
    });

    describe("ESLint constructor function", () => {
        it("the default value of 'options.cwd' should be the current working directory.", async () => {
            process.chdir(__dirname);
            try {
                const engine = new FlatESLint();
                const results = await engine.lintFiles("eslint.js");

                assert.strictEqual(path.dirname(results[0].filePath), __dirname);
            } finally {
                process.chdir(originalDir);
            }
        });

        it("should normalize 'options.cwd'.", async () => {
            const cwd = getFixturePath("example-app3");
            const engine = new FlatESLint({
                cwd: `${cwd}${path.sep}foo${path.sep}..`, // `<cwd>/foo/..` should be normalized to `<cwd>`
                overrideConfigFile: true,
                overrideConfig: {
                    plugins: {
                        test: require(path.join(cwd, "node_modules", "eslint-plugin-test"))
                    },
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

        // https://github.com/eslint/eslint/issues/2380
        it("should not modify baseConfig when format is specified", () => {
            const customBaseConfig = { root: true };

            new FlatESLint({ baseConfig: customBaseConfig }); // eslint-disable-line no-new -- Check for argument side effects

            assert.deepStrictEqual(customBaseConfig, { root: true });
        });

        it("should throw readable messages if removed options are present", () => {
            assert.throws(
                () => new FlatESLint({
                    cacheFile: "",
                    configFile: "",
                    envs: [],
                    globals: [],
                    ignorePath: ".gitignore",
                    ignorePattern: [],
                    parser: "",
                    parserOptions: {},
                    rules: {},
                    plugins: []
                }),
                new RegExp(escapeStringRegExp([
                    "Invalid Options:",
                    "- Unknown options: cacheFile, configFile, envs, globals, ignorePath, ignorePattern, parser, parserOptions, rules"
                ].join("\n")), "u")
            );
        });

        it("should throw readable messages if wrong type values are given to options", () => {
            assert.throws(
                () => new FlatESLint({
                    allowInlineConfig: "",
                    baseConfig: "",
                    cache: "",
                    cacheLocation: "",
                    cwd: "foo",
                    errorOnUnmatchedPattern: "",
                    fix: "",
                    fixTypes: ["xyz"],
                    globInputPaths: "",
                    ignore: "",
                    ignorePatterns: "",
                    overrideConfig: "",
                    overrideConfigFile: "",
                    plugins: "",
                    reportUnusedDisableDirectives: "",
                    warnIgnored: ""
                }),
                new RegExp(escapeStringRegExp([
                    "Invalid Options:",
                    "- 'allowInlineConfig' must be a boolean.",
                    "- 'baseConfig' must be an object or null.",
                    "- 'cache' must be a boolean.",
                    "- 'cacheLocation' must be a non-empty string.",
                    "- 'cwd' must be an absolute path.",
                    "- 'errorOnUnmatchedPattern' must be a boolean.",
                    "- 'fix' must be a boolean or a function.",
                    "- 'fixTypes' must be an array of any of \"directive\", \"problem\", \"suggestion\", and \"layout\".",
                    "- 'globInputPaths' must be a boolean.",
                    "- 'ignore' must be a boolean.",
                    "- 'ignorePatterns' must be an array of non-empty strings or null.",
                    "- 'overrideConfig' must be an object or null.",
                    "- 'overrideConfigFile' must be a non-empty string, null, or true.",
                    "- 'plugins' must be an object or null.",
                    "- 'reportUnusedDisableDirectives' must be any of \"error\", \"warn\", \"off\", and null.",
                    "- 'warnIgnored' must be a boolean."
                ].join("\n")), "u")
            );
        });

        it("should throw readable messages if 'ignorePatterns' is not an array of non-empty strings.", () => {
            const invalidIgnorePatterns = [
                () => {},
                false,
                {},
                "",
                "foo",
                [[]],
                [() => {}],
                [false],
                [{}],
                [""],
                ["foo", ""],
                ["foo", "", "bar"],
                ["foo", false, "bar"]
            ];

            invalidIgnorePatterns.forEach(ignorePatterns => {
                assert.throws(
                    () => new FlatESLint({ ignorePatterns }),
                    new RegExp(escapeStringRegExp([
                        "Invalid Options:",
                        "- 'ignorePatterns' must be an array of non-empty strings or null."
                    ].join("\n")), "u")
                );
            });
        });

        it("should throw readable messages if 'plugins' option contains empty key", () => {
            assert.throws(
                () => new FlatESLint({
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

        it("should report the total and per file errors when using local cwd eslint.config.js", async () => {
            eslint = new FlatESLint({
                cwd: __dirname
            });

            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 4);
            assert.strictEqual(results[0].messages[0].ruleId, "no-var");
            assert.strictEqual(results[0].messages[1].ruleId, "no-unused-vars");
            assert.strictEqual(results[0].messages[2].ruleId, "quotes");
            assert.strictEqual(results[0].messages[3].ruleId, "eol-last");
            assert.strictEqual(results[0].fixableErrorCount, 3);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 2);
            assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
            assert.strictEqual(results[0].usedDeprecatedRules[1].ruleId, "eol-last");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report the total and per file warnings when using local cwd .eslintrc", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    rules: {
                        quotes: 1,
                        "no-var": 1,
                        "eol-last": 1,
                        "no-unused-vars": 1
                    }
                },
                overrideConfigFile: true
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 4);
            assert.strictEqual(results[0].messages[0].ruleId, "no-var");
            assert.strictEqual(results[0].messages[1].ruleId, "no-unused-vars");
            assert.strictEqual(results[0].messages[2].ruleId, "quotes");
            assert.strictEqual(results[0].messages[3].ruleId, "eol-last");
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 3);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 2);
            assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
            assert.strictEqual(results[0].usedDeprecatedRules[1].ruleId, "eol-last");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report one message when using specific config file", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: "fixtures/configurations/quotes-error.js",
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
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 1);
            assert.strictEqual(results[0].usedDeprecatedRules[0].ruleId, "quotes");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report the filename when passed in", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath()
            });
            const options = { filePath: "test.js" };
            const results = await eslint.lintText("var foo = 'bar';", options);

            assert.strictEqual(results[0].filePath, getFixturePath("test.js"));
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is true", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js"
            });

            const options = { filePath: "fixtures/passing.js", warnIgnored: true };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].severity, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.");
            assert.strictEqual(results[0].messages[0].output, void 0);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return a warning when given a filename by --stdin-filename in excluded files list if constructor warnIgnored is false, but lintText warnIgnored is true", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js",
                warnIgnored: false
            });

            const options = { filePath: "fixtures/passing.js", warnIgnored: true };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("passing.js"));
            assert.strictEqual(results[0].messages[0].severity, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.");
            assert.strictEqual(results[0].messages[0].output, void 0);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js"
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

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if constructor warnIgnored is false", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js",
                warnIgnored: false
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            // should not report anything because the warning is suppressed
            assert.strictEqual(results.length, 0);
        });

        it("should show excluded file warnings by default", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js"
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.");
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                ignore: false,
                overrideConfigFile: "fixtures/eslint.config_with_ignores.js",
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
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return a message and fixed text when in fix mode", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: true,
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
                    usedDeprecatedRules: [
                        {
                            ruleId: "semi",
                            replacedBy: []
                        }
                    ]
                }
            ]);
        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: true,
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
                overrideConfigFile: true,
                fix: true,
                overrideConfig: {
                    rules: {
                        "example/make-syntax-error": "error"
                    }
                },
                ignore: false,
                cwd: getFixturePath(".")
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
            eslint = eslintWithPlugins({
                overrideConfigFile: true,
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
            eslint = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: { semi: 1 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].source, void 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should not return a `source` property when fixes are applied", async () => {
            eslint = new FlatESLint({
                overrideConfigFile: true,
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
            eslint = new FlatESLint({
                overrideConfigFile: true,
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
        it("should respect default ignore rules (ignoring node_modules), even with --no-ignore", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                ignore: false
            });
            const results = await eslint.lintText("var bar = foo;", { filePath: "node_modules/passing.js", warnIgnored: true });
            const expectedMsg = "File ignored by default because it is located under the node_modules directory. Use ignore pattern \"!**/node_modules/\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("node_modules/passing.js"));
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should warn when deprecated rules are found in a config", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                overrideConfigFile: "tests/fixtures/cli-engine/deprecated-rule-config/eslint.config.js"
            });
            const [result] = await eslint.lintText("foo");

            assert.deepStrictEqual(
                result.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
        });

        it("should throw if eslint.config.js file is not present", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath("..")
            });
            await assert.rejects(() => eslint.lintText("var foo = 'bar';"), /Could not find config file/u);
        });

        it("should not throw if eslint.config.js file is not present and overrideConfigFile is `true`", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: true
            });
            await eslint.lintText("var foo = 'bar';");
        });

        it("should not throw if eslint.config.js file is not present and overrideConfigFile is path to a config file", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/configurations/quotes-error.js"
            });
            await eslint.lintText("var foo = 'bar';");
        });

        it("should throw if overrideConfigFile is path to a file that doesn't exist", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(""),
                overrideConfigFile: "does-not-exist.js"
            });
            await assert.rejects(() => eslint.lintText("var foo = 'bar';"), { code: "ENOENT" });
        });

        it("should throw if non-string value is given to 'code' parameter", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintText(100), /'code' must be a string/u);
        });

        it("should throw if non-object value is given to 'options' parameter", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", "foo.js"), /'options' must be an object, null, or undefined/u);
        });

        it("should throw if 'options' argument contains unknown key", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { filename: "foo.js" }), /'options' must not include the unknown option\(s\): filename/u);
        });

        it("should throw if non-string value is given to 'options.filePath' option", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { filePath: "" }), /'options.filePath' must be a non-empty string or undefined/u);
        });

        it("should throw if non-boolean value is given to 'options.warnIgnored' option", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintText("var a = 0", { warnIgnored: "" }), /'options.warnIgnored' must be a boolean or undefined/u);
        });

        it("should work with config file that exports a promise", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath("promise-config")
            });
            const results = await eslint.lintText('var foo = "bar";');

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
        });
    });

    describe("lintFiles()", () => {

        /** @type {InstanceType<import("../../../lib/eslint").ESLint>} */
        let eslint;

        it("should use correct parser when custom parser is specified", async () => {
            const filePath = path.resolve(__dirname, "../../fixtures/configurations/parser/custom.js");

            eslint = new FlatESLint({
                cwd: originalDir,
                ignore: false,
                overrideConfigFile: true,
                overrideConfig: {
                    languageOptions: {
                        parser: require(filePath)
                    }
                }
            });

            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].message, "Parsing error: Boom!");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                overrideConfigFile: "tests/fixtures/simple-valid-project/eslint.config.js"
            });
            const results = await eslint.lintFiles(["tests/fixtures/simple-valid-project/**/foo*.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                overrideConfigFile: "tests/fixtures/simple-valid-project/eslint.config.js"
            });
            const results = await eslint.lintFiles([
                "tests/fixtures/simple-valid-project/**/foo*.js",
                "tests/fixtures/simple-valid-project/foo.?s",
                "tests/fixtures/simple-valid-project/{foo,src/foobar}.js"
            ]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and espree as parser", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    languageOptions: {
                        parser: require("espree"),
                        parserOptions: {
                            ecmaVersion: 2021
                        }
                    }
                },
                overrideConfigFile: true
            });
            const results = await eslint.lintFiles(["lib/cli.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    languageOptions: {
                        parser: require("esprima")
                    }
                },
                overrideConfigFile: true,
                ignore: false
            });
            const results = await eslint.lintFiles(["tests/fixtures/passing.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should throw if eslint.config.js file is not present", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath("..")
            });
            await assert.rejects(() => eslint.lintFiles("fixtures/undef*.js"), /Could not find config file/u);
        });

        it("should not throw if eslint.config.js file is not present and overrideConfigFile is `true`", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: true
            });
            await eslint.lintFiles("fixtures/undef*.js");
        });

        it("should not throw if eslint.config.js file is not present and overrideConfigFile is path to a config file", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(".."),
                overrideConfigFile: "fixtures/configurations/quotes-error.js"
            });
            await eslint.lintFiles("fixtures/undef*.js");
        });

        it("should throw if overrideConfigFile is path to a file that doesn't exist", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                overrideConfigFile: "does-not-exist.js"
            });
            await assert.rejects(() => eslint.lintFiles("undef*.js"), { code: "ENOENT" });
        });

        it("should throw an error when given a config file and a valid file and invalid parser", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    languageOptions: {
                        parser: "test11"
                    }
                },
                overrideConfigFile: true
            });

            await assert.rejects(async () => await eslint.lintFiles(["lib/cli.js"]), /Expected object with parse\(\) or parseForESLint\(\) method/u);
        });

        it("should report zero messages when given a directory with a .js2 file", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: getFixturePath("eslint.config.js"),
                overrideConfig: {
                    files: ["**/*.js2"]
                }
            });
            const results = await eslint.lintFiles([getFixturePath("files/foo.js2")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should report zero messages when given a directory with a .js and a .js2 file", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath(".."),
                overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                overrideConfigFile: getFixturePath("eslint.config.js")
            });
            const results = await eslint.lintFiles(["fixtures/files/"]);

            assert.strictEqual(results.length, 3);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        // https://github.com/eslint/eslint/issues/16413
        it("should find files and report zero messages when given a parent directory with a .js", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath("example-app/subdir")
            });
            const results = await eslint.lintFiles(["../*.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[1].suppressedMessages.length, 0);
        });

        // https://github.com/eslint/eslint/issues/16038
        it("should allow files patterns with '..' inside", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath("dots-in-files")
            });
            const results = await eslint.lintFiles(["."]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].filePath, getFixturePath("dots-in-files/a..b.js"));
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });


        // https://github.com/eslint/eslint/issues/16299
        it("should only find files in the subdir1 directory when given a directory name", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath("example-app2")
            });
            const results = await eslint.lintFiles(["subdir1"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].filePath, getFixturePath("example-app2/subdir1/a.js"));
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        // https://github.com/eslint/eslint/issues/14742
        it("should run", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath("{curly-path}", "server")
            });
            const results = await eslint.lintFiles(["src/**/*.{js,json}"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "no-console");
            assert.strictEqual(
                results[0].filePath,
                getFixturePath("{curly-path}/server/src/two.js")
            );
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should work with config file that exports a promise", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath("promise-config")
            });
            const results = await eslint.lintFiles(["a*.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("promise-config", "a.js"));
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
        });

        // https://github.com/eslint/eslint/issues/16265
        describe("Dot files in searches", () => {

            it("should find dot files in current directory when a . pattern is used", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("dot-files")
                });
                const results = await eslint.lintFiles(["."]);

                assert.strictEqual(results.length, 3);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].filePath, getFixturePath("dot-files/.a.js"));
                assert.strictEqual(results[0].suppressedMessages.length, 0);
                assert.strictEqual(results[1].messages.length, 0);
                assert.strictEqual(results[1].filePath, getFixturePath("dot-files/.c.js"));
                assert.strictEqual(results[1].suppressedMessages.length, 0);
                assert.strictEqual(results[2].messages.length, 0);
                assert.strictEqual(results[2].filePath, getFixturePath("dot-files/b.js"));
                assert.strictEqual(results[2].suppressedMessages.length, 0);
            });

            it("should find dot files in current directory when a *.js pattern is used", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("dot-files")
                });
                const results = await eslint.lintFiles(["*.js"]);

                assert.strictEqual(results.length, 3);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].filePath, getFixturePath("dot-files/.a.js"));
                assert.strictEqual(results[0].suppressedMessages.length, 0);
                assert.strictEqual(results[1].messages.length, 0);
                assert.strictEqual(results[1].filePath, getFixturePath("dot-files/.c.js"));
                assert.strictEqual(results[1].suppressedMessages.length, 0);
                assert.strictEqual(results[2].messages.length, 0);
                assert.strictEqual(results[2].filePath, getFixturePath("dot-files/b.js"));
                assert.strictEqual(results[2].suppressedMessages.length, 0);
            });

            it("should find dot files in current directory when a .a.js pattern is used", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("dot-files")
                });
                const results = await eslint.lintFiles([".a.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].filePath, getFixturePath("dot-files/.a.js"));
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });
        });

        // https://github.com/eslint/eslint/issues/16275
        describe("Glob patterns without matches", () => {

            it("should throw an error for a missing pattern when combined with a found pattern", async () => {
                eslint = new FlatESLint({
                    ignore: false,
                    cwd: getFixturePath("example-app2")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir1", "doesnotexist/*.js"]);
                }, /No files matching 'doesnotexist\/\*\.js' were found/u);
            });

            it("should throw an error for an ignored directory pattern when combined with a found pattern", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("example-app2"),
                    overrideConfig: {
                        ignores: ["subdir2"]
                    }
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir1/*.js", "subdir2/*.js"]);
                }, /All files matched by 'subdir2\/\*\.js' are ignored/u);
            });

            it("should throw an error for an ignored file pattern when combined with a found pattern", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("example-app2"),
                    overrideConfig: {
                        ignores: ["subdir2/*.js"]
                    }
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir1/*.js", "subdir2/*.js"]);
                }, /All files matched by 'subdir2\/\*\.js' are ignored/u);
            });

            it("should always throw an error for the first unmatched file pattern", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("example-app2"),
                    overrideConfig: {
                        ignores: ["subdir1/*.js", "subdir2/*.js"]
                    }
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["doesnotexist1/*.js", "doesnotexist2/*.js"]);
                }, /No files matching 'doesnotexist1\/\*\.js' were found/u);

                await assert.rejects(async () => {
                    await eslint.lintFiles(["doesnotexist1/*.js", "subdir1/*.js"]);
                }, /No files matching 'doesnotexist1\/\*\.js' were found/u);

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir1/*.js", "doesnotexist1/*.js"]);
                }, /All files matched by 'subdir1\/\*\.js' are ignored/u);

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir1/*.js", "subdir2/*.js"]);
                }, /All files matched by 'subdir1\/\*\.js' are ignored/u);
            });

            it("should not throw an error for an ignored file pattern when errorOnUnmatchedPattern is false", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("example-app2"),
                    overrideConfig: {
                        ignores: ["subdir2/*.js"]
                    },
                    errorOnUnmatchedPattern: false
                });

                const results = await eslint.lintFiles(["subdir2/*.js"]);

                assert.strictEqual(results.length, 0);
            });

            it("should not throw an error for a non-existing file pattern when errorOnUnmatchedPattern is false", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("example-app2"),
                    errorOnUnmatchedPattern: false
                });

                const results = await eslint.lintFiles(["doesexist/*.js"]);

                assert.strictEqual(results.length, 0);
            });
        });

        // https://github.com/eslint/eslint/issues/16260
        describe("Globbing based on configs", () => {
            it("should report zero messages when given a directory with a .js and config file specifying a subdirectory", async () => {
                eslint = new FlatESLint({
                    ignore: false,
                    cwd: getFixturePath("shallow-glob")
                });
                const results = await eslint.lintFiles(["target-dir"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should glob for .jsx file in a subdirectory of the passed-in directory and not glob for any other patterns", async () => {
                eslint = new FlatESLint({
                    ignore: false,
                    overrideConfigFile: true,
                    overrideConfig: {
                        files: ["subdir/**/*.jsx", "target-dir/*.js"],
                        languageOptions: {
                            parserOptions: {
                                jsx: true
                            }
                        }
                    },
                    cwd: getFixturePath("shallow-glob")
                });
                const results = await eslint.lintFiles(["subdir/subsubdir"]);

                assert.strictEqual(results.length, 2);
                assert.strictEqual(results[0].messages.length, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("shallow-glob/subdir/subsubdir/broken.js"));
                assert(results[0].messages[0].fatal, "Fatal error expected.");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
                assert.strictEqual(results[1].filePath, getFixturePath("shallow-glob/subdir/subsubdir/plain.jsx"));
                assert.strictEqual(results[1].messages.length, 0);
                assert.strictEqual(results[1].suppressedMessages.length, 0);
            });

            it("should glob for all files in subdir when passed-in on the command line with a partial matching glob", async () => {
                eslint = new FlatESLint({
                    ignore: false,
                    overrideConfigFile: true,
                    overrideConfig: {
                        files: ["s*/subsubdir/*.jsx", "target-dir/*.js"],
                        languageOptions: {
                            parserOptions: {
                                jsx: true
                            }
                        }
                    },
                    cwd: getFixturePath("shallow-glob")
                });
                const results = await eslint.lintFiles(["subdir"]);

                assert.strictEqual(results.length, 3);
                assert.strictEqual(results[0].messages.length, 1);
                assert(results[0].messages[0].fatal, "Fatal error expected.");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
                assert.strictEqual(results[1].messages.length, 1);
                assert(results[0].messages[0].fatal, "Fatal error expected.");
                assert.strictEqual(results[1].suppressedMessages.length, 0);
                assert.strictEqual(results[2].messages.length, 0);
                assert.strictEqual(results[2].suppressedMessages.length, 0);
            });
        });

        it("should report zero messages when given a '**' pattern with a .js and a .js2 file", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: path.join(fixtureDir, ".."),
                overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                overrideConfigFile: getFixturePath("eslint.config.js")

            });
            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 3);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(results[1].suppressedMessages.length, 0);
            assert.strictEqual(results[2].suppressedMessages.length, 0);
        });

        it("should resolve globs when 'globInputPaths' option is true", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath(".."),
                overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                overrideConfigFile: getFixturePath("eslint.config.js")

            });
            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 3);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(results[1].suppressedMessages.length, 0);
            assert.strictEqual(results[2].suppressedMessages.length, 0);
        });

        // only works on a Windows machine
        if (os.platform() === "win32") {

            it("should resolve globs with Windows slashes when 'globInputPaths' option is true", async () => {
                eslint = new FlatESLint({
                    ignore: false,
                    cwd: getFixturePath(".."),
                    overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                    overrideConfigFile: getFixturePath("eslint.config.js")

                });
                const results = await eslint.lintFiles(["fixtures\\files\\*"]);

                assert.strictEqual(results.length, 3);
                assert.strictEqual(results[0].messages.length, 0);
                assert.strictEqual(results[1].messages.length, 0);
                assert.strictEqual(results[2].messages.length, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
                assert.strictEqual(results[1].suppressedMessages.length, 0);
                assert.strictEqual(results[2].suppressedMessages.length, 0);
            });

        }


        it("should not resolve globs when 'globInputPaths' option is false", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath(".."),
                overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                overrideConfigFile: true,
                globInputPaths: false
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["fixtures/files/*"]);
            }, /No files matching 'fixtures\/files\/\*' were found \(glob was disabled\)\./u);
        });

        describe("Ignoring Files", () => {

            it("should report on a file in the node_modules folder passed explicitly, even if ignored by default", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine")
                });
                const results = await eslint.lintFiles(["node_modules/foo.js"]);
                const expectedMsg = "File ignored by default because it is located under the node_modules directory. Use ignore pattern \"!**/node_modules/\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.";

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[0].message, expectedMsg);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should report on a file in a node_modules subfolder passed explicitly, even if ignored by default", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine")
                });
                const results = await eslint.lintFiles(["nested_node_modules/subdir/node_modules/text.js"]);
                const expectedMsg = "File ignored by default because it is located under the node_modules directory. Use ignore pattern \"!**/node_modules/\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.";

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[0].message, expectedMsg);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should report on an ignored file with \"node_modules\" in its name", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    ignorePatterns: ["*.js"]
                });
                const results = await eslint.lintFiles(["node_modules_cleaner.js"]);
                const expectedMsg = "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.";

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[0].message, expectedMsg);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should suppress the warning when a file in the node_modules folder passed explicitly and warnIgnored is false", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    warnIgnored: false
                });
                const results = await eslint.lintFiles(["node_modules/foo.js"]);

                assert.strictEqual(results.length, 0);
            });

            it("should report on globs with explicit inclusion of dotfiles", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    overrideConfigFile: true,
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
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 1);
                assert.strictEqual(results[0].fixableWarningCount, 0);
            });

            it("should ignore node_modules files when using ignore file", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    overrideConfigFile: true
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["node_modules"]);
                }, /All files matched by 'node_modules' are ignored\./u);
            });

            // https://github.com/eslint/eslint/issues/5547
            it("should ignore node_modules files even with ignore: false", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    ignore: false
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["node_modules"]);
                }, /All files matched by 'node_modules' are ignored\./u);
            });

            it("should throw an error when all given files are ignored", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: getFixturePath("eslint.config_with_ignores.js")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["tests/fixtures/cli-engine/"]);
                }, /All files matched by 'tests\/fixtures\/cli-engine\/' are ignored\./u);
            });

            it("should throw an error when all given files are ignored even with a `./` prefix", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: getFixturePath("eslint.config_with_ignores.js")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
                }, /All files matched by '\.\/tests\/fixtures\/cli-engine\/' are ignored\./u);
            });

            // https://github.com/eslint/eslint/issues/3788
            it("should ignore one-level down node_modules by default", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: true,
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
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
            });

            // https://github.com/eslint/eslint/issues/3812
            it("should ignore all files and throw an error when **/fixtures/** is in `ignores` in the config file", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: getFixturePath("cli-engine/eslint.config_with_ignores2.js"),
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

            it("should throw an error when all given files are ignored via ignorePatterns", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    ignorePatterns: ["tests/fixtures/single-quoted.js"]
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["tests/fixtures/*-quoted.js"]);
                }, /All files matched by 'tests\/fixtures\/\*-quoted\.js' are ignored\./u);
            });

            it("should return a warning when an explicitly given file is ignored", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: "eslint.config_with_ignores.js",
                    cwd: getFixturePath()
                });
                const filePath = getFixturePath("passing.js");
                const results = await eslint.lintFiles([filePath]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, filePath);
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.");
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should suppress the warning when an explicitly given file is ignored and warnIgnored is false", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: "eslint.config_with_ignores.js",
                    cwd: getFixturePath(),
                    warnIgnored: false
                });
                const filePath = getFixturePath("passing.js");
                const results = await eslint.lintFiles([filePath]);

                assert.strictEqual(results.length, 0);
            });

            it("should return a warning about matching ignore patterns when an explicitly given dotfile is ignored", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: "eslint.config_with_ignores.js",
                    cwd: getFixturePath()
                });
                const filePath = getFixturePath("dot-files/.a.js");
                const results = await eslint.lintFiles([filePath]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, filePath);
                assert.strictEqual(results[0].messages[0].severity, 1);
                assert.strictEqual(results[0].messages[0].message, "File ignored because of a matching ignore pattern. Use \"--no-ignore\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.");
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].fatalErrorCount, 0);
                assert.strictEqual(results[0].fixableErrorCount, 0);
                assert.strictEqual(results[0].fixableWarningCount, 0);
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should return two messages when given a file in excluded files list while ignore is off", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath(),
                    ignore: false,
                    overrideConfigFile: getFixturePath("eslint.config_with_ignores.js"),
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
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            // https://github.com/eslint/eslint/issues/16300
            it("should process ignore patterns relative to basePath not cwd", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-relative/subdir")
                });
                const results = await eslint.lintFiles(["**/*.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-relative/subdir/a.js"));
            });

            // https://github.com/eslint/eslint/issues/16354
            it("should skip subdirectory files when ignore pattern matches deep subdirectory", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-directory")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir/**"]);
                }, /All files matched by 'subdir\/\*\*' are ignored\./u);

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir/subsubdir/**"]);
                }, /All files matched by 'subdir\/subsubdir\/\*\*' are ignored\./u);

                const results = await eslint.lintFiles(["subdir/subsubdir/a.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-directory/subdir/subsubdir/a.js"));
                assert.strictEqual(results[0].warningCount, 1);
                assert(results[0].messages[0].message.startsWith("File ignored"), "Should contain file ignored warning");

            });

            // https://github.com/eslint/eslint/issues/16414
            it("should skip subdirectory files when ignore pattern matches subdirectory", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-subdirectory")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subdir/**/*.js"]);
                }, /All files matched by 'subdir\/\*\*\/\*\.js' are ignored\./u);

                const results = await eslint.lintFiles(["subdir/subsubdir/a.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-subdirectory/subdir/subsubdir/a.js"));
                assert.strictEqual(results[0].warningCount, 1);
                assert(results[0].messages[0].message.startsWith("File ignored"), "Should contain file ignored warning");

                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-subdirectory/subdir")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["subsubdir/**/*.js"]);
                }, /All files matched by 'subsubdir\/\*\*\/\*\.js' are ignored\./u);


            });

            // https://github.com/eslint/eslint/issues/16340
            it("should lint files even when cwd directory name matches ignores pattern", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-self")
                });

                const results = await eslint.lintFiles(["*.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-self/eslint.config.js"));
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 0);

            });

            // https://github.com/eslint/eslint/issues/16416
            it("should allow reignoring of previously ignored files", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-relative"),
                    overrideConfigFile: true,
                    overrideConfig: {
                        ignores: [
                            "*.js",
                            "!a*.js",
                            "a.js"
                        ]
                    }
                });
                const results = await eslint.lintFiles(["a.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 1);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-relative/a.js"));
            });

            // https://github.com/eslint/eslint/issues/16415
            it("should allow directories to be unignored", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("ignores-directory"),
                    overrideConfigFile: true,
                    overrideConfig: {
                        ignores: [
                            "subdir/*",
                            "!subdir/subsubdir"
                        ]
                    }
                });
                const results = await eslint.lintFiles(["subdir/**/*.js"]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].errorCount, 0);
                assert.strictEqual(results[0].warningCount, 0);
                assert.strictEqual(results[0].filePath, getFixturePath("ignores-directory/subdir/subsubdir/a.js"));
            });


        });


        it("should report zero messages when given a pattern with a .js and a .js2 file", async () => {
            eslint = new FlatESLint({
                overrideConfig: { files: ["**/*.js", "**/*.js2"] },
                ignore: false,
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true
            });
            const results = await eslint.lintFiles(["fixtures/files/*.?s*"]);

            assert.strictEqual(results.length, 3);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[1].suppressedMessages.length, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(results[2].suppressedMessages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                overrideConfigFile: true,
                overrideConfig: {
                    rules: {
                        quotes: ["error", "double"]
                    }
                },
                ignore: false
            });
            const results = await eslint.lintFiles([getFixturePath("single-quoted.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 1);
            assert.strictEqual(results[0].messages[0].ruleId, "quotes");
            assert.strictEqual(results[0].messages[0].severity, 2);
            assert.strictEqual(results[0].errorCount, 1);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return 5 results when given a config and a directory of 5 valid files", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
                overrideConfig: {
                    rules: {
                        semi: 1,
                        strict: 0
                    }
                }
            });

            const formattersDir = getFixturePath("formatters");
            const results = await eslint.lintFiles([formattersDir]);

            assert.strictEqual(results.length, 5);
            assert.strictEqual(path.relative(formattersDir, results[0].filePath), "async.js");
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 0);
            assert.strictEqual(results[0].fatalErrorCount, 0);
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[1].filePath), "broken.js");
            assert.strictEqual(results[1].errorCount, 0);
            assert.strictEqual(results[1].warningCount, 0);
            assert.strictEqual(results[1].fatalErrorCount, 0);
            assert.strictEqual(results[1].fixableErrorCount, 0);
            assert.strictEqual(results[1].fixableWarningCount, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(results[1].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[2].filePath), "cwd.js");
            assert.strictEqual(results[2].errorCount, 0);
            assert.strictEqual(results[2].warningCount, 0);
            assert.strictEqual(results[2].fatalErrorCount, 0);
            assert.strictEqual(results[2].fixableErrorCount, 0);
            assert.strictEqual(results[2].fixableWarningCount, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(results[2].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[3].filePath), "simple.js");
            assert.strictEqual(results[3].errorCount, 0);
            assert.strictEqual(results[3].warningCount, 0);
            assert.strictEqual(results[3].fatalErrorCount, 0);
            assert.strictEqual(results[3].fixableErrorCount, 0);
            assert.strictEqual(results[3].fixableWarningCount, 0);
            assert.strictEqual(results[3].messages.length, 0);
            assert.strictEqual(results[3].suppressedMessages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[4].filePath), path.join("test", "simple.js"));
            assert.strictEqual(results[4].errorCount, 0);
            assert.strictEqual(results[4].warningCount, 0);
            assert.strictEqual(results[4].fatalErrorCount, 0);
            assert.strictEqual(results[4].fixableErrorCount, 0);
            assert.strictEqual(results[4].fixableWarningCount, 0);
            assert.strictEqual(results[4].messages.length, 0);
            assert.strictEqual(results[4].suppressedMessages.length, 0);
        });

        it("should return zero messages when given a config with browser globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: getFixturePath("configurations", "env-browser.js")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have no messages.");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when given an option to add browser globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
                overrideConfig: {
                    languageOptions: {
                        globals: {
                            window: false
                        }
                    },
                    rules: {
                        "no-alert": 0,
                        "no-undef": 2
                    }
                }
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when given a config with sourceType set to commonjs and Node.js globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: getFixturePath("configurations", "env-node.js")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have no messages.");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should not return results from previous call when calling more than once", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: getFixturePath("eslint.config.js"),
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
            assert.strictEqual(results[0].suppressedMessages.length, 0);
            assert.strictEqual(results[0].messages[0].severity, 2);

            results = await eslint.lintFiles([passFilePath]);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, passFilePath);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing a file with a shebang", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath(),
                overrideConfigFile: getFixturePath("eslint.config.js")
            });
            const results = await eslint.lintFiles([getFixturePath("shebang.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have lint messages.");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should return zero messages when executing without a config file", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                ignore: false,
                overrideConfigFile: true
            });
            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));
            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        // working
        describe("Deprecated Rules", () => {

            it("should warn when deprecated rules are configured", async () => {
                eslint = new FlatESLint({
                    cwd: originalDir,
                    overrideConfigFile: true,
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
                eslint = new FlatESLint({
                    cwd: originalDir,
                    overrideConfigFile: true,
                    overrideConfig: {
                        rules: { eqeqeq: 1, "valid-jsdoc": 0, "require-jsdoc": 0 }
                    }
                });
                const results = await eslint.lintFiles(["lib/cli*.js"]);

                assert.deepStrictEqual(results[0].usedDeprecatedRules, []);
            });

            it("should warn when deprecated rules are found in a config", async () => {
                eslint = new FlatESLint({
                    cwd: originalDir,
                    overrideConfigFile: "tests/fixtures/cli-engine/deprecated-rule-config/eslint.config.js"
                });
                const results = await eslint.lintFiles(["lib/cli*.js"]);

                assert.deepStrictEqual(
                    results[0].usedDeprecatedRules,
                    [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
                );
            });
        });

        // working
        describe("Fix Mode", () => {

            it("correctly autofixes semicolon-conflicting-fixes", async () => {
                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    fix: true
                });
                const inputPath = getFixturePath("autofix/semicolon-conflicting-fixes.js");
                const outputPath = getFixturePath("autofix/semicolon-conflicting-fixes.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

            it("correctly autofixes return-conflicting-fixes", async () => {
                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    fix: true
                });
                const inputPath = getFixturePath("autofix/return-conflicting-fixes.js");
                const outputPath = getFixturePath("autofix/return-conflicting-fixes.expected.js");
                const results = await eslint.lintFiles([inputPath]);
                const expectedOutput = fs.readFileSync(outputPath, "utf8");

                assert.strictEqual(results[0].output, expectedOutput);
            });

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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
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

            // Cannot be run properly until cache is implemented
            it("should run autofix even if files are cached without autofix results", async () => {
                const baseOptions = {
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
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

                eslint = new FlatESLint(Object.assign({}, baseOptions, { cache: true, fix: false }));

                // Do initial lint run and populate the cache file
                await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                eslint = new FlatESLint(Object.assign({}, baseOptions, { cache: true, fix: true }));
                const results = await eslint.lintFiles([path.resolve(fixtureDir, `${fixtureDir}/fixmode`)]);

                assert(results.some(result => result.output));
            });
        });

        describe("plugins", () => {
            it("should return two messages when executing with config file that specifies a plugin", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.resolve(fixtureDir, ".."),
                    overrideConfigFile: getFixturePath("configurations", "plugins-with-prefix.js")
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test/test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2, "Expected two messages.");
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
                assert.strictEqual(results[0].suppressedMessages.length, 0);

            });

            it("should return two messages when executing with cli option that specifies a plugin", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.resolve(fixtureDir, ".."),
                    overrideConfigFile: true,
                    overrideConfig: {
                        rules: { "example/example-rule": 1 }
                    }
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
                assert.strictEqual(results[0].suppressedMessages.length, 0);

            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", async () => {
                eslint = new FlatESLint({
                    cwd: path.resolve(fixtureDir, ".."),
                    overrideConfigFile: true,
                    overrideConfig: {
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
                assert.strictEqual(results[0].suppressedMessages.length, 0);

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
                 * helper method to delete the directory used in testing
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

                    eslint = new FlatESLint({
                        overrideConfigFile: true,
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

                it("should create the cache file inside existing cacheLocation directory when cacheLocation ends with a slash", async () => {
                    assert(!shell.test("-d", path.resolve(cwd, "./tmp/.cacheFileDir/")), "the cache directory already exists and wasn't successfully deleted");

                    fs.mkdirSync(path.resolve(cwd, "./tmp/.cacheFileDir/"), { recursive: true });

                    eslint = new FlatESLint({
                        overrideConfigFile: true,
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

                    eslint = new FlatESLint({
                        overrideConfigFile: true,
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

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    cache: true,
                    cwd,
                    overrideConfig: {
                        rules: {
                            "no-console": 0
                        }
                    },
                    ignore: false
                });
                const file = getFixturePath("cli-engine", "console.js");

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created at provided cwd");
            });

            it("should invalidate the cache if the overrideConfig changed between executions", async () => {
                const cwd = getFixturePath("cache/src");

                cacheFilePath = path.resolve(cwd, ".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    ignore: false
                });

                let spy = sinon.spy(fs.promises, "readFile");

                let file = path.join(cwd, "test-file.js");

                file = fs.realpathSync(file);
                const results = await eslint.lintFiles([file]);

                for (const { errorCount, warningCount } of results) {
                    assert.strictEqual(errorCount + warningCount, 0, "the file should have passed linting without errors or warnings");
                }

                assert(spy.calledWith(file), "ESLint should have read the file because there was no cache file");
                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                // destroy the spy
                sinon.restore();

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 2,
                            "no-unused-vars": 2
                        }
                    },
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs.promises, "readFile");

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

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    ignore: false
                });

                let spy = sinon.spy(fs.promises, "readFile");

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                const result = await eslint.lintFiles([file]);

                assert(spy.calledWith(file), "ESLint should have read the file because there was no cache file");
                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                // destroy the spy
                sinon.restore();

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    cwd,

                    // specifying cache true the cache will be created
                    cache: true,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    ignore: false
                });

                // create a new spy
                spy = sinon.spy(fs.promises, "readFile");

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
                    overrideConfigFile: true,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    cwd: path.join(fixtureDir, "..")
                };

                eslint = new FlatESLint(eslintOptions);

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheFilePath), "the cache for eslint should have been created");

                eslintOptions.cache = false;
                eslint = new FlatESLint(eslintOptions);

                await eslint.lintFiles([file]);

                assert(!shell.test("-f", cacheFilePath), "the cache for eslint should have been deleted since last run did not use the cache");
            });

            it("should store in the cache a file that has lint messages and a file that doesn't have lint messages", async () => {
                cacheFilePath = getFixturePath(".eslintcache");
                doDelete(cacheFilePath);
                assert(!shell.test("-f", cacheFilePath), "the cache file already exists and wasn't successfully deleted");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
                });
                const badFile = fs.realpathSync(getFixturePath("cache/src", "fail-file.js"));
                const goodFile = fs.realpathSync(getFixturePath("cache/src", "test-file.js"));
                const testFile2 = fs.realpathSync(getFixturePath("cache/src", "test-file2.js"));

                await eslint.lintFiles([badFile, goodFile, testFile2]);

                let fileCache = fCache.createFromFile(cacheFilePath);
                let { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(testFile2), "object", "the entry for the test-file2 should have been in the cache");

                /*
                 * we pass a different set of files (minus test-file2)
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    cache: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    cacheLocation: cacheFilePath,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    }
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

                eslint = new FlatESLint({
                    overrideConfigFile: true,

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

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        overrideConfigFile: true,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "metadata",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        }

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

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        overrideConfigFile: true,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "content",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        }

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

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        overrideConfigFile: true,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation: cacheFilePath,
                        cacheStrategy: "content",
                        overrideConfig: {
                            rules: {
                                "no-console": 0,
                                "no-unused-vars": 2
                            }
                        }

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

            it("should return two messages when executing with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    overrideConfig: [
                        {
                            plugins: {
                                test: {
                                    processors: {
                                        txt: {
                                            preprocess(text) {
                                                return [text];
                                            },
                                            postprocess(messages) {
                                                return messages[0];
                                            }
                                        }
                                    }
                                }
                            },
                            processor: "test/txt",
                            rules: {
                                "no-console": 2,
                                "no-unused-vars": 2
                            }
                        },
                        {
                            files: ["**/*.txt", "**/*.txt/*.txt"]
                        }
                    ],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].suppressedMessages.length, 0);

            });

            it("should run processors when calling lintFiles with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    overrideConfig: [
                        {
                            plugins: {
                                test: {
                                    processors: {
                                        txt: {
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
                            },
                            processor: "test/txt",
                            rules: {
                                "no-console": 2,
                                "no-unused-vars": 2
                            }
                        },
                        {
                            files: ["**/*.txt", "**/*.txt/*.txt"]
                        }
                    ],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
                assert.strictEqual(results[0].suppressedMessages.length, 0);

            });

            it("should run processors when calling lintText with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    overrideConfig: [
                        {
                            plugins: {
                                test: {
                                    processors: {
                                        txt: {
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
                            },
                            processor: "test/txt",
                            rules: {
                                "no-console": 2,
                                "no-unused-vars": 2
                            }
                        },
                        {
                            files: ["**/*.txt", "**/*.txt/*.txt"]
                        }
                    ],
                    ignore: false
                });
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should run processors when calling lintText with processor resolves same extension but different content correctly", async () => {
                let count = 0;

                eslint = new FlatESLint({
                    overrideConfigFile: true,
                    overrideConfig: [
                        {
                            plugins: {
                                test: {
                                    processors: {
                                        txt: {
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
                            },
                            processor: "test/txt"
                        },
                        {
                            files: ["**/*.txt/*.txt"],
                            rules: {
                                "no-console": 2,
                                "no-unused-vars": 2
                            }
                        },
                        {
                            files: ["**/*.txt"]
                        }
                    ],
                    ignore: false
                });
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(count, 2);
                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
                assert.strictEqual(results[0].suppressedMessages.length, 0);

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
                    eslint = new FlatESLint({
                        overrideConfigFile: true,
                        overrideConfig: [
                            {
                                files: ["**/*.html"],
                                plugins: {
                                    test: { processors: { html: Object.assign({ supportsAutofix: true }, HTML_PROCESSOR) } }
                                },
                                processor: "test/html",
                                rules: {
                                    semi: 2
                                }
                            },
                            {
                                files: ["**/*.txt"]
                            }
                        ],
                        ignore: false,
                        fix: true
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 0);
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                    assert.strictEqual(results[0].output, "<script>foo;</script>");
                });

                it("should not run in autofix mode when using a processor that does not support autofixing", async () => {
                    eslint = new FlatESLint({
                        overrideConfigFile: true,
                        overrideConfig: {
                            files: ["**/*.html"],
                            plugins: {
                                test: { processors: { html: HTML_PROCESSOR } }
                            },
                            processor: "test/html",
                            rules: {
                                semi: 2
                            }
                        },
                        ignore: false,
                        fix: true
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 1);
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
                });

                it("should not run in autofix mode when `fix: true` is not provided, even if the processor supports autofixing", async () => {
                    eslint = new FlatESLint({
                        overrideConfigFile: true,
                        overrideConfig: [
                            {
                                files: ["**/*.html"],
                                plugins: {
                                    test: { processors: { html: Object.assign({ supportsAutofix: true }, HTML_PROCESSOR) } }
                                },
                                processor: "test/html",
                                rules: {
                                    semi: 2
                                }
                            },
                            {
                                files: ["**/*.txt"]
                            }
                        ],
                        ignore: false
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 1);
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
                });
            });
        });

        describe("Patterns which match no file should throw errors.", () => {
            beforeEach(() => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    overrideConfigFile: true
                });
            });

            it("one file", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["non-exist.js"]);
                }, /No files matching 'non-exist\.js' were found\./u);
            });

            it("should throw if the directory exists and is empty", async () => {
                ensureDirectoryExists(getFixturePath("cli-engine/empty"));
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

            // https://github.com/eslint/eslint/issues/16275
            it("a mix of an existing glob pattern and a non-existing glob pattern", async () => {
                await assert.rejects(async () => {
                    await eslint.lintFiles(["*.js", "non-exist/*.js"]);
                }, /No files matching 'non-exist\/\*\.js' were found\./u);
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
                        "markdown": { ...processor, supportsAutofix: true },
                        "non-fixable": processor
                    };
                `,
                "node_modules/eslint-plugin-html/index.js": `
                    const { defineProcessor } = require("pattern-processor");
                    const processor = defineProcessor(${/<script lang="(\w*)">\n([\s\S]+?)\n<\/script>/gu});
                    const legacyProcessor = defineProcessor(${/<script lang="(\w*)">\n([\s\S]+?)\n<\/script>/gu}, true);
                    exports.processors = {
                        "html": { ...processor, supportsAutofix: true },
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

            // unique directory for each test to avoid quirky disk-cleanup errors
            let id;

            beforeEach(() => (id = Date.now().toString()));

            /*
             * `fs.rmdir(path, { recursive: true })` is deprecated and will be removed.
             * Use `fs.rm(path, { recursive: true })` instead.
             * When supporting Node.js 14.14.0+, the compatibility condition can be removed for `fs.rmdir`.
             */
            if (typeof fsp.rm === "function") {
                afterEach(async () => fsp.rm(root, { recursive: true, force: true }));
            } else {
                afterEach(async () => fsp.rmdir(root, { recursive: true, force: true }));
            }

            it("should lint only JavaScript blocks.", async () => {
                const teardown = createCustomTeardown({
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                }
                            },
                            {
                                files: ["**/*.js"],
                                rules: { semi: "error" }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/markdown"
                            }
                        ];`
                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath() });
                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1, "Should have one result.");
                assert.strictEqual(results[0].messages.length, 1, "Should have one message.");
                assert.strictEqual(results[0].messages[0].ruleId, "semi");
                assert.strictEqual(results[0].messages[0].line, 2, "Message should be on line 2.");
                assert.strictEqual(results[0].suppressedMessages.length, 0);

            });

            it("should lint HTML blocks as well with multiple processors if represented in config.", async () => {
                const teardown = createCustomTeardown({
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                }
                            },
                            {
                                files: ["**/*.js"],
                                rules: { semi: "error" }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/markdown"
                            },
                            {
                                files: ["**/*.html"],
                                processor: "html/html"
                            }
                        ];`
                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath(), overrideConfig: { files: ["**/*.html"] } });
                const results = await eslint.lintFiles(["test.md"]);

                assert.strictEqual(results.length, 1, "Should have one result.");
                assert.strictEqual(results[0].messages.length, 2, "Should have two messages.");
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2, "First error should be on line 2");
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7, "Second error should be on line 7.");
                assert.strictEqual(results[0].suppressedMessages.length, 0);
            });

            it("should fix HTML blocks as well with multiple processors if represented in config.", async () => {
                const teardown = createCustomTeardown({
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                }
                            },
                            {
                                files: ["**/*.js"],
                                rules: { semi: "error" }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/markdown"
                            },
                            {
                                files: ["**/*.html"],
                                processor: "html/html"
                            }
                        ];`
                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath(), overrideConfig: { files: ["**/*.html"] }, fix: true });
                const results = await eslint.lintFiles(["test.md"]);

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

            it("should use the config '**/*.html/*.js' to lint JavaScript blocks in HTML.", async () => {
                const teardown = createCustomTeardown({
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                }
                            },
                            {
                                files: ["**/*.js"],
                                rules: { semi: "error" }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/markdown"
                            },
                            {
                                files: ["**/*.html"],
                                processor: "html/html"
                            },
                            {
                                files: ["**/*.html/*.js"],
                                rules: {
                                    semi: "off",
                                    "no-console": "error"
                                }
                            }

                        ];`

                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath(), overrideConfig: { files: ["**/*.html"] } });
                const results = await eslint.lintFiles(["test.md"]);

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
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                },
                                rules: { semi: "error" }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/markdown"
                            },
                            {
                                files: ["**/*.html"],
                                processor: "html/legacy",  // this processor returns strings rather than '{ text, filename }'
                                rules: {
                                    semi: "off",
                                    "no-console": "error"
                                }
                            },
                            {
                                files: ["**/*.html/*.js"],
                                rules: {
                                    semi: "error",
                                    "no-console": "off"
                                }
                            }

                        ];`
                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath(), overrideConfig: { files: ["**/*.html"] } });
                const results = await eslint.lintFiles(["test.md"]);

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
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown"),
                                    html: require("eslint-plugin-html")
                                }
                            },
                            {
                                files: ["**/*.md"],
                                processor: "markdown/unknown"
                            }

                        ];`
                    }
                });

                await teardown.prepare();
                eslint = new FlatESLint({ cwd: teardown.getPath() });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["test.md"]);
                }, /Key "processor": Could not find "unknown" in plugin "markdown"/u);
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
                        "eslint.config.js": "module.exports = [];"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;

                eslint = new FlatESLint({ cwd: teardown.getPath() });
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
                        "eslint.config.js": "module.exports = [];"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                eslint = new FlatESLint({ cwd: teardown.getPath() });
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
                        "eslint.config.js": "module.exports = [{ linterOptions: { noInlineConfig: true } }];"
                    }
                });

                await teardown.prepare();
                cleanup = teardown.cleanup;
                eslint = new FlatESLint({ cwd: teardown.getPath() });

                const results = await eslint.lintFiles(["test.js"]);
                const messages = results[0].messages;

                assert.strictEqual(messages.length, 1);
                assert.strictEqual(messages[0].message, "'/* globals foo */' has no effect because you have 'noInlineConfig' setting in your config.");
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
                        "eslint.config.js": "module.exports = { linterOptions: { reportUnusedDisableDirectives: true } }"
                    }
                });


                await teardown.prepare();
                cleanup = teardown.cleanup;
                eslint = new FlatESLint({ cwd: teardown.getPath() });

                const results = await eslint.lintFiles(["test.js"]);
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

                    eslint = new FlatESLint({
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

                    eslint = new FlatESLint({
                        cwd: teardown.getPath(),
                        reportUnusedDisableDirectives: "error"
                    });

                    const results = await eslint.lintFiles(["test.js"]);
                    const messages = results[0].messages;

                    assert.strictEqual(messages.length, 1);
                    assert.strictEqual(messages[0].severity, 2);
                    assert.strictEqual(messages[0].message, "Unused eslint-disable directive (no problems were reported from 'eqeqeq').");
                    assert.strictEqual(results[0].suppressedMessages.length, 0);
                });
            });
        });

        it("should throw if non-boolean value is given to 'options.warnIgnored' option", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintFiles(777), /'patterns' must be a non-empty string or an array of non-empty strings/u);
            await assert.rejects(() => eslint.lintFiles([null]), /'patterns' must be a non-empty string or an array of non-empty strings/u);
        });
    });

    describe("Fix Types", () => {

        let eslint;

        it("should throw an error when an invalid fix type is specified", () => {
            assert.throws(() => {
                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    fix: true,
                    fixTypes: ["layou"]
                });
            }, /'fixTypes' must be an array of any of "directive", "problem", "suggestion", and "layout"\./iu);
        });

        it("should not fix any rules when fixTypes is used without fix", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
                fix: false,
                fixTypes: ["layout"]
            });
            const inputPath = getFixturePath("fix-types/fix-only-semi.js");
            const results = await eslint.lintFiles([inputPath]);

            assert.strictEqual(results[0].output, void 0);
        });

        it("should not fix non-style rules when fixTypes has only 'layout'", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
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
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
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
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                overrideConfigFile: true,
                fix: true,
                fixTypes: ["suggestion", "layout"]
            });
            const inputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.js");
            const outputPath = getFixturePath("fix-types/fix-both-semi-and-prefer-arrow-callback.expected.js");
            const results = await eslint.lintFiles([inputPath]);
            const expectedOutput = fs.readFileSync(outputPath, "utf8");

            assert.strictEqual(results[0].output, expectedOutput);
        });

    });

    describe("isPathIgnored", () => {
        it("should check if the given path is ignored", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: getFixturePath("eslint.config_with_ignores2.js"),
                cwd: getFixturePath()
            });

            assert(await engine.isPathIgnored("undef.js"));
            assert(!await engine.isPathIgnored("passing.js"));
        });

        it("should return false if ignoring is disabled", async () => {
            const engine = new FlatESLint({
                ignore: false,
                overrideConfigFile: getFixturePath("eslint.config_with_ignores2.js"),
                cwd: getFixturePath()
            });

            assert(!await engine.isPathIgnored("undef.js"));
        });

        // https://github.com/eslint/eslint/issues/5547
        it("should return true for default ignores even if ignoring is disabled", async () => {
            const engine = new FlatESLint({
                ignore: false,
                cwd: getFixturePath("cli-engine")
            });

            assert(await engine.isPathIgnored("node_modules/foo.js"));
        });

        describe("about the default ignore patterns", () => {
            it("should always apply default ignore patterns if ignore option is true", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should still apply default ignore patterns if ignore option is is false", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignore: false, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/package/file.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/node_modules/package/file.js")));
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePattern constructor option", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    cwd,
                    overrideConfigFile: true,
                    ignorePatterns: ["!node_modules/", "node_modules/*", "!node_modules/package/"]
                });

                const result = await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js"));

                assert(!result, "File should not be ignored");
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignores in overrideConfig", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    cwd,
                    overrideConfigFile: true,
                    overrideConfig: {
                        ignores: ["!node_modules/", "node_modules/*", "!node_modules/package/"]
                    }
                });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js")));
            });

            it("should ignore .git directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".git/bar")));
            });

            it("should still ignore .git directory when ignore option disabled", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignore: false, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", ".git/bar")));
            });

            it("should not ignore absolute paths containing '..'", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ cwd });

                assert(!await engine.isPathIgnored(`${getFixturePath("ignored-paths", "foo")}/../unignored.js`));
            });

            it("should ignore /node_modules/ relative to cwd without any configured ignore patterns", async () => {
                const cwd = getFixturePath("ignored-paths", "no-ignore-file");
                const engine = new FlatESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "node_modules", "existing.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "foo", "node_modules", "existing.js")));
            });

            it("should not inadvertently ignore all files in parent directories", async () => {
                const engine = new FlatESLint({ cwd: getFixturePath("ignored-paths", "no-ignore-file") });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });
        });

        describe("with ignorePatterns option", () => {
            it("should accept a string for options.ignorePatterns", async () => {
                const cwd = getFixturePath("ignored-paths", "ignore-pattern");
                const engine = new FlatESLint({
                    ignorePatterns: ["ignore-me.txt"],
                    cwd
                });

                assert(await engine.isPathIgnored("ignore-me.txt"));
            });

            it("should accept an array for options.ignorePattern", async () => {
                const engine = new FlatESLint({
                    ignorePatterns: ["a.js", "b.js"],
                    overrideConfigFile: true
                });

                assert(await engine.isPathIgnored("a.js"), "a.js should be ignored");
                assert(await engine.isPathIgnored("b.js"), "b.js should be ignored");
                assert(!await engine.isPathIgnored("c.js"), "c.js should not be ignored");
            });

            it("should return true for files which match an ignorePattern even if they do not exist on the filesystem", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    ignorePatterns: ["not-a-file"],
                    cwd
                });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "not-a-file")));
            });

            it("should return true for file matching an ignore pattern exactly", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    ignorePatterns: ["undef.js"],
                    cwd,
                    overrideConfigFile: true
                });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file in subfolder of cwd matching an ignore pattern with a base filename", async () => {
                const cwd = getFixturePath("ignored-paths");
                const filePath = getFixturePath("ignored-paths", "subdir", "undef.js");
                const engine = new FlatESLint({
                    ignorePatterns: ["undef.js"],
                    overrideConfigFile: true,
                    cwd
                });

                assert(!await engine.isPathIgnored(filePath));
            });

            it("should return true for file matching a child of an ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["ignore-pattern"], cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "ignore-me.txt")));
            });

            it("should return true for file matching a grandchild of a directory when the pattern is directory/**", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["ignore-pattern/**"], cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "subdir", "ignore-me.js")));
            });

            it("should return false for file not matching any ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["failing.js"], cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "unignored.js")));
            });

            it("two globstar '**' ignore pattern should ignore files in nested directories", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    overrideConfigFile: true,
                    ignorePatterns: ["**/*.js"],
                    cwd
                });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")), "foo.js should be ignored");
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.js")), "foo/bar.js should be ignored");
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.js")), "foo/bar/baz.js");
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.cjs")), "foo.cjs should not be ignored");
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar.cjs")), "foo/bar.cjs should not be ignored");
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "foo/bar/baz.cjs")), "foo/bar/baz.cjs should not be ignored");
            });
        });

        describe("with config ignores ignorePatterns option", () => {
            it("should return false for ignored file when unignored with ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    overrideConfigFile: getFixturePath("eslint.config_with_ignores2.js"),
                    ignorePatterns: ["!undef.js"],
                    cwd
                });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });
        });

        it("should throw if non-string value is given to 'filePath' parameter", async () => {
            const eslint = new FlatESLint();

            await assert.rejects(() => eslint.isPathIgnored(null), /'filePath' must be a non-empty string/u);
        });
    });

    describe("loadFormatter()", () => {
        it("should return a formatter object when a bundled formatter is requested", async () => {
            const engine = new FlatESLint();
            const formatter = await engine.loadFormatter("compact");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when no argument is passed", async () => {
            const engine = new FlatESLint();
            const formatter = await engine.loadFormatter();

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a custom formatter is requested", async () => {
            const engine = new FlatESLint();
            const formatter = await engine.loadFormatter(getFixturePath("formatters", "simple.js"));

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a custom formatter is requested, also if the path has backslashes", async () => {
            const engine = new FlatESLint({
                cwd: path.join(fixtureDir, "..")
            });
            const formatter = await engine.loadFormatter(".\\fixtures\\formatters\\simple.js");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter prefixed with eslint-formatter is requested", async () => {
            const engine = new FlatESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("bar");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested, also when the eslint-formatter prefix is included in the format argument", async () => {
            const engine = new FlatESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("eslint-formatter-bar");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested within a scoped npm package", async () => {
            const engine = new FlatESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("@somenamespace/foo");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should return a formatter object when a formatter is requested within a scoped npm package, also when the eslint-formatter prefix is included in the format argument", async () => {
            const engine = new FlatESLint({
                cwd: getFixturePath("cli-engine")
            });
            const formatter = await engine.loadFormatter("@somenamespace/eslint-formatter-foo");

            assert.strictEqual(typeof formatter, "object");
            assert.strictEqual(typeof formatter.format, "function");
        });

        it("should throw if a custom formatter doesn't exist", async () => {
            const engine = new FlatESLint();
            const formatterPath = getFixturePath("formatters", "doesntexist.js");
            const fullFormatterPath = path.resolve(formatterPath);

            await assert.rejects(async () => {
                await engine.loadFormatter(formatterPath);
            }, new RegExp(escapeStringRegExp(`There was a problem loading formatter: ${fullFormatterPath}\nError: Cannot find module '${fullFormatterPath}'`), "u"));
        });

        it("should throw if a built-in formatter doesn't exist", async () => {
            const engine = new FlatESLint();
            const fullFormatterPath = path.resolve(__dirname, "../../../lib/cli-engine/formatters/special");

            await assert.rejects(async () => {
                await engine.loadFormatter("special");
            }, new RegExp(escapeStringRegExp(`There was a problem loading formatter: ${fullFormatterPath}.js\nError: Cannot find module '${fullFormatterPath}.js'`), "u"));
        });

        it("should throw if the required formatter exists but has an error", async () => {
            const engine = new FlatESLint();
            const formatterPath = getFixturePath("formatters", "broken.js");

            await assert.rejects(async () => {
                await engine.loadFormatter(formatterPath);

                // for some reason, the error here contains multiple "there was a problem loading formatter" lines, so omitting
            }, new RegExp(escapeStringRegExp("Error: Cannot find module 'this-module-does-not-exist'"), "u"));
        });

        it("should throw if a non-string formatter name is passed", async () => {
            const engine = new FlatESLint();

            await assert.rejects(async () => {
                await engine.loadFormatter(5);
            }, /'name' must be a string/u);
        });
    });

    describe("getErrorResults()", () => {

        it("should report 5 error messages when looking for errors only", async () => {
            process.chdir(originalDir);
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: {
                        quotes: "error",
                        "no-var": "error",
                        "eol-last": "error",
                        "no-unused-vars": "error"
                    }
                }
            });
            const results = await engine.lintText("var foo = 'bar';");
            const errorResults = FlatESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 4, "messages.length is wrong");
            assert.strictEqual(errorResults[0].errorCount, 4, "errorCount is wrong");
            assert.strictEqual(errorResults[0].fixableErrorCount, 3, "fixableErrorCount is wrong");
            assert.strictEqual(errorResults[0].fixableWarningCount, 0, "fixableWarningCount is wrong");
            assert.strictEqual(errorResults[0].messages[0].ruleId, "no-var");
            assert.strictEqual(errorResults[0].messages[0].severity, 2);
            assert.strictEqual(errorResults[0].messages[1].ruleId, "no-unused-vars");
            assert.strictEqual(errorResults[0].messages[1].severity, 2);
            assert.strictEqual(errorResults[0].messages[2].ruleId, "quotes");
            assert.strictEqual(errorResults[0].messages[2].severity, 2);
            assert.strictEqual(errorResults[0].messages[3].ruleId, "eol-last");
            assert.strictEqual(errorResults[0].messages[3].severity, 2);
        });

        it("should not mutate passed report parameter", async () => {
            process.chdir(originalDir);
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: { quotes: [1, "double"] }
                }
            });
            const results = await engine.lintText("var foo = 'bar';");
            const reportResultsLength = results[0].messages.length;

            FlatESLint.getErrorResults(results);

            assert.strictEqual(results[0].messages.length, reportResultsLength);
        });

        it("should report a warningCount of 0 when looking for errors only", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: {
                        strict: ["error", "global"],
                        quotes: "error",
                        "no-var": "error",
                        "eol-last": "error",
                        "no-unused-vars": "error"
                    }
                }
            });
            const lintResults = await engine.lintText("var foo = 'bar';");
            const errorResults = FlatESLint.getErrorResults(lintResults);

            assert.strictEqual(errorResults[0].warningCount, 0);
            assert.strictEqual(errorResults[0].fixableWarningCount, 0);
        });

        it("should return 0 error or warning messages even when the file has warnings", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: getFixturePath("eslint.config_with_ignores.js"),
                cwd: path.join(fixtureDir, "..")
            });
            const options = {
                filePath: "fixtures/passing.js",
                warnIgnored: true
            };
            const results = await engine.lintText("var bar = foo;", options);
            const errorReport = FlatESLint.getErrorResults(results);

            assert.strictEqual(errorReport.length, 0);
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].errorCount, 0);
            assert.strictEqual(results[0].warningCount, 1);
        });

        it("should return source code of file in the `source` property", async () => {
            process.chdir(originalDir);
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: { quotes: [2, "double"] }
                }
            });
            const results = await engine.lintText("var foo = 'bar';");
            const errorResults = FlatESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 1);
            assert.strictEqual(errorResults[0].source, "var foo = 'bar';");
        });

        it("should contain `output` property after fixes", async () => {
            process.chdir(originalDir);
            const engine = new FlatESLint({
                overrideConfigFile: true,
                fix: true,
                overrideConfig: {
                    rules: {
                        semi: 2,
                        "no-console": 2
                    }
                }
            });
            const results = await engine.lintText("console.log('foo')");
            const errorResults = FlatESLint.getErrorResults(results);

            assert.strictEqual(errorResults[0].messages.length, 1);
            assert.strictEqual(errorResults[0].output, "console.log('foo');");
        });
    });

    describe("findConfigFile()", () => {

        it("should return undefined when overrideConfigFile is true", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true
            });

            assert.strictEqual(await engine.findConfigFile(), void 0);
        });

        it("should return undefined when a config file isn't found", async () => {
            const engine = new FlatESLint({
                cwd: path.resolve(__dirname, "../../../../")
            });

            assert.strictEqual(await engine.findConfigFile(), void 0);
        });

        it("should return custom config file path when overrideConfigFile is a nonempty string", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: "my-config.js"
            });
            const configFilePath = path.resolve(__dirname, "../../../my-config.js");

            assert.strictEqual(await engine.findConfigFile(), configFilePath);
        });

        it("should return root level eslint.config.js when overrideConfigFile is null", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: null
            });
            const configFilePath = path.resolve(__dirname, "../../../eslint.config.js");

            assert.strictEqual(await engine.findConfigFile(), configFilePath);
        });

        it("should return root level eslint.config.js when overrideConfigFile is not specified", async () => {
            const engine = new FlatESLint();
            const configFilePath = path.resolve(__dirname, "../../../eslint.config.js");

            assert.strictEqual(await engine.findConfigFile(), configFilePath);
        });

    });

    describe("getRulesMetaForResults()", () => {

        it("should throw an error when this instance did not lint any files", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true
            });

            assert.throws(() => {
                engine.getRulesMetaForResults([
                    {
                        filePath: "path/to/file.js",
                        messages: [
                            {
                                ruleId: "curly",
                                severity: 2,
                                message: "Expected { after 'if' condition.",
                                line: 2,
                                column: 1,
                                nodeType: "IfStatement"
                            },
                            {
                                ruleId: "no-process-exit",
                                severity: 2,
                                message: "Don't use process.exit(); throw an error instead.",
                                line: 3,
                                column: 1,
                                nodeType: "CallExpression"
                            }
                        ],
                        suppressedMessages: [],
                        errorCount: 2,
                        warningCount: 0,
                        fatalErrorCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source:
                            "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
                    }
                ]);
            }, {
                constructor: TypeError,
                message: "Results object was not created from this ESLint instance."
            });
        });

        it("should throw an error when results were created from a different instance", async () => {
            const engine1 = new FlatESLint({
                overrideConfigFile: true,
                cwd: path.join(fixtureDir, "foo"),
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });
            const engine2 = new FlatESLint({
                overrideConfigFile: true,
                cwd: path.join(fixtureDir, "bar"),
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const results1 = await engine1.lintText("1", { filePath: "file.js" });
            const results2 = await engine2.lintText("2", { filePath: "file.js" });

            engine1.getRulesMetaForResults(results1); // should not throw an error
            assert.throws(() => {
                engine1.getRulesMetaForResults(results2);
            }, {
                constructor: TypeError,
                message: "Results object was not created from this ESLint instance."
            });
        });

        it("should treat a result without `filePath` as if the file was located in `cwd`", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                cwd: path.join(fixtureDir, "foo", "bar"),
                ignorePatterns: ["*/**"], // ignore all subdirectories of `cwd`
                overrideConfig: {
                    rules: {
                        eqeqeq: "warn"
                    }
                }
            });

            const results = await engine.lintText("a==b");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.deepStrictEqual(rulesMeta.eqeqeq, coreRules.get("eqeqeq").meta);
        });

        it("should not throw an error if a result without `filePath` contains an ignored file warning", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                cwd: path.join(fixtureDir, "foo", "bar"),
                ignorePatterns: ["**"]
            });

            const results = await engine.lintText("", { warnIgnored: true });
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.deepStrictEqual(rulesMeta, {});
        });

        it("should not throw an error if results contain linted files and one ignored file", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                cwd: getFixturePath(),
                ignorePatterns: ["passing*"],
                overrideConfig: {
                    rules: {
                        "no-undef": 2,
                        semi: 1
                    }
                }
            });

            const results = await engine.lintFiles(["missing-semicolon.js", "passing.js", "undef.js"]);

            assert(
                results.some(({ messages }) => messages.some(({ message, ruleId }) => !ruleId && message.startsWith("File ignored"))),
                "At least one file should be ignored but none is."
            );

            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.deepStrictEqual(rulesMeta["no-undef"], coreRules.get("no-undef").meta);
            assert.deepStrictEqual(rulesMeta.semi, coreRules.get("semi").meta);
        });

        it("should return empty object when there are no linting errors", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true
            });

            const rulesMeta = engine.getRulesMetaForResults([]);

            assert.deepStrictEqual(rulesMeta, {});
        });

        it("should return one rule meta when there is a linting error", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const results = await engine.lintText("a", { filePath: "foo.js" });
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(Object.keys(rulesMeta).length, 1);
            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
        });

        it("should return one rule meta when there is a suppressed linting error", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
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
            const engine = new FlatESLint({
                overrideConfigFile: true,
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
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: {
                    plugins: {
                        "custom-plugin": customPlugin
                    },
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
            const engine = new FlatESLint({
                overrideConfigFile: true,
                ignorePatterns: ["ignored.js"],
                overrideConfig: {
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
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: { rules: { "no-var": "warn" } },
                reportUnusedDisableDirectives: "warn"
            });

            const results = await engine.lintText("// eslint-disable-line no-var\nvar foo;");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.deepStrictEqual(rulesMeta, { "no-var": coreRules.get("no-var").meta });
        });

        it("should return empty object if all messages are related to unknown rules", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true
            });

            const results = await engine.lintText("// eslint-disable-line foo, bar/baz, bar/baz/qux");

            assert.strictEqual(results[0].messages.length, 3);
            assert.strictEqual(results[0].messages[0].ruleId, "foo");
            assert.strictEqual(results[0].messages[1].ruleId, "bar/baz");
            assert.strictEqual(results[0].messages[2].ruleId, "bar/baz/qux");

            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(Object.keys(rulesMeta).length, 0);
        });

        it("should return object with meta of known rules if some messages are related to unknown rules", async () => {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: { rules: { "no-var": "warn" } }
            });

            const results = await engine.lintText("// eslint-disable-line foo, bar/baz, bar/baz/qux\nvar x;");

            assert.strictEqual(results[0].messages.length, 4);
            assert.strictEqual(results[0].messages[0].ruleId, "foo");
            assert.strictEqual(results[0].messages[1].ruleId, "bar/baz");
            assert.strictEqual(results[0].messages[2].ruleId, "bar/baz/qux");
            assert.strictEqual(results[0].messages[3].ruleId, "no-var");

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
                writeFile: sinon.spy(() => Promise.resolve())
            };
            const spy = fakeFS.writeFile;
            const { FlatESLint: localESLint } = proxyquire("../../../lib/eslint/flat-eslint", {
                fs: {
                    promises: fakeFS
                }
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
            assert(spy.firstCall.calledWithExactly(path.resolve("foo.js"), "bar"), "First call was incorrect.");
            assert(spy.secondCall.calledWithExactly(path.resolve("bar.js"), "baz"), "Second call was incorrect.");
        });

        it("should call fs.writeFile() for each result with output and not at all for a result without output", async () => {
            const fakeFS = {
                writeFile: sinon.spy(() => Promise.resolve())
            };
            const spy = fakeFS.writeFile;
            const { FlatESLint: localESLint } = proxyquire("../../../lib/eslint/flat-eslint", {
                fs: {
                    promises: fakeFS
                }
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

            assert.strictEqual(spy.callCount, 2, "Call count was wrong");
            assert(spy.firstCall.calledWithExactly(path.resolve("foo.js"), "bar"), "First call was incorrect.");
            assert(spy.secondCall.calledWithExactly(path.resolve("bar.js"), "baz"), "Second call was incorrect.");
        });

        it("should throw if non object array is given to 'results' parameter", async () => {
            await assert.rejects(() => FlatESLint.outputFixes(null), /'results' must be an array/u);
            await assert.rejects(() => FlatESLint.outputFixes([null]), /'results' must include only objects/u);
        });
    });

    describe("when evaluating code with comments to change config when allowInlineConfig is disabled", () => {
        it("should report a violation for disabling rules", async () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                ignore: true,
                overrideConfigFile: true,
                allowInlineConfig: false,
                overrideConfig: {
                    rules: {
                        "eol-last": 0,
                        "no-alert": 1,
                        "no-trailing-spaces": 0,
                        strict: 0,
                        quotes: 0
                    }
                }
            };
            const eslintCLI = new FlatESLint(config);
            const results = await eslintCLI.lintText(code);
            const messages = results[0].messages;

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "no-alert");
            assert.strictEqual(results[0].suppressedMessages.length, 0);
        });

        it("should not report a violation by default", async () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                ignore: true,
                overrideConfigFile: true,
                allowInlineConfig: true,
                overrideConfig: {
                    rules: {
                        "eol-last": 0,
                        "no-alert": 1,
                        "no-trailing-spaces": 0,
                        strict: 0,
                        quotes: 0
                    }
                }
            };
            const eslintCLI = new FlatESLint(config);
            const results = await eslintCLI.lintText(code);
            const messages = results[0].messages;

            assert.strictEqual(messages.length, 0);
            assert.strictEqual(results[0].suppressedMessages.length, 1);
            assert.strictEqual(results[0].suppressedMessages[0].ruleId, "no-alert");
        });
    });

    describe("when evaluating code when reportUnusedDisableDirectives is enabled", () => {
        it("should report problems for unused eslint-disable directives", async () => {
            const eslint = new FlatESLint({ overrideConfigFile: true, reportUnusedDisableDirectives: "error" });

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
            const eslintCLI = require("../../../lib/eslint/flat-eslint").FlatESLint;
            const version = eslintCLI.version;

            assert.strictEqual(typeof version, "string");
            assert(parseInt(version[0], 10) >= 3);
        });
    });

    describe("mutability", () => {

        describe("rules", () => {
            it("Loading rules in one instance doesn't mutate to another instance", async () => {
                const filePath = getFixturePath("single-quoted.js");
                const engine1 = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true,
                    overrideConfig: {
                        plugins: {
                            example: {
                                rules: {
                                    "example-rule"() {
                                        return {};
                                    }
                                }
                            }
                        },
                        rules: { "example/example-rule": 1 }
                    }
                });
                const engine2 = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    overrideConfigFile: true
                });
                const fileConfig1 = await engine1.calculateConfigForFile(filePath);
                const fileConfig2 = await engine2.calculateConfigForFile(filePath);

                // plugin
                assert.deepStrictEqual(fileConfig1.rules["example/example-rule"], [1], "example is present for engine 1");
                assert.strictEqual(fileConfig2.rules, void 0, "example is not present for engine 2");
            });
        });
    });

    describe("configs with 'ignores' and without 'files'", () => {

        // https://github.com/eslint/eslint/issues/17103
        describe("config with ignores: ['error.js']", () => {
            const cwd = getFixturePath("config-with-ignores-without-files");
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd,
                files: {
                    "eslint.config.js": `module.exports = [
                        {
                            rules: {
                                "no-unused-vars": "error",
                            },
                        },
                        {
                            ignores: ["error.js"],
                            rules: {
                                "no-unused-vars": "warn",
                            },
                        },
                      ];`,
                    "error.js": "let unusedVar;",
                    "warn.js": "let unusedVar;"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("should apply to all files except for 'error.js'", async () => {
                const engine = new FlatESLint({
                    cwd
                });

                const results = await engine.lintFiles("{error,warn}.js");

                assert.strictEqual(results.length, 2);

                const [errorResult, warnResult] = results;

                assert.strictEqual(errorResult.filePath, path.join(getPath(), "error.js"));
                assert.strictEqual(errorResult.messages.length, 1);
                assert.strictEqual(errorResult.messages[0].ruleId, "no-unused-vars");
                assert.strictEqual(errorResult.messages[0].severity, 2);

                assert.strictEqual(warnResult.filePath, path.join(getPath(), "warn.js"));
                assert.strictEqual(warnResult.messages.length, 1);
                assert.strictEqual(warnResult.messages[0].ruleId, "no-unused-vars");
                assert.strictEqual(warnResult.messages[0].severity, 1);
            });
        });

        describe("config with ignores: ['**/*.json']", () => {
            const cwd = getFixturePath("config-with-ignores-without-files");
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd,
                files: {
                    "eslint.config.js": `module.exports = [
                        {
                            rules: {
                                "no-undef": "error",
                            },
                        },
                        {
                            ignores: ["**/*.json"],
                            rules: {
                                "no-unused-vars": "error",
                            },
                        },
                      ];`,
                    "foo.js": "",
                    "foo.json": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("should not add json files as lint targets", async () => {
                const engine = new FlatESLint({
                    cwd
                });

                const results = await engine.lintFiles("foo*");

                // should not lint `foo.json`
                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, path.join(getPath(), "foo.js"));
            });
        });

    });

    describe("with ignores config", () => {
        const root = getFixturePath("cli-engine/ignore-patterns");

        describe("ignores can add an ignore pattern ('foo.js').", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["**/foo.js"]
                    };`,
                    "foo.js": "",
                    "bar.js": "",
                    "subdir/foo.js": "",
                    "subdir/bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for 'bar.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), false);
                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'lintFiles()' should not verify 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "bar.js"),
                    path.join(root, "eslint.config.js"),
                    path.join(root, "subdir/bar.js")
                ]);
            });
        });

        describe("ignores can add ignore patterns ('**/foo.js', '/bar.js').", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + Date.now(),
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["**/foo.js", "bar.js"]
                    };`,
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
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/foo.js"), true);
            });

            it("'isPathIgnored()' should return 'true' for '/bar.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), true);
                assert.strictEqual(await engine.isPathIgnored("subdir/bar.js"), false);
            });

            it("'lintFiles()' should not verify 'foo.js' and '/bar.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "baz.js"),
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "subdir/bar.js"),
                    path.join(getPath(), "subdir/baz.js")
                ]);
            });
        });


        describe("ignores can unignore '/node_modules/foo' with patterns ['!node_modules/', 'node_modules/*', '!node_modules/foo/'].", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}-unignores`,
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["!node_modules/", "node_modules/*", "!node_modules/foo/"]
                    };`,
                    "node_modules/foo/index.js": "",
                    "node_modules/foo/.dot.js": "",
                    "node_modules/bar/index.js": "",
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/index.js"), false);
            });

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/.dot.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/.dot.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/bar/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/bar/index.js"), true);
            });

            it("'lintFiles()' should verify 'node_modules/foo/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo.js"),
                    path.join(getPath(), "node_modules/foo/.dot.js"),
                    path.join(getPath(), "node_modules/foo/index.js")
                ]);
            });
        });

        describe("ignores can unignore '/node_modules/foo' with patterns ['!node_modules/', 'node_modules/*', '!node_modules/foo/**'].", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}-unignores`,
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["!node_modules/", "node_modules/*", "!node_modules/foo/**"]
                    };`,
                    "node_modules/foo/index.js": "",
                    "node_modules/foo/.dot.js": "",
                    "node_modules/bar/index.js": "",
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/index.js"), false);
            });

            it("'isPathIgnored()' should return 'false' for 'node_modules/foo/.dot.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/foo/.dot.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for 'node_modules/bar/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("node_modules/bar/index.js"), true);
            });

            it("'lintFiles()' should verify 'node_modules/foo/index.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const result = (await engine.lintFiles("**/*.js"));

                const filePaths = result
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo.js"),
                    path.join(getPath(), "node_modules/foo/.dot.js"),
                    path.join(getPath(), "node_modules/foo/index.js")
                ]);
            });
        });

        describe("ignore pattern can re-ignore files that are unignored by a previous pattern.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}-reignore`,
                files: {
                    "eslint.config.js": `module.exports = ${JSON.stringify({
                        ignores: ["!.*", ".foo*"]
                    })}`,
                    ".foo.js": "",
                    ".bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'true' for re-ignored '.foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored(".foo.js"), true);
            });

            it("'isPathIgnored()' should return 'false' for unignored '.bar.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored(".bar.js"), false);
            });

            it("'lintFiles()' should not lint re-ignored '.foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), ".bar.js"),
                    path.join(getPath(), "eslint.config.js")
                ]);
            });
        });

        describe("ignore pattern can unignore files that are ignored by a previous pattern.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}-dignore`,
                files: {
                    "eslint.config.js": `module.exports = ${JSON.stringify({
                        ignores: ["**/*.js", "!foo.js"]
                    })}`,
                    "foo.js": "",
                    "bar.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for unignored 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), false);
            });

            it("'isPathIgnored()' should return 'true' for ignored 'bar.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });

                assert.strictEqual(await engine.isPathIgnored("bar.js"), true);
            });

            it("'lintFiles()' should verify unignored 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "foo.js")
                ]);
            });
        });

        describe("ignores in a config file should not be used if ignore: false.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["*.js"]
                    }`,
                    "foo.js": ""
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'isPathIgnored()' should return 'false' for 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath(), ignore: false });

                assert.strictEqual(await engine.isPathIgnored("foo.js"), false);
            });

            it("'lintFiles()' should verify 'foo.js'.", async () => {
                const engine = new FlatESLint({ cwd: getPath(), ignore: false });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(root, "eslint.config.js"),
                    path.join(root, "foo.js")
                ]);
            });
        });

    });

    describe("config.files adds lint targets", () => {
        const root = getFixturePath("cli-engine/additional-lint-targets");


        describe("if { files: 'foo/*.txt', ignores: '**/ignore.txt' } is present,", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + 1,
                files: {
                    "eslint.config.js": `module.exports = [{
                        files: ["foo/*.txt"],
                        ignores: ["**/ignore.txt"]
                    }];`,
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
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "bar/test.js"),
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo/test.js"),
                    path.join(getPath(), "foo/test.txt"),
                    path.join(getPath(), "test.js")
                ]);
            });

            it("'lintFiles()' with a glob pattern '*.js' should not contain 'foo/test.txt'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "bar/test.js"),
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo/test.js"),
                    path.join(getPath(), "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/*.txt', ignores: '**/ignore.txt' } is present and subdirectory is passed,", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + 2,
                files: {
                    "eslint.config.js": `module.exports = [{
                        files: ["foo/*.txt"],
                        ignores: ["**/ignore.txt"]
                    }];`,
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
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("foo"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "foo/test.js"),
                    path.join(getPath(), "foo/test.txt")
                ]);
            });

            it("'lintFiles()' with a glob pattern '*.js' should not contain 'foo/test.txt'.", async () => {
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("foo/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "foo/test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*.txt' } is present,", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + 3,
                files: {
                    "eslint.config.js": `module.exports = [
                        {
                            files: ["foo/**/*.txt"]
                        }
                    ]`,
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
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "bar/test.js"),
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo/nested/test.txt"),
                    path.join(getPath(), "foo/test.js"),
                    path.join(getPath(), "foo/test.txt"),
                    path.join(getPath(), "test.js")
                ]);
            });
        });

        describe("if { files: 'foo/**/*' } is present,", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + 4,
                files: {
                    "eslint.config.js": `module.exports = [
                        {
                            files: ["foo/**/*"]
                        }
                    ]`,
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
                const engine = new FlatESLint({ cwd: getPath() });
                const filePaths = (await engine.lintFiles("."))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(filePaths, [
                    path.join(getPath(), "bar/test.js"),
                    path.join(getPath(), "eslint.config.js"),
                    path.join(getPath(), "foo/test.js"),
                    path.join(getPath(), "test.js")
                ]);
            });
        });

    });

    describe("'ignores', 'files' of the configuration that the '--config' option provided should be resolved from CWD.", () => {
        const root = getFixturePath("cli-engine/config-and-overrides-files");

        describe("if { files: 'foo/*.txt', ... } is present by '--config node_modules/myconf/eslint.config.js',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}a1`,
                files: {
                    "node_modules/myconf/eslint.config.js": `module.exports = [
                        {
                            files: ["foo/*.js"],
                            rules: {
                                eqeqeq: "error"
                            }
                        }
                    ];`,
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'lintFiles()' with 'foo/test.js' should use the files entry.", async () => {
                const engine = new FlatESLint({
                    overrideConfigFile: "node_modules/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false
                });
                const results = await engine.lintFiles("foo/test.js");

                // Expected to be an 'eqeqeq' error because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        suppressedMessages: [],
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
                        source: "a == b",
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'node_modules/myconf/foo/test.js' should NOT use the files entry.", async () => {
                const engine = new FlatESLint({
                    overrideConfigFile: "node_modules/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false
                });
                const results = await engine.lintFiles("node_modules/myconf/foo/test.js");

                // Expected to be no errors because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        suppressedMessages: [],
                        errorCount: 0,
                        filePath: path.join(getPath(), "node_modules/myconf/foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [
                            {
                                ruleId: null,
                                fatal: false,
                                message: "File ignored by default because it is located under the node_modules directory. Use ignore pattern \"!**/node_modules/\" to disable file ignore settings or use \"--no-warn-ignored\" to suppress this warning.",
                                severity: 1,
                                nodeType: null
                            }
                        ],
                        usedDeprecatedRules: [],
                        warningCount: 1,
                        fatalErrorCount: 0
                    }
                ]);
            });
        });

        describe("if { files: '*', ignores: 'foo/*.txt', ... } is present by '--config bar/myconf/eslint.config.js',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}a2`,
                files: {
                    "bar/myconf/eslint.config.js": `module.exports = [
                        {
                            files: ["**/*"],
                            ignores: ["foo/*.js"],
                            rules: {
                                eqeqeq: "error"
                            }
                        }
                    ]`,
                    "bar/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'lintFiles()' with 'foo/test.js' should have no errors because no rules are enabled.", async () => {
                const engine = new FlatESLint({
                    overrideConfigFile: "bar/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false
                });
                const results = await engine.lintFiles("foo/test.js");

                // Expected to be no errors because the file matches to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        suppressedMessages: [],
                        errorCount: 0,
                        filePath: path.join(getPath(), "foo/test.js"),
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        messages: [],
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'bar/myconf/foo/test.js' should have an error because eqeqeq is enabled.", async () => {
                const engine = new FlatESLint({
                    overrideConfigFile: "bar/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false
                });
                const results = await engine.lintFiles("bar/myconf/foo/test.js");

                // Expected to be an 'eqeqeq' error because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
                        suppressedMessages: [],
                        errorCount: 1,
                        filePath: path.join(getPath(), "bar/myconf/foo/test.js"),
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
                        source: "a == b",
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });
        });

        describe("if { ignores: 'foo/*.js', ... } is present by '--config node_modules/myconf/eslint.config.js',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: `${root}a3`,
                files: {
                    "node_modules/myconf/eslint.config.js": `module.exports = [{
                        ignores: ["!node_modules", "node_modules/*", "!node_modules/myconf", "foo/*.js"],
                    }, {
                        rules: {
                            eqeqeq: "error"
                        }
                    }]`,
                    "node_modules/myconf/foo/test.js": "a == b",
                    "foo/test.js": "a == b"
                }
            });

            beforeEach(prepare);
            afterEach(cleanup);

            it("'lintFiles()' with '**/*.js' should lint 'node_modules/myconf/foo/test.js' but not 'foo/test.js'.", async () => {
                const engine = new FlatESLint({
                    overrideConfigFile: "node_modules/myconf/eslint.config.js",
                    cwd: getPath()
                });
                const files = (await engine.lintFiles("**/*.js"))
                    .map(r => r.filePath)
                    .sort();

                assert.deepStrictEqual(files, [
                    path.join(getPath(), "node_modules/myconf/eslint.config.js"),
                    path.join(getPath(), "node_modules/myconf/foo/test.js")
                ]);
            });
        });
    });

    describe("baseConfig", () => {
        it("can be an object", async () => {
            const eslint = new FlatESLint({
                overrideConfigFile: true,
                baseConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const [{ messages }] = await eslint.lintText("foo");

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
        });

        it("can be an array", async () => {
            const eslint = new FlatESLint({
                overrideConfigFile: true,
                baseConfig: [
                    {
                        rules: {
                            "no-var": 2
                        }
                    },
                    {
                        rules: {
                            semi: 2
                        }
                    }
                ]
            });

            const [{ messages }] = await eslint.lintText("var foo");

            assert.strictEqual(messages.length, 2);
            assert.strictEqual(messages[0].ruleId, "no-var");
            assert.strictEqual(messages[1].ruleId, "semi");
        });

        it("should be inserted after default configs", async () => {
            const eslint = new FlatESLint({
                overrideConfigFile: true,
                baseConfig: {
                    languageOptions: {
                        ecmaVersion: 5,
                        sourceType: "script"
                    }
                }
            });

            const [{ messages }] = await eslint.lintText("let x");

            /*
             * if baseConfig was inserted before default configs,
             * `ecmaVersion: "latest"` from default configs would overwrite
             * `ecmaVersion: 5` from baseConfig, so this wouldn't be a parsing error.
             */

            assert.strictEqual(messages.length, 1);
            assert(messages[0].fatal, "Fatal error expected.");
        });

        it("should be inserted before configs from the config file", async () => {
            const eslint = new FlatESLint({
                cwd: getFixturePath(),
                baseConfig: {
                    rules: {
                        strict: ["error", "global"]
                    },
                    languageOptions: {
                        sourceType: "script"
                    }
                }
            });

            const [{ messages }] = await eslint.lintText("foo");

            /*
             * if baseConfig was inserted after configs from the config file,
             * `strict: 0` from eslint.config.js wouldn't overwrite `strict: ["error", "global"]`
             * from baseConfig, so there would be an error message from the `strict` rule.
             */

            assert.strictEqual(messages.length, 0);
        });

        it("should be inserted before overrideConfig", async () => {
            const eslint = new FlatESLint({
                overrideConfigFile: true,
                baseConfig: {
                    rules: {
                        semi: 2
                    }
                },
                overrideConfig: {
                    rules: {
                        semi: 1
                    }
                }
            });

            const [{ messages }] = await eslint.lintText("foo");

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
            assert.strictEqual(messages[0].severity, 1);
        });

        it("should be inserted before configs from the config file and overrideConfig", async () => {
            const eslint = new FlatESLint({
                overrideConfigFile: getFixturePath("eslint.config_with_rules.js"),
                baseConfig: {
                    rules: {
                        quotes: ["error", "double"],
                        semi: "error"
                    }
                },
                overrideConfig: {
                    rules: {
                        quotes: "warn"
                    }
                }
            });

            const [{ messages }] = await eslint.lintText('const foo = "bar"');

            /*
             * baseConfig: { quotes: ["error", "double"], semi: "error" }
             * eslint.config_with_rules.js: { quotes: ["error", "single"] }
             * overrideConfig: { quotes: "warn" }
             *
             * Merged config: { quotes: ["warn", "single"], semi: "error" }
             */

            assert.strictEqual(messages.length, 2);
            assert.strictEqual(messages[0].ruleId, "quotes");
            assert.strictEqual(messages[0].severity, 1);
            assert.strictEqual(messages[1].ruleId, "semi");
            assert.strictEqual(messages[1].severity, 2);
        });

        it("when it has 'files' they should be interpreted as relative to the config file", async () => {

            /*
             * `fixtures/plugins` directory does not have a config file.
             * It's parent directory `fixtures` does have a config file, so
             * the base path will be `fixtures`, cwd will be `fixtures/plugins`
             */
            const eslint = new FlatESLint({
                cwd: getFixturePath("plugins"),
                baseConfig: {
                    files: ["plugins/a.js"],
                    rules: {
                        semi: 2
                    }
                }
            });

            const [{ messages }] = await eslint.lintText("foo", { filePath: getFixturePath("plugins/a.js") });

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
        });

        it("when it has 'ignores' they should be interpreted as relative to the config file", async () => {

            /*
             * `fixtures/plugins` directory does not have a config file.
             * It's parent directory `fixtures` does have a config file, so
             * the base path will be `fixtures`, cwd will be `fixtures/plugins`
             */
            const eslint = new FlatESLint({
                cwd: getFixturePath("plugins"),
                baseConfig: {
                    ignores: ["plugins/a.js"]
                }
            });

            const [{ messages }] = await eslint.lintText("foo", { filePath: getFixturePath("plugins/a.js"), warnIgnored: true });

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].severity, 1);
            assert.match(messages[0].message, /ignored/u);
        });
    });

    describe("config file", () => {

        it("new instance of FlatESLint should use the latest version of the config file (ESM)", async () => {
            const cwd = path.join(getFixturePath(), `config_file_${Date.now()}`);
            const configFileContent = "export default [{ rules: { semi: ['error', 'always'] } }];";
            const teardown = createCustomTeardown({
                cwd,
                files: {
                    "package.json": '{ "type": "module" }',
                    "eslint.config.js": configFileContent,
                    "a.js": "foo\nbar;"
                }
            });

            await teardown.prepare();

            let eslint = new FlatESLint({ cwd });
            let [{ messages }] = await eslint.lintFiles(["a.js"]);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
            assert.strictEqual(messages[0].messageId, "missingSemi");
            assert.strictEqual(messages[0].line, 1);

            await sleep(100);
            await fsp.writeFile(path.join(cwd, "eslint.config.js"), configFileContent.replace("always", "never"));

            eslint = new FlatESLint({ cwd });
            [{ messages }] = await eslint.lintFiles(["a.js"]);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
            assert.strictEqual(messages[0].messageId, "extraSemi");
            assert.strictEqual(messages[0].line, 2);
        });

        it("new instance of FlatESLint should use the latest version of the config file (CJS)", async () => {
            const cwd = path.join(getFixturePath(), `config_file_${Date.now()}`);
            const configFileContent = "module.exports = [{ rules: { semi: ['error', 'always'] } }];";
            const teardown = createCustomTeardown({
                cwd,
                files: {
                    "eslint.config.js": configFileContent,
                    "a.js": "foo\nbar;"
                }
            });

            await teardown.prepare();

            let eslint = new FlatESLint({ cwd });
            let [{ messages }] = await eslint.lintFiles(["a.js"]);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
            assert.strictEqual(messages[0].messageId, "missingSemi");
            assert.strictEqual(messages[0].line, 1);

            await sleep(100);
            await fsp.writeFile(path.join(cwd, "eslint.config.js"), configFileContent.replace("always", "never"));

            eslint = new FlatESLint({ cwd });
            [{ messages }] = await eslint.lintFiles(["a.js"]);

            assert.strictEqual(messages.length, 1);
            assert.strictEqual(messages[0].ruleId, "semi");
            assert.strictEqual(messages[0].messageId, "extraSemi");
            assert.strictEqual(messages[0].line, 2);
        });
    });

    // only works on a Windows machine
    if (os.platform() === "win32") {

        // https://github.com/eslint/eslint/issues/17042
        describe("with cwd that is using forward slash on Windows", () => {
            const cwd = getFixturePath("example-app3");
            const cwdForwardSlash = cwd.replace(/\\/gu, "/");

            it("should correctly handle ignore patterns", async () => {
                const engine = new FlatESLint({ cwd: cwdForwardSlash });
                const results = await engine.lintFiles(["./src"]);

                // src/dist/2.js should be ignored
                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].filePath, path.join(cwd, "src\\1.js"));
            });

            it("should pass cwd with backslashes to rules", async () => {
                const engine = new FlatESLint({
                    cwd: cwdForwardSlash,
                    overrideConfigFile: true,
                    overrideConfig: {
                        plugins: {
                            test: require(path.join(cwd, "node_modules", "eslint-plugin-test"))
                        },
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
                const engine = new FlatESLint({
                    cwd: cwdForwardSlash
                });
                const results = await engine.lintText("");
                const formatter = await engine.loadFormatter("cwd");

                assert.strictEqual(formatter.format(results), cwd);
            });
        });
    }

});

describe("shouldUseFlatConfig", () => {

    /**
     * Check that `shouldUseFlatConfig` returns the expected value from a CWD
     * with a flat config and one without a flat config.
     * @param {boolean} expectedValueWithConfig the expected return value of
     * `shouldUseFlatConfig` when in a directory with a flat config present
     * @param {boolean} expectedValueWithoutConfig the expected return value of
     * `shouldUseFlatConfig` when in a directory without any flat config present
     * @returns {void}
     */
    function testShouldUseFlatConfig(expectedValueWithConfig, expectedValueWithoutConfig) {
        describe("when there is a flat config file present", () => {
            const originalDir = process.cwd();

            beforeEach(() => {
                process.chdir(__dirname);
            });

            afterEach(() => {
                process.chdir(originalDir);
            });

            it(`is \`${expectedValueWithConfig}\``, async () => {
                assert.strictEqual(await shouldUseFlatConfig(), expectedValueWithConfig);
            });
        });

        describe("when there is no flat config file present", () => {
            const originalDir = process.cwd();

            beforeEach(() => {
                process.chdir(os.tmpdir());
            });

            afterEach(() => {
                process.chdir(originalDir);
            });

            it(`is \`${expectedValueWithoutConfig}\``, async () => {
                assert.strictEqual(await shouldUseFlatConfig(), expectedValueWithoutConfig);
            });
        });
    }

    describe("when the env variable `ESLINT_USE_FLAT_CONFIG` is `'true'`", () => {
        beforeEach(() => {
            process.env.ESLINT_USE_FLAT_CONFIG = true;
        });

        afterEach(() => {
            delete process.env.ESLINT_USE_FLAT_CONFIG;
        });

        testShouldUseFlatConfig(true, true);
    });

    describe("when the env variable `ESLINT_USE_FLAT_CONFIG` is `'false'`", () => {
        beforeEach(() => {
            process.env.ESLINT_USE_FLAT_CONFIG = false;
        });

        afterEach(() => {
            delete process.env.ESLINT_USE_FLAT_CONFIG;
        });

        testShouldUseFlatConfig(false, false);
    });

    describe("when the env variable `ESLINT_USE_FLAT_CONFIG` is unset", () => {
        testShouldUseFlatConfig(true, false);
    });
});
