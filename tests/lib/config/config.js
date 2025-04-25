/**
 * @fileoverview Tests for Config
 * @author Nicholas C. Zakas
 */

/* eslint no-new: "off" -- new is needed to test constructor */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { Config } = require("../../../lib/config/config");
const assert = require("chai").assert;
const sinon = require("sinon");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Config", () => {
	describe("static parseRuleId()", () => {
		it("should return plugin name and rule name for core rule", () => {
			const result = Config.parseRuleId("foo");

			assert.deepStrictEqual(result, {
				pluginName: "@",
				ruleName: "foo",
			});
		});

		it("should return plugin name and rule name with a/b format", () => {
			const result = Config.parseRuleId("test/foo");

			assert.deepStrictEqual(result, {
				pluginName: "test",
				ruleName: "foo",
			});
		});

		it("should return plugin name and rule name with a/b/c format", () => {
			const result = Config.parseRuleId(
				"node/no-unsupported-features/es-builtins",
			);

			assert.deepStrictEqual(result, {
				pluginName: "node",
				ruleName: "no-unsupported-features/es-builtins",
			});
		});

		it("should return plugin name and rule name with @a/b/c format", () => {
			const result = Config.parseRuleId("@test/foo/bar");

			assert.deepStrictEqual(result, {
				pluginName: "@test/foo",
				ruleName: "bar",
			});
		});
	});

	describe("static getRuleFromConfig", () => {
		it("should retrieve rule from plugin in config", () => {
			const rule = {};
			const config = {
				plugins: {
					test: {
						rules: {
							one: rule,
						},
					},
				},
			};

			const result = Config.getRuleFromConfig("test/one", config);

			assert.strictEqual(result, rule);
		});

		it("should retrieve rule from core in config", () => {
			const rule = {};
			const config = {
				plugins: {
					"@": {
						rules: {
							semi: rule,
						},
					},
				},
			};

			const result = Config.getRuleFromConfig("semi", config);

			assert.strictEqual(result, rule);
		});
	});

	describe("static getRuleOptionsSchema", () => {
		const noOptionsSchema = {
			type: "array",
			minItems: 0,
			maxItems: 0,
		};

		it("should return schema that doesn't accept options if rule doesn't have `meta`", () => {
			const rule = {};
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, noOptionsSchema);
		});

		it("should return schema that doesn't accept options if rule doesn't have `meta.schema`", () => {
			const rule = { meta: {} };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, noOptionsSchema);
		});

		it("should return schema that doesn't accept options if `meta.schema` is `undefined`", () => {
			const rule = { meta: { schema: void 0 } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, noOptionsSchema);
		});

		it("should return schema that doesn't accept options if `meta.schema` is `[]`", () => {
			const rule = { meta: { schema: [] } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, noOptionsSchema);
		});

		it("should return JSON Schema definition object if `meta.schema` is in the array form", () => {
			const firstOption = { enum: ["always", "never"] };
			const rule = { meta: { schema: [firstOption] } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, {
				type: "array",
				items: [firstOption],
				minItems: 0,
				maxItems: 1,
			});
		});

		it("should return `meta.schema` as is if `meta.schema` is an object", () => {
			const schema = {
				type: "array",
				items: [
					{
						enum: ["always", "never"],
					},
				],
			};
			const rule = { meta: { schema } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, schema);
		});

		it("should return `null` if `meta.schema` is `false`", () => {
			const rule = { meta: { schema: false } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.strictEqual(result, null);
		});

		[null, true, 0, 1, "", "always", () => {}].forEach(schema => {
			it(`should throw an error if \`meta.schema\` is ${typeof schema} ${schema}`, () => {
				const rule = { meta: { schema } };

				assert.throws(() => {
					Config.getRuleOptionsSchema(rule);
				}, "Rule's `meta.schema` must be an array or object");
			});
		});

		it("should ignore top-level `schema` property", () => {
			const rule = { schema: { enum: ["always", "never"] } };
			const result = Config.getRuleOptionsSchema(rule);

			assert.deepStrictEqual(result, noOptionsSchema);
		});
	});

	describe("constructor", () => {
		let mockLanguage;

		beforeEach(() => {
			mockLanguage = {
				validateLanguageOptions: sinon.stub(),
				normalizeLanguageOptions: sinon.spy(options => options),
			};
		});

		it("should throw error when language is not provided", () => {
			assert.throws(() => {
				new Config({});
			}, "Key 'language' is required.");
		});

		it("should throw error when language is not found in plugins", () => {
			assert.throws(() => {
				new Config({
					language: "test/lang",
					plugins: {
						test: {
							// No languages
						},
					},
				});
			}, /Could not find "lang" in plugin "test"/u);
		});

		it("should correctly set up language from plugins", () => {
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
					},
				},
			});

			assert.strictEqual(config.language, mockLanguage);
			assert.isTrue(mockLanguage.validateLanguageOptions.called);
		});

		it("should correctly merge language options with default language options", () => {
			mockLanguage.defaultLanguageOptions = { parser: "default" };

			const config = new Config({
				language: "test/lang",
				languageOptions: { ecmaVersion: 2022 },
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
					},
				},
			});

			assert.deepStrictEqual(config.languageOptions, {
				parser: "default",
				ecmaVersion: 2022,
			});
		});

		it("should throw error when processor is not found in plugins", () => {
			assert.throws(() => {
				new Config({
					language: "test/lang",
					plugins: {
						test: {
							languages: {
								lang: mockLanguage,
							},
						},
					},
					processor: "test/proc",
				});
			}, /Could not find "proc" in plugin "test"/u);
		});

		it("should correctly set up processor from plugins", () => {
			const mockProcessor = {};
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
						processors: {
							proc: mockProcessor,
						},
					},
				},
				processor: "test/proc",
			});

			assert.strictEqual(config.processor, mockProcessor);
		});

		it("should accept processor object directly", () => {
			const mockProcessor = {
				meta: { name: "test-processor" },
				preprocess() {},
				postprocess() {},
			};

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
					},
				},
				processor: mockProcessor,
			});

			assert.strictEqual(config.processor, mockProcessor);
		});

		it("should throw error when processor is not string or object", () => {
			assert.throws(() => {
				new Config({
					language: "test/lang",
					plugins: {
						test: {
							languages: {
								lang: mockLanguage,
							},
						},
					},
					processor: 123,
				});
			}, "Expected an object or a string");
		});

		it("should normalize rules configuration", () => {
			const mockRule = { meta: {} };
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
						rules: {},
					},
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": "error",
				},
			});

			assert.deepStrictEqual(config.rules["test-rule"], [2]);
		});

		it("should normalize rules with options", () => {
			const mockRule = {
				meta: {
					schema: [
						{
							type: "object",
							properties: {
								option1: { type: "boolean" },
							},
						},
					],
				},
			};
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
						rules: {},
					},
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["warn", { option1: true }],
				},
			});

			assert.deepStrictEqual(config.rules["test-rule"], [
				1,
				{ option1: true },
			]);
		});

		it("should apply rule's defaultOptions when present", () => {
			const mockRule = {
				meta: {
					schema: [
						{
							type: "object",
							properties: {
								option1: { type: "boolean" },
								defaultOption: { type: "boolean" },
							},
						},
					],
					defaultOptions: [{ defaultOption: true }],
				},
			};

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
						rules: {},
					},
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["error", { option1: true }],
				},
			});

			assert.deepStrictEqual(config.rules["test-rule"], [
				2,
				{ defaultOption: true, option1: true },
			]);
		});
	});

	describe("getRuleDefinition", () => {
		it("should retrieve rule definition from plugins", () => {
			const mockRule = { meta: {} };
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: { validateLanguageOptions() {} },
						},
						rules: {
							"test-rule": mockRule,
						},
					},
				},
			});

			const rule = config.getRuleDefinition("test/test-rule");
			assert.strictEqual(rule, mockRule);
		});

		it("should retrieve core rule definition", () => {
			const mockRule = { meta: {} };
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: { validateLanguageOptions() {} },
						},
					},
					"@": {
						rules: {
							"core-rule": mockRule,
						},
					},
				},
			});

			const rule = config.getRuleDefinition("core-rule");
			assert.strictEqual(rule, mockRule);
		});
	});

	describe("getRuleNumericSeverity", () => {
		let config;

		beforeEach(() => {
			config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: { validateLanguageOptions() {} },
						},
					},
					"@": {
						rules: {
							"error-rule": {},
							"warn-rule": {},
							"off-rule": {},
						},
					},
				},
				rules: {
					"error-rule": "error",
					"warn-rule": "warn",
					"off-rule": "off",
				},
			});
		});

		it("should return 2 for error rules", () => {
			assert.strictEqual(config.getRuleNumericSeverity("error-rule"), 2);
		});

		it("should return 1 for warn rules", () => {
			assert.strictEqual(config.getRuleNumericSeverity("warn-rule"), 1);
		});

		it("should return 0 for off rules", () => {
			assert.strictEqual(config.getRuleNumericSeverity("off-rule"), 0);
		});

		it("should return 0 for non-existent rules", () => {
			assert.strictEqual(
				config.getRuleNumericSeverity("non-existent"),
				0,
			);
		});
	});

	describe("toJSON", () => {
		it("should convert config to JSON representation", () => {
			const mockLanguage = {
				validateLanguageOptions() {},
				meta: {
					name: "testLang",
					version: "1.0.0",
				},
			};

			const mockProcessor = {
				meta: {
					name: "testProcessor",
					version: "1.0.0",
				},
				preprocess() {},
				postprocess() {},
			};

			const mockPlugin = {
				meta: {
					name: "testPlugin",
					version: "1.0.0",
				},
			};

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						...mockPlugin,
						languages: {
							lang: mockLanguage,
						},
					},
				},
				processor: mockProcessor,
				languageOptions: {
					ecmaVersion: 2022,
					sourceType: "module",
					parser: {
						meta: {
							name: "testParser",
						},
						parse() {},
					},
				},
			});

			const json = config.toJSON();

			assert.deepStrictEqual(json.plugins, ["test:testPlugin@1.0.0"]);
			assert.strictEqual(json.language, "test/lang");
			assert.strictEqual(json.processor, "testProcessor@1.0.0");
			assert.deepStrictEqual(json.languageOptions, {
				ecmaVersion: 2022,
				sourceType: "module",
				parser: "testParser",
			});
		});

		it("should throw when processor doesn't have meta information", () => {
			const mockLanguage = {
				validateLanguageOptions() {},
				meta: {
					name: "testLang",
				},
			};

			const mockProcessor = {
				preprocess() {},
				postprocess() {},
			}; // Missing meta property

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: {
						languages: {
							lang: mockLanguage,
						},
					},
				},
				processor: mockProcessor,
			});

			assert.throws(() => {
				config.toJSON();
			}, "Could not serialize processor object (missing 'meta' object).");
		});
	});

	describe("static validateRules", () => {
		it("should throw when config is not provided", () => {
			assert.throws(() => {
				Config.validateRules();
			}, "Config is required for validation.");
		});

		it("should not validate disabled rules", () => {
			// This rule has no schema, so validation would fail if attempted
			const mockRule = {};

			// This should not throw
			Config.validateRules({
				plugins: {
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["off"],
				},
			});
		});

		it("should throw when rule is not found", () => {
			assert.throws(() => {
				Config.validateRules({
					plugins: {},
					rules: {
						"test/missing-rule": ["error"],
					},
				});
			}, /Could not find plugin "test" in configuration/u);
		});

		it("should throw when rule options don't match schema", () => {
			const mockRule = {
				meta: {
					schema: {
						type: "array",
						items: [
							{
								type: "object",
								properties: {
									valid: { type: "boolean" },
								},
								additionalProperties: false,
							},
						],
					},
				},
			};

			assert.throws(() => {
				Config.validateRules({
					plugins: {
						"@": {
							rules: {
								"test-rule": mockRule,
							},
						},
					},
					rules: {
						"test-rule": ["error", { invalid: true }],
					},
				});
			}, /Unexpected property "invalid"/u);
		});

		it("should throw when rule schema is invalid", () => {
			const mockRule = {
				meta: {
					// Invalid schema
					schema: 123,
				},
			};

			assert.throws(() => {
				Config.validateRules({
					plugins: {
						"@": {
							rules: {
								"test-rule": mockRule,
							},
						},
					},
					rules: {
						"test-rule": ["error"],
					},
				});
			}, /Rule's `meta.schema` must be an array or object/u);
		});

		it("should validate rule options successfully", () => {
			const mockRule = {
				meta: {
					schema: {
						type: "array",
						items: [
							{
								type: "object",
								properties: {
									valid: { type: "boolean" },
								},
							},
						],
					},
				},
			};

			// This should not throw
			Config.validateRules({
				plugins: {
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["error", { valid: true }],
				},
			});
		});

		it("should skip validation when `meta.schema` is false", () => {
			const mockRule = {
				meta: {
					schema: false,
				},
			};

			// This should not throw, even with invalid options
			Config.validateRules({
				plugins: {
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["error", "this", "would", "normally", "fail"],
				},
			});
		});

		it("should validate against each schema in an array schema", () => {
			const mockRule = {
				meta: {
					schema: [
						{
							type: "object",
							properties: {
								prop1: { type: "boolean" },
							},
							additionalProperties: false,
						},
						{
							type: "object",
							properties: {
								prop2: { type: "string" },
							},
							additionalProperties: false,
						},
					],
				},
			};

			// This should not throw with valid options
			Config.validateRules({
				plugins: {
					"@": {
						rules: {
							"test-rule": mockRule,
						},
					},
				},
				rules: {
					"test-rule": ["error", { prop1: true }, { prop2: "value" }],
				},
			});

			// This should throw with invalid second option
			assert.throws(() => {
				Config.validateRules({
					plugins: {
						"@": {
							rules: {
								"test-rule": mockRule,
							},
						},
					},
					rules: {
						"test-rule": [
							"error",
							{ prop1: true },
							{ invalid: true },
						],
					},
				});
			}, /Unexpected property "invalid"/u);
		});

		it("should skip __proto__ in rules", () => {
			const rules = { "test-rule": ["error"] };

			/* eslint-disable-next-line no-proto -- Testing __proto__ behavior */
			rules.__proto__ = ["error"];

			Config.validateRules({
				plugins: {
					"@": {
						rules: {
							"test-rule": { meta: {} },
						},
					},
				},
				rules,
			});
		});
	});
});
