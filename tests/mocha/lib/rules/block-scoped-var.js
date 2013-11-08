/**
 * @fileoverview Tests for block-scoped-var rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("block-scoped-var", {
    valid: [
        "function doSomething() { var build, f; if (true) { build = true; } f = build; }",
        "var build; function doSomething() { var f = build; }",
        "function doSomething(e) { }",
        "function doSomething(e) { var f = e; }",
        "function doSomething() { var f = doSomething; }",
        "function foo() { } function doSomething() { var f = foo; }"
    ],
    invalid: [
        { topic: "function doSomething() { var f; if (true) { var build = true; } f = build; }", errors: [{ message: "build used outside of binding context.", type: "Identifier" }] },
        { topic: "function doSomething() { try { var build = 1; } catch (e) { var f = build; } }", errors: [{ message: "build used outside of binding context.", type: "Identifier" }] }
    ]
});