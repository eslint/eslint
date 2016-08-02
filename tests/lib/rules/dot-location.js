/**
 * @fileoverview Tests for dot-location.
 * @author Greg Cochard
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/dot-location"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("dot-location", rule, {
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
