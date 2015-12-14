/**
 * @fileoverview Tests for ConfigOps
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    assign = require("object-assign"),
    environments = require("../../../conf/environments"),
    ConfigOps = require("../../../lib/config/config-ops");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigOps", function() {

    describe("applyEnvironments()", function() {
        it("should apply environment settings to config without destroying original settings", function() {
            var config = {
                env: {
                    node: true
                },
                rules: {
                    foo: 2
                }
            };

            var result = ConfigOps.applyEnvironments(config);

            assert.deepEqual(result, {
                env: config.env,
                rules: config.rules,
                parserOptions: {
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: environments.node.globals
            });
        });

        it("should not apply environment settings to config without environments", function() {
            var config = {
                rules: {
                    foo: 2
                }
            };

            var result = ConfigOps.applyEnvironments(config);

            assert.equal(result, config);
        });

        it("should apply multiple environment settings to config without destroying original settings", function() {
            var config = {
                env: {
                    node: true,
                    es6: true
                },
                rules: {
                    foo: 2
                }
            };

            var result = ConfigOps.applyEnvironments(config);

            assert.deepEqual(result, {
                env: config.env,
                rules: config.rules,
                parserOptions: {
                    ecmaVersion: 6,
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: assign({}, environments.node.globals, environments.es6.globals)
            });
        });
    });

    describe("createEnvironmentConfig()", function() {

        it("should create the correct config for Node.js environment", function() {
            var config = ConfigOps.createEnvironmentConfig({ node: true });
            assert.deepEqual(config, {
                env: {
                    node: true
                },
                parserOptions: {
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: environments.node.globals,
                rules: {}
            });
        });

        it("should create the correct config for ES6 environment", function() {
            var config = ConfigOps.createEnvironmentConfig({ es6: true });
            assert.deepEqual(config, {
                env: {
                    es6: true
                },
                parserOptions: {
                    ecmaVersion: 6
                },
                globals: environments.es6.globals,
                rules: {}
            });
        });

        it("should create empty config when no environments are specified", function() {
            var config = ConfigOps.createEnvironmentConfig({});
            assert.deepEqual(config, {
                env: {},
                parserOptions: {},
                globals: {},
                rules: {}
            });
        });

        it("should create empty config when an unknown environment is specified", function() {
            var config = ConfigOps.createEnvironmentConfig({ foo: true });
            assert.deepEqual(config, {
                env: {
                    foo: true
                },
                parserOptions: {},
                globals: {},
                rules: {}
            });
        });

    });

    describe("merge()", function() {

        it("should combine two objects when passed two objects with different top-level properties", function() {
            var config = [
                { env: { browser: true } },
                { globals: { foo: "bar"} }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine without blowing up on null values", function() {
            var config = [
                { env: { browser: true } },
                { env: { node: null } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.env.node, null);
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", function() {
            var config = [
                { env: { browser: true }, parser: "espree" },
                { globals: { foo: "bar"} }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", function() {
            var config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with parserOptions", function() {
            var config = [
                { parserOptions: { ecmaFeatures: { blockBindings: true } } },
                { parserOptions: { ecmaFeatures: { forOf: true } } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.deepEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        blockBindings: true,
                        forOf: true
                    }
                }
            });

            // double-check that originals were not changed
            assert.deepEqual(config[0], { parserOptions: { ecmaFeatures: { blockBindings: true }}});
            assert.deepEqual(config[1], { parserOptions: { ecmaFeatures: { forOf: true }}});
        });

        it("should override configs when passed configs with the same ecmaFeatures", function() {
            var config = [
                { parserOptions: { ecmaFeatures: { forOf: false } } },
                { parserOptions: { ecmaFeatures: { forOf: true } } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.deepEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        forOf: true
                    }
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", function() {

            var config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [0, false] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": 1 }});
        });

        it("should combine configs and override rules options completely", function() {

            var config = [
                { rules: { "no-mixed-requires": [1, { "event": ["evt", "e"] }] } },
                { rules: { "no-mixed-requires": [1, { "err": ["error", "e"] }] } }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

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

            var result = ConfigOps.merge(config[0], config[1]);

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

            var result = ConfigOps.merge(config[0], config[1]);

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
                        "no-mixed-requires": [1, { "event": ["evt", "e"] }],
                        "valid-jsdoc": 1,
                        "semi": 1,
                        "quotes": [2, { "exception": ["hi"] }],
                        "smile": [1, ["hi", "bye"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { blockBindings: true }
                    },
                    env: { browser: true },
                    globals: { foo: false}
                },
                {
                    rules: {
                        "no-mixed-requires": [1, { "err": ["error", "e"] }],
                        "valid-jsdoc": 2,
                        "test": 1,
                        "smile": [1, ["xxx", "yyy"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { forOf: true }
                    },
                    env: { browser: false },
                    globals: { foo: true}
                }
            ];

            var result = ConfigOps.merge(config[0], config[1]);

            assert.deepEqual(result, {
                parserOptions: {
                    "ecmaFeatures": {
                        "blockBindings": true,
                        "forOf": true
                    }
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
                    "no-mixed-requires": [1, { "event": ["evt", "e"] }],
                    "valid-jsdoc": 1,
                    "semi": 1,
                    "quotes": [2, { "exception": ["hi"] }],
                    "smile": [1, ["hi", "bye"]]
                },
                parserOptions: {
                    ecmaFeatures: { blockBindings: true }
                },
                env: { browser: true },
                globals: { foo: false}
            });
            assert.deepEqual(config[1], {
                rules: {
                    "no-mixed-requires": [1, { "err": ["error", "e"] }],
                    "valid-jsdoc": 2,
                    "test": 1,
                    "smile": [1, ["xxx", "yyy"]]
                },
                parserOptions: {
                    ecmaFeatures: { forOf: true }
                },
                env: { browser: false },
                globals: { foo: true }
            });
        });

        it("should copy deeply if there is not the destination's property", function() {
            var a = {};
            var b = {foo: {bar: 1}};

            var result = ConfigOps.merge(a, b);
            assert(a.foo === void 0);
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 1);

            result.foo.bar = 2;
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 2);
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

                result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
                assert.deepEqual(baseConfig, { plugins: ["foo", "bar"] });
                assert.deepEqual(customConfig, { plugins: ["baz"] });
            });

            it("should avoid duplicate plugin entries when each config has the same plugin", function() {
                var customConfig = { plugins: ["bar"] },
                    expectedResult = { plugins: ["foo", "bar"] },
                    result;

                result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
            });

            it("should create a valid config when one argument is an empty object", function() {
                var customConfig = { plugins: ["foo"] },
                    result;

                result = ConfigOps.merge({}, customConfig);

                assert.deepEqual(result, customConfig);
                assert.notEqual(result, customConfig);
            });
        });


    });

});
