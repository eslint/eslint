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
            code: "var foo = object.bar;"
        },
        {
            code: "var foo = object['bar'];"
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
        }
    ],

    invalid: [
        {
            code: "var foo = array[0];",
            errors: [{
                message: "Use array destructuring",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = array.foo;",
            errors: [{
                message: "Use object destructuring",
                type: "VariableDeclarator"
            }]
        },
        {
            code: "var foo = array['foo'];",
            errors: [{
                message: "Use object destructuring",
                type: "VariableDeclarator"
            }]
        }
    ]
});
