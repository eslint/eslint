/**
 * @fileoverview Tests for eslint-config-eslint.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const baseConfigs = require("../../packages/eslint-config-eslint/base");
const cjsConfig = require("../../packages/eslint-config-eslint/cjs");
const eslintConfig = require("../../packages/eslint-config-eslint");
const formattingConfig = require("../../packages/eslint-config-eslint/formatting");
const {
	cjsConfigs,
	esmConfigs,
} = require("../../packages/eslint-config-eslint/nodejs");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eslint-config-eslint", () => {
	it("should export base configs without file globs", () => {
		assert.isArray(baseConfigs);
		assert.isAtLeast(baseConfigs.length, 1);
		baseConfigs.forEach(config => assert.notProperty(config, "files"));
		assert.includeMembers(
			baseConfigs.map(config => config.name).filter(Boolean),
			[
				"eslint-config-eslint/base",
				"eslint-config-eslint/eslint-comments",
				"eslint-config-eslint/js",
				"eslint-config-eslint/jsdoc",
				"eslint-config-eslint/unicorn",
			],
		);
	});

	it("should append CommonJS-specific configs without file globs", () => {
		assert.deepStrictEqual(cjsConfig, [...baseConfigs, ...cjsConfigs]);
		cjsConfig.forEach(config => assert.notProperty(config, "files"));
	});

	it("should scope Node-specific configs by file extension", () => {
		assert.deepStrictEqual(eslintConfig, [
			...baseConfigs,
			...esmConfigs.map(config => ({
				files: ["**/*.js"],
				...config,
			})),
			...cjsConfigs.map(config => ({
				files: ["**/*.cjs"],
				...config,
			})),
		]);
	});

	it("should export formatting rules as a single rules object", () => {
		assert.deepStrictEqual(Object.keys(formattingConfig), ["rules"]);
		assert.deepStrictEqual(formattingConfig.rules.indent, [
			"error",
			4,
			{ SwitchCase: 1 },
		]);
		assert.deepStrictEqual(formattingConfig.rules.quotes, [
			"error",
			"double",
			{ avoidEscape: true },
		]);
		assert.strictEqual(formattingConfig.rules.semi, "error");
	});
});
