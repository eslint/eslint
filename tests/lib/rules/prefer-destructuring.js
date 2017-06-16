/**
 * @fileoverview Prefer destructuring from arrays and objects
 * @author Alex LaFroscia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-destructuring"),
    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("prefer-destructuring", rule, {
    valid: [
        {
            code: "var [foo] = array;"
        },
        {
            code: "var { foo } = object;"
        },
        {

            // Ensure that this doesn't break variable declarating without assignment
            code: "var foo;"
        },
        {

            // Ensure that the default behavior does not require desturcturing when renaming
            code: "var foo = object.bar;",
            options: [{ object: true }]
        },
        {
            code: "var foo = object.bar;",
            options: [{ object: true }, { enforceForRenamedProperties: false }]
        },
        {
            code: "var foo = object['bar'];",
            options: [{ object: true }, { enforceForRenamedProperties: false }]
        },
        {
            code: "var foo = object[bar];",
            options: [{ object: true }, { enforceForRenamedProperties: false }]
        },
        {
            code: "var { bar: foo } = object;",
            options: [{ object: true }, { enforceForRenamedProperties: true }]
        },
        {
            code: "var { [bar]: foo } = object;",
            options: [{ object: true }, { enforceForRenamedProperties: true }]
        },
        {
            code: "var foo = array[0];",
            options: [{ array: false }]
        },
        {
            code: "var foo = object.foo;",
            options: [{ object: false }]
        },
        {
            code: "var foo = object['foo'];",
            options: [{ object: false }]
        },
        {
            code: "({ foo } = object);"
        },
        {

            // Fix #8654
            code: "var foo = array[0];",
            options: [{ array: false }, { enforceForRenamedProperties: true }]
        },
        "[foo] = array;",
        "foo += array[0]",
        "foo += bar.foo"
    ],

    invalid: [
        {
            code: "var foo = array[0];",
            errors: [{
                message: "Use array destructuring.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "foo = array[0];",
            errors: [{
                message: "Use array destructuring.",
                type: "AssignmentExpression"
            }]
        },
        {
            code: "var foo = object.foo;",
            errors: [{
                message: "Use object destructuring.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foobar = object.bar;",
            options: [{ object: true }, { enforceForRenamedProperties: true }],
            errors: [{
                message: "Use object destructuring.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = object[bar];",
            options: [{ object: true }, { enforceForRenamedProperties: true }],
            errors: [{
                message: "Use object destructuring.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = array['foo'];",
            errors: [{
                message: "Use object destructuring.",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "foo = array.foo;",
            errors: [{
                message: "Use object destructuring.",
                type: "AssignmentExpression"
            }]
        },
        {
            code: "foo = array['foo'];",
            errors: [{
                message: "Use object destructuring.",
                type: "AssignmentExpression"
            }]
        }
    ]
});
