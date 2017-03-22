/**
 * @fileoverview Tests for config validator.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    eslint = require("../../../lib/eslint"),
    validator = require("../../../lib/config/config-validator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Fake a rule object
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockRule.schema = [
    {
        enum: ["first", "second"]
    }
];

/**
 * Fake a rule object
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockObjectRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockObjectRule.schema = {
    enum: ["first", "second"]
};

/**
 * Fake a rule with no options
 * @param {Object} context context passed to the rules by eslint
 * @returns {Object} mocked rule listeners
 * @private
 */
function mockNoOptionsRule(context) {
    return {
        Program(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockNoOptionsRule.schema = [];

const mockRequiredOptionsRule = {
    meta: {
        schema: {
            type: "array",
            minItems: 1
        }
    },
    create(context) {
        return {
            Program(node) {
                context.report(node, "Expected a validation error.");
            }
        };
    }
};

describe("Validator", () => {

    beforeEach(() => {
        eslint.defineRule("mock-rule", mockRule);
        eslint.defineRule("mock-required-options-rule", mockRequiredOptionsRule);
    });

    describe("validate", () => {

        it("should do nothing with an empty config", () => {
            const fn = validator.validate.bind(null, {}, "tests");

            assert.doesNotThrow(fn);
        });

        it("should do nothing with a valid eslint config", () => {
            const fn = validator.validate.bind(null,
                {
                    root: true,
                    globals: { globalFoo: "bar" },
                    parser: "parserFoo",
                    env: { browser: true },
                    plugins: ["pluginFoo", "pluginBar"],
                    settings: { foo: "bar" },
                    extends: ["configFoo", "configBar"],
                    parserOptions: { foo: "bar" },
                    rules: {}
                },
                "tests");

            assert.doesNotThrow(fn);
        });

        it("should throw with an unknown property", () => {
            const fn = validator.validate.bind(null,
                {
                    foo: true
                },
                "tests");

            assert.throws(fn, "Property \"data\" has additional properties. Current value is: `\"data.foo\"`.");
        });

        describe("root", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { root: "true" });

                assert.throws(fn, "Property \"root\" is the wrong type. Current value is: `\"true\"`");
            });

            it("should throw with a numeric value", () => {
                const fn = validator.validate.bind(null, { root: 0 });

                assert.throws(fn, "Property \"root\" is the wrong type. Current value is: `0`");
            });
        });

        describe("globals", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { globals: "jQuery" });

                assert.throws(fn, "Property \"globals\" is the wrong type. Current value is: `\"jQuery\"`");
            });

            it("should throw with an array value", () => {
                const fn = validator.validate.bind(null, { globals: ["jQuery"] });

                assert.throws(fn, "Property \"globals\" is the wrong type. Current value is: `[\"jQuery\"]`");
            });
        });

        describe("parser", () => {
            it("should not throw with a null value", () => {
                const fn = validator.validate.bind(null, { parser: null });

                assert.doesNotThrow(fn);
            });
        });

        describe("env", () => {

            it("should throw with an array environment", () => {
                const fn = validator.validate.bind(null, { env: [] });

                assert.throws(fn, "Property \"env\" is the wrong type. Current value is: `[]`");
            });

            it("should throw with a primitive environment", () => {
                const fn = validator.validate.bind(null, { env: 1 });

                assert.throws(fn, "Property \"env\" is the wrong type. Current value is: `1`");
            });

            it("should catch invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: true } });

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should catch disabled invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: false } });

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should do nothing with an undefined environment", () => {
                const fn = validator.validate.bind(null, {});

                assert.doesNotThrow(fn);
            });

        });

        describe("plugins", () => {
            it("should not throw with an empty array", () => {
                const fn = validator.validate.bind(null, { plugins: [] });

                assert.doesNotThrow(fn);
            });

            it("should throw with a string", () => {
                const fn = validator.validate.bind(null, { plugins: "react" });

                assert.throws(fn, "Property \"plugins\" is the wrong type. Current value is: `\"react\"`");
            });
        });

        describe("settings", () => {
            it("should not throw with an empty object", () => {
                const fn = validator.validate.bind(null, { settings: {} });

                assert.doesNotThrow(fn);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { settings: ["foo"] });

                assert.throws(fn, "Property \"settings\" is the wrong type. Current value is: `[\"foo\"]");
            });
        });

        describe("extends", () => {
            it("should not throw with an empty array", () => {
                const fn = validator.validate.bind(null, { extends: [] });

                assert.doesNotThrow(fn);
            });

            it("should not throw with a string", () => {
                const fn = validator.validate.bind(null, { extends: "react" });

                assert.doesNotThrow(fn);
            });

            it("should throw with an object", () => {
                const fn = validator.validate.bind(null, { extends: {} });

                assert.throws(fn, "Property \"extends\" is the wrong type. Current value is: `{}`");
            });
        });

        describe("parserOptions", () => {
            it("should not throw with an empty object", () => {
                const fn = validator.validate.bind(null, { parserOptions: {} });

                assert.doesNotThrow(fn);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { parserOptions: ["foo"] });

                assert.throws(fn, "Property \"parserOptions\" is the wrong type. Current value is: `[\"foo\"]`");
            });
        });

        describe("rules", () => {

            it("should do nothing with an empty rules object", () => {
                const fn = validator.validate.bind(null, { rules: {} }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config with rules", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": [2, "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is off", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["off", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with an invalid config when severity is off", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-required-options-rule": "off" } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with an invalid config when severity is an array with 'off'", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-required-options-rule": ["off"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is warn", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["warn", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is error", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["error", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is Off", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["Off", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is Warn", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["Warn", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should do nothing with a valid config when severity is Error", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": ["Error", "second"] } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should catch invalid rule options", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": [3, "third"] } }, "tests");

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
            });

            it("should allow for rules with no options", () => {
                eslint.defineRule("mock-no-options-rule", mockNoOptionsRule);

                const fn = validator.validate.bind(null, { rules: { "mock-no-options-rule": 2 } }, "tests");

                assert.doesNotThrow(fn);
            });

            it("should not allow options for rules with no options", () => {
                eslint.defineRule("mock-no-options-rule", mockNoOptionsRule);

                const fn = validator.validate.bind(null, { rules: { "mock-no-options-rule": [2, "extra"] } }, "tests");

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-no-options-rule\" is invalid:\n\tValue \"extra\" has more items than allowed.\n");
            });
        });

    });

    describe("getRuleOptionsSchema", () => {

        it("should return null for a missing rule", () => {
            assert.equal(validator.getRuleOptionsSchema("non-existent-rule"), null);
        });

        it("should not modify object schema", () => {
            eslint.defineRule("mock-object-rule", mockObjectRule);
            assert.deepEqual(validator.getRuleOptionsSchema("mock-object-rule"), {
                enum: ["first", "second"]
            });
        });

    });

    describe("validateRuleOptions", () => {

        it("should throw for incorrect warning level number", () => {
            const fn = validator.validateRuleOptions.bind(null, "mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect warning level string", () => {
            const fn = validator.validateRuleOptions.bind(null, "mock-rule", "booya", "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '\"booya\"').\n");
        });

        it("should throw for invalid-type warning level", () => {
            const fn = validator.validateRuleOptions.bind(null, "mock-rule", [["error"]], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '[ \"error\" ]').\n");
        });

        it("should only check warning level for nonexistent rules", () => {
            const fn = validator.validateRuleOptions.bind(null, "non-existent-rule", [3, "foobar"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"non-existent-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should only check warning level for plugin rules", () => {
            const fn = validator.validateRuleOptions.bind(null, "plugin/rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"plugin/rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, "mock-rule", [2, "frist"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"frist\" must be an enum value.\n");
        });

        it("should throw for too many configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, "mock-rule", [2, "first", "second"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"first,second\" has more items than allowed.\n");
        });

    });

});
