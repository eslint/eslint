/**
 * @fileoverview tests for checking multiple spaces.
 * @author Vignesh Anand aka vegetableman
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multi-spaces"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-multi-spaces", rule, {

    valid: [
        "var a = 1;",
        "var a=1;",
        "var a = 1, b = 2;",
        "var arr = [1, 2];",
        "var arr = [ (1), (2) ];",
        "var obj = {'a': 1, 'b': (2)};",
        "\t\tvar x = 5,\n\t\t    y = 2;",
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
        { code: "var foo = `hello     world`;", parserOptions: { ecmaVersion: 6 } },
        "({ a:  b })",
        {
            code: "var  answer = 6 *  7;",
            options: [{ exceptions: { VariableDeclaration: true, BinaryExpression: true } }]
        },

        // https://github.com/eslint/eslint/issues/7693
        "var x = 5; // comment",
        "var x = 5; /* multiline\n * comment\n */",
        "var x = 5;\n  // comment",
        "var x = 5;  \n// comment",
        "var x = 5;\n  /* multiline\n * comment\n */",
        "var x = 5;  \n/* multiline\n * comment\n */",
        { code: "var x = 5; // comment", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5; /* multiline\n * comment\n */", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5;\n  // comment", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5;  \n// comment", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5;\n  /* multiline\n * comment\n */", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5;  \n/* multiline\n * comment\n */", options: [{ ignoreEOLComments: false }] },
        { code: "var x = 5;  // comment", options: [{ ignoreEOLComments: true }] },
        { code: "var x = 5;  /* multiline\n * comment\n */", options: [{ ignoreEOLComments: true }] },
        { code: "var x = 5;\n  // comment", options: [{ ignoreEOLComments: true }] },
        { code: "var x = 5;  \n// comment", options: [{ ignoreEOLComments: true }] },
        { code: "var x = 5;\n  /* multiline\n * comment\n */", options: [{ ignoreEOLComments: true }] },
        { code: "var x = 5;  \n/* multiline\n * comment\n */", options: [{ ignoreEOLComments: true }] },

        "foo\n\f  bar",
        "foo\n\u2003  bar",
        "foo\n \f  bar",

        // https://github.com/eslint/eslint/issues/9001
        "a".repeat(2e5),

        "foo\t\t+bar"
    ],

    invalid: [
        {
            code: "function foo(a,  b) {}",
            output: "function foo(a, b) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier",
                column: 16,
                endColumn: 18
            }]
        },
        {
            code: "var foo = (a,  b) => {}",
            output: "var foo = (a, b) => {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier",
                column: 14,
                endColumn: 16
            }]
        },
        {
            code: "var a =  1",
            output: "var a = 1",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "1" },
                type: "Numeric",
                column: 8,
                endColumn: 10
            }]
        },
        {
            code: "var a = 1,  b = 2;",
            output: "var a = 1, b = 2;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "a <<  b",
            output: "a << b",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "var arr = {'a': 1,  'b': 2};",
            output: "var arr = {'a': 1, 'b': 2};",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "'b'" },
                type: "String",
                column: 19,
                endColumn: 21
            }]
        },
        {
            code: "if (a &  b) { }",
            output: "if (a & b) { }",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "if ( a === 3  &&  b === 4) {}",
            output: "if ( a === 3 && b === 4) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "&&" },
                type: "Punctuator"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "var foo = bar === 1 ?  2:  3",
            output: "var foo = bar === 1 ? 2: 3",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "2" },
                type: "Numeric"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "3" },
                type: "Numeric"
            }]
        },
        {
            code: "var a = [1,  2,  3,  4]",
            output: "var a = [1, 2, 3, 4]",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "2" },
                type: "Numeric"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "3" },
                type: "Numeric"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "4" },
                type: "Numeric"
            }]
        },
        {
            code: "var arr = [1,  2];",
            output: "var arr = [1, 2];",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "2" },
                type: "Numeric"
            }]
        },
        {
            code: "[  , 1,  , 3,  ,  ]",
            output: "[ , 1, , 3, , ]",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "," },
                type: "Punctuator",
                column: 2,
                endColumn: 4
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "," },
                type: "Punctuator",
                column: 8,
                endColumn: 10
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "," },
                type: "Punctuator",
                column: 14,
                endColumn: 16
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "]" },
                type: "Punctuator",
                column: 17,
                endColumn: 19
            }]
        },
        {
            code: "a >>>  b",
            output: "a >>> b",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "a = 1,  b =  2;",
            output: "a = 1, b = 2;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "2" },
                type: "Numeric"
            }]
        },
        {
            code: "(function(a,  b){})",
            output: "(function(a, b){})",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a,  b){}",
            output: "function foo(a, b){}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "var o = { fetch: function    () {} };",
            output: "var o = { fetch: function () {} };",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "(" },
                type: "Punctuator"
            }]
        },
        {
            code: "function foo      () {}",
            output: "function foo () {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "(" },
                type: "Punctuator",
                column: 13,
                endColumn: 19
            }]
        },
        {
            code: "if (foo)      {}",
            output: "if (foo) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "{" },
                type: "Punctuator"
            }]
        },
        {
            code: "function    foo(){}",
            output: "function foo(){}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "if    (foo) {}",
            output: "if (foo) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "(" },
                type: "Punctuator"
            }]
        },
        {
            code: "try    {} catch(ex) {}",
            output: "try {} catch(ex) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "{" },
                type: "Punctuator"
            }]
        },
        {
            code: "try {} catch    (ex) {}",
            output: "try {} catch (ex) {}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "(" },
                type: "Punctuator"
            }]
        },
        {
            code: "throw  error;",
            output: "throw error;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "error" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { return      bar; }",
            output: "function foo() { return bar; }",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "bar" },
                type: "Identifier"
            }]
        },
        {
            code: "switch   (a) {default: foo(); break;}",
            output: "switch (a) {default: foo(); break;}",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "(" },
                type: "Punctuator"
            }]
        },
        {
            code: "var  answer = 6 *  7;",
            output: "var answer = 6 * 7;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "answer" },
                type: "Identifier"
            }, {
                messageId: "multipleSpaces",
                data: { displayValue: "7" },
                type: "Numeric"
            }]
        },
        {
            code: "({ a:  6  * 7 })",
            output: "({ a:  6 * 7 })",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "*" },
                type: "Punctuator"
            }]
        },
        {
            code: "({ a:   b })",
            output: "({ a: b })",
            options: [{ exceptions: { Property: false } }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "b" },
                type: "Identifier"
            }]
        },
        {
            code: "var foo = { bar: function() { return 1    + 2; } };",
            output: "var foo = { bar: function() { return 1 + 2; } };",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "+" },
                type: "Punctuator"
            }]
        },
        {
            code: "\t\tvar x = 5,\n\t\t    y =  2;",
            output: "\t\tvar x = 5,\n\t\t    y = 2;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "2" },
                type: "Numeric"
            }]
        },
        {
            code: "var x =\t  5;",
            output: "var x = 5;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "5" },
                type: "Numeric",
                column: 8,
                endColumn: 11
            }]
        },

        // https://github.com/eslint/eslint/issues/7693
        {
            code: "var x =  /* comment */ 5;",
            output: "var x = /* comment */ 5;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* comment */" },
                type: "Block"
            }]
        },
        {
            code: "var x = /* comment */  5;",
            output: "var x = /* comment */ 5;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "5" },
                type: "Numeric"
            }]
        },
        {
            code: "var x = 5;  // comment",
            output: "var x = 5; // comment",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// comment" },
                type: "Line",
                column: 11,
                endColumn: 13
            }]
        },
        {
            code: "var x = 5;  // comment\nvar y = 6;",
            output: "var x = 5; // comment\nvar y = 6;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// comment" },
                type: "Line"
            }]
        },
        {
            code: "var x = 5;  /* multiline\n * comment\n */",
            output: "var x = 5; /* multiline\n * comment\n */",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* multiline...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  /* multiline\n * comment\n */\nvar y = 6;",
            output: "var x = 5; /* multiline\n * comment\n */\nvar y = 6;",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* multiline...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  // this is a long comment",
            output: "var x = 5; // this is a long comment",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// this is a l..." },
                type: "Line"
            }]
        },
        {
            code: "var x =  /* comment */ 5;",
            output: "var x = /* comment */ 5;",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* comment */" },
                type: "Block"
            }]
        },
        {
            code: "var x = /* comment */  5;",
            output: "var x = /* comment */ 5;",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "5" },
                type: "Numeric"
            }]
        },
        {
            code: "var x = 5;  // comment",
            output: "var x = 5; // comment",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// comment" },
                type: "Line"
            }]
        },
        {
            code: "var x = 5;  // comment\nvar y = 6;",
            output: "var x = 5; // comment\nvar y = 6;",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// comment" },
                type: "Line"
            }]
        },
        {
            code: "var x = 5;  /* multiline\n * comment\n */",
            output: "var x = 5; /* multiline\n * comment\n */",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* multiline...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  /* multiline\n * comment\n */\nvar y = 6;",
            output: "var x = 5; /* multiline\n * comment\n */\nvar y = 6;",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* multiline...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  // this is a long comment",
            output: "var x = 5; // this is a long comment",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "// this is a l..." },
                type: "Line"
            }]
        },
        {
            code: "var x =  /* comment */ 5;  // EOL comment",
            output: "var x = /* comment */ 5;  // EOL comment",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* comment */" },
                type: "Block"
            }]
        },
        {
            code: "var x =  /* comment */ 5;  // EOL comment\nvar y = 6;",
            output: "var x = /* comment */ 5;  // EOL comment\nvar y = 6;",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/* comment */" },
                type: "Block"
            }]
        },
        {
            code: "var x = /* comment */  5;  /* EOL comment */",
            output: "var x = /* comment */ 5;  /* EOL comment */",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "5" },
                type: "Numeric"
            }]
        },
        {
            code: "var x = /* comment */  5;  /* EOL comment */\nvar y = 6;",
            output: "var x = /* comment */ 5;  /* EOL comment */\nvar y = 6;",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "5" },
                type: "Numeric"
            }]
        },
        {
            code: "var x =  /*comment without spaces*/ 5;",
            output: "var x = /*comment without spaces*/ 5;",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/*comment with...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  //comment without spaces",
            output: "var x = 5; //comment without spaces",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "//comment with..." },
                type: "Line"
            }]
        },
        {
            code: "var x = 5;  /*comment without spaces*/",
            output: "var x = 5; /*comment without spaces*/",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/*comment with...*/" },
                type: "Block"
            }]
        },
        {
            code: "var x = 5;  /*comment\n without spaces*/",
            output: "var x = 5; /*comment\n without spaces*/",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "/*comment...*/" },
                type: "Block",
                column: 11,
                endColumn: 13
            }]
        },
        {
            code: "foo\n\f  bar  + baz",
            output: "foo\n\f  bar + baz",
            errors: [{
                messageId: "multipleSpaces",
                data: { displayValue: "+" },
                type: "Punctuator"
            }]
        }
    ]
});
