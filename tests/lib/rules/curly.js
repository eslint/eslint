/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/curly"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("curly", rule, {
    valid: [
        "if (foo) { bar() }",
        "if (foo) { bar() } else if (foo2) { baz() }",
        "while (foo) { bar() }",
        "do { bar(); } while (foo)",
        "for (;foo;) { bar() }",
        {
            code: "for (;foo;) bar()",
            options: ["multi"]
        },
        {
            code: "if (foo) bar()",
            options: ["multi"]
        },
        {
            code: "if (foo) bar()",
            options: ["multi-line"]
        },
        {
            code: "if (foo) bar() \n",
            options: ["multi-line"]
        },
        {
            code: "if (foo) bar(); else baz()",
            options: ["multi-line"]
        },
        {
            code: "if (foo) bar(); \n else baz()",
            options: ["multi-line"]
        },
        {
            code: "if (foo) bar() \n else if (foo) bar() \n else baz()",
            options: ["multi-line"]
        },
        {
            code: "do baz(); while (foo)",
            options: ["multi-line"]
        },
        {
            code: "if (foo) { bar() }",
            options: ["multi-line"]
        },
        {
            code: "if (foo) { \n bar(); \n baz(); \n }",
            options: ["multi-line"]
        },
        {
            code: "do bar() \n while (foo)",
            options: ["multi-line"]
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
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() }",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) { bar() }",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) baz(); else { bar() }",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'else'.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) \n baz()",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) \n baz()",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "for (;foo;) \n bar()",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "while (bar && \n baz) \n foo()",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) bar(baz, \n baz)",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "do \n foo(); \n while (bar)",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'do'.",
                    type: "DoWhileStatement"
                }
            ]
        }
    ]
});
