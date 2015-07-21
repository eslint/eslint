/**
 * @fileoverview Tests for dot-location.
 * @author Greg Cochard
 * @copyright 2015 Greg Cochard
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

eslintTester.addRuleTest("lib/rules/dot-location", {
    valid: [
        "obj.\nprop",
        "obj. \nprop",
        "obj.\n prop",
        "(obj).\nprop",
        "obj\n['prop']",
        "obj['prop']",
        {
            code: "obj.\nprop",
            options: [ "object" ]
        },
        {
            code: "obj\n.prop",
            options: [ "property" ]
        },
        {
            code: "(obj)\n.prop",
            options: [ "property" ]
        }
    ],
    invalid: [
        {
            code: "obj\n.property",
            options: [ "object" ],
            errors: [ { message: "Expected dot to be on same line as object.", type: "MemberExpression", line: 2, column: 1 } ]
        },
        {
            code: "obj.\nproperty",
            options: [ "property" ],
            errors: [ { message: "Expected dot to be on same line as property.", type: "MemberExpression", line: 1, column: 4 } ]
        },
        {
            code: "(obj).\nproperty",
            options: [ "property" ],
            errors: [ { message: "Expected dot to be on same line as property.", type: "MemberExpression", line: 1, column: 6 } ]
        }
    ]
});
