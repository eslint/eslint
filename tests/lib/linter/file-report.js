/**
 * @fileoverview Tests for FileReport class
 * @author ESLint
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const { FileReport } = require("../../../lib/linter/file-report");
const { SourceCode } = require("../../../lib/languages/js/source-code");
const espree = require("espree");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates a SourceCode instance out of JavaScript text
 * @param {string} text Source text
 * @returns {SourceCode} A SourceCode instance for that text
 */
function createSourceCode(text) {
	return new SourceCode(
		text,
		espree.parse(text.replace(/^\uFEFF/u, ""), {
			loc: true,
			range: true,
			raw: true,
			tokens: true,
			comment: true,
		}),
	);
}

/**
 * Mock rule mapper for testing
 * @returns {Object} Mock rule definition
 */
function mockRuleMapper() {
	return {
		meta: {
			messages: {
				testMessage: "foo",
				suggestion1: "First suggestion",
				suggestion2: "Second suggestion {{interpolated}}",
			},
		},
	};
}

const language = { columnStart: 0, lineStart: 1 };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("FileReport", () => {
	let sourceCode, node, location, fileReport;

	beforeEach(() => {
		sourceCode = createSourceCode("foo\nbar");
		node = sourceCode.ast.body[0];
		location = sourceCode.ast.body[1].loc.start;
		fileReport = new FileReport({
			ruleMapper: mockRuleMapper,
			sourceCode,
			language,
		});
	});

	describe("addRuleMessage", () => {
		it("should add a message with a string message", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				location,
				"foo",
				{},
			);
			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add a message with messageId", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				messageId: "testMessage",
			});
			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				messageId: "testMessage",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add a message with suggestions", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						messageId: "suggestion1",
						fix: () => ({ range: [2, 3], text: "s1" }),
					},
					{
						messageId: "suggestion2",
						data: { interpolated: "'interpolated value'" },
						fix: () => ({ range: [3, 4], text: "s2" }),
					},
				],
			});
			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				suggestions: [
					{
						messageId: "suggestion1",
						desc: "First suggestion",
						fix: { range: [2, 3], text: "s1" },
					},
					{
						messageId: "suggestion2",
						data: { interpolated: "'interpolated value'" },
						desc: "Second suggestion 'interpolated value'",
						fix: { range: [3, 4], text: "s2" },
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add a message with a fix", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				fix: () => ({ range: [1, 2], text: "foo" }),
			});
			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				fix: { range: [1, 2], text: "foo" },
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should throw if both message and messageId are provided", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					messageId: "testMessage",
				});
			}, /context\.report\(\) called with a message and a messageId/u);
			assert.strictEqual(fileReport.messages.length, 0);
		});
	});

	describe("addError/addErrors", () => {
		it("should add an error message", () => {
			const result = fileReport.addError({
				ruleId: "foo-rule",
				loc: {
					start: { line: 1, column: 0 },
					end: { line: 1, column: 3 },
				},
				message: "error!",
				language,
			});
			assert.strictEqual(result.ruleId, "foo-rule");
			assert.strictEqual(result.message, "error!");
			assert.strictEqual(result.severity, 2);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add multiple error messages", () => {
			const results = fileReport.addErrors([
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 1, column: 0 },
						end: { line: 1, column: 3 },
					},
					message: "error1",
					language,
				},
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 2, column: 0 },
						end: { line: 2, column: 3 },
					},
					message: "error2",
					language,
				},
			]);
			assert.strictEqual(results.length, 2);
			assert.strictEqual(results[0].message, "error1");
			assert.strictEqual(results[1].message, "error2");
			assert.strictEqual(fileReport.messages.length, 2);
			assert.deepStrictEqual(fileReport.messages[0], results[0]);
			assert.deepStrictEqual(fileReport.messages[1], results[1]);
		});
	});

	describe("addWarning/addWarnings", () => {
		it("should add a warning message", () => {
			const result = fileReport.addWarning({
				ruleId: "foo-rule",
				loc: {
					start: { line: 1, column: 0 },
					end: { line: 1, column: 3 },
				},
				message: "warn!",
				language,
			});
			assert.strictEqual(result.severity, 1);
			assert.strictEqual(result.message, "warn!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add multiple warning messages", () => {
			const results = fileReport.addWarnings([
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 1, column: 0 },
						end: { line: 1, column: 3 },
					},
					message: "warn1",
					language,
				},
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 2, column: 0 },
						end: { line: 2, column: 3 },
					},
					message: "warn2",
					language,
				},
			]);
			assert.strictEqual(results.length, 2);
			assert.strictEqual(results[0].message, "warn1");
			assert.strictEqual(results[1].message, "warn2");
			assert.strictEqual(fileReport.messages.length, 2);
			assert.deepStrictEqual(fileReport.messages[0], results[0]);
			assert.deepStrictEqual(fileReport.messages[1], results[1]);
		});
	});

	describe("addFatal/addFatals", () => {
		it("should add a fatal error message", () => {
			const result = fileReport.addFatal({
				ruleId: "foo-rule",
				loc: {
					start: { line: 1, column: 0 },
					end: { line: 1, column: 3 },
				},
				message: "fatal!",
				language,
			});
			assert.strictEqual(result.fatal, true);
			assert.strictEqual(result.severity, 2);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should add multiple fatal error messages", () => {
			const results = fileReport.addFatals([
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 1, column: 0 },
						end: { line: 1, column: 3 },
					},
					message: "fatal1",
					language,
				},
				{
					ruleId: "foo-rule",
					loc: {
						start: { line: 2, column: 0 },
						end: { line: 2, column: 3 },
					},
					message: "fatal2",
					language,
				},
			]);
			assert.strictEqual(results.length, 2);
			assert.strictEqual(results[0].fatal, true);
			assert.strictEqual(results[1].fatal, true);
			assert.strictEqual(fileReport.messages.length, 2);
			assert.deepStrictEqual(fileReport.messages[0], results[0]);
			assert.deepStrictEqual(fileReport.messages[1], results[1]);
		});
	});

	describe("error handling", () => {
		it("should throw if node is not an object and no loc is provided", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node: null,
					message: "foo",
				});
			}, /Node must be provided when reporting error if location is not provided/u);
			assert.strictEqual(fileReport.messages.length, 0);
		});
	});

	describe("updateLocationInformation", () => {
		const {
			updateLocationInformation,
		} = require("../../../lib/linter/file-report");

		it("should offset line and column by 1 when language starts at 0", () => {
			const loc = { line: 0, column: 0, endLine: 0, endColumn: 3 };
			const lang = { columnStart: 0, lineStart: 0 };
			const result = updateLocationInformation(loc, lang);
			assert.deepStrictEqual(result, {
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
			});
		});

		it("should not offset when language starts at 1", () => {
			const loc = { line: 1, column: 1, endLine: 2, endColumn: 2 };
			const lang = { columnStart: 1, lineStart: 1 };
			const result = updateLocationInformation(loc, lang);
			assert.deepStrictEqual(result, {
				line: 1,
				column: 1,
				endLine: 2,
				endColumn: 2,
			});
		});

		it("should offset only column if lineStart is 1 and columnStart is 0", () => {
			const loc = { line: 2, column: 0, endLine: 2, endColumn: 3 };
			const lang = { columnStart: 0, lineStart: 1 };
			const result = updateLocationInformation(loc, lang);
			assert.deepStrictEqual(result, {
				line: 2,
				column: 1,
				endLine: 2,
				endColumn: 4,
			});
		});

		it("should offset only line if lineStart is 0 and columnStart is 1", () => {
			const loc = { line: 0, column: 2, endLine: 0, endColumn: 5 };
			const lang = { columnStart: 1, lineStart: 0 };
			const result = updateLocationInformation(loc, lang);
			assert.deepStrictEqual(result, {
				line: 1,
				column: 2,
				endLine: 1,
				endColumn: 5,
			});
		});

		it("should handle undefined endLine and endColumn", () => {
			const loc = { line: 1, column: 2 };
			const lang = { columnStart: 1, lineStart: 1 };
			const result = updateLocationInformation(loc, lang);
			assert.deepStrictEqual(result, {
				line: 1,
				column: 2,
				endLine: void 0,
				endColumn: void 0,
			});
		});
	});
});
