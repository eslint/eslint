/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    path = require("path"),
    Config = require("../../../lib/config");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("config", function() {
    describe("findLocalConfigFile", function() {
        var code = path.resolve(__dirname, "../..", "fixtures", "configurations", "single-quotes");

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
        var code = path.resolve(__dirname, "../..", "fixtures", "configurations",
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
        var code = path.resolve(__dirname, "../..", "fixtures", "configurations",
                "env-node-override.json");

        it("should be no-global-strict a warning", function() {
            var configHelper = new Config({config: code}),
                config = configHelper.getConfig(),
                expected = 1,
                actual = config.rules["no-global-strict"];

            assert.equal(expected, actual);
        });
    });
});
