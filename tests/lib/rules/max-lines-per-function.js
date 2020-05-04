/**
 * @fileoverview Tests for max-lines-per-function rule.
 * @author Pete Ward <peteward44@gmail.com>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/max-lines-per-function");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("max-lines-per-function", rule, {
    valid: [

        // Test code in global scope doesn't count
        {
            code: "var x = 5;\nvar x = 2;\n",
            options: [1]
        },

        // Test single line standlone function
        {
            code: "function name() {}",
            options: [1]
        },

        // Test standalone function with lines of code
        {
            code: "function name() {\nvar x = 5;\nvar x = 2;\n}",
            options: [4]
        },

        // Test inline arrow function
        {
            code: "const bar = () => 2",
            options: [1]
        },

        // Test arrow function
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [4]
        },

        // skipBlankLines: false with simple standalone function
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 7, skipComments: false, skipBlankLines: false }]
        },

        // skipBlankLines: true with simple standalone function
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 4, skipComments: false, skipBlankLines: true }]
        },

        // skipComments: true with an individual single line comment
        {
            code: "function name() {\nvar x = 5;\nvar x = 2; // end of line comment\n}",
            options: [{ max: 4, skipComments: true, skipBlankLines: false }]
        },

        // skipComments: true with an individual single line comment
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\nvar x = 2; // end of line comment\n}",
            options: [{ max: 4, skipComments: true, skipBlankLines: false }]
        },

        // skipComments: true with single line comments
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\n// and another line comment\nvar x = 2; // end of line comment\n}",
            options: [{ max: 4, skipComments: true, skipBlankLines: false }]
        },

        // skipComments: true test with multiple different comment types
        {
            code: "function name() {\nvar x = 5;\n/* a \n multi \n line \n comment \n*/\n\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },

        // skipComments: true with multiple different comment types, including trailing and leading whitespace
        {
            code: "function name() {\nvar x = 5;\n\t/* a comment with leading whitespace */\n/* a comment with trailing whitespace */\t\t\n\t/* a comment with trailing and leading whitespace */\t\t\n/* a \n multi \n line \n comment \n*/\t\t\n\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },

        // Multiple params on seperate lines test
        {
            code: `function foo(
    aaa = 1,
    bbb = 2,
    ccc = 3
) {
    return aaa + bbb + ccc
}`,
            options: [{ max: 7, skipComments: true, skipBlankLines: false }]
        },

        // IIFE validity test
        {
            code: `(
function
()
{
}
)
()`,
            options: [{ max: 4, skipComments: true, skipBlankLines: false, IIFEs: true }]
        },

        // Nested function validity test
        {
            code: `function parent() {
var x = 0;
function nested() {
    var y = 0;
    x = 2;
}
if ( x === y ) {
    x++;
}
}`,
            options: [{ max: 10, skipComments: true, skipBlankLines: false }]
        },

        // Class method validity test
        {
            code: `class foo {
    method() {
        let y = 10;
        let x = 20;
        return y + x;
    }
}`,
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },

        // IIFEs should be recognised if IIFEs: true
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 7, skipComments: true, skipBlankLines: false, IIFEs: true }]
        },

        // IIFEs should not be recognised if IIFEs: false
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: false }]
        }
    ],

    invalid: [

        // Test simple standalone function is recognised
        {
            code: "function name() {\n}",
            options: [1],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 2, maxLines: 1 } }
            ]
        },

        // Test anonymous function assigned to variable is recognised
        {
            code: "var func = function() {\n}",
            options: [1],
            errors: [
                { messageId: "exceed", data: { name: "function", lineCount: 2, maxLines: 1 } }
            ]
        },

        // Test arrow functions are recognised
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [3],
            errors: [
                { messageId: "exceed", data: { name: "arrow function", lineCount: 4, maxLines: 3 } }
            ]
        },

        // Test inline arrow functions are recognised
        {
            code: "const bar = () =>\n 2",
            options: [1],
            errors: [
                { messageId: "exceed", data: { name: "arrow function", lineCount: 2, maxLines: 1 } }
            ]
        },

        // Test skipBlankLines: false
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, skipComments: false, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 7, maxLines: 6 } }
            ]
        },

        // Test skipBlankLines: false with CRLF line endings
        {
            code: "function name() {\r\nvar x = 5;\r\n\t\r\n \r\n\r\nvar x = 2;\r\n}",
            options: [{ max: 6, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 7, maxLines: 6 } }
            ]
        },

        // Test skipBlankLines: true
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 2, skipComments: true, skipBlankLines: true }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 4, maxLines: 2 } }
            ]
        },

        // Test skipBlankLines: true with CRLF line endings
        {
            code: "function name() {\r\nvar x = 5;\r\n\t\r\n \r\n\r\nvar x = 2;\r\n}",
            options: [{ max: 2, skipComments: true, skipBlankLines: true }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 4, maxLines: 2 } }
            ]
        },

        // Test skipComments: true and skipBlankLines: false for multiple types of comment
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 7, maxLines: 6 } }
            ]
        },

        // Test skipComments: true and skipBlankLines: true for multiple types of comment
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, skipComments: true, skipBlankLines: true }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 4, maxLines: 1 } }
            ]
        },

        // Test skipComments: false and skipBlankLines: true for multiple types of comment
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, skipComments: false, skipBlankLines: true }],
            errors: [
                { messageId: "exceed", data: { name: "function 'name'", lineCount: 5, maxLines: 1 } }
            ]
        },

        // Test simple standalone function with params on separate lines
        {
            code: `function foo(
    aaa = 1,
    bbb = 2,
    ccc = 3
) {
    return aaa + bbb + ccc
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'foo'", lineCount: 7, maxLines: 2 } }
            ]
        },

        // Test IIFE "function" keyword is included in the count
        {
            code: `(
function
()
{
}
)
()`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: true }],
            errors: [
                { messageId: "exceed", data: { name: "function", lineCount: 4, maxLines: 2 } }
            ]
        },

        // Test nested functions are included in it's parent's function count.
        {
            code: `function parent() {
var x = 0;
function nested() {
    var y = 0;
    x = 2;
}
if ( x === y ) {
    x++;
}
}`,
            options: [{ max: 9, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'parent'", lineCount: 10, maxLines: 9 } }
            ]
        },

        // Test nested functions are included in it's parent's function count.
        {
            code: `function parent() {
var x = 0;
function nested() {
    var y = 0;
    x = 2;
}
if ( x === y ) {
    x++;
}
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "function 'parent'", lineCount: 10, maxLines: 2 } },
                { messageId: "exceed", data: { name: "function 'nested'", lineCount: 4, maxLines: 2 } }
            ]
        },

        // Test regular methods are recognised
        {
            code: `class foo {
    method() {
        let y = 10;
        let x = 20;
        return y + x;
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "method 'method'", lineCount: 5, maxLines: 2 } }
            ]
        },

        // Test static methods are recognised
        {
            code: `class A {
    static
    foo
    (a) {
        return a
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "static method 'foo'", lineCount: 5, maxLines: 2 } }
            ]
        },

        // Test getters are recognised as properties
        {
            code: `var obj = {
    get
    foo
    () {
        return 1
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "getter 'foo'", lineCount: 5, maxLines: 2 } }
            ]
        },

        // Test setters are recognised as properties
        {
            code: `var obj = {
    set
    foo
    ( val ) {
        this._foo = val;
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "setter 'foo'", lineCount: 5, maxLines: 2 } }
            ]
        },

        // Test computed property names
        {
            code: `class A {
    static
    [
        foo +
            bar
    ]
    (a) {
        return a
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            errors: [
                { messageId: "exceed", data: { name: "static method", lineCount: 8, maxLines: 2 } }
            ]
        },

        // Test the IIFEs option includes IIFEs
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: true }],
            errors: [
                { messageId: "exceed", data: { name: "function", lineCount: 7, maxLines: 2 } }
            ]
        }
    ]
});
