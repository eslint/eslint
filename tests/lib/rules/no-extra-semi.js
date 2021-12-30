/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extra-semi"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-extra-semi", rule, {
    valid: [
        "var x = 5;",
        "function foo(){}",
        "for(;;);",
        "while(0);",
        "do;while(0);",
        "for(a in b);",
        { code: "for(a of b);", parserOptions: { ecmaVersion: 6 } },
        "if(true);",
        "if(true); else;",
        "foo: ;",
        "with(foo);",

        // Class body.
        { code: "class A { }", parserOptions: { ecmaVersion: 6 } },
        { code: "var A = class { };", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { a() { this; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "var A = class { a() { this; } };", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { } a;", parserOptions: { ecmaVersion: 6 } },
        { code: "class A { field; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { field = 0; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class A { static { foo; } }", parserOptions: { ecmaVersion: 2022 } },

        // modules
        { code: "export const x = 42;", parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default 42;", parserOptions: { ecmaVersion: 6, sourceType: "module" } }
    ],
    invalid: [
        {
            code: "var x = 5;;",
            output: "var x = 5;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "function foo(){};",
            output: "function foo(){}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(;;);;",
            output: "for(;;);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "while(0);;",
            output: "while(0);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "do;while(0);;",
            output: "do;while(0);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(a in b);;",
            output: "for(a in b);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "for(a of b);;",
            output: "for(a of b);",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true);;",
            output: "if(true);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true){} else;;",
            output: "if(true){} else;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "if(true){;} else {;}",
            output: "if(true){} else {}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }, { messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "foo:;;",
            output: "foo:;",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "with(foo);;",
            output: "with(foo);",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "with(foo){;}",
            output: "with(foo){}",
            errors: [{ messageId: "unexpected", type: "EmptyStatement" }]
        },
        {
            code: "class A { static { ; } }",
            output: "class A { static {  } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement", column: 20 }]
        },
        {
            code: "class A { static { a;; } }",
            output: "class A { static { a; } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "EmptyStatement", column: 22 }]
        },

        // Class body.
        {
            code: "class A { ; }",
            output: "class A {  }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 11 }]
        },
        {
            code: "class A { /*a*/; }",
            output: "class A { /*a*/ }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 16 }]
        },
        {
            code: "class A { ; a() {} }",
            output: "class A {  a() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 11 }]
        },
        {
            code: "class A { a() {}; }",
            output: "class A { a() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { a() {}; b() {} }",
            output: "class A { a() {} b() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A {; a() {}; b() {}; }",
            output: "class A { a() {} b() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                { messageId: "unexpected", type: "Punctuator", column: 10 },
                { messageId: "unexpected", type: "Punctuator", column: 18 },
                { messageId: "unexpected", type: "Punctuator", column: 26 }
            ]
        },
        {
            code: "class A { a() {}; get b() {} }",
            output: "class A { a() {} get b() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { field;; }",
            output: "class A { field; }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 17 }]
        },
        {
            code: "class A { static {}; }",
            output: "class A { static {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 20 }]
        },
        {
            code: "class A { static { a; }; foo(){} }",
            output: "class A { static { a; } foo(){} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected", type: "Punctuator", column: 24 }]
        }
    ]
});
