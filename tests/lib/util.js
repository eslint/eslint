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

    describe("getNamespace()", function() {
        it("should remove namepace when passed with namepace", function() {
            var namespace = util.getNamespace("@namepace/eslint-plugin-test");
            assert.equal(namespace, "@namepace/");
        });
    });

    describe("removeNameSpace()", function() {
        it("should remove namepace when passed with namepace", function() {
            var namespace = util.removeNameSpace("@namepace/eslint-plugin-test");
            assert.equal(namespace, "eslint-plugin-test");
        });
    });

    describe("mergeConfigs()", function() {

        it("should combine two objects when passed two objects with different top-level properties", function() {
            var config = [
                { env: { browser: true } },
                { globals: { foo: "bar"} }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine without blowing up on null values", function() {
            var config = [
                { env: { browser: true } },
                { env: { node: null } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.equal(result.env.node, null);
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", function() {
            var config = [
                { env: { browser: true }, parser: "espree" },
                { globals: { foo: "bar"} }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.equal(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", function() {
            var config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with ecmaFeatures", function() {
            var config = [
                { ecmaFeatures: { blockBindings: true } },
                { ecmaFeatures: { forOf: true } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.deepEqual(result, {
                ecmaFeatures: {
                    blockBindings: true,
                    forOf: true
                }
            });

            assert.deepEqual(config[0], { ecmaFeatures: { blockBindings: true }});
            assert.deepEqual(config[1], { ecmaFeatures: { forOf: true }});
        });

        it("should override configs when passed configs with the same ecmaFeatures", function() {
            var config = [
                { ecmaFeatures: { forOf: false } },
                { ecmaFeatures: { forOf: true } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.deepEqual(result, {
                ecmaFeatures: {
                    forOf: true
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", function() {

            var config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [0, false] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": 1 }});
        });

        it("should combine configs and override rules options completely", function() {

            var config = [
                { rules: { "no-mixed-requires": [1, {"event": ["evt", "e"]}] } },
                { rules: { "no-mixed-requires": [1, {"err": ["error", "e"]}] } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.deepEqual(result.rules["no-mixed-requires"][1], {"err": ["error", "e"]});
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [1, {"event": ["evt", "e"]}] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": [1, {"err": ["error", "e"]}] }});
        });

        it("should combine configs and override rules options without array or object", function() {

            var config = [
                { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": [2, "requirejs"] } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires"][1], "requirejs");
            assert.isUndefined(result.rules["no-mixed-requires"][2]);
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [1, "nconf", "underscore"] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": [2, "requirejs"] }});
        });

        it("should combine configs and override rules options without array or object but special case", function() {

            var config = [
                { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": 2 } }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires"][1], "nconf");
            assert.strictEqual(result.rules["no-mixed-requires"][2], "underscore");
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [1, "nconf", "underscore"] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": 2 }});
        });

        it("should combine configs correctly", function() {

            var config = [
                {
                    rules: {
                        "no-mixed-requires": [1, {"event": ["evt", "e"]}],
                        "valid-jsdoc": 1,
                        "semi": 1,
                        "quotes": [2, {"exception": ["hi"]}],
                        "smile": [1, ["hi", "bye"]]
                    },
                    ecmaFeatures: { blockBindings: true },
                    env: { browser: true },
                    globals: { foo: false}
                },
                {
                    rules: {
                        "no-mixed-requires": [1, {"err": ["error", "e"]}],
                        "valid-jsdoc": 2,
                        "test": 1,
                        "smile": [1, ["xxx", "yyy"]]
                    },
                    ecmaFeatures: { forOf: true },
                    env: { browser: false },
                    globals: { foo: true}
                }
            ];

            var result = util.mergeConfigs(config[0], config[1]);

            assert.deepEqual(result, {
                "ecmaFeatures": {
                    "blockBindings": true,
                    "forOf": true
                },
                "env": {
                    "browser": false
                },
                "globals": {
                    "foo": true
                },
                "rules": {
                    "no-mixed-requires": [1,
                        {
                            "err": [
                                "error",
                                "e"
                            ]
                        }
                    ],
                    "quotes": [2,
                        {
                            "exception": [
                                "hi"
                            ]
                        }
                    ],
                    "semi": 1,
                    "smile": [1, ["xxx", "yyy"]],
                    "test": 1,
                    "valid-jsdoc": 2
                }
            });
            assert.deepEqual(config[0], {
                rules: {
                    "no-mixed-requires": [1, {"event": ["evt", "e"]}],
                    "valid-jsdoc": 1,
                    "semi": 1,
                    "quotes": [2, {"exception": ["hi"]}],
                    "smile": [1, ["hi", "bye"]]
                },
                ecmaFeatures: { blockBindings: true },
                env: { browser: true },
                globals: { foo: false}
            });
            assert.deepEqual(config[1], {
                rules: {
                    "no-mixed-requires": [1, {"err": ["error", "e"]}],
                    "valid-jsdoc": 2,
                    "test": 1,
                    "smile": [1, ["xxx", "yyy"]]
                },
                ecmaFeatures: { forOf: true },
                env: { browser: false },
                globals: { foo: true}
            });
        });

        describe("plugins", function() {
            var baseConfig;

            beforeEach(function() {
                baseConfig = { plugins: ["foo", "bar"] };
            });

            it("should combine the plugin entries when each config has different plugins", function() {
                var customConfig = { plugins: ["baz"] },
                    expectedResult = { plugins: ["foo", "bar", "baz"] },
                    result;

                result = util.mergeConfigs(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
                assert.deepEqual(baseConfig, { plugins: ["foo", "bar"] });
                assert.deepEqual(customConfig, { plugins: ["baz"] });
            });

            it("should avoid duplicate plugin entries when each config has the same plugin", function() {
                var customConfig = { plugins: ["bar"] },
                    expectedResult = { plugins: ["foo", "bar"] },
                    result;

                result = util.mergeConfigs(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
            });

            it("should create a valid config when one argument is an empty object", function() {
                var customConfig = { plugins: ["foo"] },
                    result;

                result = util.mergeConfigs({}, customConfig);

                assert.deepEqual(result, customConfig);
                assert.notEqual(result, customConfig);
            });
        });


    });

});
