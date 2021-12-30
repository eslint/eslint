/**
 * @fileoverview disallow assignments that can lead to race conditions due to usage of `await` or `yield`
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-atomic-updates");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2022 } });

const VARIABLE_ERROR = {
    messageId: "nonAtomicUpdate",
    data: { value: "foo" },
    type: "AssignmentExpression"
};

const STATIC_PROPERTY_ERROR = {
    messageId: "nonAtomicObjectUpdate",
    data: { value: "foo.bar", object: "foo" },
    type: "AssignmentExpression"
};

const COMPUTED_PROPERTY_ERROR = {
    messageId: "nonAtomicObjectUpdate",
    data: { value: "foo[bar].baz", object: "foo" },
    type: "AssignmentExpression"
};

const PRIVATE_PROPERTY_ERROR = {
    messageId: "nonAtomicObjectUpdate",
    data: { value: "foo.#bar", object: "foo" },
    type: "AssignmentExpression"
};

ruleTester.run("require-atomic-updates", rule, {

    valid: [
        "let foo; async function x() { foo += bar; }",
        "let foo; async function x() { foo = foo + bar; }",
        "let foo; async function x() { foo = await bar + foo; }",
        "async function x() { let foo; foo += await bar; }",
        "let foo; async function x() { foo = (await result)(foo); }",
        "let foo; async function x() { foo = bar(await something, foo) }",
        "function* x() { let foo; foo += yield bar; }",
        "const foo = {}; async function x() { foo.bar = await baz; }",
        "const foo = []; async function x() { foo[x] += 1;  }",
        "let foo; function* x() { foo = bar + foo; }",
        "async function x() { let foo; bar(() => baz += 1); foo += await amount; }",
        "let foo; async function x() { foo = condition ? foo : await bar; }",
        "async function x() { let foo; bar(() => { let foo; blah(foo); }); foo += await result; }",
        "let foo; async function x() { foo = foo + 1; await bar; }",
        "async function x() { foo += await bar; }",


        /*
         * Ensure rule doesn't take exponential time in the number of branches
         * (see https://github.com/eslint/eslint/issues/10893)
         */
        `
            async function foo() {
                if (1);
                if (2);
                if (3);
                if (4);
                if (5);
                if (6);
                if (7);
                if (8);
                if (9);
                if (10);
                if (11);
                if (12);
                if (13);
                if (14);
                if (15);
                if (16);
                if (17);
                if (18);
                if (19);
                if (20);
            }
        `,
        `
            async function foo() {
                return [
                    1 ? a : b,
                    2 ? a : b,
                    3 ? a : b,
                    4 ? a : b,
                    5 ? a : b,
                    6 ? a : b,
                    7 ? a : b,
                    8 ? a : b,
                    9 ? a : b,
                    10 ? a : b,
                    11 ? a : b,
                    12 ? a : b,
                    13 ? a : b,
                    14 ? a : b,
                    15 ? a : b,
                    16 ? a : b,
                    17 ? a : b,
                    18 ? a : b,
                    19 ? a : b,
                    20 ? a : b
                ];
            }
        `,

        // https://github.com/eslint/eslint/issues/11194
        `
            async function f() {
                let records
                records = await a.records
                g(() => { records })
            }
        `,

        // https://github.com/eslint/eslint/issues/11687
        `
            async function f() {
                try {
                    this.foo = doSomething();
                } catch (e) {
                    this.foo = null;
                    await doElse();
                }
            }
        `,

        // https://github.com/eslint/eslint/issues/11723
        `
            async function f(foo) {
                let bar = await get(foo.id);
                bar.prop = foo.prop;
            }
        `,
        `
            async function f(foo) {
                let bar = await get(foo.id);
                foo = bar.prop;
            }
        `,
        `
            async function f() {
                let foo = {}
                let bar = await get(foo.id);
                foo.prop = bar.prop;
            }
        `,

        // https://github.com/eslint/eslint/issues/11954
        `
            let count = 0
            let queue = []
            async function A(...args) {
                count += 1
                await new Promise(resolve=>resolve())
                count -= 1
                return
            }
        `,

        // https://github.com/eslint/eslint/issues/14208
        `
            async function foo(e) {
            }

            async function run() {
              const input = [];
              const props = [];

              for(const entry of input) {
                const prop = props.find(a => a.id === entry.id) || null;
                await foo(entry);
              }

              for(const entry of input) {
                const prop = props.find(a => a.id === entry.id) || null;
              }

              for(const entry2 of input) {
                const prop = props.find(a => a.id === entry2.id) || null;
              }
            }
        `,

        `
            async function run() {
              {
                let entry;
                await entry;
              }
              {
                let entry;
                () => entry;

                entry = 1;
              }
            }
        `,

        `
            async function run() {
                await a;
                b = 1;
            }
        `,

        // allowProperties
        {
            code: `
                async function a(foo) {
                    if (foo.bar) {
                        foo.bar = await something;
                    }
                }
            `,
            options: [{ allowProperties: true }]
        },
        {
            code: `
                function* g(foo) {
                    baz = foo.bar;
                    yield something;
                    foo.bar = 1;
                }
            `,
            options: [{ allowProperties: true }]
        }
    ],

    invalid: [
        {
            code: "let foo; async function x() { foo += await amount; }",
            errors: [{ messageId: "nonAtomicUpdate", data: { value: "foo" } }]
        },
        {
            code: "if (1); let foo; async function x() { foo += await amount; }",
            errors: [{ messageId: "nonAtomicUpdate", data: { value: "foo" } }]
        },
        {
            code: "let foo; async function x() { while (condition) { foo += await amount; } }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = foo + await amount; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = foo + (bar ? baz : await amount); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = foo + (bar ? await amount : baz); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = condition ? foo + await amount : somethingElse; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = (condition ? foo : await bar) + await bar; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo += bar + await amount; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "async function x() { let foo; bar(() => foo); foo += await amount; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; function* x() { foo += yield baz }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = bar(foo, await something) }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "const foo = {}; async function x() { foo.bar += await baz }",
            errors: [STATIC_PROPERTY_ERROR]
        },
        {
            code: "const foo = []; async function x() { foo[bar].baz += await result;  }",
            errors: [COMPUTED_PROPERTY_ERROR]
        },
        {
            code: "const foo = {}; class C { #bar; async wrap() { foo.#bar += await baz } }",
            errors: [PRIVATE_PROPERTY_ERROR]
        },
        {
            code: "let foo; async function* x() { foo = (yield foo) + await bar; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = foo + await result(foo); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = await result(foo, await somethingElse); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "function* x() { let foo; yield async function y() { foo += await bar; } }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function* x() { foo = await foo + (yield bar); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo; async function x() { foo = bar + await foo; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo = {}; async function x() { foo[bar].baz = await (foo.bar += await foo[bar].baz) }",
            errors: [COMPUTED_PROPERTY_ERROR, STATIC_PROPERTY_ERROR]
        },
        {
            code: "let foo = ''; async function x() { foo += await bar; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo = 0; async function x() { foo = (a ? b : foo) + await bar; if (baz); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo = 0; async function x() { foo = (a ? b ? c ? d ? foo : e : f : g : h) + await bar; if (baz); }",
            errors: [VARIABLE_ERROR]
        },

        // https://github.com/eslint/eslint/issues/11723
        {
            code: `
                async function f(foo) {
                    let buz = await get(foo.id);
                    foo.bar = buz.bar;
                }
            `,
            errors: [STATIC_PROPERTY_ERROR]
        },

        // https://github.com/eslint/eslint/issues/15076
        {
            code: `
                async () => {
                    opts.spec = process.stdin;
                    try {
                        const { exit_code } = await run(opts);
                        process.exitCode = exit_code;
                    } catch (e) {
                        process.exitCode = 1;
                    }
              };
            `,
            env: { node: true },
            errors: [
                {
                    messageId: "nonAtomicObjectUpdate",
                    data: { value: "process.exitCode", object: "process" },
                    type: "AssignmentExpression",
                    line: 6
                },
                {
                    messageId: "nonAtomicObjectUpdate",
                    data: { value: "process.exitCode", object: "process" },
                    type: "AssignmentExpression",
                    line: 8
                }
            ]
        },

        // allowProperties
        {
            code: `
                async function a(foo) {
                    if (foo.bar) {
                        foo.bar = await something;
                    }
                }
            `,
            errors: [STATIC_PROPERTY_ERROR]
        },
        {
            code: `
                function* g(foo) {
                    baz = foo.bar;
                    yield something;
                    foo.bar = 1;
                }
            `,
            errors: [STATIC_PROPERTY_ERROR]
        },
        {
            code: `
                async function a(foo) {
                    if (foo.bar) {
                        foo.bar = await something;
                    }
                }
            `,
            options: [{}],
            errors: [STATIC_PROPERTY_ERROR]

        },
        {
            code: `
                function* g(foo) {
                    baz = foo.bar;
                    yield something;
                    foo.bar = 1;
                }
            `,
            options: [{}],
            errors: [STATIC_PROPERTY_ERROR]
        },
        {
            code: `
                async function a(foo) {
                    if (foo.bar) {
                        foo.bar = await something;
                    }
                }
            `,
            options: [{ allowProperties: false }],
            errors: [STATIC_PROPERTY_ERROR]

        },
        {
            code: `
                function* g(foo) {
                    baz = foo.bar;
                    yield something;
                    foo.bar = 1;
                }
            `,
            options: [{ allowProperties: false }],
            errors: [STATIC_PROPERTY_ERROR]
        },
        {
            code: `
                let foo;
                async function a() {
                    if (foo) {
                        foo = await something;
                    }
                }
            `,
            options: [{ allowProperties: true }],
            errors: [VARIABLE_ERROR]

        },
        {
            code: `
                let foo;
                function* g() {
                    baz = foo;
                    yield something;
                    foo = 1;
                }
            `,
            options: [{ allowProperties: true }],
            errors: [VARIABLE_ERROR]
        }
    ]
});
