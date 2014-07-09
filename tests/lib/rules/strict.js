/**
 * @fileoverview Tests for strict rule.
 * @author Nicholas C. Zakas
 * @copyright 2013-2014 Nicholas C. Zakas. All rights reserved.
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
        "function foo () { \"use strict\"; function bar() {}; }",
        "function foo () { 'use strict'; return; }"
    ],
    invalid: [
        {
            code: "function foo() \n { \n return; }",
            errors: [{ message: "Missing \"use strict\" statement.", type: "FunctionDeclaration"}]
        },
        {
            code: "function foo() { function bar() { 'use strict'; } }",
            errors: [{ message: "Missing \"use strict\" statement.", type: "FunctionDeclaration"}]
        },
        {
            code: "function foo() { function bar() {} }",
            errors: [{ message: "Missing \"use strict\" statement.", type: "FunctionDeclaration"}]
        }
    ]
});
