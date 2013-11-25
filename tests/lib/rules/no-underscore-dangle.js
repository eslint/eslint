/**
 * @fileoverview Test for no-underscore-dangle rule
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-underscore-dangle", {
    valid: [
        "var foo_bar = 1;",
        "function foo_bar() {}",
        "foo.bar.__proto__;",
        "console.log(__filename); console.log(__dirname);",
        "var _ = require('underscore');",
        "var a = b._;"
    ],
    invalid: [
        { code: "var _foo = 1", errors: [{ message: "Unexpected dangling '_' in '_foo'.", type: "VariableDeclarator"}] },
        { code: "var foo_ = 1", errors: [{ message: "Unexpected dangling '_' in 'foo_'.", type: "VariableDeclarator"}] },
        { code: "function _foo() {}", errors: [{ message: "Unexpected dangling '_' in '_foo'.", type: "FunctionDeclaration"}] },
        { code: "function foo_() {}", errors: [{ message: "Unexpected dangling '_' in 'foo_'.", type: "FunctionDeclaration"}] },
        { code: "var __proto__ = 1;", errors: [{ message: "Unexpected dangling '_' in '__proto__'.", type: "VariableDeclarator"}] }
    ]
});
