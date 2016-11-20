/**
 * @fileoverview Test file for require-jsdoc rule
 * @author Gyandeep Singh
 */
"use strict";

const rule = require("../../../lib/rules/require-jsdoc"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

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
        "var object = { name: 'key'};\nObject.keys(object).forEach(function() {})",
        {
            code: "function myFunction() {}",
            options: [{
                require: {
                    FunctionDeclaration: false,
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code: "var myFunction = function() {}",
            options: [{
                require: {
                    FunctionDeclaration: false,
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code:
            "/**\n" +
            " * Description for A.\n" +
            " */\n" +
            "class App extends Component {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code:
            "/**\n" +
            " * Description for A.\n" +
            " */\n" +
            "export default class App extends Component {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code:
            "/**\n" +
            " * Description for A.\n" +
            " */\n" +
            "export class App extends Component {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { ecmaVersion: 6, sourceType: "module" },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }]
        },
        {
            code:
            "class A {\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: false,
                    ClassDeclaration: false
                }
            }]
        },
        {
            code: "/**\n Function doing something\n*/\nvar myFunction = () => {}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    ArrowFunctionExpression: true
                }
            }]
        },
        {
            code: "/**\n Function doing something\n*/\nvar myFunction = () => () => {}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    ArrowFunctionExpression: true
                }
            }]
        },
        {
            code: "setTimeout(() => {}, 10);",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    ArrowFunctionExpression: true
                }
            }]
        }
    ],

    invalid: [
        {
            code: "function myFunction() {}",
            errors: [{
                message: "Missing JSDoc comment.",
                type: "FunctionDeclaration"
            }]
        },
        {
            code:
                "/**\n" +
                " * Description for A.\n" +
                " */\n" +
                "class A {\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "FunctionExpression"
            }]
        },
        {
            code:
                "class A {\n" +
                "    /**\n" +
                "     * Description for constructor.\n" +
                "     * @param {object[]} xs - xs\n" +
                "     */\n" +
                "    constructor(xs) {\n" +
                "        this.a = xs;" +
                "    }\n" +
                "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ClassDeclaration"
            }]
        },
        {
            code:
            "class A extends B {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ClassDeclaration"
            }]
        },
        {
            code:
            "export class A extends B {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { sourceType: "module" },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ClassDeclaration"
            }]
        },
        {
            code:
            "export default class A extends B {\n" +
            "    /**\n" +
            "     * Description for constructor.\n" +
            "     * @param {object[]} xs - xs\n" +
            "     */\n" +
            "    constructor(xs) {\n" +
            "        this.a = xs;" +
            "    }\n" +
            "}",
            parserOptions: { sourceType: "module" },
            options: [{
                require: {
                    MethodDefinition: true,
                    ClassDeclaration: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ClassDeclaration"
            }]
        },
        {
            code: "var myFunction = () => {}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    ArrowFunctionExpression: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ArrowFunctionExpression"
            }]
        },
        {
            code: "var myFunction = () => () => {}",
            parserOptions: { ecmaVersion: 6 },
            options: [{
                require: {
                    ArrowFunctionExpression: true
                }
            }],
            errors: [{
                message: "Missing JSDoc comment.",
                type: "ArrowFunctionExpression"
            }]
        },
    ]
});
