/**
 * @fileoverview  a rule that enforces or disallows spaces after property names (and before property values) inside of objects.
 * @author Emory Merryman
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
eslintTester.addRuleTest("lib/rules/key-spacing", {

    valid: [
        {code: "{foo:bar}", args:[1,"never"]},
        {code: "{foo :'bar'}", args:[1,"always"]}
    ],

    invalid: [{
        code: "{foo:'bar'}",
        args: [1, "always"],
        errors: [{
            message: "A space is required before ':'",
            type: "ObjectExpression"
        }, {
            message: "A space is required after ':'",
            type: "ObjectExpression"
        }]
    }, {
        code: "{foo: 'bar'}",
        args: [1, "always"],
        errors: [{
            message: "A space is required before ':'",
            type: "ObjectExpression"
        }]
    },{
        code: "{foo :'bar'}",
        args: [1, "always"],
        errors: [{
            message: "A space is required after ':'",
            type: "ObjectExpression"
        }]
    },{
        code: "{foo : 'bar'}",
        args: [1, "never"],
        errors: [{
            message: "There must not be any spaces before ':'",
            type: "ObjectExpression"
        }, {
            message: "There must not be any spaces after ':'",
            type: "ObjectExpression"
        }]
    }, {
        code: "{foo :'bar'}",
        args: [1, "never"],
        errors: [{
            message: "There must not be any spaces before ':'",
            type: "ObjectExpression"
        }]
    },{
        code: "{foo: 'bar'}",
        args: [1, "never"],
        errors: [{
            message: "A space is required after ':'",
            type: "ObjectExpression"
        }]
    }]
});
