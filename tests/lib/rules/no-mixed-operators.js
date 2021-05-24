/**
 * @fileoverview Tests for no-mixed-operators rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-mixed-operators"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-mixed-operators", rule, {
    valid: [
        "a && b && c && d",
        "a || b || c || d",
        "(a || b) && c && d",
        "a || (b && c && d)",
        "(a || b || c) && d",
        "a || b || (c && d)",
        "a + b + c + d",
        "a * b * c * d",
        "a == 0 && b == 1",
        "a == 0 || b == 1",
        {
            code: "(a == 0) && (b == 1)",
            options: [{ groups: [["&&", "=="]] }]
        },
        {
            code: "a + b - c * d / e",
            options: [{ groups: [["&&", "||"]] }]
        },
        "a + b - c",
        "a * b / c",
        {
            code: "a + b - c",
            options: [{ allowSamePrecedence: true }]
        },
        {
            code: "a * b / c",
            options: [{ allowSamePrecedence: true }]
        },
        {
            code: "(a || b) ? c : d",
            options: [{ groups: [["&&", "||", "?:"]] }]
        },
        {
            code: "a ? (b || c) : d",
            options: [{ groups: [["&&", "||", "?:"]] }]
        },
        {
            code: "a ? b : (c || d)",
            options: [{ groups: [["&&", "||", "?:"]] }]
        },
        {
            code: "a || (b ? c : d)",
            options: [{ groups: [["&&", "||", "?:"]] }]
        },
        {
            code: "(a ? b : c) || d",
            options: [{ groups: [["&&", "||", "?:"]] }]
        },
        "a || (b ? c : d)",
        "(a || b) ? c : d",
        "a || b ? c : d",
        "a ? (b || c) : d",
        "a ? b || c : d",
        "a ? b : (c || d)",
        "a ? b : c || d"
    ],
    invalid: [
        {
            code: "a && b || c",
            errors: [
                {
                    column: 3,
                    endColumn: 5,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                },
                {
                    column: 8,
                    endColumn: 10,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                }
            ]
        },
        {
            code: "a && b > 0 || c",
            options: [{ groups: [["&&", "||", ">"]] }],
            errors: [
                {
                    column: 3,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                },
                {
                    column: 3,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: ">"
                    }
                },
                {
                    column: 8,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: ">"
                    }
                },
                {
                    column: 12,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                }
            ]
        },
        {
            code: "a && b > 0 || c",
            options: [{ groups: [["&&", "||"]] }],
            errors: [
                {
                    column: 3,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                },
                {
                    column: 12,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                }
            ]
        },
        {
            code: "a && b + c - d / e || f",
            options: [{ groups: [["&&", "||"], ["+", "-", "*", "/"]] }],
            errors: [
                {
                    column: 3,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                },
                {
                    column: 12,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "-",
                        rightOperator: "/"
                    }
                },
                {
                    column: 16,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "-",
                        rightOperator: "/"
                    }
                },
                {
                    column: 20,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                }
            ]
        },
        {
            code: "a && b + c - d / e || f",
            options: [{ groups: [["&&", "||"], ["+", "-", "*", "/"]], allowSamePrecedence: true }],
            errors: [
                {
                    column: 3,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                },
                {
                    column: 12,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "-",
                        rightOperator: "/"
                    }
                },
                {
                    column: 16,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "-",
                        rightOperator: "/"
                    }
                },
                {
                    column: 20,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "||"
                    }
                }
            ]
        },
        {
            code: "a + b - c",
            options: [{ allowSamePrecedence: false }],
            errors: [
                {
                    column: 3,
                    endColumn: 4,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "+",
                        rightOperator: "-"
                    }
                },
                {
                    column: 7,
                    endColumn: 8,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "+",
                        rightOperator: "-"
                    }
                }
            ]
        },
        {
            code: "a * b / c",
            options: [{ allowSamePrecedence: false }],
            errors: [
                {
                    column: 3,
                    endColumn: 4,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "*",
                        rightOperator: "/"
                    }
                },
                {
                    column: 7,
                    endColumn: 8,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "*",
                        rightOperator: "/"
                    }
                }
            ]
        },
        {
            code: "a || b ? c : d",
            options: [{ groups: [["&&", "||", "?:"]] }],
            errors: [
                {
                    column: 3,
                    endColumn: 5,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "||",
                        rightOperator: "?:"
                    }
                },
                {
                    column: 8,
                    endColumn: 9,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "||",
                        rightOperator: "?:"
                    }
                }
            ]
        },
        {
            code: "a && b ? 1 : 2",
            options: [{ groups: [["&&", "||", "?:"]] }],
            errors: [
                {
                    column: 3,
                    endColumn: 5,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "?:"
                    }
                },
                {
                    column: 8,
                    endColumn: 9,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "&&",
                        rightOperator: "?:"
                    }
                }
            ]
        },
        {
            code: "x ? a && b : 0",
            options: [{ groups: [["&&", "||", "?:"]] }],
            errors: [
                {
                    column: 3,
                    endColumn: 4,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "?:",
                        rightOperator: "&&"
                    }
                },
                {
                    column: 7,
                    endColumn: 9,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "?:",
                        rightOperator: "&&"
                    }
                }
            ]
        },
        {
            code: "x ? 0 : a && b",
            options: [{ groups: [["&&", "||", "?:"]] }],
            errors: [
                {
                    column: 3,
                    endColumn: 4,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "?:",
                        rightOperator: "&&"
                    }
                },
                {
                    column: 11,
                    endColumn: 13,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "?:",
                        rightOperator: "&&"
                    }
                }
            ]
        },
        {
            code: "a + b ?? c",
            options: [{ groups: [["+", "??"]] }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                {
                    column: 3,
                    endColumn: 4,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "+",
                        rightOperator: "??"
                    }
                },
                {
                    column: 7,
                    endColumn: 9,
                    messageId: "unexpectedMixedOperator",
                    data: {
                        leftOperator: "+",
                        rightOperator: "??"
                    }
                }
            ]
        }
    ]
});
