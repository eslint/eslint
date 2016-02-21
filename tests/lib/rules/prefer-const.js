/**
 * @fileoverview Tests for prefer-const rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-const"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("prefer-const", rule, {
    valid: [
        { code: "var x = 0;" },
        { code: "let x;", parserOptions: { ecmaVersion: 6 } },
        { code: "let x; { x = 0; } foo(x);", parserOptions: { ecmaVersion: 6 } },
        { code: "let x = 0; x = 1;", parserOptions: { ecmaVersion: 6 } },
        { code: "const x = 0;", parserOptions: { ecmaVersion: 6 } },
        { code: "for (let i = 0, end = 10; i < end; ++i) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "for (let i in [1,2,3]) { i = 0; }", parserOptions: { ecmaVersion: 6 } },
        { code: "for (let x of [1,2,3]) { x = 0; }", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { var x = 0; })();" },
        { code: "(function() { let x; })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { let x; { x = 0; } foo(x); })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { let x = 0; x = 1; })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { const x = 0; })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { for (let i = 0, end = 10; i < end; ++i) {} })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { for (let i in [1,2,3]) { i = 0; } })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function() { for (let x of [1,2,3]) { x = 0; } })();", parserOptions: { ecmaVersion: 6 } },
        { code: "(function(x = 0) { })();", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; while (a = foo());", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; do {} while (a = foo());", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (; a = foo(); );", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (;; ++a);", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (const {b = ++a} in foo());", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (const {b = ++a} of foo());", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (const x of [1,2,3]) { if (a) {} a = foo(); }", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (const x of [1,2,3]) { a = a || foo(); bar(a); }", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; for (const x of [1,2,3]) { foo(++a); }", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; function foo() { if (a) {} a = bar(); }", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; function foo() { a = a || bar(); baz(a); }", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; function foo() { bar(++a); }", parserOptions: { ecmaVersion: 6 } },
        {
            code: [
                "let id;",
                "function foo() {",
                "    if (typeof id !== 'undefined') {",
                "        return;",
                "    }",
                "    id = setInterval(() => {}, 250);",
                "}",
                "foo();"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        },
        { code: "/*exported a*/ let a; function init() { a = foo(); }", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        {
            code: "let x = 1; foo(x);",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { foo(i); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'i' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let x of [1,2,3]) { foo(x); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let [x = -1, y] = [1,2]; y = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x = 1; foo(x); })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'i' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let x = 0; { let x = 1; foo(x); } x = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { message: "'i' is never reassigned, use 'const' instead.", type: "Identifier"},
                { message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}
            ]
        },

        {
            code: "let x; x = 0;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x; x = 1; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let x; { x = 0; foo(x); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x; { x = 0; foo(x); } })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let x; for (const a of [1,2,3]) { x = foo(); bar(x); }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x; for (const a of [1,2,3]) { x = foo(); bar(x); } })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "'x' is never reassigned, use 'const' instead.", type: "Identifier"}]
        }
    ]
});
