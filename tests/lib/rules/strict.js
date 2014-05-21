/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/strict", {
    valid: [
        "\"use strict\"; function foo () {  return; }",
        "'use strict'; function foo () {  return; }",
        "function foo () { \"use strict\"; return; }",
        "function foo () { 'use strict'; return; }"
           ],
    invalid: [
        { code: "function foo() \n { \n return; }",
          errors: [{ message: "Missing \"use strict\" statement.", type: "FunctionDeclaration"}] }
    ]
});
