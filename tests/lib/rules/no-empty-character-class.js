/**
 * @fileoverview Tests for no-empty-class rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-empty-character-class"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");

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
        "var foo = /\\[][\\]]/;",
        "var foo = /[a-zA-Z\\[]/;",
        "var foo = /[[]/;",
        "var foo = /[\\[a-z[]]/;",
        "var foo = /[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\^\\$\\|]/g;",
        "var foo = /\\s*:\\s*/gim;",
        "var foo = /[^]/;", // this rule allows negated empty character classes
        "var foo = /\\[][^]/;",
        { code: "var foo = /[\\]]/uy;", languageOptions: { ecmaVersion: 6 } },
        { code: "var foo = /[\\]]/s;", languageOptions: { ecmaVersion: 2018 } },
        { code: "var foo = /[\\]]/d;", languageOptions: { ecmaVersion: 2022 } },
        "var foo = /\\[]/",
        { code: "var foo = /[[^]]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[\\]]]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[\\[]]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[a--b]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[a&&b]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[a][b]]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[\\q{}]/v;", languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[^]--\\p{ASCII}]/v;", languageOptions: { ecmaVersion: 2024 } }
    ],
    invalid: [
        { code: "var foo = /^abc[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /foo[]bar/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if (foo.match(/^abc[]/)) {}", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "if (/^abc[]/.test(foo)) {}", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /[]]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /\\[[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /\\[\\[\\]a-z[]/;", errors: [{ messageId: "unexpected", type: "Literal" }] },
        { code: "var foo = /[]]/d;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2022 } },
        { code: "var foo = /[(]\\u{0}*[]/u;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2015 } },
        { code: "var foo = /[]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[]]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[a][]]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[a[[b[]c]]d]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[a--[]]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[]--b]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[a&&[]]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } },
        { code: "var foo = /[[]&&b]/v;", errors: [{ messageId: "unexpected", type: "Literal" }], languageOptions: { ecmaVersion: 2024 } }
    ]
});
