/**
 * @fileoverview Tests for no-alert rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-alert";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolationsWithMessageAndNodeType("Unexpected alert.", "CallExpression", [
      "alert(foo)",
      "window.alert(foo)"
    ])
    .addViolationsWithMessageAndNodeType("Unexpected confirm.", "CallExpression", [
      "confirm(foo)",
      "window.confirm(foo)"
    ])
    .addViolationsWithMessageAndNodeType("Unexpected prompt.", "CallExpression", [
      "prompt(foo)",
      "window.prompt(foo)"
    ])
    .addNonViolations([
        "a[o.k](1)",
        "foo.alert(foo)",
        "foo.confirm(foo)",
        "foo.prompt(foo)"
    ])
    .export(module);
