/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../lib/tests/eslintTester");

eslintTester.addRuleTest("quotes", {
    valid: [
        {code: "var foo = 'bar';", args: [1, "single"] },
        {code: "var foo = \"bar\";", args: [1, "double"] },
        { code: "var foo = 1;", args: [1, "single"] },
        { code: "var foo = 1;", args: [1, "double"] }
           ],
    invalid: [
        { code: "var foo = \"bar\";",
          args: [1, "single"],
          errors: [{ message: "Strings must use singlequote.", type: "Literal"}] },
        { code: "var foo = 'bar';",
          args: [1, "double"],
          errors: [{ message: "Strings must use doublequote.", type: "Literal"}] }
    ]
});
