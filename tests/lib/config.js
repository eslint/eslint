/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util"),
    path = require("path"),
    baseConfig = require("../../conf/eslint.json"),
    environments = require("../../conf/environments.json"),
    yaml = require("js-yaml"),

    fs = require("fs"),
    Config = require("../../lib/config"),
    sinon = require("sinon"),
    proxyquire = require("proxyquire");

require("shelljs/global");
proxyquire = proxyquire.noCallThru().noPreserveCache();

/*global tempdir, mkdir, rm, cp*/


/**
 * Asserts that two configs are equal. This is necessary because assert.deepEqual()
 * gets confused when properties are in different orders.
 * @param {Object} actual The config object to check.
 * @param {Object} expected What the config object should look like.
 * @returns {void}
 * @private
 */
function assertConfigsEqual(actual, expected) {
    if (actual.env && expected.env) {
        assert.deepEqual(actual.env, expected.env);
    }

    if (actual.globals && expected.globals) {
        assert.deepEqual(actual.globals, expected.globals);
    }

    if (actual.rules && expected.rules) {
        assert.deepEqual(actual.rules, expected.rules);
    }
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Config", function() {

    var fixtureDir,
        sandbox;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift("config-hierarchy");
        args.unshift(fixtureDir);
        return path.join.apply(path, args);
    }

    // copy into clean area so as not to get "infected" by this project's .eslintrc files
    before(function() {
        fixtureDir = tempdir() + "/eslint/fixtures";
        mkdir("-p", fixtureDir);
        cp("-r", "./tests/fixtures/config-hierarchy", fixtureDir);
    });

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.verifyAndRestore();
    });

    after(function() {
        rm("-r", fixtureDir);
    });

    describe("findLocalConfigFile()", function() {

        it("should return the path when an .eslintrc file is found", function() {
            var configHelper = new Config(),
                expected = getFixturePath("broken", ".eslintrc"),
                actual = configHelper.findLocalConfigFile(getFixturePath("broken"));

            assert.equal(actual, expected);
        });

        it("should return an empty string when an .eslintrc file is not found", function() {
            var configHelper = new Config(),
                expected = "",
                actual = configHelper.findLocalConfigFile(getFixturePath());

            assert.equal(actual, expected);
        });

    });

    describe("getConfig()", function() {

        it("should return the project config when called in current working directory", function() {
            var configHelper = new Config({ reset: true }),
                expected = yaml.safeLoad(fs.readFileSync("./.eslintrc", "utf8")),
                actual = configHelper.getConfig();

            assertConfigsEqual(expected, actual);

        });

        it("should not retain configs from previous directories when called multiple times", function() {

            var firstpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", "subdir", ".eslintrc");
            var secondpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

            var configHelper = new Config(),
                config;

            config = configHelper.getConfig(firstpath);
            assert.equal(config.rules["dot-notation"], 0);

            config = configHelper.getConfig(secondpath);
            assert.equal(config.rules["dot-notation"], 2);
        });

        it("should throw error when an invalid path is given", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "foobaz", ".eslintrc");
            var configHelper = new Config();

            assert.throws(function () {
                configHelper.getConfig(configPath);
            });
        });

        it("should throw error when an invalid configuration file is read", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", ".eslintrc");
            var configHelper = new Config();

            sandbox.stub(fs, "readFileSync", function() {
                throw new Error();
            });

            assert.throws(function () {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should cache config when the same directory is passed twice", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");
            var configHelper = new Config();

            sandbox.spy(configHelper, "findLocalConfigFile");

            // If cached this should be called only once
            configHelper.getConfig(configPath);
            var callcount = configHelper.findLocalConfigFile.callcount;
            configHelper.getConfig(configPath);

            assert.equal(configHelper.findLocalConfigFile.callcount, callcount);
        });

        // make sure JS-style comments don't throw an error
        it("should load the config file when there are JS-style comments in the text", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "comments.json"),
                configHelper = new Config({configFile: configPath}),
                semi = configHelper.useSpecificConfig.rules.semi,
                strict = configHelper.useSpecificConfig.rules.strict;

            assert.equal(semi, 1);
            assert.equal(strict, 0);
        });

        // make sure YAML files work correctly
        it("should load the config file when a YAML file is used", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-browser.yaml"),
                configHelper = new Config({configFile: configPath}),
                noAlert = configHelper.useSpecificConfig.rules["no-alert"],
                noUndef = configHelper.useSpecificConfig.rules["no-undef"];

            assert.equal(noAlert, 0);
            assert.equal(noUndef, 2);
        });

        // Configuration hierarchy ---------------------------------------------

        // Default configuration - blank
        it("should return a blank config when using reset and no .eslintrc", function() {

            var configHelper = new Config({ reset: true, useEslintrc: false }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    rules: {},
                    globals: {},
                    env: {}
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(expected, actual);
        });

        // Default configuration - conf/eslint.json
        it("should return the default config when not using .eslintrc", function () {

            var configHelper = new Config({ useEslintrc: false }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = baseConfig,
                actual = configHelper.getConfig(file);

            assertConfigsEqual(expected, actual);

        });

        // Project configuration - conf/eslint.json + first level .eslintrc
        it("should merge environment rules into config when using .eslintrc and the built-in defaults", function () {

            var configHelper = new Config(),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = baseConfig,
                actual = configHelper.getConfig(file);

            expected = util.mergeConfigs(expected, { rules: environments.node.rules });
            expected.env.node = true;

            assertConfigsEqual(expected, actual);
        });

        // Project configuration - first level .eslintrc
        it("should not merge environment rules into config when using .eslintrc and reset", function () {

            var configHelper = new Config({ reset: true }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"]
                    }
                },
                actual = configHelper.getConfig(file);

            expected.env.node = true;

            assertConfigsEqual(expected, actual);
        });

        // Project configuration - second level .eslintrc
        it("should merge configs when local .eslintrc overrides parent .eslintrc", function () {

            var configHelper = new Config({ reset: true }),
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

            assertConfigsEqual(expected, actual);
        });

        // Project configuration - third level .eslintrc
        it("should merge configs when local .eslintrc overrides parent and grandparent .eslintrc", function () {

            var configHelper = new Config({ reset: true }),
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

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file adds to local .eslintrc", function () {

            var configHelper = new Config({
                    reset: true ,
                    configFile: getFixturePath("broken", "add-conf.yaml")
                }),
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

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file overrides local .eslintrc", function () {

            var configHelper = new Config({
                    reset: true ,
                    configFile: getFixturePath("broken", "override-conf.yaml")
                }),
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

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file adds to local and parent .eslintrc", function () {

            var configHelper = new Config({
                reset: true ,
                configFile: getFixturePath("broken", "add-conf.yaml")
            }),
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

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file overrides local and parent .eslintrc", function () {

            var configHelper = new Config({
                reset: true ,
                configFile: getFixturePath("broken", "override-conf.yaml")
            }),
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

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --rule with --config and first level .eslintrc
        it("should merge command line config and rule when rule and config file overrides local .eslintrc", function () {

            var configHelper = new Config({
                reset: true ,
                configFile: getFixturePath("broken", "override-conf.yaml"),
                rules: {
                    quotes: [1, "double"]
                }
            }),
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

            assertConfigsEqual(expected, actual);
        });

        it("should load user config globals", function() {
            var expected,
                actual,
                configPath = path.resolve(__dirname, "..", "fixtures", "globals", "conf.yaml"),
                configHelper = new Config({ reset: true, configFile: configPath, useEslintrc: false });

            expected = {
                globals: {
                    foo: true
                }
            };

            actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should not load disabled environments", function() {
            var config, configPath, configHelper;

            configPath = path.resolve(__dirname, "..", "fixtures", "environments", "disable.yaml");

            configHelper = new Config({ reset: true, configFile: configPath, useEslintrc: false });

            config = configHelper.getConfig(configPath);

            assert.isUndefined(config.globals.window);
        });

        it("should gracefully handle empty files", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-node.json"),
                configHelper = new Config({configFile: configPath});
            configHelper.getConfig(path.resolve(__dirname, "..", "fixtures", "configurations", "empty", "empty.json"));
        });

        describe("with plugin configuration", function() {
            var examplePluginName = "eslint-plugin-example",
                testPluginName = "eslint-plugin-test",
                requireStubs = {},
                examplePlugin = { rules: { "example-rule": require("../fixtures/rules/custom-rule") }, rulesConfig: { "example-rule": 1 } },
                testPlugin = { rules: {"test-rule": require("../fixtures/rules/custom-rule") }, rulesConfig: { "test-rule": 1, "quotes": 0} },
                StubbedConfig;

            it("should return config with plugin config", function() {
                requireStubs[examplePluginName] = examplePlugin;

                StubbedConfig = proxyquire("../../lib/config", requireStubs);

                var configHelper = new StubbedConfig({
                    reset: true
                }),
                file = getFixturePath("broken", "plugins", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"],
                        "example/example-rule": 1
                    },
                    plugins: ["example"]
                },
                actual = configHelper.getConfig(file);
                assertConfigsEqual(actual, expected);
            });

            it("should only return plugin config for rules with correct prefix", function() {
                examplePlugin = { rules: { "example-rule": require("../fixtures/rules/custom-rule") }, rulesConfig: { "example-rule": 1, "quotes": 2 } };

                requireStubs[examplePluginName] = examplePlugin;

                StubbedConfig = proxyquire("../../lib/config", requireStubs);

                var configHelper = new StubbedConfig({
                    reset: true
                }),
                file = getFixturePath("broken", "plugins", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"],
                        "example/example-rule": 1,
                        "example/quotes": 2
                    },
                    plugins: ["example"]
                },
                actual = configHelper.getConfig(file);
                assertConfigsEqual(actual, expected);
            });

            it("should return merged configs for both plugins", function() {
                requireStubs[examplePluginName] = examplePlugin;
                requireStubs[testPluginName] = testPlugin;

                StubbedConfig = proxyquire("../../lib/config", requireStubs);

                var configHelper = new StubbedConfig({
                    reset: true
                }),
                file = getFixturePath("broken", "plugins2", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "double"],
                        "example/example-rule": 1,
                        "example/quotes": 2,
                        "test/test-rule": 1,
                        "test/quotes": 0
                    },
                    plugins: ["example", "eslint-plugin-test"]
                },
                actual = configHelper.getConfig(file);
                assertConfigsEqual(actual, expected);
            });
        });
    });
});
