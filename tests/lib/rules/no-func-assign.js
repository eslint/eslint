/**
 * @fileoverview Tests for no-func-assign.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-func-assign"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-func-assign", rule, {
    valid: [
        "function foo() { var foo = bar; }",
        "function foo(foo) { foo = bar; }",
        "function foo() { var foo; foo = bar; }",
        { code: "var foo = () => {}; foo = bar;", parserOptions: { ecmaVersion: 6 } },
        "var foo = function() {}; foo = bar;",
        "var foo = function() { foo = bar; };",
        { code: "import bar from 'bar'; function foo() { var foo = bar; }", parserOptions: { ecmaVersion: 6, sourceType: "module" } }
    ],
    invalid: [
        {
            code: "function foo() {}; foo = bar;",
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { foo = bar; }",
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "foo = bar; function foo() { };",
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "[foo] = bar; function foo() { };",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "({x: foo = 0} = bar); function foo() { };",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "function foo() { [foo] = bar; }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "(function() { ({x: foo = 0} = bar); function foo() { }; })();",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        },
        {
            code: "var a = function foo() { foo = 123; };",
            errors: [{
                messageId: "isAFunction",
                data: { name: "foo" },
                type: "Identifier"
            }]
        }
    ]
});
