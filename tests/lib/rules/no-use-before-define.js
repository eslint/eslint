/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-use-before-define"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-use-before-define", rule, {
    valid: [
        "var a=10; alert(a);",
        "function b(a) { alert(a); }",
        "Object.hasOwnProperty.call(a);",
        "function a() { alert(arguments);}",
        { code: "a(); function a() { alert(arguments); }", options: ["nofunc"] },
        { code: "(() => { var a = 42; alert(a); })();", ecmaFeatures: { arrowFunctions: true } },
        { code: "a(); try { throw new Error() } catch (a) {}" },
        { code: "class A {} new A();", ecmaFeatures: { classes: true } },
        "var a = 0, b = a;",
        { code: "var {a = 0, b = a} = {};", ecmaFeatures: { destructuring: true } },
        { code: "var [a = 0, b = a] = {};", ecmaFeatures: { destructuring: true } },
        "function foo() { foo(); }",
        "var foo = function() { foo(); };",

        // Block-level bindings
        { code: "\"use strict\"; a(); { function a() {} }", ecmaFeatures: { blockBindings: true } },
        { code: "\"use strict\"; { a(); function a() {} }", options: ["nofunc"], ecmaFeatures: { blockBindings: true } },
        { code: "switch (foo) { case 1:  { a(); } default: { let a; }}", ecmaFeatures: { blockBindings: true }},
        { code: "a(); { let a = function () {}; }", ecmaFeatures: { blockBindings: true } },

        // object style options
        { code: "a(); function a() { alert(arguments); }", options: [{functions: false}] },
        { code: "\"use strict\"; { a(); function a() {} }", options: [{functions: false}], ecmaFeatures: { blockBindings: true } },
        { code: "function foo() { new A(); } class A {};", options: [{classes: false}], ecmaFeatures: { classes: true } }
    ],
    invalid: [
        { code: "a++; var a=19;", ecmaFeatures: { modules: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", ecmaFeatures: { globalReturn: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "alert(a[1]); var a=[1,3];", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "a(); function a() { alert(b); var b=10; a(); }", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}, { message: "\"b\" was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", options: ["nofunc"], errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "(() => { alert(a); var a = 42; })();", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "(() => a())(); function a() { }", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "\"use strict\"; a(); { function a() {} }", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "a(); try { throw new Error() } catch (foo) {var a;}", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "var f = () => a; var a;", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "new A(); class A {};", ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } class A {};", ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },
        { code: "new A(); var A = class {};", ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } var A = class {};", ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },

        // Block-level bindings
        { code: "a++; { var a; }", ecmaFeatures: { blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "\"use strict\"; { a(); function a() {} }", ecmaFeatures: { blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "{a; let a = 1}", ecmaFeatures: { blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }]},
        { code: "switch (foo) { case 1: a();\n default: \n let a;}", ecmaFeatures: { blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }]},
        { code: "var f = () => a; var a;", ecmaFeatures: { arrowFunctions: true, blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }] },
        { code: "if (true) { function foo() { a; } let a;}", ecmaFeatures: { blockBindings: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier" }]},

        // object style options
        { code: "a(); var a=function() {};", options: [{functions: false, classes: false}], errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "new A(); class A {};", options: [{functions: false, classes: false}], ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },
        { code: "new A(); var A = class {};", options: [{classes: false}], ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } var A = class {};", options: [{classes: false}], ecmaFeatures: { classes: true }, errors: [{ message: "\"A\" was used before it was defined", type: "Identifier" }] },

        // invalid initializers
        { code: "var a = a;", errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "let a = a + b;", ecmaFeatures: {blockBindings: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "const a = foo(a);", ecmaFeatures: {blockBindings: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "function foo(a = a) {}", ecmaFeatures: {defaultParams: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var {a = a} = [];", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var [a = a] = [];", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var {b = a, a} = {};", ecmaFeatures: { destructuring: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var [b = a, a] = {};", ecmaFeatures: { destructuring: true }, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var {a = 0} = a;", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] },
        { code: "var [a = 0] = a;", ecmaFeatures: {destructuring: true}, errors: [{ message: "\"a\" was used before it was defined", type: "Identifier"}] }
    ]
});
