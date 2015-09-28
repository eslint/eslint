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
            code: "if (a) { b; c; }",
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
        },
        {
            code: "if (foo) { \n quz = { \n bar: baz, \n qux: foo \n }; \n }",
            options: ["multi-or-nest"]
        },
        {
            code: "while (true) { \n if (foo) \n doSomething(); \n else \n doSomethingElse(); \n }",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) \n quz = true;",
            options: ["multi-or-nest"]
        },
        {
            code: "while (true) \n doSomething();",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var i = 0; foo; i++) \n doSomething();",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) { \n if(bar) \n doSomething(); \n } else \n doSomethingElse();",
            options: ["multi-or-nest"]
        },

        // https://github.com/eslint/eslint/issues/3856
        {
            code: "if (true) { if (false) console.log(1) } else console.log(2)",
            options: ["multi"]
        },
        {
            code: "if (a) { if (b) console.log(1); else if (c) console.log(2) } else console.log(3)",
            options: ["multi"]
        },
        {
            code: "if (true) { while(false) if (true); } else;",
            options: ["multi"]
        },
        {
            code: "if (true) { label: if (false); } else;",
            options: ["multi"]
        },
        {
            code: "if (true) { with(0) if (false); } else;",
            options: ["multi"]
        },
        {
            code: "if (true) { while(a) if(b) while(c) if (d); else; } else;",
            options: ["multi"]
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
            code: "if (true) { if (false) console.log(1) }",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (a) { if (b) console.log(1); else console.log(2) } else console.log(3)",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'if' condition.",
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
        },
        {
            code: "if (foo) \n quz = { \n bar: baz, \n qux: foo \n };",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (true) \n if (foo) \n doSomething(); \n else \n doSomethingElse(); \n",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Expected { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) { \n quz = true; \n }",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Unnecessary { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (true) { \n doSomething(); \n }",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Unnecessary { after 'while' condition.",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "for (var i = 0; foo; i++) { \n doSomething(); \n }",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Unnecessary { after 'for' condition.",
                    type: "ForStatement"
                }
            ]
        }
    ]
});
