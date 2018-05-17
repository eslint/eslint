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

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("max-classes-per-file", rule, {
    valid: [
        "class Foo {}",
        "var x = class {};",
        "var x = 5;",
        {
            code: "class Foo {}",
            options: [1]
        },
        {
            code: "class Foo {}\nclass Bar {}",
            options: [2]
        }
    ],

    invalid: [
        {
            code: "class Foo {}\nclass Bar {}",
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "var x = class {};\nvar y = class {};",
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {}\nvar x = class {};",
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {} class Bar {}",
            options: [1],
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        },
        {
            code: "class Foo {} class Bar {} class Baz {}",
            options: [2],
            errors: [{ messageId: "maximumExceeded", type: "Program" }]
        }
    ]
});
