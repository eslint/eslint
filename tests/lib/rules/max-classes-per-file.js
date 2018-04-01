/**
 * @fileoverview Tests for max-classes-per-file rule.
 * @author James Garbutt <https://github.com/43081j>
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/max-classes-per-file"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("max-classes-per-file", rule, {
    valid: [
        {
            code: "class Foo {}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x = class {};",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var x = 5;",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {}",
            options: [1],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class Foo {}\nclass Bar {}",
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        }
    ],

    invalid: [
        {
            code: "class Foo {}\nclass Bar {}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "var x = class {};\nvar y = class {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {}\nvar x = class {};",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {} class Bar {}",
            options: [1],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {} class Bar {} class Baz {}",
            options: [2],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        }
    ]
});
