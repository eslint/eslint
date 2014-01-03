/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("brace-style", {
    valid: [
        "function foo () { return; }",
        "function a(b,\nc,\nd) { }",
        "if (foo) { \n bar(); }",
        "if (a) { b(); } else { c(); }",
        "if (a) { b(); } \n else { c(); }",
        "while (foo) { \n bar(); }",
        "for (;;) { \n bar(); }",
        "with (foo) { \n bar(); }",
        "switch (foo) { \n case \"bar\": break; }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }",
        "if (a &&\n b &&\n c) { \n }",
        "switch(0) {}"
    ],
    invalid: [
        { code: "function foo() \n { \n return; }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "FunctionDeclaration"}] },
        { code: "if (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "IfStatement"}] },
        { code: "if (a) { b(); } else \n { c(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "IfStatement"}] },
        { code: "while (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "WhileStatement"}] },
        { code: "for (;;) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "ForStatement"}] },
        { code: "with (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "WithStatement"}] },
        { code: "switch (foo) \n { \n case \"bar\": break; }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "SwitchStatement"}] },
        { code: "switch (foo) \n { }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "SwitchStatement"}] },
        { code: "try \n { \n bar(); \n } catch (e) {}", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "TryStatement"}] },
        { code: "try { \n bar(); \n } catch (e) \n {}", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "CatchClause"}] },
        { code: "do \n { \n bar(); \n} while (true)", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "DoWhileStatement"}] },
        { code: "for (foo in bar) \n { \n baz(); \n }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "ForInStatement"}] }
    ]
});
