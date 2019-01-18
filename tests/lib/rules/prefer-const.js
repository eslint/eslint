/**
 * @fileoverview Tests for prefer-const rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-const"),
    fixtureParser = require("../../fixtures/fixture-parser"),
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
        [
            "let id;",
            "function foo() {",
            "    if (typeof id !== 'undefined') {",
            "        return;",
            "    }",
            "    id = setInterval(() => {}, 250);",
            "}",
            "foo();"
        ].join("\n"),
        "/*exported a*/ let a; function init() { a = foo(); }",
        "/*exported a*/ let a = 1",
        "let a; if (true) a = 0; foo(a);",
        `
        (function (a) {
            let b;
            ({ a, b } = obj);
        })();
        `,
        `
        (function (a) {
            let b;
            ([ a, b ] = obj);
        })();
        `,
        "var a; { var b; ({ a, b } = obj); }",
        "let a; { let b; ({ a, b } = obj); }",
        "var a; { var b; ([ a, b ] = obj); }",
        "let a; { let b; ([ a, b ] = obj); }",

        /*
         * The assignment is located in a different scope.
         * Those are warned by prefer-smaller-scope.
         */
        "let x; { x = 0; foo(x); }",
        "(function() { let x; { x = 0; foo(x); } })();",
        "let x; for (const a of [1,2,3]) { x = foo(); bar(x); }",
        "(function() { let x; for (const a of [1,2,3]) { x = foo(); bar(x); } })();",
        "let x; for (x of array) { x; }",

        {
            code: "let {a, b} = obj; b = 0;",
            options: [{ destructuring: "all" }]
        },
        {
            code: "let a, b; ({a, b} = obj); b++;",
            options: [{ destructuring: "all" }]
        },

        // https://github.com/eslint/eslint/issues/8187
        {
            code: "let { name, ...otherStuff } = obj; otherStuff = {};",
            options: [{ destructuring: "all" }],
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let { name, ...otherStuff } = obj; otherStuff = {};",
            options: [{ destructuring: "all" }],
            parser: fixtureParser("babel-eslint5/destructuring-object-spread")
        },

        // https://github.com/eslint/eslint/issues/8308
        {
            code: "let predicate; [typeNode.returnType, predicate] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [typeNode.returnType, ...predicate] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {

            // intentionally testing empty slot in destructuring assignment
            code: "let predicate; [typeNode.returnType,, predicate] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [typeNode.returnType=5, predicate] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [[typeNode.returnType=5], predicate] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [[typeNode.returnType, predicate]] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [typeNode.returnType, [predicate]] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [, [typeNode.returnType, predicate]] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [, {foo:typeNode.returnType, predicate}] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let predicate; [, {foo:typeNode.returnType, ...predicate}] = foo();",
            parserOptions: { ecmaVersion: 2018 }
        },
        {
            code: "let a; const b = {}; ({ a, c: b.c } = func());",
            parserOptions: { ecmaVersion: 2018 }
        },

        // ignoreReadBeforeAssign
        {
            code: "let x; function foo() { bar(x); } x = 0;",
            options: [{ ignoreReadBeforeAssign: true }]
        },

        // https://github.com/eslint/eslint/issues/10520
        "const x = [1,2]; let y; [,y] = x; y = 0;",
        "const x = [1,2,3]; let y, z; [y,,z] = x; y = 0; z = 0;"
    ],
    invalid: [
        {
            code: "let x = 1; foo(x);",
            output: "const x = 1; foo(x);",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "for (let i in [1,2,3]) { foo(i); }",
            output: "for (const i in [1,2,3]) { foo(i); }",
            errors: [{ messageId: "useConst", data: { name: "i" }, type: "Identifier" }]
        },
        {
            code: "for (let x of [1,2,3]) { foo(x); }",
            output: "for (const x of [1,2,3]) { foo(x); }",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "let [x = -1, y] = [1,2]; y = 0;",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "(function() { let x = 1; foo(x); })();",
            output: "(function() { const x = 1; foo(x); })();",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
            output: "(function() { for (const i in [1,2,3]) { foo(i); } })();",
            errors: [{ messageId: "useConst", data: { name: "i" }, type: "Identifier" }]
        },
        {
            code: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
            output: "(function() { for (const x of [1,2,3]) { foo(x); } })();",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "let f = (function() { let g = x; })(); f = 1;",
            output: "let f = (function() { const g = x; })(); f = 1;",
            errors: [{ messageId: "useConst", data: { name: "g" }, type: "Identifier" }]
        },
        {
            code: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "let x = 0; { let x = 1; foo(x); } x = 0;",
            output: "let x = 0; { const x = 1; foo(x); } x = 0;",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
            output: "for (let i = 0; i < 10; ++i) { const x = 1; foo(x); }",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
            output: "for (const i in [1,2,3]) { const x = 1; foo(x); }",
            errors: [
                { messageId: "useConst", data: { name: "i" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "x" }, type: "Identifier" }
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
            output: null,
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" }
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
            output: null,
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" }
            ]
        },

        {
            code: "let x; x = 0;",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier", column: 8 }]
        },
        {
            code: "switch (a) { case 0: let x; x = 0; }",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier", column: 29 }]
        },
        {
            code: "(function() { let x; x = 1; })();",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier", column: 22 }]
        },

        {
            code: "let {a = 0, b} = obj; b = 0; foo(a, b);",
            output: null,
            options: [{ destructuring: "any" }],
            errors: [{ messageId: "useConst", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "let {a: {b, c}} = {a: {b: 1, c: 2}}; b = 3;",
            output: null,
            options: [{ destructuring: "any" }],
            errors: [{ messageId: "useConst", data: { name: "c" }, type: "Identifier" }]
        },
        {
            code: "let {a: {b, c}} = {a: {b: 1, c: 2}}",
            output: "const {a: {b, c}} = {a: {b: 1, c: 2}}",
            options: [{ destructuring: "all" }],
            errors: [
                { messageId: "useConst", data: { name: "b" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "let a, b; ({a = 0, b} = obj); b = 0; foo(a, b);",
            output: null,
            options: [{ destructuring: "any" }],
            errors: [{ messageId: "useConst", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "let {a = 0, b} = obj; foo(a, b);",
            output: "const {a = 0, b} = obj; foo(a, b);",
            options: [{ destructuring: "all" }],
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "b" }, type: "Identifier" }
            ]
        },
        {
            code: "let [a] = [1]",
            output: "const [a] = [1]",
            options: [],
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" }
            ]
        },
        {
            code: "let {a} = obj",
            output: "const {a} = obj",
            options: [],
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" }
            ]
        },
        {
            code: "let a, b; ({a = 0, b} = obj); foo(a, b);",
            output: null,
            options: [{ destructuring: "all" }],
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "b" }, type: "Identifier" }
            ]
        },
        {
            code: "let {a = 0, b} = obj, c = a; b = a;",
            output: null,
            options: [{ destructuring: "any" }],
            errors: [
                { messageId: "useConst", data: { name: "a" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "c" }, type: "Identifier" }
            ]
        },
        {
            code: "let {a = 0, b} = obj, c = a; b = a;",
            output: null,
            options: [{ destructuring: "all" }],
            errors: [{ messageId: "useConst", data: { name: "c" }, type: "Identifier" }]
        },

        // https://github.com/eslint/eslint/issues/8187
        {
            code: "let { name, ...otherStuff } = obj; otherStuff = {};",
            output: null,
            options: [{ destructuring: "any" }],
            parserOptions: { ecmaVersion: 2018 },
            errors: [{ messageId: "useConst", data: { name: "name" }, type: "Identifier", column: 7 }]
        },
        {
            code: "let { name, ...otherStuff } = obj; otherStuff = {};",
            output: null,
            options: [{ destructuring: "any" }],
            errors: [{ messageId: "useConst", data: { name: "name" }, type: "Identifier", column: 7 }],
            parser: fixtureParser("babel-eslint5/destructuring-object-spread")
        },

        // Warnings are located at declaration if there are reading references before assignments.
        {
            code: "let x; function foo() { bar(x); } x = 0;",
            output: null,
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier", column: 5 }]
        },

        // https://github.com/eslint/eslint/issues/5837
        {
            code: "/*eslint use-x:error*/ let x = 1",
            output: "/*eslint use-x:error*/ const x = 1",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "/*eslint use-x:error*/ { let x = 1 }",
            output: "/*eslint use-x:error*/ { const x = 1 }",
            errors: [{ messageId: "useConst", data: { name: "x" }, type: "Identifier" }]
        },
        {
            code: "let { foo, bar } = baz;",
            output: "const { foo, bar } = baz;",
            errors: [
                { messageId: "useConst", data: { name: "foo" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "bar" }, type: "Identifier" }
            ]
        },

        // https://github.com/eslint/eslint/issues/10520
        {
            code: "const x = [1,2]; let [,y] = x;",
            output: "const x = [1,2]; const [,y] = x;",
            errors: [{ messageId: "useConst", data: { name: "y" }, type: "Identifier" }]
        },
        {
            code: "const x = [1,2,3]; let [y,,z] = x;",
            output: "const x = [1,2,3]; const [y,,z] = x;",
            errors: [
                { messageId: "useConst", data: { name: "y" }, type: "Identifier" },
                { messageId: "useConst", data: { name: "z" }, type: "Identifier" }
            ]
        },

        // https://github.com/eslint/eslint/issues/8308
        {
            code: "let predicate; [, {foo:returnType, predicate}] = foo();",
            output: null,
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { message: "'predicate' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let predicate; [, {foo:returnType, predicate}, ...bar ] = foo();",
            output: null,
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { message: "'predicate' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let predicate; [, {foo:returnType, ...predicate} ] = foo();",
            output: null,
            parserOptions: { ecmaVersion: 2018 },
            errors: [
                { message: "'predicate' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let x = 'x', y = 'y';",
            output: "const x = 'x', y = 'y';",
            errors: [
                { message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'y' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let x = 'x', y = 'y'; x = 1",
            output: null,
            errors: [
                { message: "'y' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let x = 1, y = 'y'; let z = 1;",
            output: "const x = 1, y = 'y'; const z = 1;",
            errors: [
                { message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'y' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'z' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let { a, b, c} = obj; let { x, y, z} = anotherObj; x = 2;",
            output: "const { a, b, c} = obj; let { x, y, z} = anotherObj; x = 2;",
            errors: [
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'c' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'y' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'z' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let x = 'x', y = 'y'; function someFunc() { let a = 1, b = 2; foo(a, b) }",
            output: "const x = 'x', y = 'y'; function someFunc() { const a = 1, b = 2; foo(a, b) }",
            errors: [
                { message: "'x' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'y' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        },
        {
            code: "let someFunc = () => { let a = 1, b = 2; foo(a, b) }",
            output: "const someFunc = () => { const a = 1, b = 2; foo(a, b) }",
            errors: [
                { message: "'someFunc' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'a' is never reassigned. Use 'const' instead.", type: "Identifier" },
                { message: "'b' is never reassigned. Use 'const' instead.", type: "Identifier" }
            ]
        }

    ]
});
