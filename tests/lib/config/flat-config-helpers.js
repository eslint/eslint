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
const ajv = require("../../../lib/shared/ajv")({ missingRefs: "fail" });

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

        describe("Supports $ref in schema", () => {

            it("should allow internal $refs to work", () => {

                const schemas = [{

                    type: "object",
                    properties: {
                        foo: { $ref: "#/definitions/someNamedEnum" }
                    },

                    definitions: {
                        someNamedEnum: { enum: [0] }
                    }
                }];

                const resultSchema = getRuleOptionsSchema({ schema: schemas });

                assert.isTrue(ajv.validateSchema(resultSchema), "schema is valid");

                const verifier = ajv.compile(resultSchema);

                assert.isTrue(verifier([{ foo: 0 }]), "accepts valid data");
                assert.isFalse(verifier([{ foo: 1 }]), "rejects invalid data [{ foo: 1 }]");
            });

            it("should allow $refs to other arguments", () => {

                const schemas = [
                    { enum: [0] },
                    {
                        type: "object",
                        properties: {
                            foo: { $ref: "/0" }
                        }
                    }
                ];

                const resultSchema = getRuleOptionsSchema({ schema: schemas });

                assert.isTrue(ajv.validateSchema(resultSchema), "schema is valid");

                const verifier = ajv.compile(resultSchema);

                assert.isTrue(verifier([0, { foo: 0 }]), "accepts valid data");
                assert.isFalse(verifier([0, { foo: 1 }]), "rejects invalid data [0, { foo: 1 }]");
                assert.isFalse(verifier([1, { foo: 0 }]), "rejects invalid data [1, { foo: 0 }]");
                assert.isFalse(verifier([1, { foo: 1 }]), "rejects invalid data [1, { foo: 1 }]");
            });

            it("should allow $refs to other arguments with explicit $id", () => {

                const schemas = [
                    {
                        $id: "http://someotherthing.com/schema/blah",
                        enum: [0]
                    },
                    {
                        type: "object",
                        properties: {
                            foo: { $ref: "http://someotherthing.com/schema/blah" }
                        }
                    }
                ];

                const resultSchema = getRuleOptionsSchema({ schema: schemas });

                assert.isTrue(ajv.validateSchema(resultSchema), "schema is valid");

                const verifier = ajv.compile(resultSchema);

                assert.isTrue(verifier([0, { foo: 0 }]), "accepts valid data");
                assert.isFalse(verifier([0, { foo: 1 }]), "rejects invalid data [0, { foo: 1 }]");
                assert.isFalse(verifier([1, { foo: 0 }]), "rejects invalid data [1, { foo: 0 }]");
                assert.isFalse(verifier([1, { foo: 1 }]), "rejects invalid data [1, { foo: 1 }]");
            });
        });
    });

});
