/**
 * @fileoverview Tests for generator-star-spacing rule.
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/generator-star-spacing"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("generator-star-spacing", rule, {

    valid: [

        // Default ("before")
        {
            code: "function foo(){}"
        },
        {
            code: "function *foo(){}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(arg1, arg2){}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *foo(){};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *(){};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { *foo(){} };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*foo(){} };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { *foo(){} }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*foo(){} }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static *foo(){} }",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*[ foo ](){} };",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*[ foo ](){} }",
            parserOptions: { ecmaVersion: 6 }
        },

        // "before"
        {
            code: "function foo(){}",
            options: ["before"]
        },
        {
            code: "function *foo(){}",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *foo(){};",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *(){};",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static *foo(){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*[ foo ](){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*[ foo ](){} };",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 }
        },

        // "after"
        {
            code: "function foo(){}",
            options: ["after"]
        },
        {
            code: "function* foo(){}",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function* foo(){};",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function* (){};",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static* foo(){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* [foo](){} };",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* [foo](){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 }
        },

        // "both"
        {
            code: "function foo(){}",
            options: ["both"]
        },
        {
            code: "function * foo(){}",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function * foo(){};",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function * (){};",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static * foo(){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* [foo](){} };",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* [foo](){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 }
        },

        // "neither"
        {
            code: "function foo(){}",
            options: ["neither"]
        },
        {
            code: "function*foo(){}",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*foo(){};",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*(){};",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static*foo(){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*[ foo ](){} };",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*[ foo ](){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 }
        },

        // {"before": true, "after": false}
        {
            code: "function foo(){}",
            options: [{before: true, after: false}]
        },
        {
            code: "function *foo(){}",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *foo(){};",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function *(){};",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static *foo(){} }",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },

        // {"before": false, "after": true}
        {
            code: "function foo(){}",
            options: [{before: false, after: true}]
        },
        {
            code: "function* foo(){}",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function* foo(){};",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function* (){};",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static* foo(){} }",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },

        // {"before": true, "after": true}
        {
            code: "function foo(){}",
            options: [{before: true, after: true}]
        },
        {
            code: "function * foo(){}",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function * foo(){};",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function * (){};",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static * foo(){} }",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 }
        },

        // {"before": false, "after": false}
        {
            code: "function foo(){}",
            options: [{before: false, after: false}]
        },
        {
            code: "function*foo(){}",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*foo(){};",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = function*(){};",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo { static*foo(){} }",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 }
        }

    ],

    invalid: [

        // Default ("before")
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static* foo(){} }",
            output: "class Foo { static *foo(){} }",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* [ foo ](){} };",
            output: "var foo = {*[ foo ](){} };",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* [ foo ](){} }",
            output: "class Foo {*[ foo ](){} }",
            options: ["before"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *[foo](){} }",
            output: "class Foo { * [foo](){} }",
            options: ["after"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*[foo](){} }",
            output: "class Foo {* [foo](){} }",
            options: ["both"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * [ foo ](){} }",
            output: "class Foo { *[ foo ](){} }",
            options: ["neither"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": true, "after": false}
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function *(){};",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: [{before: true, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": false, "after": true}
        {
            code: "function*foo(){}",
            output: "function* foo(){}",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: [{before: false, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: [{before: true, after: true}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
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
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: [{before: false, after: false}],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        }

    ]

});
