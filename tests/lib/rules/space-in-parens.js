/**
 * @fileoverview Disallows or enforces spaces inside of parentheses.
 * @author Jonathan Rajavuori
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/space-in-parens"),
    RuleTester = require("../../../lib/testers/rule-tester");

const MISSING_SPACE_ERROR = "There must be a space inside this paren.",
    REJECTED_SPACE_ERROR = "There should be no spaces inside this paren.";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        { code: "var foo = `(bar)`;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `(bar ${baz})`;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `(bar ${( 1 + 2 )})`;", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "bar()", options: ["never"] },
        { code: "bar(baz)", options: ["never"] },
        { code: "var x = (4 + 5) * 6", options: ["never"] },
        { code: "foo\n(\nbar\n)\n", options: ["never"] },
        { code: "foo\n(  \nbar\n )\n", options: ["never"] },
        { code: "foo\n(\n bar  \n)\n", options: ["never"] },
        { code: "foo\n( \n  bar \n  )\n", options: ["never"] },
        { code: "var foo = `( bar )`;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `( bar ${baz} )`;", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = `(bar ${(1 + 2)})`;", options: ["never"], parserOptions: { ecmaVersion: 6 } },

        // comments
        { code: "foo( /* bar */ )", options: ["always"] },
        { code: "foo( /* bar */baz )", options: ["always"] },
        { code: "foo( /* bar */ baz )", options: ["always"] },
        { code: "foo( baz/* bar */ )", options: ["always"] },
        { code: "foo( baz /* bar */ )", options: ["always"] },
        { code: "foo(/* bar */)", options: ["never"] },
        { code: "foo(/* bar */ baz)", options: ["never"] },
        "foo( //some comment\nbar\n)\n",
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
        { code: "foo( { bar: 'baz' } )", options: ["always", { exceptions: [] }] },
        { code: "foo( { bar: 'baz' } )", options: ["always", {}] }
    ],

    invalid: [
        {
            code: "foo( )",
            output: "foo()",
            options: ["never"],
            errors: [{ message: REJECTED_SPACE_ERROR, line: 1, column: 4 }]
        },
        {
            code: "foo( bar)",
            output: "foo( bar )",
            options: ["always"],
            errors: [{ message: MISSING_SPACE_ERROR, line: 1, column: 9 }]
        },
        {
            code: "foo(bar)",
            output: "foo( bar )",
            options: ["always"],
            errors: [
                { message: MISSING_SPACE_ERROR, line: 1, column: 4 },
                { message: MISSING_SPACE_ERROR, line: 1, column: 8 }
            ]
        },
        {
            code: "var x = ( 1 + 2) * 3",
            output: "var x = ( 1 + 2 ) * 3",
            options: ["always"],
            errors: [{ message: MISSING_SPACE_ERROR, line: 1, column: 16 }]
        },
        {
            code: "var x = (1 + 2 ) * 3",
            output: "var x = ( 1 + 2 ) * 3",
            options: ["always"],
            errors: [{ message: MISSING_SPACE_ERROR, line: 1, column: 9 }]
        },
        {
            code: "foo\n(bar\n)\n",
            output: "foo\n( bar\n)\n",
            options: ["always"],
            errors: [{ message: MISSING_SPACE_ERROR, line: 2, column: 1 }]
        },
        {
            code: "bar(baz )",
            output: "bar(baz)",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "bar( baz )",
            output: "bar(baz)",
            options: ["never"],
            errors: [
                { message: REJECTED_SPACE_ERROR, line: 1, column: 4 },
                { message: REJECTED_SPACE_ERROR, line: 1, column: 10 }
            ]
        },
        {
            code: "var x = ( 4 + 5) * 6",
            output: "var x = (4 + 5) * 6",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var x = (4 + 5 ) * 6",
            output: "var x = (4 + 5) * 6",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR]
        },

        // comments
        {
            code: "foo(/* bar */)",
            output: "foo( /* bar */ )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo(/* bar */baz )",
            output: "foo( /* bar */baz )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo(/* bar */ baz )",
            output: "foo( /* bar */ baz )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( baz/* bar */)",
            output: "foo( baz/* bar */ )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( baz /* bar */)",
            output: "foo( baz /* bar */ )",
            options: ["always"],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( /* bar */ )",
            output: "foo(/* bar */)",
            options: ["never"],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( /* bar */ baz)",
            output: "foo(/* bar */ baz)",
            options: ["never"],
            errors: [{ message: REJECTED_SPACE_ERROR, line: 1, column: 4 }]
        },

        // exceptions
        {
            code: "foo({ bar: 'baz' })",
            output: "foo( { bar: 'baz' } )",
            options: ["always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            output: "foo({ bar: 'baz' })",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' })",
            output: "foo( { bar: 'baz' } )",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' } )",
            output: "foo({ bar: 'baz' })",
            options: ["never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            output: "foo({ bar: 'baz' })",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( { bar: 'baz' })",
            output: "foo( { bar: 'baz' } )",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            output: "foo({ bar: 'baz' })",
            options: ["always", { exceptions: ["{}"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo({ bar: 'baz' } )",
            output: "foo( { bar: 'baz' } )",
            options: ["never", { exceptions: ["{}"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            output: "foo( [ 1, 2 ] )",
            options: ["always", { exceptions: ["empty"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            output: "foo([ 1, 2 ])",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ])",
            output: "foo( [ 1, 2 ] )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ] )",
            output: "foo([ 1, 2 ])",
            options: ["never", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            output: "foo([ 1, 2 ])",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo([ 1, 2 ] )",
            output: "foo( [ 1, 2 ] )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            output: "foo([ 1, 2 ])",
            options: ["always", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "foo( [ 1, 2 ])",
            output: "foo( [ 1, 2 ] )",
            options: ["never", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ))",
            output: "( ( 1 + 2 ) )",
            options: ["always", { exceptions: ["[]"] }],
            errors: [MISSING_SPACE_ERROR, MISSING_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ) )",
            output: "(( 1 + 2 ))",
            options: ["always", { exceptions: ["()"] }],
            errors: [
                { message: REJECTED_SPACE_ERROR, line: 1, column: 1 },
                { message: REJECTED_SPACE_ERROR, line: 1, column: 13 }
            ]
        },
        {
            code: "( ( 1 + 2 ) )",
            output: "((1 + 2))",
            options: ["never"],
            errors: [
                { message: REJECTED_SPACE_ERROR, line: 1, column: 1 },
                { message: REJECTED_SPACE_ERROR, line: 1, column: 3 },
                { message: REJECTED_SPACE_ERROR, line: 1, column: 11 },
                { message: REJECTED_SPACE_ERROR, line: 1, column: 13 }
            ]
        },
        {
            code: "( ( 1 + 2 ) )",
            output: "((1 + 2))",
            options: ["never", { exceptions: ["[]"] }],
            errors: [REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR, REJECTED_SPACE_ERROR]
        },
        {
            code: "( ( 1 + 2 ))",
            output: "(( 1 + 2 ))",
            options: ["always", { exceptions: ["()"] }],
            errors: [{ message: REJECTED_SPACE_ERROR, line: 1, column: 1 }]
        },
        {
            code: "( (1 + 2))",
            output: "( (1 + 2) )",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "(( 1 + 2 ) )",
            output: "(( 1 + 2 ))",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "((1 + 2) )",
            output: "( (1 + 2) )",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2 ) ) + 3",
            output: "var result = ( 1 / ( 1 + 2 )) + 3",
            options: ["always", { exceptions: ["()"] }],
            errors: [REJECTED_SPACE_ERROR]
        },
        {
            code: "var result = (1 / (1 + 2)) + 3",
            output: "var result = (1 / (1 + 2) ) + 3",
            options: ["never", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "var result = ( 1 / ( 1 + 2)) + 3",
            output: "var result = ( 1 / ( 1 + 2 )) + 3",
            options: ["always", { exceptions: ["()"] }],
            errors: [MISSING_SPACE_ERROR]
        },
        {
            code: "foo( )",
            output: "foo()",
            options: ["always", { exceptions: ["empty"] }],
            errors: [{ message: REJECTED_SPACE_ERROR, line: 1, column: 4 }]
        },
        {
            code: "foo()",
            output: "foo( )",
            options: ["never", { exceptions: ["empty"] }],
            errors: [{ message: MISSING_SPACE_ERROR, line: 1, column: 4 }]
        },
        {
            code: "foo\n(\nbar )\n",
            output: "foo\n(\nbar)\n",
            options: ["never"],
            errors: [{ message: REJECTED_SPACE_ERROR, line: 3, column: 5 }]
        },
        {
            code: "var foo = `(bar ${(1 + 2 )})`;",
            output: "var foo = `(bar ${(1 + 2)})`;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: REJECTED_SPACE_ERROR, line: 1, column: 26 }]
        },
        {
            code: "var foo = `(bar ${(1 + 2 )})`;",
            output: "var foo = `(bar ${( 1 + 2 )})`;",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: MISSING_SPACE_ERROR, line: 1, column: 19 }]
        }
    ]
});
