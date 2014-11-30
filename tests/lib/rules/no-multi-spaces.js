/**
 * @fileoverview tests for checking multiple spaces.
 * @author Vignesh Anand aka vegetableman
 * @copyright 2014 Vignesh Anand. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-multi-spaces", {

    valid: [
        "var a = 1;",
        "var a=1;",
        "var a = 1, b = 2;",
        "var arr = [1, 2];",
        "var arr = [ (1), (2) ];",
        "var obj = {'a': 1, 'b': (2)};",
        "a, b",
        "a >>> b",
        "a ^ b",
        "(a) | (b)",
        "a & b",
        "a << b",
        "a !== b",
        "a >>>= b",
        "if (a & b) { }",
        "function foo(a,b) {}",
        "function foo(a, b) {}",
        "if ( a === 3 && b === 4) {}",
        "if ( a === 3||b === 4 ) {}",
        "if ( a <= 4) {}",
        "var foo = bar === 1 ? 2: 3",
        "[1, , 3]",
        "[1, ]",
        "[ (  1  ) , (  2  ) ]",
        "a = 1, b = 2;",
        "(function(a, b){})"
    ],

    invalid: [
        {
            code: "function foo(a,  b) {}",
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "Identifier"
            }]
        },
        {
            code: "var foo = (a,  b) => {}",
            settings: { ecmascript: 6 },
            errors: [{
                message: "Multiple spaces found around ','.",
                type: "Identifier"
            }]
        },
        {
            code: "var a =  1",
            errors: [{
                message: "Multiple spaces found after '='.",
                type: "Punctuator"
            }]
        },
        {
            code: "var a = 1,  b = 2;",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "a <<  b",
            errors: [{
                message: "Multiple spaces found after '<<'.",
                type: "Punctuator"
            }]
        },
        {
            code: "var arr = {'a': 1,  'b': 2};",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "if (a &  b) { }",
            errors: [{
                message: "Multiple spaces found after '&'.",
                type: "Punctuator"
            }]
        },
        {
            code: "if ( a === 3  &&  b === 4) {}",
            errors: [{
                message: "Multiple spaces found before '&&'.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after '&&'.",
                type: "Punctuator"
            }]
        },
        {
            code: "var foo = bar === 1 ?  2:  3",
            errors: [{
                message: "Multiple spaces found after '?'.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ':'.",
                type: "Punctuator"
            }]
        },
        {
            code: "var a = [1,  2,  3,  4]",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "var arr = [1,  2];",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "[  , 1,  , 3,  ,  ]",
            errors: [{
                message: "Multiple spaces found before ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "a >>>  b",
            errors: [{
                message: "Multiple spaces found after '>>>'.",
                type: "Punctuator"
            }]
        },
        {
            code: "a = 1,  b =  2;",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found after '='.",
                type: "Punctuator"
            }]
        },
        {
            code: "(function(a,  b){})",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        },
        {
            code: "function foo(a,  b){}",
            errors: [{
                message: "Multiple spaces found after ','.",
                type: "Punctuator"
            }]
        }
    ]
});
