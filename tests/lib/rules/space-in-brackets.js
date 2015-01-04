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
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-in-brackets", {

    valid: [
        { code: "var foo = obj[ 1 ]", args: [2, "always"] },
        { code: "var foo = obj[ 'foo' ];", args: [2, "always"] },
        { code: "var foo = obj[ [ 1, 1 ] ];", args: [2, "always"] },

        // always - singleValue
        { code: "var foo = ['foo']", args: [2, "always", {singleValue: false}] },
        { code: "var foo = [2]", args: [2, "always", {singleValue: false}] },
        { code: "var foo = [[ 1, 1 ]]", args: [2, "always", {singleValue: false}] },
        { code: "var foo = [{ 'foo': 'bar' }]", args: [2, "always", {singleValue: false}] },
        { code: "var foo = [bar]", args: [2, "always", {singleValue: false}] },

        // always - objectsInArrays
        { code: "var foo = [{ 'bar': 'baz' }, 1,  5 ];", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, 5, { 'bar': 'baz' }];", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{ 'bar': 'baz' }], \n'quxx': 1 \n}]", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [{ 'bar': 'baz' }]", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [{ 'bar': 'baz' }, 1, { 'bar': 'baz' }];", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, 5 ];", args: [2, "always", {objectsInArrays: false}] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, [{ 'bar': 'baz' }] ];", args: [2, "always", {objectsInArrays: false}] },

        // always - arraysInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, 4 ];", args: [2, "always", {"arraysInArrays": false}] },
        { code: "var arr = [[ 1, 2 ], [[[ 1 ]]], 3, 4 ];", args: [2, "always", {"arraysInArrays": false}] },

        // always - arraysInArrays, objectsInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, { 'foo': 'bar' }];", args: [2, "always", {"arraysInArrays": false, objectsInArrays: false}] },

        // always - arraysInArrays, objectsInArrays, singleValue
        { code: "var arr = [[ 1, 2 ], [2], 3, { 'foo': 'bar' }];", args: [2, "always", {"arraysInArrays": false, objectsInArrays: false, singleValue: false}] },

        // always - arraysInObjects
        { code: "var obj = { 'foo': [ 1, 2 ]};", args: [2, "always", {"arraysInObjects": false}] },

        // always - objectsInObjects
        { code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 }};", args: [2, "always", {"objectsInObjects": false}] },

        // always - arraysInObjects, objectsInObjects
        { code: "var obj = { 'qux': [ 1, 2 ], 'foo': { 'bar': 1, 'baz': 2 }};", args: [2, "always", {"arraysInObjects": false, "objectsInObjects": false}] },

        // always - arraysInObjects, objectsInObjects (reverse)
        { code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 }, 'qux': [ 1, 2 ]};", args: [2, "always", {"arraysInObjects": false, "objectsInObjects": false}] },

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

        { code: "this.db.mappings.insert([\n { alias: 'a', url: 'http://www.amazon.de' },\n { alias: 'g', url: 'http://www.google.de' }\n], function () {});", args: [2, "always", {singleValue: false, objectsInArrays: true, arraysInArrays: true}] },

        // never
        { code: "obj[foo]", args: [2, "never"] },
        { code: "obj['foo']", args: [2, "never"] },
        { code: "obj['foo' + 'bar']", args: [2, "never"] },
        { code: "obj['foo'+'bar']", args: [2, "never"] },
        { code: "obj[obj2[foo]]", args: [2, "never"] },
        { code: "obj.map(function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },
        { code: "obj['map'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },
        { code: "obj['for' + 'Each'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },
        { code: "obj[ obj2[ foo ] ]", args: [2, "never", {"propertyName": true}] },
        { code: "obj['for' + 'Each'](function (item) { return [\n1,\n2,\n3,\n4\n]; })", args: [2, "never"] },


        { code: "obj[\nfoo]", args: [2, "never"] },
        { code: "obj[foo\n]", args: [2, "never"] },
        { code: "var obj = {foo: bar,\nbaz: qux\n};", args: [2, "never"] },
        { code: "var obj = {\nfoo: bar,\nbaz: qux};", args: [2, "never"] },
        { code: "var arr = [1,\n2,\n3,\n4\n];", args: [2, "never"] },
        { code: "var arr = [\n1,\n2,\n3,\n4];", args: [2, "never"] },

        // never - singleValue
        { code: "var foo = [ 'foo' ]", args: [2, "never", {singleValue: true}] },
        { code: "var foo = [ 2 ]", args: [2, "never", {singleValue: true}] },
        { code: "var foo = [ [1, 1] ]", args: [2, "never", {singleValue: true}] },
        { code: "var foo = [ {'foo': 'bar'} ]", args: [2, "never", {singleValue: true}] },
        { code: "var foo = [ bar ]", args: [2, "never", {singleValue: true}] },

        // never - objectsInArrays
        { code: "var foo = [ {'bar': 'baz'}, 1, 5];", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [1, 5, {'bar': 'baz'} ];", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [ {\n'bar': 'baz', \n'qux': [ {'bar': 'baz'} ], \n'quxx': 1 \n} ]", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [ {'bar': 'baz'} ]", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [ {'bar': 'baz'}, 1, {'bar': 'baz'} ];", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [1, {'bar': 'baz'} , 5];", args: [2, "never", {objectsInArrays: true}] },
        { code: "var foo = [1, {'bar': 'baz'}, [ {'bar': 'baz'} ]];", args: [2, "never", {objectsInArrays: true}] },

        // never - arraysInArrays
        { code: "var arr = [ [1, 2], 2, 3, 4];", args: [2, "never", {"arraysInArrays": true}] },

        // never - arraysInArrays, singleValue
        { code: "var arr = [ [1, 2], [ [ [ 1 ] ] ], 3, 4];", args: [2, "never", {"arraysInArrays": true, singleValue: true}] },

        // never - arraysInArrays, objectsInArrays
        { code: "var arr = [ [1, 2], 2, 3, {'foo': 'bar'} ];", args: [2, "never", {"arraysInArrays": true, objectsInArrays: true}] },

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
        { code: "var obj = {'foo': [1, 2]}", args: [2, "never"] },

        // propertyName: false
        { code: "var foo = obj[1]", args: [2, "always", {propertyName: false}] },
        { code: "var foo = obj['foo'];", args: [2, "always", {propertyName: false}] },
        { code: "var foo = obj[[ 1, 1 ]];", args: [2, "always", {propertyName: false}] },

        { code: "var foo = obj[ 1 ]", args: [2, "never", {propertyName: true}] },
        { code: "var foo = obj[ 'foo' ];", args: [2, "never", {propertyName: true}] },
        { code: "var foo = obj[ [1, 1] ];", args: [2, "never", {propertyName: true}] }
    ],

    invalid: [
        // objectsInArrays
        {
            code: "var foo = [ { 'bar': 'baz' }, 1,  5];",
            args: [2, "always", {objectsInArrays: false}],
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
            args: [2, "always", {objectsInArrays: false}],
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
            args: [2, "always", {objectsInArrays: false}],
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
            args: [2, "always", {singleValue: false}],
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
            args: [2, "always", {singleValue: false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        // singleValue
        {
            code: "var obj = ['foo'];",
            args: [2, "never", {singleValue: true}],
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
        // propertyName
        {
            code: "var foo = obj[ 1];",
            args: [2, "always", {propertyName: false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            args: [2, "always", {propertyName: false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[ 1];",
            args: [2, "never", {propertyName: true}],
            errors: [
                {
                    message: "A space is required before ']'",
                    type: "MemberExpression"
                }
            ]
        },
        {
            code: "var foo = obj[1 ];",
            args: [2, "never", {propertyName: true}],
            errors: [
                {
                    message: "A space is required after '['",
                    type: "MemberExpression"
                }
            ]
        },

        // always - arraysInArrays
        {
            code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];",
            args: [2, "always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [[ 1, 2 ], 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space before ']'",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ]];",
            args: [2, "always", {"arraysInArrays": false}],
            errors: [
                {
                    message: "There should be no space after '['",
                    type: "ArrayExpression"
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];",
            args: [2, "always", {"arraysInArrays": false}],
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

        // never -  arraysInArrays
        {
            code: "var arr = [[1, 2], 2, [3, 4]];",
            args: [2, "never", {"arraysInArrays": true}],
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

        // always - arraysInObjects
        {
            code: "var obj = { 'foo': [ 1, 2 ] };",
            args: [2, "always", {"arraysInObjects": false}],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { 'foo': [ 1, 2 ] , 'bar': [ 'baz', 'qux' ] };",
            args: [2, "always", {"arraysInObjects": false}],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },

        // never - arraysInObjects
        {
            code: "var obj = {'foo': [1, 2]};",
            args: [2, "never", {"arraysInObjects": true}],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {'foo': [1, 2] , 'bar': ['baz', 'qux']};",
            args: [2, "never", {"arraysInObjects": true}],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },

         // always-objectsInObjects
        {
            code: "var obj = { 'foo': { 'bar': 1, 'baz': 2 } };",
            args: [2, "always", {"objectsInObjects": false}],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = { 'foo': [ 1, 2 ] , 'bar': { 'baz': 1, 'qux': 2 } };",
            args: [2, "always", {"objectsInObjects": false}],
            errors: [
                {
                    message: "There should be no space before '}'",
                    type: "ObjectExpression"
                }
            ]
        },

        // never-objectsInObjects
        {
            code: "var obj = {'foo': {'bar': 1, 'baz': 2}};",
            args: [2, "never", {"objectsInObjects": true}],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
                }
            ]
        },
        {
            code: "var obj = {'foo': [1, 2] , 'bar': {'baz': 1, 'qux': 2}};",
            args: [2, "never", {"objectsInObjects": true}],
            errors: [
                {
                    message: "A space is required before '}'",
                    type: "ObjectExpression"
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
            args: [2, "always"],
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
