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

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

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

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-in-parens", {

    valid: [
        { code: "foo()", args: ["2", "always"] },
        { code: "foo( bar )", args: ["2", "always"] },
        { code: "foo\n(\nbar\n)\n", args: ["2", "always"] },
        { code: "foo\n(  \nbar\n )\n", args: ["2", "always"] },
        { code: "foo\n(\n bar  \n)\n", args: ["2", "always"] },
        { code: "foo\n( \n  bar \n  )\n", args: ["2", "always"] },
        { code: "foo\n(\t\nbar\n)", args: ["2", "always"] },
        { code: "\tfoo(\n\t\tbar\n\t)", args: ["2", "always"] },
        { code: "\tfoo\n(\t\n\t\tbar\t\n\t)", args: ["2", "always"] },
        { code: "var x = ( 1 + 2 ) * 3", args: ["2", "always"] },
        { code: "var x = 'foo(bar)'", args: ["2", "always"] },
        { code: "var x = 'bar( baz )'", args: ["2", "always"] },

        { code: "bar()", args: ["2", "never"] },
        { code: "bar(baz)", args: ["2", "never"] },
        { code: "var x = (4 + 5) * 6", args: ["2", "never"] },
        { code: "foo\n(\nbar\n)\n", args: ["2", "never"] },
        { code: "foo\n(  \nbar\n )\n", args: ["2", "never"] },
        { code: "foo\n(\n bar  \n)\n", args: ["2", "never"] },
        { code: "foo\n( \n  bar \n  )\n", args: ["2", "never"] },

        // exceptions
        { code: "foo({ bar: 'baz' })", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo( { bar: 'baz' } )", args: ["2", "always", { exceptions: ["[]", "()"] }] },
        { code: "foo( 1, { bar: 'baz' })", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo({ bar: 'baz' }, 1 )", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo({\nbar: 'baz',\nbaz: 'bar'\n})", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo({ bar: 'baz' })", args: ["2", "never", { exceptions: ["[]", "()"] }] },
        { code: "foo( { bar: 'baz' } )", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo(1, { bar: 'baz' } )", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo( { bar: 'baz' }, 1)", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo( {\nbar: 'baz',\nbaz: 'bar'\n} )", args: ["2", "never", { exceptions: ["{}"] }] },

        { code: "foo([ 1, 2 ])", args: ["2", "always", { exceptions: ["[]"] }] },
        { code: "foo( [ 1, 2 ] )", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo( 1, [ 1, 2 ])", args: ["2", "always", { exceptions: ["[]"] }] },
        { code: "foo([ 1, 2 ], 1 )", args: ["2", "always", { exceptions: ["[]"] }] },
        { code: "foo([\n1,\n2\n])", args: ["2", "always", { exceptions: ["[]"] }] },
        { code: "foo([ 1, 2 ])", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo( [ 1, 2 ] )", args: ["2", "never", { exceptions: ["[]"] }] },
        { code: "foo(1, [ 1, 2 ] )", args: ["2", "never", { exceptions: ["[]"] }] },
        { code: "foo( [ 1, 2 ], 1)", args: ["2", "never", { exceptions: ["[]"] }] },
        { code: "foo( [\n1,\n2\n] )", args: ["2", "never", { exceptions: ["[]"] }] },

        { code: "foo(( 1 + 2 ))", args: ["2", "always", { exceptions: ["()"] }] },
        { code: "foo( ( 1 + 2 ) )", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo( 1 / ( 1 + 2 ))", args: ["2", "always", { exceptions: ["()"] }] },
        { code: "foo(( 1 + 2 ) / 1 )", args: ["2", "always", { exceptions: ["()"] }] },
        { code: "foo((\n1 + 2\n))", args: ["2", "always", { exceptions: ["()"] }] },
        { code: "foo((1 + 2))", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo( (1 + 2) )", args: ["2", "never", { exceptions: ["()"] }] },
        { code: "foo(1 / (1 + 2) )", args: ["2", "never", { exceptions: ["()"] }] },
        { code: "foo( (1 + 2) / 1)", args: ["2", "never", { exceptions: ["()"] }] },
        { code: "foo( (\n1 + 2\n) )", args: ["2", "never", { exceptions: ["()"] }] },

        { code: "foo()", args: ["2", "always", { exceptions: ["empty"] }] },
        { code: "foo( )", args: ["2", "always", { exceptions: ["{}"] }] },
        { code: "foo(\n1 + 2\n)", args: ["2", "always", { exceptions: ["empty"] }] },
        { code: "foo()", args: ["2", "never", { exceptions: ["{}"] }] },
        { code: "foo( )", args: ["2", "never", { exceptions: ["empty"] }] },
        { code: "foo( \n1 + 2\n )", args: ["2", "never", { exceptions: ["empty"] }] },

        { code: "foo({ bar: 'baz' }, [ 1, 2 ])", args: ["2", "always", { exceptions: ["{}", "[]"] }] },
        { code: "foo({\nbar: 'baz'\n}, [\n1,\n2\n])", args: ["2", "always", { exceptions: ["{}", "[]"] }] },
        { code: "foo(); bar({bar:'baz'}); baz([1,2])", args: ["2", "always", { exceptions: ["{}", "[]", "()"] }] },
        { code: "foo( { bar: 'baz' }, [ 1, 2 ] )", args: ["2", "never", { exceptions: ["{}", "[]"] }] },
        { code: "foo( {\nbar: 'baz'\n}, [\n1,\n2\n] )", args: ["2", "never", { exceptions: ["{}", "[]"] }] },
        { code: "foo( ); bar( {bar:'baz'} ); baz( [1,2] )", args: ["2", "never", { exceptions: ["{}", "[]", "empty"] }] },

        // faulty exceptions option
        { code: "foo( { bar: 'baz' } )", args: ["2", "always", { exceptions: [] }] },
        { code: "foo( { bar: 'baz' } )", args: ["2", "always", { foo: [] }] },
        { code: "foo( { bar: 'baz' } )", args: ["2", "always", "bar"] }
    ],

    invalid: [
        {
            code: "foo( )",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( bar)",
            args: ["2", "always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo(bar)",
            args: ["2", "always"],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "var x = ( 1 + 2) * 3",
            args: ["2", "always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var x = (1 + 2 ) * 3",
            args: ["2", "always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo\n(bar\n)\n",
            args: ["2", "always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "bar(baz )",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "bar( baz )",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "var x = ( 4 + 5) * 6",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var x = (4 + 5 ) * 6",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR]
        },

        // exceptions
        {
            code: "foo({ bar: 'baz' })",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            args: ["2", "always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' })",
            args: ["2", "never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            args: ["2", "never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            args: ["2", "always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            args: ["2", "never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            args: ["2", "always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            args: ["2", "never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            args: ["2", "always", { exceptions: ["empty"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            args: ["2", "never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            args: ["2", "never", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            args: ["2", "never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            args: ["2", "never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ))",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            args: ["2", "always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ))",
            args: ["2", "always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            args: ["2", "never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ))",
            args: ["2", "always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "( (1 + 2))",
            args: ["2", "never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ) )",
            args: ["2", "always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "((1 + 2) )",
            args: ["2", "never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2 ) ) + 3",
            args: ["2", "always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var result = (1 / (1 + 2)) + 3",
            args: ["2", "never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2)) + 3",
            args: ["2", "always", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = (1 / (1 + 2)) + 3",
            args: ["2", "never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( )",
            args: ["2", "always", { exceptions: ["empty"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo()",
            args: ["2", "never", { exceptions: ["empty"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo\n(\nbar )\n",
            args: ["2", "never"],
            errors: [REJECTED_SPACE_ERROR]
        }
    ]
});
