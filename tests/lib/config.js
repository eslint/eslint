/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util"),
    path = require("path"),
    baseConfig = require("../../conf/eslint.json"),
    environments = require("../../conf/environments"),
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

    describe("new Config()", function() {

        // https://github.com/eslint/eslint/issues/2380
        it("should not modify baseConfig when format is specified", function() {
            var customBaseConfig = { foo: "bar" },
                configHelper = new Config({ baseConfig: customBaseConfig, format: "foo" });

            // at one point, customBaseConfig.format would end up equal to "foo"...that's bad
            assert.deepEqual(customBaseConfig, { foo: "bar" });
            assert.equal(configHelper.options.format, "foo");
        });
    });

    describe("findLocalConfigFiles()", function() {

        it("should return the path when an .eslintrc file is found", function() {
            var configHelper = new Config(),
                expected = getFixturePath("broken", ".eslintrc"),
                actual = configHelper.findLocalConfigFiles(getFixturePath("broken"))[0];

            assert.equal(actual, expected);
        });

        it("should return an empty array when an .eslintrc file is not found", function() {
            var configHelper = new Config(),
                actual = configHelper.findLocalConfigFiles(getFixturePath());

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
        });

        it("should return the path when a package.json file is found", function () {
            var configHelper = new Config(),
                expected = getFixturePath("broken", "package.json"),

                // The first element of the array is the .eslintrc in the same directory.
                actual = configHelper.findLocalConfigFiles(getFixturePath("broken"))[1];

            assert.equal(actual, expected);
        });

        it("should return an empty array when a package.json file is not found", function() {
            var configHelper = new Config(),
                actual = configHelper.findLocalConfigFiles(getFixturePath());

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
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
            assert.equal(config.rules["no-new"], 0);

            config = configHelper.getConfig(secondpath);
            assert.equal(config.rules["no-new"], 1);
        });

        it("should return a default config when an invalid path is given", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "foobaz", ".eslintrc");
            var configHelper = new Config();

            sandbox.stub(fs, "readdirSync").throws(new Error());

            assert.isObject(configHelper.getConfig(configPath));
        });

        it("should throw error when an invalid configuration file is read", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", ".eslintrc");
            var configHelper = new Config();

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(function () {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should cache config when the same directory is passed twice", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");
            var configHelper = new Config();

            sandbox.spy(configHelper, "findLocalConfigFiles");

            // If cached this should be called only once
            configHelper.getConfig(configPath);
            var callcount = configHelper.findLocalConfigFiles.callcount;
            configHelper.getConfig(configPath);

            assert.equal(configHelper.findLocalConfigFiles.callcount, callcount);
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

        it("should return a blank config when baseConfig is set to false and no .eslintrc", function() {
            var configHelper = new Config({ baseConfig: false, useEslintrc: false }),
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

        it("should return a modified config when baseConfig is set to an object and no .eslintrc", function() {
            var configHelper = new Config({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        }
                    },
                    useEslintrc: false
                }),
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

            assertConfigsEqual(expected, actual);
        });

        // Project configuration - conf/eslint.json + first level .eslintrc
        it("should merge environment rules and ecmaFeatures into config when using .eslintrc and the built-in defaults", function () {

            var configHelper = new Config(),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = baseConfig,
                actual = configHelper.getConfig(file);

            expected = util.mergeConfigs(expected, { rules: environments.node.rules, ecmaFeatures: environments.node.ecmaFeatures });
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
                    reset: true,
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
                    reset: true,
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
                reset: true,
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
                reset: true,
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

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file adds environment to local .eslintrc", function () {

            var configHelper = new Config({
                    configFile: getFixturePath("broken", "override-env-conf.yaml")
                }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = util.mergeConfigs(baseConfig, environments.node),
                actual = configHelper.getConfig(file);

            expected.env.node = true;
            expected.rules["no-mixed-requires"] = [0, false];

            assertConfigsEqual(expected, actual);
        });

        // Command line configuration - --rule with --config and first level .eslintrc
        it("should merge command line config and rule when rule and config file overrides local .eslintrc", function () {

            var configHelper = new Config({
                reset: true,
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

        // Extending configurations --------------------------------------------

        // Non-recursive extends
        it("should extend defined configuration file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", ".eslintrc"),
                configHelper = new Config({ reset: true, useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "yoda": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(expected, actual);
        });

        // package extends
        it("should extend package configuration", function() {

            var StubbedConfig = proxyquire("../../lib/config", {
                "eslint-config-foo": {
                    rules: {
                        foo: "bar"
                    }
                }
            });

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package/.eslintrc"),
                configHelper = new StubbedConfig({ reset: true, useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "foo": "bar", "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(expected, actual);
        });

        it("should extend package configuration without prefix", function() {

            var StubbedConfig = proxyquire("../../lib/config", {
                "eslint-config-foo": {
                    rules: {
                        foo: "bar"
                    }
                }
            });

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package2/.eslintrc"),
                configHelper = new StubbedConfig({ reset: true, useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "foo": "bar", "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(expected, actual);
        });

        it("should extend package configuration with sub directories", function() {

            var StubbedConfig = proxyquire("../../lib/config", {
                "eslint-config-foo": {
                    rules: {
                        foo: "bar"
                    }
                }
            });

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package2/.eslintrc"),
                configHelper = new StubbedConfig({ reset: true, useEslintrc: true, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "foo": "bar", "valid-jsdoc": 0 },
                    env: { "browser": false }
                };

            // Reason to override this function in this special case is that I dont want it to keep looking into the
            // chain of parent directries for .eslintrc or package.json file for configs.
            // If that is allowed then the expected outcome will change based on the machine you are running this test.
            sinon.stub(configHelper, "findLocalConfigFiles").returns([
                path.resolve(__dirname, "../fixtures/config-extends/package2/.eslintrc")
            ]);

            configHelper.getConfig(configPath);
            // Now we are running the same command for a subdirectory using the same config object.
            var actual = configHelper.getConfig(path.resolve(__dirname, "../fixtures/config-extends/package2/subdir/foo.js"));

            assertConfigsEqual(expected, actual);
        });

        // Non-recursive extends
        it("should extend recursively defined configuration files", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "deep.json"),
                configHelper = new Config({ reset: true, useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "semi": 2, "yoda": 2, "valid-jsdoc": 0 },
                    env: { "browser": true }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(expected, actual);
        });

        // Meaningful stack-traces
        it("should include references to where an `extends` configuration was loaded from", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "error.json");

            assert.throws(function () {
                var configHelper = new Config({ useEslintrc: false, configFile: configPath });
                configHelper.getConfig(configPath);
            }, /Referenced from:.*?error\.json/);
        });

        describe("with plugin configuration", function() {
            var customRule = require("../fixtures/rules/custom-rule");

            var examplePluginName = "eslint-plugin-example",
                testPluginName = "eslint-plugin-test",
                requireStubs = {},
                examplePluginRules = { "example-rule": customRule },
                testPluginRules = { "test-rule": customRule },
                examplePlugin = { rules: examplePluginRules, rulesConfig: { "example-rule": 1 } },
                testPlugin = { rules: testPluginRules, rulesConfig: { "test-rule": 1, "quotes": 0} },
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
                examplePlugin = { rules: examplePluginRules, rulesConfig: { "example-rule": 1, "quotes": 2 } };

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

            it("should still work if the plugin does not provide a default configuration", function () {
                requireStubs[examplePluginName] = { rules: examplePluginRules };

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
                            quotes: [2, "double"]
                        },
                        plugins: ["example"]
                    },
                    actual = configHelper.getConfig(file);

                assertConfigsEqual(actual, expected);
            });
        });
    });
});
