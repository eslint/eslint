/**
 * @fileoverview Tests for no-loop-func rule.
 * @author Ilya Volodin
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-loop-func", {
    valid: [
        "string = 'function a() {}';",
        "for (var i=0; i<l; i++) { } var a = function() { };"
    ],
    invalid: [
        { code: "for (var i=0; i<l; i++) { (function() {}) }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "for (var i=0; i<l; i++) { var a = function() {} }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "for (var i=0; i<l; i++) { function a() {}; a(); }", errors: [{ message: "Don't make functions within a loop", type: "FunctionDeclaration"}] },
        { code: "while(i) { (function() {}) }", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] },
        { code: "do { (function() {}) } while (i)", errors: [{ message: "Don't make functions within a loop", type: "FunctionExpression"}] }
    ]
});
