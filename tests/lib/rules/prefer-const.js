/**
 * @fileoverview Tests for prefer-const rule.
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/prefer-const"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("prefer-const", rule, {
    valid: [
        { code: "var x = 0;" },
        { code: "let x;", ecmaFeatures: {blockBindings: true} },
        { code: "let x; x = 0;", ecmaFeatures: {blockBindings: true} },
        { code: "let x = 0; x = 1;", ecmaFeatures: {blockBindings: true} },
        { code: "const x = 0;", ecmaFeatures: {blockBindings: true} },
        { code: "for (let i = 0, end = 10; i < end; ++i) {}", ecmaFeatures: {blockBindings: true} },
        { code: "for (let i in [1,2,3]) { i = 0; }", ecmaFeatures: {blockBindings: true} },
        { code: "for (let x of [1,2,3]) { x = 0; }", ecmaFeatures: {blockBindings: true, forOf: true} },
        { code: "(function() { var x = 0; })();" },
        { code: "(function() { let x; })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { let x; x = 0; })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { let x = 0; x = 1; })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { const x = 0; })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { for (let i = 0, end = 10; i < end; ++i) {} })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { for (let i in [1,2,3]) { i = 0; } })();", ecmaFeatures: {blockBindings: true} },
        { code: "(function() { for (let x of [1,2,3]) { x = 0; } })();", ecmaFeatures: {blockBindings: true, forOf: true} },
        { code: "(function(x = 0) { })();", ecmaFeatures: {defaultParams: true} }
    ],
    invalid: [
        {
            code: "let x = 1; foo(x);",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { foo(i); }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`i` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "for (let x of [1,2,3]) { foo(x); }",
            ecmaFeatures: {blockBindings: true, forOf: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "let [x = -1, y] = [1,2]; y = 0;",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "let {a: x = -1, b: y} = {a:1,b:2}; y = 0;",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let x = 1; foo(x); })();",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let i in [1,2,3]) { foo(i); } })();",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`i` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "(function() { for (let x of [1,2,3]) { foo(x); } })();",
            ecmaFeatures: {blockBindings: true, forOf: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let [x = -1, y] = [1,2]; y = 0; })();",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "(function() { let {a: x = -1, b: y} = {a:1,b:2}; y = 0; })();",
            ecmaFeatures: {blockBindings: true, destructuring: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "let x = 0; { let x = 1; foo(x); } x = 0;",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "for (let i = 0; i < 10; ++i) { let x = 1; foo(x); }",
            ecmaFeatures: {blockBindings: true},
            errors: [{ message: "`x` is never modified, use `const` instead.", type: "Identifier"}]
        },
        {
            code: "for (let i in [1,2,3]) { let x = 1; foo(x); }",
            ecmaFeatures: {blockBindings: true},
            errors: [
                { message: "`i` is never modified, use `const` instead.", type: "Identifier"},
                { message: "`x` is never modified, use `const` instead.", type: "Identifier"}
            ]
        }
    ]
});
