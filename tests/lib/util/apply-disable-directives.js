/**
 * @fileoverview Tests for apply-disable-directives
 * @author Teddy Katz
 */

"use strict";

const assert = require("chai").assert;
const applyDisableDirectives = require("../../../lib/util/apply-disable-directives");

describe("apply-disable-directives", () => {
    describe("/* eslint-disable */ comments without rules", () => {
        it("keeps problems before the comment on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }]
                }),
                [{ ruleId: "foo", line: 1, column: 7 }]
            );
        });

        it("keeps problems on a previous line before the comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 2, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                [{ ruleId: "foo", line: 1, column: 10 }]
            );
        });

        it("filters problems at the same location as the comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 8, ruleId: null }]
                }),
                []
            );
        });

        it("filters out problems after the comment on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                []
            );
        });

        it("filters out problems on a later line than the comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: null }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                []
            );
        });
    });

    describe("/* eslint-disable */ comments with rules", () => {
        it("filters problems after the comment that have the same ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                []
            );
        });

        it("filters problems in the same location as the comment that have the same ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 1, column: 8, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems after the comment that have a different ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 2, column: 3, ruleId: "not-foo" }]
                }),
                [{ line: 2, column: 3, ruleId: "not-foo" }]
            );
        });

        it("keeps problems before the comment that have the same ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable", line: 1, column: 8, ruleId: "foo" }],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }]
                }),
                [{ line: 1, column: 7, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-enable comments without rules", () => {
        it("keeps problems after the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 7, ruleId: "foo" }]
                }),
                [{ line: 1, column: 7, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 5, ruleId: "foo" }]
                }),
                [{ line: 1, column: 5, ruleId: "foo" }]
            );
        });

        it("filters out problems before the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems before the eslint-enable comment if there is no corresponding disable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: "foo" },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 1, column: 3, ruleId: "not-foo" }]
                }),
                [{ line: 1, column: 3, ruleId: "not-foo" }]
            );
        });
    });

    describe("eslint-enable comments with rules", () => {
        it("keeps problems after the comment that have the same ruleId as the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 4, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "foo" }]
                }),
                [{ line: 2, column: 4, ruleId: "foo" }]
            );
        });

        it("keeps problems in the same location as the comment that have the same ruleId as the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 4, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });

        it("filters problems after the comment that have a different ruleId as the eslint-enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 4, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: "foo" }
                    ],
                    problems: [{ line: 2, column: 4, ruleId: "not-foo" }]
                }),
                []
            );
        });

        it("reenables reporting correctly even when followed by another enable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 3, ruleId: "foo" },
                        { type: "enable", line: 1, column: 5, ruleId: "bar" }
                    ],
                    problems: [
                        { line: 1, column: 2, ruleId: "foo" },
                        { line: 1, column: 2, ruleId: "bar" },
                        { line: 1, column: 4, ruleId: "foo" },
                        { line: 1, column: 4, ruleId: "bar" },
                        { line: 1, column: 6, ruleId: "foo" },
                        { line: 1, column: 6, ruleId: "bar" }
                    ]
                }),
                [
                    { line: 1, column: 4, ruleId: "foo" },
                    { line: 1, column: 6, ruleId: "foo" },
                    { line: 1, column: 6, ruleId: "bar" }
                ]
            );
        });
    });

    describe("eslint-disable-line comments without rules", () => {
        it("keeps problems on a previous line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 2, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 5, ruleId: "foo" }]
                }),
                [{ line: 1, column: 5, ruleId: "foo" }]
            );
        });

        it("filters problems before the comment on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 5, ruleId: null }],
                    problems: [{ line: 1, column: 1, ruleId: "foo" }]
                }),
                []
            );
        });

        it("filters problems after the comment on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 5, ruleId: null }],
                    problems: [{ line: 1, column: 10, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems on a following line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 4 }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                [{ line: 2, column: 1, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-disable-line comments with rules", () => {
        it("filters problems on the current line that match the ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 4, ruleId: "foo" }],
                    problems: [{ line: 1, column: 2, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems on the current line that do not match the ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-line", line: 1, column: 4, ruleId: "foo" }],
                    problems: [{ line: 1, column: 2, ruleId: "not-foo" }]
                }),
                [{ line: 1, column: 2, ruleId: "not-foo" }]
            );
        });

        it("filters problems on the current line that do not match the ruleId if preceded by a disable comment", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable", line: 1, column: 1, ruleId: null },
                        { type: "disable-line", line: 1, column: 3, ruleId: "foo" }
                    ],
                    problems: [{ line: 1, column: 5, ruleId: "not-foo" }]
                }),
                []
            );
        });
    });

    describe("eslint-disable-next-line comments without rules", () => {
        it("filters problems on the next line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 2, column: 3, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 1, column: 3, ruleId: "foo" }]
                }),
                [{ line: 1, column: 3, ruleId: "foo" }]
            );
        });

        it("keeps problems after the next line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: null }],
                    problems: [{ line: 3, column: 3, ruleId: "foo" }]
                }),
                [{ line: 3, column: 3, ruleId: "foo" }]
            );
        });

        it("filters problems on the next line even if there is an eslint-enable comment on the same line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable-next-line", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 1, column: 5, ruleId: null }
                    ],
                    problems: [{ line: 2, column: 2, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems on the next line if there is an eslint-enable comment before the problem on the next line", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [
                        { type: "disable-next-line", line: 1, column: 1, ruleId: null },
                        { type: "enable", line: 2, column: 1, ruleId: null }
                    ],
                    problems: [{ line: 2, column: 2, ruleId: "foo" }]
                }),
                [{ line: 2, column: 2, ruleId: "foo" }]
            );
        });
    });

    describe("eslint-disable-next-line comments with rules", () => {
        it("filters problems on the next line that match the ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: "foo" }],
                    problems: [{ line: 2, column: 1, ruleId: "foo" }]
                }),
                []
            );
        });

        it("keeps problems on the next line that do not match the ruleId", () => {
            assert.deepEqual(
                applyDisableDirectives({
                    directives: [{ type: "disable-next-line", line: 1, column: 1, ruleId: "foo" }],
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
                        directives: [{ type: "foo", line: 1, column: 4, ruleId: "foo" }],
                        problems: []
                    }),
                "Unrecognized directive type 'foo'"
            );
        });
    });
});
