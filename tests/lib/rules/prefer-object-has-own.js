/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Nitin Kumar, Gautam Arora
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-object-has-own");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = {
    ecmaVersion: 2022
};

const ruleTester = new RuleTester({ parserOptions });
const error = { messageId: "useHasOwn" };

ruleTester.run("prefer-object-has-own", rule, {
    valid: [
        `
        let obj = {};
        Object.hasOwn(obj,"");
        `
    ],
    invalid: [
        {
            code: "Object.prototype.hasOwnProperty",
            errors: [error]
        },
        {
            code: "Object.hasOwnProperty.call(obj, 'foo')",
            errors: [error]
        },
        {
            code: "Object.prototype.hasOwnProperty.call(obj, 'foo')",
            errors: [error]
        },
        {
            code: "({}).hasOwnProperty.call(obj, 'foo')",
            errors: [error]
        }
    ]
});
