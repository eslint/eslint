/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
 * @copyright 2014 Vignesh Anand. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/array-bracket-spacing", {

    valid: [
        { code: "var foo = obj[ 1 ]", options: ["always"] },
        { code: "var foo = obj[ 'foo' ];", options: ["always"] },
        { code: "var foo = obj[ [ 1, 1 ] ];", options: ["always"] },

        // always - singleValue
        { code: "var foo = ['foo']", options: ["always", {singleValue: false}] },
        { code: "var foo = [2]", options: ["always", {singleValue: false}] },
        { code: "var foo = [[ 1, 1 ]]", options: ["always", {singleValue: false}] },
        { code: "var foo = [{ 'foo': 'bar' }]", options: ["always", {singleValue: false}] },
        { code: "var foo = [bar]", options: ["always", {singleValue: false}] },

        // always - objectsInArrays
        { code: "var foo = [{ 'bar': 'baz' }, 1,  5 ];", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, 5, { 'bar': 'baz' }];", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{ 'bar': 'baz' }], \n'quxx': 1 \n}]", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [{ 'bar': 'baz' }]", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [{ 'bar': 'baz' }, 1, { 'bar': 'baz' }];", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, 5 ];", options: ["always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, [{ 'bar': 'baz' }] ];", options: ["always", {objectsInArrays: false}] },

        // always - arraysInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, 4 ];", options: ["always", {"arraysInArrays": false}] },
        { code: "var arr = [[ 1, 2 ], [[[ 1 ]]], 3, 4 ];", options: ["always", {"arraysInArrays": false}] },

        // always - arraysInArrays, objectsInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, { 'foo': 'bar' }];", options: ["always", {"arraysInArrays": false, objectsInArrays: false}] },

        // always - arraysInArrays, objectsInArrays, singleValue
        { code: "var arr = [[ 1, 2 ], [2], 3, { 'foo': 'bar' }];", options: ["always", {"arraysInArrays": false, objectsInArrays: false, singleValue: false}] },

        // always
        { code: "obj[ foo ]", options: ["always"] },
        { code: "obj[\nfoo\n]", options: ["always"] },
        { code: "obj[ 'foo' ]", options: ["always"] },
        { code: "obj[ 'foo' + 'bar' ]", options: ["always"] },
        { code: "obj[ obj2[ foo ] ]", options: ["always"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'map' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },
        { code: "obj[ 'for' + 'Each' ](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["always"] },

        { code: "var arr = [ 1, 2, 3, 4 ];", options: ["always"] },
        { code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];", options: ["always"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", options: ["always"] },
        { code: "var foo = [];", options: ["always"] },

        // singleValue: false, objectsInArrays: true, arraysInArrays
        { code: "this.db.mappings.insert([\n { alias: 'a', url: 'http://www.amazon.de' },\n { alias: 'g', url: 'http://www.google.de' }\n], function() {});", options: ["always", {singleValue: false, objectsInArrays: true, arraysInArrays: true}] },

        // always - destructuring assignment
        { code: "var [ x, y ] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [ x,y ] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [ x, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [\nx, y ] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [\nx, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [\nx, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [\nx,,,\n] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [ ,x, ] = z", ecmaFeatures: { destructuring: true }, options: ["always"] },
        { code: "var [\nx, ...y\n] = z", ecmaFeatures: { spread: true, restParams: true, destructuring: true }, options: ["always"] },
        { code: "var [\nx, ...y ] = z", ecmaFeatures: { spread: true, restParams: true, destructuring: true }, options: ["always"] },

        // never
        { code: "obj[foo]", options: ["never"] },
        { code: "obj['foo']", options: ["never"] },
        { code: "obj['foo' + 'bar']", options: ["never"] },
        { code: "obj['foo'+'bar']", options: ["never"] },
        { code: "obj[obj2[foo]]", options: ["never"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['map'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "var arr = [1, 2, 3, 4];", options: ["never"] },
        { code: "var arr = [[1, 2], 2, 3, 4];", options: ["never"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", options: ["never"] },
        { code: "obj[\nfoo]", options: ["never"] },
        { code: "obj[foo\n]", options: ["never"] },
        { code: "var arr = [1,\n2,\n3,\n4\n];", options: ["never"] },
        { code: "var arr = [\n1,\n2,\n3,\n4];", options: ["never"] },

        // never - destructuring assignment
        { code: "var [x, y] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [x,y] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [x, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [\nx, y] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [\nx, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [\nx, y\n] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [\nx,,,\n] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [,x,] = z", ecmaFeatures: { destructuring: true }, options: ["never"] },
        { code: "var [\nx, ...y\n] = z", ecmaFeatures: { spread: true, restParams: true, destructuring: true }, options: ["never"] },
        { code: "var [\nx, ...y] = z", ecmaFeatures: { spread: true, restParams: true, destructuring: true }, options: ["never"] },

        // never - singleValue
        { code: "var foo = [ 'foo' ]", options: ["never", {singleValue: true}] },
        { code: "var foo = [ 2 ]", options: ["never", {singleValue: true}] },
        { code: "var foo = [ [1, 1] ]", options: ["never", {singleValue: true}] },
        { code: "var foo = [ {'foo': 'bar'} ]", options: ["never", {singleValue: true}] },
        { code: "var foo = [ bar ]", options: ["never", {singleValue: true}] },

        // never - objectsInArrays
        { code: "var foo = [ {'bar': 'baz'}, 1, 5];", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [1, 5, {'bar': 'baz'} ];", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [ {\n'bar': 'baz', \n'qux': [ {'bar': 'baz'} ], \n'quxx': 1 \n} ]", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [ {'bar': 'baz'} ]", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [ {'bar': 'baz'}, 1, {'bar': 'baz'} ];", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [1, {'bar': 'baz'} , 5];", options: ["never", {objectsInArrays: true}] },
        { code: "var foo = [1, {'bar': 'baz'}, [ {'bar': 'baz'} ]];", options: ["never", {objectsInArrays: true}] },

        // never - arraysInArrays
        { code: "var arr = [ [1, 2], 2, 3, 4];", options: ["never", {"arraysInArrays": true}] },

        // never - arraysInArrays, singleValue
        { code: "var arr = [ [1, 2], [ [ [ 1 ] ] ], 3, 4];", options: ["never", {"arraysInArrays": true, singleValue: true}] },

        // never - arraysInArrays, objectsInArrays
        { code: "var arr = [ [1, 2], 2, 3, {'foo': 'bar'} ];", options: ["never", {"arraysInArrays": true, objectsInArrays: true}] },

        // should not warn
        { code: "var foo = {};", options: ["never"] },
        { code: "var foo = [];", options: ["never"] },

        { code: "var foo = [{'bar':'baz'}, 1, {'bar': 'baz'}];", options: ["never"] },
        { code: "var foo = [{'bar': 'baz'}];", options: ["never"] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{'bar': 'baz'}], \n'quxx': 1 \n}]", options: ["never"] },
        { code: "var foo = [1, {'bar': 'baz'}, 5];", options: ["never"] },
        { code: "var foo = [{'bar': 'baz'}, 1,  5];", options: ["never"] },
        { code: "var foo = [1, 5, {'bar': 'baz'}];", options: ["never"] },
        { code: "var obj = {'foo': [1, 2]}", options: ["never"] }

    ],

    invalid: [
        // objectsInArrays
        {
            code: "var foo = [ { 'bar': 'baz' }, 1,  5];",
            options: ["always", {objectsInArrays: false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 36
                }
            ]
        },
        {
            code: "var foo = [1, 5, { 'bar': 'baz' } ];",
            options: ["always", {objectsInArrays: false}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 35
                }
            ]
        },
        {
            code: "var foo = [ { 'bar':'baz' }, 1, { 'bar': 'baz' } ];",
            options: ["always", {objectsInArrays: false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 50
                }
            ]
        },

        // singleValue
        {
            code: "var obj = [ 'foo' ];",
            options: ["always", {singleValue: false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 19
                }
            ]
        },
        {
            code: "var obj = ['foo' ];",
            options: ["always", {singleValue: false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 18
                }
            ]
        },
        {
            code: "var obj = ['foo'];",
            options: ["never", {singleValue: true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 17
                }
            ]
        },

        // always - arraysInArrays
        {
            code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];",
            options: ["always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 2, [ 3, 4 ] ];",
            options: ["always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 31
                }
            ]
        },
        {
            code: "var arr = [[ 1, 2 ], 2, [ 3, 4 ] ];",
            options: ["always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 34
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ]];",
            options: ["always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];",
            options: ["always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 35
                }
            ]
        },

        // always - destructuring
        {
            code: "var [x,y] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true },
            errors: [{
                message: "A space is required after '['",
                type: "ArrayPattern",
                line: 1,
                column: 5
            },
            {
                message: "A space is required before ']'",
                type: "ArrayPattern",
                line: 1,
                column: 9
            }]
        },
        {
            code: "var [x,y ] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true },
            errors: [{
                message: "A space is required after '['",
                type: "ArrayPattern",
                line: 1,
                column: 5
            }]
        },
        {
            code: "var [,,,x,,] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true },
            errors: [{
                message: "A space is required after '['",
                type: "ArrayPattern",
                line: 1,
                column: 5
            },
            {
                message: "A space is required before ']'",
                type: "ArrayPattern",
                line: 1,
                column: 12
            }]
        },
        {
            code: "var [ ,,,x,,] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true },
            errors: [{
                message: "A space is required before ']'",
                type: "ArrayPattern",
                line: 1,
                column: 13
            }]
        },
        {
            code: "var [...horse] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true, restParams: true },
            errors: [{
                message: "A space is required after '['",
                type: "ArrayPattern",
                line: 1,
                column: 5
            },
            {
                message: "A space is required before ']'",
                type: "ArrayPattern",
                line: 1,
                column: 14
            }]
        },
        {
            code: "var [...horse ] = y",
            options: ["always"],
            ecmaFeatures: { destructuring: true, restParams: true },
            errors: [{
                message: "A space is required after '['",
                type: "ArrayPattern",
                line: 1,
                column: 5
            }]
        },

        // never -  arraysInArrays
        {
            code: "var arr = [[1, 2], 2, [3, 4]];",
            options: ["never", {"arraysInArrays": true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 29
                }
            ]
        },

        // always
        {
            code: "var arr = [1, 2, 3, 4];",
            options: ["always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 22
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            options: ["always"],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            options: ["always"],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4 ];",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 24
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 23
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                }
            ]
        },
        {
            code: "var arr = [ [ 1], 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 11
                },
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression",
                    line: 1,
                    column: 13
                }
            ]
        },
        {
            code: "var arr = [[1 ], 2, 3, 4 ];",
            options: ["never"],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 15
                },
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression",
                    line: 1,
                    column: 26
                }
            ]
        }
    ]
});
