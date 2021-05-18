/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/curly"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
            parserOptions: { ecmaVersion: 6 }
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
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (var foo of bar) { console.log(1); console.log(2) }",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 }
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
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (var foo of bar) { \n console.log(1); \n console.log(2); \n }",
            options: ["multi-line"],
            parserOptions: { ecmaVersion: 6 }
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
            code: "if (foo) { \n // line of comment \n quz = true; \n }",
            options: ["multi-or-nest"]
        },
        {
            code: "// line of comment \n if (foo) \n quz = true; \n",
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
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for (var foo of bar) { \n if (foo) console.log(1); \n else console.log(2) \n }",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
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
        },
        {

            // https://github.com/feross/standard/issues/664
            code: "if (true) foo()\n;[1, 2, 3].bar()",
            options: ["multi-line"]
        }
    ],
    invalid: [
        {
            code: "if (foo) bar()",
            output: "if (foo) {bar()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() } else baz()",
            output: "if (foo) { bar() } else {baz()}",
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() } else if (faa) baz()",
            output: "if (foo) { bar() } else if (faa) {baz()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) bar()",
            output: "while (foo) {bar()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "do bar(); while (foo)",
            output: "do {bar();} while (foo)",
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "for (;foo;) bar()",
            output: "for (;foo;) {bar()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) console.log(foo)",
            output: "for (var foo in bar) {console.log(foo)}",
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) console.log(foo)",
            output: "for (var foo of bar) {console.log(foo)}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (;foo;) { bar() }",
            output: "for (;foo;)  bar() ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "if (foo) { bar() }",
            output: "if (foo)  bar() ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) { bar() }",
            output: "while (foo)  bar() ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) baz(); else { bar() }",
            output: "if (foo) baz(); else  bar() ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) { if (false) console.log(1) }",
            output: "if (true)  if (false) console.log(1) ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (a) { if (b) console.log(1); else console.log(2) } else console.log(3)",
            output: null,
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "if" },
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
            output: [
                "if (0)",
                "    console.log(0)",
                "else if (1) {",
                "    console.log(1)",
                "    console.log(1)",
                "} else ",
                "    if (2)",
                "        console.log(2)",
                "    else",
                "        console.log(3)",
                ""
            ].join("\n"),
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement",
                    line: 6,
                    column: 3
                }
            ]
        },
        {
            code: "for (var foo in bar) { console.log(foo) }",
            output: "for (var foo in bar)  console.log(foo) ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) { console.log(foo) }",
            output: "for (var foo of bar)  console.log(foo) ",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "if (foo) \n baz()",
            output: "if (foo) \n {baz()}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (foo) \n baz()",
            output: "while (foo) \n {baz()}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "for (;foo;) \n bar()",
            output: "for (;foo;) \n {bar()}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "while (bar && \n baz) \n foo()",
            output: "while (bar && \n baz) \n {foo()}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) bar(baz, \n baz)",
            output: "if (foo) {bar(baz, \n baz)}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "do \n foo(); \n while (bar)",
            output: "do \n {foo();} \n while (bar)",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) \n console.log(foo)",
            output: "for (var foo in bar) \n {console.log(foo)}",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) \n console.log(1); \n console.log(2)",
            output: "for (var foo in bar) \n {console.log(1);} \n console.log(2)",
            options: ["multi-line"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n console.log(foo)",
            output: "for (var foo of bar) \n {console.log(foo)}",
            options: ["multi-line"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n console.log(1); \n console.log(2)",
            output: "for (var foo of bar) \n {console.log(1);} \n console.log(2)",
            options: ["multi-line"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "if (foo) \n quz = { \n bar: baz, \n qux: foo \n };",
            output: "if (foo) \n {quz = { \n bar: baz, \n qux: foo \n };}",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (true) \n if (foo) \n doSomething(); \n else \n doSomethingElse(); \n",
            output: "while (true) \n {if (foo) \n doSomething(); \n else \n doSomethingElse();} \n",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "if (foo) { \n quz = true; \n }",
            output: "if (foo)  \n quz = true; \n ",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "while (true) { \n doSomething(); \n }",
            output: "while (true)  \n doSomething(); \n ",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "for (var i = 0; foo; i++) { \n doSomething(); \n }",
            output: "for (var i = 0; foo; i++)  \n doSomething(); \n ",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) \n if (foo) console.log(1); \n else console.log(2);",
            output: "for (var foo in bar) \n {if (foo) console.log(1); \n else console.log(2);}",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo in bar) { if (foo) console.log(1) }",
            output: "for (var foo in bar)  if (foo) console.log(1) ",
            options: ["multi-or-nest"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) \n if (foo) console.log(1); \n else console.log(2);",
            output: "for (var foo of bar) \n {if (foo) console.log(1); \n else console.log(2);}",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (var foo of bar) { if (foo) console.log(1) }",
            output: "for (var foo of bar)  if (foo) console.log(1) ",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); \n else { \n bar(); \n baz(); \n }",
            output: "if (true) {foo();} \n else { \n bar(); \n baz(); \n }",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) { foo(); faa(); }\n else bar();",
            output: "if (true) { foo(); faa(); }\n else {bar();}",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); else { baz(); }",
            output: "if (true) foo(); else  baz(); ",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (true) foo(); else if (true) faa(); else { bar(); baz(); }",
            output: "if (true) {foo();} else if (true) {faa();} else { bar(); baz(); }",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                },
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "do{foo();} while (bar)",
            output: "do foo(); while (bar)",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "do{[1, 2, 3].map(bar);} while (bar)",
            output: "do[1, 2, 3].map(bar); while (bar)",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "if (foo) {bar()} baz()",
            output: null,
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "do {foo();} while (bar)",
            output: "do foo(); while (bar)",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement"
                }
            ]
        },

        // Don't remove curly braces if it would cause issues due to ASI.
        {
            code: "if (foo) { bar }\n++baz;",
            output: null,
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar; }\n++baz;",
            output: "if (foo)  bar; \n++baz;",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar++ }\nbaz;",
            output: null,
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar }\n[1, 2, 3].map(foo);",
            output: null,
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar }\n(1).toString();",
            output: null,
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar }\n/regex/.test('foo');",
            output: null,
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { bar }\nBaz();",
            output: "if (foo)  bar \nBaz();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code:
            "if (a) {\n" +
            "  while (b) {\n" +
            "    c();\n" +
            "    d();\n" +
            "  }\n" +
            "} else e();",
            output:
            "if (a) \n" +
            "  while (b) {\n" +
            "    c();\n" +
            "    d();\n" +
            "  }\n" +
            " else e();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { while (bar) {} } else {}",
            output: "if (foo)  while (bar) {}  else {}",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { var foo = () => {} } else {}",
            output: null,
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { var foo = function() {} } else {}",
            output: null,
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) { var foo = function*() {} } else {}",
            output: null,
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (true)\nfoo()\n;[1, 2, 3].bar()",
            output: "if (true)\n{foo()\n;}[1, 2, 3].bar()",
            options: ["multi-line"],
            errors: [{ messageId: "missingCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        }
    ]
});
