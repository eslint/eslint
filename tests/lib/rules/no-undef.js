/**
 * @fileoverview Tests for no-undef rule.
 * @author Mark Macdonald
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undef"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-undef", rule, {
    valid: [
        "var a = 1, b = 2; a;",
        "/*global b*/ function f() { b; }",
        { code: "function f() { b; }", globals: { b: false } },
        "/*global b a:false*/  a;  function f() { b; a; }",
        "function a(){}  a();",
        "function f(b) { b; }",
        "var a; a = 1; a++;",
        "var a; function f() { a = 1; }",
        "/*global b:true*/ b++;",
        "/*eslint-env browser*/ window;",
        "/*eslint-env node*/ require(\"a\");",
        "Object; isNaN();",
        "toString()",
        "hasOwnProperty()",
        "function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }",
        "typeof a",
        "typeof (a)",
        "var b = typeof a",
        "typeof a === 'undefined'",
        "if (typeof a === 'undefined') {}",
        { code: "function foo() { var [a, b=4] = [1, 2]; return {a, b}; }", parserOptions: { ecmaVersion: 6 } },
        { code: "var toString = 1;", parserOptions: { ecmaVersion: 6 } },
        { code: "function myFunc(...foo) {  return foo;}", parserOptions: { ecmaVersion: 6 } },
        { code: "var React, App, a=1; React.render(<App attr={a} />);", parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } },
        { code: "var console; [1,2,3].forEach(obj => {\n  console.log(obj);\n});", parserOptions: { ecmaVersion: 6 } },
        { code: "var Foo; class Bar extends Foo { constructor() { super();  }}", parserOptions: { ecmaVersion: 6 } },
        { code: "import Warning from '../lib/warning'; var warn = new Warning('text');", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import * as Warning from '../lib/warning'; var warn = new Warning('text');", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var a; [a] = [0];", parserOptions: { ecmaVersion: 6 } },
        { code: "var a; ({a} = {});", parserOptions: { ecmaVersion: 6 } },
        { code: "var a; ({b: a} = {});", parserOptions: { ecmaVersion: 6 } },
        { code: "var obj; [obj.a, obj.b] = [0, 1];", parserOptions: { ecmaVersion: 6 } },
        { code: "URLSearchParams;", env: { browser: true } },
        { code: "Intl;", env: { browser: true } },
        { code: "IntersectionObserver;", env: { browser: true } },
        { code: "Credential;", env: { browser: true } },
        { code: "requestIdleCallback;", env: { browser: true } },
        { code: "customElements;", env: { browser: true } },
        { code: "PromiseRejectionEvent;", env: { browser: true } },
        { code: "(foo, bar) => { foo ||= WeakRef; bar ??= FinalizationRegistry; }", env: { es2021: true } },

        // Notifications of readonly are removed: https://github.com/eslint/eslint/issues/4504
        "/*global b:false*/ function f() { b = 1; }",
        { code: "function f() { b = 1; }", globals: { b: false } },
        "/*global b:false*/ function f() { b++; }",
        "/*global b*/ b = 1;",
        "/*global b:false*/ var b = 1;",
        "Array = 1;",

        // new.target: https://github.com/eslint/eslint/issues/5420
        { code: "class A { constructor() { new.target; } }", parserOptions: { ecmaVersion: 6 } },

        // Rest property
        {
            code: "var {bacon, ...others} = stuff; foo(others)",
            parserOptions: {
                ecmaVersion: 2018
            },
            globals: { stuff: false, foo: false }
        },

        // export * as ns from "source"
        {
            code: 'export * as ns from "source"',
            parserOptions: { ecmaVersion: 2020, sourceType: "module" }
        },

        // import.meta
        {
            code: "import.meta",
            parserOptions: { ecmaVersion: 2020, sourceType: "module" }
        },

        // class static blocks
        {
            code: "let a; class C { static {} } a;",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "undef", data: { name: "a" } }]
        },
        {
            code: "var a; class C { static {} } a;",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "undef", data: { name: "a" } }]
        },
        {
            code: "a; class C { static {} } var a;",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "undef", data: { name: "a" } }]
        },
        {
            code: "class C { static { C; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "const C = class { static { C; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; } } var a;",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; } } let a;",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { var a; a; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; var a; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; { var a; } } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { let a; a; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; let a; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { function a() {} a; } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C { static { a; function a() {} } }",
            parserOptions: { ecmaVersion: 2022, sourceType: "module" }
        }
    ],
    invalid: [
        { code: "a = 1;", errors: [{ messageId: "undef", data: { name: "a" }, type: "Identifier" }] },
        { code: "if (typeof anUndefinedVar === 'string') {}", options: [{ typeof: true }], errors: [{ messageId: "undef", data: { name: "anUndefinedVar" }, type: "Identifier" }] },
        { code: "var a = b;", errors: [{ messageId: "undef", data: { name: "b" }, type: "Identifier" }] },
        { code: "function f() { b; }", errors: [{ messageId: "undef", data: { name: "b" }, type: "Identifier" }] },
        { code: "window;", errors: [{ messageId: "undef", data: { name: "window" }, type: "Identifier" }] },
        { code: "require(\"a\");", errors: [{ messageId: "undef", data: { name: "require" }, type: "Identifier" }] },
        { code: "var React; React.render(<img attr={a} />);", parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }, errors: [{ messageId: "undef", data: { name: "a" } }] },
        { code: "var React, App; React.render(<App attr={a} />);", parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } }, errors: [{ messageId: "undef", data: { name: "a" } }] },
        { code: "[a] = [0];", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "undef", data: { name: "a" } }] },
        { code: "({a} = {});", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "undef", data: { name: "a" } }] },
        { code: "({b: a} = {});", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "undef", data: { name: "a" } }] },
        { code: "[obj.a, obj.b] = [0, 1];", parserOptions: { ecmaVersion: 6 }, errors: [{ messageId: "undef", data: { name: "obj" } }, { messageId: "undef", data: { name: "obj" } }] },

        // Experimental
        {
            code: "const c = 0; const a = {...b, c};",
            parserOptions: {
                ecmaVersion: 2018
            },
            errors: [{ messageId: "undef", data: { name: "b" } }]
        },

        // class static blocks
        {
            code: "class C { static { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" } }]
        },
        {
            code: "class C { static { { let a; } a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 31 }]
        },
        {
            code: "class C { static { { function a() {} } a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 40 }]
        },
        {
            code: "class C { static { function foo() { var a; }  a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 47 }]
        },
        {
            code: "class C { static { var a; } static { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 38 }]
        },
        {
            code: "class C { static { let a; } static { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 38 }]
        },
        {
            code: "class C { static { function a(){} } static { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 46 }]
        },
        {
            code: "class C { static { var a; } foo() { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 37 }]
        },
        {
            code: "class C { static { let a; } foo() { a; } }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 37 }]
        },
        {
            code: "class C { static { var a; } [a]; }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 30 }]
        },
        {
            code: "class C { static { let a; } [a]; }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 30 }]
        },
        {
            code: "class C { static { function a() {} } [a]; }",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 39 }]
        },
        {
            code: "class C { static { var a; } } a;",
            parserOptions: {
                ecmaVersion: 2022
            },
            errors: [{ messageId: "undef", data: { name: "a" }, column: 31 }]
        }
    ]
});
