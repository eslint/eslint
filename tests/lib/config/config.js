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
// Helper Functions
//-----------------------------------------------------------------------------

/**
 * Creates a mock language object with default properties
 * @param {Object} overrides Properties to override
 * @returns {Object} Mock language object
 */
function createMockLanguage(overrides = {}) {
	return {
		validateLanguageOptions() {},
		normalizeLanguageOptions: options => options,
		meta: {
			name: "testLang",
			version: "1.0.0",
		},
		...overrides,
	};
}

/**
 * Creates a mock plugin object with default properties
 * @param {Object} overrides Properties to override
 * @returns {Object} Mock plugin object
 */
function createMockPlugin(overrides = {}) {
	return {
		meta: {
			name: "testPlugin",
			version: "1.0.0",
		},
		...overrides,
	};
}

/**
 * Creates a mock processor object with default properties
 * @param {Object} overrides Properties to override
 * @returns {Object} Mock processor object
 */
function createMockProcessor(overrides = {}) {
	return {
		meta: {
			name: "testProcessor",
			version: "1.0.0",
		},
		preprocess() {},
		postprocess() {},
		...overrides,
	};
}

/**
 * Creates a basic config structure for testing
 * @param {Object} configOptions Config options to merge
 * @param {Object} mockLanguage Mock language to use
 * @returns {Object} Config options object
 */
function createBasicConfigOptions(configOptions = {}, mockLanguage = null) {
	const language = mockLanguage || createMockLanguage();

	return {
		language: "test/lang",
		plugins: {
			test: {
				languages: {
					lang: language,
				},
			},
		},
		...configOptions,
	};
}

/**
 * Creates a mock rule object with default schema
 * @param {Object} overrides Properties to override
 * @returns {Object} Mock rule object
 */
function createMockRule(overrides = {}) {
	return {
		meta: {
			schema: [
				{
					type: "object",
					properties: {
						option1: { type: "boolean" },
					},
				},
			],
			...overrides.meta,
		},
		...overrides,
	};
}

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Config", () => {
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

	describe("static getRuleNumericSeverity", () => {
		it("should return 0 for 'off'", () => {
			const result = Config.getRuleNumericSeverity("off");
			assert.strictEqual(result, 0);
		});

		it("should return 1 for 'warn'", () => {
			const result = Config.getRuleNumericSeverity("warn");
			assert.strictEqual(result, 1);
		});

		it("should return 2 for 'error'", () => {
			const result = Config.getRuleNumericSeverity("error");
			assert.strictEqual(result, 2);
		});

		it("should return 0 for 0", () => {
			const result = Config.getRuleNumericSeverity(0);
			assert.strictEqual(result, 0);
		});

		it("should return 1 for 1", () => {
			const result = Config.getRuleNumericSeverity(1);
			assert.strictEqual(result, 1);
		});

		it("should return 2 for 2", () => {
			const result = Config.getRuleNumericSeverity(2);
			assert.strictEqual(result, 2);
		});

		it("should handle rule config arrays", () => {
			const result = Config.getRuleNumericSeverity([
				"error",
				{ option: true },
			]);
			assert.strictEqual(result, 2);
		});

		it("should be case-insensitive for string values", () => {
			const result = Config.getRuleNumericSeverity("ERROR");
			assert.strictEqual(result, 2);
		});

		it("should return 0 for invalid severity strings", () => {
			const result = Config.getRuleNumericSeverity("invalid");
			assert.strictEqual(result, 0);
		});

		it("should return 0 for non-severity values", () => {
			const result = Config.getRuleNumericSeverity(null);
			assert.strictEqual(result, 0);
		});
	});

	describe("constructor", () => {
		let mockLanguage;

		beforeEach(() => {
			mockLanguage = createMockLanguage({
				validateLanguageOptions: sinon.stub(),
				normalizeLanguageOptions: sinon.spy(options => options),
			});
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
			const config = new Config(
				createBasicConfigOptions({}, mockLanguage),
			);

			assert.strictEqual(config.language, mockLanguage);
			assert.isTrue(mockLanguage.validateLanguageOptions.called);
		});

		it("should correctly merge language options with default language options", () => {
			const languageWithDefaults = createMockLanguage({
				defaultLanguageOptions: { parser: "default" },
			});

			const config = new Config(
				createBasicConfigOptions(
					{
						languageOptions: { ecmaVersion: 2022 },
					},
					languageWithDefaults,
				),
			);

			assert.deepStrictEqual(config.languageOptions, {
				parser: "default",
				ecmaVersion: 2022,
			});
		});

		it("should throw error when processor is not found in plugins", () => {
			assert.throws(() => {
				new Config(
					createBasicConfigOptions(
						{
							processor: "test/proc",
						},
						mockLanguage,
					),
				);
			}, /Could not find "proc" in plugin "test"/u);
		});

		it("should correctly set up processor from plugins", () => {
			const mockProcessor = createMockProcessor();
			const config = new Config(
				createBasicConfigOptions({
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
				}),
			);

			assert.strictEqual(config.processor, mockProcessor);
		});

		it("should accept processor object directly", () => {
			const mockProcessor = createMockProcessor({
				meta: { name: "test-processor" },
			});

			const config = new Config(
				createBasicConfigOptions(
					{
						processor: mockProcessor,
					},
					mockLanguage,
				),
			);

			assert.strictEqual(config.processor, mockProcessor);
		});

		it("should throw error when processor is not string or object", () => {
			assert.throws(() => {
				new Config(
					createBasicConfigOptions(
						{
							processor: 123,
						},
						mockLanguage,
					),
				);
			}, "Expected an object or a string");
		});

		it("should normalize rules configuration", () => {
			const mockRule = { meta: {} };
			const config = new Config(
				createBasicConfigOptions({
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
				}),
			);

			assert.deepStrictEqual(config.rules["test-rule"], [2]);
		});

		it("should normalize rules with options", () => {
			const mockRule = createMockRule();
			const config = new Config(
				createBasicConfigOptions({
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
				}),
			);

			assert.deepStrictEqual(config.rules["test-rule"], [
				1,
				{ option1: true },
			]);
		});

		it("should apply rule's defaultOptions when present", () => {
			const mockRule = createMockRule({
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
			});

			const config = new Config(
				createBasicConfigOptions({
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
				}),
			);

			assert.deepStrictEqual(config.rules["test-rule"], [
				2,
				{ defaultOption: true, option1: true },
			]);
		});
	});

	describe("getRuleDefinition", () => {
		it("should retrieve rule definition from plugins", () => {
			const mockRule = { meta: {} };
			const config = new Config(
				createBasicConfigOptions({
					plugins: {
						test: {
							languages: {
								lang: createMockLanguage(),
							},
							rules: {
								"test-rule": mockRule,
							},
						},
					},
				}),
			);

			const rule = config.getRuleDefinition("test/test-rule");
			assert.strictEqual(rule, mockRule);
		});

		it("should retrieve core rule definition", () => {
			const mockRule = { meta: {} };
			const config = new Config(
				createBasicConfigOptions({
					plugins: {
						test: {
							languages: {
								lang: createMockLanguage(),
							},
						},
						"@": {
							rules: {
								"core-rule": mockRule,
							},
						},
					},
				}),
			);

			const rule = config.getRuleDefinition("core-rule");
			assert.strictEqual(rule, mockRule);
		});
	});

	describe("toJSON", () => {
		it("should convert config to JSON representation", () => {
			const mockLanguage = createMockLanguage();
			const mockProcessor = createMockProcessor();
			const mockPlugin = createMockPlugin();

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
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				language: "test/lang",
				processor: "testProcessor@1.0.0",
				languageOptions: {
					ecmaVersion: 2022,
					sourceType: "module",
					parser: "testParser",
				},
			});
		});

		it("should serialize when a language option has a toJSON() method and a function", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.syntax.toJSON = () => "syntax";
					return options;
				},
			});

			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						atrule: {
							name() {},
						},
					},
				},
			});
			const json = config.toJSON();
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				processor: void 0,
				language: "test/lang",
				languageOptions: {
					syntax: "syntax",
				},
			});
		});

		it("should pass through the value when toJSON is not a function", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.syntax.toJSON = "not a function";
					return options;
				},
			});

			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						toJSON: "not a function",
					},
				},
			});
			const json = config.toJSON();
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				processor: void 0,
				language: "test/lang",
				languageOptions: {
					syntax: {
						toJSON: "not a function",
					},
				},
			});
		});

		it("should only call toJSON on a parent and not on a child object", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.syntax.block.toJSON = () => "block";
					options.syntax.block.selector.toJSON = () => "selector";
					return options;
				},
			});

			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						block: {
							selector: {
								value: "test",
							},
						},
					},
				},
			});
			const json = config.toJSON();
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				processor: void 0,
				language: "test/lang",
				languageOptions: {
					syntax: {
						block: "block",
					},
				},
			});
		});

		it("should call languageOptions.toJSON() when present instead of serializing the object", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.toJSON = () => "languageOptions";
					return options;
				},
			});

			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						someValue: "string",
					},
				},
			});

			const json = config.toJSON();
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				processor: void 0,
				language: "test/lang",
				languageOptions: "languageOptions",
			});
		});

		it("should call toJSON() on language option even when object has meta information", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.someObject.toJSON = () => "someObject";
					return options;
				},
			});
			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					someObject: {
						meta: {
							name: "testMeta",
						},
					},
				},
			});
			const json = config.toJSON();
			assert.deepStrictEqual(json, {
				plugins: ["test:testPlugin@1.0.0"],
				processor: void 0,
				language: "test/lang",
				languageOptions: {
					someObject: "someObject",
				},
			});
		});

		it("should throw an error when toJSON() returns a function", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.syntax.toJSON = () => () => "function";
					return options;
				},
			});

			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});

			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						someValue: "string",
					},
				},
			});

			assert.throws(() => {
				config.toJSON();
			}, 'Cannot serialize key "syntax" in "languageOptions": Function values are not supported.');
		});

		it("should throw an error when languageOptions.toJSON() returns a function", () => {
			const mockLanguage = createMockLanguage({
				normalizeLanguageOptions(options) {
					options.toJSON = () => () => "function";
					return options;
				},
			});
			const mockPlugin = createMockPlugin({
				languages: {
					lang: mockLanguage,
				},
			});
			const config = new Config({
				language: "test/lang",
				plugins: {
					test: mockPlugin,
				},
				languageOptions: {
					syntax: {
						someValue: "string",
					},
				},
			});
			assert.throws(() => {
				config.toJSON();
			}, 'Cannot serialize key "toJSON" in "languageOptions": Function values are not supported.');
		});

		it("should throw when processor doesn't have meta information", () => {
			const mockLanguage = createMockLanguage({
				meta: {
					name: "testLang",
				},
			});

			const mockProcessor = createMockProcessor({
				meta: void 0, // Missing meta property
			});
			delete mockProcessor.meta; // Completely remove meta

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

	describe("validateRulesConfig", () => {
		let config;

		const mockRule = createMockRule({
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
		});

		beforeEach(() => {
			config = new Config(
				createBasicConfigOptions({
					plugins: {
						test: {
							languages: {
								lang: createMockLanguage(),
							},
						},
						"@": {
							rules: {
								"error-rule": {},
								"warn-rule": {},
								"off-rule": {},
								"test-rule": mockRule,
								"test-broken-rule": {
									meta: { schema: 123 }, // Invalid schema
								},
								"test-no-schema": {
									meta: { schema: false }, // No schema
								},
							},
						},
					},
					rules: {
						"error-rule": "error",
						"warn-rule": "warn",
						"off-rule": "off",
					},
				}),
			);
		});

		it("should throw when config is not provided", () => {
			assert.throws(() => {
				config.validateRulesConfig();
			}, "Config is required for validation.");
		});

		it("should not validate disabled rules", () => {
			// This should not throw
			config.validateRulesConfig({
				"error-rule": ["off"],
			});
		});

		it("should throw when rule is not found", () => {
			assert.throws(() => {
				config.validateRulesConfig({
					"test/missing-rule": ["error"],
				});
			}, /Could not find "missing-rule" in plugin "test"/u);
		});

		it("should throw when rule options don't match schema", () => {
			assert.throws(() => {
				config.validateRulesConfig({
					"test-rule": ["error", { invalid: true }],
				});
			}, /Unexpected property "invalid"/u);
		});

		it("should throw when rule schema is invalid", () => {
			assert.throws(() => {
				config.validateRulesConfig({
					"test-broken-rule": ["error"],
				});
			}, /Rule's `meta.schema` must be an array or object/u);
		});

		it("should validate rule options successfully", () => {
			config.validateRulesConfig({
				"test-rule": ["error", { valid: true }],
			});
		});

		it("should skip validation when `meta.schema` is false", () => {
			// This should not throw, even with invalid options
			config.validateRulesConfig({
				"test-no-schema": [
					"error",
					"this",
					"would",
					"normally",
					"fail",
				],
			});
		});

		it("should skip __proto__ in rules", () => {
			const rules = { "test-rule": ["error"] };

			/* eslint-disable-next-line no-proto -- Testing __proto__ behavior */
			rules.__proto__ = ["error"];

			config.validateRulesConfig(rules);
		});
	});
});
