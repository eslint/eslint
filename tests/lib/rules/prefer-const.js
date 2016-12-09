/**
 * @fileoverview Tests for prefer-const rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-const"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.defineRule("use-x", context => ({
    VariableDeclaration() {
        context.markVariableAsUsed("x");
    }
}));

ruleTester.run("prefer-const", rule, {
    valid: [
        "var x = 0;",
        "let x;",
        "let x; { x = 0; } foo(x);",
        "let x = 0; x = 1;",
        "const x = 0;",
        "for (let i = 0, end = 10; i < end; ++i) {}",
        "for (let i in [1,2,3]) { i = 0; }",
        "for (let x of [1,2,3]) { x = 0; }",
        "(function() { var x = 0; })();",
        "(function() { let x; })();",
        "(function() { let x; { x = 0; } foo(x); })();",
        "(function() { let x = 0; x = 1; })();",
        "(function() { const x = 0; })();",
        "(function() { for (let i = 0, end = 10; i < end; ++i) {} })();",
        "(function() { for (let i in [1,2,3]) { i = 0; } })();",
        "(function() { for (let x of [1,2,3]) { x = 0; } })();",
        "(function(x = 0) { })();",
        "let a; while (a = foo());",
        "let a; do {} while (a = foo());",
        "let a; for (; a = foo(); );",
        "let a; for (;; ++a);",
        "let a; for (const {b = ++a} in foo());",
        "let a; for (const {b = ++a} of foo());",
        "let a; for (const x of [1,2,3]) { if (a) {} a = foo(); }",
        "let a; for (const x of [1,2,3]) { a = a || foo(); bar(a); }",
        "let a; for (const x of [1,2,3]) { foo(++a); }",
        "let a; function foo() { if (a) {} a = bar(); }",
        "let a; function foo() { a = a || bar(); baz(a); }",
        "let a; function foo() { bar(++a); }",
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
            ].join("\n")
        },
        "/*exported a*/ let a; function init() { a = foo(); }",
        "/*exported a*/ let a = 1",
        "let a; if (true) a = 0; foo(a);",

        // The assignment is located in a different scope.
        // Those are warned by prefer-smaller-scope.
        "let x; { x = 0; foo(x); }",
        "(function() { let x; { x = 0; foo(x); } })();",
        "let x; for (const a of [1,2,3]) { x = foo(); bar(x); }",
        "(function() { let x; for (const a of [1,2,3]) { x = foo(); bar(x); } })();",
        "let x; for (x of array) { x; }",

        {
            code: "let {a, b} = obj; b = 0;",
            options: [{destructuring: "all"}]
        },
        {
            code: "let a, b; ({a, b} = obj); b++;",
            options: [{destructuring: "all"}]
        },

        // ignoreReadBeforeAssign
        {
            code: "let x; function foo() { bar(x); } x = 0;",
            options: [{ignoreReadBeforeAssign: true}]
        },

        // https://github.com/eslint/eslint/issues/7712
        // https://github.com/ternjs/acorn/issues/487
        // This should be a SyntaxError, but espree parses it correctly. Don't throw an error if the variable has multiple declarations.
        "let foo; const foo = 1;"

    ],
    invalid: [
        {
            code: "let x = 1; foo(x);",
            output: "const x = 1; foo(x);",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { foo(i); }",
            output: "for (const i in [1,2,3]) { foo(i); }",
            errors: [{ message: "'i' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let x of [1,2,3]) { foo(x); }",
            output: "for (const x of [1,2,3]) { foo(x); }",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let [x = -1, y] = [1,2]; y = 0;",
            output: "let [x = -1, y] = [1,2]; y = 0;",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
            output: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x = 1; foo(x); })();",
            output: "(function() { const x = 1; foo(x); })();",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
            output: "(function() { for (const i in [1,2,3]) { foo(i); } })();",
            errors: [{ message: "'i' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
            output: "(function() { for (const x of [1,2,3]) { foo(x); } })();",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
            output: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let f = (function() { let g = x; })(); f = 1;",
            output: "let f = (function() { const g = x; })(); f = 1;",
            errors: [{ message: "'g' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
            output: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let x = 0; { let x = 1; foo(x); } x = 0;",
            output: "let x = 0; { const x = 1; foo(x); } x = 0;",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
            output: "for (let i = 0; i < 10; ++i) { const x = 1; foo(x); }",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
            output: "for (const i in [1,2,3]) { const x = 1; foo(x); }",
            errors: [
                { message: "'i' is never reassigned. Use 'const' instead.", type: "Identifier"},
                { message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: [
                "var foo = function() {",
                "    for (const b of c) {",
                "       let a;",
                "       a = 1;",
                "   }",
                "};"
            ].join("\n"),
            output: [
                "var foo = function() {",
                "    for (const b of c) {",
                "       let a;",
                "       a = 1;",
                "   }",
                "};"
            ].join("\n"),
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: [
                "var foo = function() {",
                "    for (const b of c) {",
                "       let a;",
                "       ({a} = 1);",
                "   }",
                "};"
            ].join("\n"),
            output: [
                "var foo = function() {",
                "    for (const b of c) {",
                "       let a;",
                "       ({a} = 1);",
                "   }",
                "};"
            ].join("\n"),
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },

        {
            code: "let x; x = 0;",
            output: "let x; x = 0;",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier", column: 8}]
        },
        {
            code: "switch (a) { case 0: let x; x = 0; }",
            output: "switch (a) { case 0: let x; x = 0; }",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier", column: 29}]
        },
        {
            code: "(function() { let x; x = 1; })();",
            output: "(function() { let x; x = 1; })();",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier", column: 22}]
        },

        {
            code: "let {a = 0, b} = obj; b = 0; foo(a, b);",
            output: "let {a = 0, b} = obj; b = 0; foo(a, b);",
            options: [{destructuring: "any"}],
            errors: [{ message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let {a: {b, c}} = {a: {b: 1, c: 2}}; b = 3;",
            output: "let {a: {b, c}} = {a: {b: 1, c: 2}}; b = 3;",
            options: [{destructuring: "any"}],
            errors: [{ message: "'c' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let {a: {b, c}} = {a: {b: 1, c: 2}}",
            output: "const {a: {b, c}} = {a: {b: 1, c: 2}}",
            options: [{destructuring: "all"}],
            errors: [
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier"},
                { message: "'c' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let a, b; ({a = 0, b} = obj); b = 0; foo(a, b);",
            output: "let a, b; ({a = 0, b} = obj); b = 0; foo(a, b);",
            options: [{destructuring: "any"}],
            errors: [{ message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "let {a = 0, b} = obj; foo(a, b);",
            output: "const {a = 0, b} = obj; foo(a, b);",
            options: [{destructuring: "all"}],
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"},
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let [a] = [1]",
            output: "const [a] = [1]",
            options: [],
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let {a} = obj",
            output: "const {a} = obj",
            options: [],
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let a, b; ({a = 0, b} = obj); foo(a, b);",
            output: "let a, b; ({a = 0, b} = obj); foo(a, b);",
            options: [{destructuring: "all"}],
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"},
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let {a = 0, b} = obj, c = a; b = a;",
            output: "let {a = 0, b} = obj, c = a; b = a;",
            options: [{destructuring: "any"}],
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier"},
                { message: "'c' is never reassigned. Use 'const' instead.", type: "Identifier"}
            ]
        },
        {
            code: "let {a = 0, b} = obj, c = a; b = a;",
            output: "let {a = 0, b} = obj, c = a; b = a;",
            options: [{destructuring: "all"}],
            errors: [{ message: "'c' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },

        // Warnings are located at declaration if there are reading references before assignments.
        {
            code: "let x; function foo() { bar(x); } x = 0;",
            output: "let x; function foo() { bar(x); } x = 0;",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier", column: 5}]
        },

        // https://github.com/eslint/eslint/issues/5837
        {
            code: "/*eslint use-x:error*/ let x = 1",
            output: "/*eslint use-x:error*/ const x = 1",
            parserOptions: { ecmaFeatures: {globalReturn: true} },
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
        {
            code: "/*eslint use-x:error*/ { let x = 1 }",
            output: "/*eslint use-x:error*/ { const x = 1 }",
            errors: [{ message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier"}]
        },
    ]
});
