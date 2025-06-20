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

		it("should throw when an invalid messageId is provided", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					messageId: "thisIsNotASpecifiedMessageId",
				});
			}, /^context\.report\(\) called with a messageId of '[^']+' which is not present in the 'messages' config:/u);

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw when no message is provided", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, { node });
			}, "Missing `message` property in report() call; add a message that describes the linting problem.");

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw when a suggestion defines both a desc and messageId", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					suggest: [
						{
							desc: "The description",
							messageId: "suggestion1",
							fix: () => ({ range: [2, 3], text: "s1" }),
						},
					],
				});
			}, "context.report() called with a suggest option that defines both a 'messageId' and an 'desc'. Please only pass one.");

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw when a suggestion uses an invalid messageId", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					suggest: [
						{
							messageId: "noMatchingMessage",
							fix: () => ({ range: [2, 3], text: "s1" }),
						},
					],
				});
			}, /^context\.report\(\) called with a suggest option with a messageId '[^']+' which is not present in the 'messages' config:/u);

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw when a suggestion does not provide either a desc or messageId", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					suggest: [
						{
							fix: () => ({ range: [2, 3], text: "s1" }),
						},
					],
				});
			}, "context.report() called with a suggest option that doesn't have either a `desc` or `messageId`");

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw when a suggestion does not provide a fix function", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					suggest: [
						{
							desc: "The description",
							fix: false,
						},
					],
				});
			}, /^context\.report\(\) called with a suggest option without a fix function. See:/u);

			assert.strictEqual(fileReport.messages.length, 0);
		});
	});

	describe("old-style call with location", () => {
		it("should extract the location correctly", () => {
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
	});

	describe("old-style call without location", () => {
		it("should use the start location and end location of the node", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"foo",
				{},
			);

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
				nodeType: "ExpressionStatement",
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("combining autofixes", () => {
		it("should merge fixes to one if 'fix' function returns an array of fixes.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				fix: () => [
					{ range: [1, 2], text: "foo" },
					{ range: [4, 5], text: "bar" },
				],
			});

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				fix: {
					range: [1, 5],
					text: "fooo\nbar",
				},
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should respect ranges of empty insertions when merging fixes to one.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				*fix() {
					yield { range: [4, 5], text: "cd" };
					yield { range: [2, 2], text: "" };
					yield { range: [7, 7], text: "" };
				},
			});

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				fix: {
					range: [2, 7],
					text: "o\ncdar",
				},
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should pass through fixes if only one is present", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				fix: () => [{ range: [1, 2], text: "foo" }],
			});

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				fix: {
					range: [1, 2],
					text: "foo",
				},
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should handle inserting BOM correctly.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				fix: () => [
					{ range: [0, 3], text: "\uFEFFfoo" },
					{ range: [4, 5], text: "x" },
				],
			});

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "foo",
				line: 2,
				column: 1,
				nodeType: "ExpressionStatement",
				fix: {
					range: [0, 5],
					text: "\uFEFFfoo\nx",
				},
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should handle removing BOM correctly.", () => {
			const bomSourceCode = createSourceCode("\uFEFFfoo\nbar");
			const bomNode = bomSourceCode.ast.body[0];
			const bomFileReport = new FileReport({
				ruleMapper: mockRuleMapper,
				sourceCode: bomSourceCode,
				language,
			});

			const result = bomFileReport.addRuleMessage("foo-rule", 1, {
				node: bomNode,
				message: "foo",
				fix: () => [
					{ range: [-1, 3], text: "foo" },
					{ range: [4, 5], text: "x" },
				],
			});

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 1,
				message: "foo",
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
				nodeType: "ExpressionStatement",
				fix: {
					range: [-1, 5],
					text: "foo\nx",
				},
			});
			assert.strictEqual(bomFileReport.messages.length, 1);
			assert.deepStrictEqual(bomFileReport.messages[0], result);
		});

		it("should throw an assertion error if ranges are overlapped.", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					loc: location,
					message: "foo",
					fix: () => [
						{ range: [0, 3], text: "\uFEFFfoo" },
						{ range: [2, 5], text: "x" },
					],
				});
			}, "Fix objects must not be overlapped in a report.");

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should include a fix passed as the last argument when location is passed", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				{ line: 42, column: 23 },
				"my message {{1}}{{0}}",
				["!", "testing"],
				() => ({ range: [1, 1], text: "" }),
			);

			assert.deepStrictEqual(result, {
				ruleId: "foo-rule",
				severity: 2,
				message: "my message testing!",
				line: 42,
				column: 24,
				nodeType: "ExpressionStatement",
				fix: {
					range: [1, 1],
					text: "",
				},
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("suggestions", () => {
		it("should support multiple suggestions.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "A first suggestion for the issue",
						fix: () => [{ range: [1, 2], text: "foo" }],
					},
					{
						desc: "A different suggestion for the issue",
						fix: () => [{ range: [1, 3], text: "foobar" }],
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
						desc: "A first suggestion for the issue",
						fix: { range: [1, 2], text: "foo" },
					},
					{
						desc: "A different suggestion for the issue",
						fix: { range: [1, 3], text: "foobar" },
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should merge suggestion fixes to one if 'fix' function returns an array of fixes.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "A suggestion for the issue",
						fix: () => [
							{ range: [1, 2], text: "foo" },
							{ range: [4, 5], text: "bar" },
						],
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
						desc: "A suggestion for the issue",
						fix: {
							range: [1, 5],
							text: "fooo\nbar",
						},
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should remove the whole suggestion if 'fix' function returned `null`.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "A suggestion for the issue",
						fix: () => null,
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
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should remove the whole suggestion if 'fix' function returned an empty array.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "A suggestion for the issue",
						fix: () => [],
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
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should remove the whole suggestion if 'fix' function didn't return anything.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "A suggestion for the issue",
						fix() {},
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
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should keep suggestion before a removed suggestion.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "Suggestion with a fix",
						fix: () => ({ range: [1, 2], text: "foo" }),
					},
					{
						desc: "Suggestion without a fix",
						fix: () => null,
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
						desc: "Suggestion with a fix",
						fix: { range: [1, 2], text: "foo" },
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should keep suggestion after a removed suggestion.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "Suggestion without a fix",
						fix: () => null,
					},
					{
						desc: "Suggestion with a fix",
						fix: () => ({ range: [1, 2], text: "foo" }),
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
						desc: "Suggestion with a fix",
						fix: { range: [1, 2], text: "foo" },
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should remove multiple suggestions that didn't provide a fix and keep those that did.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: location,
				message: "foo",
				suggest: [
					{
						desc: "Keep #1",
						fix: () => ({ range: [1, 2], text: "foo" }),
					},
					{
						desc: "Remove #1",
						fix: () => null,
					},
					{
						desc: "Keep #2",
						fix: () => ({ range: [1, 2], text: "bar" }),
					},
					{
						desc: "Remove #2",
						fix: () => [],
					},
					{
						desc: "Keep #3",
						fix: () => ({ range: [1, 2], text: "baz" }),
					},
					{
						desc: "Remove #3",
						fix() {},
					},
					{
						desc: "Keep #4",
						fix: () => ({ range: [1, 2], text: "quux" }),
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
						desc: "Keep #1",
						fix: { range: [1, 2], text: "foo" },
					},
					{
						desc: "Keep #2",
						fix: { range: [1, 2], text: "bar" },
					},
					{
						desc: "Keep #3",
						fix: { range: [1, 2], text: "baz" },
					},
					{
						desc: "Keep #4",
						fix: { range: [1, 2], text: "quux" },
					},
				],
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("message interpolation", () => {
		it("should correctly parse a message when being passed all options in an old-style report", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				node.loc.end,
				"hello {{dynamic}}",
				{ dynamic: node.type },
			);

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello ExpressionStatement",
				nodeType: "ExpressionStatement",
				line: 1,
				column: 4,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should correctly parse a message when being passed all options in a new-style report", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: node.loc.end,
				message: "hello {{dynamic}}",
				data: { dynamic: node.type },
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello ExpressionStatement",
				nodeType: "ExpressionStatement",
				line: 1,
				column: 4,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should correctly parse a message with object keys as numbers", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"my message {{name}}{{0}}",
				{ 0: "!", name: "testing" },
			);

			assert.strictEqual(result.message, "my message testing!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should correctly parse a message with array", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"my message {{1}}{{0}}",
				["!", "testing"],
			);

			assert.strictEqual(result.message, "my message testing!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should allow template parameter with inner whitespace", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{parameter name}}",
				{ "parameter name": "yay!" },
			);

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should allow template parameter with non-identifier characters", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{parameter-name}}",
				{ "parameter-name": "yay!" },
			);

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should allow template parameter wrapped in braces", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{{param}}}",
				{ param: "yay!" },
			);

			assert.strictEqual(result.message, "message {yay!}");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should ignore template parameter with no specified value", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{parameter}}",
				{},
			);

			assert.strictEqual(result.message, "message {{parameter}}");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should handle leading whitespace in template parameter", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				message: "message {{ parameter}}",
				data: { parameter: "yay!" },
			});

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should handle trailing whitespace in template parameter", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				message: "message {{parameter }}",
				data: { parameter: "yay!" },
			});

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should still allow inner whitespace as well as leading/trailing", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{ parameter name }}",
				{ "parameter name": "yay!" },
			);

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should still allow non-identifier characters as well as leading/trailing whitespace", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"message {{ parameter-name }}",
				{ "parameter-name": "yay!" },
			);

			assert.strictEqual(result.message, "message yay!");
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("location inference", () => {
		it("should use the provided location when given in an old-style call", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				{ line: 42, column: 13 },
				"hello world",
			);

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: "ExpressionStatement",
				line: 42,
				column: 14,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should use the provided location when given in an new-style call", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				loc: { line: 42, column: 13 },
				message: "hello world",
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: "ExpressionStatement",
				line: 42,
				column: 14,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should extract the start and end locations from a node if no location is provided", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"hello world",
			);

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: "ExpressionStatement",
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should have 'endLine' and 'endColumn' when 'loc' property has 'end' property.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				loc: node.loc,
				message: "hello world",
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: null,
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should not have 'endLine' and 'endColumn' when 'loc' property does not have 'end' property.", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				loc: node.loc.start,
				message: "hello world",
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: null,
				line: 1,
				column: 1,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should infer an 'endLine' and 'endColumn' property when using the object-based context.report API", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				message: "hello world",
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: "ExpressionStatement",
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("converting old-style calls", () => {
		it("should include a fix passed as the last argument when location is not passed", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				node,
				"my message {{1}}{{0}}",
				["!", "testing"],
				() => ({ range: [1, 1], text: "" }),
			);

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "my message testing!",
				nodeType: "ExpressionStatement",
				line: 1,
				column: 1,
				endLine: 1,
				endColumn: 4,
				fix: { range: [1, 1], text: "" },
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});
	});

	describe("validation", () => {
		it("should throw an error if node is not an object", () => {
			assert.throws(() => {
				fileReport.addRuleMessage(
					"foo-rule",
					2,
					"not a node",
					"hello world",
				);
			}, "Node must be an object");
			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should not throw an error if location is provided and node is not in an old-style call", () => {
			const result = fileReport.addRuleMessage(
				"foo-rule",
				2,
				null,
				{ line: 1, column: 1 },
				"hello world",
			);

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: null,
				line: 1,
				column: 2,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should not throw an error if location is provided and node is not in a new-style call", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				loc: { line: 1, column: 1 },
				message: "hello world",
			});

			assert.deepStrictEqual(result, {
				severity: 2,
				ruleId: "foo-rule",
				message: "hello world",
				nodeType: null,
				line: 1,
				column: 2,
			});
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should throw an error if neither node nor location is provided", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, null, "hello world");
			}, "Node must be provided when reporting error if location is not provided");

			assert.strictEqual(fileReport.messages.length, 0);
		});

		it("should throw an error if fix range is invalid", () => {
			assert.throws(() => {
				fileReport.addRuleMessage("foo-rule", 2, {
					node,
					messageId: "testMessage",
					fix: () => ({ text: "foo" }),
				});
			}, "Fix has invalid range");

			assert.strictEqual(fileReport.messages.length, 0);

			const badRanges = [
				[0],
				[0, null],
				[null, 0],
				[void 0, 1],
				[0, void 0],
				[void 0, void 0],
				[],
			];

			badRanges.forEach(badRange => {
				assert.throws(() => {
					fileReport.addRuleMessage("foo-rule", 2, {
						node,
						messageId: "testMessage",
						fix: () => ({ range: badRange, text: "foo" }),
					});
				}, "Fix has invalid range");
			});
		});
	});

	// https://github.com/eslint/eslint/issues/16716
	describe("unique `fix` and `fix.range` objects", () => {
		const range = [0, 3];
		const fix = { range, text: "baz" };
		const additionalRange = [4, 7];
		const additionalFix = { range: additionalRange, text: "qux" };

		it("should deep clone returned fix object", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				fix: () => fix,
			});

			assert.deepStrictEqual(result.fix, fix);
			assert.notStrictEqual(result.fix, fix);
			assert.notStrictEqual(result.fix.range, fix.range);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should create a new fix object with a new range array when `fix()` returns an array with a single item", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				fix: () => [fix],
			});

			assert.deepStrictEqual(result.fix, fix);
			assert.notStrictEqual(result.fix, fix);
			assert.notStrictEqual(result.fix.range, fix.range);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should create a new fix object with a new range array when `fix()` returns an array with multiple items", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				fix: () => [fix, additionalFix],
			});

			assert.notStrictEqual(result.fix, fix);
			assert.notStrictEqual(result.fix.range, fix.range);
			assert.notStrictEqual(result.fix, additionalFix);
			assert.notStrictEqual(result.fix.range, additionalFix.range);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should deep clone returned suggestion fix object", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				suggest: [
					{
						messageId: "suggestion1",
						fix: () => fix,
					},
				],
			});

			assert.deepStrictEqual(result.suggestions[0].fix, fix);
			assert.notStrictEqual(result.suggestions[0].fix, fix);
			assert.notStrictEqual(result.suggestions[0].fix.range, fix.range);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should create a new fix object with a new range array when suggestion `fix()` returns an array with a single item", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				suggest: [
					{
						messageId: "suggestion1",
						fix: () => [fix],
					},
				],
			});

			assert.deepStrictEqual(result.suggestions[0].fix, fix);
			assert.notStrictEqual(result.suggestions[0].fix, fix);
			assert.notStrictEqual(result.suggestions[0].fix.range, fix.range);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should create a new fix object with a new range array when suggestion `fix()` returns an array with multiple items", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				suggest: [
					{
						messageId: "suggestion1",
						fix: () => [fix, additionalFix],
					},
				],
			});

			assert.notStrictEqual(result.suggestions[0].fix, fix);
			assert.notStrictEqual(result.suggestions[0].fix.range, fix.range);
			assert.notStrictEqual(result.suggestions[0].fix, additionalFix);
			assert.notStrictEqual(
				result.suggestions[0].fix.range,
				additionalFix.range,
			);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
		});

		it("should create different instances of range arrays when suggestions reuse the same instance", () => {
			const result = fileReport.addRuleMessage("foo-rule", 2, {
				node,
				messageId: "testMessage",
				suggest: [
					{
						messageId: "suggestion1",
						fix: () => fix,
					},
					{
						messageId: "suggestion2",
						fix: () => fix,
					},
				],
			});

			assert.notStrictEqual(
				result.suggestions[0].fix.range,
				result.suggestions[1].fix.range,
			);
			assert.strictEqual(fileReport.messages.length, 1);
			assert.deepStrictEqual(fileReport.messages[0], result);
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
