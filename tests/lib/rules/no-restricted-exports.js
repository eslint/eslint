/**
 * @fileoverview Tests for no-restricted-imports.
 * @author Guy Ellis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-exports"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { sourceType: "module" } });

ruleTester.run("no-restricted-exports", rule, {
    valid: [
      { code: "export let a;", options: [] },
      { code: "let a;export {then as a};", options: [] },
      { code: "export {then as a} from '';", options: [] },
    ],
    invalid: [{
      code: "export let then;",
      options: [],
      errors: [{ message: "export 'then' is restricted from being used.", type: "ExportNamedDeclaration" }]
    },{
      code: "let toString;export {toString};",
      options: [],
      errors: [{ message: "export 'toString' is restricted from being used.", type: "ExportSpecifier" }]
    },{
      code: "let foo;export {foo as valueOf};",
      options: [],
      errors: [{ message: "export 'valueOf' is restricted from being used.", type: "ExportSpecifier" }]
    },{
      code: "export {constructor} from '';",
      options: [],
      errors: [{ message: "export 'constructor' is restricted from being used.", type: "ExportSpecifier" }]
    }]
});
