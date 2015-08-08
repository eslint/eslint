/**
 * @fileoverview Tests for global-require
 * @author Jamund Ferguson
 * @copyright 2015 Jamund Ferguson. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/global-require"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var ruleTester = new RuleTester();

var valid = [
    { code: "var x = require('y');" },
    { code: "if (x) { x.require('y'); }" },
    { code: "var x;\nx = require('y');" },
    { code: "var x = 1, y = require('y');" },
    { code: "var x = require('y'), y = require('y'), z = require('z');" },
    { code: "var x = require('y').foo;" },
    { code: "require('y').foo();" },
    { code: "require('y');" },
    { code: "function x(){}\n\n\nx();\n\n\nif (x > y) {\n\tdoSomething()\n\n}\n\nvar x = require('y').foo;" },
    { code: "var logger = require(DEBUG ? 'dev-logger' : 'logger');" },
    { code: "var logger = DEBUG ? require('dev-logger') : require('logger');" }
];

var message = message;
var type = type;

var invalid = [

    // block statements
    {
        code: "if (process.env.NODE_ENV === 'DEVELOPMENT') {\n\trequire('debug');\n}",
        errors: [{
            line: 2,
            column: 2,
            message: message,
            type: type
        }]
    },
    {
        code: "var x; if (y) { x = require('debug'); }",
        errors: [{
            line: 1,
            column: 21,
            message: message,
            type: type
        }]
    },
    {
        code: "var x; if (y) { x = require('debug').baz; }",
        errors: [{
            line: 1,
            column: 21,
            message: message,
            type: type
        }]
    },
    {
        code: "function x() { require('y') }",
        errors: [{
            line: 1,
            column: 16,
            message: message,
            type: type
        }]
    },
    {
        code: "try { require('x'); } catch (e) { console.log(e); }",
        errors: [{
            line: 1,
            column: 7,
            message: message,
            type: type
        }]
    },

    // non-block statements
    {
        code: "var getModule = x => require(x);",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 22,
            message: message,
            type: type
        }]
    },
    {
        code: "var x = (x => require(x))('weird')",
        ecmaFeatures: { arrowFunctions: true },
        errors: [{
            line: 1,
            column: 15,
            message: message,
            type: type
        }]
    },
    {
        code: "switch(x) { case '1': require('1'); break; }",
        errors: [{
            line: 1,
            column: 23,
            message: message,
            type: type
        }]
    }
];

ruleTester.run("global-require", rule, {
    valid: valid,
    invalid: invalid
});
