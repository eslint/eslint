/**
 * @fileoverview Tests for prefer-named-capture-group rule.
 * @author Pig Fang <https://github.com/g-plane>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-named-capture-group"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2018 } });

ruleTester.run("prefer-named-capture-group", rule, {
    valid: [
        "/normal_regex/",
        "/(?:[0-9]{4})/",
        "/(?<year>[0-9]{4})/",
        "/\\u{1F680}/u",
        "new RegExp()",
        "new RegExp(foo)",
        "new RegExp('')",
        "new RegExp('(?<year>[0-9]{4})')",
        "RegExp()",
        "RegExp(foo)",
        "RegExp('')",
        "RegExp('(?<year>[0-9]{4})')",
        "RegExp('(')", // invalid regexp should be ignored
        "RegExp('\\\\u{1F680}', 'u')",
        "new globalThis.RegExp('([0-9]{4})')",
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            languageOptions: { ecmaVersion: 2017 }
        },
        {
            code: "new globalThis.RegExp()",
            languageOptions: { ecmaVersion: 2020 }
        },
        {
            code: "new globalThis.RegExp(foo)",
            languageOptions: { ecmaVersion: 2020 }
        },
        {
            code: "globalThis.RegExp(foo)",
            languageOptions: { ecmaVersion: 2020 }
        },
        {
            code: `
                var globalThis = bar;
                globalThis.RegExp(foo);
                `,
            languageOptions: { ecmaVersion: 2020 }
        },
        {
            code: `
                function foo () {
                    var globalThis = bar;
                    new globalThis.RegExp(baz);
                }
                `,
            languageOptions: { ecmaVersion: 2020 }
        },

        // ES2024
        "new RegExp('(?<c>[[A--B]])', 'v')",

        /*
         * This testcase checks if the rule understands the v flag correctly.
         * Without the v flag, `([\q])` is considered a valid regex and the rule reports,
         * but if the v flag is understood correctly the rule does not because of a syntax error.
         */
        String.raw`new RegExp('([\\q])', 'v')` // SyntaxError
    ],

    invalid: [
        {
            code: "/([0-9]{4})/",
            errors: [{
                messageId: "required",
                type: "Literal",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 13,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "/(?<temp1>[0-9]{4})/"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "/(?:[0-9]{4})/"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 25,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new RegExp('(?<temp1>[0-9]{4})')"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new RegExp('(?:[0-9]{4})')"
                    }
                ]
            }]
        },
        {
            code: "RegExp('([0-9]{4})')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 21,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "RegExp('(?<temp1>[0-9]{4})')"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "RegExp('(?:[0-9]{4})')"
                    }
                ]
            }]
        },
        {
            code: "new RegExp(`a(bc)d`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(bc)" },
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new RegExp(`a(?<temp1>bc)d`)"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new RegExp(`a(?:bc)d`)"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('\u1234\u5678(?:a)(b)');",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(b)" },
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new RegExp('\u1234\u5678(?:a)(?<temp1>b)');"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new RegExp('\u1234\u5678(?:a)(?:b)');"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('\\u1234\\u5678(?:a)(b)');",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(b)" },
                suggestions: null
            }]
        },
        {
            code: "/([0-9]{4})-(\\w{5})/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "([0-9]{4})" },
                    line: 1,
                    column: 1,
                    endColumn: 21,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp1>[0-9]{4})-(\\w{5})/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?:[0-9]{4})-(\\w{5})/"
                        }
                    ]
                },
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(\\w{5})" },
                    line: 1,
                    column: 1,
                    endColumn: 21,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/([0-9]{4})-(?<temp1>\\w{5})/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/([0-9]{4})-(?:\\w{5})/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/([0-9]{4})-(5)/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "([0-9]{4})" },
                    line: 1,
                    column: 1,
                    endColumn: 17,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp1>[0-9]{4})-(5)/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?:[0-9]{4})-(5)/"
                        }
                    ]
                },
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(5)" },
                    line: 1,
                    column: 1,
                    endColumn: 17,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/([0-9]{4})-(?<temp1>5)/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/([0-9]{4})-(?:5)/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/(?<temp2>(a))/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(a)" },
                    line: 1,
                    column: 1,
                    endColumn: 16,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp2>(?<temp3>a))/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?<temp2>(?:a))/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/(?<temp2>(a)(?<temp5>b))/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(a)" },
                    line: 1,
                    column: 1,
                    endColumn: 27,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp2>(?<temp6>a)(?<temp5>b))/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?<temp2>(?:a)(?<temp5>b))/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/(?<temp1>[0-9]{4})-(\\w{5})/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(\\w{5})" },
                    line: 1,
                    column: 1,
                    endColumn: 29,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp1>[0-9]{4})-(?<temp2>\\w{5})/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?<temp1>[0-9]{4})-(?:\\w{5})/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/(?<temp1>[0-9]{4})-(5)/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(5)" },
                    line: 1,
                    column: 1,
                    endColumn: 25,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp1>[0-9]{4})-(?<temp2>5)/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?<temp1>[0-9]{4})-(?:5)/"
                        }
                    ]
                }
            ]
        },
        {
            code: "/(?<temp1>a)(?<temp2>a)(a)(?<temp3>a)/",
            errors: [
                {
                    messageId: "required",
                    type: "Literal",
                    data: { group: "(a)" },
                    line: 1,
                    column: 1,
                    endColumn: 39,
                    suggestions: [
                        {
                            messageId: "addGroupName",
                            output: "/(?<temp1>a)(?<temp2>a)(?<temp4>a)(?<temp3>a)/"
                        },
                        {
                            messageId: "addNonCapture",
                            output: "/(?<temp1>a)(?<temp2>a)(?:a)(?<temp3>a)/"
                        }
                    ]
                }
            ]
        },
        {
            code: "new RegExp('(' + 'a)')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(a)" },
                suggestions: null
            }]
        },
        {
            code: "new RegExp('a(bc)d' + 'e')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(bc)" },
                suggestions: null
            }]
        },
        {
            code: "new RegExp(\"foo\" + \"(a)\" + \"(b)\");",
            errors: [
                {
                    messageId: "required",
                    type: "NewExpression",
                    data: { group: "(a)" },
                    suggestions: null
                },
                {
                    messageId: "required",
                    type: "NewExpression",
                    data: { group: "(b)" },
                    suggestions: null
                }
            ]
        },
        {
            code: "new RegExp(\"foo\" + \"(?:a)\" + \"(b)\");",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(b)" },
                suggestions: null
            }]
        },
        {
            code: "RegExp('(a)'+'')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(a)" },
                suggestions: null
            }]
        },
        {
            code: "RegExp( '' + '(ab)')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(ab)" },
                suggestions: null
            }]
        },
        {
            code: "new RegExp(`(ab)${''}`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(ab)" },
                suggestions: null
            }]
        },
        {
            code: "new RegExp(`(a)\n`)",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(a)" },
                line: 1,
                column: 1,
                endLine: 2,
                endColumn: 3,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new RegExp(`(?<temp1>a)\n`)"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new RegExp(`(?:a)\n`)"
                    }
                ]
            }]
        },
        {
            code: "RegExp(`a(b\nc)d`)",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(b\nc)" },
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "RegExp(`a(?<temp1>b\nc)d`)"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "RegExp(`a(?:b\nc)d`)"
                    }
                ]
            }]
        },
        {
            code: "new RegExp('a(b)\\'')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "(b)" },
                suggestions: null
            }]
        },
        {
            code: "RegExp('(a)\\\\d')",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(a)" },
                suggestions: null
            }]
        },
        {
            code: "RegExp(`\\a(b)`)",
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "(b)" },
                suggestions: null
            }]
        },
        {
            code: "new globalThis.RegExp('([0-9]{4})')",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 36,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new globalThis.RegExp('(?<temp1>[0-9]{4})')"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new globalThis.RegExp('(?:[0-9]{4})')"
                    }
                ]
            }]
        },
        {
            code: "globalThis.RegExp('([0-9]{4})')",
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "required",
                type: "CallExpression",
                data: { group: "([0-9]{4})" },
                line: 1,
                column: 1,
                endColumn: 32,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "globalThis.RegExp('(?<temp1>[0-9]{4})')"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "globalThis.RegExp('(?:[0-9]{4})')"
                    }
                ]
            }]
        },
        {
            code: `
                function foo() { var globalThis = bar; }
                new globalThis.RegExp('([0-9]{4})');
            `,
            languageOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([0-9]{4})" },
                line: 3,
                column: 17,
                endColumn: 52,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: `
                function foo() { var globalThis = bar; }
                new globalThis.RegExp('(?<temp1>[0-9]{4})');
            `
                    },
                    {
                        messageId: "addNonCapture",
                        output: `
                function foo() { var globalThis = bar; }
                new globalThis.RegExp('(?:[0-9]{4})');
            `
                    }
                ]
            }]
        },

        // ES2024
        {
            code: "new RegExp('([[A--B]])', 'v')",
            errors: [{
                messageId: "required",
                type: "NewExpression",
                data: { group: "([[A--B]])" },
                line: 1,
                column: 1,
                suggestions: [
                    {
                        messageId: "addGroupName",
                        output: "new RegExp('(?<temp1>[[A--B]])', 'v')"
                    },
                    {
                        messageId: "addNonCapture",
                        output: "new RegExp('(?:[[A--B]])', 'v')"
                    }]
            }]
        }
    ]
});
