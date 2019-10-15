/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

"use strict";

/*
 * NOTE: If you are adding new tests for cli.js, use verifyCLIEngineOpts(). The
 * test only needs to verify that CLIEngine receives the correct opts.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    CLIEngine = require("../../lib/cli-engine/index").CLIEngine,
    path = require("path"),
    sinon = require("sinon"),
    fs = require("fs"),
    os = require("os"),
    sh = require("shelljs");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("cli", () => {
    let fixtureDir;
    const log = {
        info: sinon.spy(),
        error: sinon.spy()
    };
    const RuntimeInfo = {
        environment: sinon.stub(),
        version: sinon.stub()
    };
    const cli = proxyquire("../../lib/cli", {
        "./shared/logging": log,
        "./shared/runtime-info": RuntimeInfo
    });

    /**
     * Verify that CLIEngine receives correct opts via cli.execute().
     * @param {string} cmd CLI command.
     * @param {Object} opts Options hash that should match that received by CLIEngine.
     * @returns {void}
     */
    function verifyCLIEngineOpts(cmd, opts) {

        // create a fake CLIEngine to test with
        const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match(opts));

        Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
        sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({});
        sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(sinon.spy());

        const localCLI = proxyquire("../../lib/cli", {
            "./cli-engine/index": { CLIEngine: fakeCLIEngine },
            "./shared/logging": log
        });

        localCLI.execute(cmd);
        sinon.verifyAndRestore();
    }

    // verifyCLIEngineOpts

    /**
     * Returns the path inside of the fixture directory.
     * @param {...string} args file path segments.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath(...args) {
        return path.join(fixtureDir, ...args);
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        fixtureDir = `${os.tmpdir()}/eslint/fixtures`;
        sh.mkdir("-p", fixtureDir);
        sh.cp("-r", "./tests/fixtures/.", fixtureDir);
    });

    afterEach(() => {
        log.info.resetHistory();
        log.error.resetHistory();
    });

    after(() => {
        sh.rm("-r", fixtureDir);
    });

    describe("execute()", () => {
        it("should return error when text with incorrect quotes is passed as argument", () => {
            const configFile = getFixturePath("configurations", "quotes-error.json");
            const result = cli.execute(`-c ${configFile}`, "var foo = 'bar';");

            assert.strictEqual(result, 1);
        });

        it("should not print debug info when passed the empty string as text", () => {
            const result = cli.execute(["--stdin", "--no-eslintrc"], "");

            assert.strictEqual(result, 0);
            assert.isTrue(log.info.notCalled);
        });

        it("should return no error when --ext .js2 is specified", () => {
            const filePath = getFixturePath("files");
            const result = cli.execute(`--ext .js2 ${filePath}`);

            assert.strictEqual(result, 0);
        });

        it("should exit with console error when passed unsupported arguments", () => {
            const filePath = getFixturePath("files");
            const result = cli.execute(`--blah --another ${filePath}`);

            assert.strictEqual(result, 2);
        });

    });

    describe("when given a config file", () => {
        it("should load the specified config file", () => {
            const configPath = getFixturePath(".eslintrc");
            const filePath = getFixturePath("passing.js");

            cli.execute(`--config ${configPath} ${filePath}`);
        });
    });

    describe("when there is a local config file", () => {
        const code = "lib/cli.js";

        it("should load the local config file", () => {

            // Mock CWD
            process.eslintCwd = getFixturePath("configurations", "single-quotes");

            cli.execute(code);

            process.eslintCwd = null;
        });
    });

    describe("when given a config with rules with options and severity level set to error", () => {
        it("should exit with an error status (1)", () => {
            const configPath = getFixturePath("configurations", "quotes-error.json");
            const filePath = getFixturePath("single-quoted.js");
            const code = `--no-ignore --config ${configPath} ${filePath}`;

            const exitStatus = cli.execute(code);

            assert.strictEqual(exitStatus, 1);
        });
    });

    describe("when given a config file and a directory of files", () => {
        it("should load and execute without error", () => {
            const configPath = getFixturePath("configurations", "semi-error.json");
            const filePath = getFixturePath("formatters");
            const code = `--config ${configPath} ${filePath}`;

            const exitStatus = cli.execute(code);

            assert.strictEqual(exitStatus, 0);
        });
    });

    describe("when given a config with environment set to browser", () => {
        it("should execute without any errors", () => {
            const configPath = getFixturePath("configurations", "env-browser.json");
            const filePath = getFixturePath("globals-browser.js");
            const code = `--config ${configPath} ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a config with environment set to Node.js", () => {
        it("should execute without any errors", () => {
            const configPath = getFixturePath("configurations", "env-node.json");
            const filePath = getFixturePath("globals-node.js");
            const code = `--config ${configPath} ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a config with environment set to Nashorn", () => {
        it("should execute without any errors", () => {
            const configPath = getFixturePath("configurations", "env-nashorn.json");
            const filePath = getFixturePath("globals-nashorn.js");
            const code = `--config ${configPath} ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a config with environment set to WebExtensions", () => {
        it("should execute without any errors", () => {
            const configPath = getFixturePath("configurations", "env-webextensions.json");
            const filePath = getFixturePath("globals-webextensions.js");
            const code = `--config ${configPath} ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a valid built-in formatter name", () => {
        it("should execute without any errors", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`-f checkstyle ${filePath}`);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a valid built-in formatter name that uses rules meta.", () => {
        it("should execute without any errors", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`-f json-with-metadata ${filePath} --no-eslintrc`);

            assert.strictEqual(exit, 0);

            // Check metadata.
            const { metadata } = JSON.parse(log.info.args[0][0]);
            const rules = new CLIEngine({ useEslintrc: false }).getRules();
            const expectedMetadata = Array.from(rules).reduce((obj, [ruleId, rule]) => {
                obj.rulesMeta[ruleId] = rule.meta;
                return obj;
            }, { rulesMeta: {} });

            assert.deepStrictEqual(metadata, expectedMetadata);
        });
    });

    describe("when given an invalid built-in formatter name", () => {
        it("should execute with error", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`-f fakeformatter ${filePath}`);

            assert.strictEqual(exit, 2);
        });
    });

    describe("when given a valid formatter path", () => {
        it("should execute without any errors", () => {
            const formatterPath = getFixturePath("formatters", "simple.js");
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`-f ${formatterPath} ${filePath}`);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given an invalid formatter path", () => {
        it("should execute with error", () => {
            const formatterPath = getFixturePath("formatters", "file-does-not-exist.js");
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`-f ${formatterPath} ${filePath}`);

            assert.strictEqual(exit, 2);
        });
    });

    describe("when executing a file with a lint error", () => {
        it("should exit with error", () => {
            const filePath = getFixturePath("undef.js");
            const code = `--no-ignore --rule no-undef:2 ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 1);
        });
    });

    describe("when using --fix-type without --fix or --fix-dry-run", () => {
        it("should exit with error", () => {
            const filePath = getFixturePath("passing.js");
            const code = `--fix-type suggestion ${filePath}`;

            const exit = cli.execute(code);

            assert.strictEqual(exit, 2);
        });
    });

    describe("when executing a file with a syntax error", () => {
        it("should exit with error", () => {
            const filePath = getFixturePath("syntax-error.js");
            const exit = cli.execute(`--no-ignore ${filePath}`);

            assert.strictEqual(exit, 1);
        });
    });

    describe("when calling execute more than once", () => {
        it("should not print the results from previous execution", () => {
            const filePath = getFixturePath("missing-semicolon.js");
            const passingPath = getFixturePath("passing.js");

            cli.execute(`--no-ignore --rule semi:2 ${filePath}`);

            assert.isTrue(log.info.called, "Log should have been called.");

            log.info.resetHistory();

            cli.execute(`--no-ignore --rule semi:2 ${passingPath}`);
            assert.isTrue(log.info.notCalled);

        });
    });

    describe("when executing with version flag", () => {
        it("should print out current version", () => {
            assert.strictEqual(cli.execute("-v"), 0);
            assert.strictEqual(log.info.callCount, 1);
        });
    });

    describe("when executing with env-info flag", () => {
        it("should print out environment information", () => {
            assert.strictEqual(cli.execute("--env-info"), 0);
            assert.strictEqual(log.info.callCount, 1);
        });

        it("should print error message and return error code", () => {
            RuntimeInfo.environment.throws("There was an error!");

            assert.strictEqual(cli.execute("--env-info"), 2);
            assert.strictEqual(log.error.callCount, 1);
        });
    });

    describe("when executing with help flag", () => {
        it("should print out help", () => {
            assert.strictEqual(cli.execute("-h"), 0);
            assert.strictEqual(log.info.callCount, 1);
        });
    });

    describe("when given a directory with eslint excluded files in the directory", () => {
        it("should throw an error and not process any files", () => {
            const ignorePath = getFixturePath(".eslintignore");
            const filePath = getFixturePath("cli");

            assert.throws(() => {
                cli.execute(`--ignore-path ${ignorePath} ${filePath}`);
            }, `All files matched by '${filePath}' are ignored.`);
        });
    });

    describe("when given a file in excluded files list", () => {
        it("should not process the file", () => {
            const ignorePath = getFixturePath(".eslintignore");
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`--ignore-path ${ignorePath} ${filePath}`);

            // a warning about the ignored file
            assert.isTrue(log.info.called);
            assert.strictEqual(exit, 0);
        });

        it("should process the file when forced", () => {
            const ignorePath = getFixturePath(".eslintignore");
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`--ignore-path ${ignorePath} --no-ignore ${filePath}`);

            // no warnings
            assert.isFalse(log.info.called);
            assert.strictEqual(exit, 0);
        });
    });

    describe("when given a pattern to ignore", () => {
        it("should not process any files", () => {
            const ignoredFile = getFixturePath("cli/syntax-error.js");
            const filePath = getFixturePath("cli/passing.js");
            const exit = cli.execute(`--ignore-pattern cli/ ${ignoredFile} ${filePath}`);

            // warnings about the ignored files
            assert.isTrue(log.info.called);
            assert.strictEqual(exit, 0);
        });
    });

    describe("when given patterns to ignore", () => {
        it("should not process any matching files", () => {
            const ignorePaths = ["a", "b"];

            const cmd = ignorePaths.map(ignorePath => `--ignore-pattern ${ignorePath}`).concat(".").join(" ");

            const opts = {
                ignorePattern: ignorePaths
            };

            verifyCLIEngineOpts(cmd, opts);
        });
    });

    describe("when executing a file with a shebang", () => {
        it("should execute without error", () => {
            const filePath = getFixturePath("shebang.js");
            const exit = cli.execute(`--no-ignore ${filePath}`);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when loading a custom rule", () => {
        it("should return an error when rule isn't found", () => {
            const rulesPath = getFixturePath("rules", "wrong");
            const configPath = getFixturePath("rules", "eslint.json");
            const filePath = getFixturePath("rules", "test", "test-custom-rule.js");
            const code = `--rulesdir ${rulesPath} --config ${configPath} --no-ignore ${filePath}`;

            assert.throws(() => {
                const exit = cli.execute(code);

                assert.strictEqual(exit, 2);
            }, /Error while loading rule 'custom-rule': Cannot read property/u);
        });

        it("should return a warning when rule is matched", () => {
            const rulesPath = getFixturePath("rules");
            const configPath = getFixturePath("rules", "eslint.json");
            const filePath = getFixturePath("rules", "test", "test-custom-rule.js");
            const code = `--rulesdir ${rulesPath} --config ${configPath} --no-ignore ${filePath}`;

            cli.execute(code);

            assert.isTrue(log.info.calledOnce);
            assert.isTrue(log.info.neverCalledWith(""));
        });

        it("should return warnings from multiple rules in different directories", () => {
            const rulesPath = getFixturePath("rules", "dir1");
            const rulesPath2 = getFixturePath("rules", "dir2");
            const configPath = getFixturePath("rules", "multi-rulesdirs.json");
            const filePath = getFixturePath("rules", "test-multi-rulesdirs.js");
            const code = `--rulesdir ${rulesPath} --rulesdir ${rulesPath2} --config ${configPath} --no-ignore ${filePath}`;
            const exit = cli.execute(code);

            const call = log.info.getCall(0);

            assert.isTrue(log.info.calledOnce);
            assert.isTrue(call.args[0].indexOf("String!") > -1);
            assert.isTrue(call.args[0].indexOf("Literal!") > -1);
            assert.isTrue(call.args[0].indexOf("2 problems") > -1);
            assert.isTrue(log.info.neverCalledWith(""));
            assert.strictEqual(exit, 1);
        });


    });

    describe("when executing with no-eslintrc flag", () => {
        it("should ignore a local config file", () => {
            const filePath = getFixturePath("eslintrc", "quotes.js");
            const exit = cli.execute(`--no-eslintrc --no-ignore ${filePath}`);

            assert.isTrue(log.info.notCalled);
            assert.strictEqual(exit, 0);
        });
    });

    describe("when executing without no-eslintrc flag", () => {
        it("should load a local config file", () => {
            const filePath = getFixturePath("eslintrc", "quotes.js");
            const exit = cli.execute(`--no-ignore ${filePath}`);

            assert.isTrue(log.info.calledOnce);
            assert.strictEqual(exit, 1);
        });
    });

    describe("when executing without env flag", () => {
        it("should not define environment-specific globals", () => {
            const files = [
                getFixturePath("globals-browser.js"),
                getFixturePath("globals-node.js")
            ];

            cli.execute(`--no-eslintrc --config ./conf/eslint-recommended.js --no-ignore ${files.join(" ")}`);

            assert.strictEqual(log.info.args[0][0].split("\n").length, 10);
        });
    });

    describe("when executing with global flag", () => {
        it("should default defined variables to read-only", () => {
            const filePath = getFixturePath("undef.js");
            const exit = cli.execute(`--global baz,bat --no-ignore --rule no-global-assign:2 ${filePath}`);

            assert.isTrue(log.info.calledOnce);
            assert.strictEqual(exit, 1);
        });

        it("should allow defining writable global variables", () => {
            const filePath = getFixturePath("undef.js");
            const exit = cli.execute(`--global baz:false,bat:true --no-ignore ${filePath}`);

            assert.isTrue(log.info.notCalled);
            assert.strictEqual(exit, 0);
        });

        it("should allow defining variables with multiple flags", () => {
            const filePath = getFixturePath("undef.js");
            const exit = cli.execute(`--global baz --global bat:true --no-ignore ${filePath}`);

            assert.isTrue(log.info.notCalled);
            assert.strictEqual(exit, 0);
        });
    });

    describe("when supplied with rule flag and severity level set to error", () => {
        it("should exit with an error status (2)", () => {
            const filePath = getFixturePath("single-quoted.js");
            const code = `--no-ignore --rule 'quotes: [2, double]' ${filePath}`;
            const exitStatus = cli.execute(code);

            assert.strictEqual(exitStatus, 1);
        });
    });

    describe("when the quiet option is enabled", () => {

        it("should only print error", () => {
            const filePath = getFixturePath("single-quoted.js");
            const cliArgs = `--no-ignore --quiet  -f compact --rule 'quotes: [2, double]' --rule 'no-unused-vars: 1' ${filePath}`;

            cli.execute(cliArgs);

            sinon.assert.calledOnce(log.info);

            const formattedOutput = log.info.firstCall.args[0];

            assert.include(formattedOutput, "Error");
            assert.notInclude(formattedOutput, "Warning");
        });

        it("should print nothing if there are no errors", () => {
            const filePath = getFixturePath("single-quoted.js");
            const cliArgs = `--quiet  -f compact --rule 'quotes: [1, double]' --rule 'no-unused-vars: 1' ${filePath}`;

            cli.execute(cliArgs);

            sinon.assert.notCalled(log.info);
        });
    });

    describe("when supplied with report output file path", () => {
        afterEach(() => {
            sh.rm("-rf", "tests/output");
        });

        it("should write the file and create dirs if they don't exist", () => {
            const filePath = getFixturePath("single-quoted.js");
            const code = `--no-ignore --rule 'quotes: [1, double]' --o tests/output/eslint-output.txt ${filePath}`;

            cli.execute(code);

            assert.include(fs.readFileSync("tests/output/eslint-output.txt", "utf8"), filePath);
            assert.isTrue(log.info.notCalled);
        });

        it("should return an error if the path is a directory", () => {
            const filePath = getFixturePath("single-quoted.js");
            const code = `--no-ignore --rule 'quotes: [1, double]' --o tests/output ${filePath}`;

            fs.mkdirSync("tests/output");

            const exit = cli.execute(code);

            assert.strictEqual(exit, 2);
            assert.isTrue(log.info.notCalled);
            assert.isTrue(log.error.calledOnce);
        });

        it("should return an error if the path could not be written to", () => {
            const filePath = getFixturePath("single-quoted.js");
            const code = `--no-ignore --rule 'quotes: [1, double]' --o tests/output/eslint-output.txt ${filePath}`;

            fs.writeFileSync("tests/output", "foo");

            const exit = cli.execute(code);

            assert.strictEqual(exit, 2);
            assert.isTrue(log.info.notCalled);
            assert.isTrue(log.error.calledOnce);
        });
    });

    describe("when supplied with a plugin", () => {
        it("should pass plugins to CLIEngine", () => {
            const examplePluginName = "eslint-plugin-example";

            verifyCLIEngineOpts(`--no-ignore --plugin ${examplePluginName} foo.js`, {
                plugins: [examplePluginName]
            });
        });

    });

    describe("when supplied with a plugin-loading path", () => {
        it("should pass the option to CLIEngine", () => {
            const examplePluginDirPath = "foo/bar";

            verifyCLIEngineOpts(`--resolve-plugins-relative-to ${examplePluginDirPath} foo.js`, {
                resolvePluginsRelativeTo: examplePluginDirPath
            });
        });
    });

    describe("when given an parser name", () => {
        it("should exit with a fatal error if parser is invalid", () => {
            const filePath = getFixturePath("passing.js");

            assert.throws(() => cli.execute(`--no-ignore --parser test111 ${filePath}`), "Cannot find module 'test111'");
        });

        it("should exit with no error if parser is valid", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`--no-ignore --parser espree ${filePath}`);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given parser options", () => {
        it("should exit with error if parser options are invalid", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`--no-ignore --parser-options test111 ${filePath}`);

            assert.strictEqual(exit, 2);
        });

        it("should exit with no error if parser is valid", () => {
            const filePath = getFixturePath("passing.js");
            const exit = cli.execute(`--no-ignore --parser-options=ecmaVersion:6 ${filePath}`);

            assert.strictEqual(exit, 0);
        });

        it("should exit with an error on ecmaVersion 7 feature in ecmaVersion 6", () => {
            const filePath = getFixturePath("passing-es7.js");
            const exit = cli.execute(`--no-ignore --parser-options=ecmaVersion:6 ${filePath}`);

            assert.strictEqual(exit, 1);
        });

        it("should exit with no error on ecmaVersion 7 feature in ecmaVersion 7", () => {
            const filePath = getFixturePath("passing-es7.js");
            const exit = cli.execute(`--no-ignore --parser-options=ecmaVersion:7 ${filePath}`);

            assert.strictEqual(exit, 0);
        });

        it("should exit with no error on ecmaVersion 7 feature with config ecmaVersion 6 and command line ecmaVersion 7", () => {
            const configPath = getFixturePath("configurations", "es6.json");
            const filePath = getFixturePath("passing-es7.js");
            const exit = cli.execute(`--no-ignore --config ${configPath} --parser-options=ecmaVersion:7 ${filePath}`);

            assert.strictEqual(exit, 0);
        });
    });

    describe("when given the max-warnings flag", () => {
        it("should not change exit code if warning count under threshold", () => {
            const filePath = getFixturePath("max-warnings");
            const exitCode = cli.execute(`--no-ignore --max-warnings 10 ${filePath}`);

            assert.strictEqual(exitCode, 0);
        });

        it("should exit with exit code 1 if warning count exceeds threshold", () => {
            const filePath = getFixturePath("max-warnings");
            const exitCode = cli.execute(`--no-ignore --max-warnings 5 ${filePath}`);

            assert.strictEqual(exitCode, 1);
            assert.ok(log.error.calledOnce);
            assert.include(log.error.getCall(0).args[0], "ESLint found too many warnings");
        });

        it("should not change exit code if warning count equals threshold", () => {
            const filePath = getFixturePath("max-warnings");
            const exitCode = cli.execute(`--no-ignore --max-warnings 6 ${filePath}`);

            assert.strictEqual(exitCode, 0);
        });

        it("should not change exit code if flag is not specified and there are warnings", () => {
            const filePath = getFixturePath("max-warnings");
            const exitCode = cli.execute(filePath);

            assert.strictEqual(exitCode, 0);
        });
    });

    describe("when passed --no-inline-config", () => {
        let localCLI;

        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should pass allowInlineConfig:true to CLIEngine when --no-inline-config is used", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ allowInlineConfig: false }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({
                errorCount: 1,
                warningCount: 0,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 2,
                            message: "Fake message"
                        }
                    ]
                }]
            });
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            fakeCLIEngine.outputFixes = sinon.stub();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            localCLI.execute("--no-inline-config .");
        });

        it("should not error and allowInlineConfig should be true by default", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ allowInlineConfig: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({
                errorCount: 0,
                warningCount: 0,
                results: []
            });
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.stub();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute(".");

            assert.strictEqual(exitCode, 0);

        });

    });

    describe("when passed --fix", () => {
        let localCLI;

        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should pass fix:true to CLIEngine when executing on files", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({
                errorCount: 0,
                warningCount: 0,
                results: []
            });
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.mock().once();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix .");

            assert.strictEqual(exitCode, 0);

        });


        it("should rewrite files when in fix mode", () => {

            const report = {
                errorCount: 1,
                warningCount: 0,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 2,
                            message: "Fake message"
                        }
                    ]
                }]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns(report);
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.mock().withExactArgs(report);

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix .");

            assert.strictEqual(exitCode, 1);

        });

        it("should provide fix predicate and rewrite files when in fix mode and quiet mode", () => {

            const report = {
                errorCount: 0,
                warningCount: 1,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 1,
                            message: "Fake message"
                        }
                    ]
                }]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: sinon.match.func }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns(report);
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.getErrorResults = sinon.stub().returns([]);
            fakeCLIEngine.outputFixes = sinon.mock().withExactArgs(report);

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix --quiet .");

            assert.strictEqual(exitCode, 0);

        });

        it("should not call CLIEngine and return 1 when executing on text", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix .", "foo = bar;");

            assert.strictEqual(exitCode, 2);
        });

    });

    describe("when passed --fix-dry-run", () => {
        let localCLI;

        afterEach(() => {
            sinon.verifyAndRestore();
        });

        it("should pass fix:true to CLIEngine when executing on files", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({
                errorCount: 0,
                warningCount: 0,
                results: []
            });
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix-dry-run .");

            assert.strictEqual(exitCode, 0);

        });

        it("should pass fixTypes to CLIEngine when --fix-type is passed", () => {

            const expectedCLIEngineOptions = {
                fix: true,
                fixTypes: ["suggestion"]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match(expectedCLIEngineOptions));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns({
                errorCount: 0,
                warningCount: 0,
                results: []
            });
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.stub();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix-dry-run --fix-type suggestion .");

            assert.strictEqual(exitCode, 0);
        });

        it("should not rewrite files when in fix-dry-run mode", () => {

            const report = {
                errorCount: 1,
                warningCount: 0,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 2,
                            message: "Fake message"
                        }
                    ]
                }]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns(report);
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix-dry-run .");

            assert.strictEqual(exitCode, 1);

        });

        it("should provide fix predicate when in fix-dry-run mode and quiet mode", () => {

            const report = {
                errorCount: 0,
                warningCount: 1,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 1,
                            message: "Fake message"
                        }
                    ]
                }]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: sinon.match.func }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnFiles").returns(report);
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.getErrorResults = sinon.stub().returns([]);
            fakeCLIEngine.outputFixes = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix-dry-run --quiet .");

            assert.strictEqual(exitCode, 0);

        });

        it("should allow executing on text", () => {

            const report = {
                errorCount: 1,
                warningCount: 0,
                results: [{
                    filePath: "./foo.js",
                    output: "bar",
                    messages: [
                        {
                            severity: 2,
                            message: "Fake message"
                        }
                    ]
                }]
            };

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().withExactArgs(sinon.match({ fix: true }));

            Object.defineProperties(fakeCLIEngine.prototype, Object.getOwnPropertyDescriptors(CLIEngine.prototype));
            sinon.stub(fakeCLIEngine.prototype, "executeOnText").returns(report);
            sinon.stub(fakeCLIEngine.prototype, "getFormatter").returns(() => "done");
            sinon.stub(fakeCLIEngine.prototype, "getRules").returns(new Map());
            fakeCLIEngine.outputFixes = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix-dry-run .", "foo = bar;");

            assert.strictEqual(exitCode, 1);
        });

        it("should not call CLIEngine and return 1 when used with --fix", () => {

            // create a fake CLIEngine to test with
            const fakeCLIEngine = sinon.mock().never();

            localCLI = proxyquire("../../lib/cli", {
                "./cli-engine/index": { CLIEngine: fakeCLIEngine },
                "./shared/logging": log
            });

            const exitCode = localCLI.execute("--fix --fix-dry-run .", "foo = bar;");

            assert.strictEqual(exitCode, 2);
        });
    });

    describe("when passing --print-config", () => {
        it("should print out the configuration", () => {
            const filePath = getFixturePath("xxxx");

            const exitCode = cli.execute(`--print-config ${filePath}`);

            assert.isTrue(log.info.calledOnce);
            assert.strictEqual(exitCode, 0);
        });

        it("should error if any positional file arguments are passed", () => {
            const filePath1 = getFixturePath("files", "bar.js");
            const filePath2 = getFixturePath("files", "foo.js");

            const exitCode = cli.execute(`--print-config ${filePath1} ${filePath2}`);

            assert.isTrue(log.info.notCalled);
            assert.isTrue(log.error.calledOnce);
            assert.strictEqual(exitCode, 2);
        });

        it("should error out when executing on text", () => {
            const exitCode = cli.execute("--print-config=myFile.js", "foo = bar;");

            assert.isTrue(log.info.notCalled);
            assert.isTrue(log.error.calledOnce);
            assert.strictEqual(exitCode, 2);
        });
    });

});
