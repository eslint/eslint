/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    Config = require("../../lib/config"),
    sinon = require("sinon"),
    proxyquire = require("proxyquire");

require("shelljs/global");
proxyquire = proxyquire.noCallThru().noPreserveCache();

/* global mkdir, rm, cp */


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

    if (actual.ecmaFeatures && expected.ecmaFeatures) {
        assert.deepEqual(actual.ecmaFeatures, expected.ecmaFeatures);
    }

    if (actual.globals && expected.globals) {
        assert.deepEqual(actual.globals, expected.globals);
    }

    if (actual.rules && expected.rules) {
        assert.deepEqual(actual.rules, expected.rules);
    }

    if (actual.plugins && expected.plugins) {
        assert.deepEqual(actual.plugins, expected.plugins);
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
        fixtureDir = os.tmpdir() + "/eslint/fixtures";
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

        it("should return the path when a package.json file is found", function() {
            var configHelper = new Config(),
                expected = getFixturePath("broken", "package.json"),

                // The first element of the array is the .eslintrc in the same directory.
                actual = configHelper.findLocalConfigFiles(getFixturePath("broken"))[1];

            assert.equal(actual, expected);
        });

        it("should return all possible files when multiple are found", function() {
            var configHelper = new Config(),
                expected = [
                    getFixturePath("fileexts/subdir/subsubdir/", ".eslintrc.json"),
                    getFixturePath("fileexts/subdir/", ".eslintrc.yml"),
                    getFixturePath("fileexts", ".eslintrc.js")
                ],

                actual = configHelper.findLocalConfigFiles(getFixturePath("fileexts/subdir/subsubdir"));

            assert.deepEqual(actual, expected);
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
            var configHelper = new Config({}),
                actual = configHelper.getConfig();

            assert.equal(actual.rules.strict[1], "global");
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

        it("should throw error when a configuration file doesn't exist", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", ".eslintrc");
            var configHelper = new Config();

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(function() {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should throw error when a configuration file is not require-able", function() {
            var configPath = ".eslintrc";
            var configHelper = new Config();

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(function() {
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
        it("should return a blank config when using no .eslintrc", function() {

            var configHelper = new Config({ useEslintrc: false }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    rules: {},
                    globals: {},
                    env: {}
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
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

            assertConfigsEqual(actual, expected);
        });

        // No default configuration
        it("should return an empty config when not using .eslintrc", function() {

            var configHelper = new Config({ useEslintrc: false }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, {});
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

            assertConfigsEqual(actual, expected);
        });

        it("should return a modified config when baseConfig is set to an object with extend and no .eslintrc", function() {
            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "eslint-config-foo": {
                    rules: {
                        eqeqeq: [2, "smart"]
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configHelper = new StubbedConfig({
                    baseConfig: {
                        env: {
                            node: true
                        },
                        rules: {
                            quotes: [2, "single"]
                        },
                        extends: "eslint-config-foo"
                    },
                    useEslintrc: false
                }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"],
                        eqeqeq: [2, "smart"]
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        it("should return a modified config when baseConfig is set to an object with plugin and no .eslintrc", function() {
            var customRule = require("../fixtures/rules/custom-rule");
            var examplePluginName = "eslint-plugin-example";
            var requireStubs = {};

            requireStubs[examplePluginName] = { rules: { "example-rule": customRule }, rulesConfig: { "example-rule": 1 } };

            var StubbedConfig = proxyquire("../../lib/config", requireStubs);
            var configHelper = new StubbedConfig({
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
                }),
                file = getFixturePath("broken", "plugins", "console-wrong-quotes.js"),
                expected = {
                    env: {
                        node: true
                    },
                    rules: {
                        quotes: [2, "single"],
                        "example/example-rule": 1
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Project configuration - second level .eslintrc
        it("should merge configs when local .eslintrc overrides parent .eslintrc", function() {

            var configHelper = new Config({}),
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
        it("should merge configs when local .eslintrc overrides parent and grandparent .eslintrc", function() {

            var configHelper = new Config({}),
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
        it("should not return configurations in parents of config with root:true", function() {
            var configHelper = new Config({}),
                file = getFixturePath("root-true", "parent", "root", "wrong-semi.js"),
                expected = {
                    rules: {
                        semi: [2, "never"]
                    }
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file adds to local .eslintrc", function() {

            var configHelper = new Config({
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

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with first level .eslintrc
        it("should merge command line config when config file overrides local .eslintrc", function() {

            var configHelper = new Config({
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

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file adds to local and parent .eslintrc", function() {

            var configHelper = new Config({
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

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --config with second level .eslintrc
        it("should merge command line config when config file overrides local and parent .eslintrc", function() {

            var configHelper = new Config({
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

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --rule with --config and first level .eslintrc
        it("should merge command line config and rule when rule and config file overrides local .eslintrc", function() {

            var configHelper = new Config({
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

            assertConfigsEqual(actual, expected);
        });

        // Command line configuration - --plugin
        it("should merge command line plugin with local .eslintrc", function() {

            var configHelper = new Config({
                    plugins: [ "another-plugin" ]
                }),
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


        it("should merge multiple different config file formats", function() {

            var configHelper = new Config(),
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



        it("should load user config globals", function() {
            var expected,
                actual,
                configPath = path.resolve(__dirname, "..", "fixtures", "globals", "conf.yaml"),
                configHelper = new Config({ configFile: configPath, useEslintrc: false });

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

            configHelper = new Config({ configFile: configPath, useEslintrc: false });

            config = configHelper.getConfig(configPath);

            assert.isUndefined(config.globals.window);
        });

        it("should load a sharable config as a command line config", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@test/eslint-config": {
                    rules: {
                        "no-var": 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configHelper = new StubbedConfig({
                    useEslintrc: false,
                    configFile: "@test"
                }),
                expected = {
                    rules: {
                        "no-var": 2
                    }
                },
                actual = configHelper.getConfig(path.resolve(__dirname, "..", "fixtures", "configurations", "empty", "empty.json"));

            assertConfigsEqual(actual, expected);
        });

        it("should error on fake environments", function() {
            var configPath;

            configPath = path.resolve(__dirname, "..", "fixtures", "environments", "fake.yaml");

            assert.throw(function() {
                new Config({ configFile: configPath, useEslintrc: false }); // eslint-disable-line no-new
            });
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
                configHelper = new Config({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "yoda": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        // package extends
        it("should extend package configuration", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "eslint-config-foo": {
                    rules: {
                        eqeqeq: [2, "smart"]
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": [2, "smart"], "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should throw error if extend package dependency is not available", function() {

            var StubbedConfig = proxyquire("../../lib/config", {
                "bar-eslint-config-foo": {
                    rules: {
                        eqeqeq: [2, "smart"]
                    }
                }
            });

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package4/.eslintrc");

            assert.throw(function() {
                new StubbedConfig({ useEslintrc: false, configFile: configPath }); // eslint-disable-line no-new
            });
        });

        it("should extend using a .js file", function() {
            var stubSetup = {};
            stubSetup[path.resolve(__dirname, "../fixtures/config-extends/js/foo.js")] = {
                rules: {
                    eqeqeq: [2, "smart"]
                }
            };
            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", stubSetup);
            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/js/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { eqeqeq: [2, "smart"], "quotes": [2, "double"], "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend package configuration without prefix", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "eslint-config-foo": {
                    rules: {
                        eqeqeq: [2, "smart"]
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package2/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { eqeqeq: [2, "smart"], "quotes": [2, "double"], "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should throw error if extend scoped package dependency is not available", function() {

            var StubbedConfig = proxyquire("../../lib/config", {
                "@scope/bar-eslint-config-foo": {
                    rules: {
                        eqeqeq: [2, "smart"]
                    }
                }
            });

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package8/.eslintrc");

            assert.throw(function() {
                new StubbedConfig({ useEslintrc: false, configFile: configPath }); // eslint-disable-line no-new
            });
        });

        it("should extend scoped package configuration", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config-foo": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend scoped package configuration without prefix", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config-foo": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package2/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should not modify a scoped package named 'eslint-config'", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package4/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend a scope with a slash to '@scope/eslint-config'", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package5/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend a lone scope to '@scope/eslint-config'", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package6/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should still prefix a name prefix of 'eslint-config' without a dash, with a dash", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config-eslint-configfoo": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package7/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend package sub-configuration without prefix", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "eslint-config-foo/bar": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package3/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: true, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                };

            // Reason to override this function in this special case is that I dont want it to keep looking into the
            // chain of parent directries for .eslintrc or package.json file for configs.
            // If that is allowed then the expected outcome will change based on the machine you are running this test.
            sinon.stub(configHelper, "findLocalConfigFiles").returns([
                path.resolve(__dirname, "../fixtures/config-extends/package3/.eslintrc")
            ]);

            var actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend scoped package sub-configuration without prefix", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "@scope/eslint-config-foo/bar": {
                    rules: {
                        eqeqeq: 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/scoped-package3/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: true, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
                    env: { "browser": false }
                };

            // Reason to override this function in this special case is that I dont want it to keep looking into the
            // chain of parent directries for .eslintrc or package.json file for configs.
            // If that is allowed then the expected outcome will change based on the machine you are running this test.
            sinon.stub(configHelper, "findLocalConfigFiles").returns([
                path.resolve(__dirname, "../fixtures/config-extends/scoped-package3/.eslintrc")
            ]);

            var actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should extend package configuration with sub directories", function() {

            var configDeps = {};
            configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", {
                "eslint-config-foo": {
                    rules: {
                        "eqeqeq": 2
                    }
                }
            });

            var StubbedConfig = proxyquire("../../lib/config", configDeps);

            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package2/.eslintrc"),
                configHelper = new StubbedConfig({ useEslintrc: true, configFile: configPath }),
                expected = {
                    rules: { "quotes": [2, "double"], "eqeqeq": 2, "valid-jsdoc": 0 },
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

            assertConfigsEqual(actual, expected);
        });

        it("should extend package configuration from package.json file", function() {
            var configPath = path.resolve(__dirname, "../fixtures/config-extends/package.json"),
                configHelper = new Config({ useEslintrc: true }),
                expected = {
                    rules: { "quotes": [1, "single"], "yoda": 2 },
                    env: { "browser": true }
                };
            // Reason to override this function is force the execution to go into getLocalConfig function and which handles package.json
            sinon.stub(configHelper, "findLocalConfigFiles").returns([
                path.resolve(__dirname, "../fixtures/config-extends/package.json")
            ]);

            var actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        // Non-recursive extends
        it("should extend recursively defined configuration files", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "deep.json"),
                configHelper = new Config({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "semi": 2, "yoda": 2, "valid-jsdoc": 0 },
                    env: { "browser": true }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        // Meaningful stack-traces
        it("should include references to where an `extends` configuration was loaded from", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "error.json");

            assert.throws(function() {
                var configHelper = new Config({ useEslintrc: false, configFile: configPath });
                configHelper.getConfig(configPath);
            }, /Referenced from:.*?error\.json/);
        });

        // Keep order with the last array element taking highest precedence
        it("should make the last element in an array take the highest precedence", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "array", ".eslintrc"),
                configHelper = new Config({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "no-empty": 1, "comma-dangle": 2, "no-console": 2 },
                    env: { "browser": false, "node": true, "es6": true }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        describe("with plugin configuration", function() {
            var customRule = require("../fixtures/rules/custom-rule");

            var examplePluginName = "eslint-plugin-example",
                exampleConfigName = "eslint-config-example",
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

                var configHelper = new StubbedConfig({}),
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

                var configHelper = new StubbedConfig({}),
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

                var configHelper = new StubbedConfig({}),
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

            it("should still work if the plugin does not provide a default configuration", function() {
                requireStubs[examplePluginName] = { rules: examplePluginRules };

                StubbedConfig = proxyquire("../../lib/config", requireStubs);

                var configHelper = new StubbedConfig({}),
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

            it("should not clobber config objects when loading shared configs", function() {

                var configFileDeps = {};
                configFileDeps[exampleConfigName] = { rules: { "example-rule": 2 } };

                var configDeps = {};
                configDeps["./config/config-file"] = proxyquire("../../lib/config/config-file", configFileDeps);

                StubbedConfig = proxyquire("../../lib/config", configDeps);

                var configHelper = new StubbedConfig({}),
                    file1 = getFixturePath("shared", "a", "index.js"),
                    file2 = getFixturePath("shared", "b", "index.js");

                // first load creates object
                configHelper.getConfig(file1);

                // subsequent loads clobber #2592
                var expected = configHelper.getConfig(file2);

                assert(!("quotes" in expected.rules), "shared config should not be clobbered");
            });
        });

        describe("with env in a child configuration file", function() {
            it("should overwrite ecmaFeatures of the parent with env of the child", function() {
                var config = new Config();
                var targetPath = getFixturePath("overwrite-ecmaFeatures", "child", "foo.js");
                var expected = {
                    rules: {},
                    env: {commonjs: true},
                    ecmaFeatures: {globalReturn: true}
                };
                var actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });
        });

        describe("personal config file within home directory", function() {
            var getCwd;

            beforeEach(function() {
                getCwd = sinon.stub(process, "cwd");
            });

            afterEach(function() {
                getCwd.restore();
            });

            it("should load the personal config if no local config was found", function() {
                var projectPath = getFixturePath("personal-config", "project-without-config"),
                    homePath = getFixturePath("personal-config", "home-folder"),
                    filePath = getFixturePath("personal-config", "project-without-config", "foo.js");

                getCwd.returns(projectPath);

                var StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                var config = new StubbedConfig(),
                    actual = config.getConfig(filePath),
                    expected = {
                        ecmaFeatures: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "home-folder-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });

            it("should ignore the personal config if a local config was found", function() {
                var projectPath = getFixturePath("personal-config", "home-folder", "project"),
                    homePath = getFixturePath("personal-config", "home-folder"),
                    filePath = getFixturePath("personal-config", "home-folder", "project", "foo.js");

                getCwd.returns(projectPath);

                var StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                var config = new StubbedConfig(),
                    actual = config.getConfig(filePath),
                    expected = {
                        ecmaFeatures: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "project-level-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });

            it("should have an empty config if no local config and no personal config was found", function() {
                var projectPath = getFixturePath("personal-config", "project-without-config"),
                    homePath = getFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFixturePath("personal-config", "project-without-config", "foo.js");

                getCwd.returns(projectPath);

                var StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                var config = new StubbedConfig(),
                    actual = config.getConfig(filePath),
                    expected = {
                        ecmaFeatures: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {}
                    };

                assert.deepEqual(actual, expected);
            });

            it("should still load the project config if the current working directory is the same as the home folder", function() {
                var projectPath = getFixturePath("personal-config", "project-with-config"),
                    filePath = getFixturePath("personal-config", "project-with-config", "subfolder", "foo.js");

                var StubbedConfig = proxyquire("../../lib/config", { "user-home": projectPath });

                getCwd.returns(projectPath);

                var config = new StubbedConfig(),
                    actual = config.getConfig(filePath),
                    expected = {
                        ecmaFeatures: {},
                        env: {},
                        globals: {},
                        parser: void 0,
                        rules: {
                            "project-level-rule": 2,
                            "subfolder-level-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });
        });
    });
});
