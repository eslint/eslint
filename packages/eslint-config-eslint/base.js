"use strict";

const js = require("@eslint/js");
const jsdoc = require("eslint-plugin-jsdoc");
const eslintCommentsPluginConfigs = require("@eslint-community/eslint-plugin-eslint-comments/configs");
const unicorn = require("eslint-plugin-unicorn");
const regexp = require("eslint-plugin-regexp");

// extends eslint recommended config
/**
 * @type {import("eslint").Linter.Config[]}
 */
const jsConfigs = [
	js.configs.recommended,
	{
		name: "eslint-config-eslint/js",
		rules: {
			"array-callback-return": "error",
			"arrow-body-style": ["error", "as-needed"],
			camelcase: "error",
			"class-methods-use-this": "error",
			"consistent-return": "error",
			curly: ["error", "all"],
			"default-case": "error",
			"default-case-last": "error",
			"default-param-last": "error",
			"dot-notation": ["error", { allowKeywords: true }],
			eqeqeq: "error",
			"func-style": ["error", "declaration"],
			"grouped-accessor-pairs": "error",
			"guard-for-in": "error",
			"new-cap": "error",
			"no-alert": "error",
			"no-array-constructor": "error",
			"no-caller": "error",
			"no-console": "error",
			"no-constructor-return": "error",
			"no-else-return": ["error", { allowElseIf: false }],
			"no-eval": "error",
			"no-extend-native": "error",
			"no-extra-bind": "error",
			"no-implied-eval": "error",
			"no-inner-declarations": "error",
			"no-invalid-this": "error",
			"no-iterator": "error",
			"no-label-var": "error",
			"no-labels": "error",
			"no-lone-blocks": "error",
			"no-loop-func": "error",
			"no-multi-str": "error",
			"no-nested-ternary": "error",
			"no-new": "error",
			"no-new-func": "error",
			"no-new-wrappers": "error",
			"no-object-constructor": "error",
			"no-octal-escape": "error",
			"no-param-reassign": "error",
			"no-proto": "error",
			"no-process-exit": "off",
			"no-restricted-properties": [
				"error",
				{
					object: "assert",
					property: "equal",
					message: "Use assert.strictEqual instead of assert.equal.",
				},
				{
					object: "assert",
					property: "notEqual",
					message:
						"Use assert.notStrictEqual instead of assert.notEqual.",
				},
				{
					object: "assert",
					property: "deepEqual",
					message:
						"Use assert.deepStrictEqual instead of assert.deepEqual.",
				},
				{
					object: "assert",
					property: "notDeepEqual",
					message:
						"Use assert.notDeepStrictEqual instead of assert.notDeepEqual.",
				},
			],
			"no-return-assign": "error",
			"no-script-url": "error",
			"no-self-compare": "error",
			"no-sequences": "error",
			"no-shadow": "error",
			"no-throw-literal": "error",
			"no-undef": ["error", { typeof: true }],
			"no-undef-init": "error",
			"no-undefined": "error",
			"no-underscore-dangle": ["error", { allowAfterThis: true }],
			"no-unmodified-loop-condition": "error",
			"no-unneeded-ternary": "error",
			"no-unreachable-loop": "error",
			"no-unused-expressions": "error",
			"no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "after-used",
					caughtErrors: "all",
				},
			],
			"no-use-before-define": "error",
			"no-useless-call": "error",
			"no-useless-computed-key": "error",
			"no-useless-concat": "error",
			"no-useless-constructor": "error",
			"no-useless-rename": "error",
			"no-useless-return": "error",
			"no-var": "error",
			"object-shorthand": [
				"error",
				"always",
				{
					avoidExplicitReturnArrows: true,
				},
			],
			"operator-assignment": "error",
			"prefer-arrow-callback": "error",
			"prefer-const": "error",
			"prefer-exponentiation-operator": "error",
			"prefer-numeric-literals": "error",
			"prefer-object-has-own": "error",
			"prefer-promise-reject-errors": "error",
			"prefer-regex-literals": "error",
			"prefer-rest-params": "error",
			"prefer-spread": "error",
			"prefer-template": "error",
			radix: "error",
			"require-unicode-regexp": "error",
			strict: ["error", "global"],
			"symbol-description": "error",
			"unicode-bom": "error",
			yoda: ["error", "never", { exceptRange: true }],
		},
	},
];

// extends eslint-plugin-jsdoc's recommended config
/**
 * @type {import("eslint").Linter.Config[]}
 */
const jsdocConfigs = [
	jsdoc.configs["flat/recommended"],
	{
		name: "eslint-config-eslint/jsdoc",
		settings: {
			jsdoc: {
				mode: "typescript",
				tagNamePreference: {
					file: "fileoverview",
					augments: "extends",
					class: "constructor",
				},
				preferredTypes: {
					"*": {
						message:
							"Use a more precise type or if necessary use `any` or `ArbitraryCallbackResult`",
						replacement: "any",
					},
					Any: {
						message:
							"Use a more precise type or if necessary use `any` or `ArbitraryCallbackResult`",
						replacement: "any",
					},
					function: {
						message:
							"Point to a `@callback` namepath or `Function` if truly arbitrary in form",
						replacement: "Function",
					},
					Promise: {
						message:
							"Specify the specific Promise type, including, if necessary, the type `any`",
					},
					".<>": {
						message: "Prefer type form without dot",
						replacement: "<>",
					},
					object: {
						message:
							"Use the specific object type or `Object` if truly arbitrary",
						replacement: "Object",
					},
					array: "Array",
				},
			},
		},
		rules: {
			"jsdoc/check-syntax": "error",
			"jsdoc/check-values": ["error", { allowedLicenses: true }],
			"jsdoc/no-bad-blocks": "error",
			"jsdoc/no-defaults": "off",
			"jsdoc/reject-any-type": "off",
			"jsdoc/reject-function-type": "off",
			"jsdoc/require-asterisk-prefix": "error",
			"jsdoc/require-description": [
				"error",
				{ checkConstructors: false },
			],
			"jsdoc/require-hyphen-before-param-description": ["error", "never"],
			"jsdoc/require-returns": [
				"error",
				{
					forceRequireReturn: true,
					forceReturnsWithAsync: true,
				},
			],
			"jsdoc/require-throws": "error",
			"jsdoc/require-throws-type": "off",
			"jsdoc/tag-lines": [
				"error",
				"never",
				{
					tags: {
						example: { lines: "always" },
						fileoverview: { lines: "any" },
					},
					startLines: 0,
				},
			],
			"jsdoc/no-undefined-types": "off",
			"jsdoc/require-yields": "off",
			"jsdoc/check-access": "error",
			"jsdoc/check-alignment": "error",
			"jsdoc/check-param-names": "error",
			"jsdoc/check-property-names": "error",
			"jsdoc/check-tag-names": "error",
			"jsdoc/check-types": "error",
			"jsdoc/empty-tags": "error",
			"jsdoc/implements-on-classes": "error",
			"jsdoc/multiline-blocks": "error",
			"jsdoc/no-multi-asterisks": ["error", { allowWhitespace: true }],
			"jsdoc/require-jsdoc": [
				"error",
				{ require: { ClassDeclaration: true } },
			],
			"jsdoc/require-next-type": "off",
			"jsdoc/require-param": "error",
			"jsdoc/require-param-description": "error",
			"jsdoc/require-param-name": "error",
			"jsdoc/require-param-type": "error",
			"jsdoc/require-property": "error",
			"jsdoc/require-property-description": "error",
			"jsdoc/require-property-name": "error",
			"jsdoc/require-property-type": "error",
			"jsdoc/require-returns-check": "error",
			"jsdoc/require-returns-description": "error",
			"jsdoc/require-returns-type": "error",
			"jsdoc/require-yields-check": "error",
			"jsdoc/require-yields-type": "off",
			"jsdoc/valid-types": "error",
		},
	},
];

// extends eslint-plugin-unicorn's config
/**
 * @type {import("eslint").Linter.Config[]}
 */
const unicornConfigs = [
	{
		name: "eslint-config-eslint/unicorn",
		plugins: { unicorn },
		rules: {
			"unicorn/prefer-array-find": "error",
			"unicorn/prefer-array-flat-map": "error",
			"unicorn/prefer-array-flat": "error",
			"unicorn/prefer-array-index-of": "error",
			"unicorn/prefer-array-some": "error",
			"unicorn/prefer-at": "error",
			"unicorn/prefer-includes": "error",
			"unicorn/prefer-set-has": "error",
			"unicorn/prefer-string-slice": "error",
			"unicorn/prefer-string-starts-ends-with": "error",
			"unicorn/prefer-string-trim-start-end": "error",
		},
	},
];

// extends @eslint-community/eslint-plugin-eslint-comments's recommended config
/**
 * @type {import("eslint").Linter.Config[]}
 */
const eslintCommentsConfigs = [
	eslintCommentsPluginConfigs.recommended,
	{
		name: "eslint-config-eslint/eslint-comments",
		rules: {
			"@eslint-community/eslint-comments/disable-enable-pair": ["error"],
			"@eslint-community/eslint-comments/require-description": "error",
		},
	},
];

// extends eslint-plugin-regexp's recommended config
/**
 * @type {import("eslint").Linter.Config[]}
 */
const regexpConfigs = [regexp.configs["flat/recommended"]];

/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = [
	{
		name: "eslint-config-eslint/base",
		linterOptions: {
			reportUnusedDisableDirectives: "error",
			reportUnusedInlineConfigs: "error",
		},
	},
	...unicornConfigs,
	...jsdocConfigs,
	...eslintCommentsConfigs,
	...regexpConfigs,
	...jsConfigs,
];
