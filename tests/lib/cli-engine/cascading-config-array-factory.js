/**
 * @fileoverview Tests for CascadingConfigArrayFactory class.
 * @author Toru Nagashima <https://github.com/mysticatea>
 */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { assert } = require("chai");
const sh = require("shelljs");
const sinon = require("sinon");
const { ConfigArrayFactory } = require("../../../lib/cli-engine/config-array-factory");
const { ExtractedConfig } = require("../../../lib/cli-engine/config-array/extracted-config");
const { defineCascadingConfigArrayFactoryWithInMemoryFileSystem } = require("./_utils");

/** @typedef {InstanceType<ReturnType<defineCascadingConfigArrayFactoryWithInMemoryFileSystem>["CascadingConfigArrayFactory"]>} CascadingConfigArrayFactory */
/** @typedef {ReturnType<CascadingConfigArrayFactory["getConfigArrayForFile"]>} ConfigArray */

const cwdIgnorePatterns = new ConfigArrayFactory()
    .loadDefaultESLintIgnore()[0]
    .ignorePattern
    .patterns;

describe("CascadingConfigArrayFactory", () => {
    describe("'getConfigArrayForFile(filePath)' method should retrieve the proper configuration.", () => {
        describe("with three directories ('lib', 'lib/nested', 'test') that contains 'one.js' and 'two.js'", () => {
            const root = path.join(os.tmpdir(), "eslint/cli-engine/cascading-config-array-factory");
            const files = {
                /* eslint-disable quote-props */
                "lib": {
                    "nested": {
                        "one.js": "",
                        "two.js": "",
                        "parser.js": "",
                        ".eslintrc.yml": "parser: './parser'"
                    },
                    "one.js": "",
                    "two.js": ""
                },
                "test": {
                    "one.js": "",
                    "two.js": "",
                    ".eslintrc.yml": "env: { mocha: true }"
                },
                ".eslintignore": "/lib/nested/parser.js",
                ".eslintrc.json": JSON.stringify({
                    rules: {
                        "no-undef": "error",
                        "no-unused-vars": "error"
                    }
                })
                /* eslint-enable quote-props */
            };
            const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({ cwd: () => root, files });

            /** @type {CascadingConfigArrayFactory} */
            let factory;

            beforeEach(() => {
                factory = new CascadingConfigArrayFactory();
            });

            it("should retrieve the config '.eslintrc.json' if 'lib/one.js' was given.", () => {
                const config = factory.getConfigArrayForFile("lib/one.js");

                assert.strictEqual(config.length, 3);
                assert.strictEqual(config[0].name, "DefaultIgnorePattern");
                assert.strictEqual(config[1].filePath, path.join(root, ".eslintrc.json"));
                assert.strictEqual(config[2].filePath, path.join(root, ".eslintignore"));
            });

            it("should retrieve the merged config of '.eslintrc.json' and 'lib/nested/.eslintrc.yml' if 'lib/nested/one.js' was given.", () => {
                const config = factory.getConfigArrayForFile("lib/nested/one.js");

                assert.strictEqual(config.length, 4);
                assert.strictEqual(config[0].name, "DefaultIgnorePattern");
                assert.strictEqual(config[1].filePath, path.join(root, ".eslintrc.json"));
                assert.strictEqual(config[2].filePath, path.join(root, "lib/nested/.eslintrc.yml"));
                assert.strictEqual(config[3].filePath, path.join(root, ".eslintignore"));
            });

            it("should retrieve the config '.eslintrc.json' if 'lib/non-exist.js' was given.", () => {
                const config = factory.getConfigArrayForFile("lib/non-exist.js");

                assert.strictEqual(config.length, 3);
                assert.strictEqual(config[0].name, "DefaultIgnorePattern");
                assert.strictEqual(config[1].filePath, path.join(root, ".eslintrc.json"));
                assert.strictEqual(config[2].filePath, path.join(root, ".eslintignore"));
            });
        });

        describe("deprecation warnings", () => {
            let uid = 0;
            let uniqueHomeDirName = "";
            let homeDir = "";
            let cwd = "";

            /** @type {{code:string, message:string}[]} */
            let warnings = [];

            /** @type {CascadingConfigArrayFactory} */
            let factory = null;

            /** @type {ConfigArray} */
            let config = null;

            /**
             * Store a reported warning object if that code starts with `ESLINT_`.
             * @param {{code:string, message:string}} w The warning object to store.
             * @returns {void}
             */
            function onWarning(w) {
                if (w.code.startsWith("ESLINT_")) {
                    warnings.push({ code: w.code, message: w.message });
                }
            }

            /**
             * Delay to wait for 'warning' events.
             * @returns {Promise<void>} The promise that will be fulfilled after wait a timer.
             */
            function delay() {
                return new Promise(resolve => setTimeout(resolve, 0));
            }

            beforeEach(() => {
                uniqueHomeDirName = `home_${++uid}`;
                homeDir = path.join(__dirname, `../../../${uniqueHomeDirName}`);
                warnings = [];
                sinon.stub(os, "homedir").returns(homeDir);
                process.on("warning", onWarning);
            });
            afterEach(() => {
                os.homedir.restore();
                process.removeListener("warning", onWarning);
            });

            describe("when '~/.eslintrc.json' exists and CWD is `~/`", () => {
                beforeEach(() => {
                    cwd = homeDir;
                    const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                        cwd: () => cwd,
                        files: {

                            // ~/.eslintrc.json
                            ".eslintrc.json": JSON.stringify({ rules: { eqeqeq: "error" } }),

                            // other files
                            "exist-with-root/test.js": "",
                            "exist-with-root/.eslintrc.json": JSON.stringify({ root: true, rules: { yoda: "error" } }),
                            "exist/test.js": "",
                            "exist/.eslintrc.json": JSON.stringify({ rules: { yoda: "error" } }),
                            "not-exist/test.js": ""
                        }
                    });

                    factory = new CascadingConfigArrayFactory({ cwd });
                });

                // no warning.
                describe("when it lints 'subdir/exist-with-root/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist-with-root/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should not load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { yoda: ["error"] }
                        );
                    });
                });

                // no warning.
                describe("when it lints 'subdir/exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { eqeqeq: ["error"], yoda: ["error"] }
                        );
                    });
                });

                // no warning
                describe("when it lints 'subdir/not-exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("not-exist/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { eqeqeq: ["error"] }
                        );
                    });
                });
            });

            describe("when '~/.eslintrc.json' exists and CWD is `~/subdir`", () => {
                beforeEach(() => {
                    cwd = path.join(homeDir, "subdir");
                    const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                        cwd: () => cwd,
                        files: {

                            // ~/.eslintrc.json
                            "../.eslintrc.json": JSON.stringify({ rules: { eqeqeq: "error" } }),

                            // other files
                            "exist-with-root/test.js": "",
                            "exist-with-root/.eslintrc.json": JSON.stringify({ root: true, rules: { yoda: "error" } }),
                            "exist/test.js": "",
                            "exist/.eslintrc.json": JSON.stringify({ rules: { yoda: "error" } }),
                            "not-exist/test.js": ""
                        }
                    });

                    factory = new CascadingConfigArrayFactory({ cwd });
                });

                // Project's config file has `root:true`, then no warning.
                describe("when it lints 'subdir/exist-with-root/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist-with-root/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should not load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { yoda: ["error"] }
                        );
                    });
                });

                // Project's config file doesn't have `root:true` and home is ancestor, then ESLINT_PERSONAL_CONFIG_SUPPRESS.
                describe("when it lints 'subdir/exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist/test.js");
                        await delay();
                    });

                    it("should raise an ESLINT_PERSONAL_CONFIG_SUPPRESS warning.", () => {
                        assert.deepStrictEqual(warnings, [
                            {
                                code: "ESLINT_PERSONAL_CONFIG_SUPPRESS",
                                message: `'~/.eslintrc.*' config files have been deprecated. Please remove it or add 'root:true' to the config files in your projects in order to avoid loading '~/.eslintrc.*' accidentally. (found in "${uniqueHomeDirName}${path.sep}.eslintrc.json")`
                            }
                        ]);
                    });

                    it("should not load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { yoda: ["error"] }
                        );
                    });
                });

                /*
                 * Project's config file doesn't exist and home is ancestor, then no warning.
                 * In this case, ESLint will continue to use `~/.eslintrc.json` even if personal config file feature is removed.
                 */
                describe("when it lints 'subdir/not-exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("not-exist/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { eqeqeq: ["error"] }
                        );
                    });
                });
            });

            describe("when '~/.eslintrc.json' exists and CWD is `~/../another`", () => {
                beforeEach(() => {
                    cwd = path.join(homeDir, "../another");
                    const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                        cwd: () => cwd,
                        files: {

                            // ~/.eslintrc.json
                            [`../${uniqueHomeDirName}/.eslintrc.json`]: JSON.stringify({ rules: { eqeqeq: "error" } }),

                            // other files
                            "exist-with-root/test.js": "",
                            "exist-with-root/.eslintrc.json": JSON.stringify({ root: true, rules: { yoda: "error" } }),
                            "exist/test.js": "",
                            "exist/.eslintrc.json": JSON.stringify({ rules: { yoda: "error" } }),
                            "not-exist/test.js": ""
                        }
                    });

                    factory = new CascadingConfigArrayFactory({ cwd });
                });

                // Project's config file has `root:true`, then no warning.
                describe("when it lints 'exist-with-root/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist-with-root/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should not load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { yoda: ["error"] }
                        );
                    });
                });

                // Project's config file doesn't have `root:true` but home is not ancestor, then no warning.
                describe("when it lints 'exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });

                    it("should not load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { yoda: ["error"] }
                        );
                    });
                });

                // Project's config file doesn't exist and home is not ancestor, then ESLINT_PERSONAL_CONFIG_LOAD.
                describe("when it lints 'not-exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("not-exist/test.js");
                        await delay();
                    });

                    it("should raise an ESLINT_PERSONAL_CONFIG_LOAD warning.", () => {
                        assert.deepStrictEqual(warnings, [
                            {
                                code: "ESLINT_PERSONAL_CONFIG_LOAD",
                                message: `'~/.eslintrc.*' config files have been deprecated. Please use a config file per project or the '--config' option. (found in "${uniqueHomeDirName}${path.sep}.eslintrc.json")`
                            }
                        ]);
                    });

                    it("should load '~/.eslintrc.json'.", () => {
                        assert.deepStrictEqual(
                            config.extractConfig("a.js").rules,
                            { eqeqeq: ["error"] }
                        );
                    });
                });
            });

            describe("when '~/.eslintrc.json' doesn't exist and CWD is `~/subdir`", () => {
                beforeEach(() => {
                    cwd = path.join(homeDir, "subdir");
                    const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                        cwd: () => cwd,
                        files: {
                            "exist-with-root/test.js": "",
                            "exist-with-root/.eslintrc.json": JSON.stringify({ root: true, rules: { yoda: "error" } }),
                            "exist/test.js": "",
                            "exist/.eslintrc.json": JSON.stringify({ rules: { yoda: "error" } }),
                            "not-exist/test.js": ""
                        }
                    });

                    factory = new CascadingConfigArrayFactory({ cwd });
                });

                describe("when it lints 'subdir/exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("exist/test.js");
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });
                });
            });

            describe("when '~/.eslintrc.json' doesn't exist and CWD is `~/../another`", () => {
                beforeEach(() => {
                    cwd = path.join(homeDir, "../another");
                    const { CascadingConfigArrayFactory } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                        cwd: () => cwd,
                        files: {
                            "exist-with-root/test.js": "",
                            "exist-with-root/.eslintrc.json": JSON.stringify({ root: true, rules: { yoda: "error" } }),
                            "exist/test.js": "",
                            "exist/.eslintrc.json": JSON.stringify({ rules: { yoda: "error" } }),
                            "not-exist/test.js": ""
                        }
                    });

                    factory = new CascadingConfigArrayFactory({ cwd });
                });

                describe("when it lints 'not-exist/test.js'", () => {
                    beforeEach(async () => {
                        config = factory.getConfigArrayForFile("not-exist/test.js", { ignoreNotFoundError: true });
                        await delay();
                    });

                    it("should not raise any warnings.", () => {
                        assert.deepStrictEqual(warnings, []);
                    });
                });
            });
        });

        // This group moved from 'tests/lib/config.js' when refactoring to keep the cumulated test cases.
        describe("with 'tests/fixtures/config-hierarchy' files", () => {
            const { CascadingConfigArrayFactory } = require("../../../lib/cli-engine/cascading-config-array-factory");
            let fixtureDir;

            const DIRECTORY_CONFIG_HIERARCHY = require("../../fixtures/config-hierarchy/file-structure.json");

            /**
             * Returns the path inside of the fixture directory.
             * @param {...string} args file path segments.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFixturePath(...args) {
                return path.join(fixtureDir, "config-hierarchy", ...args);
            }

            /**
             * Mocks the current user's home path
             * @param {string} fakeUserHomePath fake user's home path
             * @returns {void}
             * @private
             */
            function mockOsHomedir(fakeUserHomePath) {
                sinon.stub(os, "homedir")
                    .returns(fakeUserHomePath);
            }

            /**
             * Assert that given two objects have the same properties with the
             * same value for each.
             *
             * The `expected` object is merged with the default values of config
             * data before comparing, so you can specify only the properties you
             * focus on.
             * @param {Object} actual The config object to check.
             * @param {Object} expected What the config object should look like.
             * @returns {void}
             * @private
             */
            function assertConfigsEqual(actual, expected) {
                const defaults = new ExtractedConfig().toCompatibleObjectAsConfigFileContent();

                assert.deepStrictEqual(actual, { ...defaults, ...expected });
            }

            /**
             * Wait for the next tick.
             * @returns {Promise<void>} -
             */
            function nextTick() {
                return new Promise(resolve => process.nextTick(resolve));
            }

            /**
             * Get the config data for a file.
             * @param {CascadingConfigArrayFactory} factory The factory to get config.
             * @param {string} filePath The path to a source code.
             * @returns {Object} The gotten config.
             */
            function getConfig(factory, filePath = "a.js") {
                const { cwd } = factory;
                const absolutePath = path.resolve(cwd, filePath);

                return factory
                    .getConfigArrayForFile(absolutePath)
                    .extractConfig(absolutePath)
                    .toCompatibleObjectAsConfigFileContent();
            }

            // copy into clean area so as not to get "infected" by this project's .eslintrc files
            before(() => {
                fixtureDir = `${os.tmpdir()}/eslint/fixtures`;
                sh.mkdir("-p", fixtureDir);
                sh.cp("-r", "./tests/fixtures/config-hierarchy", fixtureDir);
                sh.cp("-r", "./tests/fixtures/rules", fixtureDir);
            });

            afterEach(() => {
                sinon.verifyAndRestore();
            });

            after(() => {
                sh.rm("-r", fixtureDir);
            });

            it("should create config object when using baseConfig with extends", () => {
                const customBaseConfig = {
                    extends: path.resolve(__dirname, "../../fixtures/config-extends/array/.eslintrc")
                };
                const factory = new CascadingConfigArrayFactory({ baseConfig: customBaseConfig, useEslintrc: false });
                const config = getConfig(factory);

                assert.deepStrictEqual(config.env, {
                    browser: false,
                    es6: true,
                    node: true
                });
                assert.deepStrictEqual(config.rules, {
                    "no-empty": [1],
                    "comma-dangle": [2],
                    "no-console": [2]
                });
            });

            it("should return the project config when called in current working directory", () => {
                const factory = new CascadingConfigArrayFactory();
                const actual = getConfig(factory);

                assert.strictEqual(actual.rules.strict[1], "global");
            });

            it("should not retain configs from previous directories when called multiple times", () => {
                const firstpath = path.resolve(__dirname, "../../fixtures/configurations/single-quotes/subdir/.eslintrc");
                const secondpath = path.resolve(__dirname, "../../fixtures/configurations/single-quotes/.eslintrc");
                const factory = new CascadingConfigArrayFactory();
                let config;

                config = getConfig(factory, firstpath);
                assert.deepStrictEqual(config.rules["no-new"], [0]);
                config = getConfig(factory, secondpath);
                assert.deepStrictEqual(config.rules["no-new"], [1]);
            });

            it("should throw error when a configuration file doesn't exist", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/configurations/.eslintrc");
                const factory = new CascadingConfigArrayFactory();

                sinon.stub(fs, "readFileSync").throws(new Error());

                assert.throws(() => {
                    getConfig(factory, configPath);
                }, "Cannot read config file");

            });

            it("should throw error when a configuration file is not require-able", () => {
                const configPath = ".eslintrc";
                const factory = new CascadingConfigArrayFactory();

                sinon.stub(fs, "readFileSync").throws(new Error());

                assert.throws(() => {
                    getConfig(factory, configPath);
                }, "Cannot read config file");

            });

            it("should cache config when the same directory is passed twice", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/configurations/single-quotes/.eslintrc");
                const configArrayFactory = new ConfigArrayFactory();
                const factory = new CascadingConfigArrayFactory({ configArrayFactory });

                sinon.spy(configArrayFactory, "loadInDirectory");

                // If cached this should be called only once
                getConfig(factory, configPath);
                const callcount = configArrayFactory.loadInDirectory.callcount;

                getConfig(factory, configPath);

                assert.strictEqual(configArrayFactory.loadInDirectory.callcount, callcount);
            });

            // make sure JS-style comments don't throw an error
            it("should load the config file when there are JS-style comments in the text", () => {
                const specificConfigPath = path.resolve(__dirname, "../../fixtures/configurations/comments.json");
                const factory = new CascadingConfigArrayFactory({ specificConfigPath, useEslintrc: false });
                const config = getConfig(factory);
                const { semi, strict } = config.rules;

                assert.deepStrictEqual(semi, [1]);
                assert.deepStrictEqual(strict, [0]);
            });

            // make sure YAML files work correctly
            it("should load the config file when a YAML file is used", () => {
                const specificConfigPath = path.resolve(__dirname, "../../fixtures/configurations/env-browser.yaml");
                const factory = new CascadingConfigArrayFactory({ specificConfigPath, useEslintrc: false });
                const config = getConfig(factory);
                const { "no-alert": noAlert, "no-undef": noUndef } = config.rules;

                assert.deepStrictEqual(noAlert, [0]);
                assert.deepStrictEqual(noUndef, [2]);
            });

            it("should contain the correct value for parser when a custom parser is specified", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/configurations/parser/.eslintrc.json");
                const factory = new CascadingConfigArrayFactory();
                const config = getConfig(factory, configPath);

                assert.strictEqual(config.parser, path.resolve(path.dirname(configPath), "./custom.js"));
            });

            /*
             * Configuration hierarchy ---------------------------------------------
             * https://github.com/eslint/eslint/issues/3915
             */
            it("should correctly merge environment settings", () => {
                const factory = new CascadingConfigArrayFactory({ useEslintrc: true });
                const file = getFixturePath("envs", "sub", "foo.js");
                const expected = {
                    rules: {},
                    env: {
                        browser: true,
                        node: false
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Default configuration - blank
            it("should return a blank config when using no .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({ useEslintrc: false });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    rules: {},
                    globals: {},
                    env: {},
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            it("should return a blank config when baseConfig is set to false and no .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({ baseConfig: false, useEslintrc: false });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    rules: {},
                    globals: {},
                    env: {},
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // No default configuration
            it("should return an empty config when not using .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({ useEslintrc: false });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, { ignorePatterns: cwdIgnorePatterns });
            });

            it("should return a modified config when baseConfig is set to an object and no .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        }
                    },
                    useEslintrc: false
                });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            it("should return a modified config without plugin rules enabled when baseConfig is set to an object with plugin and no .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        },
                        plugins: ["example-with-rules-config"]
                    },
                    cwd: getFixturePath("plugins"),
                    useEslintrc: false
                });
                const file = getFixturePath("broken", "plugins", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    plugins: ["example-with-rules-config"],
                    rules: {
                        quotes: [2, "single"]
                    }
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Project configuration - second level .eslintrc
            it("should merge configs when local .eslintrc overrides parent .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory();
                const file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        "no-console": [1],
                        quotes: [2, "single"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Project configuration - third level .eslintrc
            it("should merge configs when local .eslintrc overrides parent and grandparent .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory();
                const file = getFixturePath("broken", "subbroken", "subsubbroken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        "no-console": [0],
                        quotes: [1, "double"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Project configuration - root set in second level .eslintrc
            it("should not return or traverse configurations in parents of config with root:true", () => {
                const factory = new CascadingConfigArrayFactory();
                const file = getFixturePath("root-true", "parent", "root", "wrong-semi.js");
                const expected = {
                    rules: {
                        semi: [2, "never"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Project configuration - root set in second level .eslintrc
            it("should return project config when called with a relative path from a subdir", () => {
                const factory = new CascadingConfigArrayFactory({ cwd: getFixturePath("root-true", "parent", "root", "subdir") });
                const dir = ".";
                const expected = {
                    rules: {
                        semi: [2, "never"]
                    }
                };
                const actual = getConfig(factory, dir);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should merge command line config when config file adds to local .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    specificConfigPath: getFixturePath("broken", "add-conf.yaml")
                });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"],
                        semi: [1, "never"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --config with first level .eslintrc
            it("should merge command line config when config file overrides local .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    specificConfigPath: getFixturePath("broken", "override-conf.yaml")
                });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [0, "double"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should merge command line config when config file adds to local and parent .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    specificConfigPath: getFixturePath("broken", "add-conf.yaml")
                });
                const file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"],
                        "no-console": [1],
                        semi: [1, "never"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --config with second level .eslintrc
            it("should merge command line config when config file overrides local and parent .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    specificConfigPath: getFixturePath("broken", "override-conf.yaml")
                });
                const file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [0, "single"],
                        "no-console": [1]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --rule with --config and first level .eslintrc
            it("should merge command line config and rule when rule and config file overrides local .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    cliConfig: {
                        rules: {
                            quotes: [1, "double"]
                        }
                    },
                    specificConfigPath: getFixturePath("broken", "override-conf.yaml")
                });
                const file = getFixturePath("broken", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [1, "double"]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });

            // Command line configuration - --plugin
            it("should merge command line plugin with local .eslintrc", () => {
                const factory = new CascadingConfigArrayFactory({
                    cliConfig: {
                        plugins: ["another-plugin"]
                    },
                    cwd: getFixturePath("plugins")
                });
                const file = getFixturePath("broken", "plugins", "console-wrong-quotes.js");
                const expected = {
                    env: {
                        node: true
                    },
                    plugins: [
                        "example",
                        "another-plugin"
                    ],
                    rules: {
                        quotes: [2, "double"]
                    }
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });


            it("should merge multiple different config file formats", () => {
                const factory = new CascadingConfigArrayFactory();
                const file = getFixturePath("fileexts/subdir/subsubdir/foo.js");
                const expected = {
                    env: {
                        browser: true
                    },
                    rules: {
                        semi: [2, "always"],
                        eqeqeq: [2]
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, file);

                assertConfigsEqual(actual, expected);
            });


            it("should load user config globals", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/globals/conf.yaml");
                const factory = new CascadingConfigArrayFactory({ specificConfigPath: configPath, useEslintrc: false });
                const expected = {
                    globals: {
                        foo: true
                    },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, configPath);

                assertConfigsEqual(actual, expected);
            });

            it("should not load disabled environments", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/environments/disable.yaml");
                const factory = new CascadingConfigArrayFactory({ specificConfigPath: configPath, useEslintrc: false });
                const config = getConfig(factory, configPath);

                assert.isUndefined(config.globals.window);
            });

            it("should gracefully handle empty files", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/configurations/env-node.json");
                const factory = new CascadingConfigArrayFactory({ specificConfigPath: configPath });

                getConfig(factory, path.resolve(__dirname, "../../fixtures/configurations/empty/empty.json"));
            });

            // Meaningful stack-traces
            it("should include references to where an `extends` configuration was loaded from", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/config-extends/error.json");

                assert.throws(() => {
                    const factory = new CascadingConfigArrayFactory({ useEslintrc: false, specificConfigPath: configPath });

                    getConfig(factory, configPath);
                }, /Referenced from:.*?error\.json/u);
            });

            // Keep order with the last array element taking highest precedence
            it("should make the last element in an array take the highest precedence", () => {
                const configPath = path.resolve(__dirname, "../../fixtures/config-extends/array/.eslintrc");
                const factory = new CascadingConfigArrayFactory({ useEslintrc: false, specificConfigPath: configPath });
                const expected = {
                    rules: { "no-empty": [1], "comma-dangle": [2], "no-console": [2] },
                    env: { browser: false, node: true, es6: true },
                    ignorePatterns: cwdIgnorePatterns
                };
                const actual = getConfig(factory, configPath);

                assertConfigsEqual(actual, expected);
            });

            describe("with env in a child configuration file", () => {
                it("should not overwrite parserOptions of the parent with env of the child", () => {
                    const factory = new CascadingConfigArrayFactory();
                    const targetPath = getFixturePath("overwrite-ecmaFeatures", "child", "foo.js");
                    const expected = {
                        rules: {},
                        env: { commonjs: true },
                        parserOptions: { ecmaFeatures: { globalReturn: false } },
                        ignorePatterns: cwdIgnorePatterns
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });
            });

            describe("personal config file within home directory", () => {
                const {
                    CascadingConfigArrayFactory: StubbedCascadingConfigArrayFactory
                } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                    files: {
                        "eslint/fixtures/config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                    }
                });

                /**
                 * Returns the path inside of the fixture directory.
                 * @param {...string} args file path segments.
                 * @returns {string} The path inside the fixture directory.
                 * @private
                 */
                function getFakeFixturePath(...args) {
                    return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...args);
                }

                it("should load the personal config if no local config was found", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "home-folder");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath });

                    mockOsHomedir(homePath);

                    const actual = getConfig(factory, filePath);
                    const expected = {
                        rules: {
                            "home-folder-rule": [2]
                        }
                    };

                    assertConfigsEqual(actual, expected);
                });

                it("should ignore the personal config if a local config was found", () => {
                    const projectPath = getFakeFixturePath("personal-config", "home-folder", "project");
                    const homePath = getFakeFixturePath("personal-config", "home-folder");
                    const filePath = getFakeFixturePath("personal-config", "home-folder", "project", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath });

                    mockOsHomedir(homePath);

                    const actual = getConfig(factory, filePath);
                    const expected = {
                        rules: {
                            "project-level-rule": [2]
                        }
                    };

                    assertConfigsEqual(actual, expected);
                });

                it("should ignore the personal config if config is passed through cli", () => {
                    const configPath = getFakeFixturePath("quotes-error.json");
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "home-folder");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: projectPath,
                        specificConfigPath: configPath
                    });

                    mockOsHomedir(homePath);

                    const actual = getConfig(factory, filePath);
                    const expected = {
                        rules: {
                            quotes: [2, "double"]
                        }
                    };

                    assertConfigsEqual(actual, expected);
                });

                it("should still load the project config if the current working directory is the same as the home folder", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-with-config");
                    const filePath = getFakeFixturePath("personal-config", "project-with-config", "subfolder", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath });

                    mockOsHomedir(projectPath);

                    const actual = getConfig(factory, filePath);
                    const expected = {
                        rules: {
                            "project-level-rule": [2],
                            "subfolder-level-rule": [2]
                        }
                    };

                    assertConfigsEqual(actual, expected);
                });
            });

            describe("when no local or personal config is found", () => {
                const {
                    CascadingConfigArrayFactory: StubbedCascadingConfigArrayFactory
                } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                    files: {
                        "eslint/fixtures/config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                    }
                });

                /**
                 * Returns the path inside of the fixture directory.
                 * @param {...string} args file path segments.
                 * @returns {string} The path inside the fixture directory.
                 * @private
                 */
                function getFakeFixturePath(...args) {
                    return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...args);
                }

                it("should throw an error if no local config and no personal config was found", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "folder-does-not-exist");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath });

                    mockOsHomedir(homePath);

                    assert.throws(() => {
                        getConfig(factory, filePath);
                    }, "No ESLint configuration found");
                });

                it("should throw an error if no local config was found and ~/package.json contains no eslintConfig section", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "home-folder-with-packagejson");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath });

                    mockOsHomedir(homePath);

                    assert.throws(() => {
                        getConfig(factory, filePath);
                    }, "No ESLint configuration found");
                });

                it("should not throw an error if no local config and no personal config was found but useEslintrc is false", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "folder-does-not-exist");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ cwd: projectPath, useEslintrc: false });

                    mockOsHomedir(homePath);

                    getConfig(factory, filePath);
                });

                it("should not throw an error if no local config and no personal config was found but rules are specified", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "folder-does-not-exist");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cliConfig: {
                            rules: { quotes: [2, "single"] }
                        },
                        cwd: projectPath
                    });

                    mockOsHomedir(homePath);

                    getConfig(factory, filePath);
                });

                it("should not throw an error if no local config and no personal config was found but baseConfig is specified", () => {
                    const projectPath = getFakeFixturePath("personal-config", "project-without-config");
                    const homePath = getFakeFixturePath("personal-config", "folder-does-not-exist");
                    const filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({ baseConfig: {}, cwd: projectPath });

                    mockOsHomedir(homePath);

                    getConfig(factory, filePath);
                });
            });

            describe("with overrides", () => {
                const {
                    CascadingConfigArrayFactory: StubbedCascadingConfigArrayFactory
                } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({
                    files: {
                        "eslint/fixtures/config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                    }
                });

                /**
                 * Returns the path inside of the fixture directory.
                 * @param {...string} pathSegments One or more path segments, in order of depth, shallowest first
                 * @returns {string} The path inside the fixture directory.
                 * @private
                 */
                function getFakeFixturePath(...pathSegments) {
                    return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...pathSegments);
                }

                it("should merge override config when the pattern matches the file name", () => {
                    const factory = new StubbedCascadingConfigArrayFactory({});
                    const targetPath = getFakeFixturePath("overrides", "foo.js");
                    const expected = {
                        rules: {
                            quotes: [2, "single"],
                            "no-else-return": [0],
                            "no-unused-vars": [1],
                            semi: [1, "never"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should merge override config when the pattern matches the file path relative to the config file", () => {
                    const factory = new StubbedCascadingConfigArrayFactory({});
                    const targetPath = getFakeFixturePath("overrides", "child", "child-one.js");
                    const expected = {
                        rules: {
                            curly: ["error", "multi", "consistent"],
                            "no-else-return": [0],
                            "no-unused-vars": [1],
                            quotes: [2, "double"],
                            semi: [1, "never"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should not merge override config when the pattern matches the absolute file path", () => {
                    const resolvedPath = path.resolve(__dirname, "../../fixtures/config-hierarchy/overrides/bar.js");

                    assert.throws(() => new StubbedCascadingConfigArrayFactory({
                        baseConfig: {
                            overrides: [{
                                files: resolvedPath,
                                rules: {
                                    quotes: [1, "double"]
                                }
                            }]
                        },
                        useEslintrc: false
                    }), /Invalid override pattern/u);
                });

                it("should not merge override config when the pattern traverses up the directory tree", () => {
                    const parentPath = "overrides/../**/*.js";

                    assert.throws(() => new StubbedCascadingConfigArrayFactory({
                        baseConfig: {
                            overrides: [{
                                files: parentPath,
                                rules: {
                                    quotes: [1, "single"]
                                }
                            }]
                        },
                        useEslintrc: false
                    }), /Invalid override pattern/u);
                });

                it("should merge all local configs (override and non-override) before non-local configs", () => {
                    const factory = new StubbedCascadingConfigArrayFactory({});
                    const targetPath = getFakeFixturePath("overrides", "two", "child-two.js");
                    const expected = {
                        rules: {
                            "no-console": [0],
                            "no-else-return": [0],
                            "no-unused-vars": [2],
                            quotes: [2, "double"],
                            semi: [2, "never"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should apply overrides in parent .eslintrc over non-override rules in child .eslintrc", () => {
                    const targetPath = getFakeFixturePath("overrides", "three", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [
                                {
                                    files: "three/**/*.js",
                                    rules: {
                                        "semi-style": [2, "last"]
                                    }
                                }
                            ]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {
                            "semi-style": [2, "last"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should apply overrides if all glob patterns match", () => {
                    const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [{
                                files: ["one/**/*", "*.js"],
                                rules: {
                                    quotes: [2, "single"]
                                }
                            }]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {
                            quotes: [2, "single"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should apply overrides even if some glob patterns do not match", () => {
                    const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [{
                                files: ["one/**/*", "*two.js"],
                                rules: {
                                    quotes: [2, "single"]
                                }
                            }]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {
                            quotes: [2, "single"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should not apply overrides if any excluded glob patterns match", () => {
                    const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [{
                                files: "one/**/*",
                                excludedFiles: ["two/**/*", "*one.js"],
                                rules: {
                                    quotes: [2, "single"]
                                }
                            }]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {}
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should apply overrides if all excluded glob patterns fail to match", () => {
                    const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [{
                                files: "one/**/*",
                                excludedFiles: ["two/**/*", "*two.js"],
                                rules: {
                                    quotes: [2, "single"]
                                }
                            }]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {
                            quotes: [2, "single"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });

                it("should cascade", () => {
                    const targetPath = getFakeFixturePath("overrides", "foo.js");
                    const factory = new StubbedCascadingConfigArrayFactory({
                        cwd: getFakeFixturePath("overrides"),
                        baseConfig: {
                            overrides: [
                                {
                                    files: "foo.js",
                                    rules: {
                                        semi: [2, "never"],
                                        quotes: [2, "single"]
                                    }
                                },
                                {
                                    files: "foo.js",
                                    rules: {
                                        semi: [2, "never"],
                                        quotes: [2, "double"]
                                    }
                                }
                            ]
                        },
                        useEslintrc: false
                    });
                    const expected = {
                        rules: {
                            semi: [2, "never"],
                            quotes: [2, "double"]
                        }
                    };
                    const actual = getConfig(factory, targetPath);

                    assertConfigsEqual(actual, expected);
                });
            });

            describe("deprecation warnings", () => {
                const cwd = path.resolve(__dirname, "../../fixtures/config-file/");
                let warning = null;

                /**
                 * Store a reported warning object if that code starts with `ESLINT_`.
                 * @param {{code:string, message:string}} w The warning object to store.
                 * @returns {void}
                 */
                function onWarning(w) {
                    if (w.code.startsWith("ESLINT_")) {
                        warning = w;
                    }
                }

                /** @type {CascadingConfigArrayFactory} */
                let factory;

                beforeEach(() => {
                    factory = new CascadingConfigArrayFactory({ cwd });
                    warning = null;
                    process.on("warning", onWarning);
                });
                afterEach(() => {
                    process.removeListener("warning", onWarning);
                });

                it("should emit a deprecation warning if 'ecmaFeatures' is given.", async () => {
                    getConfig(factory, "ecma-features/test.js");

                    // Wait for "warning" event.
                    await nextTick();

                    assert.notStrictEqual(warning, null);
                    assert.strictEqual(
                        warning.message,
                        `The 'ecmaFeatures' config file property is deprecated and has no effect. (found in "ecma-features${path.sep}.eslintrc.yml")`
                    );
                });
            });
        });
    });

    describe("'clearCache()' method should clear cache.", () => {
        describe("with a '.eslintrc.js' file", () => {
            const root = path.join(os.tmpdir(), "eslint/cli-engine/cascading-config-array-factory");
            const files = {
                ".eslintrc.js": ""
            };
            const {
                CascadingConfigArrayFactory
            } = defineCascadingConfigArrayFactoryWithInMemoryFileSystem({ cwd: () => root, files });

            /** @type {Map<string, Object>} */
            let additionalPluginPool;

            /** @type {CascadingConfigArrayFactory} */
            let factory;

            beforeEach(() => {
                additionalPluginPool = new Map();
                factory = new CascadingConfigArrayFactory({
                    additionalPluginPool,
                    cliConfig: { plugins: ["test"] }
                });
            });

            it("should use cached instance.", () => {
                const one = factory.getConfigArrayForFile("a.js");
                const two = factory.getConfigArrayForFile("a.js");

                assert.strictEqual(one, two);
            });

            it("should not use cached instance if 'clearCache()' method is called after first config is retrieved", () => {
                const one = factory.getConfigArrayForFile("a.js");

                factory.clearCache();
                const two = factory.getConfigArrayForFile("a.js");

                assert.notStrictEqual(one, two);
            });

            it("should have a loading error in CLI config.", () => {
                const config = factory.getConfigArrayForFile("a.js");

                assert.strictEqual(config[2].plugins.test.definition, null);
            });

            it("should not have a loading error in CLI config after adding 'test' plugin to the additional plugin pool then calling 'clearCache()'.", () => {
                factory.getConfigArrayForFile("a.js");

                additionalPluginPool.set("test", { configs: { name: "test" } });
                factory.clearCache();

                // Check.
                const config = factory.getConfigArrayForFile("a.js");

                assert.deepStrictEqual(
                    config[2].plugins.test.definition,
                    {
                        configs: { name: "test" },
                        environments: {},
                        processors: {},
                        rules: {}
                    }
                );
            });
        });
    });
});
