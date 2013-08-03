/**
 * @fileoverview Tests for rules.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    rules = require("../../lib/rules");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("rules").addBatch({

    "when a rule has been defined": {

        "should be able to retrieve the rule": function() {
            var ruleId = "michaelficarra";
            rules.define(ruleId, {});
            assert.ok(rules.get(ruleId));
        }

    }

}).export(module);
