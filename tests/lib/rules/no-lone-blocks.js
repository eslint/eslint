/**
 * @fileoverview Tests for no-lone-blocks rule.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-lone-blocks"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-lone-blocks", rule, {
    valid: [
        "if (foo) { if (bar) { baz(); } }",
        "do { bar(); } while (foo)",
        "function foo() { while (bar) { baz() } }",

        // Block-level bindings
        {code: "{ let x = 1; }", ecmaFeatures: {blockBindings: true}},
        {code: "{ const x = 1; }", ecmaFeatures: {blockBindings: true}},
        {code: "'use strict'; { function bar() {} }", ecmaFeatures: {blockBindings: true}},
        {code: "{ class Bar {} }", ecmaFeatures: {classes: true}},

        {code: "{ {let y = 1;} let x = 1; }", ecmaFeatures: {blockBindings: true}}
    ],
    invalid: [
        { code: "{}", errors: [{ message: "Block is redundant.", type: "BlockStatement"}] },
        { code: "{var x = 1;}", errors: [{ message: "Block is redundant.", type: "BlockStatement"}] },
        { code: "foo(); {} bar();", errors: [{ message: "Block is redundant.", type: "BlockStatement"}] },
        { code: "if (foo) { bar(); {} baz(); }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement"}] },
        { code: "{ \n{ } }", errors: [
            { message: "Block is redundant.", type: "BlockStatement", line: 1},
            { message: "Nested block is redundant.", type: "BlockStatement", line: 2}]
        },
        { code: "function foo() { bar(); {} baz(); }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement"}] },
        { code: "while (foo) { {} }", errors: [{ message: "Nested block is redundant.", type: "BlockStatement"}] },

        // Non-block-level bindings, even in ES6
        { code: "{ function bar() {} }", errors: [{ message: "Block is redundant.", type: "BlockStatement"}], ecmaFeatures: {blockBindings: true}},
        { code: "{var x = 1;}", errors: [{ message: "Block is redundant.", type: "BlockStatement"}], ecmaFeatures: {blockBindings: true} },
        { code: "{ function bar() {} }", errors: [{ message: "Block is redundant.", type: "BlockStatement"}], ecmaFeatures: {classes: true}},
        { code: "{var x = 1;}", errors: [{ message: "Block is redundant.", type: "BlockStatement"}], ecmaFeatures: {classes: true} },

        {
            code: "{ \n{var x = 1;}\n let y = 2; } {let z = 1;}",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "Nested block is redundant.", type: "BlockStatement", line: 2}]
        },
        {
            code: "{ \n{let x = 1;}\n var y = 2; } {let z = 1;}",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "Block is redundant.", type: "BlockStatement", line: 1}]
        },
        {
            code: "{ \n{var x = 1;}\n var y = 2; }\n {var z = 1;}",
            ecmaFeatures: {blockBindings: true},
            errors: [
                {message: "Block is redundant.", type: "BlockStatement", line: 1},
                {message: "Nested block is redundant.", type: "BlockStatement", line: 2},
                {message: "Block is redundant.", type: "BlockStatement", line: 4}
            ]
        }
    ]
});
