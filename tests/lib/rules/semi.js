/**
 * @fileoverview Tests for semi rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/semi"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("semi", rule, {
    valid: [
        "var x = 5;",
        "var x =5, y;",
        "foo();",
        "x = foo();",
        "setTimeout(function() {foo = \"bar\"; });",
        "setTimeout(function() {foo = \"bar\";});",
        "for (var a in b){}",
        "for (var i;;){}",
        "if (true) {}\n;[global, extended].forEach(function(){});",
        "throw new Error('foo');",
        { code: "throw new Error('foo')", options: ["never"] },
        { code: "var x = 5", options: ["never"] },
        { code: "var x =5, y", options: ["never"] },
        { code: "foo()", options: ["never"] },
        { code: "debugger", options: ["never"] },
        { code: "for (var a in b){}", options: ["never"] },
        { code: "for (var i;;){}", options: ["never"] },
        { code: "x = foo()", options: ["never"] },
        { code: "if (true) {}\n;[global, extended].forEach(function(){})", options: ["never"] },
        { code: "(function bar() {})\n;(function foo(){})", options: ["never"] },
        { code: ";/foo/.test('bar')", options: ["never"] },
        { code: ";+5", options: ["never"] },
        { code: ";-foo()", options: ["never"] },
        { code: "a++\nb++", options: ["never"] },
        { code: "a++; b++", options: ["never"] },
        { code: "for (let thing of {}) {\n  console.log(thing);\n}", languageOptions: { ecmaVersion: 6 } },
        { code: "do{}while(true)", options: ["never"] },
        { code: "do{}while(true);", options: ["always"] },
        { code: "class C { static {} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static {} }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo(); } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo(); } }", options: ["always"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo(); bar(); } }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo(); bar(); baz();} }", languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo() } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\nbar() } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\nbar()\nbaz() } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo(); bar() } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo();\n (a) } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\n ;(a) } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo();\n [a] } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\n ;[a] } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo();\n +a } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\n ;+a } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo();\n -a } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\n ;-a } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo();\n /a/ } }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C { static { foo()\n ;/a/} }", options: ["never"], languageOptions: { ecmaVersion: 2022 } },
        {
            code: "class C { static { foo();\n (a) } }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { do ; while (foo)\n (a)} }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static { do ; while (foo)\n ;(a)} }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // omitLastInOneLineBlock: true
        { code: "if (foo) { bar() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "if (foo) { bar(); baz() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "if (foo)\n{ bar(); baz() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "if (foo) {\n bar(); baz(); }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "if (foo) { bar(); baz(); \n}", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "function foo() { bar(); baz() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "function foo()\n{ bar(); baz() }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "function foo(){\n bar(); baz(); }", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "function foo(){ bar(); baz(); \n}", options: ["always", { omitLastInOneLineBlock: true }] },
        { code: "() => { bar(); baz() };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "() =>\n { bar(); baz() };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "() => {\n bar(); baz(); };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "() => { bar(); baz(); \n};", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const obj = { method() { bar(); baz() } };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const obj = { method()\n { bar(); baz() } };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const obj = { method() {\n bar(); baz(); } };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "const obj = { method() { bar(); baz(); \n} };", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class C {\n method() { bar(); baz() } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class C {\n method()\n { bar(); baz() } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class C {\n method() {\n bar(); baz(); } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class C {\n method() { bar(); baz(); \n} \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 6 } },
        { code: "class C {\n static { bar(); baz() } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C {\n static\n { bar(); baz() } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C {\n static {\n bar(); baz(); } \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 2022 } },
        { code: "class C {\n static { bar(); baz(); \n} \n}", options: ["always", { omitLastInOneLineBlock: true }], languageOptions: { ecmaVersion: 2022 } },

        // omitLastInOneLineClassBody: true
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
                export class Variant2 extends SomeClass{type=2}
                export class Variant3 extends SomeClass{type=3}
                export class Variant4 extends SomeClass{type=4}
                export class Variant5 extends SomeClass{type=5}
            `,
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                        console.log(this.anotherType);
                    }
                }

                export class Variant1 extends SomeClass{type=1; anotherType=2}
            `,
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
                export class Variant2 extends SomeClass{type=2;}
                export class Variant3 extends SomeClass{type=3;}
                export class Variant4 extends SomeClass{type=4;}
                export class Variant5 extends SomeClass{type=5;}
            `,
            options: ["always", { omitLastInOneLineClassBody: false }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" }
        },
        {
            code: "class C {\nfoo;}",
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {foo;\n}",
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C {foo;\nbar;}",
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "{ foo; }",
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C\n{ foo }",
            options: ["always", { omitLastInOneLineClassBody: true }],
            languageOptions: { ecmaVersion: 2022 }
        },

        // method definitions and static blocks don't have a semicolon.
        { code: "class A { a() {} b() {} }", languageOptions: { ecmaVersion: 6 } },
        { code: "var A = class { a() {} b() {} };", languageOptions: { ecmaVersion: 6 } },
        { code: "class A { static {} }", languageOptions: { ecmaVersion: 2022 } },

        { code: "import theDefault, { named1, named2 } from 'src/mylib';", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "import theDefault, { named1, named2 } from 'src/mylib'", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // exports, "always"
        { code: "export * from 'foo';", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export { foo } from 'foo';", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var foo = 0;export { foo };", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export var foo;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function foo () { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function* foo () { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export class Foo { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export let foo;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export const FOO = 42;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function() { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function* () { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default class { }", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo || bar;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default (foo) => foo.bar();", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo = 42;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo += 42;", languageOptions: { ecmaVersion: 6, sourceType: "module" } },

        // exports, "never"
        { code: "export * from 'foo'", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export { foo } from 'foo'", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "var foo = 0; export { foo }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export var foo", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function foo () { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export function* foo () { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export class Foo { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export let foo", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export const FOO = 42", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function() { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default function* () { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default class { }", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo || bar", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default (foo) => foo.bar()", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo = 42", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "export default foo += 42", options: ["never"], languageOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "++\nfoo;", options: ["always"] },
        { code: "var a = b;\n+ c", options: ["never"] },

        // https://github.com/eslint/eslint/issues/7782
        { code: "var a = b;\n/foo/.test(c)", options: ["never"] },
        { code: "var a = b;\n`foo`", options: ["never"], languageOptions: { ecmaVersion: 6 } },

        // https://github.com/eslint/eslint/issues/9521
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "any" }]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "any" }]
        },
        {
            code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                var a = 0; export {a};
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                while (true) {
                    break;
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }]
        },
        {
            code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                var a = 0; export {a}
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        {
            code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2015 }
        },
        {
            code: `
                while (true) {
                    break
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }]
        },
        {
            code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2015 }
        },

        // Class fields
        {
            code: "class C { foo; }",
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo; }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = obj\n;[bar] }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo;\n[bar]; }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n;[bar] }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n[bar] }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo() {} }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo() {}; }", // no-extra-semi reports it
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static {}; }", // no-extra-semi reports it
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { a=b;\n*foo() {} }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { get;\nfoo() {} }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { set;\nfoo() {} }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static;\nfoo() {} }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { a=b;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { a=b;\ninstanceof }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    x
                    [foo]

                    x;
                    [foo]

                    x = "a";
                    [foo]
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: `
                class C {
                    x
                    [foo]

                    x;
                    [foo]

                    x = 1;
                    [foo]
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n[bar] }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { foo = () => {}\n;[bar] }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo] = bar;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #foo = bar;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static static = bar;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [foo];\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [get];\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { [get] = 5;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #get;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { #set = 5;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class C { static static;\nin }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "import * as utils from './utils'",
            output: "import * as utils from './utils';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 33,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "import { square, diag } from 'lib'",
            output: "import { square, diag } from 'lib';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 35,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "import { default as foo } from 'lib'",
            output: "import { default as foo } from 'lib';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 37,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "import 'src/mylib'",
            output: "import 'src/mylib';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 19,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "import theDefault, { named1, named2 } from 'src/mylib'",
            output: "import theDefault, { named1, named2 } from 'src/mylib';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 55,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "function foo() { return [] }",
            output: "function foo() { return []; }",
            errors: [{
                messageId: "missingSemi",
                type: "ReturnStatement",
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "while(true) { break }",
            output: "while(true) { break; }",
            errors: [{
                messageId: "missingSemi",
                type: "BreakStatement",
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21
            }]
        },
        {
            code: "while(true) { continue }",
            output: "while(true) { continue; }",
            errors: [{
                messageId: "missingSemi",
                type: "ContinueStatement",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "let x = 5",
            output: "let x = 5;",
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 10,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "var x = 5",
            output: "var x = 5;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 10,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "var x = 5, y",
            output: "var x = 5, y;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 13,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "debugger",
            output: "debugger;",
            errors: [{
                messageId: "missingSemi",
                type: "DebuggerStatement",
                line: 1,
                column: 9,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "foo()",
            output: "foo();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "foo()\n",
            output: "foo();\n",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\r\n",
            output: "foo();\r\n",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\nbar();",
            output: "foo();\nbar();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "foo()\r\nbar();",
            output: "foo();\r\nbar();",
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "for (var a in b) var i ",
            output: "for (var a in b) var i; ",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "for (;;){var i}",
            output: "for (;;){var i;}",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "for (;;) var i ",
            output: "for (;;) var i; ",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "for (var j;;) {var i}",
            output: "for (var j;;) {var i;}",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 22
            }]
        },
        {
            code: "var foo = {\n bar: baz\n}",
            output: "var foo = {\n bar: baz\n};",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 3,
                column: 2,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "var foo\nvar bar;",
            output: "var foo;\nvar bar;",
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 8,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "throw new Error('foo')",
            output: "throw new Error('foo');",
            errors: [{
                messageId: "missingSemi",
                type: "ThrowStatement",
                line: 1,
                column: 23,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "do{}while(true)",
            output: "do{}while(true);",
            errors: [{
                messageId: "missingSemi",
                type: "DoWhileStatement",
                line: 1,
                column: 16,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "if (foo) {bar()}",
            output: "if (foo) {bar();}",
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "if (foo) {bar()} ",
            output: "if (foo) {bar();} ",
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "if (foo) {bar()\n}",
            output: "if (foo) {bar();\n}",
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 16,
                endLine: 2,
                endColumn: 1
            }]
        },

        {
            code: "throw new Error('foo');",
            output: "throw new Error('foo')",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ThrowStatement",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "function foo() { return []; }",
            output: "function foo() { return [] }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ReturnStatement",
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "while(true) { break; }",
            output: "while(true) { break }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "BreakStatement",
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21
            }]
        },
        {
            code: "while(true) { continue; }",
            output: "while(true) { continue }",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ContinueStatement",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "let x = 5;",
            output: "let x = 5",
            options: ["never"],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "var x = 5;",
            output: "var x = 5",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 10,
                endLine: 1,
                endColumn: 11
            }]
        },
        {
            code: "var x = 5, y;",
            output: "var x = 5, y",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 13,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            code: "debugger;",
            output: "debugger",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "DebuggerStatement",
                line: 1,
                column: 9,
                endLine: 1,
                endColumn: 10
            }]
        },
        {
            code: "foo();",
            output: "foo()",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 6,
                endLine: 1,
                endColumn: 7
            }]
        },
        {
            code: "for (var a in b) var i; ",
            output: "for (var a in b) var i ",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 23,
                endLine: 1,
                endColumn: 24
            }]
        },
        {
            code: "for (;;){var i;}",
            output: "for (;;){var i}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "for (;;) var i; ",
            output: "for (;;) var i ",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "for (var j;;) {var i;}",
            output: "for (var j;;) {var i}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 21,
                endLine: 1,
                endColumn: 22
            }]
        },
        {
            code: "var foo = {\n bar: baz\n};",
            output: "var foo = {\n bar: baz\n}",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 3,
                column: 2,
                endLine: 3,
                endColumn: 3
            }]
        },
        {
            code: "import theDefault, { named1, named2 } from 'src/mylib';",
            output: "import theDefault, { named1, named2 } from 'src/mylib'",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ImportDeclaration",
                line: 1,
                column: 55,
                endLine: 1,
                endColumn: 56
            }]
        },
        {
            code: "do{}while(true);",
            output: "do{}while(true)",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                type: "DoWhileStatement",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "class C { static { foo() } }",
            output: "class C { static { foo(); } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 25,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "class C { static { foo() } }",
            output: "class C { static { foo(); } }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 25,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "class C { static { foo(); bar() } }",
            output: "class C { static { foo(); bar(); } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 32,
                endLine: 1,
                endColumn: 33
            }]
        },
        {
            code: "class C { static { foo()\nbar(); } }",
            output: "class C { static { foo();\nbar(); } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 25,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "class C { static { foo(); bar()\nbaz(); } }",
            output: "class C { static { foo(); bar();\nbaz(); } }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 32,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "class C { static { foo(); } }",
            output: "class C { static { foo() } }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 25,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "class C { static { foo();\nbar() } }",
            output: "class C { static { foo()\nbar() } }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement",
                line: 1,
                column: 25,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "class C { static { foo()\nbar(); } }",
            output: "class C { static { foo()\nbar() } }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement",
                line: 2,
                column: 6,
                endLine: 2,
                endColumn: 7
            }]
        },
        {
            code: "class C { static { foo()\nbar();\nbaz() } }",
            output: "class C { static { foo()\nbar()\nbaz() } }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                type: "ExpressionStatement",
                line: 2,
                column: 6,
                endLine: 2,
                endColumn: 7
            }]
        },
        {
            code: "class C { static { do ; while (foo)\n (a)} }",
            output: "class C { static { do ; while (foo);\n (a)} }",
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                type: "DoWhileStatement",
                line: 1,
                column: 36,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "class C { static { do ; while (foo)\n ;(a)} }",
            output: "class C { static { do ; while (foo)\n (a)} }",
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                type: "DoWhileStatement",
                line: 2,
                column: 2,
                endLine: 2,
                endColumn: 3
            }]
        },

        // omitLastInOneLineBlock: true
        {
            code: "if (foo) { bar()\n }",
            output: "if (foo) { bar();\n }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 17,
                endLine: 2,
                endColumn: 1
            }]
        },
        {
            code: "if (foo) {\n bar() }",
            output: "if (foo) {\n bar(); }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 7,
                endLine: 2,
                endColumn: 8
            }]
        },
        {
            code: "if (foo) {\n bar(); baz() }",
            output: "if (foo) {\n bar(); baz(); }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 14,
                endLine: 2,
                endColumn: 15
            }]
        },
        {
            code: "if (foo) { bar(); }",
            output: "if (foo) { bar() }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 18
            }]
        },
        {
            code: "function foo() { bar(); baz(); }",
            output: "function foo() { bar(); baz() }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 30,
                endLine: 1,
                endColumn: 31
            }]
        },
        {
            code: "function foo()\n{ bar(); baz(); }",
            output: "function foo()\n{ bar(); baz() }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 15,
                endLine: 2,
                endColumn: 16
            }]
        },
        {
            code: "function foo() {\n bar(); baz() }",
            output: "function foo() {\n bar(); baz(); }",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 14,
                endLine: 2,
                endColumn: 15
            }]
        },
        {
            code: "function foo() { bar(); baz() \n}",
            output: "function foo() { bar(); baz(); \n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 30,
                endLine: 1,
                endColumn: 31
            }]
        },
        {
            code: "class C {\nfoo() { bar(); baz(); }\n}",
            output: "class C {\nfoo() { bar(); baz() }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 21,
                endLine: 2,
                endColumn: 22
            }]
        },
        {
            code: "class C {\nfoo() \n{ bar(); baz(); }\n}",
            output: "class C {\nfoo() \n{ bar(); baz() }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 15,
                endLine: 3,
                endColumn: 16
            }]
        },
        {
            code: "class C {\nfoo() {\n bar(); baz() }\n}",
            output: "class C {\nfoo() {\n bar(); baz(); }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSemi",
                line: 3,
                column: 14,
                endLine: 3,
                endColumn: 15
            }]
        },
        {
            code: "class C {\nfoo() { bar(); baz() \n}\n}",
            output: "class C {\nfoo() { bar(); baz(); \n}\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 21,
                endLine: 2,
                endColumn: 22
            }]
        },
        {
            code: "class C {\nstatic { bar(); baz(); }\n}",
            output: "class C {\nstatic { bar(); baz() }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 22,
                endLine: 2,
                endColumn: 23
            }]
        },
        {
            code: "class C {\nstatic \n{ bar(); baz(); }\n}",
            output: "class C {\nstatic \n{ bar(); baz() }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 15,
                endLine: 3,
                endColumn: 16
            }]
        },
        {
            code: "class C {\nstatic {\n bar(); baz() }\n}",
            output: "class C {\nstatic {\n bar(); baz(); }\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                line: 3,
                column: 14,
                endLine: 3,
                endColumn: 15
            }]
        },
        {
            code: "class C {\nfoo() { bar(); baz() \n}\n}",
            output: "class C {\nfoo() { bar(); baz(); \n}\n}",
            options: ["always", { omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 21,
                endLine: 2,
                endColumn: 22
            }]
        },


        // exports, "always"
        {
            code: "export * from 'foo'",
            output: "export * from 'foo';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportAllDeclaration",
                line: 1,
                column: 20,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export { foo } from 'foo'",
            output: "export { foo } from 'foo';",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportNamedDeclaration",
                line: 1,
                column: 26,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "var foo = 0;export { foo }",
            output: "var foo = 0;export { foo };",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportNamedDeclaration",
                line: 1,
                column: 27,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export var foo",
            output: "export var foo;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export let foo",
            output: "export let foo;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export const FOO = 42",
            output: "export const FOO = 42;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 22,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export default foo || bar",
            output: "export default foo || bar;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 26,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export default (foo) => foo.bar()",
            output: "export default (foo) => foo.bar();",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 34,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export default foo = 42",
            output: "export default foo = 42;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 24,
                endLine: void 0,
                endColumn: void 0
            }]
        },
        {
            code: "export default foo += 42",
            output: "export default foo += 42;",
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 25,
                endLine: void 0,
                endColumn: void 0
            }]
        },

        // exports, "never"
        {
            code: "export * from 'foo';",
            output: "export * from 'foo'",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportAllDeclaration",
                line: 1,
                column: 20,
                endLine: 1,
                endColumn: 21
            }]
        },
        {
            code: "export { foo } from 'foo';",
            output: "export { foo } from 'foo'",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportNamedDeclaration",
                line: 1,
                column: 26,
                endLine: 1,
                endColumn: 27
            }]
        },
        {
            code: "var foo = 0;export { foo };",
            output: "var foo = 0;export { foo }",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportNamedDeclaration",
                line: 1,
                column: 27,
                endLine: 1,
                endColumn: 28
            }]
        },
        {
            code: "export var foo;",
            output: "export var foo",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "export let foo;",
            output: "export let foo",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "export const FOO = 42;",
            output: "export const FOO = 42",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "VariableDeclaration",
                line: 1,
                column: 22,
                endLine: 1,
                endColumn: 23
            }]
        },
        {
            code: "export default foo || bar;",
            output: "export default foo || bar",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 26,
                endLine: 1,
                endColumn: 27
            }]
        },
        {
            code: "export default (foo) => foo.bar();",
            output: "export default (foo) => foo.bar()",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 34,
                endLine: 1,
                endColumn: 35
            }]
        },
        {
            code: "export default foo = 42;",
            output: "export default foo = 42",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 24,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "export default foo += 42;",
            output: "export default foo += 42",
            options: ["never"],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                type: "ExportDefaultDeclaration",
                line: 1,
                column: 25,
                endLine: 1,
                endColumn: 26
            }]
        },
        {
            code: "a;\n++b",
            output: "a\n++b",
            options: ["never"],
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 2,
                endLine: 1,
                endColumn: 3
            }]
        },

        // https://github.com/eslint/eslint/issues/7928
        {
            code: [
                "/*eslint no-extra-semi: error */",
                "foo();",
                ";[0,1,2].forEach(bar)"
            ].join("\n"),
            output: [
                "/*eslint no-extra-semi: error */",
                "foo()",
                ";[0,1,2].forEach(bar)"
            ].join("\n"),
            options: ["never"],
            errors: [
                {
                    messageId: "extraSemi",
                    line: 2,
                    column: 6,
                    endLine: 2,
                    endColumn: 7
                },
                {
                    message: "Unnecessary semicolon.",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 2
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/9521
        {
            code: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 34,
                endLine: 3,
                endColumn: 1
            }]
        },
        {
            code: `
                var a = 0; export {a}
                [a] = b
            `,
            output: `
                var a = 0; export {a};
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 38,
                endLine: 3,
                endColumn: 1
            }]
        },
        {
            code: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            output: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "missingSemi",
                line: 3,
                column: 27,
                endLine: 4,
                endColumn: 1
            }]
        },
        {
            code: `
                while (true) {
                    break
                   +i
                }
            `,
            output: `
                while (true) {
                    break;
                   +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: [{
                messageId: "missingSemi",
                line: 3,
                column: 26,
                endLine: 4,
                endColumn: 1
            }]
        },
        {
            code: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: [{
                messageId: "missingSemi",
                line: 3,
                column: 29,
                endLine: 4,
                endColumn: 1
            }]
        },
        {
            code: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 29,
                endLine: 3,
                endColumn: 1
            }]
        },
        {
            code: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "always" }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "missingSemi",
                line: 2,
                column: 35,
                endLine: 3,
                endColumn: 1
            }]
        },
        {
            code: `
                import a from "a";
                [1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 34,
                endLine: 2,
                endColumn: 35
            }]
        },
        {
            code: `
                var a = 0; export {a};
                [a] = b
            `,
            output: `
                var a = 0; export {a}
                [a] = b
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 38,
                endLine: 2,
                endColumn: 39
            }]
        },
        {
            code: `
                function wrap() {
                    return;
                    ({a} = b)
                }
            `,
            output: `
                function wrap() {
                    return
                    ({a} = b)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 27,
                endLine: 3,
                endColumn: 28
            }]
        },
        {
            code: `
                while (true) {
                    break;
                    +i
                }
            `,
            output: `
                while (true) {
                    break
                    +i
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 26,
                endLine: 3,
                endColumn: 27
            }]
        },
        {
            code: `
                while (true) {
                    continue;
                    [1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 29,
                endLine: 3,
                endColumn: 30
            }]
        },
        {
            code: `
                do; while(a);
                [1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 29,
                endLine: 2,
                endColumn: 30
            }]
        },
        {
            code: `
                const f = () => {};
                [1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "extraSemi",
                line: 2,
                column: 35,
                endLine: 2,
                endColumn: 36
            }]
        },
        {
            code: `
                import a from "a"
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                import a from "a"
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18
            }]
        },
        {
            code: `
                var a = 0; export {a}
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                var a = 0; export {a}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 6, sourceType: "module" },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18
            }]
        },
        {
            code: `
                function wrap() {
                    return
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                function wrap() {
                    return
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 4,
                column: 21,
                endLine: 4,
                endColumn: 22
            }]
        },
        {
            code: `
                while (true) {
                    break
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    break
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 4,
                column: 21,
                endLine: 4,
                endColumn: 22
            }]
        },
        {
            code: `
                while (true) {
                    continue
                    ;[1,2,3].forEach(doSomething)
                }
            `,
            output: `
                while (true) {
                    continue
                    [1,2,3].forEach(doSomething)
                }
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 4,
                column: 21,
                endLine: 4,
                endColumn: 22
            }]
        },
        {
            code: `
                do; while(a)
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                do; while(a)
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18
            }]
        },
        {
            code: `
                const f = () => {}
                ;[1,2,3].forEach(doSomething)
            `,
            output: `
                const f = () => {}
                [1,2,3].forEach(doSomething)
            `,
            options: ["never", { beforeStatementContinuationChars: "never" }],
            languageOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "extraSemi",
                line: 3,
                column: 17,
                endLine: 3,
                endColumn: 18
            }]
        },

        // Class fields
        {
            code: "class C { foo }",
            output: "class C { foo; }",
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        },
        {
            code: "class C { foo }",
            output: "class C { foo; }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        },
        {
            code: "class C { foo; }",
            output: "class C { foo }",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 14,
                endLine: 1,
                endColumn: 15
            }]
        },
        {
            code: "class C { foo\n[bar]; }",
            output: "class C { foo;\n[bar]; }",
            options: ["always"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "missingSemi",
                line: 1,
                column: 14,
                endLine: 2,
                endColumn: 1
            }]
        },

        // class fields
        {
            code: "class C { [get];\nfoo\n}",
            output: "class C { [get]\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "class C { [set];\nfoo\n}",
            output: "class C { [set]\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "class C { #get;\nfoo\n}",
            output: "class C { #get\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "class C { #set;\nfoo\n}",
            output: "class C { #set\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 15,
                endLine: 1,
                endColumn: 16
            }]
        },
        {
            code: "class C { #static;\nfoo\n}",
            output: "class C { #static\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 18,
                endLine: 1,
                endColumn: 19
            }]
        },
        {
            code: "class C { get=1;\nfoo\n}",
            output: "class C { get=1\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 16,
                endLine: 1,
                endColumn: 17
            }]
        },
        {
            code: "class C { static static;\nfoo\n}",
            output: "class C { static static\nfoo\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 24,
                endLine: 1,
                endColumn: 25
            }]
        },
        {
            code: "class C { static;\n}",
            output: "class C { static\n}",
            options: ["never"],
            languageOptions: { ecmaVersion: 2022 },
            errors: [{
                messageId: "extraSemi",
                line: 1,
                column: 17,
                endLine: 1,
                endColumn: 18
            }]
        },

        // omitLastInOneLineClassBody
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
            `,
            output: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
            `,
            options: ["always", { omitLastInOneLineClassBody: false }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "missingSemi",
                    line: 8,
                    column: 63,
                    endLine: 8,
                    endColumn: 64
                }
            ]
        },
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
            `,
            output: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
            `,
            options: ["always", { omitLastInOneLineClassBody: false, omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "missingSemi",
                    line: 8,
                    column: 63,
                    endLine: 8,
                    endColumn: 64
                }
            ]
        },
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1;}
            `,
            output: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                    }
                }

                export class Variant1 extends SomeClass{type=1}
            `,
            options: ["always", { omitLastInOneLineClassBody: true, omitLastInOneLineBlock: false }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "extraSemi",
                    line: 8,
                    column: 63,
                    endLine: 8,
                    endColumn: 64
                }
            ]
        },
        {
            code: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                        console.log(this.anotherType);
                    }
                }

                export class Variant1 extends SomeClass{type=1; anotherType=2}
            `,
            output: `
                export class SomeClass{
                    logType(){
                        console.log(this.type);
                        console.log(this.anotherType);
                    }
                }

                export class Variant1 extends SomeClass{type=1; anotherType=2;}
            `,
            options: ["always", { omitLastInOneLineClassBody: false, omitLastInOneLineBlock: true }],
            languageOptions: { ecmaVersion: 2022, sourceType: "module" },
            errors: [
                {
                    messageId: "missingSemi",
                    line: 9,
                    column: 78,
                    endLine: 9,
                    endColumn: 79
                }
            ]
        }
    ]
});
