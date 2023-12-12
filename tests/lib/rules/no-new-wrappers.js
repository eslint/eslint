/**
 * @fileoverview Tests for no-new-wrappers rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-wrappers"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-wrappers", rule, {
    valid: [
        "var a = new Object();",
        "var a = String('test'), b = String.fromCharCode(32);",
        `
        function test(Number) {
            return new Number;
        }
        `,
        {
            code: `
            import String from "./string";
            const str = new String(42);
            `,
            languageOptions: { ecmaVersion: 6, sourceType: "module" }
        },
        `
        if (foo) {
            result = new Boolean(bar);
        } else {
            var Boolean = CustomBoolean;
        }
        `,
        {
            code: "new String()",
            languageOptions: {
                globals: {
                    String: "off"
                }
            }
        },
        `
        /* global Boolean:off */
        assert(new Boolean);
        `
    ],
    invalid: [
        {
            code: "var a = new String('hello');",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "String"
                },
                type: "NewExpression"
            }]
        },
        {
            code: "var a = new Number(10);",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "Number"
                },
                type: "NewExpression"
            }]
        },
        {
            code: "var a = new Boolean(false);",
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "Boolean"
                },
                type: "NewExpression"
            }]
        },
        {
            code: `
            const a = new String('bar');
            {
                const String = CustomString;
                const b = new String('foo');
            }
            `,
            languageOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "noConstructor",
                data: {
                    fn: "String"
                },
                type: "NewExpression",
                line: 2
            }]
        }
    ]
});
