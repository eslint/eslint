/**
 * @fileoverview Tests for no-empty-static-block rule.
 * @author Sosuke Suzuki
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-static-block"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 2022 }
});

ruleTester.run("no-empty-static-block", rule, {
    valid: [
        "class Foo { static { bar(); } }",
        "class Foo { static { /* comments */ } }",
        "class Foo { static {\n// comment\n} }",
        "class Foo { static { bar(); } static { bar(); } }"
    ],
    invalid: [
        {
            code: "class Foo { static {} }",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static { } }",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static { \n\n } }",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static { bar(); } static {} }",
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: "class Foo { static // comment\n {} }",
            errors: [{ messageId: "unexpected" }]
        }
    ]
});
