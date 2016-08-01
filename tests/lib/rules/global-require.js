/**
 * @fileoverview Tests for global-require
 * @author Jamund Ferguson
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require("../../../lib/rules/global-require"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
let ruleTester = new RuleTester();

let valid = [
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
    { code: "var logger = DEBUG ? require('dev-logger') : require('logger');" },
    { code: "function localScopedRequire(require) { require('y'); }" },
    { code: "var someFunc = require('./someFunc'); someFunc(function(require) { return('bananas'); });" }
];

let message = "Unexpected require().";
let type = "CallExpression";

let invalid = [

    // block statements
    {
        code: "if (process.env.NODE_ENV === 'DEVELOPMENT') {\n\trequire('debug');\n}",
        errors: [{
            line: 2,
            column: 2,
            message,
            type
        }]
    },
    {
        code: "var x; if (y) { x = require('debug'); }",
        errors: [{
            line: 1,
            column: 21,
            message,
            type
        }]
    },
    {
        code: "var x; if (y) { x = require('debug').baz; }",
        errors: [{
            line: 1,
            column: 21,
            message,
            type
        }]
    },
    {
        code: "function x() { require('y') }",
        errors: [{
            line: 1,
            column: 16,
            message,
            type
        }]
    },
    {
        code: "try { require('x'); } catch (e) { console.log(e); }",
        errors: [{
            line: 1,
            column: 7,
            message,
            type
        }]
    },

    // non-block statements
    {
        code: "var getModule = x => require(x);",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 22,
            message,
            type
        }]
    },
    {
        code: "var x = (x => require(x))('weird')",
        parserOptions: { ecmaVersion: 6 },
        errors: [{
            line: 1,
            column: 15,
            message,
            type
        }]
    },
    {
        code: "switch(x) { case '1': require('1'); break; }",
        errors: [{
            line: 1,
            column: 23,
            message,
            type
        }]
    }
];

ruleTester.run("global-require", rule, {
    valid,
    invalid
});
