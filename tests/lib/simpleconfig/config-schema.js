/**
 * @fileoverview Tests for ConfigSchema
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    leche = require("leche"),
    util = require("util"),
    schema = require("../../../lib/simpleconfig/config-schema");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ConfigSchema", () => {

    describe("merge()", () => {

        it("should combine configs and override rules when passed configs with the same rules", () => {
            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": [1, true] } }
            ];

            const result = schema.merge(config[0], config[1]);
            console.dir(result);
            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], true);
        });

        it("should combine configs when passed configs with parserOptions", () => {
            const config = [
                { parserOptions: { ecmaFeatures: { jsx: true } } },
                { parserOptions: { ecmaFeatures: { globalReturn: true } } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
                }
            });

            // double-check that originals were not changed
            assert.deepStrictEqual(config[0], { parserOptions: { ecmaFeatures: { jsx: true } } });
            assert.deepStrictEqual(config[1], { parserOptions: { ecmaFeatures: { globalReturn: true } } });
        });

        it("should override configs when passed configs with the same ecmaFeatures", () => {
            const config = [
                { parserOptions: { ecmaFeatures: { globalReturn: false } } },
                { parserOptions: { ecmaFeatures: { globalReturn: true } } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        globalReturn: true
                    }
                }
            });
        });

        it("should combine configs and override rules when merging two configs with arrays and int", () => {

            const config = [
                { rules: { "no-mixed-requires": [0, false] } },
                { rules: { "no-mixed-requires": 1 } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.strictEqual(result.rules["no-mixed-requires"][0], 1);
            assert.strictEqual(result.rules["no-mixed-requires"][1], false);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [0, false] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": 1 } });
        });

        it("should combine configs and override rules options completely", () => {

            const config = [
                { rules: { "no-mixed-requires": [1, { event: ["evt", "e"] }] } },
                { rules: { "no-mixed-requires": [1, { err: ["error", "e"] }] } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.isArray(result.rules["no-mixed-requires"]);
            assert.deepStrictEqual(result.rules["no-mixed-requires"][1], { err: ["error", "e"] });
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [1, { event: ["evt", "e"] }] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": [1, { err: ["error", "e"] }] } });
        });

        it("should combine configs and override rules options without array or object", () => {

            const config = [
                { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": [2, "requirejs"] } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], 2);
            assert.strictEqual(result.rules["no-mixed-requires"][1], "requirejs");
            assert.isUndefined(result.rules["no-mixed-requires"][2]);
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": ["warn", "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": [2, "requirejs"] } });
        });

        it("should combine configs and override rules options without array or object but special case", () => {

            const config = [
                { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } },
                { rules: { "no-mixed-requires": "error" } }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.strictEqual(result.rules["no-mixed-requires"][0], "error");
            assert.strictEqual(result.rules["no-mixed-requires"][1], "nconf");
            assert.strictEqual(result.rules["no-mixed-requires"][2], "underscore");
            assert.deepStrictEqual(config[0], { rules: { "no-mixed-requires": [1, "nconf", "underscore"] } });
            assert.deepStrictEqual(config[1], { rules: { "no-mixed-requires": "error" } });
        });


        it("should combine configs correctly", () => {

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
                        ecmaFeatures: { jsx: true }
                    },
                    globals: { foo: false }
                },
                {
                    rules: {
                        "no-mixed-requires": [1, { err: ["error", "e"] }],
                        "valid-jsdoc": 2,
                        test: 1,
                        smile: [1, ["xxx", "yyy"]]
                    },
                    parserOptions: {
                        ecmaFeatures: { globalReturn: true }
                    },
                    globals: { foo: true }
                }
            ];

            const result = schema.merge(config[0], config[1]);

            assert.deepStrictEqual(result, {
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    }
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
            assert.deepStrictEqual(config[0], {
                rules: {
                    "no-mixed-requires": [1, { event: ["evt", "e"] }],
                    "valid-jsdoc": 1,
                    semi: 1,
                    quotes: [2, { exception: ["hi"] }],
                    smile: [1, ["hi", "bye"]]
                },
                parserOptions: {
                    ecmaFeatures: { jsx: true }
                },
                globals: { foo: false }
            });
            assert.deepStrictEqual(config[1], {
                rules: {
                    "no-mixed-requires": [1, { err: ["error", "e"] }],
                    "valid-jsdoc": 2,
                    test: 1,
                    smile: [1, ["xxx", "yyy"]]
                },
                parserOptions: {
                    ecmaFeatures: { globalReturn: true }
                },
                globals: { foo: true }
            });
        });

    });

});
