/**
 * @fileoverview Tests for the no-new-object rule
 * @author Matt DuVall <http://www.mattduvall.com/>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-object"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-object", rule, {
    valid: [
        "var myObject = {};",
        "var myObject = new CustomObject();",
        "var foo = new foo.Object()",
        `var Object = function Object() {};
            new Object();`,
        `var x = something ? MyClass : Object;
        var y = new x();`,
        {
            code: `
        class Object {
            constructor(){

            }
        }
        new Object();
        `,
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: `
        import { Object } from './'
        new Object();
        `,
            parserOptions: { ecmaVersion: 6, sourceType: "module" }
        }
    ],
    invalid: [
        {
            code: "var foo = new Object()",
            errors: [
                {
                    messageId: "preferLiteral",
                    type: "NewExpression"
                }
            ]
        },
        {
            code: "new Object();",
            errors: [{ messageId: "preferLiteral", type: "NewExpression" }]
        },
        {
            code: "const a = new Object()",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "preferLiteral", type: "NewExpression" }]
        }
    ]
});
