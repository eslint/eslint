/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
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
        { code: "(() => { var a = 42; alert(a); })();", parserOptions: { ecmaVersion: 6 } },
        { code: "a(); try { throw new Error() } catch (a) {}" },
        { code: "class A {} new A();", parserOptions: { ecmaVersion: 6 } },
        "var a = 0, b = a;",
        { code: "var {a = 0, b = a} = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a = 0, b = a] = {};", parserOptions: { ecmaVersion: 6 } },
        "function foo() { foo(); }",
        "var foo = function() { foo(); };",
        { code: "var a; for (a in a) {}" },
        { code: "var a; for (a of a) {}", parserOptions: { ecmaVersion: 6 } },

        // Block-level bindings
        { code: "\"use strict\"; a(); { function a() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "\"use strict\"; { a(); function a() {} }", options: ["nofunc"], parserOptions: { ecmaVersion: 6 } },
        { code: "switch (foo) { case 1:  { a(); } default: { let a; }}", parserOptions: { ecmaVersion: 6 }},
        { code: "a(); { let a = function () {}; }", parserOptions: { ecmaVersion: 6 } },

        // object style options
        { code: "a(); function a() { alert(arguments); }", options: [{functions: false}] },
        { code: "\"use strict\"; { a(); function a() {} }", options: [{functions: false}], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { new A(); } class A {};", options: [{classes: false}], parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "a++; var a=19;", parserOptions: { sourceType: "module" }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", parserOptions: { parserOptions: { ecmaVersion: 6 } }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "a++; var a=19;", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "alert(a[1]); var a=[1,3];", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "a(); function a() { alert(b); var b=10; a(); }", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}, { message: "'b' was used before it was defined", type: "Identifier"}] },
        { code: "a(); var a=function() {};", options: ["nofunc"], errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "(() => { alert(a); var a = 42; })();", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "(() => a())(); function a() { }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "\"use strict\"; a(); { function a() {} }", errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "a(); try { throw new Error() } catch (foo) {var a;}", errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "var f = () => a; var a;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "new A(); class A {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } class A {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },
        { code: "new A(); var A = class {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } var A = class {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },

        // Block-level bindings
        { code: "a++; { var a; }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "\"use strict\"; { a(); function a() {} }", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "{a; let a = 1}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }]},
        { code: "switch (foo) { case 1: a();\n default: \n let a;}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }]},
        { code: "var f = () => a; var a;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }] },
        { code: "if (true) { function foo() { a; } let a;}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier" }]},

        // object style options
        { code: "a(); var a=function() {};", options: [{functions: false, classes: false}], errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "new A(); class A {};", options: [{functions: false, classes: false}], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },
        { code: "new A(); var A = class {};", options: [{classes: false}], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },
        { code: "function foo() { new A(); } var A = class {};", options: [{classes: false}], parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'A' was used before it was defined", type: "Identifier" }] },

        // invalid initializers
        { code: "var a = a;", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "let a = a + b;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "const a = foo(a);", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "function foo(a = a) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var {a = a} = [];", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var [a = a] = [];", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var {b = a, a} = {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var [b = a, a] = {};", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var {a = 0} = a;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "var [a = 0] = a;", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "for (var a in a) {}", errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
        { code: "for (var a of a) {}", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "'a' was used before it was defined", type: "Identifier"}] },
    ]
});
