/*
 * STOP!!! DO NOT MODIFY.
 *
 * This file is part of the ongoing work to move the eslintrc-style config
 * system into the @eslint/eslintrc package. This file needs to remain
 * unchanged in order for this work to proceed.
 *
 * If you think you need to change this file, please contact @nzakas first.
 *
 * Thanks in advance for your cooperation.
 */

/**
 * @fileoverview Tests for config validator.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    { Linter } = require("../../../lib/linter"),
    validator = require("../../../lib/shared/config-validator"),
    Rules = require("../../../lib/linter/rules");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const linter = new Linter();

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

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Validator", () => {

    /**
     * Gets a loaded rule given a rule ID
     * @param {string} ruleId The ID of the rule
     * @returns {{create: Function}} The loaded rule
     */
    function ruleMapper(ruleId) {
        return linter.getRules().get(ruleId) || new Rules().get(ruleId);
    }

    beforeEach(() => {
        linter.defineRule("mock-rule", mockRule);
        linter.defineRule("mock-required-options-rule", mockRequiredOptionsRule);
    });

    describe("validate", () => {

        it("should do nothing with an empty config", () => {
            validator.validate({}, "tests", ruleMapper);
        });

        it("should do nothing with a valid eslint config", () => {
            validator.validate(
                {
                    $schema: "http://json.schemastore.org/eslintrc",
                    root: true,
                    globals: { globalFoo: "readonly" },
                    parser: "parserFoo",
                    env: { browser: true },
                    plugins: ["pluginFoo", "pluginBar"],
                    settings: { foo: "bar" },
                    extends: ["configFoo", "configBar"],
                    parserOptions: { foo: "bar" },
                    rules: {}
                },
                "tests",
                ruleMapper
            );
        });

        it("should throw with an unknown property", () => {
            const fn = validator.validate.bind(
                null,
                {
                    foo: true
                },
                "tests",
                ruleMapper
            );

            assert.throws(fn, "Unexpected top-level property \"foo\".");
        });

        describe("root", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { root: "true" }, null, ruleMapper);

                assert.throws(fn, "Property \"root\" is the wrong type (expected boolean but got `\"true\"`).");
            });

            it("should throw with a numeric value", () => {
                const fn = validator.validate.bind(null, { root: 0 }, null, ruleMapper);

                assert.throws(fn, "Property \"root\" is the wrong type (expected boolean but got `0`).");
            });
        });

        describe("globals", () => {
            it("should throw with a string value", () => {
                const fn = validator.validate.bind(null, { globals: "jQuery" }, null, ruleMapper);

                assert.throws(fn, "Property \"globals\" is the wrong type (expected object but got `\"jQuery\"`).");
            });

            it("should throw with an array value", () => {
                const fn = validator.validate.bind(null, { globals: ["jQuery"] }, null, ruleMapper);

                assert.throws(fn, "Property \"globals\" is the wrong type (expected object but got `[\"jQuery\"]`).");
            });
        });

        describe("parser", () => {
            it("should not throw with a null value", () => {
                validator.validate({ parser: null }, null, ruleMapper);
            });
        });

        describe("env", () => {

            it("should throw with an array environment", () => {
                const fn = validator.validate.bind(null, { env: [] }, null, ruleMapper);

                assert.throws(fn, "Property \"env\" is the wrong type (expected object but got `[]`).");
            });

            it("should throw with a primitive environment", () => {
                const fn = validator.validate.bind(null, { env: 1 }, null, ruleMapper);

                assert.throws(fn, "Property \"env\" is the wrong type (expected object but got `1`).");
            });

            it("should catch invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: true } }, null, ruleMapper);

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should catch disabled invalid environments", () => {
                const fn = validator.validate.bind(null, { env: { browser: true, invalid: false } }, null, ruleMapper);

                assert.throws(fn, "Environment key \"invalid\" is unknown\n");
            });

            it("should do nothing with an undefined environment", () => {
                validator.validate({}, null, ruleMapper);
            });

        });

        describe("plugins", () => {
            it("should not throw with an empty array", () => {
                validator.validate({ plugins: [] }, null, ruleMapper);
            });

            it("should throw with a string", () => {
                const fn = validator.validate.bind(null, { plugins: "react" }, null, ruleMapper);

                assert.throws(fn, "Property \"plugins\" is the wrong type (expected array but got `\"react\"`).");
            });
        });

        describe("settings", () => {
            it("should not throw with an empty object", () => {
                validator.validate({ settings: {} }, null, ruleMapper);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { settings: ["foo"] }, null, ruleMapper);

                assert.throws(fn, "Property \"settings\" is the wrong type (expected object but got `[\"foo\"]`).");
            });
        });

        describe("extends", () => {
            it("should not throw with an empty array", () => {
                validator.validate({ extends: [] }, null, ruleMapper);
            });

            it("should not throw with a string", () => {
                validator.validate({ extends: "react" }, null, ruleMapper);
            });

            it("should throw with an object", () => {
                const fn = validator.validate.bind(null, { extends: {} }, null, ruleMapper);

                assert.throws(fn, "ESLint configuration in null is invalid:\n\t- Property \"extends\" is the wrong type (expected string but got `{}`).\n\t- Property \"extends\" is the wrong type (expected array but got `{}`).\n\t- \"extends\" should match exactly one schema in oneOf. Value: {}.");
            });
        });

        describe("parserOptions", () => {
            it("should not throw with an empty object", () => {
                validator.validate({ parserOptions: {} }, null, ruleMapper);
            });

            it("should throw with an array", () => {
                const fn = validator.validate.bind(null, { parserOptions: ["foo"] }, null, ruleMapper);

                assert.throws(fn, "Property \"parserOptions\" is the wrong type (expected object but got `[\"foo\"]`).");
            });
        });

        describe("rules", () => {

            it("should do nothing with an empty rules object", () => {
                validator.validate({ rules: {} }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config with rules", () => {
                validator.validate({ rules: { "mock-rule": [2, "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is off", () => {
                validator.validate({ rules: { "mock-rule": ["off", "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with an invalid config when severity is off", () => {
                validator.validate({ rules: { "mock-required-options-rule": "off" } }, "tests", ruleMapper);
            });

            it("should do nothing with an invalid config when severity is an array with 'off'", () => {
                validator.validate({ rules: { "mock-required-options-rule": ["off"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is warn", () => {
                validator.validate({ rules: { "mock-rule": ["warn", "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is error", () => {
                validator.validate({ rules: { "mock-rule": ["error", "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is Off", () => {
                validator.validate({ rules: { "mock-rule": ["Off", "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is Warn", () => {
                validator.validate({ rules: { "mock-rule": ["Warn", "second"] } }, "tests", ruleMapper);
            });

            it("should do nothing with a valid config when severity is Error", () => {
                validator.validate({ rules: { "mock-rule": ["Error", "second"] } }, "tests", ruleMapper);
            });

            it("should catch invalid rule options", () => {
                const fn = validator.validate.bind(null, { rules: { "mock-rule": [3, "third"] } }, "tests", ruleMapper);

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
            });

            it("should allow for rules with no options", () => {
                linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                validator.validate({ rules: { "mock-no-options-rule": 2 } }, "tests", ruleMapper);
            });

            it("should not allow options for rules with no options", () => {
                linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                const fn = validator.validate.bind(null, { rules: { "mock-no-options-rule": [2, "extra"] } }, "tests", ruleMapper);

                assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-no-options-rule\" is invalid:\n\tValue [\"extra\"] should NOT have more than 0 items.\n");
            });
        });

        describe("globals", () => {
            it("should disallow globals set to invalid values", () => {
                assert.throws(
                    () => validator.validate({ globals: { foo: "AAAAA" } }, "tests", ruleMapper),
                    "ESLint configuration of global 'foo' in tests is invalid:\n'AAAAA' is not a valid configuration for a global (use 'readonly', 'writable', or 'off')"
                );
            });
        });

        describe("overrides", () => {
            it("should not throw with an empty overrides array", () => {
                validator.validate({ overrides: [] }, "tests", ruleMapper);
            });

            it("should not throw with a valid overrides array", () => {
                validator.validate({ overrides: [{ files: "*", rules: {} }] }, "tests", ruleMapper);
            });

            it("should throw if override does not specify files", () => {
                const fn = validator.validate.bind(null, { overrides: [{ rules: {} }] }, "tests", ruleMapper);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- \"overrides[0]\" should have required property 'files'. Value: {\"rules\":{}}.\n");
            });

            it("should throw if override has an empty files array", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: [] }] }, "tests", ruleMapper);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Property \"overrides[0].files\" is the wrong type (expected string but got `[]`).\n\t- \"overrides[0].files\" should NOT have fewer than 1 items. Value: [].\n\t- \"overrides[0].files\" should match exactly one schema in oneOf. Value: [].\n");
            });

            it("should not throw if override has nested overrides", () => {
                validator.validate({ overrides: [{ files: "*", overrides: [{ files: "*", rules: {} }] }] }, "tests", ruleMapper);
            });

            it("should not throw if override extends", () => {
                validator.validate({ overrides: [{ files: "*", extends: "eslint-recommended" }] }, "tests", ruleMapper);
            });

            it("should throw if override tries to set root", () => {
                const fn = validator.validate.bind(null, { overrides: [{ files: "*", root: "true" }] }, "tests", ruleMapper);

                assert.throws(fn, "ESLint configuration in tests is invalid:\n\t- Unexpected top-level property \"overrides[0].root\".\n");
            });

            describe("env", () => {

                it("should catch invalid environments", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", env: { browser: true, invalid: true } }] }, null, ruleMapper);

                    assert.throws(fn, "Environment key \"invalid\" is unknown\n");
                });

                it("should catch disabled invalid environments", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", env: { browser: true, invalid: false } }] }, null, ruleMapper);

                    assert.throws(fn, "Environment key \"invalid\" is unknown\n");
                });

            });

            describe("rules", () => {

                it("should catch invalid rule options", () => {
                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", rules: { "mock-rule": [3, "third"] } }] }, "tests", ruleMapper);

                    assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
                });

                it("should not allow options for rules with no options", () => {
                    linter.defineRule("mock-no-options-rule", mockNoOptionsRule);

                    const fn = validator.validate.bind(null, { overrides: [{ files: "*", rules: { "mock-no-options-rule": [2, "extra"] } }] }, "tests", ruleMapper);

                    assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-no-options-rule\" is invalid:\n\tValue [\"extra\"] should NOT have more than 0 items.\n");
                });
            });

        });

    });

    describe("getRuleOptionsSchema", () => {

        it("should return null for a missing rule", () => {
            assert.strictEqual(validator.getRuleOptionsSchema(ruleMapper("non-existent-rule")), null);
        });

        it("should not modify object schema", () => {
            linter.defineRule("mock-object-rule", mockObjectRule);
            assert.deepStrictEqual(validator.getRuleOptionsSchema(ruleMapper("mock-object-rule")), {
                enum: ["first", "second"]
            });
        });

    });

    describe("validateRuleOptions", () => {

        it("should throw for incorrect warning level number", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect warning level string", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", "booya", "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '\"booya\"').\n");
        });

        it("should throw for invalid-type warning level", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [["error"]], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '[ \"error\" ]').\n");
        });

        it("should only check warning level for nonexistent rules", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("non-existent-rule"), "non-existent-rule", [3, "foobar"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"non-existent-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should only check warning level for plugin rules", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("plugin/rule"), "plugin/rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"plugin/rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warn, 2 = error (you passed '3').\n");
        });

        it("should throw for incorrect configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [2, "frist"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"frist\" should be equal to one of the allowed values.\n");
        });

        it("should throw for too many configuration values", () => {
            const fn = validator.validateRuleOptions.bind(null, ruleMapper("mock-rule"), "mock-rule", [2, "first", "second"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue [\"first\",\"second\"] should NOT have more than 1 items.\n");
        });

    });

});
