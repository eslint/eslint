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
        "[ ( 1 ) , ( 2 ) ]",
        "a = 1, b = 2;",
        "(function(a, b){})",
        "x.in = 0;",
        "(function(a,/* b, */c){})",
        "(function(a,/*b,*/c){})",
        "(function(a, /*b,*/c){})",
        "(function(a,/*b,*/ c){})",
        "(function(a, /*b,*/ c){})",
        "(function(/*a, b, */c){})",
        "(function(/*a, */b, c){})",
        "(function(a, b/*, c*/){})",
        "(function(a, b/*,c*/){})",
        "(function(a, b /*,c*/){})",
        "(function(a/*, b ,c*/){})",
        "(function(a /*, b ,c*/){})",
        "(function(a /*, b        ,c*/){})",
        "/**\n * hello\n * @param {foo} int hi\n *      set.\n * @private\n*/",
        "/**\n * hello\n * @param {foo} int hi\n *      set.\n *      set.\n * @private\n*/",
        "var a,/* b,*/c;",
        "var foo = [1,/* 2,*/3];",
        "var bar = {a: 1,/* b: 2*/c: 3};",
        "var foo = \"hello     world\";",
        "function foo() {\n    return;\n}",
        "function foo() {\n    if (foo) {\n        return;\n    }\n}",
        { code: "var foo = `hello     world`;", ecmaFeatures: { templateStrings: true }},
        "({ a:  b })",
        {
            code: "var  answer = 6 *  7;",
            args: [2, { exceptions: { "VariableDeclaration": true, "BinaryExpression": true } }]
        }
    ],

    invalid: [
        {
            code: "var a =  1",
            errors: [{
                message: "Multiple spaces found before '1'.",
                type: "Numeric"
            }]
        },
        {
            code: "var a = 1,  b = 2;",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "a <<  b",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "var arr = {'a': 1,  'b': 2};",
            errors: [{
                message: "Multiple spaces found before ''b''.",
                type: "String"
            }]
        },
        {
            code: "if (a &  b) { }",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "if ( a === 3  &&  b === 4) {}",
            errors: [{
                message: "Multiple spaces found before '&&'.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "var foo = bar === 1 ?  2:  3",
            errors: [{
                message: "Multiple spaces found before '2'.",
                type: "Numeric"
            }, {
                message: "Multiple spaces found before '3'.",
                type: "Numeric"
            }]
        },
        {
            code: "var a = [1,  2,  3,  4]",
            errors: [{
                message: "Multiple spaces found before '2'.",
                type: "Numeric"
            }, {
                message: "Multiple spaces found before '3'.",
                type: "Numeric"
            }, {
                message: "Multiple spaces found before '4'.",
                type: "Numeric"
            }]
        },
        {
            code: "var arr = [1,  2];",
            errors: [{
                message: "Multiple spaces found before '2'.",
                type: "Numeric"
            }]
        },
        {
            code: "[  , 1,  , 3,  ,  ]",
            errors: [{
                message: "Multiple spaces found before ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found before ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found before ','.",
                type: "Punctuator"
            }, {
                message: "Multiple spaces found before ']'.",
                type: "Punctuator"
            }]
        },
        {
            code: "a >>>  b",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "a = 1,  b =  2;",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }, {
                message: "Multiple spaces found before '2'.",
                type: "Numeric"
            }]
        },
        {
            code: "(function(a,  b){})",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a,  b){}",
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "var o = { fetch: function    () {} };",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "var o = { fetch: function    () {} };",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "function foo      () {}",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "if (foo)      {}",
            errors: [{
                message: "Multiple spaces found before '{'.",
                type: "Punctuator"
            }]
        },
        {
            code: "function    foo(){}",
            errors: [{
                message: "Multiple spaces found before 'foo'.",
                type: "Identifier"
            }]
        },
        {
            code: "if    (foo) {}",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "try    {} catch(ex) {}",
            errors: [{
                message: "Multiple spaces found before '{'.",
                type: "Punctuator"
            }]
        },
        {
            code: "try {} catch    (ex) {}",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "var o = { fetch: function    () {} };",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "throw  error;",
            errors: [{
                message: "Multiple spaces found before 'error'.",
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { return      bar; }",
            errors: [{
                message: "Multiple spaces found before 'bar'.",
                type: "Identifier"
            }]
        },
        {
            code: "switch   (a) {default: foo(); break;}",
            errors: [{
                message: "Multiple spaces found before '('.",
                type: "Punctuator"
            }]
        },
        {
            code: "var  answer = 6 *  7;",
            errors: [{
                message: "Multiple spaces found before 'answer'.",
                type: "Identifier"
            }, {
                message: "Multiple spaces found before '7'.",
                type: "Numeric"
            }]
        },
        {
            code: "({ a:  6  * 7 })",
            args: 2,
            errors: [{
                message: "Multiple spaces found before '*'.",
                type: "Punctuator"
            }]
        },
        {
            code: "({ a:   b })",
            args: [2, { exceptions: { "Property": false } }],
            errors: [{
                message: "Multiple spaces found before 'b'.",
                type: "Identifier"
            }]
        },
        {
            code: "var foo = { bar: function() { return 1    + 2; } };",
            errors: [{
                message: "Multiple spaces found before '+'.",
                type: "Punctuator"
            }]
        }
    ]
});
