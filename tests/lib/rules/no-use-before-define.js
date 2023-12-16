/**
 * @fileoverview Tests for no-use-before-define rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-use-before-define"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
    }
});

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
        { code: "(() => { var a = 42; alert(a); })();", languageOptions: { ecmaVersion: 6 } },
        "a(); try { throw new Error() } catch (a) {}",
        { code: "class A {} new A();", languageOptions: { ecmaVersion: 6 } },
        "var a = 0, b = a;",
        { code: "var {a = 0, b = a} = {};", languageOptions: { ecmaVersion: 6 } },
        { code: "var [a = 0, b = a] = {};", languageOptions: { ecmaVersion: 6 } },
        "function foo() { foo(); }",
        "var foo = function() { foo(); };",
        "var a; for (a in a) {}",
        { code: "var a; for (a of a) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "let a; class C { static { a; } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { let a; a; } }", languageOptions: { ecmaVersion: 2022 } },

        // Block-level bindings
        { code: "\"use strict\"; a(); { function a() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "\"use strict\"; { a(); function a() {} }", options: ["nofunc"], languageOptions: { ecmaVersion: 6 } },
        { code: "switch (foo) { case 1:  { a(); } default: { let a; }}", languageOptions: { ecmaVersion: 6 } },
        { code: "a(); { let a = function () {}; }", languageOptions: { ecmaVersion: 6 } },

        // object style options
        { code: "a(); function a() { alert(arguments); }", options: [{ functions: false }] },
        { code: "\"use strict\"; { a(); function a() {} }", options: [{ functions: false }], languageOptions: { ecmaVersion: 6 } },
        { code: "function foo() { new A(); } class A {};", options: [{ classes: false }], languageOptions: { ecmaVersion: 6 } },

        // "variables" option
        {
            code: "function foo() { bar; } var bar;",
            options: [{ variables: false }]
        },
        {
            code: "var foo = () => bar; var bar;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { static { () => foo; let foo; } }",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // Tests related to class definition evaluation. These are not TDZ errors.
        { code: "class C extends (class { method() { C; } }) {}", languageOptions: { ecmaVersion: 6 } },
        { code: "(class extends (class { method() { C; } }) {});", languageOptions: { ecmaVersion: 6 } },
        { code: "const C = (class extends (class { method() { C; } }) {});", languageOptions: { ecmaVersion: 6 } },
        { code: "class C extends (class { field = C; }) {}", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class extends (class { field = C; }) {});", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = (class extends (class { field = C; }) {});", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { [() => C](){} }", languageOptions: { ecmaVersion: 6 } },
        { code: "(class C { [() => C](){} });", languageOptions: { ecmaVersion: 6 } },
        { code: "const C = class { [() => C](){} };", languageOptions: { ecmaVersion: 6 } },
        { code: "class C { static [() => C](){} }", languageOptions: { ecmaVersion: 6 } },
        { code: "(class C { static [() => C](){} });", languageOptions: { ecmaVersion: 6 } },
        { code: "const C = class { static [() => C](){} };", languageOptions: { ecmaVersion: 6 } },
        { code: "class C { [() => C]; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { [() => C]; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { [() => C]; };", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static [() => C]; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static [() => C]; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { static [() => C]; };", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { method() { C; } }", languageOptions: { ecmaVersion: 6 } },
        { code: "(class C { method() { C; } });", languageOptions: { ecmaVersion: 6 } },
        { code: "const C = class { method() { C; } };", languageOptions: { ecmaVersion: 6 } },
        { code: "class C { static method() { C; } }", languageOptions: { ecmaVersion: 6 } },
        { code: "(class C { static method() { C; } });", languageOptions: { ecmaVersion: 6 } },
        { code: "const C = class { static method() { C; } };", languageOptions: { ecmaVersion: 6 } },
        { code: "class C { field = C; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = C; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = C; };", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = C; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = C; });", languageOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = C; };` is TDZ error
        { code: "class C { static field = class { static field = C; }; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class { static field = C; }; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { field = () => C; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = () => C; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = () => C; };", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = () => C; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = () => C; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { static field = () => C; };", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { field = class extends C {}; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { field = class extends C {}; });", languageOptions: { ecmaVersion: 2022 } },
        { code: "const C = class { field = class extends C {}; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static field = class extends C {}; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class extends C {}; });", languageOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = class extends C {}; };` is TDZ error
        { code: "class C { static field = class { [C]; }; }", languageOptions: { ecmaVersion: 2022 } },
        { code: "(class C { static field = class { [C]; }; });", languageOptions: { ecmaVersion: 2022 } }, // `const C = class { static field = class { [C]; } };` is TDZ error
        { code: "const C = class { static field = class { field = C; }; };", languageOptions: { ecmaVersion: 2022 } },
        {
            code: "class C { method() { a; } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { static method() { a; } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 }
        },
        {
            code: "class C { field = a; } let a;", // `class C { static field = a; } let a;` is TDZ error
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = D; } class D {}", // `class C { static field = D; } class D {}` is TDZ error
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = class extends D {}; } class D {}", // `class C { static field = class extends D {}; } class D {}` is TDZ error
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = () => a; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = () => a; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { field = () => D; } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = () => D; } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static field = class { field = a; }; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { C; } }", // `const C = class { static { C; } }` is TDZ error
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { C; } static {} static { C; } }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "(class C { static { C; } })",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { class D extends C {} } }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { (class { static { C } }) } }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => C; } }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "(class C { static { () => C; } })",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const C = class { static { () => C; } }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => D; } } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { () => a; } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "const C = class C { static { C.x; } }",
            languageOptions: { ecmaVersion: 2022 }
        },

        // "allowNamedExports" option
        {
            code: "export { a }; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export { a as b }; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export { a, b }; let a, b;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export { a }; var a;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export { f }; function f() {}",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        },
        {
            code: "export { C }; class C {}",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" }
        }
    ],
    invalid: [
        {
            code: "a++; var a=19;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "a++; var a=19;",
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "(() => a())(); function a() { }",
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); class A {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } class A {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); var A = class {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } var A = class {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },

        // Block-level bindings
        {
            code: "a++; { var a; }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "\"use strict\"; { a(); function a() {} }",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "{a; let a = 1}",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "switch (foo) { case 1: a();\n default: \n let a;}",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "if (true) { function foo() { a; } let a;}",
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "new A(); var A = class {};",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "A" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { new A(); } var A = class {};",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "const a = foo(a);",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo(a = a) {}",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {a = a} = [];",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [a = a] = [];",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {b = a, a} = {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [b = a, a] = {};",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var {a = 0} = a;",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" },
                type: "Identifier"
            }]
        },
        {
            code: "var [a = 0] = a;",
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 6 },
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
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "for (let x in xs); let xs = []",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "xs" }
            }]
        },
        {
            code: "for (let x of xs); let xs = []",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "xs" }
            }]
        },
        {
            code: "try {} catch ({message = x}) {} let x = ''",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) x; let x = {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },

        // WithStatements.
        {
            code: "with (x); let x = {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { x } let x = {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { if (a) { x } } let x = {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },
        {
            code: "with (obj) { (() => { if (a) { x } })() } let x = {}",
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "x" }
            }]
        },

        // Tests related to class definition evaluation. These are TDZ errors.
        {
            code: "class C extends C {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends C {};",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends (class { [C](){} }) {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends (class { [C](){} }) {};",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends (class { static field = C; }) {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class extends (class { static field = C; }) {};",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C](){} }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C](){} });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C](){} };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C](){} }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C](){} });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C](){} };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C]; }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C]; });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C]; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { [C] = foo; }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { [C] = foo; });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { [C] = foo; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C]; }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C]; });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C]; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static [C] = foo; }",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "(class C { static [C] = foo; });",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static [C] = foo; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = C; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class extends C {}; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class { [C]; } };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static field = class { static field = C; }; };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C extends D {} class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C extends (class { [a](){} }) {} let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C extends (class { static field = a; }) {} let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a]() {} } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a]() {} } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a]; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a]; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { [a] = foo; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static [a] = foo; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = a; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = D; } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static field = class extends D {}; } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static field = class { [a](){} } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static field = class { static field = a; }; } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "const C = class { static { C; } };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "const C = class { static { (class extends C {}); } };",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "class C { static { a; } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static { D; } } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static { (class extends D {}); } } class D {}",
            options: [{ classes: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "D" }
            }]
        },
        {
            code: "class C { static { (class { [a](){} }); } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "class C { static { (class { static field = a; }); } } let a;",
            options: [{ variables: false }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },

        /*
         * TODO(mdjermanovic): Add the following test cases once https://github.com/eslint/eslint-scope/issues/59 gets fixed:
         * {
         *  code: "(class C extends C {});",
         *  options: [{ classes: false }],
         *  languageOptions: { ecmaVersion: 6 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * },
         * {
         *  code: "(class C extends (class { [C](){} }) {});",
         *  options: [{ classes: false }],
         *  languageOptions: { ecmaVersion: 6 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * },
         * {
         *  code: "(class C extends (class { static field = C; }) {});",
         *  options: [{ classes: false }],
         *  languageOptions: { ecmaVersion: 2022 },
         *  errors: [{
         *      messageId: "usedBeforeDefined",
         *      data: { name: "C" }
         *  }]
         * }
         */

        // "allowNamedExports" option
        {
            code: "export { a }; const a = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { a }; const a = 1;",
            options: [{}],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { a }; const a = 1;",
            options: [{ allowNamedExports: false }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { a }; const a = 1;",
            options: ["nofunc"],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { a as b }; const a = 1;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { a, b }; let a, b;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [
                {
                    messageId: "usedBeforeDefined",
                    data: { name: "a" }
                },
                {
                    messageId: "usedBeforeDefined",
                    data: { name: "b" }
                }
            ]
        },
        {
            code: "export { a }; var a;",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export { f }; function f() {}",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "f" }
            }]
        },
        {
            code: "export { C }; class C {}",
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "C" }
            }]
        },
        {
            code: "export const foo = a; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export default a; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export function foo() { return a; }; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        },
        {
            code: "export class C { foo() { return a; } }; const a = 1;",
            options: [{ allowNamedExports: true }],
            languageOptions: { ecmaVersion: 2015, sourceType: "module" },
            errors: [{
                messageId: "usedBeforeDefined",
                data: { name: "a" }
            }]
        }
    ]
});
