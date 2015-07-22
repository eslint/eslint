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

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/generator-star-spacing", {

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
            args: [2, "before"]
        },
        {
            code: "function *foo(){}",
            args: [2, "before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(arg1, arg2){}",
            args: [2, "before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *foo(){};",
            args: [2, "before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            args: [2, "before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            args: [2, "before"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, "before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, "before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, "before"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, "before"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static *foo(){} }",
            args: [2, "before"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "after"
        {
            code: "function foo(){}",
            args: [2, "after"]
        },
        {
            code: "function* foo(){}",
            args: [2, "after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo(arg1, arg2){}",
            args: [2, "after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* foo(){};",
            args: [2, "after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            args: [2, "after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            args: [2, "after"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, "after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, "after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, "after"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, "after"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static* foo(){} }",
            args: [2, "after"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "both"
        {
            code: "function foo(){}",
            args: [2, "both"]
        },
        {
            code: "function * foo(){}",
            args: [2, "both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function * foo(arg1, arg2){}",
            args: [2, "both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * foo(){};",
            args: [2, "both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            args: [2, "both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            args: [2, "both"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, "both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, "both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, "both"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, "both"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static * foo(){} }",
            args: [2, "both"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // "neither"
        {
            code: "function foo(){}",
            args: [2, "neither"]
        },
        {
            code: "function*foo(){}",
            args: [2, "neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function*foo(arg1, arg2){}",
            args: [2, "neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*foo(){};",
            args: [2, "neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            args: [2, "neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            args: [2, "neither"],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, "neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, "neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, "neither"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, "neither"],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static*foo(){} }",
            args: [2, "neither"],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": true, "after": false}
        {
            code: "function foo(){}",
            args: [2, {"before": true, "after": false}]
        },
        {
            code: "function *foo(){}",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function *foo(arg1, arg2){}",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *foo(){};",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static *foo(){} }",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": false, "after": true}
        {
            code: "function foo(){}",
            args: [2, {"before": false, "after": true}]
        },
        {
            code: "function* foo(){}",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function* foo(arg1, arg2){}",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* foo(){};",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static* foo(){} }",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": true, "after": true}
        {
            code: "function foo(){}",
            args: [2, {"before": true, "after": true}]
        },
        {
            code: "function * foo(){}",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function * foo(arg1, arg2){}",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * foo(){};",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function * (){};",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function *(){};",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static * foo(){} }",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true }
        },

        // {"before": false, "after": false}
        {
            code: "function foo(){}",
            args: [2, {"before": false, "after": false}]
        },
        {
            code: "function*foo(){}",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "function*foo(arg1, arg2){}",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*foo(){};",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function*(){};",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = function* (){};",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true }
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true }
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        },
        {
            code: "class Foo { static*foo(){} }",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true }
        }

    ],

    invalid: [

        // Default ("before")
        {
            code: "function*foo(){}",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
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
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static* foo(){} }",
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
            args: [2, "before"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            args: [2, "before"],
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
            args: [2, "before"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            args: [2, "before"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, "before"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, "before"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // "after"
        {
            code: "function*foo(){}",
            args: [2, "after"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            args: [2, "after"],
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
            args: [2, "after"],
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
            args: [2, "after"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, "after"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, "after"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            args: [2, "after"],
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
            args: [2, "both"],
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
            args: [2, "both"],
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
            args: [2, "both"],
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
            args: [2, "both"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, "both"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, "both"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            args: [2, "both"],
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
            args: [2, "neither"],
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
            args: [2, "neither"],
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
            args: [2, "neither"],
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
            args: [2, "neither"],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, "neither"],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, "neither"],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            args: [2, "neither"],
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
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function* foo(arg1, arg2){}",
            args: [2, {"before": true, "after": false}],
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
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = function* (){};",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {* foo(){} };",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {* foo(){} }",
            args: [2, {"before": true, "after": false}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },

        // {"before": false, "after": true}
        {
            code: "function*foo(){}",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "function *foo(arg1, arg2){}",
            args: [2, {"before": false, "after": true}],
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
            args: [2, {"before": false, "after": true}],
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
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { *foo(){} };",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { *foo(){} }",
            args: [2, {"before": false, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static *foo(){} }",
            args: [2, {"before": false, "after": true}],
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
            args: [2, {"before": true, "after": true}],
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
            args: [2, {"before": true, "after": true}],
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
            args: [2, {"before": true, "after": true}],
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
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Missing space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = {*foo(){} };",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo {*foo(){} }",
            args: [2, {"before": true, "after": true}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Missing space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static*foo(){} }",
            args: [2, {"before": true, "after": true}],
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
            args: [2, {"before": false, "after": false}],
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
            args: [2, {"before": false, "after": false}],
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
            args: [2, {"before": false, "after": false}],
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
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true },
            errors: [{
                message: "Unexpected space before *.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = { * foo(){} };",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { generators: true, objectLiteralShorthandMethods: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { * foo(){} }",
            args: [2, {"before": false, "after": false}],
            ecmaFeatures: { classes: true, generators: true },
            errors: [{
                message: "Unexpected space after *.",
                type: "Punctuator"
            }]
        },
        {
            code: "class Foo { static * foo(){} }",
            args: [2, {"before": false, "after": false}],
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
