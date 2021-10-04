/**
 * @fileoverview Tests for curly rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/curly"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
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
        {
            code: "if (foo) { const bar = 'baz'; }",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "while (foo) { let bar = 'baz'; }",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "for(;;) { function foo() {} }",
            options: ["multi"]
        },
        {
            code: "for (foo in bar) { class Baz {} }",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { let bar; } else { baz(); }",
            options: ["multi", "consistent"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { bar(); } else { const baz = 'quux'; }",
            options: ["multi", "consistent"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { \n const bar = 'baz'; \n }",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { \n let bar = 'baz'; \n }",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { \n function bar() {} \n }",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "if (foo) { \n class bar {} \n }",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },

        // https://github.com/eslint/eslint/issues/12370
        {
            code: "if (foo) doSomething() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else if (bar) doSomethingElse() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else doSomethingElse() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else if (bar) doSomethingElse(); \n else doAnotherThing() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var i = 0; foo; i++) doSomething() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo in bar) console.log(foo) \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo of bar) console.log(foo) \n ;",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "while (foo) doSomething() \n ;",
            options: ["multi-or-nest"]
        },
        {
            code: "do doSomething() \n ;while (foo)",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo)\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else if (bar)\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "if (foo) doSomething(); \n else if (bar) doSomethingElse(); \n else\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var i = 0; foo; i++)\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo in bar)\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "for (var foo of bar)\n;",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "while (foo)\n;",
            options: ["multi-or-nest"]
        },
        {
            code: "do\n;while (foo)",
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
        },

        // https://github.com/eslint/eslint/issues/12928 (also in invalid[])
        {
            code: "if (x) for (var i in x) { if (i > 0) console.log(i); } else console.log('whoops');",
            options: ["multi"]
        },
        {
            code: "if (a) { if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { if (b) foo(); } else bar();",
            options: ["multi-or-nest"]
        },
        {
            code: "if (a) { if (b) foo(); } else { bar(); }",
            options: ["multi", "consistent"]
        },
        {
            code: "if (a) { if (b) foo(); } else { bar(); }",
            options: ["multi-or-nest", "consistent"]
        },
        {
            code: "if (a) { if (b) { foo(); bar(); } } else baz();",
            options: ["multi"]
        },
        {
            code: "if (a) foo(); else if (b) { if (c) bar(); } else baz();",
            options: ["multi"]
        },
        {
            code: "if (a) { if (b) foo(); else if (c) bar(); } else baz();",
            options: ["multi"]
        },
        {
            code: "if (a) if (b) foo(); else { if (c) bar(); } else baz();",
            options: ["multi"]
        },
        {
            code: "if (a) { lbl:if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { lbl1:lbl2:if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { for (;;) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { for (key in obj) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { for (elem of arr) if (b) foo(); } else bar();",
            options: ["multi"],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "if (a) { with (obj) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { while (cond) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) { while (cond) for (;;) for (key in obj) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) while (cond) { for (;;) for (key in obj) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) while (cond) for (;;) { for (key in obj) if (b) foo(); } else bar();",
            options: ["multi"]
        },
        {
            code: "if (a) while (cond) for (;;) for (key in obj) { if (b) foo(); } else bar();",
            options: ["multi"]
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
                    type: "IfStatement",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "if (foo) \n bar()",
            output: "if (foo) \n {bar()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 7
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
                    type: "WhileStatement",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 18
                }
            ]
        },
        {
            code: "while (foo) \n bar()",
            output: "while (foo) \n {bar()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 7
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
                    type: "DoWhileStatement",
                    line: 1,
                    column: 4,
                    endLine: 1,
                    endColumn: 10
                }
            ]
        },
        {
            code: "do \n bar(); while (foo)",
            output: "do \n {bar();} while (foo)",
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 8
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
                    type: "ForOfStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 38
                }
            ]
        },
        {
            code: "for (var foo of bar) \n console.log(foo)",
            output: "for (var foo of bar) \n {console.log(foo)}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 18
                }
            ]
        },
        {
            code: "for (a;;) console.log(foo)",
            output: "for (a;;) {console.log(foo)}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 27
                }
            ]
        },
        {
            code: "for (a;;) \n console.log(foo)",
            output: "for (a;;) \n {console.log(foo)}",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 18
                }
            ]
        },
        {
            code: "for (var foo of bar) {console.log(foo)}",
            output: "for (var foo of bar) console.log(foo)",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-of" },
                    type: "ForOfStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 40
                }
            ]
        },
        {
            code: "do{foo();} while(bar);",
            output: "do foo(); while(bar);",
            options: ["multi"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement",
                    line: 1,
                    column: 3,
                    endLine: 1,
                    endColumn: 11
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
                    type: "ForStatement",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 22
                }
            ]
        },
        {
            code: "for (;foo;) \n bar()",
            output: "for (;foo;) \n {bar()}",
            errors: [
                {
                    data: { name: "for" },
                    type: "ForStatement",
                    messageId: "missingCurlyAfterCondition",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 7
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
                    type: "IfStatement",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        },
        {
            code: "if (foo) if (bar) { baz() }",
            output: "if (foo) if (bar)  baz() ",
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
            code: "if (foo) if (bar) baz(); else if (quux) { quuux(); }",
            output: "if (foo) if (bar) baz(); else if (quux)  quuux(); ",
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
                    type: "WhileStatement",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 22
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
            code: "if (foo) if (bar); else { baz() }",
            output: "if (foo) if (bar); else  baz() ",
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
                    column: 8,
                    endLine: 11,
                    endColumn: 2
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
                    type: "ForInStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 42
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
                    type: "IfStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 7
                }
            ]
        },
        {
            code: "if (foo) baz()",
            output: "if (foo) {baz()}",
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 15
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
            code: "do foo(); while (bar)",
            output: "do {foo();} while (bar)",
            options: ["all"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement",
                    line: 1,
                    column: 4,
                    endLine: 1,
                    endColumn: 10
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
                    type: "DoWhileStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 8
                }
            ]
        },
        {
            code: "for (var foo in bar) {console.log(foo)}",
            output: "for (var foo in bar) console.log(foo)",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 40
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
                    type: "ForOfStatement",
                    line: 2,
                    column: 2,
                    endLine: 2,
                    endColumn: 18
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
            code: "if (foo) { var bar = 'baz'; }",
            output: "if (foo)  var bar = 'baz'; ",
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
            code: "if (foo) { let bar; } else baz();",
            output: "if (foo) { let bar; } else {baz();}",
            options: ["multi", "consistent"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) bar(); else { const baz = 'quux' }",
            output: "if (foo) {bar();} else { const baz = 'quux' }",
            options: ["multi", "consistent"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement"
                }
            ]
        },
        {
            code: "if (foo) { \n var bar = 'baz'; \n }",
            output: "if (foo)  \n var bar = 'baz'; \n ",
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
                    type: "ForStatement",
                    line: 1,
                    column: 27,
                    endLine: 3,
                    endColumn: 3
                }
            ]
        },
        {
            code: "for (var foo in bar) if (foo) console.log(1); else console.log(2);",
            output: "for (var foo in bar) {if (foo) console.log(1); else console.log(2);}",
            options: ["all"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "for-in" },
                    type: "ForInStatement",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 67
                },
                {
                    messageId: "missingCurlyAfterCondition",
                    data: { name: "if" },
                    type: "IfStatement",
                    line: 1,
                    column: 31,
                    endLine: 1,
                    endColumn: 46
                },
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement",
                    line: 1,
                    column: 52,
                    endLine: 1,
                    endColumn: 67
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
                    type: "ForInStatement",
                    line: 2,
                    column: 2,
                    endLine: 3,
                    endColumn: 22
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
                    type: "IfStatement",
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 33
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
            code: "if (true) if (true) foo(); else { bar(); baz(); }",
            output: "if (true) if (true) {foo();} else { bar(); baz(); }",
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
            code: "do\n{foo();} while (bar)",
            output: "do\nfoo(); while (bar)",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "do" },
                    type: "DoWhileStatement",
                    line: 2,
                    column: 1,
                    endLine: 2,
                    endColumn: 9
                }
            ]
        },
        {
            code: "while (bar) { foo(); }",
            output: "while (bar)  foo(); ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement",
                    line: 1,
                    column: 13,
                    endLine: 1,
                    endColumn: 23
                }
            ]
        },
        {
            code: "while (bar) \n{\n foo(); }",
            output: "while (bar) \n\n foo(); ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "while" },
                    type: "WhileStatement",
                    line: 2,
                    column: 1,
                    endLine: 3,
                    endColumn: 10
                }
            ]
        },
        {
            code: "for (;;) { foo(); }",
            output: "for (;;)  foo(); ",
            options: ["multi"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfterCondition",
                    data: { name: "for" },
                    type: "ForStatement",
                    line: 1,
                    column: 10,
                    endLine: 1,
                    endColumn: 20
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
        },

        // https://github.com/eslint/eslint/issues/12370
        {
            code: "if (foo) {\ndoSomething()\n;\n}",
            output: "if (foo) \ndoSomething()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) doSomething();\nelse if (bar) {\ndoSomethingElse()\n;\n}",
            output: "if (foo) doSomething();\nelse if (bar) \ndoSomethingElse()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (foo) doSomething();\nelse {\ndoSomethingElse()\n;\n}",
            output: "if (foo) doSomething();\nelse \ndoSomethingElse()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfter", data: { name: "else" }, type: "IfStatement" }]
        },
        {
            code: "for (var i = 0; foo; i++) {\ndoSomething()\n;\n}",
            output: "for (var i = 0; foo; i++) \ndoSomething()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "for" }, type: "ForStatement" }]
        },
        {
            code: "for (var foo in bar) {\ndoSomething()\n;\n}",
            output: "for (var foo in bar) \ndoSomething()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfter", data: { name: "for-in" }, type: "ForInStatement" }]
        },
        {
            code: "for (var foo of bar) {\ndoSomething()\n;\n}",
            output: "for (var foo of bar) \ndoSomething()\n;\n",
            options: ["multi-or-nest"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpectedCurlyAfter", data: { name: "for-of" }, type: "ForOfStatement" }]
        },
        {
            code: "while (foo) {\ndoSomething()\n;\n}",
            output: "while (foo) \ndoSomething()\n;\n",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }]
        },
        {
            code: "do {\ndoSomething()\n;\n} while (foo)",
            output: "do \ndoSomething()\n;\n while (foo)",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfter", data: { name: "do" }, type: "DoWhileStatement" }]
        },

        // https://github.com/eslint/eslint/issues/12928 (also in valid[])
        {
            code: "if (a) { if (b) foo(); }",
            output: "if (a)  if (b) foo(); ",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) { if (b) foo(); else bar(); }",
            output: "if (a)  if (b) foo(); else bar(); ",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) { if (b) foo(); else bar(); } baz();",
            output: "if (a)  if (b) foo(); else bar();  baz();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) { while (cond) if (b) foo(); }",
            output: "if (a)  while (cond) if (b) foo(); ",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) while (cond) { if (b) foo(); }",
            output: "if (a) while (cond)  if (b) foo(); ",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }]
        },
        {
            code: "if (a) while (cond) { if (b) foo(); else bar(); }",
            output: "if (a) while (cond)  if (b) foo(); else bar(); ",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }]
        },
        {
            code: "if (a) { while (cond) { if (b) foo(); } bar(); baz() } else quux();",
            output: "if (a) { while (cond)  if (b) foo();  bar(); baz() } else quux();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }]
        },
        {
            code: "if (a) { if (b) foo(); } bar();",
            output: "if (a)  if (b) foo();  bar();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if(a) { if (b) foo(); } if (c) bar(); else baz();",
            output: "if(a)  if (b) foo();  if (c) bar(); else baz();",
            options: ["multi-or-nest"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) { do if (b) foo(); while (cond); } else bar();",
            output: "if (a)  do if (b) foo(); while (cond);  else bar();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) do { if (b) foo(); } while (cond); else bar();",
            output: "if (a) do  if (b) foo();  while (cond); else bar();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfter", data: { name: "do" }, type: "DoWhileStatement" }]
        },
        {
            code: "if (a) { if (b) foo(); else bar(); } else baz();",
            output: "if (a)  if (b) foo(); else bar();  else baz();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) while (cond) { bar(); } else baz();",
            output: "if (a) while (cond)  bar();  else baz();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }]
        },
        {
            code: "if (a) { for (;;); } else bar();",
            output: "if (a)  for (;;);  else bar();",
            options: ["multi"],
            errors: [{ messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" }]
        },
        {
            code: "if (a) { while (cond) if (b) foo() } else bar();",
            output: "if (a) { while (cond) if (b) foo() } else {bar();}",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "missingCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement",
                    line: 1,
                    column: 43,
                    endLine: 1,
                    endColumn: 49
                }
            ]
        },
        {
            code: "if (a)  while (cond) if (b) foo()  \nelse\n {bar();}",
            output: "if (a)  while (cond) if (b) foo()  \nelse\n bar();",
            options: ["multi", "consistent"],
            errors: [
                {
                    messageId: "unexpectedCurlyAfter",
                    data: { name: "else" },
                    type: "IfStatement",
                    line: 3,
                    column: 2,
                    endLine: 3,
                    endColumn: 10
                }
            ]
        },
        {
            code: "if (a) foo() \nelse\n bar();",
            output: "if (a) {foo()} \nelse\n {bar();}",
            errors: [{
                type: "IfStatement",
                messageId: "missingCurlyAfterCondition",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 13
            },
            {
                type: "IfStatement",
                messageId: "missingCurlyAfter",
                line: 3,
                column: 2,
                endLine: 3,
                endColumn: 8
            }]
        },
        {
            code: "if (a) { while (cond) if (b) foo() } ",
            output: "if (a)  while (cond) if (b) foo()  ",
            options: ["multi", "consistent"],
            errors: [{
                messageId: "unexpectedCurlyAfterCondition",
                data: { name: "if" },
                type: "IfStatement",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 37
            }]
        },
        {
            code: "if(a) { if (b) foo(); } if (c) bar(); else if(foo){bar();}",
            output: "if(a)  if (b) foo();  if (c) bar(); else if(foo)bar();",
            options: ["multi-or-nest"],
            errors: [{
                type: "IfStatement",
                data: { name: "if" },
                messageId: "unexpectedCurlyAfterCondition",
                line: 1,
                column: 7,
                endLine: 1,
                endColumn: 24
            },
            {
                type: "IfStatement",
                data: { name: "if" },
                messageId: "unexpectedCurlyAfterCondition",
                line: 1,
                column: 51,
                endLine: 1,
                endColumn: 59
            }]
        },
        {
            code: "if (true) [1, 2, 3]\n.bar()",
            output: "if (true) {[1, 2, 3]\n.bar()}",
            options: ["multi-line"],
            errors: [{
                data: { name: "if" },
                type: "IfStatement",
                messageId: "missingCurlyAfterCondition",
                line: 1,
                column: 11,
                endLine: 2,
                endColumn: 7
            }]
        },
        {
            code: "for(\n;\n;\n) {foo()}",
            output: "for(\n;\n;\n) foo()",
            options: ["multi"],
            errors: [{
                data: { name: "for" },
                type: "ForStatement",
                messageId: "unexpectedCurlyAfterCondition",
                line: 4,
                column: 3,
                endLine: 4,
                endColumn: 10
            }]
        },
        {
            code: "for(\n;\n;\n) \nfoo()\n",
            output: "for(\n;\n;\n) \n{foo()}\n",
            options: ["multi-line"],
            errors: [{
                data: { name: "for" },
                type: "ForStatement",
                messageId: "missingCurlyAfterCondition",
                line: 5,
                column: 1,
                endLine: 5,
                endColumn: 6
            }]
        },
        {

            /**
             * Reports 2 errors, but one pair of braces is necessary if the other pair gets removed.
             * Auto-fix will remove only outer braces in the first iteration.
             * After that, the inner braces will become valid and won't be removed in the second iteration.
             * If user manually removes inner braces first, the outer braces will become valid.
             */
            code: "if (a) { while (cond) { if (b) foo(); } } else bar();",
            output: "if (a)  while (cond) { if (b) foo(); }  else bar();",
            options: ["multi"],
            errors: [
                { messageId: "unexpectedCurlyAfterCondition", data: { name: "if" }, type: "IfStatement" },
                { messageId: "unexpectedCurlyAfterCondition", data: { name: "while" }, type: "WhileStatement" }
            ]
        },
        {
            code: "for(;;)foo()\n",
            output: "for(;;){foo()}\n",
            errors: [{
                data: { name: "for" },
                type: "ForStatement",
                messageId: "missingCurlyAfterCondition",
                line: 1,
                column: 8,
                endLine: 1,
                endColumn: 13
            }]
        },
        {
            code: "for(var \ni \n in \n z)foo()\n",
            output: "for(var \ni \n in \n z){foo()}\n",
            errors: [{
                data: { name: "for-in" },
                type: "ForInStatement",
                messageId: "missingCurlyAfter",
                line: 4,
                column: 4,
                endLine: 4,
                endColumn: 9
            }]
        },
        {
            code: "for(var i of \n z)\nfoo()\n",
            output: "for(var i of \n z)\n{foo()}\n",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                data: { name: "for-of" },
                type: "ForOfStatement",
                messageId: "missingCurlyAfter",
                line: 3,
                column: 1,
                endLine: 3,
                endColumn: 6
            }]
        }
    ]
});
