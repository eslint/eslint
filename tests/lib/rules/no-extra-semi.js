/**
 * @fileoverview Tests for no-extra-semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-extra-semi"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-extra-semi", rule, {
    valid: [
        "var x = 5;",
        "function foo(){}",
        "for(;;);",
        "while(0);",
        "do;while(0);",
        "for(a in b);",
        { code: "for(a of b);", parserOptions: { ecmaVersion: 6 } },

        // Class body.
        {code: "class A { }", parserOptions: { ecmaVersion: 6 }},
        {code: "var A = class { };", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { a() { this; } }", parserOptions: { ecmaVersion: 6 }},
        {code: "var A = class { a() { this; } };", parserOptions: { ecmaVersion: 6 }},
        {code: "class A { } a;", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {
            code: "var x = 5;;",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}],
            output: "var x = 5;"
        },
        {
            code: "function foo(){};",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement"}],
            output: "function foo(){}"
        },
        {
            code: "for(;;);;",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }],
            output: "for(;;);"
        },
        {
            code: "while(0);;",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }],
            output: "while(0);"
        },
        {
            code: "do;while(0);;",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }],
            output: "do;while(0);"
        },
        {
            code: "for(a in b);;",
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }],
            output: "for(a in b);"
        },
        {
            code: "for(a of b);;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Unnecessary semicolon.", type: "EmptyStatement" }],
            output: "for(a of b);"
        },

        // Class body.
        {
            code: "class A { ; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 11}],
            output: "class A {  }"
        },
        {
            code: "class A { /*a*/; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 16}],
            output: "class A { /*a*/ }"
        },
        {
            code: "class A { ; a() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 11}],
            output: "class A {  a() {} }"
        },
        {
            code: "class A { a() {}; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}],
            output: "class A { a() {} }"
        },
        {
            code: "class A { a() {}; b() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}],
            output: "class A { a() {} b() {} }"
        },
        {
            code: "class A {; a() {}; b() {}; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 10},
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 18},
                {message: "Unnecessary semicolon.", type: "Punctuator", column: 26}
            ],
            output: "class A { a() {} b() {} }"
        },
        {
            code: "class A { a() {}; get b() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{message: "Unnecessary semicolon.", type: "Punctuator", column: 17}],
            output: "class A { a() {} get b() {} }"
        }
    ]
});
