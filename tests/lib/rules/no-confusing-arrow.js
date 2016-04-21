/**
 * @fileoverview Tests for no-confusing-arrow rule.
 * @author Jxck <https://github.com/Jxck>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-confusing-arrow"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Extends a rule object to include support for arrow functions
 * @param {object} obj - rule object
 * @returns {object} object extend to include ES6 features
 */
function addArrowFunctions(obj) {
    obj.parserOptions = { ecmaVersion: 6 };
    return obj;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("no-confusing-arrow", rule, {
    valid: [
        { code: "a => { return 1 ? 2 : 3; }" },
        { code: "var x = a => { return 1 ? 2 : 3; }" },
        { code: "var x = (a) => { return 1 ? 2 : 3; }" },
        { code: "var x = a => (1 ? 2 : 3)", options: [{ allowParens: true }]}
    ].map(addArrowFunctions),
    invalid: [
        {
            code: "a => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = a => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = (a) => 1 ? 2 : 3",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        },
        {
            code: "var x = a => (1 ? 2 : 3)",
            errors: [{ message: "Arrow function used ambiguously with a conditional expression." }]
        }
    ].map(addArrowFunctions)
});
