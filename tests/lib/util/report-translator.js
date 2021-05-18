/**
 * @fileoverview Tests for createReportTranslator
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const SourceCode = require("../../../lib/util/source-code");
const espree = require("espree");
const createReportTranslator = require("../../../lib/util/report-translator");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("createReportTranslator", () => {

    /**
     * Creates a SourceCode instance out of JavaScript text
     * @param {string} text Source text
     * @returns {SourceCode} A SourceCode instance for that text
     */
    function createSourceCode(text) {
        return new SourceCode(
            text,
            espree.parse(
                text.replace(/^\uFEFF/u, ""),
                {
                    loc: true,
                    range: true,
                    raw: true,
                    tokens: true,
                    comment: true
                }
            )
        );
    }

    let node, location, message, translateReport;

    beforeEach(() => {
        const sourceCode = createSourceCode("foo\nbar");

        node = sourceCode.ast.body[0];
        location = sourceCode.ast.body[1].loc.start;
        message = "foo";
        translateReport = createReportTranslator({ ruleId: "foo-rule", severity: 2, sourceCode, messageIds: { testMessage: message } });
    });

    describe("old-style call with location", () => {
        it("should extract the location correctly", () => {
            assert.deepStrictEqual(
                translateReport(node, location, message, {}),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement"
                }
            );
        });
    });

    describe("old-style call without location", () => {
        it("should use the start location and end location of the node", () => {
            assert.deepStrictEqual(
                translateReport(node, message, {}),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4,
                    nodeType: "ExpressionStatement"
                }
            );
        });
    });

    describe("new-style call with all options", () => {
        it("should include the new-style options in the report", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                fix: () => ({ range: [1, 2], text: "foo" })
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 2],
                        text: "foo"
                    }
                }
            );
        });
        it("should translate the messageId into a message", () => {
            const reportDescriptor = {
                node,
                loc: location,
                messageId: "testMessage",
                fix: () => ({ range: [1, 2], text: "foo" })
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    messageId: "testMessage",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 2],
                        text: "foo"
                    }
                }
            );
        });
        it("should throw when both messageId and message are provided", () => {
            const reportDescriptor = {
                node,
                loc: location,
                messageId: "testMessage",
                message: "bar",
                fix: () => ({ range: [1, 2], text: "foo" })
            };

            assert.throws(
                () => translateReport(reportDescriptor),
                TypeError,
                "context.report() called with a message and a messageId. Please only pass one."
            );
        });
        it("should throw when an invalid messageId is provided", () => {
            const reportDescriptor = {
                node,
                loc: location,
                messageId: "thisIsNotASpecifiedMessageId",
                fix: () => ({ range: [1, 2], text: "foo" })
            };

            assert.throws(
                () => translateReport(reportDescriptor),
                TypeError,
                /^context\.report\(\) called with a messageId of '[^']+' which is not present in the 'messages' config:/u
            );
        });
        it("should throw when no message is provided", () => {
            const reportDescriptor = { node };

            assert.throws(
                () => translateReport(reportDescriptor),
                TypeError,
                "Missing `message` property in report() call; add a message that describes the linting problem."
            );
        });
    });
    describe("combining autofixes", () => {
        it("should merge fixes to one if 'fix' function returns an array of fixes.", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                fix: () => [{ range: [1, 2], text: "foo" }, { range: [4, 5], text: "bar" }]
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 5],
                        text: "fooo\nbar"
                    }
                }
            );
        });

        it("should merge fixes to one if 'fix' function returns an iterator of fixes.", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                *fix() {
                    yield { range: [1, 2], text: "foo" };
                    yield { range: [4, 5], text: "bar" };
                }
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 5],
                        text: "fooo\nbar"
                    }
                }
            );
        });

        it("should pass through fixes if only one is present", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                fix: () => [{ range: [1, 2], text: "foo" }]
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 2],
                        text: "foo"
                    }
                }
            );
        });

        it("should handle inserting BOM correctly.", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                fix: () => [{ range: [0, 3], text: "\uFEFFfoo" }, { range: [4, 5], text: "x" }]
            };

            assert.deepStrictEqual(
                translateReport(reportDescriptor),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "foo",
                    line: 2,
                    column: 1,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [0, 5],
                        text: "\uFEFFfoo\nx"
                    }
                }
            );
        });


        it("should handle removing BOM correctly.", () => {
            const sourceCode = createSourceCode("\uFEFFfoo\nbar");

            node = sourceCode.ast.body[0];

            const reportDescriptor = {
                node,
                message,
                fix: () => [{ range: [-1, 3], text: "foo" }, { range: [4, 5], text: "x" }]
            };

            assert.deepStrictEqual(
                createReportTranslator({ ruleId: "foo-rule", severity: 1, sourceCode })(reportDescriptor),
                {
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
                        text: "foo\nx"
                    }
                }
            );
        });

        it("should throw an assertion error if ranges are overlapped.", () => {
            const reportDescriptor = {
                node,
                loc: location,
                message,
                fix: () => [{ range: [0, 3], text: "\uFEFFfoo" }, { range: [2, 5], text: "x" }]
            };

            assert.throws(
                translateReport.bind(null, reportDescriptor),
                "Fix objects must not be overlapped in a report."
            );
        });

        it("should include a fix passed as the last argument when location is passed", () => {
            assert.deepStrictEqual(
                translateReport(
                    node,
                    { line: 42, column: 23 },
                    "my message {{1}}{{0}}",
                    ["!", "testing"],
                    () => ({ range: [1, 1], text: "" })
                ),
                {
                    ruleId: "foo-rule",
                    severity: 2,
                    message: "my message testing!",
                    line: 42,
                    column: 24,
                    nodeType: "ExpressionStatement",
                    fix: {
                        range: [1, 1],
                        text: ""
                    }
                }
            );
        });

    });

    describe("message interpolation", () => {
        it("should correctly parse a message when being passed all options in an old-style report", () => {
            assert.deepStrictEqual(
                translateReport(node, node.loc.end, "hello {{dynamic}}", { dynamic: node.type }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello ExpressionStatement",
                    nodeType: "ExpressionStatement",
                    line: 1,
                    column: 4
                }
            );
        });

        it("should correctly parse a message when being passed all options in a new-style report", () => {
            assert.deepStrictEqual(
                translateReport({ node, loc: node.loc.end, message: "hello {{dynamic}}", data: { dynamic: node.type } }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello ExpressionStatement",
                    nodeType: "ExpressionStatement",
                    line: 1,
                    column: 4
                }
            );
        });

        it("should correctly parse a message with object keys as numbers", () => {
            assert.strictEqual(
                translateReport(node, "my message {{name}}{{0}}", { 0: "!", name: "testing" }).message,
                "my message testing!"
            );
        });

        it("should correctly parse a message with array", () => {
            assert.strictEqual(
                translateReport(node, "my message {{1}}{{0}}", ["!", "testing"]).message,
                "my message testing!"
            );
        });

        it("should allow template parameter with inner whitespace", () => {
            assert.strictEqual(
                translateReport(node, "message {{parameter name}}", { "parameter name": "yay!" }).message,
                "message yay!"
            );
        });

        it("should allow template parameter with non-identifier characters", () => {
            assert.strictEqual(
                translateReport(node, "message {{parameter-name}}", { "parameter-name": "yay!" }).message,
                "message yay!"
            );
        });

        it("should allow template parameter wrapped in braces", () => {
            assert.strictEqual(
                translateReport(node, "message {{{param}}}", { param: "yay!" }).message,
                "message {yay!}"
            );
        });

        it("should ignore template parameter with no specified value", () => {
            assert.strictEqual(
                translateReport(node, "message {{parameter}}", {}).message,
                "message {{parameter}}"
            );
        });

        it("should handle leading whitespace in template parameter", () => {
            assert.strictEqual(
                translateReport({ node, message: "message {{ parameter}}", data: { parameter: "yay!" } }).message,
                "message yay!"
            );
        });

        it("should handle trailing whitespace in template parameter", () => {
            assert.strictEqual(
                translateReport({ node, message: "message {{parameter }}", data: { parameter: "yay!" } }).message,
                "message yay!"
            );
        });

        it("should still allow inner whitespace as well as leading/trailing", () => {
            assert.strictEqual(
                translateReport(node, "message {{ parameter name }}", { "parameter name": "yay!" }).message,
                "message yay!"
            );
        });

        it("should still allow non-identifier characters as well as leading/trailing whitespace", () => {
            assert.strictEqual(
                translateReport(node, "message {{ parameter-name }}", { "parameter-name": "yay!" }).message,
                "message yay!"
            );
        });
    });

    describe("location inference", () => {
        it("should use the provided location when given in an old-style call", () => {
            assert.deepStrictEqual(
                translateReport(node, { line: 42, column: 13 }, "hello world"),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: "ExpressionStatement",
                    line: 42,
                    column: 14
                }
            );
        });

        it("should use the provided location when given in an new-style call", () => {
            assert.deepStrictEqual(
                translateReport({ node, loc: { line: 42, column: 13 }, message: "hello world" }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: "ExpressionStatement",
                    line: 42,
                    column: 14
                }
            );
        });

        it("should extract the start and end locations from a node if no location is provided", () => {
            assert.deepStrictEqual(
                translateReport(node, "hello world"),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: "ExpressionStatement",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4
                }
            );
        });

        it("should have 'endLine' and 'endColumn' when 'loc' property has 'end' property.", () => {
            assert.deepStrictEqual(
                translateReport({ loc: node.loc, message: "hello world" }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: null,
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4
                }
            );
        });

        it("should not have 'endLine' and 'endColumn' when 'loc' property does not have 'end' property.", () => {
            assert.deepStrictEqual(
                translateReport({ loc: node.loc.start, message: "hello world" }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: null,
                    line: 1,
                    column: 1
                }
            );
        });

        it("should infer an 'endLine' and 'endColumn' property when using the object-based context.report API", () => {
            assert.deepStrictEqual(
                translateReport({ node, message: "hello world" }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: "ExpressionStatement",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4
                }
            );
        });
    });

    describe("converting old-style calls", () => {
        it("should include a fix passed as the last argument when location is not passed", () => {
            assert.deepStrictEqual(
                translateReport(node, "my message {{1}}{{0}}", ["!", "testing"], () => ({ range: [1, 1], text: "" })),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "my message testing!",
                    nodeType: "ExpressionStatement",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 4,
                    fix: { range: [1, 1], text: "" }
                }
            );
        });
    });

    describe("validation", () => {

        it("should throw an error if node is not an object", () => {
            assert.throws(
                () => translateReport("not a node", "hello world"),
                "Node must be an object"
            );
        });


        it("should not throw an error if location is provided and node is not in an old-style call", () => {
            assert.deepStrictEqual(
                translateReport(null, { line: 1, column: 1 }, "hello world"),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: null,
                    line: 1,
                    column: 2
                }
            );
        });

        it("should not throw an error if location is provided and node is not in a new-style call", () => {
            assert.deepStrictEqual(
                translateReport({ loc: { line: 1, column: 1 }, message: "hello world" }),
                {
                    severity: 2,
                    ruleId: "foo-rule",
                    message: "hello world",
                    nodeType: null,
                    line: 1,
                    column: 2
                }
            );
        });

        it("should throw an error if neither node nor location is provided", () => {
            assert.throws(
                () => translateReport(null, "hello world"),
                "Node must be provided when reporting error if location is not provided"
            );
        });
    });
});
