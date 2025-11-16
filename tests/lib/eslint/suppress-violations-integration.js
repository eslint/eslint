/**
 * @fileoverview Integration test for the new bulk suppression API
 * @author Iacovos Constantinou
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("Integration Test: Bulk Suppression API", () => {
	let tempDir;
	let suppressionsFile;
	let eslint;

	beforeEach(async () => {
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "eslint-integration-test-"));
		suppressionsFile = path.join(tempDir, "eslint-suppressions.json");
	});

	afterEach(async () => {
		await fs.rm(tempDir, { recursive: true, force: true });
	});

	it("should allow full workflow: lint, suppress, apply suppressions via Node.js API", async () => {
		const { ESLint } = require("../../../lib/eslint/eslint");

		// Create config file in temp directory
		await fs.writeFile(path.join(tempDir, "eslint.config.js"),
			"module.exports = [{ rules: { 'no-undef': 'error' } }];"
		);

		// Create ESLint instance
		eslint = new ESLint({
			cwd: tempDir,
			// Use overrideConfig instead of relying on config file discovery
			overrideConfig: {
				languageOptions: {
					ecmaVersion: "latest",
					sourceType: "module",
					globals: {}
				},
				rules: {
					"no-undef": "error"
				}
			},
			ignore: false
		});

		// Create a test file with violations
		const testFilePath = path.join(tempDir, "test.js");
		await fs.writeFile(testFilePath, "var a = b; console.log(c);"); // 2 no-undef violations

		// Lint the file to get initial results
		const initialResults = await eslint.lintFiles([testFilePath]);
		assert.strictEqual(initialResults.length, 1);
		assert.strictEqual(initialResults[0].errorCount, 2); // 2 no-undef errors
		assert.strictEqual(initialResults[0].suppressedMessages.length, 0);

		// Suppress all violations for this file
		await eslint.suppressViolations(initialResults, { 
			suppressionsLocation: "eslint-suppressions.json"
		});

		// Verify suppressions file was created
		assert.ok(await fs.stat(suppressionsFile));

		// Lint again - should still have violations since we haven't applied suppressions yet
		const freshResults = await eslint.lintFiles([testFilePath]);
		assert.strictEqual(freshResults[0].errorCount, 2);
		assert.strictEqual(freshResults[0].suppressedMessages.length, 0);

		// Apply suppressions to fresh results
		const { results: appliedResults } = await eslint.applySuppressions(freshResults, { 
			suppressionsLocation: "eslint-suppressions.json"
		});

		// Verify that errors were suppressed after applying
		assert.strictEqual(appliedResults[0].errorCount, 0);
		assert.strictEqual(appliedResults[0].suppressedMessages.length, 2);

		// Test selective rule suppression
		await fs.writeFile(testFilePath, "var a = b; var x = y;"); // 2 no-undef violations
		
		const newResults = await eslint.lintFiles([testFilePath]);
		assert.strictEqual(newResults[0].errorCount, 2);

		// Suppress only specific rule
		await eslint.suppressViolations(newResults, { 
			rules: ["no-undef"],
			suppressionsLocation: "eslint-suppressions.json"
		});

		// Prune unused suppressions
		await eslint.pruneUnusedSuppressions(newResults, { 
			suppressionsLocation: "eslint-suppressions.json"
		});
	});

	it("should expose all required methods in the ESLint API", () => {
		const { ESLint } = require("../../../lib/eslint/eslint");
		eslint = new ESLint({
			cwd: tempDir,
			overrideConfig: { rules: {} },
			ignore: false
		});

		// Verify all required methods exist
		assert.ok(eslint.suppressViolations);
		assert.ok(eslint.pruneUnusedSuppressions);
		assert.ok(eslint.applySuppressions);
		
		// Verify they are functions
		assert.strictEqual(typeof eslint.suppressViolations, "function");
		assert.strictEqual(typeof eslint.pruneUnusedSuppressions, "function");
		assert.strictEqual(typeof eslint.applySuppressions, "function");
	});
});