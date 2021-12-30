/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-use-before-define"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-use-before-define", rule, {
    valid: [
        "unresolved",
        "Array",
        "function foo () { arguments; }",
        "var a=10; alert(a);",
        "function b(a) { alert(a); }",
        "Object.hasOwnProperty.call(a);",
        "function a() { alert(arguments);}",
        { code: "a(); function a() { alert(arguments); }", options: ["nofunc"] },
        { code: "(() => { var a = 42; alert(a); })();", parserOptions: { ecmaVersion: 6 } },
        "a(); try { throw new Error() } catch (a) {}",
        { code: "class A {} new A();", parserOptions: { ecmaVersion: 6 } },
        "var a = 0, b = a;",
        { code: "var {a = 0, b = a} = {};", parserOptions: { ecmaVersion: 6 } },
        { code: "var [a = 0, b = a] = {};", parserOptions: { ecmaVersion: 6 } },
        "function foo() { foo(); }",
        "var foo = function() { foo(); };",
        "var a; for (a in a) {}",
        { code: "var a; for (a of a) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "let a; class C { static { a; } }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { let a; a; } }", parserOptions: { ecmaVersion: 2022 } },

        // Block-level bindings
        { code: "\"use strict\"; a(); { function a() {} }", parserOptions: { ecmaVersion: 6 } },
        { code: "\"use strict\"; { a(); function a() {} }", options: ["nofunc"], parserOptions: { ecmaVersion: 6 } },
        { code: "switch (foo) { case 1:  { a(); } default: { let a; }}", parserOptions: { ecmaVersion: 6 } },
        { code: "a(); { let a = function () {}; }", parserOptions: { ecmaVersion: 6 } },

        // object style options
        { code: "a(); function a() { alert(arguments); }", options: [{ functions: false }] },
        { code: "\"use strict\"; { a(); function a() {} }", options: [{ functions: false }], parserOptions: { ecmaVersion: 6 } },
        { code: "function foo() { new A(); } class A {};", options: [{ classes: false }], parserOptions: { ecmaVersion: 6 } },

        // "variables" option
        {
            code: "function foo() { bar; } var bar;",
            options: [{ variables: false }]
        },
        {
            code: "var foo = () => bar; var bar;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { static { () => foo; let foo; } }",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },

        // Tests related to class definition evaluation. These are not TDZ errors.
        { code: "class C extends (class { method() { C; } }) {}", parserOptions: { ecmaVersion: 6 } },
        { code: "(class extends (class { method() { C; } }) {});", parserOptions: { ecmaVersion: 6 } },
        { code: "const C = (class extends (class { method() { C; } }) {});", parserOptions: { ecmaVersion: 6 } },
        { code: "class C extends (class { field = C; }) {}", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class extends (class { field = C; }) {});", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = (class extends (class { field = C; }) {});", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { [() => C](){} }", parserOptions: { ecmaVersion: 6 } },
        { code: "(class C { [() => C](){} });", parserOptions: { ecmaVersion: 6 } },
        { code: "const C = class { [() => C](){} };", parserOptions: { ecmaVersion: 6 } },
        { code: "class C { static [() => C](){} }", parserOptions: { ecmaVersion: 6 } },
        { code: "(class C { static [() => C](){} });", parserOptions: { ecmaVersion: 6 } },
        { code: "const C = class { static [() => C](){} };", parserOptions: { ecmaVersion: 6 } },
        { code: "class C { [() => C]; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { [() => C]; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { [() => C]; };", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static [() => C]; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static [() => C]; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { static [() => C]; };", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { method() { C; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "(class C { method() { C; } });", parserOptions: { ecmaVersion: 6 } },
        { code: "const C = class { method() { C; } };", parserOptions: { ecmaVersion: 6 } },
        { code: "class C { static method() { C; } }", parserOptions: { ecmaVersion: 6 } },
        { code: "(class C { static method() { C; } });", parserOptions: { ecmaVersion: 6 } },
        { code: "const C = class { static method() { C; } };", parserOptions: { ecmaVersion: 6 } },
        { code: "class C { field = C; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = C; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = C; };", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = C; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = C; });", parserOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = C; };` is TDZ error
        { code: "class C { static field = class { static field = C; }; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class { static field = C; }; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { field = () => C; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = () => C; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = () => C; };", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = () => C; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = () => C; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { static field = () => C; };", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { field = class extends C {}; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = class extends C {}; });", parserOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = class extends C {}; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = class extends C {}; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class extends C {}; });", parserOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = class extends C {}; };` is TDZ error
        { code: "class C { static field = class { [C]; }; }", parserOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class { [C]; }; });", parserOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = class { [C]; } };` is TDZ error
        { code: "const C = class { static field = class { field = C; }; };", parserOptions: { ecmaVersion: 2022 } },
        {
            code: "class C { method() { a; } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { static method() { a; } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { field = a; } let a;", // `class C { static field = a; } let a;` is TDZ error
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = D; } class D {}", // `class C { static field = D; } class D {}` is TDZ error
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = class extends D {}; } class D {}", // `class C { static field = class extends D {}; } class D {}` is TDZ error
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = () => a; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = () => a; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = () => D; } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = () => D; } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = class { field = a; }; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { C; } }", // `const C = class { static { C; } }` is TDZ error
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { C; } static {} static { C; } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "(class C { static { C; } })",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { class D extends C {} } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { (class { static { C } }) } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => C; } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "(class C { static { () => C; } })",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const C = class { static { () => C; } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => D; } } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => a; } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const C = class C { static { C.x; } }",
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "a++; var a=19;",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a++; var a=19;",
            parserOptions: { parserOptions: { ecmaVersion: 6 } },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a++; var a=19;",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a(); var a=function() {};",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "alert(a[1]); var a=[1,3];",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a(); function a() { alert(b); var b=10; a(); }",
            errors: [
                {
                    messageId: "usedBeforeDefined",
                    data: { name: "a" },
                    type: "Identifier"
                },
                {
                    messageId: "usedBeforeDefined",
                    data: { name: "b" },
                    type: "Identifier"
                }
            ]
        },
        {
            code: "a(); var a=function() {};",
            options: ["nofunc"],
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "(() => { alert(a); var a = 42; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "(() => a())(); function a() { }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "\"use strict\"; a(); { function a() {} }",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a(); try { throw new Error() } catch (foo) {var a;}",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var f = () => a; var a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); class A {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } class A {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); var A = class {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } var A = class {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },

        // Block-level bindings
        {
            code: "a++; { var a; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "\"use strict\"; { a(); function a() {} }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "{a; let a = 1}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "switch (foo) { case 1: a();\n default: \n let a;}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "if (true) { function foo() { a; } let a;}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },

        // object style options
        {
            code: "a(); var a=function() {};",
            options: [{ functions: false, classes: false }],
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); class A {};",
            options: [{ functions: false, classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); var A = class {};",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } var A = class {};",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },

        // invalid initializers
        {
            code: "var a = a;",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "let a = a + b;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "const a = foo(a);",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a = a) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {a = a} = [];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [a = a] = [];",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {b = a, a} = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [b = a, a] = {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {a = 0} = a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [a = 0] = a;",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "for (var a in a) {}",
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "for (var a of a) {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },

        // "variables" option
        {
            code: "function foo() { bar; var bar = 1; } var bar;",
            options: [{ variables: false }],
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "bar" },
                type: "Identifier"
            }]
        },
        {
            code: "foo; var foo;",
            options: [{ variables: false }],
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },

        // https://github.com/eslint/eslint/issues/10227
        {
            code: "for (let x = x;;); let x = 0",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "for (let x in xs); let xs = []",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "xs" }
            }]
        },
        {
            code: "for (let x of xs); let xs = []",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "xs" }
            }]
        },
        {
            code: "try {} catch ({message = x}) {} let x = ''",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) x; let x = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },

        // WithStatements.
        {
            code: "with (x); let x = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { x } let x = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { if (a) { x } } let x = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { (() => { if (a) { x } })() } let x = {}",
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },

        // Tests related to class definition evaluation. These are TDZ errors.
        {
            code: "class C extends C {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends C {};",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends (class { [C](){} }) {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends (class { [C](){} }) {};",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends (class { static field = C; }) {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends (class { static field = C; }) {};",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C](){} }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C](){} });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C](){} };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C](){} }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C](){} });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C](){} };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C]; }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C]; });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C]; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C] = foo; }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C] = foo; });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C] = foo; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C]; }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C]; });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C]; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C] = foo; }",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C] = foo; });",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C] = foo; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = C; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class extends C {}; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class { [C]; } };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class { static field = C; }; };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends D {} class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C extends (class { [a](){} }) {} let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C extends (class { static field = a; }) {} let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a]() {} } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a]() {} } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a]; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a]; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a] = foo; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a] = foo; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = a; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = D; } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static field = class extends D {}; } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static field = class { [a](){} } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = class { static field = a; }; } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "const C = class { static { C; } };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static { (class extends C {}); } };",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static { a; } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static { D; } } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static { (class extends D {}); } } class D {}",
            options: [{ classes: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static { (class { [a](){} }); } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static { (class { static field = a; }); } } let a;",
            options: [{ variables: false }],
            parserOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        }

        /*
         * TODO(mdjermanovic): Add the following test cases once https://github.com/eslint/eslint-scope/issues/59 gets fixed:
         * {
         *  code: "(class C extends C {});",
         *  options: [{ classes: false }],
         *  parserOptions: { ecmaVersion: 6 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * },
         * {
         *  code: "(class C extends (class { [C](){} }) {});",
         *  options: [{ classes: false }],
         *  parserOptions: { ecmaVersion: 6 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * },
         * {
         *  code: "(class C extends (class { static field = C; }) {});",
         *  options: [{ classes: false }],
         *  parserOptions: { ecmaVersion: 2022 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * }
         */
    ]
});
