/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
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
eslintTester.addRuleTest("lib/rules/space-in-brackets", {

    valid: [
        { code: "obj[ foo ]", args: ["2", "always"] },
        { code: "obj[\nfoo\n]", args: ["2", "always"] },
        { code: "obj[ 'foo' ]", args: ["2", "always"] },
        { code: "obj[ 'foo' + 'bar' ]", args: ["2", "always"] },
        { code: "obj[ obj2[ foo ] ]", args: ["2", "always"] },
        { code: "obj.map(function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "always"] },
        { code: "obj[ 'map' ](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "always"] },
        { code: "obj[ 'for' + 'Each' ](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "always"] },

        { code: "var arr = [ 1, 2, 3, 4 ];", args: ["2", "always"] },
        { code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];", args: ["2", "always"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", args: ["2", "always"] },

        { code: "var obj = { foo: bar, baz: qux };", args: ["2", "always"] },
        { code: "var obj = { foo: { bar: quxx }, baz: qux };", args: ["2", "always"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", args: ["2", "always"] },


        { code: "obj[foo]", args: ["2", "never"] },
        { code: "obj['foo']", args: ["2", "never"] },
        { code: "obj['foo' + 'bar']", args: ["2", "never"] },
        { code: "obj['foo'+'bar']", args: ["2", "never"] },
        { code: "obj[obj2[foo]]", args: ["2", "never"] },
        { code: "obj.map(function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "never"] },
        { code: "obj['map'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "never"] },
        { code: "obj['for' + 'Each'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: ["2", "never"] },

        { code: "var arr = [1, 2, 3, 4];", args: ["2", "never"] },
        { code: "var arr = [[1, 2], 2, 3, 4];", args: ["2", "never"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", args: ["2", "never"] },

        { code: "var obj = {foo: bar, baz: qux};", args: ["2", "never"] },
        { code: "var obj = {foo: {bar: quxx}, baz: qux};", args: ["2", "never"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", args: ["2", "never"] }
    ],

    invalid: [
        {
            code: "var obj = {foo: bar, baz: qux};",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required after '{'",
                    type: "ObjectExpression"
                },
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {foo: bar, baz: qux };",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux };",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                },
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {foo: bar, baz: qux };",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: { bar: quxx}, baz: qux};",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                },
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {foo: {bar: quxx }, baz: qux };",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                },
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {foo: bar,\nbaz: qux\n};",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {\nfoo: bar,\nbaz: qux};",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4];",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression"
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            args: ["2", "always"],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4 ];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1], 2, 3, 4];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [[1 ], 2, 3, 4 ];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [1,\n2,\n3,\n4\n];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [\n1,\n2,\n3,\n4];",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "obj[ foo ]",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression"
                },
                {
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[foo ]",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[ foo]",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[\nfoo\n]",
            args: ["2", "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression"
                },
                {
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        }
    ]
});
