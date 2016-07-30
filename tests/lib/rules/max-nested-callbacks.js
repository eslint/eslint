/**
 * @fileoverview Tests for max-nested-callbacks rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-nested-callbacks"),
    RuleTester = require("../../../lib/testers/rule-tester");

const OPENING = "foo(function() {",
    CLOSING = "});";

/**
 * Generates a code string with the specified number of nested callbacks.
 * @param {int} times The number of times to nest the callbacks.
 * @returns {string} Code with the specified number of nested callbacks
 * @private
 */
function nestFunctions(times) {
    let openings = "",
        closings = "";

    for (let i = 0; i < times; i++) {
        openings += OPENING;
        closings += CLOSING;
    }
    return openings + closings;
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

ruleTester.run("max-nested-callbacks", rule, {
    valid: [
        { code: "foo(function() { bar(thing, function(data) {}); });", options: [3] },
        { code: "var foo = function() {}; bar(function(){ baz(function() { qux(foo); }) });", options: [2] },
        { code: "fn(function(){}, function(){}, function(){});", options: [2] },
        { code: "fn(() => {}, function(){}, function(){});", options: [2], parserOptions: { ecmaVersion: 6 } },
        { code: nestFunctions(10)},

        // object property options
        { code: "foo(function() { bar(thing, function(data) {}); });", options: [{ max: 3 }] }
    ],
    invalid: [
        {
            code: "foo(function() { bar(thing, function(data) { baz(function() {}); }); });",
            options: [2],
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        },
        {
            code: "foo(function() { bar(thing, (data) => { baz(function() {}); }); });",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        },
        {
            code: "foo(() => { bar(thing, (data) => { baz( () => {}); }); });",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "ArrowFunctionExpression"}]
        },
        {
            code: "foo(function() { if (isTrue) { bar(function(data) { baz(function() {}); }); } });",
            options: [2],
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        },
        {
            code: nestFunctions(11),
            errors: [{ message: "Too many nested callbacks (11). Maximum allowed is 10.", type: "FunctionExpression"}]
        },

        // object property options
        {
            code: "foo(function() { bar(thing, function(data) { baz(function() {}); }); });",
            options: [{ max: 2 }],
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        }
    ]
});
