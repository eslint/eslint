/**
 * @fileoverview Tests for no-useless-assignment rule.
 * @author Yosuke Ota
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-assignment");
const RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    plugins: {
        test: {
            rules: {
                "use-a": {
                    create(context) {
                        const sourceCode = context.sourceCode;

                        return {
                            VariableDeclaration(node) {
                                sourceCode.markVariableAsUsed("a", node);
                            }
                        };
                    }
                }
            }
        }
    }
});


ruleTester.run("no-useless-assignment", rule, {
    valid: [

        // Basic tests
        `let v = 'used';
        console.log(v);
        v = 'used-2'
        console.log(v);`,
        `function foo() {
            let v = 'used';
            console.log(v);
            v = 'used-2';
            console.log(v);
        }`,
        `function foo() {
            let v = 'used';
            if (condition) {
                v = 'used-2';
                console.log(v);
                return
            }
            console.log(v);
        }`,
        `function foo() {
            let v = 'used';
            if (condition) {
                console.log(v);
            } else {
                v = 'used-2';
                console.log(v);
            }
        }`,
        `function foo() {
            let v = 'used';
            if (condition) {
                //
            } else {
                v = 'used-2';
            }
            console.log(v);
        }`,
        `var foo = function () {
            let v = 'used';
            console.log(v);
            v = 'used-2'
            console.log(v);
        }`,
        `var foo = () => {
            let v = 'used';
            console.log(v);
            v = 'used-2'
            console.log(v);
        }`,
        `class foo {
            static {
                let v = 'used';
                console.log(v);
                v = 'used-2'
                console.log(v);
            }
        }`,
        `function foo () {
            let v = 'used';
            for (let i = 0; i < 10; i++) {
                console.log(v);
                v = 'used in next iteration';
            }
        }`,
        `function foo () {
            let i = 0;
            i++;
            i++;
            console.log(i);
        }`,

        // Exported
        `export let foo = 'used';
        console.log(foo);
        foo = 'unused like but exported';`,
        `export function foo () {};
        console.log(foo);
        foo = 'unused like but exported';`,
        `export class foo {};
        console.log(foo);
        foo = 'unused like but exported';`,
        `export default function foo () {};
        console.log(foo);
        foo = 'unused like but exported';`,
        `export default class foo {};
        console.log(foo);
        foo = 'unused like but exported';`,
        `let foo = 'used';
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';`,
        `function foo () {};
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';`,
        `class foo {};
        export { foo };
        console.log(foo);
        foo = 'unused like but exported';`,
        {
            code:
            `/* exported foo */
            let foo = 'used';
            console.log(foo);
            foo = 'unused like but exported with directive';`,
            languageOptions: { sourceType: "script" }
        },

        // Mark variables as used via markVariableAsUsed()
        `/*eslint test/use-a:1*/
        let a = 'used';
        console.log(a);
        a = 'unused like but marked by markVariableAsUsed()';
        `,

        // Unknown variable
        `v = 'used';
        console.log(v);
        v = 'unused'`,

        // Unused variable
        "let v = 'used variable';",

        // Unreachable
        `function foo() {
            return;

            const x = 1;
            if (y) {
                bar(x);
            }
        }`,
        `function foo() {
            const x = 1;
            console.log(x);
            return;

            x = 'Foo'
        }`,

        // Update
        `function foo() {
            let a = 42;
            console.log(a);
            a++;
            console.log(a);
        }`,
        `function foo() {
            let a = 42;
            console.log(a);
            a--;
            console.log(a);
        }`,

        // Assign with update
        `function foo() {
            let a = 42;
            console.log(a);
            a = 10;
            a = a + 1;
            console.log(a);
        }`,
        `function foo() {
            let a = 42;
            console.log(a);
            a = 10;
            if (cond) {
                a = a + 1;
            } else {
                a = 2 + a;
            }
            console.log(a);
        }`,

        // Assign to complex patterns
        `function foo() {
            let a = 'used', b = 'used', c = 'used', d = 'used';
            console.log(a, b, c, d);
            ({ a, arr: [b, c, ...d] } = fn());
            console.log(a, b, c, d);
        }`,
        `function foo() {
            let a = 'used', b = 'used', c = 'used';
            console.log(a, b, c);
            ({ a = 'unused', foo: b, ...c } = fn());
            console.log(a, b, c);
        }`,
        `function foo() {
            let a = {};
            console.log(a);
            a.b = 'unused like, but maybe used in setter';
        }`,
        `function foo() {
            let a = { b: 42 };
            console.log(a);
            a.b++;
        }`,

        // Value may be used in other scopes.
        `function foo () {
            let v = 'used';
            console.log(v);
            function bar() {
                v = 'used in outer scope';
            }
            bar();
            console.log(v);
        }`,
        `function foo () {
            let v = 'used';
            console.log(v);
            setTimeout(() => console.log(v), 1);
            v = 'used in other scope';
        }`,

        // Loops
        `function foo () {
            let v = 'used';
            console.log(v);
            for (let i = 0; i < 10; i++) {
                if (condition) {
                    v = 'maybe used';
                    continue;
                }
                console.log(v);
            }
        }`,

        // Ignore known globals
        `/* globals foo */
        const bk = foo;
        foo = 42;
        try {
            // process
        } finally {
            foo = bk;
        }`,
        {
            code: `
            const bk = console;
            console = { log () {} };
            try {
                // process
            } finally {
                console = bk;
            }`,
            languageOptions: {
                globals: { console: false }
            }
        },

        // Try catch finally
        `let message = 'init';
        try {
            const result = call();
            message = result.message;
        } catch (e) {
            // ignore
        }
        console.log(message)`,
        `let message = 'init';
        try {
            message = call().message;
        } catch (e) {
            // ignore
        }
        console.log(message)`,
        `let v = 'init';
        try {
            v = callA();
            try {
                v = callB();
            } catch (e) {
                // ignore
            }
        } catch (e) {
            // ignore
        }
        console.log(v)`,
        `let v = 'init';
        try {
            try {
                v = callA();
            } catch (e) {
                // ignore
            }
        } catch (e) {
            // ignore
        }
        console.log(v)`,
        `let a;
        try {
            foo();
        } finally {
            a = 5;
        }
        console.log(a);`,

        // An expression within an assignment.
        `const obj = { a: 5 };
        const { a, b = a } = obj;
        console.log(b); // 5`,
        `const arr = [6];
        const [c, d = c] = arr;
        console.log(d); // 6`,
        `const obj = { a: 1 };
        let {
            a,
            b = (a = 2)
        } = obj;
        console.log(a, b);`,
        `let { a, b: {c = a} = {} } = obj;
        console.log(c);`
    ],
    invalid: [
        {
            code:
            `let v = 'used';
            console.log(v);
            v = 'unused'`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                if (condition) {
                    v = 'unused';
                    return
                }
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                if (condition) {
                    console.log(v);
                } else {
                    v = 'unused';
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 6,
                    column: 21
                }
            ]
        },
        {
            code:
            `var foo = function () {
                let v = 'used';
                console.log(v);
                v = 'unused'
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `var foo = () => {
                let v = 'used';
                console.log(v);
                v = 'unused'
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `class foo {
                static {
                    let v = 'used';
                    console.log(v);
                    v = 'unused'
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'unused';
                if (condition) {
                    v = 'used';
                    console.log(v);
                    return
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 2,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'unused';
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'used';
                console.log(v);
                v = 'used';
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code: `
            let v;
            v = 'unused';
            if (foo) {
                v = 'used';
            } else {
                v = 'used';
            }
            console.log(v);`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                console.log(v);
                v = 'unused';
                v = 'unused';
                v = 'used';
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'unused';
                if (condition) {
                    if (condition2) {
                        v = 'used-2';
                    } else {
                        v = 'used-3';
                    }
                } else {
                    v = 'used-4';
                }
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 2,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo() {
                let v;
                if (condition) {
                    v = 'unused';
                } else {
                    //
                }
                if (condition2) {
                    v = 'used-1';
                } else {
                    v = 'used-2';
                }
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                if (condition) {
                    v = 'unused';
                    v = 'unused';
                    v = 'used';
                }
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 21
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 21
                }
            ]
        },

        // Update
        {
            code:
            `function foo() {
                let a = 42;
                console.log(a);
                a++;
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo() {
                let a = 42;
                console.log(a);
                a--;
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },

        // Assign to complex patterns
        {
            code:
            `function foo() {
                let a = 'used', b = 'used', c = 'used', d = 'used';
                console.log(a, b, c, d);
                ({ a, arr: [b, c,, ...d] } = fn());
                console.log(c);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 20
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 29
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 39
                }
            ]
        },
        {
            code:
            `function foo() {
                let a = 'used', b = 'used', c = 'used';
                console.log(a, b, c);
                ({ a = 'unused', foo: b, ...c } = fn());
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 20
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 39
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 45
                }
            ]
        },

        // Variable used in other scopes, but write only.
        {
            code:
            `function foo () {
                let v = 'used';
                console.log(v);
                setTimeout(() => v = 42, 1);
                v = 'unused and variable is only updated in other scopes';
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 17
                }
            ]
        },

        // Code Path Segment End Statements
        {
            code:
            `function foo() {
                let v = 'used';
                if (condition) {
                    let v = 'used';
                    console.log(v);
                    v = 'unused';
                }
                console.log(v);
                v = 'unused';
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 6,
                    column: 21
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 9,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo() {
                let v = 'used';
                if (condition) {
                    console.log(v);
                    v = 'unused';
                } else {
                    v = 'unused';
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 21
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 7,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo () {
                let v = 'used';
                console.log(v);
                v = 'unused';
                return;
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo () {
                let v = 'used';
                console.log(v);
                v = 'unused';
                throw new Error();
                console.log(v);
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code:
            `function foo () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    v = 'unused';
                    continue;
                    console.log(v);
                }
            }
            function bar () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    v = 'unused';
                    break;
                    console.log(v);
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 5,
                    column: 21
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 14,
                    column: 21
                }
            ]
        },
        {
            code:
            `function foo () {
                let v = 'used';
                console.log(v);
                for (let i = 0; i < 10; i++) {
                    if (condition) {
                        v = 'unused';
                        break;
                    }
                    console.log(v);
                }
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 6,
                    column: 25
                }
            ]
        },

        // Try catch
        {
            code:
            `let message = 'unused';
            try {
                const result = call();
                message = result.message;
            } catch (e) {
                message = 'used';
            }
            console.log(message)`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code:
            `let message = 'unused';
            try {
                message = 'used';
                console.log(message)
            } catch (e) {
            }`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code:
            `let message = 'unused';
            try {
                message = call();
            } catch (e) {
                message = 'used';
            }
            console.log(message)`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code:
            `let v = 'unused';
            try {
                v = callA();
                try {
                    v = callB();
                } catch (e) {
                    // ignore
                }
            } catch (e) {
                v = 'used';
            }
            console.log(v)`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 1,
                    column: 5
                }
            ]
        },

        // An expression within an assignment.
        {
            code: `
            var x = 1; // used
            x = x + 1; // unused
            x = 5; // used
            f(x);`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 3,
                    column: 13
                }
            ]
        },
        {
            code: `
            var x = 1; // used
            x = // used
                x++; // unused
            f(x);`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 17
                }
            ]
        },
        {
            code: `const obj = { a: 1 };
            let {
                a,
                b = (a = 2)
            } = obj;
            a = 3
            console.log(a, b);`,
            errors: [
                {
                    messageId: "unnecessaryAssignment",
                    line: 3,
                    column: 17
                },
                {
                    messageId: "unnecessaryAssignment",
                    line: 4,
                    column: 22
                }
            ]
        }
    ]
});
