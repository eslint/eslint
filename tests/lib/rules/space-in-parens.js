/**
 * @fileoverview Disallows or enforces spaces inside of parentheses.
 * @author Jonathan Rajavuori
 * @copyright 2014 David Clark. All rights reserved.
 * @copyright 2014 Jonathan Rajavuori. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-in-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

var MISSING_SPACE_ERROR = {
        message: "There must be a space inside this paren.",
        type: "Program"
    },
    REJECTED_SPACE_ERROR = {
        message: "There should be no spaces inside this paren.",
        type: "Program"
    };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("space-in-parens", rule, {

    valid: [
        { code: "foo()", options: ["always"] },
        { code: "foo( bar )", options: ["always"] },
        { code: "foo\n(\nbar\n)\n", options: ["always"] },
        { code: "foo\n(  \nbar\n )\n", options: ["always"] },
        { code: "foo\n(\n bar  \n)\n", options: ["always"] },
        { code: "foo\n( \n  bar \n  )\n", options: ["always"] },
        { code: "foo\n(\t\nbar\n)", options: ["always"] },
        { code: "\tfoo(\n\t\tbar\n\t)", options: ["always"] },
        { code: "\tfoo\n(\t\n\t\tbar\t\n\t)", options: ["always"] },
        { code: "var x = ( 1 + 2 ) * 3", options: ["always"] },
        { code: "var x = 'foo(bar)'", options: ["always"] },
        { code: "var x = 'bar( baz )'", options: ["always"] },
        { code: "var foo = `(bar)`;", options: ["always"], ecmaFeatures: { templateStrings: "true" } },
        { code: "var foo = `(bar ${baz})`;", options: ["always"], ecmaFeatures: { templateStrings: "true" } },
        { code: "var foo = `(bar ${( 1 + 2 )})`;", options: ["always"], ecmaFeatures: { templateStrings: "true" } },
        { code: "bar()", options: ["never"] },
        { code: "bar(baz)", options: ["never"] },
        { code: "var x = (4 + 5) * 6", options: ["never"] },
        { code: "foo\n(\nbar\n)\n", options: ["never"] },
        { code: "foo\n(  \nbar\n )\n", options: ["never"] },
        { code: "foo\n(\n bar  \n)\n", options: ["never"] },
        { code: "foo\n( \n  bar \n  )\n", options: ["never"] },
        { code: "var foo = `( bar )`;", options: ["never"], ecmaFeatures: { templateStrings: "true" } },
        { code: "var foo = `( bar ${baz} )`;", options: ["never"], ecmaFeatures: { templateStrings: "true" } },
        { code: "var foo = `(bar ${(1 + 2)})`;", options: ["never"], ecmaFeatures: { templateStrings: "true" } },

        // comments
        { code: "foo( /* bar */ )", options: ["always"] },
        { code: "foo( /* bar */baz )", options: ["always"] },
        { code: "foo( /* bar */ baz )", options: ["always"] },
        { code: "foo( baz/* bar */ )", options: ["always"] },
        { code: "foo( baz /* bar */ )", options: ["always"] },
        { code: "foo(/* bar */)", options: ["never"] },
        { code: "foo(/* bar */ baz)", options: ["never"] },
        { code: "foo( //some comment\nbar\n)\n" },
        { code: "foo(//some comment\nbar\n)\n", options: ["never"] },
        { code: "foo( //some comment\nbar\n)\n", options: ["never"] },

        // exceptions
        { code: "foo({ bar: 'baz' })", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo( { bar: 'baz' } )", options: ["always", { exceptions: ["[]", "()"] }] },
        { code: "foo( 1, { bar: 'baz' })", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo({ bar: 'baz' }, 1 )", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo({\nbar: 'baz',\nbaz: 'bar'\n})", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo({ bar: 'baz' })", options: ["never", { exceptions: ["[]", "()"] }] },
        { code: "foo( { bar: 'baz' } )", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo(1, { bar: 'baz' } )", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo( { bar: 'baz' }, 1)", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo( {\nbar: 'baz',\nbaz: 'bar'\n} )", options: ["never", { exceptions: ["{}"] }] },

        { code: "foo([ 1, 2 ])", options: ["always", { exceptions: ["[]"] }] },
        { code: "foo( [ 1, 2 ] )", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo( 1, [ 1, 2 ])", options: ["always", { exceptions: ["[]"] }] },
        { code: "foo([ 1, 2 ], 1 )", options: ["always", { exceptions: ["[]"] }] },
        { code: "foo([\n1,\n2\n])", options: ["always", { exceptions: ["[]"] }] },
        { code: "foo([ 1, 2 ])", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo( [ 1, 2 ] )", options: ["never", { exceptions: ["[]"] }] },
        { code: "foo(1, [ 1, 2 ] )", options: ["never", { exceptions: ["[]"] }] },
        { code: "foo( [ 1, 2 ], 1)", options: ["never", { exceptions: ["[]"] }] },
        { code: "foo( [\n1,\n2\n] )", options: ["never", { exceptions: ["[]"] }] },

        { code: "foo(( 1 + 2 ))", options: ["always", { exceptions: ["()"] }] },
        { code: "foo( ( 1 + 2 ) )", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo( 1 / ( 1 + 2 ))", options: ["always", { exceptions: ["()"] }] },
        { code: "foo(( 1 + 2 ) / 1 )", options: ["always", { exceptions: ["()"] }] },
        { code: "foo((\n1 + 2\n))", options: ["always", { exceptions: ["()"] }] },
        { code: "foo((1 + 2))", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo( (1 + 2) )", options: ["never", { exceptions: ["()"] }] },
        { code: "foo(1 / (1 + 2) )", options: ["never", { exceptions: ["()"] }] },
        { code: "foo( (1 + 2) / 1)", options: ["never", { exceptions: ["()"] }] },
        { code: "foo( (\n1 + 2\n) )", options: ["never", { exceptions: ["()"] }] },

        { code: "foo()", options: ["always", { exceptions: ["empty"] }] },
        { code: "foo( )", options: ["always", { exceptions: ["{}"] }] },
        { code: "foo(\n1 + 2\n)", options: ["always", { exceptions: ["empty"] }] },
        { code: "foo()", options: ["never", { exceptions: ["{}"] }] },
        { code: "foo( )", options: ["never", { exceptions: ["empty"] }] },
        { code: "foo( \n1 + 2\n )", options: ["never", { exceptions: ["empty"] }] },

        { code: "foo({ bar: 'baz' }, [ 1, 2 ])", options: ["always", { exceptions: ["{}", "[]"] }] },
        { code: "foo({\nbar: 'baz'\n}, [\n1,\n2\n])", options: ["always", { exceptions: ["{}", "[]"] }] },
        { code: "foo(); bar({bar:'baz'}); baz([1,2])", options: ["always", { exceptions: ["{}", "[]", "()"] }] },
        { code: "foo( { bar: 'baz' }, [ 1, 2 ] )", options: ["never", { exceptions: ["{}", "[]"] }] },
        { code: "foo( {\nbar: 'baz'\n}, [\n1,\n2\n] )", options: ["never", { exceptions: ["{}", "[]"] }] },
        { code: "foo( ); bar( {bar:'baz'} ); baz( [1,2] )", options: ["never", { exceptions: ["{}", "[]", "empty"] }] },

        // faulty exceptions option
        { code: "foo( { bar: 'baz' } )", options: ["always", { exceptions: [] }] }
    ],

    invalid: [
        {
            code: "foo( )",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( bar)",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo(bar)",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "var x = ( 1 + 2) * 3",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var x = (1 + 2 ) * 3",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo\n(bar\n)\n",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "bar(baz )",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "bar( baz )",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "var x = ( 4 + 5) * 6",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var x = (4 + 5 ) * 6",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },

        // comments
        {
            code: "foo(/* bar */)",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo(/* bar */baz )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo(/* bar */ baz )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( baz/* bar */)",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( baz /* bar */)",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( /* bar */ )",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( /* bar */ baz)",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },

        // exceptions
        {
            code: "foo({ bar: 'baz' })",
            options: ["always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' })",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            options: ["always", { exceptions: ["empty"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            options: ["never", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ))",
            options: ["always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ))",
            options: ["always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ))",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "( (1 + 2))",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ) )",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "((1 + 2) )",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2 ) ) + 3",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var result = (1 / (1 + 2)) + 3",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2)) + 3",
            options: ["always", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = (1 / (1 + 2)) + 3",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( )",
            options: ["always", { exceptions: ["empty"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo()",
            options: ["never", { exceptions: ["empty"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo\n(\nbar )\n",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var foo = `(bar ${(1 + 2 )})`;",
            options: ["never"],
            ecmaFeatures: { templateStrings: "true" },
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var foo = `(bar ${(1 + 2 )})`;",
            options: ["always"],
            ecmaFeatures: { templateStrings: "true" },
            errors: [MISSING_SPACE_ERROR]
        }
    ]
});
