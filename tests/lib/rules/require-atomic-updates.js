/**
 * @fileoverview disallow assignments that can lead to race conditions due to usage of `await` or `yield`
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/require-atomic-updates");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

const VARIABLE_ERROR = {
    messageId: "nonAtomicUpdate",
    data: { value: "foo" },
    type: "AssignmentExpression"
};

const STATIC_PROPERTY_ERROR = {
    messageId: "nonAtomicUpdate",
    data: { value: "foo.bar" },
    type: "AssignmentExpression"
};

const COMPUTED_PROPERTY_ERROR = {
    messageId: "nonAtomicUpdate",
    data: { value: "foo[bar].baz" },
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
        `
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
            code: "async function x() { foo += await bar; }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo = 0; async function x() { foo = (a ? b : foo) + await bar; if (baz); }",
            errors: [VARIABLE_ERROR]
        },
        {
            code: "let foo = 0; async function x() { foo = (a ? b ? c ? d ? foo : e : f : g : h) + await bar; if (baz); }",
            errors: [VARIABLE_ERROR]
        }
    ]
});
