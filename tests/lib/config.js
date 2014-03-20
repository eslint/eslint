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

    describe("getConfig with exclude", function() {
        var code = path.resolve(__dirname, "..", "fixtures", ".eslintrc");

        it("should exclude passing.js", function() {
            var configHelper = new Config(),
                config = configHelper.getConfig(code);

            configHelper.cacheExclusions(path.resolve(__dirname, "..", "fixtures"), true);

            assert.isTrue(configHelper.checkForExclusion(path.resolve(__dirname, "..", "fixtures", "passing.js")));
        });
    });

    describe("getLocalConfig with invalid directory", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes");

        it("should be default config", function() {
            var configHelper = new Config();
            sinon.stub(configHelper, "findLocalConfigFile", function(directory) { return path.resolve(directory, ".eslintrc"); });
            sinon.stub(console, "error").returns({});

            var config = configHelper.getConfig(code);

            assert.isTrue(console.error.calledTwice);
            configHelper.findLocalConfigFile.restore();
            console.error.restore();
        });
    });

    describe("should cache config", function() {
        var code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc");

        it("should resolve config only once", function() {
            var configHelper = new Config();

            sinon.spy(configHelper, "findLocalConfigFile");
            configHelper.getConfig(code);
            configHelper.getConfig(code);

            assert.isTrue(configHelper.findLocalConfigFile.calledOnce);
            configHelper.findLocalConfigFile.restore();
        });
    });

    describe("when searching for exclusions in directory without .eslintignore", function() {
        it("should not have any exclusions", function() {
            var configHelper = new Config();

            configHelper.cacheExclusions(path.resolve("./"));

            assert.isUndefined(configHelper.exclusionsCache[path.resolve("./")]);
        });
    });

    describe("when searching for exclusions in directory with .eslintignore", function() {
        it("should have correct exclusions", function() {
            var configHelper = new Config();
            configHelper.cacheExclusions(path.resolve(__dirname, "..", "fixtures"));

            assert.isTrue(configHelper.checkForExclusion(path.resolve(__dirname, "..", "fixtures", "rules", "eslint.json")));
            assert.isTrue(configHelper.checkForExclusion(path.resolve(__dirname, "..", "fixtures", "passing.js")));
        });
    });

    describe("getLocalConfig with current directory", function() {
        it ("should return false", function() {
            var configHelper = new Config();

            output = configHelper.findLocalConfigFile("/");
            assert.isFalse(output);
        });
    });

    describe("getLocalConfig with no directory", function() {
        it ("should return global config", function() {
            var configHelper = new Config();

            output = configHelper.findLocalConfigFile();
            assert.include(output, ".eslintrc");
        });
    });

    describe("getConfig with no directory", function() {
        it ("should return cwd config", function() {
            var cwd = process.cwd();;
            process.chdir(path.resolve(__dirname, "..", "fixtures", "configurations", "cwd"));

            try {
                var configHelper = new Config(),
                    code = path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes", ".eslintrc"),
                    expected = configHelper.getConfig(code),
                    expectedQuotes = expected.rules.quotes[0],
                    actual = configHelper.getConfig(),
                    actualQuotes = actual.rules.quotes[0];

                assert.notEqual(expectedQuotes, actualQuotes);
            }
            finally {
                process.chdir(cwd);
            }
        });
    });

    describe("Config with abitrarily named config file", function() {
        it ("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "my-awesome-config"),
                configHelper = new Config({config: configPath}),
                quotes = configHelper.useSpecificConfig.rules.quotes[0];

            assert.equal(quotes, 3);
        });
    });

    describe("Config with comments", function() {
        it ("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "comments.json"),
                configHelper = new Config({config: configPath}),
                semi = configHelper.useSpecificConfig.rules.semi,
                strict = configHelper.useSpecificConfig.rules.strict;

            assert.equal(semi, 1);
            assert.equal(strict, 0);
        });
    });

    describe("YAML config", function() {
        it ("should load the config file", function() {
            var configPath = path.resolve(__dirname, "..", "fixtures", "configurations", "env-browser.yaml"),
                configHelper = new Config({config: configPath}),
                noAlert = configHelper.useSpecificConfig.rules["no-alert"],
                noUndef = configHelper.useSpecificConfig.rules["no-undef"];

            assert.equal(noAlert, 0);
            assert.equal(noUndef, 2);
        });
    });

});
