/**
 * @fileoverview Tests for apply-disable-directives
 * @author Teddy Katz
 */

"use strict";

const assert = require("chai").assert;
const espree = require("espree");
const applyDisableDirectives = require("../../../lib/linter/apply-disable-directives");
const { SourceCode } = require("../../../lib/source-code");

const DEFAULT_CONFIG = {
    ecmaVersion: 6,
    comment: true,
    tokens: true,
    range: true,
    loc: true
};

/**
 * Create a SourceCode instance from the given code.
 * @param {string} text The text of the code.
 * @returns {SourceCode} The SourceCode.
 */
function createSourceCode(text) {
    return new SourceCode(text, espree.parse(text, DEFAULT_CONFIG));
}

/**
 * Creates a ParentComment for a given range.
 * @param {number} startLine loc.start.line value
 * @param {number} startColumn loc.start.column value
 * @param {number} endLine loc.end.line value
 * @param {number} endColumn loc.end.column value
 * @param {string[]} ruleIds Rule IDs reported in the comment
 * @returns {ParentComment} Test-ready ParentComment object.
 */
function createParentComment(startLine, startColumn, endLine, endColumn, ruleIds = []) {
    return {
        loc: {
            start: {
                line: startLine,
                column: startColumn
            },
            end: {
                line: endLine,
                column: endColumn
            }
        },
        ruleIds
    };
}

describe("apply-disable-directives", () => {
    describe("/* eslint-disable */ comments without rules", () => {
        it("keeps problems before the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ parentComment: createParentComment(1, 7, 1, 27), type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; /* eslint-disable */")
                }),
                [{ ruleId: "foo", line: 1, column: 7 }]
            );
        });

        it("keeps problems on a previous line before the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ parentComment: createParentComment(2, 1, 2, 20), type: "disable", line: 2, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }],
                    sourceCode: createSourceCode("\n/* eslint-disable*/")
                }),
                [{ ruleId: "foo", line: 1, column: 10 }]
            );
        });

        it("filters problems at the same location as the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 8, ruleId: null }],
                    sourceCode: createSourceCode("first; /* eslint-disable foo */")
                }),
                []
            );
        });

        it("filters out problems after the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                []
            );
        });

        it("filters out problems on a later line than the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; /* eslint-disable foo */")
                }),
                []
            );
        });
    });

    describe("/* eslint-disable */ comments with rules", () => {
        it("filters problems after the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; /* eslint-disable foo */")
                }),
                []
            );
        });

        it("filters problems in the same location as the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 1, column: 8, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; /* eslint-disable foo */")
                }),
                []
            );
        });

        it("keeps problems after the comment that have a different ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 2, column: 3, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("/* eslint-disable foo */")
                }),
                [{ line: 2, column: 3, ruleId: "not-foo" }]
            );
        });

        it("keeps problems before the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; /* eslint-disable foo */")
                }),
                [{ line: 1, column: 7, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-enable comments without rules", () => {
        it("keeps problems after the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 26, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 27, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable */")
                }),
                [{ line: 1, column: 27, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 26, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 26, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable */")
                }),
                [{ line: 1, column: 26, ruleId: "foo" }]
            );
        });

        it("filters out problems before the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 26, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable */")
                }),
                []
            );
        });

        it("filter out problems if disable all then enable foo and then disable foo", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 26, ruleId: "foo" },
                        { type: "disable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable foo */\n/* eslint-disable foo */")
                }),
                []
            );
        });

        it("filter out problems if disable all then enable foo and then disable all", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 26, ruleId: "foo" },
                        { type: "disable", line: 2, column: 1, ruleId: null }
                    ],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable foo *//* eslint-disable */")
                }),
                []
            );
        });

        it("keeps problems before the eslint-enable comment if there is no corresponding disable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: "foo" },
                        { type: "enable", line: 1, column: 26, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("/* eslint-disable foo */ /* eslint-enable */")
                }),
                [{ line: 1, column: 3, ruleId: "not-foo" }]
            );
        });
    });

    describe("eslint-enable comments with rules", () => {
        it("keeps problems after the comment that have the same ruleId as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-enable foo */")
                }),
                [{ line: 2, column: 4, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the comment that have the same ruleId as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-enable foo */")
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });

        it("filters problems after the comment that have a different ruleId as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-enable foo */")
                }),
                []
            );
        });

        it("reenables reporting correctly even when followed by another enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 22, ruleId: "foo" },
                        { type: "enable", line: 1, column: 46, ruleId: "bar" }
                    ],
                    problems: [
                        { line: 1, column: 10, ruleId: "foo" },
                        { line: 1, column: 10, ruleId: "bar" },
                        { line: 1, column: 30, ruleId: "foo" },
                        { line: 1, column: 30, ruleId: "bar" },
                        { line: 1, column: 50, ruleId: "foo" },
                        { line: 1, column: 50, ruleId: "bar" }
                    ],
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable foo */ /* eslint-enable bar */")
                }),
                [
                    { line: 1, column: 30, ruleId: "foo" },
                    { line: 1, column: 50, ruleId: "foo" },
                    { line: 1, column: 50, ruleId: "bar" }
                ]
            );
        });
    });

    describe("eslint-disable-line comments without rules", () => {
        it("keeps problems on a previous line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 2, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 5, ruleId: "foo" }],
                    sourceCode: createSourceCode("first;\n// eslint-disable-line")
                }),
                [{ line: 1, column: 5, ruleId: "foo" }]
            );
        });

        it("filters problems before the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 1, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; // eslint-disable-line")
                }),
                []
            );
        });

        it("filters problems after the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; // eslint-disable-line")
                }),
                []
            );
        });

        it("keeps problems on a following line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 8 }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; // eslint-disable-line foo")
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-disable-line comments with rules", () => {
        it("filters problems on the current line that match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 1, column: 2, ruleId: "foo" }],
                    sourceCode: createSourceCode("first; // eslint-disable-line foo")
                }),
                []
            );
        });

        it("keeps problems on the current line that do not match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 1, column: 2, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("// eslint-disable-line foo")
                }),
                [{ line: 1, column: 2, ruleId: "not-foo" }]
            );
        });

        it("filters problems on the current line that do not match the ruleId if preceded by a disable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable-line", line: 1, column: 22, ruleId: "foo" }
                    ],
                    problems: [{ line: 1, column: 5, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("/* eslint-disable */ // eslint-disable-line foo")
                }),
                []
            );
        });

        it("handles consecutive comments appropriately", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable-line", line: 1, column: 8, ruleId: "foo" },
                        { type: "disable-line", line: 2, column: 8, ruleId: "foo" },
                        { type: "disable-line", line: 3, column: 8, ruleId: "foo" },
                        { type: "disable-line", line: 4, column: 8, ruleId: "foo" },
                        { type: "disable-line", line: 5, column: 8, ruleId: "foo" },
                        { type: "disable-line", line: 6, column: 8, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    sourceCode: createSourceCode(
                        new Array(6).fill(0).map(() => "first; // eslint-disable-line foo").join("\n")
                    )
                }),
                []
            );
        });
    });

    describe("eslint-disable-next-line comments without rules", () => {
        it("filters problems on the next line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line")
                }),
                []
            );
        });

        it("keeps problems on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line")
                }),
                [{ line: 1, column: 3, ruleId: "foo" }]
            );
        });

        it("keeps problems after the next line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line")
                }),
                [{ line: 3, column: 3, ruleId: "foo" }]
            );
        });

        it("filters problems on the next line even if there is an eslint-enable comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable-next-line", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 2, column: 2, ruleId: "foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line\n/* eslint-enable */")
                }),
                []
            );
        });
    });

    describe("eslint-disable-next-line comments with rules", () => {
        it("filters problems on the next line that match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line foo")
                }),
                []
            );
        });

        it("keeps problems on the next line that do not match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 2, column: 1, ruleId: "not-foo" }],
                    sourceCode: createSourceCode("// eslint-disable-next-line foo\n/* eslint-enable foo */")
                }),
                [{ line: 2, column: 1, ruleId: "not-foo" }]
            );
        });
    });

    describe("unrecognized directive types", () => {
        it("throws a TypeError when it encounters an unrecognized directive", () => {
            assert.throws(
                () =>
                    applyDisableDirectives({
                        directives: [{ type: "foo", line: 1, column: 4, ruleId: "foo" }],
                        problems: []
                    }),
                "Unrecognized directive type 'foo'"
            );
        });
    });

    describe("unused directives", () => {
        it("Adds a problem for /* eslint-disable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1 }],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 20],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Does not add a problem for /* eslint-disable */ /* (problem) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */")
                }),
                []
            );
        });

        it("Adds a problem for /* eslint-disable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: "foo" }],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable foo */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 24],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from another rule) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 1, column: 20, ruleId: "not-foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable foo */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 24],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: "not-foo",
                        line: 1,
                        column: 20
                    }
                ]
            );
        });

        it("Adds a problem for /* (problem from foo) */ /* eslint-disable */ /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 8, ruleId: null },
                        { type: "enable", line: 1, column: 24, ruleId: "foo" }
                    ],
                    problems: [{ line: 1, column: 2, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("first; /* eslint-disable */ /* eslint-enable foo */")
                }),
                [
                    {
                        ruleId: "foo",
                        line: 1,
                        column: 2
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        fix: {
                            range: [7, 28],
                            text: ""
                        },
                        line: 1,
                        column: 8,
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 12, ruleId: null }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 20],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds two problems for /* eslint-disable */ /* eslint-disable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable", line: 2, column: 1, ruleId: null }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-disable */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 21],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 2,
                        column: 1,
                        fix: {
                            range: [21, 41],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-disable */ /* (problem) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable", line: 2, column: 1, ruleId: null }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-disable */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 21],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* eslint-disable */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: "foo" },
                        { type: "disable", line: 2, column: 1, ruleId: null }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable foo */\n/* eslint-disable */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 25],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Does not add a problem for /* eslint-disable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 1, column: 6, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable foo */")
                }),
                []
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-disable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-disable foo */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 21],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-disable foo */ /* (problem from another rule) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "bar" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-disable foo */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 2,
                        column: 1,
                        fix: {
                            range: [21, 45],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* eslint-enable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment(1, 0, 1, 20),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo"
                        },
                        {
                            parentComment: createParentComment(1, 26, 1, 46),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: "foo"
                        }
                    ],
                    problems: [{ line: 1, column: 30, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */ /* eslint-enable foo */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 20],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: "foo",
                        line: 1,
                        column: 30
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* eslint-enable */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment(1, 0, 1, 24),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo"
                        },
                        {
                            parentComment: createParentComment(1, 0, 25, 49),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: null
                        }
                    ],
                    problems: [{ line: 1, column: 30, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable foo */ /* eslint-enable */ /* (problem from foo) */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 24],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: "foo",
                        line: 1,
                        column: 30
                    }
                ]
            );
        });

        it("Adds two problems for /* eslint-disable */ /* eslint-disable foo */ /* eslint-enable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment(1, 0, 1, 21),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null
                        },
                        {
                            parentComment: createParentComment(2, 0, 2, 24),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: "foo"
                        },
                        {
                            parentComment: createParentComment(3, 0, 3, 23),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo"
                        }
                    ],
                    problems: [{ line: 4, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */\n/* eslint-disable foo */\n/* eslint-enable foo */ /* (problem from foo) */")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 21],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 2,
                        column: 1,
                        fix: {
                            range: [21, 45],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: "foo",
                        line: 4,
                        column: 1
                    }
                ]
            );
        });

        it("Adds a problem for // eslint-disable-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment(1, 0, 1, 22),
                        type: "disable-line",
                        line: 1,
                        column: 1,
                        ruleId: null
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("// eslint-disable-line")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 22],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });


        it("Does not add a problem for // eslint-disable-line (problem)", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable line */")
                }),
                []
            );
        });

        it("Adds a problem for // eslint-disable-next-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment(1, 0, 1, 27),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: null
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("// eslint-disable-next-line")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 27],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Does not add a problem for // eslint-disable-next-line \\n (problem)", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 2, column: 10, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("// eslint-disable foo-next-line")
                }),
                []
            );
        });

        it("adds two problems for /* eslint-disable */ // eslint-disable-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { parentComment: createParentComment(1, 0, 1, 20), type: "disable", line: 1, column: 1, ruleId: null },
                        { parentComment: createParentComment(1, 20, 1, 43), type: "disable-line", line: 1, column: 22, ruleId: null }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error",
                    sourceCode: createSourceCode("/* eslint-disable */ // eslint-disable-line")
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 1,
                        fix: {
                            range: [0, 20],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 22,
                        fix: {
                            range: [20, 43],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Does not add problems when reportUnusedDisableDirectives: \"off\" is used", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ parentComment: createParentComment(1, 1, 1, 27), type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [],
                    reportUnusedDisableDirectives: "off",
                    sourceCode: createSourceCode("// eslint-disable-next-line")
                }),
                []
            );
        });
    });
});
