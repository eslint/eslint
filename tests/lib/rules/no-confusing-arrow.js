/**
 * @fileoverview Tests for no-confusing-arrow rule.
 * @author Jxck <https://github.com/Jxck>
 * @copyright 2015 Luke Karrys. All rights reserved.
 * The MIT License (MIT)

 * Copyright (c) 2015 Jxck

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
