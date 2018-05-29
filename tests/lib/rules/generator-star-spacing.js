/**
 * @fileoverview Tests for generator-star-spacing rule.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/generator-star-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("generator-star-spacing", rule, {

    valid: [

        // Default ("before")
        "function foo(){}",
        "function *foo(){}",
        "function *foo(arg1, arg2){}",
        "var foo = function *foo(){};",
        "var foo = function *(){};",
        "var foo = { *foo(){} };",
        "var foo = {*foo(){} };",
        "class Foo { *foo(){} }",
        "class Foo {*foo(){} }",
        "class Foo { static *foo(){} }",
        "var foo = {*[ foo ](){} };",
        "class Foo {*[ foo ](){} }",

        // "before"
        {
            code: "function foo(){}",
            options: ["before"]
        },
        {
            code: "function *foo(){}",
            options: ["before"]
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: ["before"]
        },
        {
            code: "var foo = function *foo(){};",
            options: ["before"]
        },
        {
            code: "var foo = function *(){};",
            options: ["before"]
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["before"]
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["before"]
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["before"]
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["before"]
        },
        {
            code: "class Foo { static *foo(){} }",
            options: ["before"]
        },
        {
            code: "class Foo {*[ foo ](){} }",
            options: ["before"]
        },
        {
            code: "var foo = {*[ foo ](){} };",
            options: ["before"]
        },

        // "after"
        {
            code: "function foo(){}",
            options: ["after"]
        },
        {
            code: "function* foo(){}",
            options: ["after"]
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: ["after"]
        },
        {
            code: "var foo = function* foo(){};",
            options: ["after"]
        },
        {
            code: "var foo = function* (){};",
            options: ["after"]
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["after"]
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["after"]
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["after"]
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["after"]
        },
        {
            code: "class Foo { static* foo(){} }",
            options: ["after"]
        },
        {
            code: "var foo = {* [foo](){} };",
            options: ["after"]
        },
        {
            code: "class Foo {* [foo](){} }",
            options: ["after"]
        },

        // "both"
        {
            code: "function foo(){}",
            options: ["both"]
        },
        {
            code: "function * foo(){}",
            options: ["both"]
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: ["both"]
        },
        {
            code: "var foo = function * foo(){};",
            options: ["both"]
        },
        {
            code: "var foo = function * (){};",
            options: ["both"]
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["both"]
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["both"]
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["both"]
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["both"]
        },
        {
            code: "class Foo { static * foo(){} }",
            options: ["both"]
        },
        {
            code: "var foo = {* [foo](){} };",
            options: ["both"]
        },
        {
            code: "class Foo {* [foo](){} }",
            options: ["both"]
        },

        // "neither"
        {
            code: "function foo(){}",
            options: ["neither"]
        },
        {
            code: "function*foo(){}",
            options: ["neither"]
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: ["neither"]
        },
        {
            code: "var foo = function*foo(){};",
            options: ["neither"]
        },
        {
            code: "var foo = function*(){};",
            options: ["neither"]
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["neither"]
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["neither"]
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["neither"]
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["neither"]
        },
        {
            code: "class Foo { static*foo(){} }",
            options: ["neither"]
        },
        {
            code: "var foo = {*[ foo ](){} };",
            options: ["neither"]
        },
        {
            code: "class Foo {*[ foo ](){} }",
            options: ["neither"]
        },

        // {"before": true, "after": false}
        {
            code: "function foo(){}",
            options: [{ before: true, after: false }]
        },
        {
            code: "function *foo(){}",
            options: [{ before: true, after: false }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: [{ before: true, after: false }]
        },
        {
            code: "var foo = function *foo(){};",
            options: [{ before: true, after: false }]
        },
        {
            code: "var foo = function *(){};",
            options: [{ before: true, after: false }]
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{ before: true, after: false }]
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{ before: true, after: false }]
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{ before: true, after: false }]
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{ before: true, after: false }]
        },
        {
            code: "class Foo { static *foo(){} }",
            options: [{ before: true, after: false }]
        },

        // {"before": false, "after": true}
        {
            code: "function foo(){}",
            options: [{ before: false, after: true }]
        },
        {
            code: "function* foo(){}",
            options: [{ before: false, after: true }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: [{ before: false, after: true }]
        },
        {
            code: "var foo = function* foo(){};",
            options: [{ before: false, after: true }]
        },
        {
            code: "var foo = function* (){};",
            options: [{ before: false, after: true }]
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{ before: false, after: true }]
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{ before: false, after: true }]
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{ before: false, after: true }]
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{ before: false, after: true }]
        },
        {
            code: "class Foo { static* foo(){} }",
            options: [{ before: false, after: true }]
        },

        // {"before": true, "after": true}
        {
            code: "function foo(){}",
            options: [{ before: true, after: true }]
        },
        {
            code: "function * foo(){}",
            options: [{ before: true, after: true }]
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: [{ before: true, after: true }]
        },
        {
            code: "var foo = function * foo(){};",
            options: [{ before: true, after: true }]
        },
        {
            code: "var foo = function * (){};",
            options: [{ before: true, after: true }]
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{ before: true, after: true }]
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{ before: true, after: true }]
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{ before: true, after: true }]
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{ before: true, after: true }]
        },
        {
            code: "class Foo { static * foo(){} }",
            options: [{ before: true, after: true }]
        },

        // {"before": false, "after": false}
        {
            code: "function foo(){}",
            options: [{ before: false, after: false }]
        },
        {
            code: "function*foo(){}",
            options: [{ before: false, after: false }]
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: [{ before: false, after: false }]
        },
        {
            code: "var foo = function*foo(){};",
            options: [{ before: false, after: false }]
        },
        {
            code: "var foo = function*(){};",
            options: [{ before: false, after: false }]
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{ before: false, after: false }]
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{ before: false, after: false }]
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{ before: false, after: false }]
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{ before: false, after: false }]
        },
        {
            code: "class Foo { static*foo(){} }",
            options: [{ before: false, after: false }]
        },

        // full configurability
        {
            code: "function * foo(){}",
            options: [{ before: false, after: false, named: "both" }]
        },
        {
            code: "var foo = function * (){};",
            options: [{ before: false, after: false, anonymous: "both" }]
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{ before: false, after: false, method: "both" }]
        },
        {
            code: "var foo = { * foo(){} }",
            options: [{ before: false, after: false, method: "both" }]
        },
        {
            code: "var foo = { bar: function * () {} }",
            options: [{ before: false, after: false, anonymous: "both" }]
        },
        {
            code: "class Foo { static * foo(){} }",
            options: [{ before: false, after: false, method: "both" }]
        },

        // default to top level "before"
        {
            code: "function *foo(){}",
            options: [{ method: "both" }]
        },

        // don't apply unrelated override
        {
            code: "function*foo(){}",
            options: [{ before: false, after: false, method: "both" }]
        },

        // ensure using object-type override works
        {
            code: "function * foo(){}",
            options: [{ before: false, after: false, named: { before: true, after: true } }]
        },

        // unspecified option uses default
        {
            code: "function *foo(){}",
            options: [{ before: false, after: false, named: { before: true } }]
        },

        // https://github.com/eslint/eslint/issues/7101#issuecomment-246080531
        {
            code: "async function foo() { }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "(async function() { })",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "async () => { }",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "({async foo() { }})",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "class A {async foo() { }}",
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: "(class {async foo() { }})",
            parserOptions: { ecmaVersion: 8 }
        }
    ],

    invalid: [

        // Default ("before")
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*foo(){};",
            output: "var foo = function *foo(){};",
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static* foo(){} }",
            output: "class Foo { static *foo(){} }",
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // "before"
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*foo(){};",
            output: "var foo = function *foo(){};",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            options: ["before"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            options: ["before"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: ["before"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* [ foo ](){} };",
            output: "var foo = {*[ foo ](){} };",
            options: ["before"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* [ foo ](){} }",
            output: "class Foo {*[ foo ](){} }",
            options: ["before"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // "after"
        {
            code: "function*foo(){}",
            output: "function* foo(){}",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function *foo(){};",
            output: "var foo = function* foo(){};",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function *(){};",
            output: "var foo = function* (){};",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            output: "var foo = { * foo(){} };",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: ["after"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *[foo](){} };",
            output: "var foo = { * [foo](){} };",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *[foo](){} }",
            output: "class Foo { * [foo](){} }",
            options: ["after"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // "both"
        {
            code: "function*foo(){}",
            output: "function * foo(){}",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function*foo(arg1, arg2){}",
            output: "function * foo(arg1, arg2){}",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*foo(){};",
            output: "var foo = function * foo(){};",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*(){};",
            output: "var foo = function * (){};",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            output: "var foo = {* foo(){} };",
            options: ["both"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: ["both"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: ["both"],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*[foo](){} };",
            output: "var foo = {* [foo](){} };",
            options: ["both"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*[foo](){} }",
            output: "class Foo {* [foo](){} }",
            options: ["both"],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // "neither"
        {
            code: "function * foo(){}",
            output: "function*foo(){}",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function * foo(arg1, arg2){}",
            output: "function*foo(arg1, arg2){}",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function * foo(){};",
            output: "var foo = function*foo(){};",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function * (){};",
            output: "var foo = function*(){};",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            output: "var foo = { *foo(){} };",
            options: ["neither"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * [ foo ](){} };",
            output: "var foo = { *[ foo ](){} };",
            options: ["neither"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * [ foo ](){} }",
            output: "class Foo { *[ foo ](){} }",
            options: ["neither"],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": true, "after": false}
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*foo(){};",
            output: "var foo = function *foo(){};",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: [{ before: true, after: false }],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": false, "after": true}
        {
            code: "function*foo(){}",
            output: "function* foo(){}",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function *foo(){};",
            output: "var foo = function* foo(){};",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function *(){};",
            output: "var foo = function* (){};",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            output: "var foo = { * foo(){} };",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: [{ before: false, after: true }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": true, "after": true}
        {
            code: "function*foo(){}",
            output: "function * foo(){}",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function*foo(arg1, arg2){}",
            output: "function * foo(arg1, arg2){}",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*foo(){};",
            output: "var foo = function * foo(){};",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*(){};",
            output: "var foo = function * (){};",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            output: "var foo = {* foo(){} };",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: [{ before: true, after: true }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": false, "after": false}
        {
            code: "function * foo(){}",
            output: "function*foo(){}",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function * foo(arg1, arg2){}",
            output: "function*foo(arg1, arg2){}",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function * foo(){};",
            output: "var foo = function*foo(){};",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function * (){};",
            output: "var foo = function*(){};",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            output: "var foo = { *foo(){} };",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: [{ before: false, after: false }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // full configurability
        {
            code: "function*foo(){}",
            output: "function * foo(){}",
            options: [{ before: false, after: false, named: "both" }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function*(){};",
            output: "var foo = function * (){};",
            options: [{ before: false, after: false, anonymous: "both" }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: [{ before: false, after: false, method: "both" }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} }",
            output: "var foo = { * foo(){} }",
            options: [{ before: false, after: false, method: "both" }],
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { bar: function*() {} }",
            output: "var foo = { bar: function * () {} }",
            options: [{ before: false, after: false, anonymous: "both" }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: [{ before: false, after: false, method: "both" }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // default to top level "before"
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: [{ method: "both" }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },

        // don't apply unrelated override
        {
            code: "function * foo(){}",
            output: "function*foo(){}",
            options: [{ before: false, after: false, method: "both" }],
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // ensure using object-type override works
        {
            code: "function*foo(){}",
            output: "function * foo(){}",
            options: [{ before: false, after: false, named: { before: true, after: true } }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // unspecified option uses default
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: [{ before: false, after: false, named: { before: true } }],
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        }

    ]

});
