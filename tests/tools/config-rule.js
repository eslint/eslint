/**
 * @fileoverview Tests for ConfigOps
 * @author Ian VanSchooten
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert"),
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
		let actualConfigs;

		it("should create a config with only severity for an empty schema", () => {
			actualConfigs = generateConfigsFromSchema([]);
			assert.deepStrictEqual(actualConfigs, [SEVERITY]);
		});

		it("should create a config with only severity with no arguments", () => {
			actualConfigs = generateConfigsFromSchema();
			assert.deepStrictEqual(actualConfigs, [SEVERITY]);
		});

		describe("for a single enum schema", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(schema.enum);
			});

			it("should create an array of configs", () => {
				assert.ok(Array.isArray(actualConfigs));
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
				assert.deepStrictEqual(actualConfigs, [
					SEVERITY,
					[SEVERITY, "always"],
					[SEVERITY, "never"],
				]);
			});
		});

		describe("for a object schema with a single enum property", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.objectWithEnum,
				);
			});

			it("should return configs with option objects", () => {
				// Skip first config (severity only)
				actualConfigs.slice(1).forEach(actualConfig => {
					const actualConfigOption = actualConfig[1]; // severity is first element, option is second

					assert.ok(
						actualConfigOption !== null &&
							typeof actualConfigOption === "object",
					);
				});
			});

			it("should use the object property name from the schema", () => {
				const propName = "enumProperty";

				assert.strictEqual(actualConfigs.length, 3);
				actualConfigs.slice(1).forEach(actualConfig => {
					const actualConfigOption = actualConfig[1];

					assert.ok(propName in actualConfigOption);
				});
			});

			it("should have each enum as option object values", () => {
				const propName = "enumProperty",
					actualValues = [];

				actualConfigs.slice(1).forEach(actualConfig => {
					const configOption = actualConfig[1];

					actualValues.push(configOption[propName]);
				});
				assert.deepStrictEqual(actualValues, ["always", "never"]);
			});
		});

		describe("for a object schema with a multiple enum properties", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.objectWithMultipleEnums,
				);
			});

			it("should create configs for all properties in each config", () => {
				const expectedProperties = ["firstEnum", "anotherEnum"];

				assert.strictEqual(actualConfigs.length, 7);
				actualConfigs.slice(1).forEach(actualConfig => {
					const configOption = actualConfig[1];
					const actualProperties = Object.keys(configOption);

					assert.deepStrictEqual(
						actualProperties,
						expectedProperties,
					);
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

				expectedConfigs.forEach(expectedConfig => {
					const found = actualConfigOptions.some(actualConfig =>
						Object.keys(expectedConfig).every(
							key => expectedConfig[key] === actualConfig[key],
						),
					);
					assert.ok(
						found,
						`Expected config ${JSON.stringify(expectedConfig)} not found`,
					);
				});

				assert.strictEqual(
					actualConfigOptions.length,
					expectedConfigs.length,
				);
			});
		});

		describe("for a object schema with a single boolean property", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.objectWithBool,
				);
			});

			it("should return configs with option objects", () => {
				assert.strictEqual(actualConfigs.length, 3);
				actualConfigs.slice(1).forEach(actualConfig => {
					const actualConfigOption = actualConfig[1];

					assert.ok(
						actualConfigOption !== null &&
							typeof actualConfigOption === "object",
					);
				});
			});

			it("should use the object property name from the schema", () => {
				const propName = "boolProperty";

				assert.strictEqual(actualConfigs.length, 3);
				actualConfigs.slice(1).forEach(actualConfig => {
					const actualConfigOption = actualConfig[1];

					assert.ok(propName in actualConfigOption);
				});
			});

			it("should include both true and false configs", () => {
				const propName = "boolProperty",
					actualValues = [];

				actualConfigs.slice(1).forEach(actualConfig => {
					const configOption = actualConfig[1];

					actualValues.push(configOption[propName]);
				});
				assert.deepStrictEqual(actualValues, [true, false]);
			});
		});

		describe("for a object schema with a multiple bool properties", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.objectWithMultipleBools,
				);
			});

			it("should create configs for all properties in each config", () => {
				const expectedProperties = ["firstBool", "anotherBool"];

				assert.strictEqual(actualConfigs.length, 5);
				actualConfigs.slice(1).forEach(config => {
					const configOption = config[1];
					const actualProperties = Object.keys(configOption);

					assert.deepStrictEqual(
						actualProperties,
						expectedProperties,
					);
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

				expectedConfigOptions.forEach(expectedConfig => {
					const found = actualConfigOptions.some(actualConfig =>
						Object.keys(expectedConfig).every(
							key => expectedConfig[key] === actualConfig[key],
						),
					);
					assert.ok(
						found,
						`Expected config ${JSON.stringify(expectedConfig)} not found`,
					);
				});

				assert.strictEqual(
					actualConfigOptions.length,
					expectedConfigOptions.length,
				);
			});
		});

		describe("for a schema with an enum and an object", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.mixedEnumObject,
				);
			});

			it("should create configs with only the enum values", () => {
				assert.strictEqual(actualConfigs[1].length, 2);
				assert.strictEqual(actualConfigs[2].length, 2);
				const actualOptions = [
					actualConfigs[1][1],
					actualConfigs[2][1],
				];

				assert.deepStrictEqual(actualOptions, ["always", "never"]);
			});

			it("should create configs with a string and an object", () => {
				assert.strictEqual(actualConfigs.length, 7);
				actualConfigs.slice(3).forEach(config => {
					assert.strictEqual(typeof config[1], "string");
					assert.ok(
						config[2] !== null && typeof config[2] === "object",
					);
				});
			});
		});

		describe("for a schema with an enum followed by an object with no usable properties", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.mixedEnumObjectWithNothing,
				);
			});

			it("should create config only for the enum", () => {
				const expectedConfigs = [2, [2, "always"], [2, "never"]];

				expectedConfigs.forEach(expectedConfig => {
					const found = actualConfigs.some(actualConfig => {
						if (
							Array.isArray(expectedConfig) &&
							Array.isArray(actualConfig)
						) {
							return (
								expectedConfig.length === actualConfig.length &&
								expectedConfig.every(
									(value, index) =>
										value === actualConfig[index],
								)
							);
						}
						return expectedConfig === actualConfig;
					});
					assert.ok(
						found,
						`Expected config ${JSON.stringify(expectedConfig)} not found`,
					);
				});

				assert.strictEqual(
					actualConfigs.length,
					expectedConfigs.length,
				);
			});
		});

		describe("for a schema with an enum preceded by an object with no usable properties", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.mixedObjectWithNothingEnum,
				);
			});

			it("should not create a config for the enum", () => {
				const expectedConfigs = [2];

				expectedConfigs.forEach(expectedConfig => {
					const found = actualConfigs.some(actualConfig => {
						if (
							Array.isArray(expectedConfig) &&
							Array.isArray(actualConfig)
						) {
							return (
								expectedConfig.length === actualConfig.length &&
								expectedConfig.every(
									(value, index) =>
										value === actualConfig[index],
								)
							);
						}
						return expectedConfig === actualConfig;
					});
					assert.ok(
						found,
						`Expected config ${JSON.stringify(expectedConfig)} not found`,
					);
				});

				assert.strictEqual(
					actualConfigs.length,
					expectedConfigs.length,
				);
			});
		});

		describe("for a schema with an enum preceded by a string", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(
					schema.mixedStringEnum,
				);
			});

			it("should not create a config for the enum", () => {
				const expectedConfigs = [2];

				expectedConfigs.forEach(expectedConfig => {
					const found = actualConfigs.some(actualConfig => {
						if (
							Array.isArray(expectedConfig) &&
							Array.isArray(actualConfig)
						) {
							return (
								expectedConfig.length === actualConfig.length &&
								expectedConfig.every(
									(value, index) =>
										value === actualConfig[index],
								)
							);
						}
						return expectedConfig === actualConfig;
					});
					assert.ok(
						found,
						`Expected config ${JSON.stringify(expectedConfig)} not found`,
					);
				});

				assert.strictEqual(
					actualConfigs.length,
					expectedConfigs.length,
				);
			});
		});

		describe("for a schema with oneOf", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(schema.oneOf);
			});

			it("should create a set of configs", () => {
				assert.ok(Array.isArray(actualConfigs));
			});
		});

		describe("for a schema with nested objects", () => {
			before(() => {
				actualConfigs = generateConfigsFromSchema(schema.nestedObjects);
			});

			it("should create a set of configs", () => {
				assert.ok(Array.isArray(actualConfigs));
			});
		});
	});

	describe("createCoreRuleConfigs()", () => {
		const rulesConfig = createCoreRuleConfigs();

		it("should create a rulesConfig containing all core rules", () => {
			const expectedRules = Array.from(builtInRules.keys()),
				actualRules = Object.keys(rulesConfig);

			assert.deepStrictEqual(actualRules, expectedRules);
		});

		it("should allow to ignore deprecated rules", () => {
			const expectedRules = Array.from(builtInRules.entries())
					.filter(([, rule]) => {
						const isDeprecated = rule.meta.deprecated;

						return !isDeprecated;
					})
					.map(([id]) => id),
				actualRules = Object.keys(createCoreRuleConfigs(true));

			assert.deepStrictEqual(actualRules, expectedRules);

			// Make sure it doesn't contain deprecated rules.
			assert.ok(!actualRules.includes("newline-after-var"));
		});

		it("should create arrays of configs for rules", () => {
			assert.ok(Array.isArray(rulesConfig.quotes));
			assert.ok(rulesConfig.quotes.includes(2));
		});

		it("should create configs for rules with meta", () => {
			assert.ok(rulesConfig["accessor-pairs"].length > 1);
		});
	});
});
