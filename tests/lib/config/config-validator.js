/**
 * @fileoverview Tests for config validator.
 * @author Brandon Mills
 * @copyright 2015 Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    eslint = require("../../../lib/eslint"),
    validator = require("../../../lib/config/config-validator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

/**
 * Fake a rule object
 * @param {object} context context passed to the rules by eslint
 * @returns {object} mocked rule listeners
 * @private
 */
function mockRule(context) {
    return {
        "Program": function(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockRule.schema = [
    {
        "enum": ["first", "second"]
    }
];

/**
 * Fake a rule object
 * @param {object} context context passed to the rules by eslint
 * @returns {object} mocked rule listeners
 * @private
 */
function mockObjectRule(context) {
    return {
        "Program": function(node) {
            context.report(node, "Expected a validation error.");
        }
    };
}

mockObjectRule.schema = {
    "enum": ["first", "second"]
};

describe("Validator", function() {

    beforeEach(function() {
        eslint.defineRule("mock-rule", mockRule);
    });

    describe("validate", function() {

        it("should do nothing with an empty config", function() {
            var fn = validator.validate.bind(null, {}, "tests");

            assert.doesNotThrow(fn);
        });

        it("should do nothing with an empty rules object", function() {
            var fn = validator.validate.bind(null, { rules: {} }, "tests");

            assert.doesNotThrow(fn);
        });

        it("should do nothing with a valid config", function() {
            var fn = validator.validate.bind(null, { rules: { "mock-rule": [2, "second"] } }, "tests");

            assert.doesNotThrow(fn);
        });

        it("should catch invalid rule options", function() {
            var fn = validator.validate.bind(null, { rules: { "mock-rule": [3, "third"] } }, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warning, 2 = error (you passed \"3\").\n\tValue \"third\" must be an enum value.\n");
        });

        it("should throw with an array environment", function() {
            var fn = validator.validate.bind(null, { env: [] });
            assert.throws(fn, "Environment must not be an array");
        });

        it("should throw with a primitive environment", function() {
            var fn = validator.validate.bind(null, { env: 1 });
            assert.throws(fn, "Environment must be an object");
        });

        it("should catch invalid environments", function() {
            var fn = validator.validate.bind(null, { env: {"browser": true, "invalid": true } });
            assert.throws(fn, "Environment key \"invalid\" is unknown\n");
        });

        it("should catch disabled invalid environments", function() {
            var fn = validator.validate.bind(null, { env: {"browser": true, "invalid": false } });
            assert.throws(fn, "Environment key \"invalid\" is unknown\n");
        });

        it("should do nothing with an undefined environment", function() {
            var fn = validator.validate.bind(null, {});
            assert.doesNotThrow(fn);
        });

    });

    describe("getRuleOptionsSchema", function() {

        it("should return a default schema for a missing rule", function() {
            assert.deepEqual(validator.getRuleOptionsSchema("non-existent-rule"), {
                "type": "array",
                "items": [
                    {
                        "enum": [0, 1, 2]
                    }
                ],
                "minItems": 1
            });
        });

        it("should add warning level validation to provided schemas", function() {
            assert.deepEqual(validator.getRuleOptionsSchema("mock-rule"), {
                "type": "array",
                "items": [
                    {
                        "enum": [0, 1, 2]
                    },
                    {
                        "enum": ["first", "second"]
                    }
                ],
                "minItems": 1,
                "maxItems": 2
            });
        });

        it("should not modify object schema", function() {
            eslint.defineRule("mock-object-rule", mockObjectRule);
            assert.deepEqual(validator.getRuleOptionsSchema("mock-object-rule"), {
                "enum": ["first", "second"]
            });
        });

    });

    describe("validateRuleOptions", function() {

        it("should throw for incorrect warning level", function() {
            var fn = validator.validateRuleOptions.bind(null, "mock-rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warning, 2 = error (you passed \"3\").\n");
        });

        it("should only check warning level for nonexistent rules", function() {
            var fn = validator.validateRuleOptions.bind(null, "non-existent-rule", [3, "foobar"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"non-existent-rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warning, 2 = error (you passed \"3\").\n");
        });

        it("should only check warning level for plugin rules", function() {
            var fn = validator.validateRuleOptions.bind(null, "plugin/rule", 3, "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"plugin/rule\" is invalid:\n\tSeverity should be one of the following: 0 = off, 1 = warning, 2 = error (you passed \"3\").\n");
        });

        it("should throw for incorrect configuration values", function() {
            var fn = validator.validateRuleOptions.bind(null, "mock-rule", [2, "frist"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"frist\" must be an enum value.\n");
        });

        it("should throw for too many configuration values", function() {
            var fn = validator.validateRuleOptions.bind(null, "mock-rule", [2, "first", "second"], "tests");

            assert.throws(fn, "tests:\n\tConfiguration for rule \"mock-rule\" is invalid:\n\tValue \"2,first,second\" has more items than allowed.\n");
        });

    });

});
