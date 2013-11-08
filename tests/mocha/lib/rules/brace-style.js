/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("brace-style", {
    valid: [
        "function foo () { return; }",
        "if (foo) { \n bar(); }",
        "while (foo) { \n bar(); }",
        "for (;;) { \n bar(); }",
        "with (foo) { \n bar(); }",
        "switch (foo) { \n case \"bar\": break; }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }"
    ],
    invalid: [
        { topic: "function foo() \n { \n return; }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "FunctionDeclaration"}] },
        { topic: "if (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "IfStatement"}] },
        { topic: "while (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "WhileStatement"}] },
        { topic: "for (;;) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "ForStatement"}] },
        { topic: "with (foo) \n { \n bar(); }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "WithStatement"}] },
        { topic: "switch (foo) \n { \n case \"bar\": break; }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "SwitchStatement"}] },
        { topic: "try \n { \n bar(); \n } catch (e) {}", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "TryStatement"}] },
        { topic: "do \n { \n bar(); \n} while (true)", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "DoWhileStatement"}] },
        { topic: "for (foo in bar) \n { \n baz(); \n }", errors: [{ message: "Opening curly brace does not appear on the same line as the block identifier.", type: "ForInStatement"}] }
    ]
});
