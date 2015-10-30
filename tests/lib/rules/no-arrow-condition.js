/**
 * @fileoverview Tests for no-arrow-condition rule.
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

var rule = require("../../../lib/rules/no-arrow-condition"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Extends a rule object to include support for arrow functions
 * @param {object} obj - rule object
 * @returns {object} object extened to include `ecmaFeatures.arrowFunctions = true`
 */
function addArrowFunctions(obj) {
    obj.ecmaFeatures = { arrowFunctions: true };
    return obj;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-arrow-condition", rule, {
    valid: [
        { code: "if (a >= 1) {}" },
        { code: "while (a >= 1) {}" },
        { code: "for (var a = 1; a >= 10; a++) {}" },
        { code: "a >= 1 ? 2 : 3" },
        { code: "(a >= 1) ? 2 : 3" },
        { code: "[1,2,3].filter(n => n > 2)" },
        { code: "for (;;){}" }
    ].map(addArrowFunctions),
    invalid: [
        {
            code: "if (a => 1) {}",
            errors: [{ message: "Arrow function `=>` used inside IfStatement instead of comparison operator." }]
        },
        {
            code: "if ((a) => 1) {}",
            errors: [{ message: "Arrow function `=>` used inside IfStatement instead of comparison operator." }]
        },
        {
            code: "while (a => 1) {}",
            errors: [{ message: "Arrow function `=>` used inside WhileStatement instead of comparison operator." }]
        },
        {
            code: "for (var a = 1; a => 10; a++) {}",
            errors: [{ message: "Arrow function `=>` used inside ForStatement instead of comparison operator." }]
        },
        {
            code: "(a => 1) ? 2 : 3",
            errors: [{ message: "Arrow function `=>` used inside ConditionalExpression instead of comparison operator." }]
        },
        {
            code: "var x = (a => 1) ? 2 : 3",
            errors: [{ message: "Arrow function `=>` used inside ConditionalExpression instead of comparison operator." }]
        },
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
        }
    ].map(addArrowFunctions)
});
