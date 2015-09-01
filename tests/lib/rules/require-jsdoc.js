/**
 * @fileoverview Test file for require-jsdoc rule
 * @author Gyandeep Singh
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */
"use strict";

var rule = require("../../../lib/rules/require-jsdoc"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("require-jsdoc", rule, {
    valid: [
        "var array = [1,2,3];\narray.forEach(function() {});",
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
        "(function(){})();",

        "var object = {\n/**\n @func myFunction - Some function \n*/\nmyFunction: function() {} }",
        "var object = {\n/**\n @method myFunction - Some function \n*/\nmyFunction: function() {} }",
        "var object = {\n/**\n @function myFunction - Some function \n*/\nmyFunction: function() {} }",

        "var array = [1,2,3];\narray.forEach(function() {});",
        "var array = [1,2,3];\narray.filter(function() {});",
        "Object.keys(this.options.rules || {}).forEach(function(name) {}.bind(this));",
        "var object = { name: 'key'};\nObject.keys(object).forEach(function() {})"
    ],

    invalid: [
        {
            code: "function myFunction() {}",
            errors: [{
                message: "Missing JSDoc comment.",
                type: "FunctionDeclaration"
            }]
        }
    ]
});
