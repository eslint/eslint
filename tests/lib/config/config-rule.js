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
    builtInRules = require("../../../lib/built-in-rules-index"),
    schema = require("../../fixtures/config-rule/schemas");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const SEVERITY = 2;

describe("ConfigRule", () => {

    describe("generateConfigsFromSchema()", () => {
        let actualConfigs;

        it("should create a config with only severity for an empty schema", () => {
            actualConfigs = ConfigRule.generateConfigsFromSchema([]);
            assert.deepStrictEqual(actualConfigs, [SEVERITY]);
        });

        it("should create a config with only severity with no arguments", () => {
            actualConfigs = ConfigRule.generateConfigsFromSchema();
            assert.deepStrictEqual(actualConfigs, [SEVERITY]);
        });

        describe("for a single enum schema", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.enum);
            });

            it("should create an array of configs", () => {
                assert.isArray(actualConfigs);
                assert.strictEqual(actualConfigs.length, 3);
            });

            it("should include the error severity (2) without options as the first config", () => {
                assert.strictEqual(actualConfigs[0], SEVERITY);
            });

            it("should set all configs to error severity (2)", () => {
                actualConfigs.forEach(actualConfig => {
                    if (Array.isArray(actualConfig)) {
                        assert.strictEqual(actualConfig[0], SEVERITY);
                    }
                });
            });

            it("should return configs with each enumerated value in the schema", () => {
                assert.sameDeepMembers(actualConfigs, [SEVERITY, [SEVERITY, "always"], [SEVERITY, "never"]]);
            });
        });

        describe("for a object schema with a single enum property", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithEnum);
            });

            it("should return configs with option objects", () => {

                // Skip first config (severity only)
                actualConfigs.slice(1).forEach(actualConfig => {
                    const actualConfigOption = actualConfig[1]; // severity is first element, option is second

                    assert.isObject(actualConfigOption);
                });
            });

            it("should use the object property name from the schema", () => {
                const propName = "enumProperty";

                assert.strictEqual(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(actualConfig => {
                    const actualConfigOption = actualConfig[1];

                    assert.property(actualConfigOption, propName);
                });
            });

            it("should have each enum as option object values", () => {
                const propName = "enumProperty",
                    actualValues = [];

                actualConfigs.slice(1).forEach(actualConfig => {
                    const configOption = actualConfig[1];

                    actualValues.push(configOption[propName]);
                });
                assert.sameMembers(actualValues, ["always", "never"]);
            });
        });

        describe("for a object schema with a multiple enum properties", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithMultipleEnums);
            });

            it("should create configs for all properties in each config", () => {
                const expectedProperties = ["firstEnum", "anotherEnum"];

                assert.strictEqual(actualConfigs.length, 7);
                actualConfigs.slice(1).forEach(actualConfig => {
                    const configOption = actualConfig[1];
                    const actualProperties = Object.keys(configOption);

                    assert.sameMembers(actualProperties, expectedProperties);
                });
            });

            it("should create configs for every possible combination", () => {
                const expectedConfigs = [
                    { firstEnum: "always", anotherEnum: "var" },
                    { firstEnum: "always", anotherEnum: "let" },
                    { firstEnum: "always", anotherEnum: "const" },
                    { firstEnum: "never", anotherEnum: "var" },
                    { firstEnum: "never", anotherEnum: "let" },
                    { firstEnum: "never", anotherEnum: "const" }
                ];
                const actualConfigOptions = actualConfigs.slice(1).map(actualConfig => actualConfig[1]);

                assert.sameDeepMembers(actualConfigOptions, expectedConfigs);
            });

        });

        describe("for a object schema with a single boolean property", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithBool);
            });

            it("should return configs with option objects", () => {
                assert.strictEqual(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(actualConfig => {
                    const actualConfigOption = actualConfig[1];

                    assert.isObject(actualConfigOption);
                });
            });

            it("should use the object property name from the schema", () => {
                const propName = "boolProperty";

                assert.strictEqual(actualConfigs.length, 3);
                actualConfigs.slice(1).forEach(actualConfig => {
                    const actualConfigOption = actualConfig[1];

                    assert.property(actualConfigOption, propName);
                });
            });

            it("should include both true and false configs", () => {
                const propName = "boolProperty",
                    actualValues = [];

                actualConfigs.slice(1).forEach(actualConfig => {
                    const configOption = actualConfig[1];

                    actualValues.push(configOption[propName]);
                });
                assert.sameMembers(actualValues, [true, false]);
            });
        });

        describe("for a object schema with a multiple bool properties", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.objectWithMultipleBools);
            });

            it("should create configs for all properties in each config", () => {
                const expectedProperties = ["firstBool", "anotherBool"];

                assert.strictEqual(actualConfigs.length, 5);
                actualConfigs.slice(1).forEach(config => {
                    const configOption = config[1];
                    const actualProperties = Object.keys(configOption);

                    assert.sameMembers(actualProperties, expectedProperties);
                });
            });

            it("should create configs for every possible combination", () => {
                const expectedConfigOptions = [
                    { firstBool: true, anotherBool: true },
                    { firstBool: true, anotherBool: false },
                    { firstBool: false, anotherBool: true },
                    { firstBool: false, anotherBool: false }
                ];
                const actualConfigOptions = actualConfigs.slice(1).map(config => config[1]);

                assert.sameDeepMembers(actualConfigOptions, expectedConfigOptions);
            });
        });

        describe("for a schema with an enum and an object", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedEnumObject);
            });

            it("should create configs with only the enum values", () => {
                assert.strictEqual(actualConfigs[1].length, 2);
                assert.strictEqual(actualConfigs[2].length, 2);
                const actualOptions = [actualConfigs[1][1], actualConfigs[2][1]];

                assert.sameMembers(actualOptions, ["always", "never"]);
            });

            it("should create configs with a string and an object", () => {
                assert.strictEqual(actualConfigs.length, 7);
                actualConfigs.slice(3).forEach(config => {
                    assert.isString(config[1]);
                    assert.isObject(config[2]);
                });
            });
        });

        describe("for a schema with an enum followed by an object with no usable properties", () => {
            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedEnumObjectWithNothing);
            });

            it("should create config only for the enum", () => {
                const expectedConfigs = [2, [2, "always"], [2, "never"]];

                assert.sameDeepMembers(actualConfigs, expectedConfigs);
            });
        });

        describe("for a schema with an enum preceded by an object with no usable properties", () => {
            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedObjectWithNothingEnum);
            });

            it("should not create a config for the enum", () => {
                const expectedConfigs = [2];

                assert.sameDeepMembers(actualConfigs, expectedConfigs);
            });
        });

        describe("for a schema with an enum preceded by a string", () => {
            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.mixedStringEnum);
            });

            it("should not create a config for the enum", () => {
                const expectedConfigs = [2];

                assert.sameDeepMembers(actualConfigs, expectedConfigs);
            });
        });

        describe("for a schema with oneOf", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.oneOf);
            });

            it("should create a set of configs", () => {
                assert.isArray(actualConfigs);
            });
        });

        describe("for a schema with nested objects", () => {

            before(() => {
                actualConfigs = ConfigRule.generateConfigsFromSchema(schema.nestedObjects);
            });

            it("should create a set of configs", () => {
                assert.isArray(actualConfigs);
            });
        });
    });

    describe("createCoreRuleConfigs()", () => {

        const rulesConfig = ConfigRule.createCoreRuleConfigs();

        it("should create a rulesConfig containing all core rules", () => {
            const coreRules = builtInRules,
                expectedRules = Object.keys(coreRules),
                actualRules = Object.keys(rulesConfig);

            assert.sameMembers(actualRules, expectedRules);
        });

        it("should create arrays of configs for rules", () => {
            assert.isArray(rulesConfig.quotes);
            assert.include(rulesConfig.quotes, 2);
        });

        it("should create configs for rules with meta", () => {
            assert(rulesConfig["accessor-pairs"].length > 1);
        });
    });
});
