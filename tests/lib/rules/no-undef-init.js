/**
 * @fileoverview Tests for undefined rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 * See LICENSE in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-undef-init"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-undef-init", rule, {
    valid: [
        "var a;",
        { code: "const foo = undefined", ecmaFeatures: { blockBindings: true } }
    ],
    invalid: [
        { code: "var a = undefined;", errors: [{ message: "It's not necessary to initialize 'a' to undefined.", type: "VariableDeclarator"}] }
    ]
});
