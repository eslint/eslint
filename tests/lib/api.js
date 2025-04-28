/**
 * @fileoverview Tests for api.
 * @author Gyandeep Singh
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const assert = require("node:assert"),
	api = require("../../lib/api"),
	{ LegacyESLint } = require("../../lib/eslint/legacy-eslint");

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("api", () => {
	it("should have ESLint exposed", () => {
		assert.strictEqual(typeof api.ESLint, "function");
	});

	it("should have RuleTester exposed", () => {
		assert.strictEqual(typeof api.RuleTester, "function");
	});

	it("should not have CLIEngine exposed", () => {
		assert.strictEqual(typeof api.CLIEngine, "undefined");
	});

	it("should not have linter exposed", () => {
		assert.strictEqual(typeof api.linter, "undefined");
	});

	it("should have Linter exposed", () => {
		assert.strictEqual(typeof api.Linter, "function");
	});

	it("should have SourceCode exposed", () => {
		assert.strictEqual(typeof api.SourceCode, "function");
	});

	describe("loadESLint", () => {
		afterEach(() => {
			delete process.env.ESLINT_USE_FLAT_CONFIG;
		});

		it("should be a function", () => {
			assert.strictEqual(typeof api.loadESLint, "function");
		});

		it("should return a Promise", () => {
			assert.ok(api.loadESLint() instanceof Promise);
		});

		it("should return ESLint when useFlatConfig is true", async () => {
			assert.strictEqual(
				await api.loadESLint({ useFlatConfig: true }),
				api.ESLint,
			);
		});

		it("should return LegacyESLint when useFlatConfig is false", async () => {
			assert.strictEqual(
				await api.loadESLint({ useFlatConfig: false }),
				LegacyESLint,
			);
		});

		it("should return ESLint when useFlatConfig is not provided", async () => {
			assert.strictEqual(await api.loadESLint(), api.ESLint);
		});

		it("should return LegacyESLint when useFlatConfig is not provided and ESLINT_USE_FLAT_CONFIG is false", async () => {
			process.env.ESLINT_USE_FLAT_CONFIG = "false";
			assert.strictEqual(await api.loadESLint(), LegacyESLint);
		});

		it("should return ESLint when useFlatConfig is not provided and ESLINT_USE_FLAT_CONFIG is true", async () => {
			process.env.ESLINT_USE_FLAT_CONFIG = "true";
			assert.strictEqual(await api.loadESLint(), api.ESLint);
		});
	});
});
