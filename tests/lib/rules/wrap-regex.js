/**
 * @fileoverview Tests for wrap-regex rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/wrap-regex"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


var ruleTester = new RuleTester();
ruleTester.run("wrap-regex", rule, {
    valid: [
        "(/foo/).test(bar);",
        "(/foo/ig).test(bar);",
        "/foo/;",
        "var f = 0;",
        "a[/b/];"
    ],
    invalid: [
        { code: "/foo/.test(bar);",
          errors: [{ message: "Wrap the regexp literal in parens to disambiguate the slash.", type: "Literal"}] },
        { code: "/foo/ig.test(bar);",
          errors: [{ message: "Wrap the regexp literal in parens to disambiguate the slash.", type: "Literal"}] }

    ]
});
