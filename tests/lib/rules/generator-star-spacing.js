/**
 * @fileoverview Tests for generator-star-spacing rule.
 * @author Jamund Ferguson
 * @copyright 2015 Brandon Mills. All rights reserved.
 * @copyright 2014 Jamund Ferguson. All rights reserved.
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
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(arg1, arg2){}",
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *foo(){};",
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { *foo(){} };",
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {*foo(){} };",
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { *foo(){} }",
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {*foo(){} }",
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static *foo(){} }",
            ecmaFeatures: { classes: true, generators: true }
        },

        // "before"
        {
            code: "function foo(){}",
            options: ["before"]
        },
        {
            code: "function *foo(){}",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *foo(){};",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            options: ["before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["before"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["before"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static *foo(){} }",
            options: ["before"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "after"
        {
            code: "function foo(){}",
            options: ["after"]
        },
        {
            code: "function* foo(){}",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* foo(){};",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            options: ["after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["after"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["after"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static* foo(){} }",
            options: ["after"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "both"
        {
            code: "function foo(){}",
            options: ["both"]
        },
        {
            code: "function * foo(){}",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * foo(){};",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            options: ["both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { * foo(){} };",
            options: ["both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {* foo(){} };",
            options: ["both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { * foo(){} }",
            options: ["both"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {* foo(){} }",
            options: ["both"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static * foo(){} }",
            options: ["both"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "neither"
        {
            code: "function foo(){}",
            options: ["neither"]
        },
        {
            code: "function*foo(){}",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*foo(){};",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            options: ["neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {*foo(){} };",
            options: ["neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { *foo(){} };",
            options: ["neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {*foo(){} }",
            options: ["neither"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { *foo(){} }",
            options: ["neither"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static*foo(){} }",
            options: ["neither"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": true, "after": false}
        {
            code: "function foo(){}",
            options: [{"before": true, "after": false}]
        },
        {
            code: "function *foo(){}",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(arg1, arg2){}",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *foo(){};",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static *foo(){} }",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": false, "after": true}
        {
            code: "function foo(){}",
            options: [{"before": false, "after": true}]
        },
        {
            code: "function* foo(){}",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo(arg1, arg2){}",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* foo(){};",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static* foo(){} }",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": true, "after": true}
        {
            code: "function foo(){}",
            options: [{"before": true, "after": true}]
        },
        {
            code: "function * foo(){}",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function * foo(arg1, arg2){}",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * foo(){};",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { * foo(){} };",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {* foo(){} };",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { * foo(){} }",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {* foo(){} }",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static * foo(){} }",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": false, "after": false}
        {
            code: "function foo(){}",
            options: [{"before": false, "after": false}]
        },
        {
            code: "function*foo(){}",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function*foo(arg1, arg2){}",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*foo(){};",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {*foo(){} };",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { *foo(){} };",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {*foo(){} }",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { *foo(){} }",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static*foo(){} }",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        }

    ],

    invalid: [

        // Default ("before")
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function * (){};",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static* foo(){} }",
            output: "class Foo { static *foo(){} }",
            ecmaFeatures: { classes: true, generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: ["before"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function * (){};",
            options: ["before"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            options: ["before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: ["before"],
            ecmaFeatures: { classes: true, generators: true },
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: ["after"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            output: "var foo = function*(){};",
            options: ["after"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            output: "var foo = { * foo(){} };",
            options: ["after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: ["after"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: ["after"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // "both"
        {
            code: "function*foo(){}",
            output: "function * foo(){}",
            options: ["both"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            output: "var foo = function *(){};",
            options: ["both"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            output: "var foo = {* foo(){} };",
            options: ["both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: ["both"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: ["both"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }, {
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },

        // "neither"
        {
            code: "function * foo(){}",
            output: "function*foo(){}",
            options: ["neither"],
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            ecmaFeatures: { generators: true },
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
            output: "var foo = function* (){};",
            options: ["neither"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            output: "var foo = { *foo(){} };",
            options: ["neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: ["neither"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: ["neither"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }, {
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": true, "after": false}
        {
            code: "function*foo(){}",
            output: "function *foo(){}",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            output: "function *foo(arg1, arg2){}",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            output: "var foo = function * (){};",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            output: "var foo = {*foo(){} };",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            output: "class Foo {*foo(){} }",
            options: [{"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": false, "after": true}
        {
            code: "function*foo(){}",
            output: "function* foo(){}",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            output: "function* foo(arg1, arg2){}",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true },
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
            output: "var foo = function*(){};",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            output: "var foo = { * foo(){} };",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            output: "class Foo { * foo(){} }",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            output: "class Foo { static* foo(){} }",
            options: [{"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
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
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true },
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
            output: "var foo = function *(){};",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            output: "var foo = {* foo(){} };",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            output: "class Foo {* foo(){} }",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            output: "class Foo { static * foo(){} }",
            options: [{"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
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
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true },
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
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true },
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
            output: "var foo = function* (){};",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            output: "var foo = { *foo(){} };",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            output: "class Foo { *foo(){} }",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            output: "class Foo { static*foo(){} }",
            options: [{"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true },
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
