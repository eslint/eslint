/**
 * @fileoverview Unit tests for the SuppressionsService class.
 * @author Kuldeep Kumar
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const {
	SuppressionsService,
} = require("../../../lib/services/suppressions-service");
const assert = require("node:assert");
const fs = require("node:fs");
const sinon = require("sinon");
const path = require("node:path");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates a minimal LintResult object for testing.
 * @param {Object} options The result options.
 * @param {string} options.filePath The absolute file path.
 * @param {Array} [options.messages] The lint messages.
 * @param {Array} [options.suppressedMessages] Already-suppressed messages.
 * @returns {Object} A LintResult-like object.
 */
function createResult({ filePath, messages = [], suppressedMessages = [] }) {
	return {
		filePath,
		messages,
		suppressedMessages,
		errorCount: messages.filter(m => m.severity === 2).length,
		fatalErrorCount: messages.filter(m => m.fatal).length,
		warningCount: messages.filter(m => m.severity === 1).length,
		fixableErrorCount: 0,
		fixableWarningCount: 0,
	};
}

/**
 * Creates a lint message for testing.
 * @param {string} ruleId The rule ID.
 * @param {number} severity 1=warning, 2=error.
 * @returns {Object} A LintMessage-like object.
 */
function createMessage(ruleId, severity = 2) {
	return {
		ruleId,
		severity,
		message: `${ruleId} violation`,
		line: 1,
		column: 1,
	};
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("SuppressionsService", () => {
	afterEach(() => {
		sinon.restore();
	});

	describe("load()", () => {
		it("should return parsed JSON when file is valid", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const mockData = { "file.js": { "rule-id": { count: 1 } } };
			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(mockData));

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, mockData);
		});

		it("should return an empty object when file does not exist (ENOENT)", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const error = new Error("File not found");
			error.code = "ENOENT";
			sinon.stub(fs.promises, "readFile").rejects(error);

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, {});
		});

		it("should throw an error with cause when file contains invalid JSON", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			sinon.stub(fs.promises, "readFile").resolves("invalid json");

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /project/eslint-suppressions.json",
					);
					assert.ok(err.cause instanceof SyntaxError);
					return true;
				},
			);
		});

		it("should throw an error with cause when reading file throws a non-ENOENT error", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const readError = new Error("EACCES: permission denied");
			readError.code = "EACCES";
			sinon.stub(fs.promises, "readFile").rejects(readError);

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /project/eslint-suppressions.json",
					);
					assert.strictEqual(err.cause, readError);
					return true;
				},
			);
		});

		it("should read from the correct filePath", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/custom/path/suppressions.json",
				cwd: "/custom",
			});
			const mockData = { "app.js": { "no-unused-vars": { count: 2 } } };
			const stub = sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(mockData));

			const result = await suppressionsService.load();
			assert.deepStrictEqual(result, mockData);
			assert(
				stub.calledOnceWithExactly(
					"/custom/path/suppressions.json",
					"utf8",
				),
				"Expected readFile to be called with the correct filePath and encoding",
			);
		});

		it("should work without cwd and use filePath in the error message", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/workspace/config/eslint-suppressions.json",
			});
			sinon.stub(fs.promises, "readFile").resolves("not valid json");

			await assert.rejects(
				() => suppressionsService.load(),
				err => {
					assert.strictEqual(
						err.message,
						"Failed to parse suppressions file at /workspace/config/eslint-suppressions.json",
					);
					assert.ok(err.cause instanceof SyntaxError);
					return true;
				},
			);
		});
	});

	describe("suppress()", () => {
		it("should suppress all violations when no rules filter is provided", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});

			// load() returns empty (no prior suppressions)
			sinon.stub(fs.promises, "readFile").callsFake(() => {
				const err = new Error("ENOENT");

				err.code = "ENOENT";
				return Promise.reject(err);
			});
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-unused-vars"),
						createMessage("no-unused-vars"),
						createMessage("no-console"),
					],
				}),
			];

			await suppressionsService.suppress(results, void 0);

			assert.ok(writeStub.calledOnce, "Expected save to be called");
			const written = JSON.parse(writeStub.firstCall.args[1]);
			const relPath = path.posix.join("src", "app.js");

			assert.deepStrictEqual(written[relPath]["no-unused-vars"], {
				count: 2,
			});
			assert.deepStrictEqual(written[relPath]["no-console"], {
				count: 1,
			});
		});

		it("should only suppress violations matching the provided rules filter", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});

			sinon.stub(fs.promises, "readFile").callsFake(() => {
				const err = new Error("ENOENT");

				err.code = "ENOENT";
				return Promise.reject(err);
			});
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-unused-vars"),
						createMessage("no-console"),
					],
				}),
			];

			await suppressionsService.suppress(results, ["no-console"]);

			const written = JSON.parse(writeStub.firstCall.args[1]);
			const relPath = path.posix.join("src", "app.js");

			assert.deepStrictEqual(written[relPath]["no-console"], {
				count: 1,
			});
			assert.strictEqual(
				written[relPath]["no-unused-vars"],
				void 0,
				"Expected non-matching rule to be excluded",
			);
		});

		it("should merge new suppressions with existing ones", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const existing = {
				[relPath]: { "no-console": { count: 3 } },
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-unused-vars"),
						createMessage("no-console"),
					],
				}),
			];

			await suppressionsService.suppress(results, void 0);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			// no-console should be overwritten with the new count
			assert.deepStrictEqual(written[relPath]["no-console"], {
				count: 1,
			});
			// no-unused-vars should be added
			assert.deepStrictEqual(written[relPath]["no-unused-vars"], {
				count: 1,
			});
		});

		it("should ignore warnings (severity 1) and only count errors", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});

			sinon.stub(fs.promises, "readFile").callsFake(() => {
				const err = new Error("ENOENT");

				err.code = "ENOENT";
				return Promise.reject(err);
			});
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-console", 1), // warning — should be ignored
						createMessage("no-unused-vars", 2), // error
					],
				}),
			];

			await suppressionsService.suppress(results, void 0);

			const written = JSON.parse(writeStub.firstCall.args[1]);
			const relPath = path.posix.join("src", "app.js");

			assert.deepStrictEqual(written[relPath]["no-unused-vars"], {
				count: 1,
			});
			assert.strictEqual(
				written[relPath]?.["no-console"],
				void 0,
				"Expected warnings to be excluded from suppressions",
			);
		});
	});
});
