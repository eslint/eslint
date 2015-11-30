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
        "for (var foo in bar) { console.log(foo) }",
        {
            code: "for (var foo of bar) { console.log(foo) }",
            ecmaFeatures: { forOf: true }
        },
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
            code: "for (var foo in bar) console.log(foo)",
            options: ["multi"]
        },
        {
            code: "for (var foo in bar) { console.log(1); console.log(2) }",
            options: ["multi"]
        },
        {
            code: "for (var foo of bar) console.log(foo)",
            options: ["multi"],
            ecmaFeatures: { forOf: true }
        },
        {
            code: "for (var foo of bar) { console.log(1); console.log(2) }",
            options: ["multi"],
            ecmaFeatures: { forOf: true }
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
            code: "for (var foo in bar) console.log(foo)",
            options: ["multi-line"]
        },
        {
            code: "for (var foo in bar) { \n console.log(1); \n console.log(2); \n }",
            options: ["multi-line"]
        },
        {
            code: "for (var foo of bar) console.log(foo)",
            options: ["multi-line"],
            ecmaFeatures: { forOf: true }
        },
        {
            code: "for (var foo of bar) { \n console.log(1); \n console.log(2); \n }",
            options: ["multi-line"],
            ecmaFeatures: { forOf: true }
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
        {
            code: "for (var foo in bar) \n console.log(foo)",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo in bar) { \n if (foo) console.log(1); \n else console.log(2) \n }",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo of bar) \n console.log(foo)",
            options: ["multi-or-nest"],
            ecmaFeatures: { forOf: true }
        },
        {
            code: "for (var foo of bar) { \n if (foo) console.log(1); \n else console.log(2) \n }",
            options: ["multi-or-nest"],
            ecmaFeatures: { forOf: true }
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
        },
        {
            code: "if (true) foo(); else { bar(); baz(); }",
            options: ["multi"]
        },
        {
            code: "if (true) { foo(); } else { bar(); baz(); }",
            options: ["multi", "consistent"]
        },
        {
            code: "if (true) { foo(); } else if (true) { faa(); } else { bar(); baz(); }",
            options: ["multi", "consistent"]
        },
        {
            code: "if (true) { foo(); faa(); } else { bar(); }",
            options: ["multi", "consistent"]
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
            code: "if (foo) { bar() } else if (faa) baz()",
            errors: [
                {
                    message: "Expected { after 'if' condition.",
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
            code: "for (var foo in bar) console.log(foo)",
            errors: [
                {
                    message: "Expected { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) console.log(foo)",
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Expected { after 'for-of'.",
                    type: "ForOfStatement"
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
            code: [
                "if (0)",
                "    console.log(0)",
                "else if (1) {",
                "    console.log(1)",
                "    console.log(1)",
                "} else {",
                "    if (2)",
                "        console.log(2)",
                "    else",
                "        console.log(3)",
                "}"
            ].join("\n"),
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'else'.",
                    type: "IfStatement",
                    line: 6,
                    column: 3
                }
            ]
        },
        {
            code: "for (var foo in bar) { console.log(foo) }",
            options: ["multi"],
            errors: [
                {
                    message: "Unnecessary { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) { console.log(foo) }",
            options: ["multi"],
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Unnecessary { after 'for-of'.",
                    type: "ForOfStatement"
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
            code: "for (var foo in bar) \n console.log(foo)",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) \n console.log(1); \n console.log(2)",
            options: ["multi-line"],
            errors: [
                {
                    message: "Expected { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n console.log(foo)",
            options: ["multi-line"],
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Expected { after 'for-of'.",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n console.log(1); \n console.log(2)",
            options: ["multi-line"],
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Expected { after 'for-of'.",
                    type: "ForOfStatement"
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
        },
        {
            code: "for (var foo in bar) \n if (foo) console.log(1); \n else console.log(2);",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Expected { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) { if (foo) console.log(1) }",
            options: ["multi-or-nest"],
            errors: [
                {
                    message: "Unnecessary { after 'for-in'.",
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n if (foo) console.log(1); \n else console.log(2);",
            options: ["multi-or-nest"],
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Expected { after 'for-of'.",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) { if (foo) console.log(1) }",
            options: ["multi-or-nest"],
            ecmaFeatures: { forOf: true },
            errors: [
                {
                    message: "Unnecessary { after 'for-of'.",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); \n else { \n bar(); \n baz(); \n }",
            options: ["multi", "consistent"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) { foo(); faa(); }\n else bar();",
            options: ["multi", "consistent"],
            errors: [
                {
                    message: "Expected { after 'else'.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); else { baz(); }",
            options: ["multi", "consistent"],
            errors: [
                {
                    message: "Unnecessary { after 'else'.",
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); else if (true) faa(); else { bar(); baz(); }",
            options: ["multi", "consistent"],
            errors: [
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                },
                {
                    message: "Expected { after 'if' condition.",
                    type: "IfStatement"
                }
            ]
        }
    ]
});
