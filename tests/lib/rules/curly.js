/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/curly", {
    valid: [
        "if (foo) { bar() }",
        "if (foo) { bar() } else if (foo2) { baz() }",
        "while (foo) { bar() }",
        "do { bar(); } while (foo)",
        "for (;foo;) { bar() }",
        {
            code: "for (;foo;) bar()",
            args: [1, "multi"]
        },
        {
            code: "if (foo) bar()",
            args: [1, "multi"]
        },
        {
            code: "if (foo) bar()",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) bar() \n",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) bar(); else baz()",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) bar(); \n else baz()",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) bar() \n else if (foo) bar() \n else baz()",
            args: [1, "multi-line"]
        },
        {
            code: "do baz(); while (foo)",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) { bar() }",
            args: [1, "multi-line"]
        },
        {
            code: "if (foo) { \n bar(); \n baz(); \n }",
            args: [1, "multi-line"]
        },
        {
            code: "do bar() \n while (foo)",
            args: [1, "multi-line"]
        }
    ],
    invalid: [
        {
            code: "if (foo) bar()",
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() } else baz()",
            errors: [
                {
                    message: "Expected { after 'else'.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) bar()",
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "do bar(); while (foo)",
            errors: [
                {
                    message: "Expected { after 'do'.",
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "for (;foo;) bar()",
            errors: [
                {
                    message: "Expected { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "for (;foo;) { bar() }",
            args: [1, "multi"],
            errors: [
                {
                    message: "Unnecessary { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() }",
            args: [1, "multi"],
            errors: [
                {
                    message: "Unnecessary { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) { bar() }",
            args: [1, "multi"],
            errors: [
                {
                    message: "Unnecessary { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) baz(); else { bar() }",
            args: [1, "multi"],
            errors: [
                {
                    message: "Unnecessary { after 'else'.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) \n baz()",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) \n baz()",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "for (;foo;) \n bar()",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "while (bar && \n baz) \n foo()",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) bar(baz, \n baz)",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "do \n foo(); \n while (bar)",
            args: [1, "multi-line"],
            errors: [
                {
                    message: "Expected { after 'do'.",
                    type: "DoWhileStatement"
                }
            ]
        }
    ]
});
