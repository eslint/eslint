/**
 * @fileoverview Tests for FlatConfigArray
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const {
    parseRuleId,
    getRuleFromConfig,
    getRuleOptionsSchema
} = require("../../../lib/config/flat-config-helpers");
const assert = require("chai").assert;

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Config Helpers", () => {


    describe("parseRuleId()", () => {

        it("should return plugin name and rule name for core rule", () => {
            const result = parseRuleId("foo");

            assert.deepStrictEqual(result, {
                pluginName: "@",
                ruleName: "foo"
            });
        });

        it("should return plugin name and rule name with a/b format", () => {
            const result = parseRuleId("test/foo");

            assert.deepStrictEqual(result, {
                pluginName: "test",
                ruleName: "foo"
            });
        });

        it("should return plugin name and rule name with a/b/c format", () => {
            const result = parseRuleId("node/no-unsupported-features/es-builtins");

            assert.deepStrictEqual(result, {
                pluginName: "node",
                ruleName: "no-unsupported-features/es-builtins"
            });
        });

        it("should return plugin name and rule name with @a/b/c format", () => {
            const result = parseRuleId("@test/foo/bar");

            assert.deepStrictEqual(result, {
                pluginName: "@test/foo",
                ruleName: "bar"
            });
        });
    });

    describe("getRuleFromConfig", () => {
        it("should retrieve rule from plugin in config", () => {
            const rule = {};
            const config = {
                plugins: {
                    test: {
                        rules: {
                            one: rule
                        }
                    }
                }
            };

            const result = getRuleFromConfig("test/one", config);

            assert.strictEqual(result, rule);

        });

        it("should retrieve rule from core in config", () => {
            const rule = {};
            const config = {
                plugins: {
                    "@": {
                        rules: {
                            semi: rule
                        }
                    }
                }
            };

            const result = getRuleFromConfig("semi", config);

            assert.strictEqual(result, rule);

        });
    });

    describe("getRuleOptionsSchema", () => {
        const noOptionsSchema = {
            type: "array",
            minItems: 0,
            maxItems: 0
        };

        it("should return schema that doesn't accept options if rule doesn't have `meta`", () => {
            const rule = {};
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if rule doesn't have `meta.schema`", () => {
            const rule = { meta: {} };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if `meta.schema` is `undefined`", () => {
            const rule = { meta: { schema: void 0 } };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return schema that doesn't accept options if `meta.schema` is `[]`", () => {
            const rule = { meta: { schema: [] } };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });

        it("should return JSON Schema definition object if `meta.schema` is in the array form", () => {
            const firstOption = { enum: ["always", "never"] };
            const rule = { meta: { schema: [firstOption] } };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(
                result,
                {
                    type: "array",
                    items: [firstOption],
                    minItems: 0,
                    maxItems: 1
                }
            );
        });

        it("should return `meta.schema` as is if `meta.schema` is an object", () => {
            const schema = {
                type: "array",
                items: [{
                    enum: ["always", "never"]
                }]
            };
            const rule = { meta: { schema } };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, schema);
        });

        it("should return `null` if `meta.schema` is `false`", () => {
            const rule = { meta: { schema: false } };
            const result = getRuleOptionsSchema(rule);

            assert.strictEqual(result, null);
        });

        [null, true, 0, 1, "", "always", () => {}].forEach(schema => {
            it(`should throw an error if \`meta.schema\` is ${typeof schema} ${schema}`, () => {
                const rule = { meta: { schema } };

                assert.throws(() => {
                    getRuleOptionsSchema(rule);
                }, "Rule's `meta.schema` must be an array or object");
            });
        });

        it("should ignore top-level `schema` property", () => {
            const rule = { schema: { enum: ["always", "never"] } };
            const result = getRuleOptionsSchema(rule);

            assert.deepStrictEqual(result, noOptionsSchema);
        });
    });

});
