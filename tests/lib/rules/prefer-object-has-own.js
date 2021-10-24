/**
 * @fileoverview Prefers Object.hasOwn instead of Object.prototype.hasOwnProperty
 * @author Gautam Arora
 * See LICENSE file in root directory for full license.
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
    ecmaVersion: 2018,
    sourceType: "module"
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("prefer-object-has-own", rule, {
    valid: [
        `
        let obj = {};
        Object.hasOwn(obj,"");
        `
    ],
    invalid: [
        `
        let a = Object.prototype.hasOwnProperty();
        obj.call();
        `,
        `
        let a = Object.prototype.hasOwnProperty.call();
        `
    ]
});
