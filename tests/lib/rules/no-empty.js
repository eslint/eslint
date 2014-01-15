/**
 * @fileoverview Tests for no-empty rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("no-empty", {
    valid: [
        "if (foo) { bar() }",
        "while (foo) { bar() }",
        "for (;foo;) { bar() }",
        "try { foo() } catch (ex) { foo() }",
        "switch(foo) {case 'foo': break;}",
        "(function() { }())",
        "function foo() { }",
        "try { foo() } catch (ex) {}",
        "try { foo() } finally {}"
    ],
    invalid: [
        { code: "if (foo) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "while (foo) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "for (;foo;) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "switch(foo) {}", errors: [{ message: "Empty switch statement.", type: "SwitchStatement"}] }
    ]
});
