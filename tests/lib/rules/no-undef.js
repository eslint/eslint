/**
 * @fileoverview Tests for no-undef rule.
 * @author Mark Macdonald
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-undef"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-undef", rule, {
    valid: [
        "var a = 1, b = 2; a;",
        "/*global b*/ function f() { b; }",
        { code: "function f() { b; }", globals: { b: false} },
        { code: "function f() { b; }", global: { b: false} },
        "/*global b a:false*/  a;  function f() { b; a; }",
        "function a(){}  a();",
        "function f(b) { b; }",
        "var a; a = 1; a++;",
        "var a; function f() { a = 1; }",
        "/*global b:true*/ b++;",
        "/*eslint-env browser*/ window;",
        "/*eslint-env browser*/ window;",
        "/*eslint-env node*/ require(\"a\");",
        "Object; isNaN();",
        "toString()",
        "hasOwnProperty()",
        "function evilEval(stuffToEval) { var ultimateAnswer; ultimateAnswer = 42; eval(stuffToEval); }",
        "typeof a",
        "typeof (a)",
        "var b = typeof a",
        "typeof a === 'undefined'",
        "if (typeof a === 'undefined') {}",
        { code: "function foo() { var [a, b=4] = [1, 2]; return {a, b}; }", ecmaFeatures: { destructuring: true, objectLiteralShorthandProperties: true }},
        { code: "var toString = 1;", ecmaFeatures: { globalReturn: true }},
        { code: "function myFunc(...foo) {  return foo;}", ecmaFeatures: { restParams: true } },
        { code: "var React, App, a=1; React.render(<App attr={a} />);", ecmaFeatures: { jsx: true } },
        { code: "var console; [1,2,3].forEach(obj => {\n  console.log(obj);\n});", ecmaFeatures: { arrowFunctions: true } },
        { code: "var Foo; class Bar extends Foo { constructor() { super();  }}", ecmaFeatures: { classes: true } },
        { code: "import Warning from '../lib/warning'; var warn = new Warning('text');", ecmaFeatures: { modules: true } },
        { code: "import * as Warning from '../lib/warning'; var warn = new Warning('text');", ecmaFeatures: { modules: true } },
        { code: "var a; [a] = [0];", ecmaFeatures: {destructuring: true} },
        { code: "var a; ({a}) = {};", ecmaFeatures: {destructuring: true} },
        { code: "var a; ({b: a}) = {};", ecmaFeatures: {destructuring: true} },
        { code: "var obj; [obj.a, obj.b] = [0, 1];", ecmaFeatures: {destructuring: true} },

        // Notifications of readonly are removed: https://github.com/eslint/eslint/issues/4504
        { code: "/*global b:false*/ function f() { b = 1; }" },
        { code: "function f() { b = 1; }", global: { b: false } },
        { code: "/*global b:false*/ function f() { b++; }" },
        { code: "/*global b*/ b = 1;" },
        { code: "/*global b:false*/ var b = 1;" },
        { code: "Array = 1;" },

        // Experimental,
        {
            code: "var {bacon, ...others} = stuff; foo(others)",
            ecmaFeatures: {destructuring: true, experimentalObjectRestSpread: true},
            globals: {stuff: false, foo: false}
        }
    ],
    invalid: [
        { code: "a = 1;", errors: [{ message: "\"a\" is not defined.", type: "Identifier"}] },
        { code: "if (typeof anUndefinedVar === 'string') {}", options: [{typeof: true}], errors: [{ message: "\"anUndefinedVar\" is not defined.", type: "Identifier"}] },
        { code: "var a = b;", errors: [{ message: "\"b\" is not defined.", type: "Identifier"}] },
        { code: "function f() { b; }", errors: [{ message: "\"b\" is not defined.", type: "Identifier"}] },
        { code: "window;", errors: [{ message: "\"window\" is not defined.", type: "Identifier"}] },
        { code: "require(\"a\");", errors: [{ message: "\"require\" is not defined.", type: "Identifier"}] },
        { code: "var React; React.render(<img attr={a} />);", errors: [{ message: "\"a\" is not defined." }], ecmaFeatures: { jsx: true } },
        { code: "var React, App; React.render(<App attr={a} />);", errors: [{ message: "\"a\" is not defined." }], ecmaFeatures: { jsx: true } },
        { code: "[a] = [0];", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" is not defined." }] },
        { code: "({a}) = {};", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" is not defined." }] },
        { code: "({b: a}) = {};", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" is not defined." }] },
        { code: "[obj.a, obj.b] = [0, 1];", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"obj\" is not defined." }, { message: "\"obj\" is not defined." }] },

        // Experimental
        {
            code: "const c = 0; const a = {...b, c};",
            ecmaFeatures: {blockBindings: true, objectLiteralShorthandProperties: true, experimentalObjectRestSpread: true},
            errors: [{ message: "\"b\" is not defined." }]
        }
    ]
});
