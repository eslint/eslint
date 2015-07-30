/**
 * @fileoverview Tests for no-loop-func rule.
 * @author Ilya Volodin
 * @copyright 2013 Ilya Volodin. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-loop-func"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester(),
    expectedErrorMessage = "Don't make functions within a loop";

ruleTester.run("no-loop-func", rule, {
    valid: [
        "string = 'function a() {}';",
        "for (var i=0; i<l; i++) { } var a = function() { i; };",
        "for (var i=0, a=function() { i; }; i<l; i++) { }",
        "for (var x in xs.filter(function(x) { return x != upper; })) { }",
        {
            code: "for (var x of xs.filter(function(x) { return x != upper; })) { }",
            ecmaFeatures: { forOf: true }
        },

        // no refers to variables that declared on upper scope.
        {
            code: "for (var i=0; i<l; i++) { (function() {}) }"
        },
        {
            code: "for (var i in {}) { (function() {}) }"
        },
        {
            code: "for (var i of {}) { (function() {}) }",
            ecmaFeatures: { forOf: true }
        },

        // refers to only variables that declared with `let`/`const` keyword in the loop.
        // these are rebound on each loop step.
        {
            code: "for (let i=0; i<l; i++) { (function() { i; }) }",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "for (let i in {}) { (function() { i; }) }",
            ecmaFeatures: { blockBindings: true }
        },
        {
            code: "for (const i of {}) { (function() { i; }) }",
            ecmaFeatures: { blockBindings: true, forOf: true }
        },
        {
            code: "for (let i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
            ecmaFeatures: { arrowFunctions: true, blockBindings: true }
        }
    ],
    invalid: [
        {
            code: "for (var i=0; i<l; i++) { (function() { i; }) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i in {}) { (function() { i; }) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i of {}) { (function() { i; }) }",
            ecmaFeatures: { forOf: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { (() => { i; }) }",
            ecmaFeatures: { arrowFunctions: true },
            errors: [ { message: expectedErrorMessage, type: "ArrowFunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { var a = function() { i; } }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i < l; i++) { function a() { i; }; a(); }",
            errors: [ { message: expectedErrorMessage, type: "FunctionDeclaration" } ]
        },
        {
            code: "for (var i=0; (function() { i; })(), i<l; i++) { }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "for (var i=0; i<l; (function() { i; })(), i++) { }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "while(i) { (function() { i; }) }",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "do { (function() { i; }) } while (i)",
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },

        // refers to variables that declared with `let`/`const` keyword on outside of the loop.
        // these are not rebound on each loop step.
        {
            code: "let a; for (let i=0; i<l; i++) { (function() { a; }); }",
            ecmaFeatures: { blockBindings: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "let a; for (let i in {}) { (function() { a; }); }",
            ecmaFeatures: { blockBindings: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "let a; for (let i of {}) { (function() { a; }); }",
            ecmaFeatures: { blockBindings: true, forOf: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "let a; for (let i=0; i<l; i++) { (function() { (function() { a; }); }); }",
            ecmaFeatures: { blockBindings: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionExpression" } ]
        },
        {
            code: "let a; for (let i in {}) { function foo() { (function() { a; }); } }",
            ecmaFeatures: { blockBindings: true },
            errors: [ { message: expectedErrorMessage, type: "FunctionDeclaration" } ]
        },
        {
            code: "let a; for (let i of {}) { (() => { (function() { a; }); }); }",
            ecmaFeatures: { arrowFunctions: true, blockBindings: true, forOf: true },
            errors: [ { message: expectedErrorMessage, type: "ArrowFunctionExpression" } ]
        },
        {
            code: "for (var i = 0; i < 10; ++i) { for (let x in xs.filter(x => x != i)) {  } }",
            ecmaFeatures: { arrowFunctions: true, blockBindings: true },
            errors: [ { message: expectedErrorMessage, type: "ArrowFunctionExpression" } ]
        }
    ]
});
