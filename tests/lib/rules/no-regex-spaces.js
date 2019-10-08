/**
 * @fileoverview Tests for regex-spaces rule.
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-regex-spaces"),
    { RuleTester } = require("../../../lib/rule-tester");

const ruleTester = new RuleTester();

ruleTester.run("no-regex-spaces", rule, {
    valid: [
        "var foo = /foo/;",
        "var foo = RegExp('foo')",
        "var foo = / /;",
        "var foo = RegExp(' ')",
        "var foo = / a b c d /;",
        "var foo = /bar {3}baz/g;",
        "var foo = RegExp('bar {3}baz', 'g')",
        "var foo = new RegExp('bar {3}baz')",
        "var foo = /bar\t\t\tbaz/;",
        "var foo = RegExp('bar\t\t\tbaz');",
        "var foo = new RegExp('bar\t\t\tbaz');",
        "var RegExp = function() {}; var foo = new RegExp('bar   baz');",
        "var RegExp = function() {}; var foo = RegExp('bar   baz');",
        "var foo = /  +/;",
        "var foo = /  ?/;",
        "var foo = /  */;",
        "var foo = /  {2}/;",

        // don't report if there are no consecutive spaces in the source code
        "var foo = /bar \\ baz/;",
        "var foo = /bar\\ \\ baz/;",
        "var foo = /bar \\u0020 baz/;",
        "var foo = /bar\\u0020\\u0020baz/;",
        "var foo = new RegExp('bar \\ baz')",
        "var foo = new RegExp('bar\\ \\ baz')",
        "var foo = new RegExp('bar \\\\ baz')",
        "var foo = new RegExp('bar \\u0020 baz')",
        "var foo = new RegExp('bar\\u0020\\u0020baz')",
        "var foo = new RegExp('bar \\\\u0020 baz')",

        // don't report spaces in character classes
        "var foo = /[  ]/;",
        "var foo = /[   ]/;",
        "var foo = / [  ] /;",
        "var foo = / [  ] [  ] /;",
        "var foo = new RegExp('[  ]');",
        "var foo = new RegExp('[   ]');",
        "var foo = new RegExp(' [  ] ');",
        "var foo = RegExp(' [  ] [  ] ');",
        "var foo = new RegExp(' \\[   ');",
        "var foo = new RegExp(' \\[   \\] ');",

        // don't report invalid regex
        "var foo = new RegExp('[  ');",
        "var foo = new RegExp('{  ', 'u');"
    ],

    invalid: [
        {
            code: "var foo = /bar  baz/;",
            output: "var foo = /bar {2}baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /bar    baz/;",
            output: "var foo = /bar {4}baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = / a b  c d /;",
            output: "var foo = / a b {2}c d /;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = RegExp(' a b c d  ');",
            output: "var foo = RegExp(' a b c d {2}');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = RegExp('bar    baz');",
            output: "var foo = RegExp('bar {4}baz');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = new RegExp('bar    baz');",
            output: "var foo = new RegExp('bar {4}baz');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "NewExpression"
                }
            ]
        },
        {

            // `RegExp` is not shadowed in the scope where it's called
            code: "{ let RegExp = function() {}; } var foo = RegExp('bar    baz');",
            output: "{ let RegExp = function() {}; } var foo = RegExp('bar {4}baz');",
            parserOptions: { ecmaVersion: 6 },
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = /bar   {3}baz/;",
            output: "var foo = /bar {2} {3}baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /bar    ?baz/;",
            output: "var foo = /bar {3} ?baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {3}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = new RegExp('bar   *baz')",
            output: "var foo = new RegExp('bar {2} *baz')",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "var foo = RegExp('bar   +baz')",
            output: "var foo = RegExp('bar {2} +baz')",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = new RegExp('bar    ');",
            output: "var foo = new RegExp('bar {4}');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {4}.",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "var foo = /bar\\  baz/;",
            output: "var foo = /bar\\ {2}baz/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /[   ]  /;",
            output: "var foo = /[   ] {2}/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /  [   ] /;",
            output: "var foo = / {2}[   ] /;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = new RegExp('[   ]  ');",
            output: "var foo = new RegExp('[   ] {2}');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "var foo = RegExp('  [ ]');",
            output: "var foo = RegExp(' {2}[ ]');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = /\\[  /;",
            output: "var foo = /\\[ {2}/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /\\[  \\]/;",
            output: "var foo = /\\[ {2}\\]/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = /(?:  )/;",
            output: "var foo = /(?: {2})/;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = RegExp('^foo(?=   )');",
            output: "var foo = RegExp('^foo(?= {3})');",
            errors: [
                {
                    message: "Spaces are hard to count. Use {3}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = /\\  /",
            output: "var foo = /\\ {2}/",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },
        {
            code: "var foo = / \\  /",
            output: "var foo = / \\ {2}/",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },

        // report only the first occurence of consecutive spaces
        {
            code: "var foo = /  foo   /;",
            output: "var foo = / {2}foo   /;",
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "Literal"
                }
            ]
        },

        // don't fix strings with escape sequences
        {
            code: "var foo = new RegExp('\\\\d  ')",
            output: null,
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "var foo = RegExp('\\u0041   ')",
            output: null,
            errors: [
                {
                    message: "Spaces are hard to count. Use {3}.",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var foo = new RegExp('\\\\[  \\\\]');",
            output: null,
            errors: [
                {
                    message: "Spaces are hard to count. Use {2}.",
                    type: "NewExpression"
                }
            ]
        }
    ]
});
