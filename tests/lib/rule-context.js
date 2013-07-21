/**
 * @fileoverview Tests for eslint object.
 * @author Matt DuVall <http://www.mattduvall.com>
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    eslint = require("../../lib/eslint");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe("rule-context").addBatch({

    "when evaluating code": {

        topic: "new foo()",

        "should be able to use configuration options": function(topic) {

            var rule = "new-cap",
                config = { rules: {} };

            config.rules[rule] = [1, "foo"];

            eslint.reset();

            var verify = eslint.verify.bind(this);
            var messages = verify(topic, config, true);

            assert.equal(messages.length, 0);
        }
    }



}).export(module);