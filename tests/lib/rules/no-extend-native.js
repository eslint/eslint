/**
 * @fileoverview Tests for no-extend-native rule.
 * @author David Nelson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-extend-native"),
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

ruleTester.run("no-extend-native", rule, {
    valid: [
        "x.prototype.p = 0",
        "x.prototype['p'] = 0",
        "Object.p = 0",
        "Object.toString.bind = 0",
        "Object['toString'].bind = 0",
        "Object.defineProperty(x, 'p', {value: 0})",
        "Object.defineProperties(x, {p: {value: 0}})",
        "global.Object.prototype.toString = 0",
        "this.Object.prototype.toString = 0",
        "with(Object) { prototype.p = 0; }",
        "o = Object; o.prototype.toString = 0",
        "eval('Object.prototype.toString = 0')",
        "parseFloat.prototype.x = 1",
        {
            code: "Object.prototype.g = 0",
            options: [{ exceptions: ["Object"] }]
        },
        "obj[Object.prototype] = 0",

        // https://github.com/eslint/eslint/issues/4438
        "Object.defineProperty()",
        "Object.defineProperties()",

        // https://github.com/eslint/eslint/issues/8461
        "function foo() { var Object = function() {}; Object.prototype.p = 0 }",
        {
            code: "{ let Object = function() {}; Object.prototype.p = 0 }",
            languageOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [{
        code: "Object.prototype.p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Object" },
            type: "AssignmentExpression"
        }]
    }, {
        code: "BigInt.prototype.p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "BigInt" },
            type: "AssignmentExpression"
        }],
        languageOptions: { ecmaVersion: 2020 }
    }, {
        code: "WeakRef.prototype.p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "WeakRef" },
            type: "AssignmentExpression"
        }],
        languageOptions: { ecmaVersion: 2021 }
    }, {
        code: "FinalizationRegistry.prototype.p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "FinalizationRegistry" },
            type: "AssignmentExpression"
        }],
        languageOptions: { ecmaVersion: 2021 }
    }, {
        code: "AggregateError.prototype.p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "AggregateError" },
            type: "AssignmentExpression"
        }],
        languageOptions: { ecmaVersion: 2021 }
    }, {
        code: "Function.prototype['p'] = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Function" },
            type: "AssignmentExpression"
        }]
    }, {
        code: "String['prototype'].p = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "String" },
            type: "AssignmentExpression"
        }]
    }, {
        code: "Number['prototype']['p'] = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Number" },
            type: "AssignmentExpression"
        }]
    }, {
        code: "Object.defineProperty(Array.prototype, 'p', {value: 0})",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Array" },
            type: "CallExpression"
        }]
    }, {
        code: "Object.defineProperties(Array.prototype, {p: {value: 0}})",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Array" },
            type: "CallExpression"
        }]
    }, {
        code: "Object.defineProperties(Array.prototype, {p: {value: 0}, q: {value: 0}})",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Array" },
            type: "CallExpression"
        }]
    },
    {
        code: "Number['prototype']['p'] = 0",
        options: [{ exceptions: ["Object"] }],
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Number" },
            type: "AssignmentExpression"
        }]
    },
    {
        code: "Object.prototype.p = 0; Object.prototype.q = 0",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Object" },
            type: "AssignmentExpression",
            column: 1
        }, {
            messageId: "unexpected",
            data: { builtin: "Object" },
            type: "AssignmentExpression",
            column: 25
        }]
    },
    {
        code: "function foo() { Object.prototype.p = 0 }",
        errors: [{
            messageId: "unexpected",
            data: { builtin: "Object" },
            type: "AssignmentExpression"
        }]
    },

    // Optional chaining
    {
        code: "(Object?.prototype).p = 0",
        errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
        languageOptions: { ecmaVersion: 2020 }
    },
    {
        code: "Object.defineProperty(Object?.prototype, 'p', { value: 0 })",
        errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
        languageOptions: { ecmaVersion: 2020 }
    },
    {
        code: "Object?.defineProperty(Object.prototype, 'p', { value: 0 })",
        errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
        languageOptions: { ecmaVersion: 2020 }
    },
    {
        code: "(Object?.defineProperty)(Object.prototype, 'p', { value: 0 })",
        errors: [{ messageId: "unexpected", data: { builtin: "Object" } }],
        languageOptions: { ecmaVersion: 2020 }
    },

    // Logical assignments
    {
        code: "Array.prototype.p &&= 0",
        errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
        languageOptions: { ecmaVersion: 2021 }
    },
    {
        code: "Array.prototype.p ||= 0",
        errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
        languageOptions: { ecmaVersion: 2021 }
    },
    {
        code: "Array.prototype.p ??= 0",
        errors: [{ messageId: "unexpected", data: { builtin: "Array" } }],
        languageOptions: { ecmaVersion: 2021 }
    }

    ]
});
