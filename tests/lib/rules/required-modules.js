/**
 * @fileoverview Tests for required-modules.
 * @author Rich Trott
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/required-modules"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("required-modules", rule, {
    valid: [
        { code: "require('assert')", options: ["assert"]},
        { code: "require('assert');\nrequire('this');", options: ["assert", "this"]},
        { code: "require('assert');", options: []},
        { code: "require('assert');\nrequire();", options: ["assert"]},
        { code: "require('assert');\nrequire(2);", options: ["assert"]},
        { code: "require('assert')", args: 0 },
        { code: "require('../common')", args: ["common"]},
        { code: "require('./../foo/bar/baz/common')", args: ["common"]},
        { code: "var foo = require('assert');", options: ["assert"]},
        { code: "require('assert');\nconsole.log('hi');", options: ["assert"]}
    ],
    invalid: [{
        code: "require('assert')", options: ["common"],
        errors: [{ message: "Mandatory module 'common' must be loaded.", type: "Program"}]
    }]
});
