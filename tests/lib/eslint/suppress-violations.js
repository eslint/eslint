/**
 * @fileoverview Tests for suppressions API methods
 * @author Iacovos Constantinou
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("node:assert");
const fs = require("node:fs/promises");
const path = require("node:path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("suppressViolations, pruneUnusedSuppressions, and applySuppressions", () => {
	const fixturePath = path.join(__dirname, "../../fixtures/suppressions-test");
	const suppressionsFile = path.join(fixturePath, "eslint-suppressions.json");

	beforeEach(async () => {
		// Create the fixture directory if it doesn't exist
		await fs.mkdir(fixturePath, { recursive: true });
	});

	afterEach(async () => {
		// Clean up suppressions file after each test
		try {
			await fs.unlink(suppressionsFile);
		} catch (e) {
			// File might not exist, which is fine
		}
	});

	it("should have the suppressViolations method", () => {
		const { ESLint } = require("../../../lib/eslint/eslint");
		const eslint = new ESLint({
			cwd: fixturePath,
			overrideConfig: { rules: {} },
			ignore: false
		});

		assert.ok(eslint.suppressViolations);
		assert.strictEqual(typeof eslint.suppressViolations, "function");
	});

	it("should have the pruneUnusedSuppressions method", () => {
		const { ESLint } = require("../../../lib/eslint/eslint");
		const eslint = new ESLint({
			cwd: fixturePath,
			overrideConfig: { rules: {} },
			ignore: false
		});

		assert.ok(eslint.pruneUnusedSuppressions);
		assert.strictEqual(typeof eslint.pruneUnusedSuppressions, "function");
	});

	it("should have the applySuppressions method", () => {
		const { ESLint } = require("../../../lib/eslint/eslint");
		const eslint = new ESLint({
			cwd: fixturePath,
			overrideConfig: { rules: {} },
			ignore: false
		});

		assert.ok(eslint.applySuppressions);
		assert.strictEqual(typeof eslint.applySuppressions, "function");
	});
});