/**
 * @fileoverview Tests for apply-disable-directives
 * @author Teddy Katz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const applyDisableDirectives = require("../../../lib/linter/apply-disable-directives");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Creates a ParentComment for a given range.
 * @param {[number, number]} range total range of the comment
 * @param {string} value String value of the comment
 * @param {string[]} ruleIds Rule IDs reported in the value
 * @returns {ParentComment} Test-ready ParentComment object.
 */
function createParentComment(range, value, ruleIds = []) {
    return {
        commentToken: {
            range,
            loc: {
                start: {
                    line: 1,
                    column: 1
                },
                end: {
                    line: 1,
                    column: value ? value.length : 10
                }
            },
            value
        },
        ruleIds
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("apply-disable-directives", () => {
    describe("/* eslint-disable */ comments without rules", () => {
        it("keeps problems before the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ parentComment: createParentComment([0, 7]), type: "disable", line: 1, column: 8, ruleId: null, justification: "justification" }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }]
                }),
                [{ line: 1, column: 7, ruleId: "foo" }]
            );
        });

        it("keeps problems on a previous line before the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ parentComment: createParentComment([21, 27]), type: "disable", line: 2, column: 1, ruleId: null, justification: "justification" }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                [{ line: 1, column: 10, ruleId: "foo" }]
            );
        });

        it("filters problems at the same location as the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null, justification: "justification" }],
                    problems: [{ line: 1, column: 8, ruleId: null }]
                }),
                [{ line: 1, column: 8, ruleId: null, suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("filters out problems after the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null, justification: "justification" }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                [{ line: 1, column: 10, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("filters out problems on a later line than the comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null, justification: "justification" }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                [{ line: 2, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });
    });

    describe("/* eslint-disable */ comments with rules", () => {
        it("filters problems after the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo", justification: "justification" }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                [{ line: 2, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("filters problems in the same location as the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo", justification: "justification" }],
                    problems: [{ line: 1, column: 8, ruleId: "foo" }]
                }),
                [{ line: 1, column: 8, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("keeps problems after the comment that have a different ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([26, 29]),
                        type: "disable",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 2, column: 3, ruleId: "not-foo" }]
                }),
                [{ line: 2, column: 3, ruleId: "not-foo" }]
            );
        });

        it("keeps problems before the comment that have the same ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([7, 31]),
                        type: "disable",
                        line: 1,
                        column: 8,
                        ruleId: "foo"
                    }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }]
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
                        {
                            parentComment: createParentComment([0, 26]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([27, 45]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 27, ruleId: "foo" }]
                }),
                [{ line: 1, column: 27, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 25]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([26, 40]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 26, ruleId: "foo" }]
                }),
                [{ line: 1, column: 26, ruleId: "foo" }]
            );
        });

        it("filters out problems before the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null, justification: "j1" },
                        { type: "enable", line: 1, column: 26, ruleId: null, justification: "j2" }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }]
                }),
                [{ line: 1, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j1" }] }]
            );
        });

        it("filter out problems if disable all then enable foo and then disable foo", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([26, 44]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([45, 63]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }]
                }),
                [{ line: 3, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j3" }] }]
            );
        });

        it("filter out problems if disable all then enable foo and then disable all", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 44]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([45, 63]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }]
                }),
                [{ line: 3, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j3" }] }]
            );
        });

        it("keeps problems before the eslint-enable comment if there is no corresponding disable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([25, 44]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "not-foo" }]
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
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 44]),
                            type: "enable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "foo" }]
                }),
                [{ line: 2, column: 4, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the comment that have the same ruleId as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 44]),
                            type: "enable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });

        it("filters problems after the comment that have a different ruleId as the eslint-enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 44]),
                            type: "enable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "not-foo" }]
                }),
                [{ line: 2, column: 4, ruleId: "not-foo", suppressions: [{ kind: "directive", justification: "j1" }] }]
            );
        });

        it("reenables reporting correctly even when followed by another enable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null, justification: "j1" },
                        { type: "enable", line: 1, column: 22, ruleId: "foo", justification: "j2" },
                        { type: "enable", line: 1, column: 46, ruleId: "bar", justification: "j3" }
                    ],
                    problems: [
                        { line: 1, column: 10, ruleId: "foo" },
                        { line: 1, column: 10, ruleId: "bar" },
                        { line: 1, column: 30, ruleId: "foo" },
                        { line: 1, column: 30, ruleId: "bar" },
                        { line: 1, column: 50, ruleId: "foo" },
                        { line: 1, column: 50, ruleId: "bar" }
                    ]
                }),
                [
                    { line: 1, column: 10, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j1" }] },
                    { line: 1, column: 10, ruleId: "bar", suppressions: [{ kind: "directive", justification: "j1" }] },
                    { line: 1, column: 30, ruleId: "foo" },
                    { line: 1, column: 30, ruleId: "bar", suppressions: [{ kind: "directive", justification: "j1" }] },
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
                    directives: [{
                        parentComment: createParentComment([6, 27]),
                        type: "disable-line",
                        line: 2,
                        column: 1,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 5, ruleId: "foo" }]
                }),
                [{ line: 1, column: 5, ruleId: "foo" }]
            );
        });

        it("filters problems before the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([7, 28]),
                        type: "disable-line",
                        line: 1,
                        column: 8,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 1, ruleId: "foo" }]
                }),
                [{ line: 1, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("filters problems after the comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([7, 28]),
                        type: "disable-line",
                        line: 1,
                        column: 8,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                [{ line: 1, column: 10, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("keeps problems on a following line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([7, 34]),
                        type: "disable-line",
                        line: 1,
                        column: 8,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-disable-line comments with rules", () => {
        it("filters problems on the current line that match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([7, 34]),
                        type: "disable-line",
                        line: 1,
                        column: 8,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 2, ruleId: "foo" }]
                }),
                [{ line: 1, column: 2, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("keeps problems on the current line that do not match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 27]),
                        type: "disable-line",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 2, ruleId: "not-foo" }]
                }),
                [{ line: 1, column: 2, ruleId: "not-foo" }]
            );
        });

        it("filters problems on the current line that do not match the ruleId if preceded by a disable comment", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([24, 28]),
                            type: "disable-line",
                            line: 1,
                            column: 22,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 5, ruleId: "not-foo" }]
                }),
                [{ line: 1, column: 5, ruleId: "not-foo", suppressions: [{ kind: "directive", justification: "j1" }] }]
            );
        });

        it("handles consecutive comments appropriately", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([7, 34]),
                            type: "disable-line",
                            line: 1,
                            column: 8,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([38, 73]),
                            type: "disable-line",
                            line: 2,
                            column: 8,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([76, 111]),
                            type: "disable-line",
                            line: 3,
                            column: 8,
                            ruleId: "foo",
                            justification: "j3"
                        },
                        {
                            parentComment: createParentComment([114, 149]),
                            type: "disable-line",
                            line: 4,
                            column: 8,
                            ruleId: "foo",
                            justification: "j4"
                        },
                        {
                            parentComment: createParentComment([152, 187]),
                            type: "disable-line",
                            line: 5,
                            column: 8,
                            ruleId: "foo",
                            justification: "j5"
                        },
                        {
                            parentComment: createParentComment([190, 225]),
                            type: "disable-line",
                            line: 6,
                            column: 8,
                            ruleId: "foo",
                            justification: "j6"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j2" }] }]
            );
        });
    });

    describe("eslint-disable-next-line comments without rules", () => {
        it("filters problems on the next line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 31]),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                [{ line: 2, column: 3, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("keeps problems on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 31]),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: null
                    }],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }]
                }),
                [{ line: 1, column: 3, ruleId: "foo" }]
            );
        });

        it("keeps problems after the next line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 31]),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }]
                }),
                [{ line: 3, column: 3, ruleId: "foo" }]
            );
        });

        it("filters problems on the next line even if there is an eslint-enable comment on the same line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { parentComment: createParentComment([0, 31]), type: "disable-next-line", line: 1, column: 1, ruleId: null, justification: "j1" },
                        { parentComment: createParentComment([31, 50]), type: "enable", line: 1, column: 31, ruleId: null, justification: "j2" }
                    ],
                    problems: [{ line: 2, column: 2, ruleId: "foo" }]
                }),
                [{ line: 2, column: 2, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j1" }] }]
            );
        });
    });

    describe("eslint-disable-next-line comments with rules", () => {
        it("filters problems on the next line that match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: "foo", justification: "justification" }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("keeps problems on the next line that do not match the ruleId", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 31]),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 2, column: 1, ruleId: "not-foo" }]
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
                        directives: [{ type: "foo", line: 1, column: 4, ruleId: "foo", justification: "justification" }],
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
                    directives: [{
                        parentComment: createParentComment([0, 20]),
                        type: "disable",
                        line: 1,
                        column: 1,
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
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
                }]
            );
        });

        it("Does not fix a problem for /* eslint-disable */ when disableFixes is enabled", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 20]),
                        type: "disable",
                        line: 1,
                        column: 1,
                        justification: "justification"
                    }],
                    disableFixes: true,
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
                    ruleId: null,
                    message: "Unused eslint-disable directive (no problems were reported).",
                    line: 1,
                    column: 1,
                    severity: 2,
                    nodeType: null
                }]
            );
        });

        it("Does not add a problem for /* eslint-disable */ /* (problem) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: null, justification: "justification" }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 2, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("Adds a problem for /* eslint-disable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 21]),
                        type: "disable",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
                    ruleId: null,
                    message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                    line: 1,
                    column: 1,
                    fix: {
                        range: [0, 21],
                        text: " "
                    },
                    severity: 2,
                    nodeType: null
                }]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from another rule) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 24]),
                        type: "disable",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [{ line: 1, column: 20, ruleId: "not-foo" }],
                    reportUnusedDisableDirectives: "error"
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
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 8,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "enable",
                            line: 1,
                            column: 24,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 2, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                            range: [0, 21],
                            text: " "
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
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 41]),
                            type: "enable",
                            line: 1,
                            column: 12,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
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
                }]
            );
        });

        it("Adds two problems for /* eslint-disable */ /* eslint-disable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 42]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
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
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 2,
                        column: 1,
                        fix: {
                            range: [21, 42],
                            text: " "
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
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([22, 45]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                        line: 3,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [
                            { kind: "directive", justification: "j1" },
                            { kind: "directive", justification: "j2" }
                        ]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* eslint-disable */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([22, 45]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
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
                        line: 3,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [
                            { kind: "directive", justification: "j1" },
                            { kind: "directive", justification: "j2" }
                        ]
                    }
                ]
            );
        });

        it("Does not add a problem for /* eslint-disable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 1, ruleId: "foo", justification: "justification" }],
                    problems: [{ line: 1, column: 6, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 1, column: 6, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-disable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([22, 45]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                        line: 3,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [
                            { kind: "directive", justification: "j1" },
                            { kind: "directive", justification: "j2" }
                        ]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable */ /* eslint-disable foo */ /* (problem from another rule) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 45]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "bar" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
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
                        line: 3,
                        column: 1,
                        ruleId: "bar",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* eslint-enable foo */ /* (problem from foo) */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([25, 46]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 30, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                            parentComment: createParentComment([0, 24]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([25, 49]),
                            type: "enable",
                            line: 1,
                            column: 26,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 1, column: 30, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([22, 45]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([46, 69]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 4, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
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
                            range: [22, 45],
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

        it("Adds a problem for /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 20]),
                        type: "enable",
                        line: 1,
                        column: 1,
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
                    ruleId: null,
                    message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                    line: 1,
                    column: 1,
                    fix: {
                        range: [0, 20],
                        text: " "
                    },
                    severity: 2,
                    nodeType: null
                }]
            );
        });

        it("Does not fix a problem for /* eslint-enable */ when disableFixes is enabled", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 20]),
                        type: "enable",
                        line: 1,
                        column: 1,
                        justification: "justification"
                    }],
                    disableFixes: true,
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
                    ruleId: null,
                    message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                    line: 1,
                    column: 1,
                    severity: 2,
                    nodeType: null
                }]
            );
        });

        it("Does not add a problem for /* eslint-disable */ /* (problem) */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null, justification: "justification" },
                        { type: "enable", line: 3, column: 1, ruleId: null, justification: "justification" }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 2, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("Adds a problem for /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 21]),
                        type: "enable",
                        line: 1,
                        column: 1,
                        ruleId: "foo",
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [{
                    ruleId: null,
                    message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                    line: 1,
                    column: 1,
                    fix: {
                        range: [0, 21],
                        text: " "
                    },
                    severity: 2,
                    nodeType: null
                }]
            );
        });

        it("Adds a problem for /* eslint-disable not-foo */ /* (problem from not-foo) */ /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 24]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "not-foo",
                            justification: "justification"
                        },
                        {
                            parentComment: createParentComment([48, 72]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "justification"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "not-foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: "not-foo",
                        line: 2,
                        column: 1,
                        suppressions: [{ justification: "justification", kind: "directive" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [48, 72],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable */ /* eslint-enable */ /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([42, 63]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([63, 84]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([84, 105]),
                            type: "enable",
                            line: 5,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: "foo",
                        line: 2,
                        column: 1,
                        suppressions: [{ justification: "j1", kind: "directive" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        fix: {
                            range: [63, 84],
                            text: " "
                        },
                        line: 4,
                        column: 1,
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        fix: {
                            range: [84, 105],
                            text: " "
                        },
                        line: 5,
                        column: 1,
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([42, 63]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([63, 84]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: "foo",
                        line: 2,
                        column: 1,
                        suppressions: [{ justification: "j1", kind: "directive" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        fix: {
                            range: [63, 84],
                            text: " "
                        },
                        line: 4,
                        column: 1,
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds two problems for /* eslint-enable */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "enable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 42]),
                            type: "enable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
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
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        line: 2,
                        column: 1,
                        fix: {
                            range: [21, 42],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-enable */ /* eslint-disable */  /* (problem) */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "enable",
                            line: 1,
                            column: 1,
                            ruleId: null,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([21, 42]),
                            type: "disable",
                            line: 2,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([63, 84]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: null,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 3, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
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
                        line: 3,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [{ kind: "directive", justification: "j2" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable */ /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([42, 63]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: null,
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([63, 84]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: "foo",
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [63, 84],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Does not add a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable foo */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: "foo", justification: "j1" },
                        { type: "enable", line: 3, column: 1, ruleId: "foo", justification: "j2" }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 2, column: 1, ruleId: "foo", suppressions: [{ kind: "directive", justification: "j1" }] }]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable foo */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 21]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([42, 63]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([63, 84]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: null,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [
                            { kind: "directive", justification: "j1" }
                        ]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [63, 84],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable bar */ /* (problem from bar) */ /* eslint-enable foo */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "bar",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([60, 80]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([80, 100]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: null,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "bar" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "bar",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [60, 80],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable foo */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([60, 80]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([80, 100]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: "foo",
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "foo",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [80, 100],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds two problems for /* eslint-disable foo */ /* (problem from foo) */ /* eslint-enable foo */ /* eslint-enable foo */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            type: "disable",
                            line: 1,
                            column: 1,
                            ruleId: "foo",
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([40, 60]),
                            type: "enable",
                            line: 3,
                            column: 1,
                            ruleId: "foo",
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([60, 80]),
                            type: "enable",
                            line: 4,
                            column: 1,
                            ruleId: "foo",
                            justification: "j3"
                        },
                        {
                            parentComment: createParentComment([80, 100]),
                            type: "enable",
                            line: 5,
                            column: 1,
                            ruleId: null,
                            justification: "j4"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: "foo",
                        line: 2,
                        column: 1,
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'foo').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [60, 80],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        line: 5,
                        column: 1,
                        fix: {
                            range: [80, 100],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-disable used */ /* (problem from used) */ /* eslint-enable used */ /* eslint-enable */", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 20]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([40, 60]),
                            ruleId: "used",
                            type: "disable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([80, 100]),
                            ruleId: "used",
                            type: "enable",
                            line: 5,
                            column: 1,
                            justification: "j3"
                        },
                        {
                            parentComment: createParentComment([100, 120]),
                            ruleId: null,
                            type: "enable",
                            line: 6,
                            column: 1,
                            justification: "j4"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }, { line: 4, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        line: 4,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }, { kind: "directive", justification: "j2" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found).",
                        line: 6,
                        column: 1,
                        fix: {
                            range: [100, 120],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for // eslint-disable-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 22]),
                        type: "disable-line",
                        line: 1,
                        column: 1,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
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
                    directives: [{ type: "disable-line", line: 1, column: 1, ruleId: null, justification: "justification" }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 1, column: 10, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("Adds a problem for // eslint-disable-next-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [{
                        parentComment: createParentComment([0, 27]),
                        type: "disable-next-line",
                        line: 1,
                        column: 2,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported).",
                        line: 1,
                        column: 2,
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
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null, justification: "justification" }],
                    problems: [{ line: 2, column: 10, ruleId: "foo" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [{ line: 2, column: 10, ruleId: "foo", suppressions: [{ kind: "directive", justification: "justification" }] }]
            );
        });

        it("adds two problems for /* eslint-disable */ // eslint-disable-line", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        { parentComment: createParentComment([0, 20]), type: "disable", line: 1, column: 1, ruleId: null },
                        { parentComment: createParentComment([20, 43]), type: "disable-line", line: 1, column: 22, ruleId: null }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
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
                    directives: [{
                        parentComment: createParentComment([0, 27]),
                        type: "disable-next-line",
                        line: 1,
                        column: 1,
                        ruleId: null,
                        justification: "justification"
                    }],
                    problems: [],
                    reportUnusedDisableDirectives: "off"
                }),
                []
            );
        });
    });

    describe("unused rules within directives", () => {
        it("Adds a problem for /* eslint-disable used, unused */", () => {
            const parentComment = createParentComment([0, 32], " eslint-disable used, unused ", ["used", "unused"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "disable",
                            line: 1,
                            column: 22,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused').",
                        line: 1,
                        column: 22,
                        fix: {
                            range: [22, 30],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    }
                ]
            );
        });
        it("Adds a problem for /* eslint-disable used , unused , -- unused and used are ok */", () => {
            const parentComment = createParentComment([0, 62], " eslint-disable used , unused , -- unused and used are ok ", ["used", "unused"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "disable",
                            line: 1,
                            column: 24,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused').",
                        line: 1,
                        column: 24,
                        fix: {
                            range: [23, 32],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused, used */", () => {
            const parentComment = createParentComment([0, 32], " eslint-disable unused, used ", ["unused", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 25,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [18, 26],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j2" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused,, ,, used */", () => {
            const parentComment = createParentComment([0, 37], " eslint-disable unused,, ,, used ", ["unused", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 29,
                            justification: "j2"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [18, 25],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j2" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused-1, unused-2, used */", () => {
            const parentComment = createParentComment([0, 45], " eslint-disable unused-1, unused-2, used ", ["unused-1", "unused-2", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "disable",
                            line: 1,
                            column: 28,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 38,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-1').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [18, 28],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-2').",
                        line: 1,
                        column: 28,
                        fix: {
                            range: [26, 36],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j3" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused-1, unused-2, used, unused-3 */", () => {
            const parentComment = createParentComment([0, 55], " eslint-disable unused-1, unused-2, used, unused-3 ", ["unused-1", "unused-2", "used", "unused-3"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "disable",
                            line: 1,
                            column: 28,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 38,
                            justification: "j3"
                        },
                        {
                            parentComment,
                            ruleId: "unused-3",
                            type: "disable",
                            line: 1,
                            column: 43,
                            justification: "j4"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-1').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [18, 28],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-2').",
                        line: 1,
                        column: 28,
                        fix: {
                            range: [26, 36],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-3').",
                        line: 1,
                        column: 43,
                        fix: {
                            range: [42, 52],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j3" }]
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused-1, unused-2 */", () => {
            const parentComment = createParentComment([0, 39], " eslint-disable unused-1, unused-2 ", ["unused-1", "unused-2"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "disable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "disable",
                            line: 1,
                            column: 28,
                            justification: "j2"
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-1' or 'unused-2').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [0, 39],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable unused-1, unused-2, unused-3 */", () => {
            const parentComment = createParentComment([0, 49], " eslint-disable unused-1, unused-2, unused-3 ", ["unused-1", "unused-2", "unused-3"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "disable",
                            line: 1,
                            column: 18
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "disable",
                            line: 1,
                            column: 28
                        },
                        {
                            parentComment,
                            ruleId: "unused-3",
                            type: "disable",
                            line: 1,
                            column: 38
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'unused-1', 'unused-2', or 'unused-3').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [0, 49],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable foo */ \\n (problem from foo and bar) // eslint-disable-line foo, bar", () => {
            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "foo",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment: createParentComment([41, 81], " eslint-disable-line foo, bar", ["foo", "bar"]),
                            ruleId: "foo",
                            type: "disable-line",
                            line: 2,
                            column: 11,
                            justification: "j2"
                        },
                        {
                            parentComment: createParentComment([41, 81], " eslint-disable-line foo, bar ", ["foo", "bar"]),
                            ruleId: "bar",
                            type: "disable-line",
                            line: 2,
                            column: 11,
                            justification: "j2"
                        }
                    ],
                    problems: [
                        { line: 2, column: 1, ruleId: "bar" },
                        { line: 2, column: 6, ruleId: "foo" }
                    ],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: "bar",
                        line: 2,
                        column: 1,
                        suppressions: [{ kind: "directive", justification: "j2" }]
                    },
                    {
                        ruleId: "foo",
                        line: 2,
                        column: 6,
                        suppressions: [
                            { kind: "directive", justification: "j1" },
                            { kind: "directive", justification: "j2" }
                        ]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-disable directive (no problems were reported from 'foo').",
                        line: 2,
                        column: 11,
                        fix: {
                            range: [64, 69],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable used, unused */", () => {
            const parentComment = createParentComment([0, 32], " eslint-enable used, unused ", ["used", "unused"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [21, 29],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });
        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable used , unused , -- unused and used are ok */", () => {
            const parentComment = createParentComment([0, 62], " eslint-enable used , unused , -- unused and used are ok ", ["used", "unused"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [22, 31],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable unused, used */", () => {
            const parentComment = createParentComment([0, 32], " eslint-enable unused, used ", ["unused", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [17, 25],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable unused,, ,, used */", () => {
            const parentComment = createParentComment([0, 37], " eslint-enable unused,, ,, used ", ["unused", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [17, 24],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable unused-1, unused-2, used */", () => {
            const parentComment = createParentComment([0, 45], " eslint-enable unused-1, unused-2, used ", ["unused-1", "unused-2", "used"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 5,
                            column: 1,
                            justification: "j4"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-1').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [17, 27],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-2').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [25, 35],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-disable used */ /* (problem from used) */ /* eslint-enable unused-1, unused-2, used, unused-3 */", () => {
            const parentComment = createParentComment([0, 55], " eslint-enable unused-1, unused-2, used, unused-3 ", ["unused-1", "unused-2", "used", "unused-3"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment: createParentComment([0, 29], " eslint-disable foo ", ["foo"]),
                            ruleId: "used",
                            type: "disable",
                            line: 1,
                            column: 1,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "enable",
                            line: 3,
                            column: 1,
                            justification: "j2"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "enable",
                            line: 4,
                            column: 1,
                            justification: "j3"
                        },
                        {
                            parentComment,
                            ruleId: "used",
                            type: "enable",
                            line: 5,
                            column: 1,
                            justification: "j4"
                        },
                        {
                            parentComment,
                            ruleId: "unused-3",
                            type: "enable",
                            line: 6,
                            column: 1,
                            justification: "j5"
                        }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "used" }],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        line: 2,
                        column: 1,
                        ruleId: "used",
                        suppressions: [{ kind: "directive", justification: "j1" }]
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-1').",
                        line: 3,
                        column: 1,
                        fix: {
                            range: [17, 27],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-2').",
                        line: 4,
                        column: 1,
                        fix: {
                            range: [25, 35],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    },
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-3').",
                        line: 6,
                        column: 1,
                        fix: {
                            range: [41, 51],
                            text: ""
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-enable unused-1, unused-2 */", () => {
            const parentComment = createParentComment([0, 39], " eslint-enable unused-1, unused-2 ", ["unused-1", "unused-2"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "enable",
                            line: 1,
                            column: 18,
                            justification: "j1"
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "enable",
                            line: 1,
                            column: 28,
                            justification: "j2"
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-1' or 'unused-2').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [0, 39],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });

        it("Adds a problem for /* eslint-enable unused-1, unused-2, unused-3 */", () => {
            const parentComment = createParentComment([0, 49], " eslint-enable unused-1, unused-2, unused-3 ", ["unused-1", "unused-2", "unused-3"]);

            assert.deepStrictEqual(
                applyDisableDirectives({
                    directives: [
                        {
                            parentComment,
                            ruleId: "unused-1",
                            type: "enable",
                            line: 1,
                            column: 18
                        },
                        {
                            parentComment,
                            ruleId: "unused-2",
                            type: "enable",
                            line: 1,
                            column: 28
                        },
                        {
                            parentComment,
                            ruleId: "unused-3",
                            type: "enable",
                            line: 1,
                            column: 38
                        }
                    ],
                    problems: [],
                    reportUnusedDisableDirectives: "error"
                }),
                [
                    {
                        ruleId: null,
                        message: "Unused eslint-enable directive (no matching eslint-disable directives were found for 'unused-1', 'unused-2', or 'unused-3').",
                        line: 1,
                        column: 18,
                        fix: {
                            range: [0, 49],
                            text: " "
                        },
                        severity: 2,
                        nodeType: null
                    }
                ]
            );
        });
    });
});
