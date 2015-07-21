/**
 * @fileoverview Tests for no-empty rule.
 * @author Nicholas C. Zakas
 * @copyright Nicholas C. Zakas. All rights reserved.
 * @copyright 2015 Dieter Oberkofler. All rights reserved.
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
eslintTester.addRuleTest("lib/rules/no-empty", {
    valid: [
        "if (foo) { bar() }",
        "while (foo) { bar() }",
        "for (;foo;) { bar() }",
        "try { foo() } catch (ex) { foo() }",
        "switch(foo) {case 'foo': break;}",
        "(function() { }())",
        { code: "var foo = () => {};", ecmaFeatures: { arrowFunctions: true } },
        "function foo() { }",
        "if (foo) {/* empty */}",
        "while (foo) {/* empty */}",
        "for (;foo;) {/* empty */}",
        "try { foo() } catch (ex) {/* empty */}",
        "try { foo() } catch (ex) {// empty\n}",
        "try { foo() } finally {// empty\n}",
        "try { foo() } finally {// test\n}",
        "try { foo() } finally {\n \n // hi i am off no use\n}",
        "try { foo() } catch (ex) {/* test111 */}",
        "if (foo) { bar() } else { // nothing in me \n}",
        "if (foo) { bar() } else { /**/ \n}",
        "if (foo) { bar() } else { // \n}"
    ],
    invalid: [
        { code: "try {} catch (ex) {throw ex}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "try { foo() } catch (ex) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "try { foo() } catch (ex) {throw ex} finally {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "if (foo) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "while (foo) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "for (;foo;) {}", errors: [{ message: "Empty block statement.", type: "BlockStatement"}] },
        { code: "switch(foo) {}", errors: [{ message: "Empty switch statement.", type: "SwitchStatement"}] }
    ]
});
