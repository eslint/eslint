/**
 * @fileoverview Tests for ConfigOps
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    environments = require("../../../conf/environments"),
    ConfigOps = require("../../../lib/config/config-ops");

const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigOps", function() {

    describe("applyEnvironments()", function() {
        it("should apply environment settings to config without destroying original settings", function() {
            const config = {
                env: {
                    node: true
                },
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config);

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
            const config = {
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config);

            assert.equal(result, config);
        });

        it("should apply multiple environment settings to config without destroying original settings", function() {
            const config = {
                env: {
                    node: true,
                    es6: true
                },
                rules: {
                    foo: 2
                }
            };

            const result = ConfigOps.applyEnvironments(config);

            assert.deepEqual(result, {
                env: config.env,
                rules: config.rules,
                parserOptions: {
                    ecmaVersion: 6,
                    ecmaFeatures: environments.node.parserOptions.ecmaFeatures
                },
                globals: Object.assign({}, environments.node.globals, environments.es6.globals)
            });
        });
    });

    describe("createEnvironmentConfig()", function() {

        it("should return empty config if called without any config", function() {
            const config = ConfigOps.createEnvironmentConfig(null);

            assert.deepEqual(config, {
                globals: {},
                env: {},
                rules: {},
                parserOptions: {}
            });
        });

        it("should return correct config for env with no globals", function() {
            const StubbedConfigOps = proxyquire("../../../lib/config/config-ops", {
                "./environments": {
                    get: function() {
                        return {
                            parserOptions: {
                                sourceType: "module"
                            }
                        };
                    }
                }
            });

            const config = StubbedConfigOps.createEnvironmentConfig({ test: true });

            assert.deepEqual(config, {
                globals: {},
                env: {
                    test: true
                },
                rules: {},
                parserOptions: {
                    sourceType: "module"
                }
            });
        });

        it("should create the correct config for Node.js environment", function() {
            const config = ConfigOps.createEnvironmentConfig({ node: true });

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
            const config = ConfigOps.createEnvironmentConfig({ es6: true });

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
            const config = ConfigOps.createEnvironmentConfig({});

            assert.deepEqual(config, {
                env: {},
                parserOptions: {},
                globals: {},
                rules: {}
            });
        });

        it("should create empty config when an unknown environment is specified", function() {
            const config = ConfigOps.createEnvironmentConfig({ foo: true });

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
            const config = [
                { env: { browser: true } },
                { globals: { foo: "bar"} }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.globals.foo, "bar");
            assert.isTrue(result.env.browser);
        });

        it("should combine without blowing up on null values", function() {
            const config = [
                { env: { browser: true } },
                { env: { node: null } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.env.node, null);
            assert.isTrue(result.env.browser);
        });

        it("should combine two objects with parser when passed two objects with different top-level properties", function() {
            const config = [
                { env: { browser: true }, parser: "espree" },
                { globals: { foo: "bar"} }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.equal(result.parser, "espree");
        });

        it("should combine configs and override rules when passed configs with the same rules", function() {
            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with parserOptions", function() {
            const config = [
                { parserOptions: { ecmaFeatures: { blockBindings: true } } },
                { parserOptions: { ecmaFeatures: { forOf: true } } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

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
            const config = [
                { parserOptions: { ecmaFeatures: { forOf: false } } },
                { parserOptions: { ecmaFeatures: { forOf: true } } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.deepEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        forOf: true
                    }
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", function() {

            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.equal(result.rules["no-mixed-requires"][0], 1);
            assert.equal(result.rules["no-mixed-requires"][1], false);
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [0, false] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": 1 }});
        });

        it("should combine configs and override rules options completely", function() {

            const config = [
                { rules: { "no-mixed-requires": [1, { event: ["evt", "e"] }] } },
                { rules: { "no-mixed-requires": [1, { err: ["error", "e"] }] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.deepEqual(result.rules["no-mixed-requires"][1], {err: ["error", "e"]});
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [1, {event: ["evt", "e"]}] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": [1, {err: ["error", "e"]}] }});
        });

        it("should combine configs and override rules options without array or object", function() {

            const config = [
                { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": [2, "requirejs"] } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires"][1], "requirejs");
            assert.isUndefined(result.rules["no-mixed-requires"][2]);
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": [2, "requirejs"] }});
        });

        it("should combine configs and override rules options without array or object but special case", function() {

            const config = [
                { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": "error" } }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], "error");
            assert.strictEqual(result.rules["no-mixed-requires"][1], "nconf");
            assert.strictEqual(result.rules["no-mixed-requires"][2], "underscore");
            assert.deepEqual(config[0], { rules: { "no-mixed-requires": [1, "nconf", "underscore"] }});
            assert.deepEqual(config[1], { rules: { "no-mixed-requires": "error" }});
        });

        it("should combine configs correctly", function() {

            const config = [
                {
                    rules: {
                        "no-mixed-requires": [1, { event: ["evt", "e"] }],
                        "valid-jsdoc": 1,
                        semi: 1,
                        quotes: [2, { exception: ["hi"] }],
                        smile: [1, ["hi", "bye"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { blockBindings: true }
                    },
                    env: { browser: true },
                    globals: { foo: false}
                },
                {
                    rules: {
                        "no-mixed-requires": [1, { err: ["error", "e"] }],
                        "valid-jsdoc": 2,
                        test: 1,
                        smile: [1, ["xxx", "yyy"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { forOf: true }
                    },
                    env: { browser: false },
                    globals: { foo: true}
                }
            ];

            const result = ConfigOps.merge(config[0], config[1]);

            assert.deepEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        blockBindings: true,
                        forOf: true
                    }
                },
                env: {
                    browser: false
                },
                globals: {
                    foo: true
                },
                rules: {
                    "no-mixed-requires": [1,
                        {
                            err: [
                                "error",
                                "e"
                            ]
                        }
                    ],
                    quotes: [2,
                        {
                            exception: [
                                "hi"
                            ]
                        }
                    ],
                    semi: 1,
                    smile: [1, ["xxx", "yyy"]],
                    test: 1,
                    "valid-jsdoc": 2
                }
            });
            assert.deepEqual(config[0], {
                rules: {
                    "no-mixed-requires": [1, { event: ["evt", "e"] }],
                    "valid-jsdoc": 1,
                    semi: 1,
                    quotes: [2, { exception: ["hi"] }],
                    smile: [1, ["hi", "bye"]]
                },
                parserOptions: {
                    ecmaFeatures: { blockBindings: true }
                },
                env: { browser: true },
                globals: { foo: false}
            });
            assert.deepEqual(config[1], {
                rules: {
                    "no-mixed-requires": [1, { err: ["error", "e"] }],
                    "valid-jsdoc": 2,
                    test: 1,
                    smile: [1, ["xxx", "yyy"]]
                },
                parserOptions: {
                    ecmaFeatures: { forOf: true }
                },
                env: { browser: false },
                globals: { foo: true }
            });
        });

        it("should copy deeply if there is not the destination's property", function() {
            const a = {};
            const b = {foo: {bar: 1}};

            const result = ConfigOps.merge(a, b);

            assert(a.foo === void 0);
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 1);

            result.foo.bar = 2;
            assert(b.foo.bar === 1);
            assert(result.foo.bar === 2);
        });

        describe("plugins", function() {
            let baseConfig;

            beforeEach(function() {
                baseConfig = { plugins: ["foo", "bar"] };
            });

            it("should combine the plugin entries when each config has different plugins", function() {
                const customConfig = { plugins: ["baz"] },
                    expectedResult = { plugins: ["foo", "bar", "baz"] },
                    result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
                assert.deepEqual(baseConfig, { plugins: ["foo", "bar"] });
                assert.deepEqual(customConfig, { plugins: ["baz"] });
            });

            it("should avoid duplicate plugin entries when each config has the same plugin", function() {
                const customConfig = { plugins: ["bar"] },
                    expectedResult = { plugins: ["foo", "bar"] },
                    result = ConfigOps.merge(baseConfig, customConfig);

                assert.deepEqual(result, expectedResult);
            });

            it("should create a valid config when one argument is an empty object", function() {
                const customConfig = { plugins: ["foo"] },
                    result = ConfigOps.merge({}, customConfig);

                assert.deepEqual(result, customConfig);
                assert.notEqual(result, customConfig);
            });
        });


    });

    describe("normalize()", function() {
        it("should convert error rule setting to 2 when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: "errOr",
                    bar: "error"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: 2,
                    bar: 2
                }
            });
        });

        it("should convert error rule setting to 2 when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: ["Error", "something"],
                    bar: "error"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: [2, "something"],
                    bar: 2
                }
            });
        });

        it("should convert warn rule setting to 1 when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: "waRn",
                    bar: "warn"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: 1,
                    bar: 1
                }
            });
        });

        it("should convert warn rule setting to 1 when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: ["Warn", "something"],
                    bar: "warn"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: [1, "something"],
                    bar: 1
                }
            });
        });

        it("should convert off rule setting to 0 when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: "ofF",
                    bar: "off"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: 0,
                    bar: 0
                }
            });
        });

        it("should convert off rule setting to 0 when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: ["Off", "something"],
                    bar: "off"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: [0, "something"],
                    bar: 0
                }
            });
        });

        it("should convert invalid rule setting to 0 when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: "invalid",
                    bar: "invalid"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: 0,
                    bar: 0
                }
            });
        });

        it("should convert invalid rule setting to 0 when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: ["invalid", "something"],
                    bar: "invalid"
                }
            };

            ConfigOps.normalize(config);

            assert.deepEqual(config, {
                rules: {
                    foo: [0, "something"],
                    bar: 0
                }
            });
        });
    });

    describe("normalizeToStrings()", function() {
        it("should convert 2 rule setting to error when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: 2,
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: "error",
                    bar: "error"
                }
            });
        });

        it("should convert 2 rule setting to error when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: [2, "something"],
                    bar: 2
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: ["error", "something"],
                    bar: "error"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: 1,
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: "warn",
                    bar: "warn"
                }
            });
        });

        it("should convert 1 rule setting to warn when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: [1, "something"],
                    bar: 1
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: ["warn", "something"],
                    bar: "warn"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: 0,
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 0 rule setting to off when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: [0, "something"],
                    bar: 0
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has just a severity", function() {
            const config = {
                rules: {
                    foo: 256,
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: "off",
                    bar: "off"
                }
            });
        });

        it("should convert 256 rule setting to off when rule has array with severity", function() {
            const config = {
                rules: {
                    foo: [256, "something"],
                    bar: 256
                }
            };

            ConfigOps.normalizeToStrings(config);

            assert.deepEqual(config, {
                rules: {
                    foo: ["off", "something"],
                    bar: "off"
                }
            });
        });
    });

    describe("isError()", function() {

        leche.withData([
            ["error", true],
            ["Error", true],
            [2, true],
            [["error"], true],
            [["erRor"], true],
            [[2], true],
            [["error", "foo"], true],
            [["eRror", "bar"], true],
            [[2, "baz"], true]
        ], function(input, expected) {

            it("should return " + expected + "when passed " + input, function() {
                const result = ConfigOps.isErrorSeverity(input);

                assert.equal(result, expected);
            });

        });

    });

});
