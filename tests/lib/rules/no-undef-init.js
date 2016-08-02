/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undef-init"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-undef-init", rule, {
    valid: [
        "var a;",
        { code: "const foo = undefined", parserOptions: { ecmaVersion: 6 } }
    ],
    invalid: [
        { code: "var a = undefined;", errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator"}] }
    ]
});
