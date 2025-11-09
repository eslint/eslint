/**
 * @fileoverview ESLint configuration file
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("node:path");
const internalPlugin = require("./tools/internal-rules");
const eslintPluginRulesRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/rules-recommended");
const eslintPluginTestsRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/tests-recommended");
const globals = require("globals");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const eslintPluginYml = require("eslint-plugin-yml");
const json = require("@eslint/json").default;
const expectType = require("eslint-plugin-expect-type");
const tsParser = require("@typescript-eslint/parser");
const { defineConfig, globalIgnores } = require("./lib/config-api.js");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const INTERNAL_PATHS = {
	CLI_ENGINE_PATTERN: "lib/cli-engine/**/*",
	LINTER_PATTERN: "lib/linter/**/*",
	RULE_TESTER_PATTERN: "lib/rule-tester/**/*",
	RULES_PATTERN: "lib/rules/**/*",
	SOURCE_CODE_PATTERN: "lib/source-code/**/*",
};

// same paths but with `.js` at the end
const INTERNAL_FILES = Object.fromEntries(
	Object.entries(INTERNAL_PATHS).map(([key, value]) => [key, `${value}.js`]),
);

const ALL_JS_FILES = "**/*.js";
const ALL_YAML_FILES = "**/*.y?(a)ml";

/**
 * Resolve an absolute path or glob pattern.
 * @param {string} pathOrPattern the path or glob pattern.
 * @returns {string} The resolved path or glob pattern.
 */
function resolveAbsolutePath(pathOrPattern) {
	return path.resolve(__dirname, pathOrPattern);
}

/**
 * Create an array of `no-restricted-require` entries for ESLint's core files.
 * @param {string} [pattern] The glob pattern to create the entries for.
 * @returns {Object[]} The array of `no-restricted-require` entries.
 */
function createInternalFilesPatterns(pattern = null) {
	return Object.values(INTERNAL_PATHS)
		.filter(p => p !== pattern)
		.map(p => ({
			name: [
				// Disallow all children modules.
				resolveAbsolutePath(p),

				// Allow the main `index.js` module.
				`!${resolveAbsolutePath(p.replace(/\*\*\/\*$/u, "index.js"))}`,
			],
		}));
}

/**
 * @type {import("./lib/types/index.js").Linter.Config[]}
 */
module.exports = defineConfig([
	{
		name: "eslint/cjs",
		files: [ALL_JS_FILES],
		extends: [eslintConfigESLintCJS],
	},
	globalIgnores(
		[
			"build/**",
			"coverage/**",
			"docs/!(src|tools)/",
			"docs/src/!(_data)",
			"jsdoc/**",
			"lib/types/**/*.ts",
			"templates/**",
			"tests/bench/**",
			"tests/fixtures/**",
			"tests/performance/**",
			"tmp/**",
			"**/test.js",
			".vscode",
		],
		"eslint/global-ignores",
	),
	{
		name: "eslint/internal-rules",
		files: [ALL_JS_FILES],
		plugins: {
			"internal-rules": internalPlugin,
		},
		languageOptions: {
			ecmaVersion: "latest",
		},
		rules: {
			"internal-rules/multiline-comment-style": "error",
		},
	},
	{
		name: "eslint/tools",
		files: ["tools/*.js", "docs/tools/*.js"],
		rules: {
			"no-console": "off",
			"n/no-process-exit": "off",
		},
	},
	{
		name: "eslint/rules",
		files: ["lib/rules/*.js", "tools/internal-rules/*.js"],
		ignores: ["**/index.js"],
		extends: [eslintPluginRulesRecommendedConfig],
		rules: {
			"eslint-plugin/prefer-placeholders": "error",
			"eslint-plugin/prefer-replace-text": "error",
			"eslint-plugin/report-message-format": ["error", "^[^a-z].*\\.$"],
			"eslint-plugin/require-meta-docs-description": [
				"error",
				{ pattern: "^(Enforce|Require|Disallow) .+[^. ]$" },
			],
			"internal-rules/no-invalid-meta": "error",
		},
	},
	{
		name: "eslint/core-rules",
		files: ["lib/rules/*.js"],
		ignores: ["**/index.js"],
		rules: {
			"eslint-plugin/require-meta-docs-url": [
				"error",
				{ pattern: "https://eslint.org/docs/latest/rules/{{name}}" },
			],
		},
	},
	{
		name: "eslint/rules-tests",
		files: ["tests/lib/rules/*.js", "tests/tools/internal-rules/*.js"],
		extends: [eslintPluginTestsRecommendedConfig],
		rules: {
			"eslint-plugin/test-case-property-ordering": [
				"error",
				[
					"name",
					"filename",
					"code",
					"output",
					"options",
					"languageOptions",
					"errors",
				],
			],
			"eslint-plugin/test-case-shorthand-strings": "error",
			"no-useless-concat": "off",
		},
	},
	{
		name: "eslint/tests",
		files: ["tests/**/*.js"],
		ignores: ["tests/lib/rules/*.js", "tests/tools/internal-rules/*.js"],
		languageOptions: {
			globals: {
				...globals.mocha,
			},
		},
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector:
						"CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
					message:
						"`assert.doesNotThrow()` should be replaced with a comment next to the code.",
				},
			],
		},
	},

	// JSON files
	{
		name: "eslint/json",
		files: ["**/*.json", ".c8rc"],
		ignores: ["**/package-lock.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"],
	},

	// JSONC files
	{
		name: "eslint/jsonc",
		files: ["knip.jsonc"],
		plugins: { json },
		language: "json/jsonc",
		languageOptions: { allowTrailingCommas: true },
		extends: ["json/recommended"],
	},

	// JSON5 files
	{
		name: "eslint/json5",
		files: ["**/*.json5"],
		plugins: { json },
		language: "json/json5",
		extends: ["json/recommended"],
	},

	// Restrict relative path imports
	{
		name: "eslint/lib",
		files: ["lib/*.js"],
		ignores: ["lib/unsupported-api.js", "lib/universal.js"],
		rules: {
			"n/no-restricted-require": [
				"error",
				[...createInternalFilesPatterns()],
			],
		},
	},
	{
		name: "eslint/cli-engine",
		files: [INTERNAL_FILES.CLI_ENGINE_PATTERN],
		rules: {
			"n/no-restricted-require": [
				"error",
				[
					...createInternalFilesPatterns(
						INTERNAL_PATHS.CLI_ENGINE_PATTERN,
					),
				],
			],
		},
	},
	{
		name: "eslint/linter",
		files: [INTERNAL_FILES.LINTER_PATTERN],
		rules: {
			"n/no-restricted-require": [
				"error",
				[
					...createInternalFilesPatterns(
						INTERNAL_PATHS.LINTER_PATTERN,
					),
					"fs",
					resolveAbsolutePath("lib/cli-engine/index.js"),
					resolveAbsolutePath("lib/rule-tester/index.js"),
				],
			],
		},
	},
	{
		name: "eslint/rules",
		files: [INTERNAL_FILES.RULES_PATTERN],
		rules: {
			"n/no-restricted-require": [
				"error",
				[
					...createInternalFilesPatterns(
						INTERNAL_PATHS.RULES_PATTERN,
					),
					"fs",
					resolveAbsolutePath("lib/cli-engine/index.js"),
					resolveAbsolutePath("lib/linter/index.js"),
					resolveAbsolutePath("lib/rule-tester/index.js"),
					resolveAbsolutePath("lib/source-code/index.js"),
				],
			],
		},
	},
	{
		name: "eslint/shared",
		files: ["lib/shared/**/*.js"],
		rules: {
			"n/no-restricted-require": [
				"error",
				[
					...createInternalFilesPatterns(),
					resolveAbsolutePath("lib/cli-engine/index.js"),
					resolveAbsolutePath("lib/linter/index.js"),
					resolveAbsolutePath("lib/rule-tester/index.js"),
					resolveAbsolutePath("lib/source-code/index.js"),
				],
			],
		},
	},
	{
		name: "eslint/source-code",
		files: [INTERNAL_FILES.SOURCE_CODE_PATTERN],
		rules: {
			"n/no-restricted-require": [
				"error",
				[
					...createInternalFilesPatterns(
						INTERNAL_PATHS.SOURCE_CODE_PATTERN,
					),
					"fs",
					resolveAbsolutePath("lib/cli-engine/index.js"),
					resolveAbsolutePath("lib/linter/index.js"),
					resolveAbsolutePath("lib/rule-tester/index.js"),
					resolveAbsolutePath("lib/rules/index.js"),
				],
			],
		},
	},
	{
		name: "eslint/rule-tester",
		files: [INTERNAL_FILES.RULE_TESTER_PATTERN],
		rules: {
			"n/no-restricted-require": [
				"error",
				[resolveAbsolutePath("lib/cli-engine/index.js")],
			],
		},
	},
	...eslintPluginYml.configs["flat/recommended"].map(config => ({
		...config,
		files: [ALL_YAML_FILES],
	})),
	{
		name: "eslint/ts-rules",
		files: ["tests/lib/types/*.ts", "packages/**/*.{ts,mts,cts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: [
					"tests/lib/types/tsconfig.json",
					"packages/js/tests/types/tsconfig.json",
					"packages/eslint-config-eslint/tsconfig.json",
				],
			},
		},
		plugins: {
			"expect-type": expectType,
		},
		rules: {
			"expect-type/expect": "error",
		},
	},
	{
		name: "eslint/bin",
		files: ["bin/eslint.js"],
		rules: {
			/*
			 * it was introduced in Node.js v22.8.0
			 * refs: https://nodejs.org/en/blog/release/v22.8.0#new-js-api-for-compile-cache
			 */
			"n/no-unsupported-features/node-builtins": [
				2,
				{ ignores: ["module.enableCompileCache"] },
			],
		},
	},
	{
		name: "eslint/pnpm-test",
		files: ["tests/pnpm/**/*.js"],
		languageOptions: { sourceType: "module" },
	},
]);
