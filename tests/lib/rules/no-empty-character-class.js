/**
 * @fileoverview Tests for no-empty-class rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-character-class"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-empty-character-class", rule, {
    valid: [
        "var foo = /^abc[a-zA-Z]/;",
        "var regExp = new RegExp(\"^abc[]\");",
        "var foo = /^abc/;",
        "var foo = /[\\[]/;",
        "var foo = /[\\]]/;",
        "var foo = /[a-zA-Z\\[]/;",
        "var foo = /[[]/;",
        "var foo = /[\\[a-z[]]/;",
        "var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;",
        "var foo = /\\s*:\\s*/gim;",
        { code: "var foo = /[\\]]/uy;", parserOptions: { ecmaVersion: 6 } },
        { code: "var foo = /[\\]]/s;", parserOptions: { ecmaVersion: 2018 } },
        "var foo = /\\[]/"
    ],
    invalid: [
        { code: "var foo = /^abc[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /foo[]bar/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if (foo.match(/^abc[]/)) {}", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if (/^abc[]/.test(foo)) {}", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /[]]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /\\[[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /\\[\\[\\]a-z[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] }
    ]
});
