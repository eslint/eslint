/**
 * @fileoverview Tests for util.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    util = require("../../lib/util");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("util", function() {

    describe("mixin()", function() {
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

    describe("removePluginPrefix()", function() {
        it("should remove common prefix when passed a plugin name  with a prefix", function() {
            var pluginName = util.removePluginPrefix("eslint-plugin-test");
            assert.equal(pluginName, "test");
        });

        it("should not modify plugin name when passed a plugin name without a prefix", function() {
            var pluginName = util.removePluginPrefix("test");
            assert.equal(pluginName, "test");
        });
    });

    describe("mergeConfigs()", function() {

        it("should combine two objects when passed two objects with different top-level properties", function() {
            var code = [
                        { env: { browser: true } },
                        { globals: { foo: "bar"} }
                    ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", function() {
            var code = [
                        { env: { browser: true }, parser: "espree" },
                        { globals: { foo: "bar"} }
                    ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.equal(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", function() {
            var code = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with ecmaFeatures", function() {
            var code = [
                { ecmaFeatures: { blockBindings: true } },
                { ecmaFeatures: { forOf: true } }
            ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.deepEqual(result, {
                ecmaFeatures: {
                    blockBindings: true,
                    forOf: true
                }
            });
        });

        it("should override configs when passed configs with the same ecmaFeatures", function() {
            var code = [
                { ecmaFeatures: { forOf: false } },
                { ecmaFeatures: { forOf: true } }
            ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.deepEqual(result, {
                ecmaFeatures: {
                    forOf: true
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", function() {

            var code = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            var result = util.mergeConfigs(code[0], code[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
        });

        describe("plugins", function () {
            var baseConfig;

            beforeEach(function () {
                baseConfig = { plugins: ["foo", "bar"] };
            });

            it("should combine the plugin entries when each config has different plugins", function () {
                var customConfig = { plugins: ["baz"] },
                    expectedResult = { plugins: ["foo", "bar", "baz"] },
                    result;

                result = util.mergeConfigs(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
            });

            it("should avoid duplicate plugin entries when each config has the same plugin", function () {
                var customConfig = { plugins: ["bar"] },
                    expectedResult = { plugins: ["foo", "bar"] },
                    result;

                result = util.mergeConfigs(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
            });

            it("should create a valid config when one argument is an empty object", function () {
                var customConfig = { plugins: ["foo"] },
                    result;

                result = util.mergeConfigs({}, customConfig);

                assert.deepEqual(result, customConfig);
                assert.notEqual(result, customConfig);
            });
        });


    });

});
