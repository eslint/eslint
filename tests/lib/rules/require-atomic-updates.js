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
    message: "Possible race condition: `foo` might be reassigned based on an outdated value of `foo`.",
    type: "AssignmentExpression"
};

const STATIC_PROPERTY_ERROR = {
    message: "Possible race condition: `foo.bar` might be reassigned based on an outdated value of `foo.bar`.",
    type: "AssignmentExpression"
};

const COMPUTED_PROPERTY_ERROR = {
    message: "Possible race condition: `foo[bar].baz` might be reassigned based on an outdated value of `foo[bar].baz`.",
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
        "async function x() { let foo; bar(() => { let foo; blah(foo); }); foo += await result; }"
    ],

    invalid: [
        {
            code: "let foo; async function x() { foo += await amount; }",
            errors: [VARIABLE_ERROR]
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
        }
    ]
});
