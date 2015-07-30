/**
 * @fileoverview Tests for max-nested-callbacks rule.
 * @author Ian Christian Myers
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/max-nested-callbacks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("max-nested-callbacks", rule, {
    valid: [
        { code: "foo(function() { bar(thing, function(data) {}); });", options: [3] },
        { code: "var foo = function() {}; bar(function(){ baz(function() { qux(foo); }) });", options: [2] },
        { code: "fn(function(){}, function(){}, function(){});", options: [2] },
        { code: "fn(() => {}, function(){}, function(){});", options: [2], ecmaFeatures: { arrowFunctions: true } }
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
            ecmaFeatures: { arrowFunctions: true },
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        },
        {
            code: "foo(() => { bar(thing, (data) => { baz( () => {}); }); });",
            options: [2],
            ecmaFeatures: { arrowFunctions: true },
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "ArrowFunctionExpression"}]
        },
        {
            code: "foo(function() { if (isTrue) { bar(function(data) { baz(function() {}); }); } });",
            options: [2],
            errors: [{ message: "Too many nested callbacks (3). Maximum allowed is 2.", type: "FunctionExpression"}]
        }
    ]
});
