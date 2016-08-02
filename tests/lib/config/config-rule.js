/**
 * @fileoverview Tests for ConfigOps
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    ConfigRule = require("../../../lib/config/config-rule"),
    loadRules = require("../../../lib/load-rules"),
    schema = require("../../fixtures/config-rule/schemas");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const SEVERITY = 2;

describe("ConfigRule", function() {

    describe("generateConfigsFromSchema()", function() {
        let actualConfigs;

        it("should create a config with only severity for an empty schema", function() {
            actualConfigs = ConfigRule.generateConfigsFromSchema([]);
            assert.deepEqual(actualConfigs, [SEVERITY]);
        });

        it("should create a config with only severity with no arguments", function() {
            actualConfigs = ConfigRule.generateConfigsFromSchema();
            assert.deepEqual(actualConfigs, [SEVERITY]);
        });

        describe("for a single enum schema", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.enum);
            });

            it("should create an array of configs", function() {
                assert.isArray(actualConfigs);
                assert.equal(actualConfigs.length, 3);
            });

            it("should include the error severity (2) without options as the first config", function() {
                assert.equal(actualConfigs[0], SEVERITY);
            });

            it("should set all configs to error severity (2)", function() {
                actualConfigs.forEach(function(actualConfig) {
                    if (Array.isArray(actualConfig)) {
                        assert.equal(actualConfig[0], SEVERITY);
                    }
                });
            });

            it("should return configs with each enumerated value in the schema", function() {
                assert.sameDeepMembers(actualConfigs, [SEVERITY, [SEVERITY, "always"], [SEVERITY, "never"]]);
            });
        });

        describe("for a object schema with a single enum property", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithEnum);
            });

            it("should return configs with option objects", function() {

                // Skip first config (severity only)
                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const actualConfigOption = actualConfig[1]; // severity is first element, option is second

                    assert.isObject(actualConfigOption);
                });
            });

            it("should use the object property name from the schema", function() {
                const propName = "enumProperty";

                assert.equal(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const actualConfigOption = actualConfig[1];

                    assert.property(actualConfigOption, propName);
                });
            });

            it("should have each enum as option object values", function() {
                const propName = "enumProperty",
                    actualValues = [];

                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const configOption = actualConfig[1];

                    actualValues.push(configOption[propName]);
                });
                assert.sameMembers(actualValues, ["always", "never"]);
            });
        });

        describe("for a object schema with a multiple enum properties", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithMultipleEnums);
            });

            it("should create configs for all properties in each config", function() {
                const expectedProperties = ["firstEnum", "anotherEnum"];

                assert.equal(actualConfigs.length, 7);
                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const configOption = actualConfig[1];
                    const actualProperties = Object.keys(configOption);

                    assert.sameMembers(actualProperties, expectedProperties);
                });
            });

            it("should create configs for every possible combination", function() {
                const expectedConfigs = [
                    { firstEnum: "always", anotherEnum: "var" },
                    { firstEnum: "always", anotherEnum: "let" },
                    { firstEnum: "always", anotherEnum: "const" },
                    { firstEnum: "never", anotherEnum: "var" },
                    { firstEnum: "never", anotherEnum: "let" },
                    { firstEnum: "never", anotherEnum: "const" }
                ];
                const actualConfigOptions = actualConfigs.slice(1).map(function(actualConfig) {
                    return actualConfig[1];
                });

                assert.sameDeepMembers(actualConfigOptions, expectedConfigs);
            });

        });

        describe("for a object schema with a single boolean property", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithBool);
            });

            it("should return configs with option objects", function() {
                assert.equal(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const actualConfigOption = actualConfig[1];

                    assert.isObject(actualConfigOption);
                });
            });

            it("should use the object property name from the schema", function() {
                const propName = "boolProperty";

                assert.equal(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const actualConfigOption = actualConfig[1];

                    assert.property(actualConfigOption, propName);
                });
            });

            it("should include both true and false configs", function() {
                const propName = "boolProperty",
                    actualValues = [];

                actualConfigs.slice(1).forEach(function(actualConfig) {
                    const configOption = actualConfig[1];

                    actualValues.push(configOption[propName]);
                });
                assert.sameMembers(actualValues, [true, false]);
            });
        });

        describe("for a object schema with a multiple bool properties", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithMultipleBools);
            });

            it("should create configs for all properties in each config", function() {
                const expectedProperties = ["firstBool", "anotherBool"];

                assert.equal(actualConfigs.length, 5);
                actualConfigs.slice(1).forEach(function(config) {
                    const configOption = config[1];
                    const actualProperties = Object.keys(configOption);

                    assert.sameMembers(actualProperties, expectedProperties);
                });
            });

            it("should create configs for every possible combination", function() {
                const expectedConfigOptions = [
                    { firstBool: true, anotherBool: true },
                    { firstBool: true, anotherBool: false },
                    { firstBool: false, anotherBool: true },
                    { firstBool: false, anotherBool: false }
                ];
                const actualConfigOptions = actualConfigs.slice(1).map(function(config) {
                    return config[1];
                });

                assert.sameDeepMembers(actualConfigOptions, expectedConfigOptions);
            });
        });

        describe("for a schema with an enum and an object", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedEnumObject);
            });

            it("should create configs with only the enum values", function() {
                assert.equal(actualConfigs[1].length, 2);
                assert.equal(actualConfigs[2].length, 2);
                const actualOptions = [actualConfigs[1][1], actualConfigs[2][1]];

                assert.sameMembers(actualOptions, ["always", "never"]);
            });

            it("should create configs with a string and an object", function() {
                assert.equal(actualConfigs.length, 7);
                actualConfigs.slice(3).forEach(function(config) {
                    assert.isString(config[1]);
                    assert.isObject(config[2]);
                });
            });
        });

        describe("for a schema with an enum and an object with no usable properties", function() {
            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedEnumObjectWithNothing);
            });

            it("should create config only for the enum", function() {
                const expectedConfigs = [2, [2, "always"], [2, "never"]];

                assert.sameDeepMembers(actualConfigs, expectedConfigs);
            });
        });

        describe("for a schema with oneOf", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.oneOf);
            });

            it("should create a set of configs", function() {
                assert.isArray(actualConfigs);
            });
        });

        describe("for a schema with nested objects", function() {

            before(function() {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.nestedObjects);
            });

            it("should create a set of configs", function() {
                assert.isArray(actualConfigs);
            });
        });
    });

    describe("createCoreRuleConfigs()", function() {

        const rulesConfig = ConfigRule.createCoreRuleConfigs();

        it("should create a rulesConfig containing all core rules", function() {
            const coreRules = loadRules(),
                expectedRules = Object.keys(coreRules),
                actualRules = Object.keys(rulesConfig);

            assert.sameMembers(actualRules, expectedRules);
        });

        it("should create arrays of configs for rules", function() {
            assert.isArray(rulesConfig.quotes);
            assert.include(rulesConfig.quotes, 2);
        });

        it("should create configs for rules with meta", function() {
            assert(rulesConfig["accessor-pairs"].length > 1);
        });
    });
});
