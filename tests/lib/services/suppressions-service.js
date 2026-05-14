/**
 * @fileoverview Unit tests for the SuppressionsService class.
 * @author Kuldeep2822k
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
 * @param {string|null} ruleId The rule ID.
 * @param {"warn"|"error"} [severityLabel] The severity label. Defaults to "error".
 * @returns {Object} A LintMessage-like object.
 */
function createMessage(ruleId, severityLabel = "error") {
	return {
		ruleId,
		severity: severityLabel === "warn" ? 1 : 2,
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

	describe("save()", () => {
		it("should write valid JSON to filePath", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			const suppressions = {
				"b-file.js": { "no-console": { count: 1 } },
				"a-file.js": { "no-unused-vars": { count: 2 } },
			};

			await suppressionsService.save(suppressions);

			assert.ok(
				writeStub.calledOnce,
				"Expected writeFile to be called once",
			);
			assert.strictEqual(
				writeStub.firstCall.args[0],
				"/project/eslint-suppressions.json",
				"Expected writeFile to use the correct filePath",
			);

			// Verify the content is valid JSON and matches the object
			const writtenContent = writeStub.firstCall.args[1];

			assert.deepStrictEqual(JSON.parse(writtenContent), suppressions);
		});

		it("should write deterministic JSON by sorting keys alphabetically", async () => {
			const suppressionsService = new SuppressionsService({
				filePath: "/project/eslint-suppressions.json",
				cwd: "/project",
			});
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			const suppressions = {
				"b-file.js": { "no-console": { count: 1 } },
				"a-file.js": { "no-unused-vars": { count: 2 } },
			};

			await suppressionsService.save(suppressions);

			const writtenContent = writeStub.firstCall.args[1];

			// json-stable-stringify sorts keys, so "a-file.js" should come before "b-file.js"
			const aIndex = writtenContent.indexOf("a-file.js");
			const bIndex = writtenContent.indexOf("b-file.js");

			assert.ok(
				aIndex !== -1 && bIndex !== -1 && aIndex < bIndex,
				"Expected keys to be sorted alphabetically (stable stringify)",
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
						createMessage("no-unused-vars", "error"),
						createMessage("no-unused-vars", "error"),
						createMessage("no-console", "error"),
					],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

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
						createMessage("no-unused-vars", "error"),
						createMessage("no-console", "error"),
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
						createMessage("no-unused-vars", "error"),
						createMessage("no-console", "error"),
					],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

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
						createMessage("no-console", "warn"),
						createMessage("no-unused-vars", "error"),
					],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

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

		it("should ignore messages with a null ruleId", async () => {
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
						createMessage(null, "error"),
						createMessage("no-unused-vars", "error"),
					],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

			const written = JSON.parse(writeStub.firstCall.args[1]);
			const relPath = path.posix.join("src", "app.js");

			// only the rule with a non-null ruleId should be recorded
			assert.deepStrictEqual(Object.keys(written[relPath]), [
				"no-unused-vars",
			]);
			assert.deepStrictEqual(written[relPath]["no-unused-vars"], {
				count: 1,
			});
		});

		it("should use cwd to compute relative file paths", async () => {
			const cwd = path.resolve("/workspace/team");
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
					filePath: path.join(cwd, "src", "utils.js"),
					messages: [createMessage("no-console", "error")],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			// key must be relative to the given cwd, in POSIX format
			const expectedRelPath = "src/utils.js";

			assert.ok(
				Object.hasOwn(written, expectedRelPath),
				`Expected key "${expectedRelPath}" in written suppressions`,
			);
			assert.deepStrictEqual(written[expectedRelPath]["no-console"], {
				count: 1,
			});
		});

		it("should preserve existing suppressions for rules that no longer report (prune() removes them)", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			const existing = {
				[relPath]: {
					"no-console": { count: 2 },
					"no-unused-vars": { count: 1 },
				},
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [createMessage("no-unused-vars", "error")],
				}),
			];

			const rules = void 0; // No rule filter

			await suppressionsService.suppress(results, rules);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			assert.deepStrictEqual(written[relPath]["no-unused-vars"], {
				count: 1,
			});
			assert.deepStrictEqual(
				written[relPath]["no-console"],
				{ count: 2 },
				"Expected suppress() to leave stale suppression intact; use prune() to remove it",
			);
		});
	});

	describe("prune()", () => {
		it("should remove entirely unused suppressions", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			// Existing suppression for a rule with zero current violations
			const existing = {
				[relPath]: { "no-console": { count: 3 } },
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(true);

			// No violations at all for this file
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [],
				}),
			];

			await suppressionsService.prune(results);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			assert.strictEqual(
				written[relPath],
				void 0,
				"Expected file entry to be removed when all rules are unused",
			);
		});

		it("should reduce suppression counts for partially unused rules", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			// Suppression count is 5, but only 2 violations remain
			const existing = {
				[relPath]: { "no-unused-vars": { count: 5 } },
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(true);

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-unused-vars"),
						createMessage("no-unused-vars"),
					],
				}),
			];

			await suppressionsService.prune(results);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			assert.deepStrictEqual(
				written[relPath]["no-unused-vars"],
				{ count: 2 },
				"Expected suppression count to be reduced to match actual violations",
			);
		});

		it("should remove suppressions for files that no longer exist on disk", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "deleted.js");
			const existing = {
				[relPath]: { "no-unused-vars": { count: 1 } },
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(false);

			await suppressionsService.prune([]);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			assert.deepStrictEqual(
				written,
				{},
				"Expected suppressions for nonexistent files to be removed",
			);
		});

		it("should do nothing if the suppressions are up to date", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			// Suppression counts exactly match the current violation counts
			const existing = {
				[relPath]: {
					"no-console": { count: 2 },
					"no-unused-vars": { count: 1 },
				},
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(true);

			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-console"),
						createMessage("no-console"),
						createMessage("no-unused-vars"),
					],
				}),
			];

			await suppressionsService.prune(results);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			assert.deepStrictEqual(
				written[relPath]["no-console"],
				{ count: 2 },
				"Expected no-console suppression to remain unchanged",
			);
			assert.deepStrictEqual(
				written[relPath]["no-unused-vars"],
				{ count: 1 },
				"Expected no-unused-vars suppression to remain unchanged",
			);
		});

		it("should remove only the resolved rule's suppression when multiple rules are suppressed for the same file", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			// Two rules suppressed; only no-console violations have been fixed
			const existing = {
				[relPath]: {
					"no-console": { count: 2 },
					"no-unused-vars": { count: 1 },
				},
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(true);

			// no-unused-vars violations remain; no-console violations are gone
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [createMessage("no-unused-vars")],
				}),
			];

			await suppressionsService.prune(results);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			// The resolved rule should be pruned …
			assert.strictEqual(
				written[relPath]["no-console"],
				void 0,
				"Expected the suppression for the resolved rule to be removed",
			);
			// … but the still-violated rule's suppression must stay
			assert.deepStrictEqual(
				written[relPath]["no-unused-vars"],
				{ count: 1 },
				"Expected the suppression for the unresolved rule to remain",
			);
			// The file entry itself must not be deleted
			assert.ok(
				Object.hasOwn(written, relPath),
				"Expected the file entry to remain when other suppressions still exist",
			);
		});

		it("should remove the suppression for a rule that is no longer activated", async () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");

			// no-console was previously suppressed, but has since been removed from the lint config
			const existing = {
				[relPath]: {
					"no-console": { count: 1 },
					"no-unused-vars": { count: 2 },
				},
			};

			sinon
				.stub(fs.promises, "readFile")
				.resolves(JSON.stringify(existing));
			const writeStub = sinon.stub(fs.promises, "writeFile").resolves();
			sinon.stub(fs, "existsSync").returns(true);

			/*
			 * Lint results contain only no-unused-vars; no-console is absent
			 * because the rule is no longer active in the configuration
			 */
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-unused-vars"),
						createMessage("no-unused-vars"),
					],
				}),
			];

			await suppressionsService.prune(results);

			const written = JSON.parse(writeStub.firstCall.args[1]);

			// The deactivated rule's suppression must be pruned
			assert.strictEqual(
				written[relPath]["no-console"],
				void 0,
				"Expected the suppression for the deactivated rule to be removed",
			);
			// The still-active rule's suppression must be retained
			assert.deepStrictEqual(
				written[relPath]["no-unused-vars"],
				{ count: 2 },
				"Expected the suppression for the active rule to be retained",
			);
		});
	});

	describe("applySuppressions()", () => {
		it("should suppress messages when violations count is less than or equal to suppressions count", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: { "no-console": { count: 2 } },
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-console"),
						createMessage("no-console"),
					],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			assert.strictEqual(newResults[0].messages.length, 0);
			assert.strictEqual(newResults[0].suppressedMessages.length, 2);
			assert.strictEqual(
				newResults[0].suppressedMessages[0].ruleId,
				"no-console",
			);
			assert.deepStrictEqual(
				newResults[0].suppressedMessages[0].suppressions,
				[{ kind: "file", justification: "" }],
			);
			assert.strictEqual(newResults[0].errorCount, 0);
			assert.deepStrictEqual(unused, {});
		});

		it("should not suppress messages when violations count exceeds suppressions count", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: { "no-console": { count: 1 } },
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-console"),
						createMessage("no-console"),
					],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			assert.strictEqual(newResults[0].messages.length, 2);
			assert.strictEqual(newResults[0].suppressedMessages.length, 0);
			assert.strictEqual(newResults[0].errorCount, 2);
			assert.deepStrictEqual(unused, {});
		});

		it("should return unused suppressions when violations count is less than suppressions count", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: { "no-console": { count: 3 } },
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [createMessage("no-console")],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			assert.strictEqual(newResults[0].messages.length, 0);
			assert.strictEqual(newResults[0].suppressedMessages.length, 1);
			assert.deepStrictEqual(unused, {
				[relPath]: { "no-console": { count: 2 } },
			});
		});

		it("should return unused suppressions when there are no violations for a suppressed rule", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: {
					"no-console": { count: 1 },
					"no-unused-vars": { count: 1 },
				},
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [createMessage("no-unused-vars")],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			assert.strictEqual(newResults[0].messages.length, 0);
			assert.strictEqual(newResults[0].suppressedMessages.length, 1);
			assert.deepStrictEqual(unused, {
				[relPath]: { "no-console": { count: 1 } },
			});
		});

		it("should process multiple rules and return correct stats and unused counts", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: {
					"no-console": { count: 2 },
					"no-unused-vars": { count: 1 },
				},
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [
						createMessage("no-console"),
						createMessage("no-unused-vars"),
						createMessage("no-unused-vars"),
					],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			// no-unused-vars has 2 violations but only 1 suppression → not suppressed
			assert.strictEqual(newResults[0].messages.length, 2);
			// no-console has 1 violation and 2 suppressions → suppressed
			assert.strictEqual(newResults[0].suppressedMessages.length, 1);
			assert.strictEqual(newResults[0].errorCount, 2);
			assert.deepStrictEqual(unused, {
				[relPath]: { "no-console": { count: 1 } },
			});
		});

		it("should return all suppressions as unused when the file has no violations", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: { "no-console": { count: 1 } },
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			assert.strictEqual(newResults[0].messages.length, 0);
			assert.deepStrictEqual(unused, {
				[relPath]: { "no-console": { count: 1 } },
			});
		});

		it("should skip files that have no matching suppressions", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const suppressions = {
				"other/file.js": { "no-console": { count: 1 } },
			};
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: [createMessage("no-console")],
				}),
			];

			const { results: newResults, unused } =
				suppressionsService.applySuppressions(results, suppressions);

			// Messages should remain untouched
			assert.strictEqual(newResults[0].messages.length, 1);
			assert.strictEqual(newResults[0].suppressedMessages.length, 0);
			assert.strictEqual(newResults[0].errorCount, 1);
			assert.deepStrictEqual(unused, {});
		});

		it("should not mutate the original results array", () => {
			const cwd = path.resolve("/project");
			const suppressionsService = new SuppressionsService({
				filePath: path.join(cwd, "eslint-suppressions.json"),
				cwd,
			});
			const relPath = path.posix.join("src", "app.js");
			const suppressions = {
				[relPath]: { "no-console": { count: 2 } },
			};
			const originalMessages = [
				createMessage("no-console"),
				createMessage("no-console"),
			];
			const results = [
				createResult({
					filePath: path.join(cwd, "src", "app.js"),
					messages: originalMessages,
				}),
			];

			suppressionsService.applySuppressions(results, suppressions);

			// The original results array must remain unmodified
			assert.strictEqual(
				results[0].messages.length,
				2,
				"Expected original messages to remain unmodified",
			);
			assert.strictEqual(
				results[0].suppressedMessages.length,
				0,
				"Expected original suppressedMessages to remain unmodified",
			);
		});
	});
});
