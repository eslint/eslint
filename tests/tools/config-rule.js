/**
 * @fileoverview Tests for ConfigOps
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
	{
		createCoreRuleConfigs,
		generateConfigsFromSchema,
	} = require("../../tools/config-rule"),
	builtInRules = require("../../lib/rules"),
	schema = require("../fixtures/config-rule/schemas");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const SEVERITY = 2;

describe("ConfigRule", () => {
	describe("generateConfigsFromSchema()", () => {
		it("should create a config with only severity for an empty schema", () => {
			const actualConfigs = generateConfigsFromSchema([]);

			assert.deepStrictEqual(actualConfigs, [SEVERITY]);
		});

		it("should create a config with only severity with no arguments", () => {
			const actualConfigs = generateConfigsFromSchema();

			assert.deepStrictEqual(actualConfigs, [SEVERITY]);
		});

		describe("for a single enum schema", () => {
			const actualConfigs = generateConfigsFromSchema(schema.enum);

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
				assert.sameDeepMembers(actualConfigs, [
					SEVERITY,
					[SEVERITY, "always"],
					[SEVERITY, "never"],
				]);
			});
		});

		describe("for a object schema with a single enum property", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.objectWithEnum,
			);

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
			const actualConfigs = generateConfigsFromSchema(
				schema.objectWithMultipleEnums,
			);

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
					{ firstEnum: "never", anotherEnum: "const" },
				];
				const actualConfigOptions = actualConfigs
					.slice(1)
					.map(actualConfig => actualConfig[1]);

				assert.sameDeepMembers(actualConfigOptions, expectedConfigs);
			});
		});

		describe("for a object schema with a single boolean property", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.objectWithBool,
			);

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
			const actualConfigs = generateConfigsFromSchema(
				schema.objectWithMultipleBools,
			);

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
					{ firstBool: false, anotherBool: false },
				];
				const actualConfigOptions = actualConfigs
					.slice(1)
					.map(config => config[1]);

				assert.sameDeepMembers(
					actualConfigOptions,
					expectedConfigOptions,
				);
			});
		});

		describe("for a schema with an enum and an object", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.mixedEnumObject,
			);

			it("should create configs with only the enum values", () => {
				assert.strictEqual(actualConfigs[1].length, 2);
				assert.strictEqual(actualConfigs[2].length, 2);
				const actualOptions = [
					actualConfigs[1][1],
					actualConfigs[2][1],
				];

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
			const actualConfigs = generateConfigsFromSchema(
				schema.mixedEnumObjectWithNothing,
			);

			it("should create config only for the enum", () => {
				const expectedConfigs = [2, [2, "always"], [2, "never"]];

				assert.sameDeepMembers(actualConfigs, expectedConfigs);
			});
		});

		describe("for a schema with an enum preceded by an object with no usable properties", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.mixedObjectWithNothingEnum,
			);

			it("should not create a config for the enum", () => {
				const expectedConfigs = [2];

				assert.sameDeepMembers(actualConfigs, expectedConfigs);
			});
		});

		describe("for a schema with an enum preceded by a string", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.mixedStringEnum,
			);

			it("should create configs for both the string and the enum", () => {
				const expectedConfigs = [
					2,
					[2, "example"],
					[2, "example", "always"],
					[2, "example", "never"],
				];

				assert.sameDeepMembers(actualConfigs, expectedConfigs);
			});
		});

		describe("for a schema with oneOf", () => {
			const actualConfigs = generateConfigsFromSchema(schema.oneOf);

			it("should create a set of configs", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 9);
			});

			it("should include both enum and object configs", () => {
				const options = actualConfigs.slice(1).map(c => c[1]);

				assert.include(options, "before");
				assert.include(options, "after");
				assert.include(options, "both");
				assert.include(options, "neither");
				assert.deepInclude(options, { before: true, after: true });
				assert.deepInclude(options, { before: true, after: false });
				assert.deepInclude(options, { before: false, after: true });
				assert.deepInclude(options, { before: false, after: false });
			});
		});

		describe("for a schema with nested objects", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.nestedObjects,
			);

			it("should create a set of configs", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 3);
			});

			it("should include nested object configs", () => {
				const options = actualConfigs.slice(1).map(c => c[1]);

				assert.deepInclude(options, {
					prefer: { nestedProperty: true },
				});
				assert.deepInclude(options, {
					prefer: { nestedProperty: false },
				});
			});
		});

		describe("for a schema with anyOf", () => {
			const actualConfigs = generateConfigsFromSchema(schema.anyOf);

			it("should create a set of configs", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 9);
			});

			it("should include both enum and object configs", () => {
				const options = actualConfigs.slice(1).map(c => c[1]);

				assert.include(options, "before");
				assert.include(options, "after");
				assert.include(options, "both");
				assert.include(options, "neither");
				assert.deepInclude(options, { before: true, after: true });
				assert.deepInclude(options, { before: true, after: false });
				assert.deepInclude(options, { before: false, after: true });
				assert.deepInclude(options, { before: false, after: false });
			});
		});

		describe("for a schema with items", () => {
			const actualConfigs = generateConfigsFromSchema(schema.items);

			it("should create an array containing one string", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.deepStrictEqual(actualConfigs[1], [2, ["example"]]);
			});
		});

		describe("for a schema with items array", () => {
			const actualConfigs = generateConfigsFromSchema(schema.itemsArray);

			it("should create an array containing a string and a number", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.isArray(actualConfigs[1]);
				assert.isArray(actualConfigs[1][1]);
				assert.strictEqual(actualConfigs[1][1].length, 2);
				assert.strictEqual(actualConfigs[1][1][0], "example");
				assert.isNumber(actualConfigs[1][1][1]);
			});
		});

		describe("for a schema with a $ref", () => {
			const s = [...schema.ref];

			s.definitions = schema.definitions;
			const actualConfigs = generateConfigsFromSchema(s);

			it("should resolve the $ref and create configs", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.deepStrictEqual(actualConfigs[1], [2, "example"]);
			});
		});

		describe("for a schema with a string", () => {
			const actualConfigs = generateConfigsFromSchema(schema.string);

			it("should create configs with a non-empty example string", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.deepStrictEqual(actualConfigs[1], [2, "example"]);
			});
		});

		describe("for a schema with a number", () => {
			const actualConfigs = generateConfigsFromSchema(schema.number);

			it("should create configs with a number", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.isArray(actualConfigs[1]);
				assert.isNumber(actualConfigs[1][1]);
			});
		});

		describe("for a schema with a number with min and max constraints", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.numberWithMinMax,
			);

			it("should create configs with a number within the min and max bounds", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.isArray(actualConfigs[1]);

				const value = actualConfigs[1][1];

				assert.isNumber(value);
				assert.isAtLeast(value, schema.numberWithMinMax[0].minimum);
				assert.isAtMost(value, schema.numberWithMinMax[0].maximum);
			});
		});

		describe("for a schema with an integer", () => {
			const actualConfigs = generateConfigsFromSchema(schema.integer);

			it("should create configs with a random integer", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.isArray(actualConfigs[1]);
				assert.isTrue(
					Number.isInteger(actualConfigs[1][1]),
					"type: integer should generate an integer",
				);
			});
		});

		describe("for a schema with an object with many enum properties", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.objectWithManyEnums,
			);

			it("should limit configs to MAX_CONFIGS_PER_RULE", () => {
				assert.isArray(actualConfigs);

				/*
				 * Total combinations would be 3*3*3*3 = 81, plus severity-only = 82
				 * but should be capped at 50 + 1 (severity-only) = 51
				 */
				assert.isAtMost(actualConfigs.length, 51);
			});
		});

		describe("for a schema with a top-level anyOf (like curly, eqeqeq)", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.topLevelAnyOf,
			);

			it("should create configs from all branches", () => {
				assert.isArray(actualConfigs);

				// Should have configs from both branches
				assert.isTrue(actualConfigs.length > 1);
			});

			it("should include enum values from both branches", () => {
				const options = actualConfigs
					.filter(c => Array.isArray(c))
					.map(c => c[1]);

				// Branch 1: "all"
				assert.include(options, "all");

				// Branch 2: "multi", "multi-line", "multi-or-nest"
				assert.include(options, "multi");
				assert.include(options, "multi-line");
				assert.include(options, "multi-or-nest");
			});

			it("should include second-position enum from the second branch", () => {
				const secondOptions = actualConfigs
					.filter(c => Array.isArray(c) && c.length >= 3)
					.map(c => c[2]);

				assert.include(secondOptions, "consistent");
			});

			it("should deduplicate the severity-only config", () => {
				const severityOnlyCount = actualConfigs.filter(
					c => c === 2,
				).length;

				assert.strictEqual(severityOnlyCount, 1);
			});
		});

		describe("for a schema with type:array + oneOf (like logical-assignment-operators)", () => {
			const actualConfigs = generateConfigsFromSchema(
				schema.arrayWithOneOf,
			);

			it("should create configs from all oneOf branches", () => {
				assert.isArray(actualConfigs);
				assert.isTrue(actualConfigs.length > 1);
			});

			it("should include const values from both branches", () => {
				const options = actualConfigs
					.filter(c => Array.isArray(c))
					.map(c => c[1]);

				// Branch 1 uses { const: "always" }, Branch 2 uses { const: "never" }
				assert.include(options, "always");
				assert.include(options, "never");
			});

			it("should include object configs from the first branch", () => {
				const objectConfigs = actualConfigs.filter(
					c =>
						Array.isArray(c) &&
						c.length >= 3 &&
						typeof c[2] === "object",
				);

				assert.isTrue(
					objectConfigs.length > 0,
					"should have configs with object options from the 'always' branch",
				);
			});

			it("should deduplicate the severity-only config", () => {
				const severityOnlyCount = actualConfigs.filter(
					c => c === 2,
				).length;

				assert.strictEqual(severityOnlyCount, 1);
			});
		});

		describe("for a schema with a const value", () => {
			const actualConfigs = generateConfigsFromSchema(schema.constValue);

			it("should create configs with the const value", () => {
				assert.isArray(actualConfigs);
				assert.strictEqual(actualConfigs.length, 2);
				assert.deepStrictEqual(actualConfigs[1], [2, "strict"]);
			});
		});
	});

	describe("createCoreRuleConfigs()", () => {
		const rulesConfig = createCoreRuleConfigs();

		it("should create a rulesConfig containing all core rules", () => {
			const expectedRules = Array.from(builtInRules.keys()),
				actualRules = Object.keys(rulesConfig);

			assert.sameMembers(actualRules, expectedRules);
		});

		it("should allow to ignore deprecated rules", () => {
			const expectedRules = Array.from(builtInRules.entries())
					.filter(([, rule]) => {
						const isDeprecated = rule.meta.deprecated;

						return !isDeprecated;
					})
					.map(([id]) => id),
				actualRules = Object.keys(createCoreRuleConfigs(true));

			assert.sameMembers(actualRules, expectedRules);

			// Make sure it doesn't contain deprecated rules.
			assert.notInclude(actualRules, "newline-after-var");
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
