/**
 * @fileoverview Tests for camelcase rule.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var Test = require('../../eslint-test');

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "camelcase";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

new Test(RULE_ID)
    .addViolations("Non-camelcased identifier 'first_name' found.", {
        "first_name = \"Nicholas\"": function(assert, messages) {
            assert.include(messages[0].node.type, "Identifier");
            assert.include(messages[0].node.name, "first_name");
        }
    })
    .addNonViolations([
        "firstName = \"Nicholas\"",
        "FIRST_NAME = \"Nicholas\"",
        "__myPrivateVariable = \"Patrick\"",
        "myPrivateVariable_ = \"Patrick\"",
        "__private_first_name = \"Patrick\""
    ])
    .export(module);
