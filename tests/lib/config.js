/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */
/* eslint no-undefined: "off" */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    path = require("path"),
    fs = require("fs"),
    os = require("os"),
    Config = require("../../lib/config"),
    environments = require("../../conf/environments"),
    sinon = require("sinon"),
    mockFs = require("mock-fs");

const DIRECTORY_CONFIG_HIERARCHY = require("../fixtures/config-hierarchy/file-structure.json");

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

    if (actual.parserOptions && expected.parserOptions) {
        assert.deepEqual(actual.parserOptions, expected.parserOptions);
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

    let fixtureDir,
        sandbox;

    /**
     * Returns the path inside of the fixture directory.
     * @returns {string} The path inside the fixture directory.
     * @private
     */
    function getFixturePath() {
        const args = Array.prototype.slice.call(arguments);

        args.unshift("config-hierarchy");
        args.unshift(fixtureDir);
        return path.join.apply(path, args);
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
            const customBaseConfig = { foo: "bar" },
                configHelper = new Config({ baseConfig: customBaseConfig, format: "foo" });

            // at one point, customBaseConfig.format would end up equal to "foo"...that's bad
            assert.deepEqual(customBaseConfig, { foo: "bar" });
            assert.equal(configHelper.options.format, "foo");
        });
    });

    describe("findLocalConfigFiles()", function() {

        /**
         * Returns the path inside of the fixture directory.
         * @returns {string} The path inside the fixture directory.
         * @private
         */
        function getFakeFixturePath() {
            const args = Array.prototype.slice.call(arguments);

            args.unshift("config-hierarchy");
            args.unshift("fixtures");
            args.unshift("eslint");
            args.unshift(process.cwd());
            return path.join.apply(path, args);
        }

        before(function() {
            mockFs({
                eslint: {
                    fixtures: {
                        "config-hierarchy": DIRECTORY_CONFIG_HIERARCHY
                    }
                }
            });
        });

        after(function() {
            mockFs.restore();
        });

        it("should return the path when an .eslintrc file is found", function() {
            const configHelper = new Config(),
                expected = getFakeFixturePath("broken", ".eslintrc"),
                actual = configHelper.findLocalConfigFiles(getFakeFixturePath("broken"))[0];

            assert.equal(actual, expected);
        });

        it("should return an empty array when an .eslintrc file is not found", function() {
            const configHelper = new Config(),
                actual = configHelper.findLocalConfigFiles(getFakeFixturePath());

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
        });

        it("should return package.json only when no other config files are found", function() {
            const configHelper = new Config(),
                expected0 = getFakeFixturePath("packagejson", "subdir", "package.json"),
                expected1 = getFakeFixturePath("packagejson", ".eslintrc"),
                actual = configHelper.findLocalConfigFiles(getFakeFixturePath("packagejson", "subdir"));

            assert.isArray(actual);
            assert.lengthOf(actual, 2);
            assert.equal(actual[0], expected0);
            assert.equal(actual[1], expected1);
        });

        it("should return the only one config file even if there are multiple found", function() {
            const configHelper = new Config(),
                expected = getFakeFixturePath("broken", ".eslintrc"),

                // The first element of the array is the .eslintrc in the same directory.
                actual = configHelper.findLocalConfigFiles(getFakeFixturePath("broken"));

            assert.equal(actual.length, 1);
            assert.equal(actual, expected);
        });

        it("should return all possible files when multiple are found", function() {
            const configHelper = new Config(),
                expected = [
                    getFakeFixturePath("fileexts/subdir/subsubdir/", ".eslintrc.json"),
                    getFakeFixturePath("fileexts/subdir/", ".eslintrc.yml"),
                    getFakeFixturePath("fileexts", ".eslintrc.js")
                ],

                actual = configHelper.findLocalConfigFiles(getFakeFixturePath("fileexts/subdir/subsubdir"));

            assert.deepEqual(actual, expected);
        });

        it("should return an empty array when a package.json file is not found", function() {
            const configHelper = new Config(),
                actual = configHelper.findLocalConfigFiles(getFakeFixturePath());

            assert.isArray(actual);
            assert.lengthOf(actual, 0);
        });
    });

    describe("getConfig()", function() {

        it("should return the project config when called in current working directory", function() {
            const configHelper = new Config({cwd: process.cwd()}),
                actual = configHelper.getConfig();

            assert.equal(actual.rules.strict[1], "global");
        });

        it("should not retain configs from previous directories when called multiple times", function() {

            const firstpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", "subdir", ".eslintrc");
            const secondpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

            const configHelper = new Config({cwd: process.cwd()});
            let config;

            config = configHelper.getConfig(firstpath);
            assert.equal(config.rules["no-new"], 0);

            config = configHelper.getConfig(secondpath);
            assert.equal(config.rules["no-new"], 1);
        });

        it("should throw an error when an invalid path is given", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "foobaz", ".eslintrc");
            const homePath = "does-not-exist";

            const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

            const configHelper = new StubbedConfig({cwd: process.cwd()});

            sandbox.stub(fs, "readdirSync").throws(new Error());

            assert.throws(function() {
                configHelper.getConfig(configPath);
            }, "No ESLint configuration found.");
        });

        it("should throw error when a configuration file doesn't exist", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", ".eslintrc");
            const configHelper = new Config({cwd: process.cwd()});

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(function() {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should throw error when a configuration file is not require-able", function() {
            const configPath = ".eslintrc";
            const configHelper = new Config({cwd: process.cwd()});

            sandbox.stub(fs, "readFileSync").throws(new Error());

            assert.throws(function() {
                configHelper.getConfig(configPath);
            }, "Cannot read config file");

        });

        it("should cache config when the same directory is passed twice", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");
            const configHelper = new Config({cwd: process.cwd()});

            sandbox.spy(configHelper, "findLocalConfigFiles");

            // If cached this should be called only once
            configHelper.getConfig(configPath);
            const callcount = configHelper.findLocalConfigFiles.callcount;

            configHelper.getConfig(configPath);

            assert.equal(configHelper.findLocalConfigFiles.callcount, callcount);
        });

        // make sure JS-style comments don't throw an error
        it("should load the config file when there are JS-style comments in the text", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "comments.json"),
                configHelper = new Config({configFile: configPath}),
                semi = configHelper.useSpecificConfig.rules.semi,
                strict = configHelper.useSpecificConfig.rules.strict;

            assert.equal(semi, 1);
            assert.equal(strict, 0);
        });

        // make sure YAML files work correctly
        it("should load the config file when a YAML file is used", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-browser.yaml"),
                configHelper = new Config({configFile: configPath}),
                noAlert = configHelper.useSpecificConfig.rules["no-alert"],
                noUndef = configHelper.useSpecificConfig.rules["no-undef"];

            assert.equal(noAlert, 0);
            assert.equal(noUndef, 2);
        });

        it("should contain the correct value for parser when a custom parser is specified", function() {
            const configPath = path.resolve(__dirname, "../fixtures/configurations/parser/.eslintrc.json"),
                configHelper = new Config({ cwd: process.cwd() }),
                config = configHelper.getConfig(configPath);

            assert.equal(config.parser, path.resolve(path.dirname(configPath), "./custom.js"));
        });

        // Configuration hierarchy ---------------------------------------------

        // https://github.com/eslint/eslint/issues/3915
        it("should correctly merge environment settings", function() {
            const configHelper = new Config({ useEslintrc: true, cwd: process.cwd() }),
                file = getFixturePath("envs", "sub", "foo.js"),
                expected = {
                    rules: {},
                    env: {
                        browser: true,
                        node: false
                    },
                    ecmaFeatures: {
                        globalReturn: false
                    },
                    globals: environments.browser.globals
                },
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, expected);
        });

        // Default configuration - blank
        it("should return a blank config when using no .eslintrc", function() {

            const configHelper = new Config({ useEslintrc: false }),
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
            const configHelper = new Config({ baseConfig: false, useEslintrc: false }),
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

            const configHelper = new Config({ useEslintrc: false }),
                file = getFixturePath("broken", "console-wrong-quotes.js"),
                actual = configHelper.getConfig(file);

            assertConfigsEqual(actual, {});
        });

        it("should return a modified config when baseConfig is set to an object and no .eslintrc", function() {


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

        it("should return a modified config without plugin rules enabled when baseConfig is set to an object with plugin and no .eslintrc", function() {
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
                }),
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
        it("should merge configs when local .eslintrc overrides parent .eslintrc", function() {

            const configHelper = new Config({cwd: process.cwd()}),
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

            const configHelper = new Config({cwd: process.cwd()}),
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
            const configHelper = new Config({cwd: process.cwd()}),
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
        it("should return project config when called with a relative path from a subdir", function() {
            const configHelper = new Config({cwd: getFixturePath("root-true", "parent", "root", "subdir")}),
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
        it("should merge command line config when config file adds to local .eslintrc", function() {

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "add-conf.yaml"),
                    cwd: process.cwd()
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

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    cwd: process.cwd()
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

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "add-conf.yaml"),
                    cwd: process.cwd()
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

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    cwd: process.cwd()
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

            const configHelper = new Config({
                    configFile: getFixturePath("broken", "override-conf.yaml"),
                    rules: {
                        quotes: [1, "double"]
                    },
                    cwd: process.cwd()
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

            // stub out Config to use stub config file
            const StubbedConfig = createStubbedConfigWithPlugins({
                "eslint-plugin-example": {},
                "eslint-plugin-another-plugin": {}
            });

            const configHelper = new StubbedConfig({
                    plugins: [ "another-plugin" ],
                    cwd: process.cwd()
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

            const configHelper = new Config({cwd: process.cwd()}),
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
            const configPath = path.resolve(__dirname, "..", "fixtures", "globals", "conf.yaml"),
                configHelper = new Config({ configFile: configPath, useEslintrc: false });

            const expected = {
                globals: {
                    foo: true
                }
            };

            const actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        it("should not load disabled environments", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "disable.yaml");

            const configHelper = new Config({ configFile: configPath, useEslintrc: false });

            const config = configHelper.getConfig(configPath);

            assert.isUndefined(config.globals.window);
        });

        it("should error on fake environments", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "fake.yaml");

            assert.throw(function() {
                new Config({ configFile: configPath, useEslintrc: false, cwd: process.cwd() }); // eslint-disable-line no-new
            });
        });

        it("should gracefully handle empty files", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-node.json"),
                configHelper = new Config({configFile: configPath, cwd: process.cwd()});

            configHelper.getConfig(path.resolve(__dirname, "..", "fixtures", "configurations", "empty", "empty.json"));
        });

        // Meaningful stack-traces
        it("should include references to where an `extends` configuration was loaded from", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "error.json");

            assert.throws(function() {
                const configHelper = new Config({ useEslintrc: false, configFile: configPath });

                configHelper.getConfig(configPath);
            }, /Referenced from:.*?error\.json/);
        });

        // Keep order with the last array element taking highest precedence
        it("should make the last element in an array take the highest precedence", function() {
            const configPath = path.resolve(__dirname, "..", "fixtures", "config-extends", "array", ".eslintrc"),
                configHelper = new Config({ useEslintrc: false, configFile: configPath }),
                expected = {
                    rules: { "no-empty": 1, "comma-dangle": 2, "no-console": 2 },
                    env: { browser: false, node: true, es6: true }
                },
                actual = configHelper.getConfig(configPath);

            assertConfigsEqual(actual, expected);
        });

        describe("with env in a child configuration file", function() {
            it("should overwrite parserOptions of the parent with env of the child", function() {
                const config = new Config({ cwd: process.cwd() });
                const targetPath = getFixturePath("overwrite-ecmaFeatures", "child", "foo.js");
                const expected = {
                    rules: {},
                    env: {commonjs: true},
                    parserOptions: {ecmaFeatures: {globalReturn: true}}
                };
                const actual = config.getConfig(targetPath);

                assertConfigsEqual(actual, expected);
            });
        });

        describe("personal config file within home directory", function() {

            /**
             * Returns the path inside of the fixture directory.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFakeFixturePath() {
                const args = Array.prototype.slice.call(arguments);

                args.unshift("config-hierarchy");
                args.unshift("fixtures");
                args.unshift("eslint");
                args.unshift(process.cwd());
                return path.join.apply(path, args);
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

            afterEach(function() {
                mockFs.restore();
            });

            it("should load the personal config if no local config was found", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: undefined,
                        rules: {
                            "home-folder-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });

            it("should ignore the personal config if a local config was found", function() {
                const projectPath = getFakeFixturePath("personal-config", "home-folder", "project"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "home-folder", "project", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: undefined,
                        rules: {
                            "project-level-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });

            it("should ignore the personal config if config is passed through cli", function() {
                const configPath = getFakeFixturePath("quotes-error.json");
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ configFile: configPath, cwd: process.cwd() }),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: undefined,
                        rules: {
                            quotes: [2, "double"]
                        }
                    };

                assert.deepEqual(actual, expected);
            });

            it("should still load the project config if the current working directory is the same as the home folder", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-with-config"),
                    filePath = getFakeFixturePath("personal-config", "project-with-config", "subfolder", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": projectPath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() }),
                    actual = config.getConfig(filePath),
                    expected = {
                        parserOptions: {},
                        env: {},
                        globals: {},
                        parser: undefined,
                        rules: {
                            "project-level-rule": 2,
                            "subfolder-level-rule": 2
                        }
                    };

                assert.deepEqual(actual, expected);
            });
        });

        describe("when no local or personal config is found", function() {

            /**
             * Returns the path inside of the fixture directory.
             * @returns {string} The path inside the fixture directory.
             * @private
             */
            function getFakeFixturePath() {
                const args = Array.prototype.slice.call(arguments);

                args.unshift("config-hierarchy");
                args.unshift("fixtures");
                args.unshift("eslint");
                args.unshift(process.cwd());
                return path.join.apply(path, args);
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

            afterEach(function() {
                mockFs.restore();
            });

            it("should throw an error if no local config and no personal config was found", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({ cwd: process.cwd() });

                assert.throws(function() {
                    config.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should throw an error if no local config was found and ~/package.json contains no eslintConfig section", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "home-folder-with-packagejson"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const configHelper = new StubbedConfig({ cwd: process.cwd() });

                assert.throws(function() {
                    configHelper.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should not throw an error if no local config and no personal config was found but useEslintrc is false", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    useEslintrc: false
                });

                assert.doesNotThrow(function() {
                    config.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should not throw an error if no local config and no personal config was found but rules are specified", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    rules: { quotes: [2, "single"] }
                });

                assert.doesNotThrow(function() {
                    config.getConfig(filePath);
                }, "No ESLint configuration found");
            });

            it("should not throw an error if no local config and no personal config was found but baseConfig is specified", function() {
                const projectPath = getFakeFixturePath("personal-config", "project-without-config"),
                    homePath = getFakeFixturePath("personal-config", "folder-does-not-exist"),
                    filePath = getFakeFixturePath("personal-config", "project-without-config", "foo.js");

                const StubbedConfig = proxyquire("../../lib/config", { "user-home": homePath });

                mockPersonalConfigFileSystem();
                mockCWDResponse(projectPath);

                const config = new StubbedConfig({
                    cwd: process.cwd(),
                    baseConfig: {}
                });

                assert.doesNotThrow(function() {
                    config.getConfig(filePath);
                }, "No ESLint configuration found");
            });
        });
    });

    describe("Plugin Environments", function() {
        it("should load environments from plugin", function() {

            const StubbedConfig = createStubbedConfigWithPlugins({
                "eslint-plugin-test": {
                    environments: { example: { globals: { test: false } } }
                }
            });

            const configPath = path.resolve(__dirname, "..", "fixtures", "environments", "plugin.yaml"),
                configHelper = new StubbedConfig({
                    reset: true, configFile: configPath, useEslintrc: false
                }),
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
