/**
 * @fileoverview Tests for config object.
 * @author Seth McLaughlin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    path = require("path"),
    Config = require("../../lib/config");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("config").addBatch({

    "findLocalConfigFile": {

        topic: path.resolve(__dirname, "..", "fixtures", "configurations", "single-quotes"),

        "should find local config file": function(topic) {

            var configHelper = new Config(),
                expected = path.resolve(topic, ".eslintrc"),
                actual = configHelper.findLocalConfigFile(topic);

            assert.equal(expected, actual);
        }
    },

    "mergeConfigs": {

        topic: { person: { name: "Seth", car: "prius" }, town: "MV" },

        "should merge configs": function(topic) {

            var configHelper = new Config(),
                expected = { person: { name: "Bob", car: "prius" }, town: "PA" },
                actual = configHelper.mergeConfigs(topic, { person: { name: "Bob" }, town: "PA" });

            assert.deepEqual(expected, actual);
        }
    },

    "getConfig with env rules": {

        topic: path.resolve(__dirname, "..", "fixtures", "configurations",
                "env-node.json"),

        "should be no-global-strict off for node env": function(topic) {

            var configHelper = new Config({config: topic}),
                config = configHelper.getConfig(),
                expected = 0,
                actual = config.rules["no-global-strict"];

            assert.equal(expected, actual);
        }
    },

    "getConfig with env and user rules": {

        topic: path.resolve(__dirname, "..", "fixtures", "configurations",
                "env-node-override.json"),

        "should be no-global-strict a warning": function(topic) {

            var configHelper = new Config({config: topic}),
                config = configHelper.getConfig(),
                expected = 1,
                actual = config.rules["no-global-strict"];

            assert.equal(expected, actual);
        }
    }

}).export(module);
