/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    Config = require("../../lib/config"),
    sinon = require("sinon");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("config", function() {
    describe("findLocalConfigFile", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes");

        it("should find local config file", function() {
            var configHelper = new Config(),
                expected = path.resolve(code, ".eslintrc"),
                actual = configHelper.findLocalConfigFile(code);

            assert.equal(expected, actual);
        });
    });

    describe("mergeConfigs", function() {
        var code = { person: { name: "Seth", car: "prius" }, town: "MV" };

        it("should merge configs", function() {
            var configHelper = new Config(),
                expected = { person: { name: "Bob", car: "prius" }, town: "PA" },
                actual = configHelper.mergeConfigs(code, { person: { name: "Bob" }, town: "PA" });

            assert.deepEqual(expected, actual);
        });
    });

    describe("getConfig with env rules", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations",
                "env-node.json");

        it("should be no-global-strict off for node env", function() {

            var configHelper = new Config({config: code}),
                config = configHelper.getConfig(),
                expected = 0,
                actual = config.rules["no-global-strict"];

            assert.equal(expected, actual);
        });
    });

    describe("getConfig with env and user rules", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations",
                "env-node-override.json");

        it("should be no-global-strict a warning", function() {
            var configHelper = new Config({config: code}),
                config = configHelper.getConfig(),
                expected = 1,
                actual = config.rules["no-global-strict"];

            assert.equal(expected, actual);
        });
    });

    describe("getConfig", function() {
        var firstpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", "subdir", ".eslintrc");
        var secondpath = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

        it("should not retain configs from previous directories", function() {
            var configHelper = new Config(),
                config;

            config = configHelper.getConfig(firstpath);
            assert.equal(0, config.rules["dot-notation"]);

            config = configHelper.getConfig(secondpath);
            assert.equal(2, config.rules["dot-notation"]);
        });
    });

    describe("getLocalConfig with directory", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

        it("should be single quotes config", function() {
            var configHelper = new Config(),
                config = configHelper.getConfig(code),
                expected = [1, "single"],
                actual = config.rules.quotes;

            assert.deepEqual(expected, actual);
        });
    });

    describe("getLocalConfig with nested directories", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", "subdir", ".eslintrc");

        it("should be merged config", function() {
            var configHelper = new Config(),
                config = configHelper.getConfig(code);

            assert.equal(config.rules["dot-notation"], 0);
            assert.equal(config.rules["no-new"], 1);
        });
    });

    describe("getLocalConfig with invalid directory", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes");

        it("should be default config", function() {
            var configHelper = new Config();
            sinon.stub(configHelper, "findLocalConfigFile", function(directory) {
                return path.resolve(directory, ".eslintrc");
            });
            sinon.stub(console, "error").returns({});

            configHelper.getConfig(code);

            assert.isTrue(console.error.called);
            configHelper.findLocalConfigFile.restore();
            console.error.restore();
        });
    });

    describe("getConfig", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

        it("should cache config", function() {
            var configHelper = new Config();

            sinon.spy(configHelper, "findLocalConfigFile");

            // If cached this should be called only once
            configHelper.getConfig(code);
            var callcount = configHelper.findLocalConfigFile.callcount;
            configHelper.getConfig(code);

            assert.equal(callcount, configHelper.findLocalConfigFile.callcount);

            configHelper.findLocalConfigFile.restore();
        });
    });

    describe("getLocalConfig with current directory", function() {
        it("should return false", function() {
            var configHelper = new Config();

            var output = configHelper.findLocalConfigFile("/");
            assert.isFalse(output);
        });
    });

    describe("getLocalConfig with no directory", function() {
        it("should return global config", function() {
            var configHelper = new Config();

            var output = configHelper.findLocalConfigFile();
            assert.include(output, ".eslintrc");
        });
    });

    describe("getConfig with no directory", function() {
        it("should return cwd config", function() {
            var cwd = process.cwd();
            process.chdir(path.resolve(__dirname, "..", "fixtures", "configurations", "cwd"));

            try {
                var configHelper = new Config(),
                    code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc"),
                    expected = configHelper.getConfig(code),
                    expectedQuotes = expected.rules.quotes[0],
                    actual = configHelper.getConfig(),
                    actualQuotes = actual.rules.quotes[0];

                assert.notEqual(expectedQuotes, actualQuotes);
            } finally {
                process.chdir(cwd);
            }
        });
    });

    describe("Config with abitrarily named config file", function() {
        it("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "my-awesome-config"),
                configHelper = new Config({config: configPath}),
                quotes = configHelper.useSpecificConfig.rules.quotes[0];

            assert.equal(quotes, 3);
        });
    });

    describe("Config with comments", function() {
        it("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "comments.json"),
                configHelper = new Config({config: configPath}),
                semi = configHelper.useSpecificConfig.rules.semi,
                strict = configHelper.useSpecificConfig.rules.strict;

            assert.equal(semi, 1);
            assert.equal(strict, 0);
        });
    });

    describe("YAML config", function() {
        it("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-browser.yaml"),
                configHelper = new Config({config: configPath}),
                noAlert = configHelper.useSpecificConfig.rules["no-alert"],
                noUndef = configHelper.useSpecificConfig.rules["no-undef"];

            assert.equal(noAlert, 0);
            assert.equal(noUndef, 2);
        });
    });

});
