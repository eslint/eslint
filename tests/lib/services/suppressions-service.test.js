/**
 * @fileoverview Tests for SuppressionsService
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
const { SuppressionsService } = require("../../../lib/services/suppressions-service");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SuppressionsService", () => {
	let tempDir;
	let suppressionsFile;

	beforeEach(async () => {
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "eslint-test-"));
		suppressionsFile = path.join(tempDir, "eslint-suppressions.json");
	});

	afterEach(async () => {
		await fs.rm(tempDir, { recursive: true, force: true });
	});

	describe("suppress", () => {
		it("should create suppressions file when it doesn't exist", async () => {
			const service = new SuppressionsService({
				filePath: suppressionsFile,
				cwd: tempDir,
			});

			const results = [{
				filePath: path.join(tempDir, "test.js"),
				messages: [
					{ ruleId: "no-undef", severity: 2, message: "test", line: 1, column: 1 },
					{ ruleId: "no-unused-vars", severity: 2, message: "test", line: 2, column: 1 }
				],
				suppressedMessages: [],
				errorCount: 2,
				warningCount: 0,
				fatalErrorCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0
			}];

			await service.suppress(results);

			const content = await fs.readFile(suppressionsFile, "utf8");
			const suppressions = JSON.parse(content);

			assert.deepStrictEqual(suppressions, {
				"test.js": {
					"no-undef": { count: 1 },
					"no-unused-vars": { count: 1 }
				}
			});
		});

		it("should suppress only specified rules", async () => {
			const service = new SuppressionsService({
				filePath: suppressionsFile,
				cwd: tempDir,
			});

			const results = [{
				filePath: path.join(tempDir, "test.js"),
				messages: [
					{ ruleId: "no-undef", severity: 2, message: "test", line: 1, column: 1 },
					{ ruleId: "no-unused-vars", severity: 2, message: "test", line: 2, column: 1 }
				],
				suppressedMessages: [],
				errorCount: 2,
				warningCount: 0,
				fatalErrorCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0
			}];

			await service.suppress(results, ["no-undef"]);

			const content = await fs.readFile(suppressionsFile, "utf8");
			const suppressions = JSON.parse(content);

			assert.deepStrictEqual(suppressions, {
				"test.js": {
					"no-undef": { count: 1 }
				}
			});
		});
	});

	describe("applySuppressions", () => {
		it("should apply suppressions to results", async () => {
			const service = new SuppressionsService({
				filePath: suppressionsFile,
				cwd: tempDir,
			});

			// Write initial suppressions
			await fs.writeFile(suppressionsFile, JSON.stringify({
				"test.js": {
					"no-undef": { count: 2 }
				}
			}, null, 2));

			const results = [{
				filePath: path.join(tempDir, "test.js"),
				messages: [
					{ ruleId: "no-undef", severity: 2, message: "test1", line: 1, column: 1 },
					{ ruleId: "no-undef", severity: 2, message: "test2", line: 2, column: 1 }
				],
				suppressedMessages: [],
				errorCount: 2,
				warningCount: 0,
				fatalErrorCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0
			}];

			const loadedSuppressions = await service.load();
			const { results: filteredResults } = service.applySuppressions(results, loadedSuppressions);

			assert.strictEqual(filteredResults[0].errorCount, 0);
			assert.strictEqual(filteredResults[0].suppressedMessages.length, 2);
			assert.strictEqual(filteredResults[0].messages.length, 0);
		});
	});

	describe("prune", () => {
		it("should prune unused suppressions", async () => {
			const service = new SuppressionsService({
				filePath: suppressionsFile,
				cwd: tempDir,
			});

			// Write initial suppressions with more suppressions than violations
			await fs.writeFile(suppressionsFile, JSON.stringify({
				"test.js": {
					"no-undef": { count: 5 }
				}
			}, null, 2));

			const results = [{
				filePath: path.join(tempDir, "test.js"),
				messages: [
					{ ruleId: "no-undef", severity: 2, message: "test1", line: 1, column: 1 }
				],
				suppressedMessages: [],
				errorCount: 1,
				warningCount: 0,
				fatalErrorCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0
			}];

			await service.prune(results);
			const content = await fs.readFile(suppressionsFile, "utf8");
			const suppressions = JSON.parse(content);

			// Should have reduced the count: 5 original - 4 unused = 1 remaining
			// When we have 5 suppressions but only 1 violation, 4 are unused and removed
			// So final count should be 5 - 4 = 1
			assert.deepStrictEqual(suppressions, {
				"test.js": {
					"no-undef": { count: 1 }
				}
			});
		});
	});
});