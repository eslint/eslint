/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    Config = require("../../lib/config"),
    Linter = require("../../lib/linter"),
    environments = require("../../conf/environments"),
    sinon = require("sinon"),
    mockFs = require("mock-fs");

const DIRECTORY_CONFIG_HIERARCHY = require("../fixtures/config-hierarchy/file-structure.json");

const linter = new Linter();

require("shelljs/global");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

/* global mkdir, rm, cp */


/**
 * Creates a stubbed Config object that will bypass normal require() to load
 * plugins by name from the objects specified.
 * @param {Object} plugins The keys are the package names, values are plugin objects.
 * @returns {Config} The stubbed instance of Config.
 * @private
 */
function createStubbedConfigWithPlugins(plugins) {

    // stub out plugins
    const StubbedPlugins = proxyquire("../../lib/config/plugins", plugins);

    // stub out config file to use stubbed plugins
    const StubbedConfigFile = proxyquire("../../lib/config/config-file", {
        "./plugins": StubbedPlugins
    });

    // stub out Config to use stub config file
    return proxyquire("../../lib/config", {
        "./config/config-file": StubbedConfigFile,
        "./config/plugins": StubbedPlugins
    });
}

/**
 * Asserts that two configs are equal. This is necessary because assert.deepStrictEqual()
 * gets confused when properties are in different orders.
 * @param {Object} actual The config object to check.
 * @param {Object} expected What the config object should look like.
 * @returns {void}
 * @private
 */
function assertConfigsEqual(actual, expected) {
    if (actual.env && expected.env) {
        assert.deepStrictEqual(actual.env, expected.env);
    }

    if (actual.parserOptions && expected.parserOptions) {
        assert.deepStrictEqual(actual.parserOptions, expected.parserOptions);
    }

    if (actual.globals && expected.globals) {
        assert.deepStrictEqual(actual.globals, expected.globals);
    }

    if (actual.rules && expected.rules) {
        assert.deepStrictEqual(actual.rules, expected.rules);
    }

    if (actual.plugins && expected.plugins) {
        assert.deepStrictEqual(actual.plugins, expected.plugins);
    }
}

/**
 * Wait for the next tick.
 * @returns {Promise<void>} -
 */
function nextTick() {
    return new Promise(resolve => process.nextTick(resolve));
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Config", () => {

    let fixtureDir,
        sandbox;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath(...args) {
        return path.join(fixtureDir, "config-hierarchy", ...args);
    }

    /**
     * Mocks the current CWD path
     * @param {string} fakeCWDPath - fake CWD path
     * @returns {void}
     * @private
     */
    function mockCWDResponse(fakeCWDPath) {
        sandbox.stub(process, "cwd")
            .returns(fakeCWDPath);
    }

    /**
     * Mocks the current user's home path
     * @param {string} fakeUserHomePath - fake user's home path
     * @returns {void}
     * @private
     */
    function mockOsHomedir(fakeUserHomePath) {
        sandbox.stub(os, "homedir")
            .returns(fakeUserHomePath);
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(() => {
        fixtureDir = `${os.tmpdir()}/eslint/fixtures`;
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/config-hierarchy", fixtureDir);
    });

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    after(() => {
        rm("-r", fixtureDir);
    });

    describe("new Config()", () => {

        // https://github.com/eslint/eslint/issues/2380
        it("should not modify baseConfig when format is specified", () => {
            const customBaseConfig = { foo: "bar" },
                configHelper = new Config({ baseConfig: customBaseConfig, format: "foo" }, linter);

            // at one point, customBaseConfig.format would end up equal to "foo"...that's bad
            assert.deepStrictEqual(customBaseConfig, { foo: "bar" });
            assert.strictEqual(configHelper.options.format, "foo");
        });

        it("should create config object when using baseConfig with extends", () => {
            const customBaseConfig = {
                extends: path.resolve(__dirname, "..", "fixtures", "config-extends", "array", ".eslintrc")
            };
            const configHelper = new Config({ baseConfig: customBaseConfig }, linter);

            assert.deepStrictEqual(configHelper.baseConfig.env, {
                browser: false,
                es6: true,
                node: true
            });
            assert.deepStrictEqual(configHelper.baseConfig.rules, {
                "no-empty": 1,
                "comma-dangle": 2,
                "no-console": 2
            });
        });
    });

    describe("findLocalConfigFiles()", () => {

        /**
         * Returns the path inside of the fixture directory.
         * @returns {string} The path inside the fixture directory.
         * @private
         */
        function getFakeFixturePath(...args) {
            return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...args);
        }

        before(() => {
            mockFs({
                eslint: {
                    fixtures: {
                        "config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                    }
                }
            });
        });

        after(() => {
            mockFs.restore();
        });

        it("should return the path when an .eslintrc file is found", () => {
            const configHelper = new Config({}, linter),
                expected = getFakeFixturePath("broken", ".eslintrc"),
                actual = Array.from(
                    configHelper.findLocalConfigFiles(getFakeFixturePath("broken"))
                );

            assert.strictEqual(actual[0], expected);
        });

        it("should return an empty array when an .eslintrc file is not found", () => {
            const configHelper = new Config({}, linter),
                actual = Array.from(
                    configHelper.findLocalConfigFiles(getFakeFixturePath())
                );

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
        });

        it("should return package.json only when no other config files are found", () => {
            const configHelper = new Config({}, linter),
                expected0 = getFakeFixturePath("packagejson", "subdir", "package.json"),
                expected1 = getFakeFixturePath("packagejson", ".eslintrc"),
                actual = Array.from(
                    configHelper.findLocalConfigFiles(getFakeFixturePath("packagejson", "subdir"))
                );

            assert.strictEqual(actual[0], expected0);
            assert.strictEqual(actual[1], expected1);
        });

        it("should return the only one config file even if there are multiple found", () => {
            const configHelper = new Config({}, linter),
                expected = getFakeFixturePath("broken", ".eslintrc"),

                // The first element of the array is the .eslintrc in the same directory.
                actual = Array.from(
                    configHelper.findLocalConfigFiles(getFakeFixturePath("broken"))
                );

            assert.strictEqual(actual.length, 1);
            assert.deepStrictEqual(actual, [expected]);
        });

        it("should return all possible files when multiple are found", () => {
            const configHelper = new Config({}, linter),
                expected = [
                    getFakeFixturePath("fileexts/subdir/subsubdir/", ".eslintrc.json"),
                    getFakeFixturePath("fileexts/subdir/", ".eslintrc.yml"),
                    getFakeFixturePath("fileexts", ".eslintrc.js")
                ],

                actual = Array.from(
                    configHelper.findLocalConfigFiles(getFakeFixturePath("fileexts/subdir/subsubdir"))
                );


            assert.deepStrictEqual(actual.length, expected.length);
        });

        it("should return an empty array when a package.json file is not found", () => {
            const configHelper = new Config({}, linter),
                actual = Array.from(configHelper.findLocalConfigFiles(getFakeFixturePath()));

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
        });
    });

    describe("getConfig()", () => {

        it("should return the project config when called in current working directory", () => {
            const configHelper = new Config({ cwd: process.cwd() }, linter),
                actual = configHelper.getConfig();

            assert.strictEqual(actual.rules.strict[1], "global");
        });

        it("should not retain configs from previous directories when called multiple times", () => {

            const firstpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", "subdir", ".eslintrc");
            const secondpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

            const configHelper = new Config({ cwd: process.cwd() }, linter);
            let config;

            config = configHelper.getConfig(firstpath);
            assert.strictEqual(config.rules["no-new"], 0);
            config = configHelper.getConfig(secondpath);
            assert.strictEqual(config.rules["no-new"], 1);
        });

        it("should throw an error when an invalid path is given", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "foobaz", ".eslintrc");
            const homePath = "does-not-exist";

            mockOsHomedir(homePath);
            const StubbedConfig = proxyquire("../../lib/config", {});

            const configHelper = new StubbedConfig({ cwd: process.cwd() }, linter);

            sandbox.stub(fs, "readdirSync").throws(new Error());

            assert.throws(() => {
                configHelper.getConfig(configPath);
            }, "No ESLint configuration found.");
        });

        it("should throw error when a configuration file doesn't exist", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", ".eslintrc");
            const configHelper = new Config({ cwd: process.cwd() }, linter);

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(() => {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should throw error when a configuration file is not require-able", () => {
            const configPath = ".eslintrc";
            const configHelper = new Config({ cwd: process.cwd() }, linter);

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(() => {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should cache config when the same directory is passed twice", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");
            const configHelper = new Config({ cwd: process.cwd() }, linter);

            sandbox.spy(configHelper, "findLocalConfigFiles");

            // If cached this should be called only once
            configHelper.getConfig(configPath);
            const callcount = configHelper.findLocalConfigFiles.callcount;

            configHelper.getConfig(configPath);

            assert.strictEqual(configHelper.findLocalConfigFiles.callcount, callcount);
        });

        // make sure JS-style comments don't throw an error
        it("should load the config file when there are JS-style comments in the text", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "comments.json"),
                configHelper = new Config({ configFile: configPath }, linter),
                semi = configHelper.specificConfig.rules.semi,
                strict = configHelper.specificConfig.rules.strict;

            assert.strictEqual(semi, 1);
            assert.strictEqual(strict, 0);
        });

        // make sure YAML files work correctly
        it("should load the config file when a YAML file is used", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-browser.yaml"),
                configHelper = new Config({ configFile: configPath }, linter),
                noAlert = configHelper.specificConfig.rules["no-alert"],
                noUndef = configHelper.specificConfig.rules["no-undef"];

            assert.strictEqual(noAlert, 0);
            assert.strictEqual(noUndef, 2);
        });

        it("should contain the correct value for parser when a custom parser is specified", () => {
            const configPath = path.resolve(__dirname, "../fixtures/configurations/parser/.eslintrc.json"),
                configHelper = new Config({ cwd: process.cwd() }, linter),
                config = configHelper.getConfig(configPath);

            assert.strictEqual(config.parser, path.resolve(path.dirname(configPath), "./custom.js"));
        });

        /*
         * Configuration hierarchy ---------------------------------------------
         * https://github.com/eslint/eslint/issues/3915
         */
        it("should correctly merge environment settings", () => {
            const configHelper = new Config({ useEslintrc: true, cwd: process.cwd() }, linter),
                file = getFixturePath("envs", "sub", "foo.js"),
                expected = {
                    rules: {},
                    env: {
                        browser: true,
                        node: false
                    },
                    globals: environments.browser.globals
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Default configuration - blank
        it("should return a blank config when using no .eslintrc", () => {

            const configHelper = new Config({ useEslintrc: false }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    rules: {},
                    globals: {},
                    env: {}
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        it("should return a blank config when baseConfig is set to false and no .eslintrc", () => {
            const configHelper = new Config({ baseConfig: false, useEslintrc: false }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    rules: {},
                    globals: {},
                    env: {}
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // No default configuration
        it("should return an empty config when not using .eslintrc", () => {

            const configHelper = new Config({ useEslintrc: false }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, {});
        });

        it("should return a modified config when baseConfig is set to an object and no .eslintrc", () => {


            const configHelper = new Config({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        }
                    },
                    useEslintrc: false
                }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"]
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        it("should return a modified config without plugin rules enabled when baseConfig is set to an object with plugin and no .eslintrc", () => {
            const customRule = require("../fixtures/rules/custom-rule");
            const examplePluginName = "eslint-plugin-example";
            const requireStubs = {};

            requireStubs[examplePluginName] = {
                rules: { "example-rule": customRule },

                // rulesConfig support removed in 2.0.0, so this should have no effect
                rulesConfig: { "example-rule": 1 }
            };

            const StubbedConfig = proxyquire("../../lib/config", requireStubs);
            const configHelper = new StubbedConfig({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        },
                        plugins: [examplePluginName]
                    },
                    useEslintrc: false
                }, linter),
                file = getFixturePath("broken", "plugins", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"]
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Project configuration - second level .eslintrc
        it("should merge configs when local .eslintrc overrides parent .eslintrc", () => {

            const configHelper = new Config({ cwd: process.cwd() }, linter),
                file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        "no-console": 1,
                        quotes: [2, "single"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Project configuration - third level .eslintrc
        it("should merge configs when local .eslintrc overrides parent and grandparent .eslintrc", () => {

            const configHelper = new Config({ cwd: process.cwd() }, linter),
                file = getFixturePath("broken", "subbroken", "subsubbroken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        "no-console": 0,
                        quotes: [1, "double"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Project configuration - root set in second level .eslintrc
        it("should not return or traverse configurations in parents of config with root:true", () => {
            const configHelper = new Config({ cwd: process.cwd() }, linter),
                file = getFixturePath("root-true", "parent", "root", "wrong-semi.js"),
                expected = {
                    rules: {
                        semi: [2, "never"]
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Project configuration - root set in second level .eslintrc
        it("should return project config when called with a relative path from a subdir", () => {
            const configHelper = new Config({ cwd: getFixturePath("root-true", "parent", "root", "subdir") }, linter),
                dir = ".",
                expected = {
                    rules: {
                        semi: [2, "never"]
                    }
                },
                actual = configHelper.getConfig(dir);

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file adds to local .eslintrc", () => {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "add-conf.yaml"),
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"],
                        semi: [1, "never"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file overrides local .eslintrc", () => {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [0, "double"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file adds to local and parent .eslintrc", () => {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "add-conf.yaml"),
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"],
                        "no-console": 1,
                        semi: [1, "never"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file overrides local and parent .eslintrc", () => {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "subbroken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [0, "single"],
                        "no-console": 1
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --rule with --config and first level .eslintrc
        it("should merge command line config and rule when rule and config file overrides local .eslintrc", () => {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    },
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [1, "double"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --plugin
        it("should merge command line plugin with local .eslintrc", () => {

            // stub out Config to use stub config file
            const StubbedConfig = createStubbedConfigWithPlugins({
                "eslint-plugin-example": {},
                "eslint-plugin-another-plugin": {}
            });

            const configHelper = new StubbedConfig({
                    plugins: ["another-plugin"],
                    cwd: process.cwd()
                }, linter),
                file = getFixturePath("broken", "plugins", "console-wrong-quotes.js"),
                expected = {
                    plugins: [
                        "example",
                        "another-plugin"
                    ]
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });


        it("should merge multiple different config file formats", () => {

            const configHelper = new Config({ cwd: process.cwd() }, linter),
                file = getFixturePath("fileexts/subdir/subsubdir/foo.js"),
                expected = {
                    env: {
                        browser: true
                    },
                    rules: {
                        semi: [2, "always"],
                        eqeqeq: 2
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });


        it("should load user config globals", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "globals", "conf.yaml"),
                configHelper = new Config({ configFile: configPath, useEslintrc: false }, linter);

            const expected = {
                globals: {
                    foo: true
                }
            };

            const actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should not load disabled environments", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "disable.yaml");

            const configHelper = new Config({ configFile: configPath, useEslintrc: false }, linter);

            const config = configHelper.getConfig(configPath);

            assert.isUndefined(config.globals.window);
        });

        it("should error on fake environments", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "fake.yaml");

            assert.throw(() => {
                new Config({ configFile: configPath, useEslintrc: false, cwd: process.cwd() }, linter); // eslint-disable-line no-new
            });
        });

        it("should gracefully handle empty files", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-node.json"),
                configHelper = new Config({ configFile: configPath, cwd: process.cwd() }, linter);

            configHelper.getConfig(path.resolve(__dirname, "..", "fixtures", "configurations", "empty", "empty.json"));
        });

        // Meaningful stack-traces
        it("should include references to where an `extends` configuration was loaded from", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "error.json");

            assert.throws(() => {
                const configHelper = new Config({ useEslintrc: false, configFile: configPath }, linter);

                configHelper.getConfig(configPath);
            }, /Referenced from:.*?error\.json/u);
        });

        // Keep order with the last array element taking highest precedence
        it("should make the last element in an array take the highest precedence", () => {
            const configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "array", ".eslintrc"),
                configHelper = new Config({ useEslintrc: false, configFile: configPath }, linter),
                expected = {
                    rules: { "no-empty": 1, "comma-dangle": 2, "no-console": 2 },
                    env: { browser: false, node: true, es6: true }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        describe("with env in a child configuration file", () => {
            it("should not overwrite parserOptions of the parent with env of the child", () => {
                const config = new Config({ cwd: process.cwd() }, linter);
                const targetPath = getFixturePath("overwrite-ecmaFeatures", "child", "foo.js");
                const expected = {
                    rules: {},
                    env: { commonjs: true },
                    parserOptions: { ecmaFeatures: { globalReturn: false } }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });
        });

        describe("personal config file within home directory", () => {

            /**
             * Returns the path inside of the fixture directory.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFakeFixturePath(...args) {
                return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...args);
            }

            /**
             * Mocks the file system for personal-config files
             * @returns {undefined}
             * @private
             */
            function mockPersonalConfigFileSystem() {
                mockFs({
                    eslint: {
                        fixtures: {
                            "config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                        }
                    }
                });
            }

            afterEach(() => {
                mockFs.restore();
            });

            it("should load the personal config if no local config was found", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }, linter),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "home-folder-rule": 2
                        }
                    };

                assert.deepStrictEqual(actual, expected);

                // Ensure that the personal config is cached and isn't reloaded on every call
                assert.strictEqual(config.getPersonalConfig(), config.getPersonalConfig());
            });

            it("should ignore the personal config if a local config was found", () => {
                const projectPath = getFakeFixturePath("personal-config", "home-folder", "project"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "home-folder", "project", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }, linter),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "project-level-rule": 2
                        }
                    };

                assert.deepStrictEqual(actual, expected);
            });

            it("should ignore the personal config if config is passed through cli", () => {
                const configPath = getFakeFixturePath("quotes-error.json");
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ configFile: configPath, cwd: process.cwd() }, linter),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            quotes: [2, "double"]
                        }
                    };

                assert.deepStrictEqual(actual, expected);
            });

            it("should still load the project config if the current working directory is the same as the home folder", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-with-config"),
                    filePath = getFakeFixturePath("personal-config", "project-with-config", "subfolder", "foo.js");

                mockOsHomedir(projectPath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }, linter),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "project-level-rule": 2,
                            "subfolder-level-rule": 2
                        }
                    };

                assert.deepStrictEqual(actual, expected);
            });
        });

        describe("when no local or personal config is found", () => {

            /**
             * Returns the path inside of the fixture directory.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFakeFixturePath(...args) {
                return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...args);
            }

            /**
             * Mocks the file system for personal-config files
             * @returns {undefined}
             * @private
             */
            function mockPersonalConfigFileSystem() {
                mockFs({
                    eslint: {
                        fixtures: {
                            "config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                        }
                    }
                });
            }

            afterEach(() => {
                mockFs.restore();
            });

            it("should throw an error if no local config and no personal config was found", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }, linter);

                assert.throws(() => {
                    config.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should throw an error if no local config was found and ~/package.json contains no eslintConfig section", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder-with-packagejson"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const configHelper = new StubbedConfig({ cwd: process.cwd() }, linter);

                assert.throws(() => {
                    configHelper.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should not throw an error if no local config and no personal config was found but useEslintrc is false", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    useEslintrc: false
                }, linter);

                config.getConfig(filePath);
            });

            it("should not throw an error if no local config and no personal config was found but rules are specified", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    rules: { quotes: [2, "single"] }
                }, linter);

                config.getConfig(filePath);
            });

            it("should not throw an error if no local config and no personal config was found but baseConfig is specified", () => {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                mockOsHomedir(homePath);
                const StubbedConfig = proxyquire("../../lib/config", {});

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    baseConfig: {}
                }, linter);

                config.getConfig(filePath);
            });
        });

        describe("with overrides", () => {

            /**
             * Returns the path inside of the fixture directory.
             * @param {...string} pathSegments One or more path segments, in order of depth, shallowest first
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFakeFixturePath(...pathSegments) {
                return path.join(process.cwd(), "eslint", "fixtures", "config-hierarchy", ...pathSegments);
            }

            before(() => {
                mockFs({
                    eslint: {
                        fixtures: {
                            "config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                        }
                    }
                });
            });

            after(() => {
                mockFs.restore();
            });

            it("should merge override config when the pattern matches the file name", () => {
                const config = new Config({ cwd: process.cwd() }, linter);
                const targetPath = getFakeFixturePath("overrides", "foo.js");
                const expected = {
                    rules: {
                        quotes: [2, "single"],
                        "no-else-return": 0,
                        "no-unused-vars": 1,
                        semi: [1, "never"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should merge override config when the pattern matches the file path relative to the config file", () => {
                const config = new Config({ cwd: process.cwd() }, linter);
                const targetPath = getFakeFixturePath("overrides", "child", "child-one.js");
                const expected = {
                    rules: {
                        curly: ["error", "multi", "consistent"],
                        "no-else-return": 0,
                        "no-unused-vars": 1,
                        quotes: [2, "double"],
                        semi: [1, "never"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should not merge override config when the pattern matches the absolute file path", () => {
                const targetPath = getFakeFixturePath("overrides", "bar.js");
                const resolvedPath = path.resolve(__dirname, "..", "fixtures", "config-hierarchy", "overrides", "bar.js");
                const config = new Config({
                    cwd: process.cwd(),
                    baseConfig: {
                        overrides: [{
                            files: resolvedPath,
                            rules: {
                                quotes: [1, "double"]
                            }
                        }],
                        useEslintrc: false
                    }
                }, linter);

                assert.throws(() => config.getConfig(targetPath), /Invalid override pattern/u);
            });

            it("should not merge override config when the pattern traverses up the directory tree", () => {
                const targetPath = getFakeFixturePath("overrides", "bar.js");
                const parentPath = "overrides/../**/*.js";

                const config = new Config({
                    cwd: process.cwd(),
                    baseConfig: {
                        overrides: [{
                            files: parentPath,
                            rules: {
                                quotes: [1, "single"]
                            }
                        }],
                        useEslintrc: false
                    }
                }, linter);

                assert.throws(() => config.getConfig(targetPath), /Invalid override pattern/u);
            });

            it("should merge all local configs (override and non-override) before non-local configs", () => {
                const config = new Config({ cwd: process.cwd() }, linter);
                const targetPath = getFakeFixturePath("overrides", "two", "child-two.js");
                const expected = {
                    rules: {
                        "no-console": 0,
                        "no-else-return": 0,
                        "no-unused-vars": 2,
                        quotes: [2, "double"],
                        semi: [2, "never"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should apply overrides in parent .eslintrc over non-override rules in child .eslintrc", () => {
                const targetPath = getFakeFixturePath("overrides", "three", "foo.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {
                        "semi-style": [2, "last"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should apply overrides if all glob patterns match", () => {
                const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {
                        quotes: [2, "single"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should apply overrides even if some glob patterns do not match", () => {
                const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {
                        quotes: [2, "single"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should not apply overrides if any excluded glob patterns match", () => {
                const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {}
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should apply overrides if all excluded glob patterns fail to match", () => {
                const targetPath = getFakeFixturePath("overrides", "one", "child-one.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {
                        quotes: [2, "single"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });

            it("should cascade", () => {
                const targetPath = getFakeFixturePath("overrides", "foo.js");
                const config = new Config({
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
                }, linter);
                const expected = {
                    rules: {
                        semi: [2, "never"],
                        quotes: [2, "double"]
                    }
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });
        });

        describe("deprecation warnings", () => {
            let warning = null;

            function onWarning(w) { // eslint-disable-line require-jsdoc

                // Node.js 6.x does not have 'w.code' property.
                if (!Object.prototype.hasOwnProperty.call(w, "code") || typeof w.code === "string" && w.code.startsWith("ESLINT_")) {
                    warning = w;
                }
            }

            beforeEach(() => {
                warning = null;
                process.on("warning", onWarning);
            });
            afterEach(() => {
                process.removeListener("warning", onWarning);
            });

            it("should emit a deprecation warning if 'ecmaFeatures' is given.", () => Promise.resolve()
                .then(() => {
                    const cwd = path.resolve(__dirname, "../fixtures/config-file/ecma-features/");
                    const config = new Config({ cwd }, linter);

                    config.getConfig("test.js");

                    // Wait for "warning" event.
                    return nextTick();
                })
                .then(() => {
                    assert.notStrictEqual(warning, null);
                    assert.strictEqual(
                        warning.message,
                        `The 'ecmaFeatures' config file property is deprecated, and has no effect. (found in "tests${path.sep}fixtures${path.sep}config-file${path.sep}ecma-features${path.sep}.eslintrc.yml")`
                    );
                }));

            it("should emit a deprecation warning if 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' is given.", () => Promise.resolve()
                .then(() => {
                    const cwd = path.resolve(__dirname, "../fixtures/config-file/experimental-object-rest-spread/basic/");
                    const config = new Config({ cwd }, linter);

                    config.getConfig("test.js");

                    // Wait for "warning" event.
                    return nextTick();
                })
                .then(() => {
                    assert.notStrictEqual(warning, null);
                    assert.strictEqual(
                        warning.message,
                        `The 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' option is deprecated. Use 'parserOptions.ecmaVersion' instead. (found in "tests${path.sep}fixtures${path.sep}config-file${path.sep}experimental-object-rest-spread${path.sep}basic${path.sep}.eslintrc.yml")`
                    );
                }));

            it("should emit a deprecation warning if 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' is given in a parent config.", () => Promise.resolve()
                .then(() => {
                    const cwd = path.resolve(__dirname, "../fixtures/config-file/experimental-object-rest-spread/subdir/");
                    const config = new Config({ cwd }, linter);

                    config.getConfig("lib/test.js");

                    // Wait for "warning" event.
                    return nextTick();
                })
                .then(() => {
                    assert.notStrictEqual(warning, null);
                    assert.strictEqual(
                        warning.message,
                        `The 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' option is deprecated. Use 'parserOptions.ecmaVersion' instead. (found in "tests${path.sep}fixtures${path.sep}config-file${path.sep}experimental-object-rest-spread${path.sep}subdir${path.sep}.eslintrc.yml")`
                    );
                }));

            it("should emit a deprecation warning if 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' is given in a shareable config.", () => Promise.resolve()
                .then(() => {
                    const cwd = path.resolve(__dirname, "../fixtures/config-file/experimental-object-rest-spread/extends/");
                    const config = new Config({ cwd }, linter);

                    config.getConfig("test.js");

                    // Wait for "warning" event.
                    return nextTick();
                })
                .then(() => {
                    assert.notStrictEqual(warning, null);
                    assert.strictEqual(
                        warning.message,
                        `The 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' option is deprecated. Use 'parserOptions.ecmaVersion' instead. (found in "tests${path.sep}fixtures${path.sep}config-file${path.sep}experimental-object-rest-spread${path.sep}extends${path.sep}common.yml")`
                    );
                }));

            it("should NOT emit a deprecation warning even if 'parserOptions.ecmaFeatures.experimentalObjectRestSpread' is given, if parser is not espree.", () => Promise.resolve()
                .then(() => {
                    const cwd = path.resolve(__dirname, "../fixtures/config-file/experimental-object-rest-spread/another-parser/");
                    const config = new Config({ cwd }, linter);

                    config.getConfig("test.js");

                    // Wait for "warning" event.
                    return nextTick();
                })
                .then(() => {
                    assert.strictEqual(warning, null);
                }));
        });
    });

    describe("Plugin Environments", () => {
        it("should load environments from plugin", () => {

            const StubbedConfig = createStubbedConfigWithPlugins({
                "eslint-plugin-test": {
                    environments: { example: { globals: { test: false } } }
                }
            });

            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "plugin.yaml"),
                configHelper = new StubbedConfig({
                    reset: true, configFile: configPath, useEslintrc: false
                }, linter),
                expected = {
                    env: {
                        "test/example": true
                    },
                    plugins: ["test"]
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });
    });
});
