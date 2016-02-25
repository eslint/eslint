/**
 * @fileoverview Tests for no-restricted-globals.
 * @author Benoît Zugmeyer
 * @copyright 2016 Benoît Zugmeyer. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-restricted-globals"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-restricted-globals", rule, {
    valid: [
        { code: "foo" },
        { code: "foo", options: ["bar"] },
        { code: "var foo = 1;", options: ["foo"] },
        { code: "event", env: { browser: true }, options: ["bar"] },
        { code: "import foo from 'bar';", options: ["foo"], parserOptions: { ecmaVersion: 6, sourceType: "module" } },
        { code: "function foo() {}", options: ["foo"] },
        { code: "function fn() { var foo; }", options: ["foo"] },
        { code: "foo.bar", options: ["bar"] }
    ],
    invalid: [
        {
            code: "foo", options: ["foo"],
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        },
        {
            code: "function fn() { foo; }", options: ["foo"],
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        },
        {
            code: "function fn() { foo; }", options: ["foo"],
            globals: {foo: false},
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        },
        {
            code: "event", options: ["foo", "event"],
            env: { browser: true },
            errors: [{ message: "Unexpected use of 'event'", type: "Identifier"}]
        },
        {
            code: "foo", options: ["foo"],
            globals: {foo: false},
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        },
        {
            code: "foo()", options: ["foo"],
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        },
        {
            code: "foo.bar()", options: ["foo"],
            errors: [{ message: "Unexpected use of 'foo'", type: "Identifier"}]
        }
    ]
});

