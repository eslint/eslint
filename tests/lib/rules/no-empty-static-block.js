/**
 * @fileoverview Tests for no-empty-static-block rule.
 * @author Sosuke Suzuki
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-static-block"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty-static-block", rule, {
    valid: [
        {
            code: "class Foo { static { bar(); } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class Foo { static { /* comments */ } }",
            parserOptions: { ecmaVersion: 2022 }
        },
        {
            code: "class Foo { static {\n// comment\n} }",
            parserOptions: { ecmaVersion: 2022 }
        }
    ],
    invalid: [
        {
            code: "class Foo { static {} }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static { } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static { \n\n } }",
            parserOptions: { ecmaVersion: 2022 },
            errors: [{ messageId: "unexpected" }]
        }
    ]
});
