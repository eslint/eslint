/**
 * @fileoverview Tests for the no-up-requires rule.
 * @author Denis Sokolov
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-up-requires", {
    valid: [
        { code: "var foo = require('foo');", args: 1 },
        { code: "var foo = require('./foo');", args: 1 },
        { code: "var foo = require('././foo');", args: 1 },
        { code: "var foo = require('./foo'), bar = require('bar');", args: 1 },
        { code: "var foo = require(bar('..'));", args: 1 },
        { code: "var foo = bar(require('./quux'));", args: 1 }
    ],
    invalid: [
        { code: "var foo = require('../foo')", args: 1, errors: [{ message: "Do not use .. in require paths", type: "CallExpression"}] },
        { code: "require('../foo')", args: 1, errors: [{ message: "Do not use .. in require paths", type: "CallExpression"}] },
        { code: "if (require('../foo')) {}", args: 1, errors: [{ message: "Do not use .. in require paths", type: "CallExpression"}] }
    ]
});
