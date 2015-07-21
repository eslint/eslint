/**
 * @fileoverview Tests for no-catch-shadow rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-catch-shadow", {
    valid: [
        "var foo = 1; try { bar(); } catch(baz) { }"
    ],
    invalid: [
        { code: "var foo = 1; try { bar(); } catch(foo) { }", errors: [{ message: "Value of 'foo' may be overwritten in IE 8 and earlier.", type: "CatchClause"}] },
        { code: "function foo(){} try { bar(); } catch(foo) { }", errors: [{ message: "Value of 'foo' may be overwritten in IE 8 and earlier.", type: "CatchClause"}] },
        { code: "function foo(){ try { bar(); } catch(foo) { } }", errors: [{ message: "Value of 'foo' may be overwritten in IE 8 and earlier.", type: "CatchClause"}] },
        { code: "var foo = function(){ try { bar(); } catch(foo) { } };", errors: [{ message: "Value of 'foo' may be overwritten in IE 8 and earlier.", type: "CatchClause"}] }
    ]
});
