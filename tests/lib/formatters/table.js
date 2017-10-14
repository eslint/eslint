/**
 * @fileoverview Tests for "table" reporter.
 * @author Gajus Kuizinas <gajus@gajus.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../lib/formatters/table");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:table", () => {
    describe("when passed no messages", () => {
        const code = [
            {
                filePath: "foo.js",
                messages: [],
                errorCount: 0,
                warningCount: 0
            }
        ];

        it("should return a table of error and warning count with no messages", () => {
            const expectedOutput = [
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 0 Errors                                                                                                       ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 0 Warnings                                                                                                     ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });

    describe("when passed a single message", () => {
        it("should return a string in the correct format for errors", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            message: "Unexpected foo.",
                            severity: 2,
                            line: 5,
                            column: 10,
                            ruleId: "foo"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 5        │ 10       │ error    │ Unexpected foo.                                        │ foo                  ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 1 Error                                                                                                        ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 0 Warnings                                                                                                     ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });

        it("should return a string in the correct format for warnings", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            message: "Unexpected foo.",
                            severity: 1,
                            line: 5,
                            column: 10,
                            ruleId: "foo"
                        }
                    ],
                    errorCount: 0,
                    warningCount: 1
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 5        │ 10       │ warning  │ Unexpected foo.                                        │ foo                  ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 0 Errors                                                                                                       ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 1 Warning                                                                                                      ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });

    describe("when passed a fatal error message", () => {
        it("should return a string in the correct format", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            fatal: true,
                            message: "Unexpected foo.",
                            line: 5,
                            column: 10,
                            ruleId: "foo"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 5        │ 10       │ error    │ Unexpected foo.                                        │ foo                  ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 1 Error                                                                                                        ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 0 Warnings                                                                                                     ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });

    describe("when passed multiple messages", () => {
        it("should return a string with multiple entries", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            message: "Unexpected foo.",
                            severity: 2,
                            line: 5,
                            column: 10,
                            ruleId: "foo"
                        },
                        {
                            message: "Unexpected bar.",
                            severity: 1,
                            line: 6,
                            column: 11,
                            ruleId: "bar"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 1
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 5        │ 10       │ error    │ Unexpected foo.                                        │ foo                  ║",
                "║ 6        │ 11       │ warning  │ Unexpected bar.                                        │ bar                  ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 1 Error                                                                                                        ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 1 Warning                                                                                                      ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });

    describe("when passed multiple files with 1 message each", () => {
        it("should return a string with multiple entries", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            message: "Unexpected foo.",
                            severity: 2,
                            line: 5,
                            column: 10,
                            ruleId: "foo"
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0
                }, {
                    filePath: "bar.js",
                    messages: [
                        {
                            message: "Unexpected bar.",
                            severity: 1,
                            line: 6,
                            column: 11,
                            ruleId: "bar"
                        }
                    ],
                    errorCount: 0,
                    warningCount: 1
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 5        │ 10       │ error    │ Unexpected foo.                                        │ foo                  ║",
                "",
                "bar.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 6        │ 11       │ warning  │ Unexpected bar.                                        │ bar                  ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 1 Error                                                                                                        ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 1 Warning                                                                                                      ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });

    describe("when passed one file not found message", () => {
        it("should return a string without line and column (0, 0)", () => {
            const code = [
                {
                    filePath: "foo.js",
                    messages: [
                        {
                            fatal: true,
                            message: "Couldn't find foo.js."
                        }
                    ],
                    errorCount: 1,
                    warningCount: 0
                }
            ];

            const expectedOutput = [
                "",
                "foo.js",
                "",
                "║ Line     │ Column   │ Type     │ Message                                                │ Rule ID              ║",
                "╟──────────┼──────────┼──────────┼────────────────────────────────────────────────────────┼──────────────────────╢",
                "║ 0        │ 0        │ error    │ Couldn't find foo.js.                                  │                      ║",
                "",
                "╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗",
                "║ 1 Error                                                                                                        ║",
                "╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢",
                "║ 0 Warnings                                                                                                     ║",
                "╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝",
                ""
            ].join("\n");

            const result = formatter(code);

            assert.strictEqual(result, expectedOutput);
        });
    });
});
