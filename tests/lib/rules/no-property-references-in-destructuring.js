/**
 * @fileoverview Tests for property references in destructuring patterns
 * @author Brett Zamir <http://brett-zamir.me>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-property-references-in-destructuring"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-property-references-in-destructuring", rule, {
    valid: [

        // `ObjectPattern`
        {
            code: "var obj = {}; ({ a } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a, b } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b, c }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },

        {
            code: "var obj = {}, a = 7; ({ [a] : { b, c }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },

        // `ArrayPattern`
        {
            code: "var arr = []; ([ a ] = arr)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var arr = []; ([ a, b ] = arr)",
            parserOptions: { ecmaVersion: 6 }
        },

        // Mixed array and object patterns
        {
            code: "var arr = []; ([ a, { b, c } ] = arr)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a, b: [ b, c ] } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },

        // Defaults
        {
            code: "var obj = {}; ({ a = 5 } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a = 14, b } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a, b = 7 } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a = 'aaa', b = 7 } = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b = 7, c }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b, c = 8 }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b, c = window.abc }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b = 7, c = 8 }} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var obj = {}; ({ a : { b = 7, c = 8 } = {}} = obj)",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "({ a : { b = 7, c = 8 }} = window.a);",
            parserOptions: { ecmaVersion: 6 }
        }
    ],
    invalid: [
        {
            code: "var obj = {}; ({ a: this.b } = obj)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "propertyReferencesDestructuring",
                line: 1,
                column: 21,
                type: "MemberExpression"
            }]
        },
        {
            code: "var obj = {}; ({ a: (true).b } = obj)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "propertyReferencesDestructuring",
                line: 1,
                column: 21,
                type: "MemberExpression"
            }]
        },
        {
            code: "var obj = {}; ({ a: ({}).b } = obj)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "propertyReferencesDestructuring",
                line: 1,
                column: 21,
                type: "MemberExpression"
            }]
        },
        {
            code: "var arr = []; ([ this.a ] = arr)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "propertyReferencesDestructuring",
                line: 1,
                column: 18,
                type: "MemberExpression"
            }]
        },
        {
            code: "var arr = []; ([ (775).a ] = arr)",
            parserOptions: { ecmaVersion: 6 },
            errors: [{
                messageId: "propertyReferencesDestructuring",
                line: 1,
                column: 18,
                type: "MemberExpression"
            }]
        }
    ]
});
