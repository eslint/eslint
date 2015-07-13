/**
 * @fileoverview No undocumented unnamed functions
 * @author Andreas Marschke
 * @copyright 2015 Andreas Marschke All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-undocumented-named-function", {
    valid: [
        "/**\n @class MyClass \n*/\nfunction MyClass() {}",
        "/**\n Function doing something\n*/\nfunction myFunction() {}",
        "/**\n Function doing something\n*/\nvar myFunction = function() {};",
        "/**\n Function doing something\n*/\nObject.myFunction = function () {};",
        "var obj = { \n /**\n Function doing something\n*/\n myFunction: function () {} };",

        "/**\n @func myFunction \n*/\nfunction myFunction() {}",
        "/**\n @method myFunction\n*/\nfunction myFunction() {}",
        "/**\n @function myFunction\n*/\nfunction myFunction() {}",

        "/**\n @func myFunction \n*/\nvar myFunction = function () {}",
        "/**\n @method myFunction\n*/\nvar myFunction = function () {}",
        "/**\n @function myFunction\n*/\nvar myFunction = function () {}",

        "/**\n @func myFunction \n*/\nObject.myFunction = function() {}",
        "/**\n @method myFunction\n*/\nObject.myFunction = function() {}",
        "/**\n @function myFunction\n*/\nObject.myFunction = function() {}",

        "var object = {\n/**\n @func myFunction - Some function \n*/\nmyFunction: function() {} }",
        "var object = {\n/**\n @method myFunction - Some function \n*/\nmyFunction: function() {} }",
        "var object = {\n/**\n @function myFunction - Some function \n*/\nmyFunction: function() {} }",

        "var array = [1,2,3];\narray.forEach(function() {});",
        "var array = [1,2,3];\narray.filter(function() {});",
        "var object = { name: 'key'};\nObject.keys(object).forEach(function() {})"
    ],

    invalid: [
        {
            code: "var testFunction = function() {}",
            errors: [{
                message: "Function testFunction was not documented",
                type: "FunctionExpression"
            }]
        },
        {
            code: "function myFunction() {}",
            errors: [{
                message: "Function myFunction was not documented",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "var object = { myFunction: function() {} };",
            errors: [{
                message: "Function myFunction was not documented",
                type: "FunctionExpression"
            }]
        },
        {
            code: "var object = {};\nobject.testFunction = function() {}",
            errors: [{
                message: "Function testFunction was not documented",
                type: "FunctionExpression"
            }]
        }
    ]
});
