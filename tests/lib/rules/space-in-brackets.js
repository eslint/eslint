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
        // always - singleValue
        { code: "var foo = ['foo']", args: [2, "always", {singleValue: true}] },
        { code: "var foo = [2]", args: [2, "always", {singleValue: true}] },
        { code: "var foo = [[ 1, 1 ]]", args: [2, "always", {singleValue: true}] },
        { code: "var foo = [{ 'foo': 'bar' }]", args: [2, "always", {singleValue: true}] },
        { code: "var foo = [bar]", args: [2, "always", {singleValue: true}] },
        { code: "var foo = obj[ 1 ]", args: [2, "always", {singleValue: true}] },
        { code: "var foo = obj[ 'foo' ];", args: [2, "always", {singleValue: true}] },
        { code: "var foo = obj[ [ 1, 1 ] ];", args: [2, "always", {singleValue: true}] },

        // always - objectsInArrays
        { code: "var foo = [{ 'bar': 'baz' }, 1,  5 ];", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [ 1, 5, { 'bar': 'baz' }];", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{ 'bar': 'baz' }], \n'quxx': 1 \n}]", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [{ 'bar': 'baz' }]", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [{ 'bar': 'baz' }, 1, { 'bar': 'baz' }];", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, 5 ];", args: [2, "always", {objectsInArrays: true}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, [{ 'bar': 'baz' }] ];", args: [2, "always", {objectsInArrays: true}] },

        // always - arraysInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, 4 ];", args: [2, "always", {"arraysInArrays": true}] },
        { code: "var arr = [[ 1, 2 ], [[[ 1 ]]], 3, 4 ];", args: [2, "always", {"arraysInArrays": true}] },

        // always - arraysInArrays, objectsInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, { 'foo': 'bar' }];", args: [2, "always", {"arraysInArrays": true, objectsInArrays: true}] },

        // always - arraysInArrays, objectsInArrays, singleValue
        { code: "var arr = [[ 1, 2 ], [2], 3, { 'foo': 'bar' }];", args: [2, "always", {"arraysInArrays": true, objectsInArrays: true, singleValue: true}] },

        // always
        { code: "obj[ foo ]", args: [2, "always"] },
        { code: "obj[\nfoo\n]", args: [2, "always"] },
        { code: "obj[ 'foo' ]", args: [2, "always"] },
        { code: "obj[ 'foo' + 'bar' ]", args: [2, "always"] },
        { code: "obj[ obj2[ foo ] ]", args: [2, "always"] },
        { code: "obj.map(function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "always"] },
        { code: "obj[ 'map' ](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "always"] },
        { code: "obj[ 'for' + 'Each' ](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "always"] },

        { code: "var arr = [ 1, 2, 3, 4 ];", args: [2, "always"] },
        { code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];", args: [2, "always"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", args: [2, "always"] },

        { code: "var obj = { foo: bar, baz: qux };", args: [2, "always"] },
        { code: "var obj = { foo: { bar: quxx }, baz: qux };", args: [2, "always"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", args: [2, "always"] },

        { code: "var foo = {};", args: [2, "always"] },
        { code: "var foo = [];", args: [2, "always"] },

        { code: "this.db.mappings.insert([\n { alias: 'a', url: 'http://www.amazon.de' },\n { alias: 'g', url: 'http://www.google.de' }\n], function () {});", args: [2, "always" , {singleValue: false, objectsInArrays: true, arraysInArrays: true}] },

        // never
        { code: "obj[foo]", args: [2, "never"] },
        { code: "obj['foo']", args: [2, "never"] },
        { code: "obj['foo' + 'bar']", args: [2, "never"] },
        { code: "obj['foo'+'bar']", args: [2, "never"] },
        { code: "obj[obj2[foo]]", args: [2, "never"] },
        { code: "obj.map(function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },
        { code: "obj['map'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },
        { code: "obj['for' + 'Each'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },

        { code: "var arr = [1, 2, 3, 4];", args: [2, "never"] },
        { code: "var arr = [[1, 2], 2, 3, 4];", args: [2, "never"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", args: [2, "never"] },

        { code: "var obj = {foo: bar, baz: qux};", args: [2, "never"] },
        { code: "var obj = {foo: {bar: quxx}, baz: qux};", args: [2, "never"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux\n};", args: [2, "never"] },

        { code: "var foo = {};", args: [2, "never"] },
        { code: "var foo = [];", args: [2, "never"] },

        { code: "var foo = [{'bar':'baz'}, 1, {'bar': 'baz'}];", args: [2, "never"] },
        { code: "var foo = [{'bar': 'baz'}];", args: [2, "never"] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{'bar': 'baz'}], \n'quxx': 1 \n}]", args: [2, "never"] },
        { code: "var foo = [1, {'bar': 'baz'}, 5];", args: [2, "never"] },
        { code: "var foo = [{'bar': 'baz'}, 1,  5];", args: [2, "never"] },
        { code: "var foo = [1, 5, {'bar': 'baz'}];", args: [2, "never"] },

        // propertyName: false
        { code: "var foo = obj[1]", args: [2, "always", {propertyName: false}] },
        { code: "var foo = obj['foo'];", args: [2, "always", {propertyName: false}] },
        { code: "var foo = obj[[ 1, 1 ]];", args: [2, "always", {propertyName: false}] },
        { code: "var foo = obj[ 1 ]", args: [2, "never", {propertyName: false}] },
        { code: "var foo = obj[ 'foo' ];", args: [2, "never", {propertyName: false}] },
        { code: "var foo = obj[ [1, 1] ];", args: [2, "never", {propertyName: false}] }
    ],

    invalid: [
        // objectsInArrays
        {
            code: "var foo = [ { 'bar': 'baz' }, 1,  5];",
            args: [2, "always", {objectsInArrays: true}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var foo = [1, 5, { 'bar': 'baz' } ];",
            args: [2, "always", {objectsInArrays: true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression"
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var foo = [ { 'bar':'baz' }, 1, { 'bar': 'baz' } ];",
            args: [2, "always", {objectsInArrays: true}],
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

        // singleValue
        {
            code: "var obj = [ 'foo' ];",
            args: [2, "always", {singleValue: true}],
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
            code: "var obj = ['foo' ];",
            args: [2, "always", {singleValue: true}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            args: [2, "always", {singleValue: true}],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            args: [2, "always", {singleValue: true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "MemberExpression"
                }
            ]
        },

        // arraysInArrays
        {
            code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];",
            args: [2, "always", {"arraysInArrays": true}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": true}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [[ 1, 2 ], 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": true}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ]];",
            args: [2, "always", {"arraysInArrays": true}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": true}],
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

        // always & never
        {
            code: "var obj = {foo: bar, baz: qux};",
            args: [2, "always"],
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
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux };",
            args: [2, "never"],
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
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: bar, baz: qux};",
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { foo: { bar: quxx}, baz: qux};",
            args: [2, "never"],
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
            args: [2, "never"],
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
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {\nfoo: bar,\nbaz: qux};",
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space after '{'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4];",
            args: [2, "always"],
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
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            args: [2, "always"],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4 ];",
            args: [2, "never"],
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
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1], 2, 3, 4];",
            args: [2, "never"],
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
            args: [2, "never"],
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
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [\n1,\n2,\n3,\n4];",
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "obj[ foo ]",
            args: [2, "never"],
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
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "obj[ foo]",
            args: [2, "never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[1]",
            args: [2, "always", {singleValue: true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "MemberExpression"
                },
                {
                    message: "A space is required before ']'",
                    type: "MemberExpression"
                }
            ]
        }
    ]
});
