/**
 * @fileoverview Tests for no-const-assign rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-const-assign");
var RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-const-assign", rule, {
    valid: [
        {code: "const x = 0; { let x; x = 1; }", ecmaFeatures: {blockBindings: true}},
        {code: "const x = 0; function a(x) { x = 1; }", ecmaFeatures: {blockBindings: true}},
        {code: "const x = 0; foo(x);", ecmaFeatures: {blockBindings: true}},
        {code: "for (const x in [1,2,3]) { foo(x); }", ecmaFeatures: {blockBindings: true}},
        {code: "for (const x of [1,2,3]) { foo(x); }", ecmaFeatures: {blockBindings: true, forOf: true}},
        {code: "const x = {key: 0}; x.key = 1;", ecmaFeatures: {blockBindings: true}},

        // ignores non constant.
        {code: "var x = 0; x = 1;"},
        {code: "let x = 0; x = 1;", ecmaFeatures: {blockBindings: true}},
        {code: "function x() {} x = 1;"},
        {code: "function foo(x) { x = 1; }"},
        {code: "class X {} X = 1;", ecmaFeatures: {classes: true}},
        {code: "try {} catch (x) { x = 1; }"}
    ],
    invalid: [
        {
            code: "const x = 0; x = 1;",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const {a: x} = {a: 0}; x = 1;",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ({x}) = {x: 1};",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ({a: x = 1}) = {};",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; x += 1;",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; ++x;",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "for (const i = 0; i < 10; ++i) { foo(i); }",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`i` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; x = 1; x = 2;",
            ecmaFeatures: {blockBindings: true},
            errors: [
                {message: "`x` is constant.", type: "Identifier", line: 1, column: 14},
                {message: "`x` is constant.", type: "Identifier", line: 1, column: 21}
            ]
        },
        {
            code: "const x = 0; function foo() { x = x + 1; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; function foo(a) { x = a; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        },
        {
            code: "const x = 0; while (true) { x = x + 1; }",
            ecmaFeatures: {blockBindings: true},
            errors: [{message: "`x` is constant.", type: "Identifier"}]
        }
    ]
});
