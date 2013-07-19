/**
 * @fileoverview Tests for no-fallthrough rule.
 * @author Matt DuVall<http://mattduvall.com/>
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    sinon = require("sinon"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "no-fallthrough";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "when evaluating `switch(foo) { case 'foo': foo.bar(); }`": {

        topic: "switch(foo) { case 'foo': foo.bar(); }",

        "should report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
            assert.equal(messages[0].message, "No fall-through without explicit comment.");
        }
    },

    "when evaluating `switch(foo) { case 'foo': foo.bar(); /* falls through */}`": {

        topic: "switch(foo) { case 'foo': foo.bar(); /* falls through */}",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `switch(foo) { case 'foo': foo.bar(); return; }`": {

        topic: "function foo() { switch(foo) { case 'foo': foo.bar(); return; }; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `switch(foo) { case 'foo': foo.bar(); throw 'bar'; }`": {

        topic: "switch(foo) { case 'foo': foo.bar(); throw 'bar'; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `switch(foo) { case 'bar': case 'foo': foo.bar(); break; }`": {

        topic: "switch(foo) { case 'bar': case 'foo': foo.bar(); break; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

    "when evaluating `switch(foo) { case 'bar': case 'foo': break; }`": {

        topic: "switch(foo) { case 'bar': case 'foo': break; }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },
    "when evaluating `switch(foo) { }`": {

        topic: "switch(foo) { }",

        "should not report a violation": function(topic) {

            var config = { rules: {} };
            config.rules[RULE_ID] = 1;

            var messages = eslint.verify(topic, config);

            assert.equal(messages.length, 0);
        }
    },

}).export(module);
