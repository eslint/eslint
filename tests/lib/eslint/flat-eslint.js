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
const hash = require("../../../lib/cli-engine/hash");
const { unIndent, createCustomTeardown } = require("../../_utils");
const coreRules = require("../../../lib/rules");

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

    /** @type {import("../../../lib/flat-eslint").FlatESLint} */
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

        it("should report one fatal message when given a path by --ignore-path that is not a file when ignore is true.", () => {
            assert.throws(() => {
                // eslint-disable-next-line no-new -- Check for throwing
                new FlatESLint({ ignorePath: fixtureDir });
            }, new RegExp(escapeStringRegExp(`Cannot read .eslintignore file: ${fixtureDir}\nError: EISDIR: illegal operation on a directory, read`), "u"));
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
                () => new FlatESLint({
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
                    configFile: "",
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

        it("should report the total and per file errors when using local cwd .eslintrc", async () => {
            eslint = new FlatESLint();
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
            eslint = new FlatESLint({
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
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should report one message when using specific config file", async () => {
            eslint = new FlatESLint({
                configFile: "tests/fixtures/configurations/quotes-error.js",
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
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
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
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath(".."),
                configFile: "eslint.config.js"
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
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].usedDeprecatedRules.length, 0);
        });

        it("should not return a warning when given a filename by --stdin-filename in excluded files list if warnIgnored is false", async () => {
            eslint = new FlatESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath(".."),
                configFile: "eslint.config.js"
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
            eslint = new FlatESLint({
                ignorePath: getFixturePath(".eslintignore"),
                cwd: getFixturePath(".."),
                configFile: "eslint.config.js"
            });
            const options = { filePath: "fixtures/passing.js" };
            const results = await eslint.lintText("var bar = foo;", options);

            // should not report anything because there are no errors
            assert.strictEqual(results.length, 0);
        });

        it("should return a message when given a filename by --stdin-filename in excluded files list and ignore is off", async () => {
            eslint = new FlatESLint({
                ignorePath: "fixtures/.eslintignore",
                cwd: getFixturePath(".."),
                ignore: false,
                configFile: false,
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
            eslint = new FlatESLint({
                configFile: false,
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
                    errorCount: 0,
                    warningCount: 0,
                    fatalErrorCount: 0,
                    fixableErrorCount: 0,
                    fixableWarningCount: 0,
                    output: "var bar = foo;",
                    usedDeprecatedRules: []
                }
            ]);
        });

        it("should return a message and omit fixed text when in fix mode and fixes aren't done", async () => {
            eslint = new FlatESLint({
                configFile: false,
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
                configFile: false,
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
                            column: 19
                        }
                    ],
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
                configFile: false,
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
                            column: 10
                        }
                    ],
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
                configFile: false,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });

        it("should return source code of file in `source` property when warnings are present", async () => {
            eslint = new FlatESLint({
                configFile: false,
                overrideConfig: {
                    rules: { semi: 1 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar'");

            assert.strictEqual(results[0].source, "var foo = 'bar'");
        });


        it("should not return a `source` property when no errors or warnings are present", async () => {
            eslint = new FlatESLint({
                configFile: false,
                overrideConfig: {
                    rules: { semi: 2 }
                }
            });
            const results = await eslint.lintText("var foo = 'bar';");

            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[0].source, void 0);
        });

        it("should not return a `source` property when fixes are applied", async () => {
            eslint = new FlatESLint({
                configFile: false,
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
                configFile: false,
                overrideConfig: {
                    rules: { semi: 2 }
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
                            column: 19
                        }
                    ],
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
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                ignore: false
            });
            const results = await eslint.lintText("var bar = foo;", { filePath: "node_modules/passing.js", warnIgnored: true });
            const expectedMsg = "File ignored by default. Use \"--ignore-pattern '!node_modules/*'\" to override.";

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, getFixturePath("node_modules/passing.js"));
            assert.strictEqual(results[0].messages[0].message, expectedMsg);
        });

        it("should warn when deprecated rules are found in a config", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                configFile: "tests/fixtures/cli-engine/deprecated-rule-config/eslint.config.js"
            });
            const [result] = await eslint.lintText("foo");

            assert.deepStrictEqual(
                result.usedDeprecatedRules,
                [{ ruleId: "indent-legacy", replacedBy: ["indent"] }]
            );
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
    });

    describe("lintFiles()", () => {

        /** @type {InstanceType<import("../../../lib/eslint").ESLint>} */
        let eslint;

        it("should use correct parser when custom parser is specified", async () => {
            const filePath = path.resolve(__dirname, "../../fixtures/configurations/parser/custom.js");
            
            eslint = new FlatESLint({
                cwd: originalDir,
                ignore: false,
                configFile: false,
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
        });

        it("should report zero messages when given a config file and a valid file", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                configFile: "eslint.config.js"
            });
            const results = await eslint.lintFiles(["lib/**/cli*.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should handle multiple patterns with overlapping files", async () => {
            eslint = new FlatESLint({
                cwd: originalDir,
                configFile: "eslint.config.js"
            });
            const results = await eslint.lintFiles(["lib/**/cli*.js", "lib/cli.?s", "lib/{cli,cli-engine/cli-engine}.js"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
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
                configFile: false
            });
            const results = await eslint.lintFiles(["lib/cli.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should report zero messages when given a config file and a valid file and esprima as parser", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    languageOptions: {
                        parser: require("esprima")
                    }
                },
                configFile: false,
                ignore: false
            });
            const results = await eslint.lintFiles(["tests/fixtures/passing.js"]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should throw an error when given a config file and a valid file and invalid parser", async () => {
            eslint = new FlatESLint({
                overrideConfig: {
                    languageOptions: {
                        parser: "test11"
                    }
                },
                configFile: false
            });

            await assert.rejects(async () => await eslint.lintFiles(["lib/cli.js"]), /Expected string in the form "pluginName\/objectName" but found "test11"/u);
        });

        it("should report zero messages when given a directory with a .js2 file", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                extensions: [".js2"],
                configFile: getFixturePath("eslint.config.js"),
            });
            const results = await eslint.lintFiles([getFixturePath("files/foo.js2")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0);
        });

        it("should fall back to defaults when extensions is set to an empty array", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                configFile: false,
                ignore: false,
                overrideConfig: {
                    rules: {
                        quotes: ["error", "double"]
                    }
                },
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
            eslint = new FlatESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath(".."),
                configFile: getFixturePath("eslint.config.js"),
            });
            const results = await eslint.lintFiles(["fixtures/files/"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should report zero messages when given a '**' pattern with a .js and a .js2 file", async () => {
            eslint = new FlatESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("eslint.config.js"),

            });
            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should resolve globs when 'globInputPaths' option is true", async () => {
            eslint = new FlatESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath(".."),
                configFile: getFixturePath("eslint.config.js"),

            });
            const results = await eslint.lintFiles(["fixtures/files/*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should not resolve globs when 'globInputPaths' option is false", async () => {
            eslint = new FlatESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: getFixturePath(".."),
                configFile: false,
                globInputPaths: false
            });

            await assert.rejects(async () => {
                await eslint.lintFiles(["fixtures/files/*"]);
            }, /No files matching 'fixtures\/files\/\*' were found \(glob was disabled\)\./u);
        });

        describe("Ignoring Files", () => {

            it("should report on all files passed explicitly, even if ignored by default", async () => {
                eslint = new FlatESLint({
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

            it("should report on globs with explicit inclusion of dotfiles", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    configFile: false,
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
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    configFile: false
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["node_modules"]);
                }, /All files matched by 'node_modules\/\*\*\/\*.js' are ignored\./u);
            });

            // https://github.com/eslint/eslint/issues/5547
            it("should not check node_modules files even with --no-ignore flag", async () => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    ignore: false
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["node_modules"]);
                }, /All files matched by 'node_modules\/\*\*\/\*\.js' are ignored\./u);
            });

            it("should throw an error when given a directory with all eslint excluded files in the directory", async () => {
                eslint = new FlatESLint({
                    ignorePath: getFixturePath(".eslintignore")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles([getFixturePath("./cli-engine/")]);
                }, /All files matched by '.*?cli-engine[\\/]\*\*[\\/]\*\.js' are ignored/u);
            });

            it("should throw an error when all given files are ignored", async () => {
                eslint = new FlatESLint({
                    ignorePath: getFixturePath(".eslintignore")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["tests/fixtures/cli-engine/"]);
                }, /All files matched by 'tests\/fixtures\/cli-engine\/\*\*\/\*\.js' are ignored\./u);
            });

            it("should throw an error when all given files are ignored even with a `./` prefix", async () => {
                eslint = new FlatESLint({
                    ignorePath: getFixturePath(".eslintignore")
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
                }, /All files matched by 'tests\/fixtures\/cli-engine\/\*\*\/\*\.js' are ignored\./u);
            });

            // https://github.com/eslint/eslint/issues/3788
            it("should ignore one-level down node_modules when ignore file has 'node_modules/' in it", async () => {
                eslint = new FlatESLint({
                    ignorePath: getFixturePath("cli-engine", "nested_node_modules", ".eslintignore"),
                    configFile: false,
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
            it("should ignore all files and throw an error when fixtures/ is in ignore file", async () => {
                eslint = new FlatESLint({
                    ignorePath: getFixturePath("cli-engine/.eslintignore2"),
                    configFile: false,
                    overrideConfig: {
                        rules: {
                            quotes: [2, "double"]
                        }
                    }
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["./tests/fixtures/cli-engine/"]);
                }, /All files matched by 'tests\/fixtures\/cli-engine\/\*\*\/\*\.js' are ignored\./u);
            });

            it("should throw an error when all given files are ignored via ignore-pattern", async () => {
                eslint = new FlatESLint({
                    overrideConfig: {
                        ignorePatterns: "tests/fixtures/single-quoted.js"
                    }
                });

                await assert.rejects(async () => {
                    await eslint.lintFiles(["tests/fixtures/*-quoted.js"]);
                }, /All files matched by 'tests\/fixtures\/\*-quoted\.js' are ignored\./u);
            });

            it("should return a warning when an explicitly given file is ignored", async () => {
                eslint = new FlatESLint({
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
                eslint = new FlatESLint({
                    cwd: getFixturePath(),
                    ignorePath: getFixturePath(".eslintignore"),
                    ignore: false,
                    configFile: false,
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
        });
        

        it("should report zero messages when given a pattern with a .js and a .js2 file", async () => {
            eslint = new FlatESLint({
                extensions: [".js", ".js2"],
                ignore: false,
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
            });
            const results = await eslint.lintFiles(["fixtures/files/*.?s*"]);

            assert.strictEqual(results.length, 2);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(results[1].messages.length, 0);
        });

        it("should return one error message when given a config with rules with options and severity level set to error", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                configFile: false,
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
            assert.strictEqual(results[0].fixableErrorCount, 1);
            assert.strictEqual(results[0].fixableWarningCount, 0);
        });

        it("should return 5 results when given a config and a directory of 5 valid files", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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
            assert.strictEqual(results[0].fixableErrorCount, 0);
            assert.strictEqual(results[0].fixableWarningCount, 0);
            assert.strictEqual(results[0].messages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[1].filePath), "broken.js");
            assert.strictEqual(results[1].errorCount, 0);
            assert.strictEqual(results[1].warningCount, 0);
            assert.strictEqual(results[1].fixableErrorCount, 0);
            assert.strictEqual(results[1].fixableWarningCount, 0);
            assert.strictEqual(results[1].messages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[2].filePath), "cwd.js");
            assert.strictEqual(results[2].errorCount, 0);
            assert.strictEqual(results[2].warningCount, 0);
            assert.strictEqual(results[2].fixableErrorCount, 0);
            assert.strictEqual(results[2].fixableWarningCount, 0);
            assert.strictEqual(results[2].messages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[3].filePath), "simple.js");
            assert.strictEqual(results[3].errorCount, 0);
            assert.strictEqual(results[3].warningCount, 0);
            assert.strictEqual(results[3].fixableErrorCount, 0);
            assert.strictEqual(results[3].fixableWarningCount, 0);
            assert.strictEqual(results[3].messages.length, 0);
            assert.strictEqual(path.relative(formattersDir, results[4].filePath), path.join("test", "simple.js"));
            assert.strictEqual(results[4].errorCount, 0);
            assert.strictEqual(results[4].warningCount, 0);
            assert.strictEqual(results[4].fixableErrorCount, 0);
            assert.strictEqual(results[4].fixableWarningCount, 0);
            assert.strictEqual(results[4].messages.length, 0);
        });

        it("should return zero messages when given a config with browser globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-browser.js")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-browser.js"))]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have no messages.");
        });

        it("should return zero messages when given an option to add browser globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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
        });

        it("should return zero messages when given a config with sourceType set to commonjs and Node.js globals", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("configurations", "env-node.js")
            });
            const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("globals-node.js"))]);
            
            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have no messages.");
        });

        it("should not return results from previous call when calling more than once", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: getFixturePath("eslint.config.js"),
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

        it("should return zero messages when executing a file with a shebang", async () => {
            eslint = new FlatESLint({
                ignore: false,
                cwd: getFixturePath(),
                configFile: getFixturePath("eslint.config.js")
            });
            const results = await eslint.lintFiles([getFixturePath("shebang.js")]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].messages.length, 0, "Should have lint messages.");
        });

        it("should return zero messages when executing without a config file", async () => {
            eslint = new FlatESLint({
                cwd: getFixturePath(),
                ignore: false,
                configFile: false
            });
            const filePath = fs.realpathSync(getFixturePath("missing-semicolon.js"));
            const results = await eslint.lintFiles([filePath]);

            assert.strictEqual(results.length, 1);
            assert.strictEqual(results[0].filePath, filePath);
            assert.strictEqual(results[0].messages.length, 0);
        });

        // working
        describe("Deprecated Rules", () => {

            it("should warn when deprecated rules are configured", async () => {
                eslint = new FlatESLint({
                    cwd: originalDir,
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
                    overrideConfig: {
                        rules: { indent: 1, "valid-jsdoc": 0, "require-jsdoc": 0 }
                    }
                });
                const results = await eslint.lintFiles(["lib/cli*.js"]);

                assert.deepStrictEqual(results[0].usedDeprecatedRules, []);
            });

            it("should warn when deprecated rules are found in a config", async () => {
                eslint = new FlatESLint({
                    cwd: originalDir,
                    configFile: "tests/fixtures/cli-engine/deprecated-rule-config/eslint.config.js",
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
                    configFile: false,
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
                    configFile: false,
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
                    configFile: false,
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
                        errorCount: 0,
                        warningCount: 0,
                        fatalErrorCount: 0,
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
                        fatalErrorCount: 0,
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
                        fatalErrorCount: 0,
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
                        fatalErrorCount: 0,
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
                    configFile: false,
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
                    configFile: getFixturePath("configurations", "plugins-with-prefix.js"),
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test/test-custom-rule.js"))]);
                
                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2, "Expected two messages.");
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies a plugin", async () => {
                eslint = eslintWithPlugins({
                    cwd: path.resolve(fixtureDir, ".."),
                    configFile: false,
                    overrideConfig: {
                        rules: { "example/example-rule": 1 }
                    }
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("rules", "test", "test-custom-rule.js"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
                assert.strictEqual(results[0].messages[0].ruleId, "example/example-rule");
            });

            it("should return two messages when executing with cli option that specifies preloaded plugin", async () => {
                eslint = new FlatESLint({
                    cwd: path.resolve(fixtureDir, ".."),
                    configFile: false,
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
            });
        });

        xdescribe("cache", () => {

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

                it("should create the cache file inside the provided directory", async () => {
                    assert(!shell.test("-d", path.resolve("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory")), "the cache for eslint does not exist");

                    eslint = new FlatESLint({
                        configFile: false,

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

                    assert(shell.test("-f", path.resolve(`./tmp/.cacheFileDir/.cache_${hash(process.cwd())}`)), "the cache for eslint was created");

                    sinon.restore();
                });
            });

            it("should create the cache file inside the provided directory using the cacheLocation option", async () => {
                assert(!shell.test("-d", path.resolve("./tmp/.cacheFileDir/.cache_hashOfCurrentWorkingDirectory")), "the cache for eslint does not exist");

                eslint = new FlatESLint({
                    configFile: false,

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

                assert(shell.test("-f", path.resolve(`./tmp/.cacheFileDir/.cache_${hash(process.cwd())}`)), "the cache for eslint was created");

                sinon.restore();
            });

            it("should create the cache file inside cwd when no cacheLocation provided", async () => {
                const cwd = path.resolve(getFixturePath("cli-engine"));

                eslint = new FlatESLint({
                    configFile: false,
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

                assert(shell.test("-f", path.resolve(cwd, ".eslintcache")), "the cache for eslint was created at provided cwd");
            });

            it("should invalidate the cache if the configuration changed between executions", async () => {
                assert(!shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                eslint = new FlatESLint({
                    configFile: false,

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
                    assert.strictEqual(errorCount + warningCount, 0, "the file passed without errors or warnings");
                }
                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                eslint = new FlatESLint({
                    configFile: false,

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

                const [cachedResult] = await eslint.lintFiles([file]);

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed because the config changed");
                assert.strictEqual(cachedResult.errorCount, 1, "since configuration changed the cache was not used an one error was reported");
                assert(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");
            });

            it("should remember the files from a previous run and do not operate on them if not changed", async () => {
                assert(!shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint does not exist");

                eslint = new FlatESLint({
                    configFile: false,

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

                assert.strictEqual(spy.getCall(0).args[0], file, "the module read the file because is considered changed");
                assert(shell.test("-f", path.resolve(".eslintcache")), "the cache for eslint was created");

                // destroy the spy
                sinon.restore();

                eslint = new FlatESLint({
                    configFile: false,

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

                assert.deepStrictEqual(result, cachedResult, "the result is the same regardless of using cache or not");

                // assert the file was not processed because the cache was used
                assert(!spy.calledWith(file), "the file was not loaded because it used the cache");
            });

            it("should remember the files from a previous run and do not operate on then if not changed", async () => {
                const cacheLocation = getFixturePath(".eslintcache");
                const eslintOptions = {
                    configFile: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"],
                    cwd: path.join(fixtureDir, "..")
                };

                assert(!shell.test("-f", cacheLocation), "the cache for eslint does not exist");

                eslint = new FlatESLint(eslintOptions);

                let file = getFixturePath("cache/src", "test-file.js");

                file = fs.realpathSync(file);

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheLocation), "the cache for eslint was created");

                eslintOptions.cache = false;
                eslint = new FlatESLint(eslintOptions);

                await eslint.lintFiles([file]);

                assert(!shell.test("-f", cacheLocation), "the cache for eslint was deleted since last run did not used the cache");
            });

            it("should store in the cache a file that failed the test", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                assert(!shell.test("-f", cacheLocation), "the cache for eslint does not exist");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
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

                assert(shell.test("-f", cacheLocation), "the cache for eslint was created");
                const fileCache = fCache.createFromFile(cacheLocation);
                const { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(goodFile), "object", "the entry for the good file is in the cache");
                assert.strictEqual(typeof cache.getKey(badFile), "object", "the entry for the bad file is in the cache");
                const cachedResult = await eslint.lintFiles([badFile, goodFile]);

                assert.deepStrictEqual(result, cachedResult, "result is the same with or without cache");
            });

            it("should not contain in the cache a file that was deleted", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                doDelete(cacheLocation);

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
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
                const fileCache = fCache.createFromFile(cacheLocation);
                let { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(toBeDeletedFile), "object", "the entry for the file to be deleted is in the cache");

                // delete the file from the file system
                fs.unlinkSync(toBeDeletedFile);

                /*
                 * file-entry-cache@2.0.0 will remove from the cache deleted files
                 * even when they were not part of the array of files to be analyzed
                 */
                await eslint.lintFiles([badFile, goodFile]);

                cache = JSON.parse(fs.readFileSync(cacheLocation));

                assert.strictEqual(typeof cache[toBeDeletedFile], "undefined", "the entry for the file to be deleted is not in the cache");
            });

            it("should contain files that were not visited in the cache provided they still exist", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                doDelete(cacheLocation);

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,

                    // specifying cache true the cache will be created
                    cache: true,
                    cacheLocation,
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

                let fileCache = fCache.createFromFile(cacheLocation);
                let { cache } = fileCache;

                assert.strictEqual(typeof cache.getKey(testFile2), "object", "the entry for the test-file2 is in the cache");

                /*
                 * we pass a different set of files minus test-file2
                 * previous version of file-entry-cache would remove the non visited
                 * entries. 2.0.0 version will keep them unless they don't exist
                 */
                await eslint.lintFiles([badFile, goodFile]);

                fileCache = fCache.createFromFile(cacheLocation);
                cache = fileCache.cache;

                assert.strictEqual(typeof cache.getKey(testFile2), "object", "the entry for the test-file2 is in the cache");
            });

            it("should not delete cache when executing on text", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,
                    cacheLocation,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });

                assert(shell.test("-f", cacheLocation), "the cache for eslint exists");

                await eslint.lintText("var foo = 'bar';");

                assert(shell.test("-f", cacheLocation), "the cache for eslint still exists");
            });

            it("should not delete cache when executing on text with a provided filename", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,
                    cacheLocation,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });

                assert(shell.test("-f", cacheLocation), "the cache for eslint exists");

                await eslint.lintText("var bar = foo;", { filePath: "fixtures/passing.js" });

                assert(shell.test("-f", cacheLocation), "the cache for eslint still exists");
            });

            it("should not delete cache when executing on files with --cache flag", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,
                    cache: true,
                    cacheLocation,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const file = getFixturePath("cli-engine", "console.js");

                assert(shell.test("-f", cacheLocation), "the cache for eslint exists");

                await eslint.lintFiles([file]);

                assert(shell.test("-f", cacheLocation), "the cache for eslint still exists");
            });

            it("should delete cache when executing on files without --cache flag", async () => {
                const cacheLocation = getFixturePath(".eslintcache");

                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,
                    cacheLocation,
                    overrideConfig: {
                        rules: {
                            "no-console": 0,
                            "no-unused-vars": 2
                        }
                    },
                    extensions: ["js"]
                });
                const file = getFixturePath("cli-engine", "console.js");

                assert(shell.test("-f", cacheLocation), "the cache for eslint exists");

                await eslint.lintFiles([file]);

                assert(!shell.test("-f", cacheLocation), "the cache for eslint has been deleted");
            });

            describe("cacheFile", () => {
                it("should use the specified cache file", async () => {
                    const customCacheFile = path.resolve(".cache/custom-cache");

                    assert(!shell.test("-f", customCacheFile), "the cache for eslint does not exist");

                    eslint = new FlatESLint({
                        configFile: false,

                        // specify a custom cache file
                        cacheLocation: customCacheFile,

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

                    assert(shell.test("-f", customCacheFile), "the cache for eslint was created");
                    const fileCache = fCache.createFromFile(customCacheFile);
                    const { cache } = fileCache;

                    assert(typeof cache.getKey(goodFile) === "object", "the entry for the good file is in the cache");

                    assert(typeof cache.getKey(badFile) === "object", "the entry for the bad file is in the cache");
                    const cachedResult = await eslint.lintFiles([badFile, goodFile]);

                    assert.deepStrictEqual(result, cachedResult, "result is the same with or without cache");
                });
            });

            describe("cacheStrategy", () => {
                it("should detect changes using a file's modification time when set to 'metadata'", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");

                    doDelete(cacheLocation);

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        configFile: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation,
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
                    let fileCache = fCache.createFromFile(cacheLocation);
                    const entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheLocation);
                    assert(fileCache.getFileDescriptor(badFile).changed === false, `the entry for ${badFile} is unchanged`);
                    assert(fileCache.getFileDescriptor(goodFile).changed === true, `the entry for ${goodFile} is changed`);
                });

                it("should not detect changes using a file's modification time when set to 'content'", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");

                    doDelete(cacheLocation);

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        configFile: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation,
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
                    let fileCache = fCache.createFromFile(cacheLocation, true);
                    let entries = fileCache.normalizeEntries([badFile, goodFile]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should NOT result in a changed entry
                    shell.touch(goodFile);
                    fileCache = fCache.createFromFile(cacheLocation, true);
                    entries = fileCache.normalizeEntries([badFile, goodFile]);
                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} remains unchanged`);
                    });
                });

                it("should detect changes using a file's contents when set to 'content'", async () => {
                    const cacheLocation = getFixturePath(".eslintcache");

                    doDelete(cacheLocation);

                    eslint = new FlatESLint({
                        cwd: path.join(fixtureDir, ".."),
                        configFile: false,

                        // specifying cache true the cache will be created
                        cache: true,
                        cacheLocation,
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
                    let fileCache = fCache.createFromFile(cacheLocation, true);
                    const entries = fileCache.normalizeEntries([badFile, goodFileCopy]);

                    entries.forEach(entry => {
                        assert(entry.changed === false, `the entry for ${entry.key} is initially unchanged`);
                    });

                    // this should result in a changed entry
                    shell.sed("-i", "abc", "xzy", goodFileCopy);
                    fileCache = fCache.createFromFile(cacheLocation, true);
                    assert(fileCache.getFileDescriptor(badFile).changed === false, `the entry for ${badFile} is unchanged`);
                    assert(fileCache.getFileDescriptor(goodFileCopy).changed === true, `the entry for ${goodFileCopy} is changed`);
                });
            });
        });

        describe("processors", () => {

            it("should return two messages when executing with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    configFile: false,
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
                            files: ["**/*.txt/*.txt"],
                        }
                    ],

                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([fs.realpathSync(getFixturePath("processors", "test", "test-processor.txt"))]);

                assert.strictEqual(results.length, 1);
                assert.strictEqual(results[0].messages.length, 2);
            });

            it("should run processors when calling lintFiles with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    configFile: false,
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
                            files: ["**/*.txt/*.txt"],
                        }
                    ],
                    extensions: ["js", "txt"],
                    cwd: path.join(fixtureDir, "..")
                });
                const results = await eslint.lintFiles([getFixturePath("processors", "test", "test-processor.txt")]);

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintText with config file that specifies preloaded processor", async () => {
                eslint = new FlatESLint({
                    configFile: false,
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
                            files: ["**/*.txt/*.txt"],
                        }
                    ],
                    extensions: ["js", "txt"],
                    ignore: false,
                });
                const results = await eslint.lintText("function a() {console.log(\"Test\");}", { filePath: "tests/fixtures/processors/test/test-processor.txt" });

                assert.strictEqual(results[0].messages[0].message, "'b' is defined but never used.");
                assert.strictEqual(results[0].messages[0].ruleId, "post-processed");
            });

            it("should run processors when calling lintText with processor resolves same extension but different content correctly", async () => {
                let count = 0;

                eslint = new FlatESLint({
                    configFile: false,
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
                        }
                    ],
                    extensions: ["txt"],
                    ignore: false
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
                    eslint = new FlatESLint({
                        configFile: false,
                        overrideConfig: {
                            files: ["**/*.html"],
                            plugins: {
                                test: { processors: { "html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR) } }
                            },
                            processor: "test/html",
                            rules: {
                                semi: 2
                            }
                        },
                        extensions: ["js", "txt"],
                        ignore: false,
                        fix: true
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 0);
                    assert.strictEqual(results[0].output, "<script>foo;</script>");
                });

                it("should not run in autofix mode when using a processor that does not support autofixing", async () => {
                    eslint = new FlatESLint({
                        configFile: false,
                        overrideConfig: {
                            files: ["**/*.html"],
                            plugins: {
                                test: { processors: { "html": HTML_PROCESSOR } }
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
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
                });

                it("should not run in autofix mode when `fix: true` is not provided, even if the processor supports autofixing", async () => {
                    eslint = new FlatESLint({
                        configFile: false,
                        overrideConfig: {
                            files: ["**/*.html"],
                            plugins: {
                                test: { processors: { "html": Object.assign({ supportsAutofix: true }, HTML_PROCESSOR) } }
                            },
                            processor: "test/html",
                            rules: {
                                semi: 2
                            }
                        },
                        extensions: ["js", "txt"],
                        ignore: false
                    });
                    const results = await eslint.lintText("<script>foo</script>", { filePath: "foo.html" });

                    assert.strictEqual(results[0].messages.length, 1);
                    assert(!Object.prototype.hasOwnProperty.call(results[0], "output"));
                });
            });
        });

        describe("Patterns which match no file should throw errors.", () => {
            beforeEach(() => {
                eslint = new FlatESLint({
                    cwd: getFixturePath("cli-engine"),
                    configFile: false
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
                }, /No files matching 'empty\/\*\*\/\*\.js' were found\./u);
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
            afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

            it("should lint only JavaScript blocks if '--ext' was not given.", async () => {
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
            });

            it("should fix only JavaScript blocks if '--ext' was not given.", async () => {
                const teardown = createCustomTeardown({
                    cwd: path.join(root, id),
                    files: {
                        ...commonFiles,
                        "eslint.config.js": `module.exports = [
                            {
                                plugins: {
                                    markdown: require("eslint-plugin-markdown")
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
                eslint = new FlatESLint({ cwd: teardown.getPath(), fix: true });
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
                eslint = new FlatESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
                const results = await eslint.lintFiles(["test.md"]);
                
                assert.strictEqual(results.length, 1, "Should have one result.");
                assert.strictEqual(results[0].messages.length, 2, "Should have two messages.");
                assert.strictEqual(results[0].messages[0].ruleId, "semi"); // JS block
                assert.strictEqual(results[0].messages[0].line, 2, "First error should be on line 2");
                assert.strictEqual(results[0].messages[1].ruleId, "semi"); // JS block in HTML block
                assert.strictEqual(results[0].messages[1].line, 7, "Second error should be on line 7.");
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
                eslint = new FlatESLint({ cwd: teardown.getPath(), extensions: ["js", "html"], fix: true });
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
                eslint = new FlatESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
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
                eslint = new FlatESLint({ cwd: teardown.getPath(), extensions: ["js", "html"] });
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
                assert.strictEqual(messages[0].message, "'/*globals*/' has no effect because you have 'noInlineConfig' setting in your config.");
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
                });
            });
        });

        it("should throw if non-boolean value is given to 'options.warnIgnored' option", async () => {
            eslint = new FlatESLint();
            await assert.rejects(() => eslint.lintFiles(777), /'patterns' must be a non-empty string or an array of non-empty strings/u);
            await assert.rejects(() => eslint.lintFiles([null]), /'patterns' must be a non-empty string or an array of non-empty strings/u);
        });
    });


    xdescribe("Fix Types", () => {

        let eslint;

        it("should throw an error when an invalid fix type is specified", () => {
            assert.throws(() => {
                eslint = new FlatESLint({
                    cwd: path.join(fixtureDir, ".."),
                    configFile: false,
                    fix: true,
                    fixTypes: ["layou"]
                });
            }, /'fixTypes' must be an array of any of "directive", "problem", "suggestion", and "layout"\./iu);
        });

        it("should not fix any rules when fixTypes is used without fix", async () => {
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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
                configFile: false,
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
                configFile: false,
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
                configFile: false,
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
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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
            eslint = new FlatESLint({
                cwd: path.join(fixtureDir, ".."),
                configFile: false,
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

    xdescribe("calculateConfigForFile", () => {
        it("should return the info from Config#getConfig when called", async () => {
            const options = {
                configFile: getFixturePath("configurations", "quotes-error.json")
            };
            const engine = new FlatESLint(options);
            const filePath = getFixturePath("single-quoted.js");
            const actualConfig = await engine.calculateConfigForFile(filePath);
            const expectedConfig = new CascadingConfigArrayFactory({ specificConfigPath: options.overrideConfigFile })
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should return the config for a file that doesn't exist", async () => {
            const engine = new FlatESLint();
            const filePath = getFixturePath("does_not_exist.js");
            const existingSiblingFilePath = getFixturePath("single-quoted.js");
            const actualConfig = await engine.calculateConfigForFile(filePath);
            const expectedConfig = await engine.calculateConfigForFile(existingSiblingFilePath);

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should return the config for a virtual file that is a child of an existing file", async () => {
            const engine = new FlatESLint();
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
            const engine = new FlatESLint(options);
            const filePath = getFixturePath("config-hierarchy", "root-true", "parent", "root", ".eslintrc");
            const actualConfig = await engine.calculateConfigForFile("./.eslintrc");
            const expectedConfig = new CascadingConfigArrayFactory(options)
                .getConfigArrayForFile(filePath)
                .extractConfig(filePath)
                .toCompatibleObjectAsConfigFileContent();

            assert.deepStrictEqual(actualConfig, expectedConfig);
        });

        it("should throw an error if a directory path was given.", async () => {
            const engine = new FlatESLint();

            try {
                await engine.calculateConfigForFile(".");
            } catch (error) {
                assert.strictEqual(error.messageTemplate, "print-config-with-directory-path");
                return;
            }
            assert.fail("should throw an error");
        });

        it("should throw if non-string value is given to 'filePath' parameter", async () => {
            const eslint = new FlatESLint();

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
            const engine = new FlatESLint(options);
            const filePath = getFixturePath("single-quoted.js");

            await assert.rejects(
                () => engine.calculateConfigForFile(filePath),
                /Configuration for rule "no-alert" is invalid:/u
            );
        });
    });

    describe("isPathIgnored", () => {
        it("should check if the given path is ignored", async () => {
            const engine = new FlatESLint({
                ignorePath: getFixturePath(".eslintignore2"),
                cwd: getFixturePath()
            });

            assert(await engine.isPathIgnored("undef.js"));
            assert(!await engine.isPathIgnored("passing.js"));
        });

        it("should return false if ignoring is disabled", async () => {
            const engine = new FlatESLint({
                ignore: false,
                ignorePath: getFixturePath(".eslintignore2"),
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

            it("should allow subfolders of defaultPatterns to be unignored by ignorePattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    cwd,
                    configFile: false,
                    ignorePatterns: "!/node_modules/package"
                });

                const result = await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "package", "file.js"));

                assert(!result, "File should not be ignored");
            });

            it("should allow subfolders of defaultPatterns to be unignored by ignorePath", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    cwd,
                    configFile: false,
                    ignorePath: getFixturePath("ignored-paths", ".eslintignoreWithUnignoredDefaults")
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

            it("should ignore /node_modules/ relative to .eslintignore when loaded", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePath: getFixturePath("ignored-paths", ".eslintignore"), cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules", "existing.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo", "node_modules", "existing.js")));
            });

            it("should ignore /node_modules/ relative to cwd without an .eslintignore", async () => {
                const cwd = getFixturePath("ignored-paths", "no-ignore-file");
                const engine = new FlatESLint({ cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "node_modules", "existing.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "no-ignore-file", "foo", "node_modules", "existing.js")));
            });
        });

        describe("with no .eslintignore file", () => {
            it("should not travel to parent directories to find .eslintignore when it's missing and cwd is provided", async () => {
                const cwd = getFixturePath("ignored-paths", "configurations");
                const engine = new FlatESLint({ cwd });

                // a .eslintignore in parent directories includes `*.js`, but don't load it.
                assert(!await engine.isPathIgnored("foo.js"));
                assert(await engine.isPathIgnored("node_modules/foo.js"));
            });

            it("should return false for files outside of the cwd (with no ignore file provided)", async () => {

                // Default ignore patterns should not inadvertently ignore files in parent directories
                const engine = new FlatESLint({ cwd: getFixturePath("ignored-paths", "no-ignore-file") });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });
        });

        describe("with .eslintignore file or package.json file", () => {
            it("should load .eslintignore from cwd when explicitly passed", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ cwd });

                // `${cwd}/.eslintignore` includes `sampleignorepattern`.
                assert(await engine.isPathIgnored("sampleignorepattern"));
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
                    configFile: false
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
                const engine = new FlatESLint({ ignorePatterns: ["undef.js"], cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should return false for file in subfolder of cwd matching an ignore pattern with leading '/'", async () => {
                const cwd = getFixturePath("ignored-paths");
                const filePath = getFixturePath("ignored-paths", "subdir", "undef.js");
                const engine = new FlatESLint({
                    ignorePatterns: ["/undef.js"],
                    configFile: false,
                    cwd
                });

                assert(!await engine.isPathIgnored(filePath));
            });

            it("should return true for file matching a child of an ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["ignore-pattern"], cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "ignore-me.txt")));
            });

            it("should return true for file matching a grandchild of an ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["ignore-pattern"], cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "ignore-pattern", "subdir", "ignore-me.txt")));
            });

            it("should return false for file not matching any ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({ ignorePatterns: ["failing.js"], cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "unignored.js")));
            });

            it("two globstar '**' ignore pattern should ignore files in nested directories", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    configFile: false,
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

        describe("with ignorePath option", () => {
            it("initialization with ignorePath should work when cwd is a parent directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("custom-name/foo.js"));
            });

            it("initialization with ignorePath should work when the file is in the cwd", async () => {
                const cwd = getFixturePath("ignored-paths", "custom-name");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("foo.js"));
            });

            it("initialization with ignorePath should work when cwd is a subdirectory", async () => {
                const cwd = getFixturePath("ignored-paths", "custom-name", "subdirectory");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("../custom-name/foo.js"));
            });

            it("missing ignore file should throw error", done => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "not-a-directory", ".foobaz");
                const engine = new FlatESLint({ ignorePath, cwd });

                engine.isPathIgnored("foo.js").then(() => {
                    assert.fail("missing file should not succeed");
                }).catch(error => {
                    assert(/Cannot read ignore file/u.test(error));
                    done();
                });
            });

            it("should return false for files outside of ignorePath's directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "custom-name", "ignore-file");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
            });

            it("should resolve relative paths from CWD", async () => {
                const cwd = getFixturePath("ignored-paths", "subdir");

                // /undef.js in ignore file
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new FlatESLint({ ignorePath, cwd, configFile: false });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")), "subdir/undef.js should be ignored");
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/subdir/undef.js")), "subdir/subdir/undef.js should not be ignored");
            });

            it("should resolve relative paths from CWD when it's in a child directory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/undef.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "undef.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "foo.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "subdir/foo.js")));

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "node_modules/bar.js")));
            });

            it("should resolve relative paths from CWD when it contains negated globs", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new FlatESLint({
                    ignorePath,
                    cwd,
                    overrideConfig: {
                        files: ["**/*.txt"]
                    }
                });

                assert(await engine.isPathIgnored("subdir/blah.txt"), "subdir/blah.txt should be ignore");
                assert(await engine.isPathIgnored("blah.txt"), "blah.txt should be ignored");
                assert(await engine.isPathIgnored("subdir/bar.txt"), "subdir/bar.txt should be ignored");
                assert(!await engine.isPathIgnored("bar.txt"), "bar.txt should not be ignored");
                assert(!await engine.isPathIgnored("baz.txt"), "baz.txt should not be ignored");
                assert(!await engine.isPathIgnored("subdir/baz.txt"), "subdir/baz.txt should not be ignored");
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a subdirectory", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "subdir/.eslintignoreInChildDir");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should resolve default ignore patterns from the CWD even when the ignorePath is in a parent directory", async () => {
                const cwd = getFixturePath("ignored-paths", "subdir");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreForDifferentCwd");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored("node_modules/blah.js"));
            });

            it("should handle .eslintignore which contains CRLF correctly.", async () => {
                const ignoreFileContent = fs.readFileSync(getFixturePath("ignored-paths", "crlf/.eslintignore"), "utf8");

                assert(ignoreFileContent.includes("\r"), "crlf/.eslintignore should contains CR.", "Ignore file must have CRLF for test to pass.");
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", "crlf/.eslintignore");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide1/a.js")));
                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide2/a.js")));
                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "crlf/hide3/a.js")));
            });

            it("should ignore a non-negated pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(await engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "ignore.js")));
            });

            it("should not ignore a negated pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const ignorePath = getFixturePath("ignored-paths", ".eslintignoreWithNegation");
                const engine = new FlatESLint({ ignorePath, cwd });

                assert(!await engine.isPathIgnored(getFixturePath("ignored-paths", "negation", "unignore.js")));
            });
        });

        describe("with ignorePath option and ignorePatterns option", () => {
            it("should return false for ignored file when unignored with ignore pattern", async () => {
                const cwd = getFixturePath("ignored-paths");
                const engine = new FlatESLint({
                    ignorePath: getFixturePath("ignored-paths", ".eslintignoreForNegationTest"),
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
                configFile: false,
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
                configFile: false,
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
                configFile: false,
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
                configFile: false,
                ignorePath: path.join(fixtureDir, ".eslintignore"),
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
                configFile: false,
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
                configFile: false,
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

    describe("getRulesMetaForResults()", () => {

        it("should throw an error when results were not created from this instance", async () => {
            const engine = new FlatESLint({
                configFile: false
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
                        errorCount: 2,
                        warningCount: 0,
                        fixableErrorCount: 0,
                        fixableWarningCount: 0,
                        source:
                            "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
                    }
                ]);
            }, /Results object was not created from this ESLint instance/u);
        });

        it("should return empty object when there are no linting errors", async () => {
            const engine = new FlatESLint({
                configFile: false
            });

            const rulesMeta = engine.getRulesMetaForResults([]);

            assert.strictEqual(Object.keys(rulesMeta).length, 0);
        });

        it("should return one rule meta when there is a linting error", async () => {
            const engine = new FlatESLint({
                configFile: false,
                overrideConfig: {
                    rules: {
                        semi: 2
                    }
                }
            });

            const results = await engine.lintText("a", { filePath: "foo.js" });
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
        });

        it("should return multiple rule meta when there are multiple linting errors", async () => {
            const engine = new FlatESLint({
                configFile: false,
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
            const nodePlugin = require("eslint-plugin-node");
            const engine = new FlatESLint({
                configFile: false,
                overrideConfig: {
                    plugins: {
                        node: nodePlugin
                    },
                    rules: {
                        "node/no-new-require": 2,
                        semi: 2,
                        quotes: [2, "double"]
                    }
                }
            });

            const results = await engine.lintText("new require('hi')");
            const rulesMeta = engine.getRulesMetaForResults(results);

            assert.strictEqual(rulesMeta.semi, coreRules.get("semi").meta);
            assert.strictEqual(rulesMeta.quotes, coreRules.get("quotes").meta);
            assert.strictEqual(
                rulesMeta["node/no-new-require"],
                nodePlugin.rules["no-new-require"].meta
            );
        });
    });

    xdescribe("outputFixes()", () => {
        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should call fs.writeFile() for each result with output", async () => {
            const fakeFS = {
                writeFile: sinon.spy(callLastArgument)
            };
            const spy = fakeFS.writeFile;
            const { FlatESLint: localESLint } = proxyquire("../../../lib/eslint/flat-eslint", {
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
            const { FlatESLint: localESLint } = proxyquire("../../../lib/eslint/flat-eslint", {
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

            assert.strictEqual(spy.callCount, 2, "Call count was wrong");
            assert(spy.firstCall.calledWithExactly(path.resolve("foo.js"), "bar", sinon.match.func), "First call was incorrect.");
            assert(spy.secondCall.calledWithExactly(path.resolve("bar.js"), "baz", sinon.match.func), "Second call was incorrect.");
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
                configFile: false,
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
        });

        it("should not report a violation by default", async () => {
            const code = [
                "alert('test'); // eslint-disable-line no-alert"
            ].join("\n");
            const config = {
                ignore: true,
                configFile: false,
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
        });
    });

    describe("when evaluating code when reportUnusedDisableDirectives is enabled", () => {
        it("should report problems for unused eslint-disable directives", async () => {
            const eslint = new FlatESLint({ configFile: false, reportUnusedDisableDirectives: "error" });

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

    describe("when retreiving version number", () => {
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
                    configFile: false,
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
                    configFile: false
                });
                const fileConfig1 = await engine1.calculateConfigForFile(filePath);
                const fileConfig2 = await engine2.calculateConfigForFile(filePath);
                
                // plugin
                assert.deepStrictEqual(fileConfig1.rules["example/example-rule"], [1], "example is present for engine 1");
                assert.strictEqual(fileConfig2.rules, void 0, "example is not present for engine 2");
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
                cwd: root,
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
                    path.join(root, "baz.js"),
                    path.join(root, "eslint.config.js"),
                    path.join(root, "subdir/bar.js"),
                    path.join(root, "subdir/baz.js")
                ]);
            });
        });


        /*
         * These tests fail due to a bug in fast-flob that doesn't allow
         * negated patterns inside of ignores. These tests won't work until
         * this bug is fixed:
         * https://github.com/mrmlnc/fast-glob/issues/356
         */
        xdescribe("ignorePatterns can unignore '/node_modules/foo'.", () => {

            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "eslint.config.js": `module.exports = {
                        ignores: ["!**/node_modules/foo/**"]
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
                    path.join(root, "eslint.config.js"),
                    path.join(root, "foo.js"),
                    path.join(root, "node_modules/foo/index.js")
                ]);
            });
        });

        xdescribe(".eslintignore can re-ignore files that are unignored by ignorePatterns.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "eslint.config.js": `module.exports = ${JSON.stringify({
                        ignores: ["!.*"]
                    })}`,
                    ".eslintignore": ".foo*",
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
                    path.join(root, ".bar.js"),
                    path.join(root, "eslint.config.js")
                ]);
            });
        });

        xdescribe(".eslintignore can unignore files that are ignored by ignorePatterns.", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root,
                files: {
                    "eslint.config.js": `module.exports = ${JSON.stringify({
                        ignores: ["**/*.js"]
                    })}`,
                    ".eslintignore": "!foo.js",
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
                    path.join(root, "foo.js")
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

    describe("config.files' adds lint targets", () => {
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

    describe.only("'ignores', 'files' of the configuration that the '--config' option provided should be resolved from CWD.", () => {
        const root = getFixturePath("cli-engine/config-and-overrides-files");
        
        describe("if { files: 'foo/*.txt', ... } is present by '--config node_modules/myconf/eslint.config.js',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + "a1",
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
                    configFile: "node_modules/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false,
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
                        source: "a == b",
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'node_modules/myconf/foo/test.js' should NOT use the files entry.", async () => {
                const engine = new FlatESLint({
                    configFile: "node_modules/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false,
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
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });
        });

        describe.only("if { files: '*', ignores: 'foo/*.txt', ... } is present by '--config bar/myconf/eslint.config.js',", () => {
            const { prepare, cleanup, getPath } = createCustomTeardown({
                cwd: root + "a2",
                files: {
                    "bar/myconf/eslint.config.js": `module.exports = [
                        {
                            files: ["*"],
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
                    configFile: "bar/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false,
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
                        usedDeprecatedRules: [],
                        warningCount: 0,
                        fatalErrorCount: 0
                    }
                ]);
            });

            it("'lintFiles()' with 'bar/myconf/foo/test.js' should have an error because eqeqeq is enabled.", async () => {
                const engine = new FlatESLint({
                    configFile: "bar/myconf/eslint.config.js",
                    cwd: getPath(),
                    ignore: false
                });
                const results = await engine.lintFiles("bar/myconf/foo/test.js");

                // Expected to be an 'eqeqeq' error because the file doesn't match to `$CWD/foo/*.js`.
                assert.deepStrictEqual(results, [
                    {
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
                const engine = new FlatESLint({
                    configFile: "node_modules/myconf/.eslintrc.json",
                    cwd: getPath()
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

    xdescribe("plugin conflicts", () => {
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
                const engine = new FlatESLint({ cwd: getPath() });

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
                const engine = new FlatESLint({ cwd: getPath() });

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
                const engine = new FlatESLint({ cwd: getPath() });

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
                const engine = new FlatESLint({ cwd: getPath() });

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
                const engine = new FlatESLint({
                    cwd: getPath(),
                    configFile: "node_modules/mine/.eslintrc.json"
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
                const engine = new FlatESLint({
                    cwd: getPath(),
                    configFile: "node_modules/mine/.eslintrc.json"
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
                const engine = new FlatESLint({
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
                const engine = new FlatESLint({
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
                const engine = new FlatESLint({
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
                const engine = new FlatESLint({ cwd: getPath() });
                const results = await engine.lintFiles("*/test.js");

                assert.strictEqual(results.length, 2);
            });
        });
    });
});
