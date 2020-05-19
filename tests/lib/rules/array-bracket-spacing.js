/**
 * @fileoverview Disallows or enforces spaces inside of brackets.
 * @author Ian Christian Myers
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("path"),
    rule = require("../../../lib/rules/array-bracket-spacing"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Gets the path to the specified parser.
 * @param {string} name The parser name to get.
 * @returns {string} The path to the specified parser.
 */
function parser(name) {
    return path.resolve(__dirname, `../../fixtures/parsers/array-bracket-spacing/${name}.js`);
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("array-bracket-spacing", rule, {

    valid: [
        { code: "var foo = obj[ 1 ]", options: ["always"] },
        { code: "var foo = obj[ 'foo' ];", options: ["always"] },
        { code: "var foo = obj[ [ 1, 1 ] ];", options: ["always"] },

        // always - singleValue
        { code: "var foo = ['foo']", options: ["always", { singleValue: false }] },
        { code: "var foo = [2]", options: ["always", { singleValue: false }] },
        { code: "var foo = [[ 1, 1 ]]", options: ["always", { singleValue: false }] },
        { code: "var foo = [{ 'foo': 'bar' }]", options: ["always", { singleValue: false }] },
        { code: "var foo = [bar]", options: ["always", { singleValue: false }] },

        // always - objectsInArrays
        { code: "var foo = [{ 'bar': 'baz' }, 1,  5 ];", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [ 1, 5, { 'bar': 'baz' }];", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{ 'bar': 'baz' }], \n'quxx': 1 \n}]", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [{ 'bar': 'baz' }]", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [{ 'bar': 'baz' }, 1, { 'bar': 'baz' }];", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, 5 ];", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [ 1, { 'bar': 'baz' }, [{ 'bar': 'baz' }] ];", options: ["always", { objectsInArrays: false }] },
        { code: "var foo = [ function(){} ];", options: ["always", { objectsInArrays: false }] },

        // always - arraysInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, 4 ];", options: ["always", { arraysInArrays: false }] },
        { code: "var arr = [[ 1, 2 ], [[[ 1 ]]], 3, 4 ];", options: ["always", { arraysInArrays: false }] },
        { code: "var foo = [ arr[i], arr[j] ];", options: ["always", { arraysInArrays: false }] },

        // always - arraysInArrays, objectsInArrays
        { code: "var arr = [[ 1, 2 ], 2, 3, { 'foo': 'bar' }];", options: ["always", { arraysInArrays: false, objectsInArrays: false }] },

        // always - arraysInArrays, objectsInArrays, singleValue
        { code: "var arr = [[ 1, 2 ], [2], 3, { 'foo': 'bar' }];", options: ["always", { arraysInArrays: false, objectsInArrays: false, singleValue: false }] },

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
        { code: "this.db.mappings.insert([\n { alias: 'a', url: 'http://www.amazon.de' },\n { alias: 'g', url: 'http://www.google.de' }\n], function() {});", options: ["always", { singleValue: false, objectsInArrays: true, arraysInArrays: true }] },

        // always - destructuring assignment
        { code: "var [ x, y ] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ x,y ] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ x, y\n] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, y ] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, y\n] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx,,,\n] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ ,x, ] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, ...y\n] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, ...y ] = z", options: ["always"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [[ x, y ], z ] = arr;", options: ["always", { arraysInArrays: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ x, [ y, z ]] = arr;", options: ["always", { arraysInArrays: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "[{ x, y }, z ] = arr;", options: ["always", { objectsInArrays: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "[ x, { y, z }] = arr;", options: ["always", { objectsInArrays: false }], parserOptions: { ecmaVersion: 6 } },

        // never
        { code: "obj[foo]", options: ["never"] },
        { code: "obj['foo']", options: ["never"] },
        { code: "obj['foo' + 'bar']", options: ["never"] },
        { code: "obj['foo'+'bar']", options: ["never"] },
        { code: "obj[obj2[foo]]", options: ["never"] },
        { code: "obj.map(function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['map'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "obj['for' + 'Each'](function(item) { return [\n1,\n2,\n3,\n4\n]; })", options: ["never"] },
        { code: "var arr = [1, 2, 3, 4];", options: ["never"] },
        { code: "var arr = [[1, 2], 2, 3, 4];", options: ["never"] },
        { code: "var arr = [\n1, 2, 3, 4\n];", options: ["never"] },
        { code: "obj[\nfoo]", options: ["never"] },
        { code: "obj[foo\n]", options: ["never"] },
        { code: "var arr = [1,\n2,\n3,\n4\n];", options: ["never"] },
        { code: "var arr = [\n1,\n2,\n3,\n4];", options: ["never"] },

        // never - destructuring assignment
        { code: "var [x, y] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [x,y] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [x, y\n] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, y] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, y\n] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx,,,\n] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [,x,] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, ...y\n] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [\nx, ...y] = z", options: ["never"], parserOptions: { ecmaVersion: 6 } },
        { code: "var [ [x, y], z] = arr;", options: ["never", { arraysInArrays: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "var [x, [y, z] ] = arr;", options: ["never", { arraysInArrays: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "[ { x, y }, z] = arr;", options: ["never", { objectsInArrays: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "[x, { y, z } ] = arr;", options: ["never", { objectsInArrays: true }], parserOptions: { ecmaVersion: 6 } },

        // never - singleValue
        { code: "var foo = [ 'foo' ]", options: ["never", { singleValue: true }] },
        { code: "var foo = [ 2 ]", options: ["never", { singleValue: true }] },
        { code: "var foo = [ [1, 1] ]", options: ["never", { singleValue: true }] },
        { code: "var foo = [ {'foo': 'bar'} ]", options: ["never", { singleValue: true }] },
        { code: "var foo = [ bar ]", options: ["never", { singleValue: true }] },

        // never - objectsInArrays
        { code: "var foo = [ {'bar': 'baz'}, 1, 5];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [1, 5, {'bar': 'baz'} ];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [ {\n'bar': 'baz', \n'qux': [ {'bar': 'baz'} ], \n'quxx': 1 \n} ]", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [ {'bar': 'baz'} ]", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [ {'bar': 'baz'}, 1, {'bar': 'baz'} ];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [1, {'bar': 'baz'} , 5];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [1, {'bar': 'baz'}, [ {'bar': 'baz'} ]];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [function(){}];", options: ["never", { objectsInArrays: true }] },
        { code: "var foo = [];", options: ["never", { objectsInArrays: true }] },

        // never - arraysInArrays
        { code: "var arr = [ [1, 2], 2, 3, 4];", options: ["never", { arraysInArrays: true }] },
        { code: "var foo = [arr[i], arr[j]];", options: ["never", { arraysInArrays: true }] },
        { code: "var foo = [];", options: ["never", { arraysInArrays: true }] },

        // never - arraysInArrays, singleValue
        { code: "var arr = [ [1, 2], [ [ [ 1 ] ] ], 3, 4];", options: ["never", { arraysInArrays: true, singleValue: true }] },

        // never - arraysInArrays, objectsInArrays
        { code: "var arr = [ [1, 2], 2, 3, {'foo': 'bar'} ];", options: ["never", { arraysInArrays: true, objectsInArrays: true }] },

        // should not warn
        { code: "var foo = {};", options: ["never"] },
        { code: "var foo = [];", options: ["never"] },

        { code: "var foo = [{'bar':'baz'}, 1, {'bar': 'baz'}];", options: ["never"] },
        { code: "var foo = [{'bar': 'baz'}];", options: ["never"] },
        { code: "var foo = [{\n'bar': 'baz', \n'qux': [{'bar': 'baz'}], \n'quxx': 1 \n}]", options: ["never"] },
        { code: "var foo = [1, {'bar': 'baz'}, 5];", options: ["never"] },
        { code: "var foo = [{'bar': 'baz'}, 1,  5];", options: ["never"] },
        { code: "var foo = [1, 5, {'bar': 'baz'}];", options: ["never"] },
        { code: "var obj = {'foo': [1, 2]}", options: ["never"] },

        // destructuring with type annotation
        { code: "([ a, b ]: Array<any>) => {}", options: ["always"], parser: parser("flow-destructuring-1"), parserOptions: { ecmaVersion: 6 } },
        { code: "([a, b]: Array< any >) => {}", options: ["never"], parser: parser("flow-destructuring-2"), parserOptions: { ecmaVersion: 6 } },

        { code: "var foo = [ \n/**comment here *//**comment here */a,b]", options: ["never"] },
        { code: "var obj = [ /*comment \nhere*/'foo' ];", options: ["never", { singleValue: true }] },
        { code: "var foo = [/*comment\n here*/{ 'bar': 'baz' }];", options: ["always", { objectsInArrays: false }] },
        { code: "var arr = [ /*comment \nfirst*/  1, 2  /*comment \nlast*/ ];", options: ["never"] }
    ],

    invalid: [
        {
            code: "var foo = [a,b/**comment here *//**comment here */ ]",
            output: "var foo = [a,b/**comment here *//**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 15,
                    endLine: 1,
                    endColumn: 52
                }
            ]
        },
        {
            code: "var foo = [a,/**comment here *//**comment here */b ]",
            output: "var foo = [a,/**comment here *//**comment here */b]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 51,
                    endLine: 1,
                    endColumn: 52
                }
            ]
        },
        {
            code: "var foo = [ /**comment here *//**comment here */a,b]",
            output: "var foo = [/**comment here *//**comment here */a,b]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 49
                }
            ]
        },
        {
            code: "var foo = [ a/**comment here *//**comment here */,b]",
            output: "var foo = [a/**comment here *//**comment here */,b]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var foo = [ /**comment here */a,b/**comment here */ ]",
            output: "var foo = [/**comment here */a,b/**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 31
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 34,
                    endLine: 1,
                    endColumn: 53
                }
            ]
        },
        {
            code: "var foo = [ /**comment here */ ]",
            output: "var foo = [/**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 32
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 32
                }

            ]
        },
        {
            code: "var foo = [     /**comment here */       ]",
            output: "var foo = [/**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 42
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 42
                }

            ]
        },
        {
            code: "var foo = [     /**comment here *//**comment here */       ]",
            output: "var foo = [/**comment here *//**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 60
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 60
                }

            ]
        },
        {
            code: "var foo = [     /**comment here */,/**comment here */       ]",
            output: "var foo = [/**comment here */,/**comment here */]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 35
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 36,
                    endLine: 1,
                    endColumn: 61
                }

            ]
        },
        {
            code: "var foo = [   ]",
            output: "var foo = []",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "var foo = [ ,  ]",
            output: "var foo = [,]",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 16
                }
            ]
        },
        {
            code: "var foo = [ ]",
            output: "var foo = []",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },

        // objectsInArrays
        {
            code: "var foo = [ { 'bar': 'baz' }, 1,  5];",
            output: "var foo = [{ 'bar': 'baz' }, 1,  5 ];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 36,
                    endLine: 1,
                    endColumn: 37
                }
            ]
        },
        {
            code: "var foo = [1, 5, { 'bar': 'baz' } ];",
            output: "var foo = [ 1, 5, { 'bar': 'baz' }];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 34,
                    endLine: 1,
                    endColumn: 35
                }
            ]
        },
        {
            code: "var foo = [ { 'bar':'baz' }, 1, { 'bar': 'baz' } ];",
            output: "var foo = [{ 'bar':'baz' }, 1, { 'bar': 'baz' }];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 49,
                    endLine: 1,
                    endColumn: 50
                }
            ]
        },
        {
            code: "var foo = [/*comment here*/1, 5, { 'bar': 'baz' } ];",
            output: "var foo = [ /*comment here*/1, 5, { 'bar': 'baz' }];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 50,
                    endLine: 1,
                    endColumn: 51
                }
            ]
        },
        {
            code: "var foo = [/*comment here*/1, 5, { 'bar': 'baz' } /*comment here*/];",
            output: "var foo = [ /*comment here*/1, 5, { 'bar': 'baz' }/*comment here*/];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 50,
                    endLine: 1,
                    endColumn: 51
                }
            ]
        },
        {
            code: "var foo = [/*comment here*/{ 'bar': 'baz' }/*comment here*/];",
            output: "var foo = [ /*comment here*/{ 'bar': 'baz' }/*comment here*/ ];",
            options: ["never", { objectsInArrays: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 60,
                    endLine: 1,
                    endColumn: 61
                }
            ]
        },
        {
            code: "var foo = [  /*comment here*/{ 'bar': 'baz' }/*comment here*/ ];",
            output: "var foo = [/*comment here*/{ 'bar': 'baz' }/*comment here*/];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 30
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 46,
                    endLine: 1,
                    endColumn: 63
                }
            ]
        },
        {
            code: "var foo = [/*comment here*/ { 'bar': 'baz' } /*last comment here*/];",
            output: "var foo = [/*comment here*/{ 'bar': 'baz' }/*last comment here*/];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 28,
                    endLine: 1,
                    endColumn: 29
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "last comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 45,
                    endLine: 1,
                    endColumn: 46
                }
            ]
        },
        {
            code: "var foo = [ /*comment here*/ { 'bar': 'baz' } /*last comment here*/ ];",
            output: "var foo = [/*comment here*/{ 'bar': 'baz' }/*last comment here*/];",
            options: ["always", { objectsInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 30
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 29,
                    endLine: 1,
                    endColumn: 30
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 46,
                    endLine: 1,
                    endColumn: 69
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "last comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 46,
                    endLine: 1,
                    endColumn: 47
                }
            ]
        },


        // singleValue
        {
            code: "var obj = [ 'foo' ];",
            output: "var obj = ['foo'];",
            options: ["always", { singleValue: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                }
            ]
        },
        {
            code: "var obj = ['foo' ];",
            output: "var obj = ['foo'];",
            options: ["always", { singleValue: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                }
            ]
        },
        {
            code: "var obj = ['foo'];",
            output: "var obj = [ 'foo' ];",
            options: ["never", { singleValue: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 17,
                    endLine: 1,
                    endColumn: 18
                }
            ]
        },
        {
            code: "var obj = [/*comment here*/'foo'];",
            output: "var obj = [ /*comment here*/'foo' ];",
            options: ["never", { singleValue: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 33,
                    endLine: 1,
                    endColumn: 34
                }
            ]
        },
        {
            code: "var obj = [/*comment here*/'foo'/*comment here*/ ];",
            output: "var obj = [ /*comment here*/'foo'/*comment here*/ ];",
            options: ["never", { singleValue: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                }
            ]
        },
        {
            code: "var [ /*Comment here*/...horse/*Comment here*/ ] = y",
            output: "var [/*Comment here*/...horse/*Comment here*/] = y",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 23
            }, {
                messageId: "unexpectedSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 31,
                endLine: 1,
                endColumn: 48
            }]
        },
        {
            code: "var [//\na,b ] = x;",
            output: "var [//\na,b] = x;",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 2,
                column: 4,
                endLine: 2,
                endColumn: 5
            }]
        },

        // always - arraysInArrays
        {
            code: "var arr = [ [ 1, 2 ], 2, 3, 4 ];",
            output: "var arr = [[ 1, 2 ], 2, 3, 4 ];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 2, [ 3, 4 ] ];",
            output: "var arr = [ 1, 2, 2, [ 3, 4 ]];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 30,
                    endLine: 1,
                    endColumn: 31
                }
            ]
        },
        {
            code: "var arr = [[ 1, 2 ], 2, [ 3, 4 ] ];",
            output: "var arr = [[ 1, 2 ], 2, [ 3, 4 ]];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 33,
                    endLine: 1,
                    endColumn: 34
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ]];",
            output: "var arr = [[ 1, 2 ], 2, [ 3, 4 ]];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];",
            output: "var arr = [[ 1, 2 ], 2, [ 3, 4 ]];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 34,
                    endLine: 1,
                    endColumn: 35
                }
            ]
        },
        {
            code: "var arr = [ /*Comment here*/[/*Comment here*/ 1, 2/*Comment here*/ /*Comment here*/], 2, [ 3, 4 ]/*Comment here*/ ];",
            output: "var arr = [/*Comment here*/[/*Comment here*/ 1, 2/*Comment here*/ /*Comment here*/], 2, [ 3, 4 ]/*Comment here*/];",
            options: ["always", { arraysInArrays: false }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 29
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 98,
                    endLine: 1,
                    endColumn: 115
                }
            ]
        },

        // always - destructuring
        {
            code: "var [x,y] = y",
            output: "var [ x,y ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            },
            {
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "var [x,y ] = y",
            output: "var [ x,y ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "var [/*comment here*/x,y ] = y",
            output: "var [ /*comment here*/x,y ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "var [,,,x,,] = y",
            output: "var [ ,,,x,, ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            },
            {
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 12,
                endLine: 1,
                endColumn: 13
            }]
        },
        {
            code: "var [,,/*comment here*/,x,,/*comment here*/] = y",
            output: "var [ ,,/*comment here*/,x,,/*comment here*/ ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            },
            {
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 44,
                endLine: 1,
                endColumn: 45
            }]
        },
        {
            code: "var [ ,,,x,,] = y",
            output: "var [ ,,,x,, ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "var [...horse] = y",
            output: "var [ ...horse ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            },
            {
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        },
        {
            code: "var [/*comment here*/...horse/*comment here*/] = y",
            output: "var [ /*comment here*/...horse/*comment here*/ ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            },
            {
                messageId: "missingSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 46,
                endLine: 1,
                endColumn: 47
            }]
        },
        {
            code: "var [...horse ] = y",
            output: "var [ ...horse ] = y",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 5,
                endLine: 1,
                endColumn: 6
            }]
        },
        {
            code: "var [ [ x, y ], z ] = arr;",
            output: "var [[ x, y ], z ] = arr;",
            options: ["always", { arraysInArrays: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "[ { x, y }, z ] = arr;",
            output: "[{ x, y }, z ] = arr;",
            options: ["always", { objectsInArrays: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedSpaceAfter",
                data: {
                    tokenValue: "["
                },
                type: "ArrayPattern",
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 3
            }]
        },
        {
            code: "[ x, { y, z } ] = arr;",
            output: "[ x, { y, z }] = arr;",
            options: ["always", { objectsInArrays: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "unexpectedSpaceBefore",
                data: {
                    tokenValue: "]"
                },
                type: "ArrayPattern",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        },

        // never -  arraysInArrays
        {
            code: "var arr = [[1, 2], 2, [3, 4]];",
            output: "var arr = [ [1, 2], 2, [3, 4] ];",
            options: ["never", { arraysInArrays: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 29,
                    endLine: 1,
                    endColumn: 30
                }
            ]
        },
        {
            code: "var arr = [ ];",
            output: "var arr = [];",
            options: ["never", { arraysInArrays: true }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var arr = [ /*comment here*/];",
            output: "var arr = [/*comment here*/];",
            options: ["never", { arraysInArrays: true }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 29
                }
            ]
        },
        {
            code: "var arr = [/*commen here*/[1, 2/*commen here*/], 2,/*commen here*/ [3, 4]/*commen here*/];",
            output: "var arr = [ /*commen here*/[1, 2/*commen here*/], 2,/*commen here*/ [3, 4]/*commen here*/ ];",
            options: ["never", { arraysInArrays: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 89,
                    endLine: 1,
                    endColumn: 90
                }
            ]
        },
        {
            code: "var arr = [/*commen here*/[1, 2 /*comment here*/ ], 2,/*commen here*/ [3, 4]/*commen here*/];",
            output: "var arr = [ /*commen here*/[1, 2/*comment here*/], 2,/*commen here*/ [3, 4]/*commen here*/ ];",
            options: ["never", { arraysInArrays: true }],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 32,
                    endLine: 1,
                    endColumn: 50
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "comment here"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 32,
                    endLine: 1,
                    endColumn: 33
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 92,
                    endLine: 1,
                    endColumn: 93
                }
            ]
        },

        // never -  objectsInArrays
        {
            code: "var arr = [ ];",
            output: "var arr = [];",
            options: ["never", { objectsInArrays: true }],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },

        // always
        {
            code: "var arr = [1, 2, 3, 4];",
            output: "var arr = [ 1, 2, 3, 4 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 23
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            output: "var arr = [ 1, 2, 3, 4 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 11,
                    endLine: 1,
                    endColumn: 12
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            output: "var arr = [ 1, 2, 3, 4 ];",
            options: ["always"],
            errors: [
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },

        // never
        {
            code: "var arr = [ 1, 2, 3, 4 ];",
            output: "var arr = [1, 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 24
                }
            ]
        },
        {
            code: "var arr = [1, 2, 3, 4 ];",
            output: "var arr = [1, 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 22,
                    endLine: 1,
                    endColumn: 23
                }
            ]
        },
        {
            code: "var arr = [ 1, 2, 3, 4];",
            output: "var arr = [1, 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                }
            ]
        },
        {
            code: "var arr = [ [ 1], 2, 3, 4];",
            output: "var arr = [[1], 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                }
            ]
        },
        {
            code: "var arr = [[1 ], 2, 3, 4 ];",
            output: "var arr = [[1], 2, 3, 4];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 15
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 25,
                    endLine: 1,
                    endColumn: 26
                }
            ]
        },

        // destructuring with type annotation
        {
            code: "([ a, b ]: Array<any>) => {}",
            output: "([a, b]: Array<any>) => {}",
            options: ["never"],
            parser: parser("flow-destructuring-1"),
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 3,
                    endLine: 1,
                    endColumn: 4
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 8,
                    endLine: 1,
                    endColumn: 9
                }
            ]
        },
        {
            code: "([a, b]: Array< any >) => {}",
            output: "([ a, b ]: Array< any >) => {}",
            options: ["always"],
            parser: parser("flow-destructuring-2"),
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "missingSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 2,
                    endLine: 1,
                    endColumn: 3
                },
                {
                    messageId: "missingSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 7,
                    endLine: 1,
                    endColumn: 8
                }
            ]
        },

        // multiple spaces
        {
            code: "var arr = [  1, 2   ];",
            output: "var arr = [1, 2];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 21
                }
            ]
        },
        {
            code: "function f( [   a, b  ] ) {}",
            output: "function f( [a, b] ) {}",
            options: ["never"],
            parserOptions: {
                ecmaVersion: 6
            },
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 14,
                    endLine: 1,
                    endColumn: 17
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayPattern",
                    line: 1,
                    column: 21,
                    endLine: 1,
                    endColumn: 23
                }
            ]
        },
        {
            code: "var arr = [ 1,\n   2   ];",
            output: "var arr = [1,\n   2];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 13
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 2,
                    column: 5,
                    endLine: 2,
                    endColumn: 8
                }
            ]
        },
        {
            code: "var arr = [  1, [ 2, 3  ] ];",
            output: "var arr = [1, [2, 3]];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 14
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 18,
                    endLine: 1,
                    endColumn: 19
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 23,
                    endLine: 1,
                    endColumn: 25
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 26,
                    endLine: 1,
                    endColumn: 27
                }
            ]
        },
        {
            code: "var arr = [ /*comment first*/  1, 2  /*comment last*/ ];",
            output: "var arr = [/*comment first*/1, 2/*comment last*/];",
            options: ["never"],
            errors: [
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "["
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 32
                },
                {
                    messageId: "unexpectedSpaceAfter",
                    data: {
                        tokenValue: "comment first"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 30,
                    endLine: 1,
                    endColumn: 32
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "]"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 36,
                    endLine: 1,
                    endColumn: 55
                },
                {
                    messageId: "unexpectedSpaceBefore",
                    data: {
                        tokenValue: "comment last"
                    },
                    type: "ArrayExpression",
                    line: 1,
                    column: 36,
                    endLine: 1,
                    endColumn: 38
                }
            ]
        }
    ]
});
