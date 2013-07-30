/**
 * @fileoverview Tests for guard-for-in rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require("../../eslint-test");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "guard-for-in";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolationsWithMessageAndNodeType(
        "The body of a for-in should be wrapped in an if statement to filter unwanted properties from the prototype.",
        "ForInStatement",
        ["for (var x in o) { foo() }",
        "for (var x in o) foo();"]
    )
    .addNonViolations([
        "for (var x in o) {}",   // no code in body, so can't be wrong
        "for (var x in o) { if (x) {}}",
    ])
    .export(module);
