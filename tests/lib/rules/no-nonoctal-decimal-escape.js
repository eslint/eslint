/**
 * @fileoverview Tests for the no-nonoctal-decimal-escape rule.
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-nonoctal-decimal-escape"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Creates an error object.
 * @param {string} decimalEscape Reported escape sequence.
 * @param {number} column Reported column.
 * @param {string} refactorOutput Output for "refactor" suggestion.
 * @param {string} escapeBackslashOutput Output for "escapeBackslash" suggestion.
 * @returns {Object} The error object.
 */
function error(decimalEscape, column, refactorOutput, escapeBackslashOutput) {
    return {
        messageId: "decimalEscape",
        data: { decimalEscape },
        type: "Literal",
        line: 1,
        column,
        endLine: 1,
        endColumn: column + 2,
        suggestions: [
            {
                messageId: "refactor",
                data: {
                    original: decimalEscape,
                    replacement: decimalEscape[1]
                },
                output: refactorOutput
            },
            {
                messageId: "escapeBackslash",
                data: {
                    original: decimalEscape,
                    replacement: `\\${decimalEscape}`
                },
                output: escapeBackslashOutput
            }
        ]
    };
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-nonoctal-decimal-escape", rule, {
    valid: [
        "8",
        "var \\u8888",
        "/\\8/",
        "''",
        "'foo'",
        "'8'",
        "'9'",
        "'foo8'",
        "'foo9bar'",
        "'\\ '",
        "'\\\\'",
        "'\\a'",
        "'\\n'",
        "'\\0'",
        "'\\1'",
        "'\\7'",
        "'\\01'",
        "'\\08'",
        "'\\19'",
        "'\\t9'",
        "'\\👍8'",
        "'\\\\8'",
        "'\\\\9'",
        "'\\\\8\\\\9'",
        "'\\\\ \\\\8'",
        "'\\\\\\\\9'",
        "'\\\\9bar'",
        "'a\\\\8'",
        "'foo\\\\8'",
        "'foo\\\\8bar'",
        "'9\\\\9'",
        "'n\\n8'",
        "'n\\nn\\n8'",
        "'\\1.8'",
        "'\\1\\28'",
        "'\\x99'",
        "'\\\\\\x38'",
        "\\u99999",
        "'\\\n8'",
        "'\\\n\\\\9'"
    ],

    invalid: [
        {
            code: "'\\8'",
            errors: [error("\\8", 2, "'8'", "'\\\\8'")]
        },
        {
            code: "'\\9'",
            errors: [error("\\9", 2, "'9'", "'\\\\9'")]
        },
        {
            code: '"\\8"',
            errors: [error("\\8", 2, '"8"', '"\\\\8"')]
        },
        {
            code: "'f\\9'",
            errors: [error("\\9", 3, "'f9'", "'f\\\\9'")]
        },
        {
            code: "'fo\\9'",
            errors: [error("\\9", 4, "'fo9'", "'fo\\\\9'")]
        },
        {
            code: "'foo\\9'",
            errors: [error("\\9", 5, "'foo9'", "'foo\\\\9'")]
        },
        {
            code: "'foo\\8bar'",
            errors: [error("\\8", 5, "'foo8bar'", "'foo\\\\8bar'")]
        },
        {
            code: "'👍\\8'",
            errors: [error("\\8", 4, "'👍8'", "'👍\\\\8'")]
        },
        {
            code: "'\\\\\\8'",
            errors: [error("\\8", 4, "'\\\\8'", "'\\\\\\\\8'")]
        },
        {
            code: "'\\\\\\\\\\9'",
            errors: [error("\\9", 6, "'\\\\\\\\9'", "'\\\\\\\\\\\\9'")]
        },
        {
            code: "'foo\\\\\\8'",
            errors: [error("\\8", 7, "'foo\\\\8'", "'foo\\\\\\\\8'")]
        },
        {
            code: "'\\ \\8'",
            errors: [error("\\8", 4, "'\\ 8'", "'\\ \\\\8'")]
        },
        {
            code: "'\\1\\9'",
            errors: [error("\\9", 4, "'\\19'", "'\\1\\\\9'")]
        },
        {
            code: "'foo\\1\\9'",
            errors: [error("\\9", 7, "'foo\\19'", "'foo\\1\\\\9'")]
        },
        {
            code: "'\\n\\n\\8\\n'",
            errors: [error("\\8", 6, "'\\n\\n8\\n'", "'\\n\\n\\\\8\\n'")]
        },
        {
            code: "'\\n.\\n\\8\\n'",
            errors: [error("\\8", 7, "'\\n.\\n8\\n'", "'\\n.\\n\\\\8\\n'")]
        },
        {
            code: "'\\n.\\nn\\8\\n'",
            errors: [error("\\8", 8, "'\\n.\\nn8\\n'", "'\\n.\\nn\\\\8\\n'")]
        },
        {
            code: "'\\👍\\8'",
            errors: [error("\\8", 5, "'\\👍8'", "'\\👍\\\\8'")]
        },
        {
            code: "'\\\\8\\9'",
            errors: [error("\\9", 5, "'\\\\89'", "'\\\\8\\\\9'")]
        },
        {
            code: "'\\8\\\\9'",
            errors: [error("\\8", 2, "'8\\\\9'", "'\\\\8\\\\9'")]
        },
        {
            code: "'\\8 \\\\9'",
            errors: [error("\\8", 2, "'8 \\\\9'", "'\\\\8 \\\\9'")]
        },

        // multiple errors in the same string
        {
            code: "'\\8\\8'",
            errors: [
                error("\\8", 2, "'8\\8'", "'\\\\8\\8'"),
                error("\\8", 4, "'\\88'", "'\\8\\\\8'")
            ]
        },
        {
            code: "'\\9\\8'",
            errors: [
                error("\\9", 2, "'9\\8'", "'\\\\9\\8'"),
                error("\\8", 4, "'\\98'", "'\\9\\\\8'")
            ]
        },
        {
            code: "'foo\\8bar\\9baz'",
            errors: [
                error("\\8", 5, "'foo8bar\\9baz'", "'foo\\\\8bar\\9baz'"),
                error("\\9", 10, "'foo\\8bar9baz'", "'foo\\8bar\\\\9baz'")
            ]
        },
        {
            code: "'\\8\\1\\9'",
            errors: [
                error("\\8", 2, "'8\\1\\9'", "'\\\\8\\1\\9'"),
                error("\\9", 6, "'\\8\\19'", "'\\8\\1\\\\9'")
            ]
        },
        {
            code: "'\\9\\n9\\\\9\\9'",
            errors: [
                error("\\9", 2, "'9\\n9\\\\9\\9'", "'\\\\9\\n9\\\\9\\9'"),
                error("\\9", 10, "'\\9\\n9\\\\99'", "'\\9\\n9\\\\9\\\\9'")
            ]
        },
        {
            code: "'\\8\\\\\\9'",
            errors: [
                error("\\8", 2, "'8\\\\\\9'", "'\\\\8\\\\\\9'"),
                error("\\9", 6, "'\\8\\\\9'", "'\\8\\\\\\\\9'")
            ]
        },

        // multiple strings
        {
            code: "var foo = '\\8'; bar('\\9')",
            errors: [
                error("\\8", 12, "var foo = '8'; bar('\\9')", "var foo = '\\\\8'; bar('\\9')"),
                error("\\9", 22, "var foo = '\\8'; bar('9')", "var foo = '\\8'; bar('\\\\9')")
            ]
        },

        // test reported line
        {
            code: "var foo = '8'\n  bar = '\\9'",
            errors: [{
                ...error("\\9", 10, "var foo = '8'\n  bar = '9'", "var foo = '8'\n  bar = '\\\\9'"),
                line: 2,
                endLine: 2
            }]
        },

        // multiline strings
        {
            code: "'\\\n\\8'",
            errors: [{
                ...error("\\8", 1, "'\\\n8'", "'\\\n\\\\8'"),
                line: 2,
                endLine: 2
            }]
        },
        {
            code: "'\\\r\n\\9'",
            errors: [{
                ...error("\\9", 1, "'\\\r\n9'", "'\\\r\n\\\\9'"),
                line: 2,
                endLine: 2
            }]
        },
        {
            code: "'\\\\\\\n\\8'",
            errors: [{
                ...error("\\8", 1, "'\\\\\\\n8'", "'\\\\\\\n\\\\8'"),
                line: 2,
                endLine: 2
            }]
        },
        {
            code: "'foo\\\nbar\\9baz'",
            errors: [{
                ...error("\\9", 4, "'foo\\\nbar9baz'", "'foo\\\nbar\\\\9baz'"),
                line: 2,
                endLine: 2
            }]
        },

        // adjacent NULL escape
        {
            code: "'\\0\\8'",
            errors: [{
                ...error("\\8", 4),
                suggestions: [
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\0\\8",
                            replacement: "\\u00008"
                        },
                        output: "'\\u00008'"
                    },
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\8",
                            replacement: "\\u0038"
                        },
                        output: "'\\0\\u0038'"
                    },
                    {
                        messageId: "escapeBackslash",
                        data: {
                            original: "\\8",
                            replacement: "\\\\8"
                        },
                        output: "'\\0\\\\8'"
                    }
                ]
            }]
        },
        {
            code: "'foo\\0\\9bar'",
            errors: [{
                ...error("\\9", 7),
                suggestions: [
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\0\\9",
                            replacement: "\\u00009"
                        },
                        output: "'foo\\u00009bar'"
                    },
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\9",
                            replacement: "\\u0039"
                        },
                        output: "'foo\\0\\u0039bar'"
                    },
                    {
                        messageId: "escapeBackslash",
                        data: {
                            original: "\\9",
                            replacement: "\\\\9"
                        },
                        output: "'foo\\0\\\\9bar'"
                    }
                ]
            }]
        },
        {
            code: "'\\1\\0\\8'",
            errors: [{
                ...error("\\8", 6),
                suggestions: [
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\0\\8",
                            replacement: "\\u00008"
                        },
                        output: "'\\1\\u00008'"
                    },
                    {
                        messageId: "refactor",
                        data: {
                            original: "\\8",
                            replacement: "\\u0038"
                        },
                        output: "'\\1\\0\\u0038'"
                    },
                    {
                        messageId: "escapeBackslash",
                        data: {
                            original: "\\8",
                            replacement: "\\\\8"
                        },
                        output: "'\\1\\0\\\\8'"
                    }
                ]
            }]
        },
        {
            code: "'\\0\\8\\9'",
            errors: [
                {
                    ...error("\\8", 4),
                    suggestions: [
                        {
                            messageId: "refactor",
                            data: {
                                original: "\\0\\8",
                                replacement: "\\u00008"
                            },
                            output: "'\\u00008\\9'"
                        },
                        {
                            messageId: "refactor",
                            data: {
                                original: "\\8",
                                replacement: "\\u0038"
                            },
                            output: "'\\0\\u0038\\9'"
                        },
                        {
                            messageId: "escapeBackslash",
                            data: {
                                original: "\\8",
                                replacement: "\\\\8"
                            },
                            output: "'\\0\\\\8\\9'"
                        }
                    ]
                },
                error("\\9", 6, "'\\0\\89'", "'\\0\\8\\\\9'")
            ]
        },
        {
            code: "'\\8\\0\\9'",
            errors: [
                error("\\8", 2, "'8\\0\\9'", "'\\\\8\\0\\9'"),
                {
                    ...error("\\9", 6),
                    suggestions: [
                        {
                            messageId: "refactor",
                            data: {
                                original: "\\0\\9",
                                replacement: "\\u00009"
                            },
                            output: "'\\8\\u00009'"
                        },
                        {
                            messageId: "refactor",
                            data: {
                                original: "\\9",
                                replacement: "\\u0039"
                            },
                            output: "'\\8\\0\\u0039'"
                        },
                        {
                            messageId: "escapeBackslash",
                            data: {
                                original: "\\9",
                                replacement: "\\\\9"
                            },
                            output: "'\\8\\0\\\\9'"
                        }
                    ]
                }
            ]
        },

        // not an adjacent NULL escape
        {
            code: "'0\\8'",
            errors: [error("\\8", 3, "'08'", "'0\\\\8'")]
        },
        {
            code: "'\\\\0\\8'",
            errors: [error("\\8", 5, "'\\\\08'", "'\\\\0\\\\8'")]
        },
        {
            code: "'\\0 \\8'",
            errors: [error("\\8", 5, "'\\0 8'", "'\\0 \\\\8'")]
        },
        {
            code: "'\\01\\8'",
            errors: [error("\\8", 5, "'\\018'", "'\\01\\\\8'")]
        },
        {
            code: "'\\0\\1\\8'",
            errors: [error("\\8", 6, "'\\0\\18'", "'\\0\\1\\\\8'")]
        },
        {
            code: "'\\0\\\n\\8'",
            errors: [{
                ...error("\\8", 1, "'\\0\\\n8'", "'\\0\\\n\\\\8'"),
                line: 2,
                endLine: 2
            }]
        }
    ]
});
