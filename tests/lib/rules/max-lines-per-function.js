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

const parserOptions = { ecmaVersion: 6 };

const ruleTester = new RuleTester();

ruleTester.run("max-lines-per-function", rule, {
    valid: [
        {
            code: "var x = 5;\nvar x = 2;\n",
            options: [1]
        },
        {
            code: "function name() {}",
            options: [1]
        },
        {
            code: "function name() {\nvar x = 5;\nvar x = 2;\n}",
            options: [4]
        },
        {
            code: "const bar = () => 2",
            options: [1],
            parserOptions
        },
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [4],
            parserOptions
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 7, skipComments: false, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\nvar x = 2; // end of line comment\n}",
            options: [{ max: 4, skipComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n// a comment on it's own line\n// and another line comment\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },
        {
            code: "function name() {\nvar x = 5;\n/* a \n multi \n line \n comment \n*/\n\nvar x = 2; // end of line comment\n}",
            options: [{ max: 5, skipComments: true, skipBlankLines: false }]
        },
        {
            code: `function foo(
    aaa = 1,
    bbb = 2,
    ccc = 3
) {
    return aaa + bbb + ccc
}`,
            options: [{ max: 7, skipComments: true, skipBlankLines: false }],
            parserOptions
        },
        {
            code: `(
function
()
{
}
)
()`,
            options: [{ max: 4, skipComments: true, skipBlankLines: false, IIFEs: true }],
            parserOptions
        },
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
            options: [{ max: 10, skipComments: true, skipBlankLines: false }],
            parserOptions
        },
        {
            code: `class foo {
    method() {
        let y = 10;
        let x = 20;
        return y + x;
    }
}`,
            options: [{ max: 5, skipComments: true, skipBlankLines: false }],
            parserOptions
        },
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 7, skipComments: true, skipBlankLines: false, IIFEs: true }],
            parserOptions
        },
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: false }],
            parserOptions
        }
    ],

    invalid: [
        {
            code: "function name() {\n}",
            options: [1],
            errors: [
                "function 'name' has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "var func = function() {\n}",
            options: [1],
            errors: [
                "function has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "const bar = () =>\n 2",
            options: [1],
            parserOptions,
            errors: [
                "arrow function has too many lines (2). Maximum allowed is 1."
            ]
        },
        {
            code: "const bar = () => {\nconst x = 2 + 1;\nreturn x;\n}",
            options: [3],
            parserOptions,
            errors: [
                "arrow function has too many lines (4). Maximum allowed is 3."
            ]
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, skipComments: false, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() {\nvar x = 5;\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, skipComments: true, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 6, skipComments: true, skipBlankLines: false }],
            errors: [
                "function 'name' has too many lines (7). Maximum allowed is 6."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, skipComments: true, skipBlankLines: true }],
            errors: [
                "function 'name' has too many lines (4). Maximum allowed is 1."
            ]
        },
        {
            code: "function name() { // end of line comment\nvar x = 5; /* mid line comment */\n\t// single line comment taking up whole line\n\t\n \n\nvar x = 2;\n}",
            options: [{ max: 1, skipComments: false, skipBlankLines: true }],
            errors: [
                "function 'name' has too many lines (5). Maximum allowed is 1."
            ]
        },
        {
            code: `function foo(
    aaa = 1,
    bbb = 2,
    ccc = 3
) {
    return aaa + bbb + ccc
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            parserOptions,
            errors: [
                "function 'foo' has too many lines (7). Maximum allowed is 2."
            ]
        },
        {
            code: `(
function
()
{
}
)
()`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: true }],
            parserOptions,
            errors: [
                "function has too many lines (4). Maximum allowed is 2."
            ]
        },
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
            parserOptions,
            errors: [
                "function 'parent' has too many lines (10). Maximum allowed is 9."
            ]
        },
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
            parserOptions,
            errors: [
                "function 'parent' has too many lines (10). Maximum allowed is 2.",
                "function 'nested' has too many lines (4). Maximum allowed is 2."
            ]
        },
        {
            code: `class foo {
    method() {
        let y = 10;
        let x = 20;
        return y + x;
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            parserOptions,
            errors: [
                "method 'method' has too many lines (5). Maximum allowed is 2."
            ]
        },
        {
            code: `class A {
    static
    foo
    // This FunctionExpression starts from below '(', so this is 3.
    (a) {
        return a
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            parserOptions,
            errors: [
                "static method 'foo' has too many lines (5). Maximum allowed is 2."
            ]
        },
        {
            code: `// Getters/setters are similar to it.
var obj = {
    get
    foo
    // This FunctionExpression starts from below '(', so this is 3.
    () {
        return 1
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            parserOptions,
            errors: [
                "getter 'foo' has too many lines (5). Maximum allowed is 2."
            ]
        },
        {
            code: `// The computed property cases can be longer.
class A {
    static
    [
        foo +
            bar
    ]
    // This FunctionExpression starts from below '(', so this is 3.
    (a) {
        return a
    }
}`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false }],
            parserOptions,
            errors: [
                "static method has too many lines (8). Maximum allowed is 2."
            ]
        },
        {
            code: `(function(){
    let x = 0;
    let y = 0;
    let z = x + y;
    let foo = {};
    return bar;
}());`,
            options: [{ max: 2, skipComments: true, skipBlankLines: false, IIFEs: true }],
            parserOptions,
            errors: [
                "function has too many lines (7). Maximum allowed is 2."
            ]
        }
    ]
});
