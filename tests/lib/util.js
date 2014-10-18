/**
 * @fileoverview Tests for util.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", function() {
    describe("when calling mixin()", function() {
        function code() {
            var a = {}, b = { foo: "f", bar: 1 };
            util.mixin(a, b);
            return [a, b];
        }

        it("should add properties to target object", function() {
            var a = code()[0];
            assert.equal(Object.keys(a).length, 2);
            assert.equal(a.foo, "f");
            assert.equal(a.bar, 1);
        });

        it("should not change the source object", function() {
            var b = code()[1];
            assert.equal(Object.keys(b).length, 2);
            assert.equal(b.foo, "f");
            assert.equal(b.bar, 1);
        });
    });

    describe("when calling removePluginPrefix", function() {
        it("should remove common prefix", function() {
            var pluginName = util.removePluginPrefix("eslint-plugin-test");
            assert.equal(pluginName, "test");
        });

        it("should not modify plugin name", function() {
            var pluginName = util.removePluginPrefix("test");
            assert.equal(pluginName, "test");
        });
    });

    describe("when calling mergeConfigs()", function() {
        var code = [
            { env: { browser: true } },
            { globals: { foo: "bar"} }
        ];

        it("should combine the two objects", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });
    });
    describe("when merging two configs with arrays", function() {
        var code = [
            { rules: { "no-mixed-requires": [0, false] } },
            { rules: { "no-mixed-requires": [1, true] } }
        ];

        it("should combine configs and override rules", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });
    });

    describe("when merging two configs with arrays and int", function() {
        var code = [
            { rules: { "no-mixed-requires": [0, false] } },
            { rules: { "no-mixed-requires": 1 } }
        ];

        it("should combine configs and override rules", function() {
            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
        });
    });

    describe("when merging two configs with plugin entries", function () {
        var baseConfig;

        beforeEach(function () {
            baseConfig = { plugins: ["foo", "bar"] };
        });

        it("should combine the plugin entries", function () {
            var customConfig = { plugins: ["baz"] },
                expectedResult = { plugins: ["foo", "bar", "baz"] },
                result;

            result = util.mergeConfigs(baseConfig, customConfig);

            assert.deepEqual(result, expectedResult);
        });

        it("should avoid duplicate plugin entries", function () {
            var customConfig = { plugins: ["bar"] },
                expectedResult = { plugins: ["foo", "bar"] },
                result;

            result = util.mergeConfigs(baseConfig, customConfig);

            assert.deepEqual(result, expectedResult);
        });

        it("should be able to copy a customConfig with plugin entries", function () {
            var customConfig = { plugins: ["foo"] },
                result;

            result = util.mergeConfigs({}, customConfig);

            assert.deepEqual(result, customConfig);
            assert.notEqual(result, customConfig);
        });
    });
});
