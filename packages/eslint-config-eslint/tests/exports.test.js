"use strict";

const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const baseConfigs = require("../base");
const cjsConfig = require("../cjs");
const eslintConfig = require("..");
const formattingConfig = require("../formatting");
const { cjsConfigs, esmConfigs } = require("../nodejs");

describe("eslint-config-eslint", () => {
	it("exports base configs without file globs", () => {
		assert.ok(Array.isArray(baseConfigs));
		assert.ok(baseConfigs.length >= 1);
		baseConfigs.forEach(config =>
			assert.ok(!Object.hasOwn(config, "files")),
		);

		const configNames = new Set(
			baseConfigs.map(config => config.name).filter(Boolean),
		);

		[
			"eslint-config-eslint/base",
			"eslint-config-eslint/eslint-comments",
			"eslint-config-eslint/js",
			"eslint-config-eslint/jsdoc",
			"eslint-config-eslint/unicorn",
		].forEach(name => assert.ok(configNames.has(name)));
	});

	it("appends CommonJS-specific configs without file globs", () => {
		assert.deepStrictEqual(cjsConfig, [...baseConfigs, ...cjsConfigs]);
		cjsConfig.forEach(config => assert.ok(!Object.hasOwn(config, "files")));
	});

	it("scopes Node-specific configs by file extension", () => {
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

	it("exports formatting rules as a single rules object", () => {
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
