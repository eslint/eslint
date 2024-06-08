/**
 * @fileoverview Tests for cli.
 * @author Ian Christian Myers
 */

"use strict";

/*
 * NOTE: If you are adding new tests for cli.js, use verifyESLintOpts(). The
 * test only needs to verify that ESLint receives the correct opts.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    stdAssert = require("node:assert"),
    { ESLint, LegacyESLint } = require("../../lib/eslint"),
    BuiltinRules = require("../../lib/rules"),
    path = require("node:path"),
    sinon = require("sinon"),
    fs = require("node:fs"),
    os = require("node:os"),
    sh = require("shelljs");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("cli", () => {

    describe("calculateInspectConfigFlags()", () => {

        const cli = require("../../lib/cli");

        it("should return the config file in the project root when no argument is passed", async () => {

            const flags = await cli.calculateInspectConfigFlags();

            assert.deepStrictEqual(flags, [
                "--config",
                path.resolve(process.cwd(), "eslint.config.js"),
                "--basePath",
                process.cwd()
            ]);

        });

        it("should return the override config file when an argument is passed", async () => {

            const flags = await cli.calculateInspectConfigFlags("foo.js");

            assert.deepStrictEqual(flags, [
                "--config",
                path.resolve(process.cwd(), "foo.js"),
                "--basePath",
                process.cwd()
            ]);

        });

        it("should return the override config file when an argument is passed with a path", async () => {

            const flags = await cli.calculateInspectConfigFlags("bar/foo.js");

            assert.deepStrictEqual(flags, [
                "--config",
                path.resolve(process.cwd(), "bar/foo.js"),
                "--basePath",
                process.cwd()
            ]);

        });

    });

    describe("execute()", () => {

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
         * Verify that ESLint class receives correct opts via await cli.execute().
         * @param {string} cmd CLI command.
         * @param {Object} opts Options hash that should match that received by ESLint class.
         * @param {string} configType The config type to work with.
         * @returns {void}
         */
        async function verifyESLintOpts(cmd, opts, configType) {

            const ActiveESLint = configType === "flat" ? ESLint : LegacyESLint;

            // create a fake ESLint class to test with
            const fakeESLint = sinon.mock().withExactArgs(sinon.match(opts));

            Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
            sinon.stub(fakeESLint.prototype, "lintFiles").returns([]);
            sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: sinon.spy() });

            const localCLI = proxyquire("../../lib/cli", {
                "./eslint": { LegacyESLint: fakeESLint },
                "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(configType === "flat") },
                "./shared/logging": log
            });

            await localCLI.execute(cmd, null, configType === "flat");
            sinon.verifyAndRestore();
        }

        // verifyESLintOpts

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
        before(function() {

            /*
             * GitHub Actions Windows and macOS runners occasionally exhibit
             * extremely slow filesystem operations, during which copying fixtures
             * exceeds the default test timeout, so raise it just for this hook.
             * Mocha uses `this` to set timeouts on an individual hook level.
             */
            this.timeout(60 * 1000); // eslint-disable-line no-invalid-this -- Mocha API
            fixtureDir = `${os.tmpdir()}/eslint/fixtures`;
            sh.mkdir("-p", fixtureDir);
            sh.cp("-r", "./tests/fixtures/.", fixtureDir);
        });

        beforeEach(() => {
            sinon.stub(process, "emitWarning").withArgs(sinon.match.any, "ESLintIgnoreWarning").returns();
            process.emitWarning.callThrough();
        });

        afterEach(() => {
            sinon.restore();
            log.info.resetHistory();
            log.error.resetHistory();
        });

        after(() => {
            sh.rm("-r", fixtureDir);
        });

        ["eslintrc", "flat"].forEach(configType => {

            const useFlatConfig = configType === "flat";
            const ActiveESLint = configType === "flat" ? ESLint : LegacyESLint;

            describe("execute()", () => {

                it(`should return error when text with incorrect quotes is passed as argument with configType:${configType}`, async () => {
                    const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";
                    const configFile = getFixturePath("configurations", "quotes-error.js");
                    const result = await cli.execute(`${flag} -c ${configFile} --stdin --stdin-filename foo.js`, "var foo = 'bar';", useFlatConfig);

                    assert.strictEqual(result, 1);
                });

                it(`should not print debug info when passed the empty string as text with configType:${configType}`, async () => {
                    const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";
                    const result = await cli.execute(["argv0", "argv1", "--stdin", flag, "--stdin-filename", "foo.js"], "", useFlatConfig);

                    assert.strictEqual(result, 0);
                    assert.isTrue(log.info.notCalled);
                });

                it(`should exit with console error when passed unsupported arguments with configType:${configType}`, async () => {
                    const filePath = getFixturePath("files");
                    const result = await cli.execute(`--blah --another ${filePath}`, null, useFlatConfig);

                    assert.strictEqual(result, 2);
                });

            });

            describe("flat config", () => {
                const originalEnv = process.env;
                const originalCwd = process.cwd;

                let processStub;

                beforeEach(() => {
                    sinon.restore();
                    processStub = sinon.stub(process, "emitWarning");
                    process.env = { ...originalEnv };
                });

                afterEach(() => {
                    processStub.restore();
                    process.env = originalEnv;
                    process.cwd = originalCwd;
                });

                it(`should use it when an eslint.config.js is present and useFlatConfig is true:${configType}`, async () => {
                    process.cwd = getFixturePath;

                    const exitCode = await cli.execute(`--no-ignore --ext .js ${getFixturePath("files")}`, null, useFlatConfig);

                    // When flat config is used, we get an exit code of 2 because the --ext option is unrecognized.
                    assert.strictEqual(exitCode, useFlatConfig ? 2 : 0);
                });

                it(`should not use it when ESLINT_USE_FLAT_CONFIG=false even if an eslint.config.js is present:${configType}`, async () => {
                    process.env.ESLINT_USE_FLAT_CONFIG = "false";
                    process.cwd = getFixturePath;

                    const exitCode = await cli.execute(`--no-ignore --ext .js ${getFixturePath("files")}`, null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);


                    if (useFlatConfig) {
                        assert.strictEqual(processStub.callCount, 1, "calls `process.emitWarning()` once");
                        assert.strictEqual(processStub.getCall(0).args[1], "ESLintRCWarning");
                    }
                });

                it(`should use it when ESLINT_USE_FLAT_CONFIG=true and useFlatConfig is true even if an eslint.config.js is not present:${configType}`, async () => {
                    process.env.ESLINT_USE_FLAT_CONFIG = "true";

                    // Set the CWD to outside the fixtures/ directory so that no eslint.config.js is found
                    process.cwd = () => getFixturePath("..");

                    const exitCode = await cli.execute(`--no-ignore --ext .js ${getFixturePath("files")}`, null, useFlatConfig);

                    // When flat config is used, we get an exit code of 2 because the --ext option is unrecognized.
                    assert.strictEqual(exitCode, useFlatConfig ? 2 : 0);
                });
            });

            describe("when given a config with rules with options and severity level set to error", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                it(`should exit with an error status (1) with configType:${configType}`, async () => {
                    const configPath = getFixturePath("configurations", "quotes-error.js");
                    const filePath = getFixturePath("single-quoted.js");
                    const code = `--no-ignore --config ${configPath} ${filePath}`;

                    const exitStatus = await cli.execute(code, null, useFlatConfig);

                    assert.strictEqual(exitStatus, 1);
                });
            });

            describe("when there is a local config file", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                it(`should load the local config file with configType:${configType}`, async () => {
                    await cli.execute("cli/passing.js --no-ignore", null, useFlatConfig);
                });

                if (useFlatConfig) {
                    it(`should load the local config file with glob pattern and configType:${configType}`, async () => {
                        await cli.execute("cli/pass*.js --no-ignore", null, useFlatConfig);
                    });
                }

                // only works on Windows
                if (os.platform() === "win32") {
                    it(`should load the local config file with Windows slashes glob pattern and configType:${configType}`, async () => {
                        await cli.execute("cli\\pass*.js --no-ignore", null, useFlatConfig);
                    });
                }
            });

            describe("Formatters", () => {

                const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";

                describe("when given a valid built-in formatter name", () => {
                    it(`should execute without any errors with configType:${configType}`, async () => {
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`${flag} -f json ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exit, 0);
                    });
                });

                describe("when given a valid built-in formatter name that uses rules meta.", () => {

                    const originalCwd = process.cwd;

                    beforeEach(() => {
                        process.cwd = () => getFixturePath();
                    });

                    afterEach(() => {
                        process.cwd = originalCwd;
                    });

                    it(`should execute without any errors with configType:${configType}`, async () => {
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`--no-ignore -f json-with-metadata ${filePath} ${flag}`, null, useFlatConfig);

                        assert.strictEqual(exit, 0);

                        /*
                         * Note: There is a behavior difference between eslintrc and flat config
                         * when using formatters. For eslintrc, rulesMeta always contains every
                         * rule that was loaded during the last run; for flat config, rulesMeta
                         * only contains meta data for the rules that triggered messages in the
                         * results. (Flat config uses ESLint#getRulesMetaForResults().)
                         */

                        // Check metadata.
                        const { metadata } = JSON.parse(log.info.args[0][0]);
                        const expectedMetadata = {
                            cwd: process.cwd(),
                            rulesMeta: useFlatConfig ? {} : Array.from(BuiltinRules).reduce((obj, [ruleId, rule]) => {
                                obj[ruleId] = rule.meta;
                                return obj;
                            }, {})
                        };

                        assert.deepStrictEqual(metadata, expectedMetadata);
                    });
                });

                describe("when the --max-warnings option is passed", () => {

                    describe("and there are too many warnings", () => {
                        it(`should provide \`maxWarningsExceeded\` metadata to the formatter with configType:${configType}`, async () => {
                            const exit = await cli.execute(
                                `--no-ignore -f json-with-metadata --max-warnings 1 --rule 'quotes: warn' ${flag}`,
                                "'hello' + 'world';",
                                useFlatConfig
                            );

                            assert.strictEqual(exit, 1);

                            const { metadata } = JSON.parse(log.info.args[0][0]);

                            assert.deepStrictEqual(
                                metadata.maxWarningsExceeded,
                                { maxWarnings: 1, foundWarnings: 2 }
                            );
                        });
                    });

                    describe("and warnings do not exceed the limit", () => {
                        it(`should omit \`maxWarningsExceeded\` metadata from the formatter with configType:${configType}`, async () => {
                            const exit = await cli.execute(
                                `--no-ignore -f json-with-metadata --max-warnings 1 --rule 'quotes: warn' ${flag}`,
                                "'hello world';",
                                useFlatConfig
                            );

                            assert.strictEqual(exit, 0);

                            const { metadata } = JSON.parse(log.info.args[0][0]);

                            assert.notProperty(metadata, "maxWarningsExceeded");
                        });
                    });
                });

                describe("when given an invalid built-in formatter name", () => {

                    const originalCwd = process.cwd;

                    beforeEach(() => {
                        process.cwd = () => getFixturePath();
                    });

                    afterEach(() => {
                        process.cwd = originalCwd;
                    });

                    it(`should execute with error: with configType:${configType}`, async () => {
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`-f fakeformatter ${filePath} ${flag}`, null, useFlatConfig);

                        assert.strictEqual(exit, 2);
                    });
                });

                describe("when given a valid formatter path", () => {

                    const originalCwd = process.cwd;

                    beforeEach(() => {
                        process.cwd = () => getFixturePath();
                    });

                    afterEach(() => {
                        process.cwd = originalCwd;
                    });

                    it(`should execute without any errors with configType:${configType}`, async () => {
                        const formatterPath = getFixturePath("formatters", "simple.js");
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`-f ${formatterPath} ${filePath} ${flag}`, null, useFlatConfig);

                        assert.strictEqual(exit, 0);
                    });
                });

                describe("when given an invalid formatter path", () => {

                    const originalCwd = process.cwd;

                    beforeEach(() => {
                        process.cwd = () => getFixturePath();
                    });

                    afterEach(() => {
                        process.cwd = originalCwd;
                    });

                    it(`should execute with error with configType:${configType}`, async () => {
                        const formatterPath = getFixturePath("formatters", "file-does-not-exist.js");
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`--no-ignore -f ${formatterPath} ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exit, 2);
                    });
                });

                describe("when given an async formatter path", () => {

                    const originalCwd = process.cwd;

                    beforeEach(() => {
                        process.cwd = () => getFixturePath();
                    });

                    afterEach(() => {
                        process.cwd = originalCwd;
                    });

                    it(`should execute without any errors with configType:${configType}`, async () => {
                        const formatterPath = getFixturePath("formatters", "async.js");
                        const filePath = getFixturePath("passing.js");
                        const exit = await cli.execute(`-f ${formatterPath} ${filePath} ${flag}`, null, useFlatConfig);

                        assert.strictEqual(log.info.getCall(0).args[0], "from async formatter");
                        assert.strictEqual(exit, 0);
                    });
                });
            });

            describe("Exit Codes", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                describe("when executing a file with a lint error", () => {

                    it(`should exit with error with configType:${configType}`, async () => {
                        const filePath = getFixturePath("undef.js");
                        const code = `--no-ignore --rule no-undef:2 ${filePath}`;

                        const exit = await cli.execute(code, null, useFlatConfig);

                        assert.strictEqual(exit, 1);
                    });
                });

                describe("when using --fix-type without --fix or --fix-dry-run", () => {
                    it(`should exit with error with configType:${configType}`, async () => {
                        const filePath = getFixturePath("passing.js");
                        const code = `--fix-type suggestion ${filePath}`;

                        const exit = await cli.execute(code, null, useFlatConfig);

                        assert.strictEqual(exit, 2);
                    });
                });

                describe("when executing a file with a syntax error", () => {
                    it(`should exit with error with configType:${configType}`, async () => {
                        const filePath = getFixturePath("syntax-error.js");
                        const exit = await cli.execute(`--no-ignore ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exit, 1);
                    });
                });

            });

            describe("when calling execute more than once", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                it(`should not print the results from previous execution with configType:${configType}`, async () => {
                    const filePath = getFixturePath("missing-semicolon.js");
                    const passingPath = getFixturePath("passing.js");

                    await cli.execute(`--no-ignore --rule semi:2 ${filePath}`, null, useFlatConfig);

                    assert.isTrue(log.info.called, "Log should have been called.");

                    log.info.resetHistory();

                    await cli.execute(`--no-ignore --rule semi:2 ${passingPath}`, null, useFlatConfig);
                    assert.isTrue(log.info.notCalled);

                });
            });

            describe("when executing with version flag", () => {
                it(`should print out current version with configType:${configType}`, async () => {
                    assert.strictEqual(await cli.execute("-v", null, useFlatConfig), 0);
                    assert.strictEqual(log.info.callCount, 1);
                });
            });

            describe("when executing with env-info flag", () => {

                it(`should print out environment information with configType:${configType}`, async () => {
                    assert.strictEqual(await cli.execute("--env-info", null, useFlatConfig), 0);
                    assert.strictEqual(log.info.callCount, 1);
                });

                describe("With error condition", () => {

                    beforeEach(() => {
                        RuntimeInfo.environment = sinon.stub().throws("There was an error!");
                    });

                    afterEach(() => {
                        RuntimeInfo.environment = sinon.stub();
                    });

                    it(`should print error message and return error code with configType:${configType}`, async () => {

                        assert.strictEqual(await cli.execute("--env-info", null, useFlatConfig), 2);
                        assert.strictEqual(log.error.callCount, 1);
                    });
                });

            });

            describe("when executing with help flag", () => {
                it(`should print out help with configType:${configType}`, async () => {
                    assert.strictEqual(await cli.execute("-h", null, useFlatConfig), 0);
                    assert.strictEqual(log.info.callCount, 1);
                });
            });

            describe("when executing a file with a shebang", () => {
                it(`should execute without error with configType:${configType}`, async () => {
                    const filePath = getFixturePath("shebang.js");
                    const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";
                    const exit = await cli.execute(`${flag} --no-ignore ${filePath}`, null, useFlatConfig);

                    assert.strictEqual(exit, 0);
                });
            });

            describe("FixtureDir Dependent Tests", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                describe("when given a config file and a directory of files", () => {
                    it(`should load and execute without error with configType:${configType}`, async () => {
                        const configPath = getFixturePath("configurations", "semi-error.js");
                        const filePath = getFixturePath("formatters");
                        const code = `--no-ignore --config ${configPath} ${filePath}`;
                        const exitStatus = await cli.execute(code, null, useFlatConfig);

                        assert.strictEqual(exitStatus, 0);
                    });
                });

                describe("when executing with global flag", () => {

                    it(`should default defined variables to read-only with configType:${configType}`, async () => {
                        const filePath = getFixturePath("undef.js");
                        const exit = await cli.execute(`--global baz,bat --no-ignore --rule no-global-assign:2 ${filePath}`, null, useFlatConfig);

                        assert.isTrue(log.info.calledOnce);
                        assert.strictEqual(exit, 1);
                    });

                    it(`should allow defining writable global variables with configType:${configType}`, async () => {
                        const filePath = getFixturePath("undef.js");
                        const exit = await cli.execute(`--global baz:false,bat:true --no-ignore ${filePath}`, null, useFlatConfig);

                        assert.isTrue(log.info.notCalled);
                        assert.strictEqual(exit, 0);
                    });

                    it(`should allow defining variables with multiple flags with configType:${configType}`, async () => {
                        const filePath = getFixturePath("undef.js");
                        const exit = await cli.execute(`--global baz --global bat:true --no-ignore ${filePath}`, null, useFlatConfig);

                        assert.isTrue(log.info.notCalled);
                        assert.strictEqual(exit, 0);
                    });
                });


                describe("when supplied with rule flag and severity level set to error", () => {


                    it(`should exit with an error status (2) with configType:${configType}`, async () => {
                        const filePath = getFixturePath("single-quoted.js");
                        const code = `--no-ignore --rule 'quotes: [2, double]' ${filePath}`;
                        const exitStatus = await cli.execute(code, null, useFlatConfig);

                        assert.strictEqual(exitStatus, 1);
                    });
                });

                describe("when the quiet option is enabled", () => {

                    it(`should only print error with configType:${configType}`, async () => {
                        const filePath = getFixturePath("single-quoted.js");
                        const cliArgs = `--no-ignore --quiet -f stylish --rule 'quotes: [2, double]' --rule 'no-undef: 1' ${filePath}`;

                        await cli.execute(cliArgs, null, useFlatConfig);

                        sinon.assert.calledOnce(log.info);

                        const formattedOutput = log.info.firstCall.args[0];

                        assert.include(formattedOutput, "(1 error, 0 warnings)");
                    });

                    it(`should print nothing if there are no errors with configType:${configType}`, async () => {
                        const filePath = getFixturePath("single-quoted.js");
                        const cliArgs = `--no-ignore --quiet -f stylish --rule 'quotes: [1, double]' --rule 'no-undef: 1' ${filePath}`;

                        await cli.execute(cliArgs, null, useFlatConfig);

                        sinon.assert.notCalled(log.info);
                    });

                    if (useFlatConfig) {
                        it(`should not run rules set to 'warn' with configType:${configType}`, async () => {
                            const filePath = getFixturePath("single-quoted.js");
                            const configPath = getFixturePath("eslint.config-rule-throws.js");
                            const cliArgs = `--quiet --config ${configPath}' ${filePath}`;

                            const exit = await cli.execute(cliArgs, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });

                        it(`should run rules set to 'warn' while maxWarnings is set with configType:${configType}`, async () => {
                            const filePath = getFixturePath("single-quoted.js");
                            const configPath = getFixturePath("eslint.config-rule-throws.js");
                            const cliArgs = `--quiet --max-warnings=1 --config ${configPath}' ${filePath}`;

                            await stdAssert.rejects(async () => {
                                await cli.execute(cliArgs, null, useFlatConfig);
                            });
                        });
                    }
                });


                describe("no-error-on-unmatched-pattern flag", () => {

                    describe("when executing without no-error-on-unmatched-pattern flag", () => {
                        it(`should throw an error on unmatched glob pattern with configType:${configType}`, async () => {
                            let filePath = getFixturePath("unmatched-patterns");
                            const globPattern = "unmatched*.js";

                            if (useFlatConfig) {
                                filePath = filePath.replace(/\\/gu, "/");
                            }

                            await stdAssert.rejects(async () => {
                                await cli.execute(`"${filePath}/${globPattern}"`, null, useFlatConfig);
                            }, new Error(`No files matching '${filePath}/${globPattern}' were found.`));
                        });

                    });

                    describe("when executing with no-error-on-unmatched-pattern flag", () => {
                        it(`should not throw an error on unmatched node glob syntax patterns with configType:${configType}`, async () => {
                            const filePath = getFixturePath("unmatched-patterns");
                            const exit = await cli.execute(`--no-error-on-unmatched-pattern "${filePath}/unmatched*.js"`, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });
                    });

                    describe("when executing with no-error-on-unmatched-pattern flag and multiple patterns", () => {
                        it(`should not throw an error on multiple unmatched node glob syntax patterns with configType:${configType}`, async () => {
                            const filePath = getFixturePath("unmatched-patterns/js3");
                            const exit = await cli.execute(`--no-error-on-unmatched-pattern ${filePath}/unmatched1*.js ${filePath}/unmatched2*.js`, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });

                        it(`should still throw an error on when a matched pattern has lint errors with configType:${configType}`, async () => {
                            const filePath = getFixturePath("unmatched-patterns");
                            const exit = await cli.execute(`--no-ignore --no-error-on-unmatched-pattern ${filePath}/unmatched1*.js ${filePath}/failing.js`, null, useFlatConfig);

                            assert.strictEqual(exit, 1);
                        });
                    });

                });

                describe("Parser Options", () => {

                    describe("when given parser options", () => {
                        it(`should exit with error if parser options are invalid with configType:${configType}`, async () => {
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`--no-ignore --parser-options test111 ${filePath}`, null, useFlatConfig);

                            assert.strictEqual(exit, 2);
                        });

                        it(`should exit with no error if parser is valid with configType:${configType}`, async () => {
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`--no-ignore --parser-options=ecmaVersion:6 ${filePath}`, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });

                        it(`should exit with an error on ecmaVersion 7 feature in ecmaVersion 6 with configType:${configType}`, async () => {
                            const filePath = getFixturePath("passing-es7.js");
                            const exit = await cli.execute(`--no-ignore --parser-options=ecmaVersion:6 ${filePath}`, null, useFlatConfig);

                            assert.strictEqual(exit, 1);
                        });

                        it(`should exit with no error on ecmaVersion 7 feature in ecmaVersion 7 with configType:${configType}`, async () => {
                            const filePath = getFixturePath("passing-es7.js");
                            const exit = await cli.execute(`--no-ignore --parser-options=ecmaVersion:7 ${filePath}`, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });

                        it(`should exit with no error on ecmaVersion 7 feature with config ecmaVersion 6 and command line ecmaVersion 7 with configType:${configType}`, async () => {
                            const configPath = useFlatConfig
                                ? getFixturePath("configurations", "es6.js")
                                : getFixturePath("configurations", "es6.json");
                            const filePath = getFixturePath("passing-es7.js");
                            const exit = await cli.execute(`--no-ignore --config ${configPath} --parser-options=ecmaVersion:7 ${filePath}`, null, useFlatConfig);

                            assert.strictEqual(exit, 0);
                        });
                    });
                });

                describe("when given the max-warnings flag", () => {

                    let filePath, configFilePath;

                    before(() => {
                        filePath = getFixturePath("max-warnings/six-warnings.js");
                        configFilePath = getFixturePath(useFlatConfig ? "max-warnings/eslint.config.js" : "max-warnings/.eslintrc");
                    });

                    it(`should not change exit code if warning count under threshold with configType:${configType}`, async () => {
                        const exitCode = await cli.execute(`--no-ignore --max-warnings 10 ${filePath} -c ${configFilePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 0);
                    });

                    it(`should exit with exit code 1 if warning count exceeds threshold with configType:${configType}`, async () => {
                        const exitCode = await cli.execute(`--no-ignore --max-warnings 5 ${filePath} -c ${configFilePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 1);
                        assert.ok(log.error.calledOnce);
                        assert.include(log.error.getCall(0).args[0], "ESLint found too many warnings");
                    });

                    it(`should exit with exit code 1 without printing warnings if the quiet option is enabled and warning count exceeds threshold with configType:${configType}`, async () => {
                        const exitCode = await cli.execute(`--no-ignore --quiet --max-warnings 5 ${filePath} -c ${configFilePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 1);
                        assert.ok(log.error.calledOnce);
                        assert.include(log.error.getCall(0).args[0], "ESLint found too many warnings");
                        assert.ok(log.info.notCalled); // didn't print warnings
                    });

                    it(`should not change exit code if warning count equals threshold with configType:${configType}`, async () => {
                        const exitCode = await cli.execute(`--no-ignore --max-warnings 6 ${filePath} -c ${configFilePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 0);
                    });

                    it(`should not change exit code if flag is not specified and there are warnings with configType:${configType}`, async () => {
                        const exitCode = await cli.execute(`-c ${configFilePath} ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 0);
                    });
                });

                describe("when given the exit-on-fatal-error flag", () => {
                    it(`should not change exit code if no fatal errors are reported with configType:${configType}`, async () => {
                        const filePath = getFixturePath("exit-on-fatal-error", "no-fatal-error.js");
                        const exitCode = await cli.execute(`--no-ignore --exit-on-fatal-error ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 0);
                    });

                    it(`should exit with exit code 1 if no fatal errors are found, but rule violations are found with configType:${configType}`, async () => {
                        const filePath = getFixturePath("exit-on-fatal-error", "no-fatal-error-rule-violation.js");
                        const exitCode = await cli.execute(`--no-ignore --exit-on-fatal-error ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 1);
                    });

                    it(`should exit with exit code 2 if fatal error is found with configType:${configType}`, async () => {
                        const filePath = getFixturePath("exit-on-fatal-error", "fatal-error.js");
                        const exitCode = await cli.execute(`--no-ignore --exit-on-fatal-error ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 2);
                    });

                    it(`should exit with exit code 2 if fatal error is found in any file with configType:${configType}`, async () => {
                        const filePath = getFixturePath("exit-on-fatal-error");
                        const exitCode = await cli.execute(`--no-ignore --exit-on-fatal-error ${filePath}`, null, useFlatConfig);

                        assert.strictEqual(exitCode, 2);
                    });


                });


                describe("Ignores", () => {

                    describe("when given a directory with eslint excluded files in the directory", () => {
                        it(`should throw an error and not process any files with configType:${configType}`, async () => {
                            const options = useFlatConfig
                                ? `--config ${getFixturePath("eslint.config-with-ignores.js")}`
                                : `--ignore-path ${getFixturePath(".eslintignore")}`;
                            const filePath = getFixturePath("cli");
                            const expectedMessage = useFlatConfig
                                ? `All files matched by '${filePath.replace(/\\/gu, "/")}' are ignored.`
                                : `All files matched by '${filePath}' are ignored.`;

                            await stdAssert.rejects(async () => {
                                await cli.execute(`${options} ${filePath}`, null, useFlatConfig);
                            }, new Error(expectedMessage));
                        });
                    });

                    describe("when given a file in excluded files list", () => {
                        it(`should not process the file with configType:${configType}`, async () => {
                            const options = useFlatConfig
                                ? `--config ${getFixturePath("eslint.config-with-ignores.js")}`
                                : `--ignore-path ${getFixturePath(".eslintignore")}`;
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`${options} ${filePath}`, null, useFlatConfig);

                            // a warning about the ignored file
                            assert.isTrue(log.info.called);
                            assert.strictEqual(exit, 0);
                        });

                        it(`should process the file when forced with configType:${configType}`, async () => {
                            const options = useFlatConfig
                                ? `--config ${getFixturePath("eslint.config-with-ignores.js")}`
                                : `--ignore-path ${getFixturePath(".eslintignore")}`;
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`${options} --no-ignore ${filePath}`, null, useFlatConfig);

                            // no warnings
                            assert.isFalse(log.info.called);
                            assert.strictEqual(exit, 0);
                        });

                        it(`should suppress the warning if --no-warn-ignored is passed with configType:${configType}`, async () => {
                            const options = useFlatConfig
                                ? `--config ${getFixturePath("eslint.config-with-ignores.js")}`
                                : `--ignore-path ${getFixturePath(".eslintignore")}`;
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`${options} --no-warn-ignored ${filePath}`, null, useFlatConfig);

                            assert.isFalse(log.info.called);

                            // When eslintrc is used, we get an exit code of 2 because the --no-warn-ignored option is unrecognized.
                            assert.strictEqual(exit, useFlatConfig ? 0 : 2);
                        });

                        it(`should not lint anything when no files are passed if --pass-on-no-patterns is passed with configType:${configType}`, async () => {
                            const exit = await cli.execute("--pass-on-no-patterns", null, useFlatConfig);

                            assert.isFalse(log.info.called);
                            assert.strictEqual(exit, 0);
                        });

                        it(`should suppress the warning if --no-warn-ignored is passed and an ignored file is passed via stdin with configType:${configType}`, async () => {
                            const options = useFlatConfig
                                ? `--config ${getFixturePath("eslint.config-with-ignores.js")}`
                                : `--ignore-path ${getFixturePath(".eslintignore")}`;
                            const filePath = getFixturePath("passing.js");
                            const exit = await cli.execute(`${options} --no-warn-ignored --stdin --stdin-filename ${filePath}`, "foo", useFlatConfig);

                            assert.isFalse(log.info.called);

                            // When eslintrc is used, we get an exit code of 2 because the --no-warn-ignored option is unrecognized.
                            assert.strictEqual(exit, useFlatConfig ? 0 : 2);
                        });
                    });

                    describe("when given a pattern to ignore", () => {
                        it(`should not process any files with configType:${configType}`, async () => {
                            const ignoredFile = getFixturePath("cli/syntax-error.js");
                            const ignorePathOption = useFlatConfig
                                ? ""
                                : "--ignore-path .eslintignore_empty";
                            const filePath = getFixturePath("cli/passing.js");
                            const ignorePattern = useFlatConfig ? "cli/**" : "cli/";
                            const exit = await cli.execute(
                                `--ignore-pattern ${ignorePattern} ${ignorePathOption} ${ignoredFile} ${filePath}`, null, useFlatConfig
                            );

                            // warnings about the ignored files
                            assert.isTrue(log.info.called);
                            assert.strictEqual(exit, 0);
                        });

                        it(`should interpret pattern that contains a slash as relative to cwd with configType:${configType}`, async () => {
                            process.cwd = () => getFixturePath("cli/ignore-pattern-relative/subdir");

                            /*
                             * The config file is in `cli/ignore-pattern-relative`, so this would fail
                             * if `subdir/**` ignore pattern is interpreted as relative to the config base path.
                             */
                            const exit = await cli.execute("**/*.js --ignore-pattern subdir/**", null, useFlatConfig);

                            assert.strictEqual(exit, 0);

                            await stdAssert.rejects(
                                async () => await cli.execute("**/*.js --ignore-pattern subsubdir/*.js", null, useFlatConfig),
                                /All files matched by '\*\*\/\*\.js' are ignored/u
                            );
                        });

                        it(`should interpret pattern that doesn't contain a slash as relative to cwd with configType:${configType}`, async () => {
                            process.cwd = () => getFixturePath("cli/ignore-pattern-relative/subdir/subsubdir");

                            await stdAssert.rejects(
                                async () => await cli.execute("**/*.js --ignore-pattern *.js", null, useFlatConfig),
                                /All files matched by '\*\*\/\*\.js' are ignored/u
                            );
                        });

                        if (useFlatConfig) {
                            it("should ignore files if the pattern is a path to a directory (with trailing slash)", async () => {
                                const filePath = getFixturePath("cli/syntax-error.js");
                                const exit = await cli.execute(`--ignore-pattern cli/ ${filePath}`, null, true);

                                // parsing error causes exit code 1
                                assert.isTrue(log.info.called);
                                assert.strictEqual(exit, 0);
                            });

                            it("should ignore files if the pattern is a path to a directory (without trailing slash)", async () => {
                                const filePath = getFixturePath("cli/syntax-error.js");
                                const exit = await cli.execute(`--ignore-pattern cli ${filePath}`, null, true);

                                // parsing error causes exit code 1
                                assert.isTrue(log.info.called);
                                assert.strictEqual(exit, 0);
                            });
                        }
                    });

                });

            });


            describe("when given a parser name", () => {

                it(`should exit with a fatal error if parser is invalid with configType:${configType}`, async () => {
                    const filePath = getFixturePath("passing.js");

                    await stdAssert.rejects(async () => await cli.execute(`--no-ignore --parser test111 ${filePath}`, null, useFlatConfig), "Cannot find module 'test111'");
                });

                it(`should exit with no error if parser is valid with configType:${configType}`, async () => {
                    const filePath = getFixturePath("passing.js");
                    const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";
                    const exit = await cli.execute(`${flag} --no-ignore --parser espree ${filePath}`, null, useFlatConfig);

                    assert.strictEqual(exit, 0);
                });

            });

            describe("when supplied with report output file path", () => {
                const flag = useFlatConfig ? "--no-config-lookup" : "--no-eslintrc";

                afterEach(() => {
                    sh.rm("-rf", "tests/output");
                });

                it(`should write the file and create dirs if they don't exist with configType:${configType}`, async () => {
                    const filePath = getFixturePath("single-quoted.js");
                    const code = `${flag} --rule 'quotes: [1, double]' --o tests/output/eslint-output.txt ${filePath}`;

                    await cli.execute(code, null, useFlatConfig);

                    assert.include(fs.readFileSync("tests/output/eslint-output.txt", "utf8"), filePath);
                    assert.isTrue(log.info.notCalled);
                });

                // https://github.com/eslint/eslint/issues/17660
                it(`should write the file and create dirs if they don't exist even when output is empty with configType:${configType}`, async () => {
                    const filePath = getFixturePath("single-quoted.js");
                    const code = `${flag} --rule 'quotes: [1, single]' --o tests/output/eslint-output.txt ${filePath}`;

                    // TODO: fix this test to: await cli.execute(code, null, useFlatConfig);
                    await cli.execute(code, "var a = 'b'", useFlatConfig);

                    assert.isTrue(fs.existsSync("tests/output/eslint-output.txt"));
                    assert.strictEqual(fs.readFileSync("tests/output/eslint-output.txt", "utf8"), "");
                    assert.isTrue(log.info.notCalled);
                });

                it(`should return an error if the path is a directory with configType:${configType}`, async () => {
                    const filePath = getFixturePath("single-quoted.js");
                    const code = `${flag} --rule 'quotes: [1, double]' --o tests/output ${filePath}`;

                    fs.mkdirSync("tests/output");

                    const exit = await cli.execute(code, null, useFlatConfig);

                    assert.strictEqual(exit, 2);
                    assert.isTrue(log.info.notCalled);
                    assert.isTrue(log.error.calledOnce);
                });

                it(`should return an error if the path could not be written to with configType:${configType}`, async () => {
                    const filePath = getFixturePath("single-quoted.js");
                    const code = `${flag} --rule 'quotes: [1, double]' --o tests/output/eslint-output.txt ${filePath}`;

                    fs.writeFileSync("tests/output", "foo");

                    const exit = await cli.execute(code, null, useFlatConfig);

                    assert.strictEqual(exit, 2);
                    assert.isTrue(log.info.notCalled);
                    assert.isTrue(log.error.calledOnce);
                });
            });

            describe("when passed --no-inline-config", () => {
                let localCLI;

                afterEach(() => {
                    sinon.verifyAndRestore();
                });

                it(`should pass allowInlineConfig:false to ESLint when --no-inline-config is used with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ allowInlineConfig: false }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns([{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 2,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0
                    }]);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.stub();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    await localCLI.execute("--no-inline-config .", null, useFlatConfig);
                });

                it(`should not error and allowInlineConfig should be true by default with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ allowInlineConfig: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns([]);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.stub();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute(".", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);

                });

            });

            describe("when passed --fix", () => {
                let localCLI;

                afterEach(() => {
                    sinon.verifyAndRestore();
                });

                it(`should pass fix:true to ESLint when executing on files with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns([]);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.mock().once();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);

                });


                it(`should rewrite files when in fix mode with configType:${configType}`, async () => {

                    const report = [{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 2,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0
                    }];

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns(report);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.mock().withExactArgs(report);

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 1);

                });

                it(`should provide fix predicate and rewrite files when in fix mode and quiet mode with configType:${configType}`, async () => {

                    const report = [{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 1,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 0,
                        warningCount: 1
                    }];

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: sinon.match.func }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns(report);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.getErrorResults = sinon.stub().returns([]);
                    fakeESLint.outputFixes = sinon.mock().withExactArgs(report);

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix --quiet .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);

                });

                it(`should not call ESLint and return 2 when executing on text with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix .", "foo = bar;", useFlatConfig);

                    assert.strictEqual(exitCode, 2);
                });

            });

            describe("when passed --fix-dry-run", () => {
                let localCLI;

                afterEach(() => {
                    sinon.verifyAndRestore();
                });

                it(`should pass fix:true to ESLint when executing on files with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns([]);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },

                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix-dry-run .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);

                });

                it(`should pass fixTypes to ESLint when --fix-type is passed with configType:${configType}`, async () => {

                    const expectedESLintOptions = {
                        fix: true,
                        fixTypes: ["suggestion"]
                    };

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match(expectedESLintOptions));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns([]);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.stub();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },

                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix-dry-run --fix-type suggestion .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);
                });

                it(`should not rewrite files when in fix-dry-run mode with configType:${configType}`, async () => {

                    const report = [{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 2,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0
                    }];

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns(report);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },

                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix-dry-run .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 1);

                });

                it(`should provide fix predicate when in fix-dry-run mode and quiet mode with configType:${configType}`, async () => {

                    const report = [{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 1,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 0,
                        warningCount: 1
                    }];

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: sinon.match.func }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintFiles").returns(report);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.getErrorResults = sinon.stub().returns([]);
                    fakeESLint.outputFixes = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },

                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix-dry-run --quiet .", null, useFlatConfig);

                    assert.strictEqual(exitCode, 0);

                });

                it(`should allow executing on text with configType:${configType}`, async () => {

                    const report = [{
                        filePath: "./foo.js",
                        output: "bar",
                        messages: [
                            {
                                severity: 2,
                                message: "Fake message"
                            }
                        ],
                        errorCount: 1,
                        warningCount: 0
                    }];

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().withExactArgs(sinon.match({ fix: true }));

                    Object.defineProperties(fakeESLint.prototype, Object.getOwnPropertyDescriptors(ActiveESLint.prototype));
                    sinon.stub(fakeESLint.prototype, "lintText").returns(report);
                    sinon.stub(fakeESLint.prototype, "loadFormatter").returns({ format: () => "done" });
                    fakeESLint.outputFixes = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },

                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix-dry-run .", "foo = bar;", useFlatConfig);

                    assert.strictEqual(exitCode, 1);
                });

                it(`should not call ESLint and return 2 when used with --fix with configType:${configType}`, async () => {

                    // create a fake ESLint class to test with
                    const fakeESLint = sinon.mock().never();

                    localCLI = proxyquire("../../lib/cli", {
                        "./eslint": { LegacyESLint: fakeESLint },
                        "./eslint/eslint": { ESLint: fakeESLint, shouldUseFlatConfig: () => Promise.resolve(useFlatConfig) },
                        "./shared/logging": log
                    });

                    const exitCode = await localCLI.execute("--fix --fix-dry-run .", "foo = bar;", useFlatConfig);

                    assert.strictEqual(exitCode, 2);
                });
            });

            describe("when passing --print-config", () => {

                const originalCwd = process.cwd;

                beforeEach(() => {
                    process.cwd = () => getFixturePath();
                });

                afterEach(() => {
                    process.cwd = originalCwd;
                });

                it(`should print out the configuration with configType:${configType}`, async () => {
                    const filePath = getFixturePath("xxx.js");

                    const exitCode = await cli.execute(`--print-config ${filePath}`, null, useFlatConfig);

                    assert.isTrue(log.info.calledOnce);
                    assert.strictEqual(exitCode, 0);
                });

                it(`should error if any positional file arguments are passed with configType:${configType}`, async () => {
                    const filePath1 = getFixturePath("files", "bar.js");
                    const filePath2 = getFixturePath("files", "foo.js");

                    const exitCode = await cli.execute(`--print-config ${filePath1} ${filePath2}`, null, useFlatConfig);

                    assert.isTrue(log.info.notCalled);
                    assert.isTrue(log.error.calledOnce);
                    assert.strictEqual(exitCode, 2);
                });

                it(`should error out when executing on text with configType:${configType}`, async () => {
                    const exitCode = await cli.execute("--print-config=myFile.js", "foo = bar;", useFlatConfig);

                    assert.isTrue(log.info.notCalled);
                    assert.isTrue(log.error.calledOnce);
                    assert.strictEqual(exitCode, 2);
                });
            });

            describe("when passing --report-unused-disable-directives", () => {
                describe(`config type: ${configType}`, () => {
                    it("errors when --report-unused-disable-directives", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                        assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                        assert.ok(log.info.firstCall.args[0].includes("1 error and 0 warning"), "has correct error and warning count");
                        assert.strictEqual(exitCode, 1, "exit code should be 1");
                    });

                    it("errors when --report-unused-disable-directives-severity error", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity error --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                        assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                        assert.ok(log.info.firstCall.args[0].includes("1 error and 0 warning"), "has correct error and warning count");
                        assert.strictEqual(exitCode, 1, "exit code should be 1");
                    });

                    it("errors when --report-unused-disable-directives-severity 2", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity 2 --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                        assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                        assert.ok(log.info.firstCall.args[0].includes("1 error and 0 warning"), "has correct error and warning count");
                        assert.strictEqual(exitCode, 1, "exit code should be 1");
                    });

                    it("warns when --report-unused-disable-directives-severity warn", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity warn --rule "'no-console': 'error'""`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                        assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                        assert.ok(log.info.firstCall.args[0].includes("0 errors and 1 warning"), "has correct error and warning count");
                        assert.strictEqual(exitCode, 0, "exit code should be 0");
                    });

                    it("warns when --report-unused-disable-directives-severity 1", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity 1 --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                        assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                        assert.ok(log.info.firstCall.args[0].includes("0 errors and 1 warning"), "has correct error and warning count");
                        assert.strictEqual(exitCode, 0, "exit code should be 0");
                    });

                    it("does not report when --report-unused-disable-directives-severity off", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity off --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 0, "log.info should not be called");
                        assert.strictEqual(exitCode, 0, "exit code should be 0");
                    });

                    it("does not report when --report-unused-disable-directives-severity 0", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity 0 --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                        assert.strictEqual(log.info.callCount, 0, "log.info should not be called");
                        assert.strictEqual(exitCode, 0, "exit code should be 0");
                    });

                    it("fails when passing invalid string for --report-unused-disable-directives-severity", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives-severity foo`, null, useFlatConfig);

                        assert.strictEqual(log.info.callCount, 0, "log.info should not be called");
                        assert.strictEqual(log.error.callCount, 1, "log.error should be called once");

                        const lines = ["Option report-unused-disable-directives-severity: 'foo' not one of off, warn, error, 0, 1, or 2."];

                        if (useFlatConfig) {
                            lines.push("You're using eslint.config.js, some command line flags are no longer available. Please see https://eslint.org/docs/latest/use/command-line-interface for details.");
                        }
                        assert.deepStrictEqual(log.error.firstCall.args, [lines.join("\n")], "has the right text to log.error");
                        assert.strictEqual(exitCode, 2, "exit code should be 2");
                    });

                    it("fails when passing both --report-unused-disable-directives and --report-unused-disable-directives-severity", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --report-unused-disable-directives --report-unused-disable-directives-severity warn`, null, useFlatConfig);

                        assert.strictEqual(log.info.callCount, 0, "log.info should not be called");
                        assert.strictEqual(log.error.callCount, 1, "log.error should be called once");
                        assert.deepStrictEqual(log.error.firstCall.args, ["The --report-unused-disable-directives option and the --report-unused-disable-directives-severity option cannot be used together."], "has the right text to log.error");
                        assert.strictEqual(exitCode, 2, "exit code should be 2");
                    });

                    it("warns by default in flat config only", async () => {
                        const exitCode = await cli.execute(`${useFlatConfig ? "--no-config-lookup" : "--no-eslintrc"} --rule "'no-console': 'error'"`,
                            "foo(); // eslint-disable-line no-console",
                            useFlatConfig);

                        if (useFlatConfig) {
                            assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                            assert.strictEqual(log.info.callCount, 1, "log.info is called once");
                            assert.ok(log.info.firstCall.args[0].includes("Unused eslint-disable directive (no problems were reported from 'no-console')"), "has correct message about unused directives");
                            assert.ok(log.info.firstCall.args[0].includes("0 errors and 1 warning"), "has correct error and warning count");
                            assert.strictEqual(exitCode, 0, "exit code should be 0");
                        } else {
                            assert.strictEqual(log.error.callCount, 0, "log.error should not be called");
                            assert.strictEqual(log.info.callCount, 0, "log.info should not be called");
                            assert.strictEqual(exitCode, 0, "exit code should be 0");
                        }
                    });
                });
            });

            // ---------
        });


        describe("when given a config file", () => {
            it("should load the specified config file", async () => {
                const configPath = getFixturePath("eslint.config.js");
                const filePath = getFixturePath("passing.js");

                await cli.execute(`--config ${configPath} ${filePath}`);
            });
        });


        describe("eslintrc Only", () => {

            describe("Environments", () => {

                describe("when given a config with environment set to browser", () => {
                    it("should execute without any errors", async () => {
                        const configPath = getFixturePath("configurations", "env-browser.json");
                        const filePath = getFixturePath("globals-browser.js");
                        const code = `--config ${configPath} ${filePath}`;

                        const exit = await cli.execute(code, null, false);

                        assert.strictEqual(exit, 0);
                    });
                });

                describe("when given a config with environment set to Node.js", () => {
                    it("should execute without any errors", async () => {
                        const configPath = getFixturePath("configurations", "env-node.json");
                        const filePath = getFixturePath("globals-node.js");
                        const code = `--config ${configPath} ${filePath}`;

                        const exit = await cli.execute(code, null, false);

                        assert.strictEqual(exit, 0);
                    });
                });

                describe("when given a config with environment set to Nashorn", () => {
                    it("should execute without any errors", async () => {
                        const configPath = getFixturePath("configurations", "env-nashorn.json");
                        const filePath = getFixturePath("globals-nashorn.js");
                        const code = `--config ${configPath} ${filePath}`;

                        const exit = await cli.execute(code, null, false);

                        assert.strictEqual(exit, 0);
                    });
                });

                describe("when given a config with environment set to WebExtensions", () => {
                    it("should execute without any errors", async () => {
                        const configPath = getFixturePath("configurations", "env-webextensions.json");
                        const filePath = getFixturePath("globals-webextensions.js");
                        const code = `--config ${configPath} ${filePath}`;

                        const exit = await cli.execute(code, null, false);

                        assert.strictEqual(exit, 0);
                    });
                });
            });

            describe("when loading a custom rule", () => {
                it("should return an error when rule isn't found", async () => {
                    const rulesPath = getFixturePath("rules", "wrong");
                    const configPath = getFixturePath("rules", "eslint.json");
                    const filePath = getFixturePath("rules", "test", "test-custom-rule.js");
                    const code = `--rulesdir ${rulesPath} --config ${configPath} --no-ignore ${filePath}`;

                    await stdAssert.rejects(async () => {
                        const exit = await cli.execute(code, null, false);

                        assert.strictEqual(exit, 2);
                    }, /Error while loading rule 'custom-rule': Boom!/u);
                });

                it("should return a warning when rule is matched", async () => {
                    const rulesPath = getFixturePath("rules");
                    const configPath = getFixturePath("rules", "eslint.json");
                    const filePath = getFixturePath("rules", "test", "test-custom-rule.js");
                    const code = `--rulesdir ${rulesPath} --config ${configPath} --no-ignore ${filePath}`;

                    await cli.execute(code, null, false);

                    assert.isTrue(log.info.calledOnce);
                    assert.isTrue(log.info.neverCalledWith(""));
                });

                it("should return warnings from multiple rules in different directories", async () => {
                    const rulesPath = getFixturePath("rules", "dir1");
                    const rulesPath2 = getFixturePath("rules", "dir2");
                    const configPath = getFixturePath("rules", "multi-rulesdirs.json");
                    const filePath = getFixturePath("rules", "test-multi-rulesdirs.js");
                    const code = `--rulesdir ${rulesPath} --rulesdir ${rulesPath2} --config ${configPath} --no-ignore ${filePath}`;
                    const exit = await cli.execute(code, null, false);

                    const call = log.info.getCall(0);

                    assert.isTrue(log.info.calledOnce);
                    assert.isTrue(call.args[0].includes("String!"));
                    assert.isTrue(call.args[0].includes("Literal!"));
                    assert.isTrue(call.args[0].includes("2 problems"));
                    assert.isTrue(log.info.neverCalledWith(""));
                    assert.strictEqual(exit, 1);
                });


            });

            describe("when executing with no-eslintrc flag", () => {
                it("should ignore a local config file", async () => {
                    const filePath = getFixturePath("eslintrc", "quotes.js");
                    const exit = await cli.execute(`--no-eslintrc --no-ignore ${filePath}`, null, false);

                    assert.isTrue(log.info.notCalled);
                    assert.strictEqual(exit, 0);
                });
            });

            describe("when executing without no-eslintrc flag", () => {
                it("should load a local config file", async () => {
                    const filePath = getFixturePath("eslintrc", "quotes.js");
                    const exit = await cli.execute(`--no-ignore ${filePath}`, null, false);

                    assert.isTrue(log.info.calledOnce);
                    assert.strictEqual(exit, 1);
                });
            });

            describe("when executing without env flag", () => {
                it("should not define environment-specific globals", async () => {
                    const files = [
                        getFixturePath("globals-browser.js"),
                        getFixturePath("globals-node.js")
                    ];

                    await cli.execute(`--no-eslintrc --config ./tests/fixtures/config-file/js/.eslintrc.js --no-ignore ${files.join(" ")}`, null, false);

                    assert.strictEqual(log.info.args[0][0].split("\n").length, 10);
                });
            });


            describe("when supplied with a plugin", () => {
                it("should pass plugins to ESLint", async () => {
                    const examplePluginName = "eslint-plugin-example";

                    await verifyESLintOpts(`--no-ignore --plugin ${examplePluginName} foo.js`, {
                        overrideConfig: {
                            plugins: [examplePluginName]
                        }
                    });
                });

            });

            describe("when supplied with a plugin-loading path", () => {
                it("should pass the option to ESLint", async () => {
                    const examplePluginDirPath = "foo/bar";

                    await verifyESLintOpts(`--resolve-plugins-relative-to ${examplePluginDirPath} foo.js`, {
                        resolvePluginsRelativeTo: examplePluginDirPath
                    });
                });
            });


        });


        describe("flat Only", () => {

            describe("`--plugin` option", () => {

                let originalCwd;

                beforeEach(() => {
                    originalCwd = process.cwd();
                    process.chdir(getFixturePath("plugins"));
                });

                afterEach(() => {
                    process.chdir(originalCwd);
                    originalCwd = void 0;
                });

                it("should load a plugin from a CommonJS package", async () => {
                    const code = "--plugin hello-cjs --rule 'hello-cjs/hello: error' ../files/*.js";

                    const exitCode = await cli.execute(code, null, true);

                    assert.strictEqual(exitCode, 1);
                    assert.ok(log.info.calledOnce);
                    assert.include(log.info.firstCall.firstArg, "Hello CommonJS!");
                });

                it("should load a plugin from an ESM package", async () => {
                    const code = "--plugin hello-esm --rule 'hello-esm/hello: error' ../files/*.js";

                    const exitCode = await cli.execute(code, null, true);

                    assert.strictEqual(exitCode, 1);
                    assert.ok(log.info.calledOnce);
                    assert.include(log.info.firstCall.firstArg, "Hello ESM!");
                });

                it("should load multiple plugins", async () => {
                    const code = "--plugin 'hello-cjs, hello-esm' --rule 'hello-cjs/hello: warn, hello-esm/hello: error' ../files/*.js";

                    const exitCode = await cli.execute(code, null, true);

                    assert.strictEqual(exitCode, 1);
                    assert.ok(log.info.calledOnce);
                    assert.include(log.info.firstCall.firstArg, "Hello CommonJS!");
                    assert.include(log.info.firstCall.firstArg, "Hello ESM!");
                });

                it("should resolve plugins specified with 'eslint-plugin-'", async () => {
                    const code = "--plugin 'eslint-plugin-schema-array, @scope/eslint-plugin-example' --rule 'schema-array/rule1: warn, @scope/example/test: warn' ../passing.js";

                    const exitCode = await cli.execute(code, null, true);

                    assert.strictEqual(exitCode, 0);
                });

                it("should resolve plugins in the parent directory's node_module subdirectory", async () => {
                    process.chdir("subdir");
                    const code = "--plugin 'example, @scope/example' file.js";

                    const exitCode = await cli.execute(code, null, true);

                    assert.strictEqual(exitCode, 0);
                });

                it("should fail if a plugin is not found", async () => {
                    const code = "--plugin 'example, no-such-plugin' ../passing.js";

                    await stdAssert.rejects(
                        cli.execute(code, null, true),
                        ({ message }) => {
                            assert(
                                message.startsWith("Cannot find module 'eslint-plugin-no-such-plugin'\n"),
                                `Unexpected error message:\n${message}`
                            );
                            return true;
                        }
                    );
                });

                it("should fail if a plugin throws an error while loading", async () => {
                    const code = "--plugin 'example, throws-on-load' ../passing.js";

                    await stdAssert.rejects(
                        cli.execute(code, null, true),
                        { message: "error thrown while loading this module" }
                    );
                });

                it("should fail to load a plugin from a package without a default export", async () => {
                    const code = "--plugin 'example, no-default-export' ../passing.js";

                    await stdAssert.rejects(
                        cli.execute(code, null, true),
                        { message: '"eslint-plugin-no-default-export" cannot be used with the `--plugin` option because its default module does not provide a `default` export' }
                    );
                });
            });
        });
    });

});
