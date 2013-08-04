/**
 * @fileoverview Tests for complexity rule.
 * @author Patrick Brosset
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var vows = require("vows"),
    assert = require("assert"),
    eslint = require("../../../lib/eslint");

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

var RULE_ID = "complexity";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getComplexityAssertion(threshold) {
    return function(topic) {
        var config = { rules: {} };

        // Test that given a lower threshold, a violation is created
        config.rules[RULE_ID] = [1, threshold - 1];
        var messages = eslint.verify(topic, config);
        assert.equal(messages.length, 1);
        assert.equal(messages[0].ruleId, RULE_ID);

        // Test that given the right threshold, no violation is created
        config.rules[RULE_ID] = [1, threshold];
        var messages = eslint.verify(topic, config);
        assert.equal(messages.length, 0);
    }
}

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

vows.describe(RULE_ID).addBatch({

    "When evaluating an empty function": {
        topic: "function a(x) {}",
        "should report a complexity of 1": getComplexityAssertion(1)
    },

    "When evaluating an IF statement": {
        topic: "function a(x) {if (true) {return x;}}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating an IF/ELSE statement": {
        topic: "function a(x) {if (true) {return x;} else {return x+1;}}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating an IF/ELSE IF statement": {
        topic: "function a(x) {if (true) {return x;} else if (false) {return x+1;} else {return 4;}}",
        "should report a complexity of 3": getComplexityAssertion(3)
    },

    "When evaluating a FOR statement": {
        topic: "function a(x) {for(var i = 0; i < 5; i ++) {x ++;} return x;}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating a FOR/IN statement": {
        topic: "function a(obj) {for(var i in obj) {obj[i] = 3;}}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating an IF in a FOR statement": {
        topic: "function a(x) {for(var i = 0; i < 5; i ++) {if(i % 2 === 0) {x ++;}} return x;}",
        "should report a complexity of 3": getComplexityAssertion(3)
    },

    "When evaluating an TRY/CATCH statement": {
        topic: "function a(x) {try {x.getThis();} catch (e) {x.getThat();}}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating an TRY/CATCH in a FOR in a IF statement": {
        topic: "function a(obj) {if(obj){ for(var x in obj) {try {x.getThis();} catch (e) {x.getThat();}}} else {return false;}}",
        "should report a complexity of 4": getComplexityAssertion(4)
    },

    "When evaluating a ternary conditional expression": {
        topic: "function a(x) {return x === 4 ? 3 : 5;}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating 2 ternary conditional expressions": {
        topic: "function a(x) {return x === 4 ? 3 : (x === 3 ? 2 : 1);}",
        "should report a complexity of 3": getComplexityAssertion(3)
    },

    "When evaluating a logical OR expression": {
        topic: "function a(x) {return x || 4;}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating a logical AND expression": {
        topic: "function a(x) {x && 4;}",
        "should report a complexity of 1": getComplexityAssertion(1)
    },

    "When evaluating a SWITCH/CASE statement": {
        topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: 3;}}",
        "should report a complexity of 3": getComplexityAssertion(3)
    },

    "When evaluating a SWITCH/CASE and IF statements": {
        topic: "function a(x) {switch(x){case 1: 1; break; case 2: 2; break; default: if(x == 'foo') {5;};}}",
        "should report a complexity of 4": getComplexityAssertion(4)
    },

    "When evaluating a WHILE statement": {
        topic: "function a(x) {while(true) {'foo';}}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating a DO/WHILE statement": {
        topic: "function a(x) {do {'foo';} while (true)}",
        "should report a complexity of 2": getComplexityAssertion(2)
    },

    "When evaluating an if statement": {
        topic: "if (foo) { bar(); }",
        "should not report a violation": function (topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 3];

            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 0);
        }
    },

    "When evaluating a simple function with 2 complex inner functions": {
        topic: "function a(x) {(function() {while(true){'foo';}})(); (function() {while(true){'bar';}})();}",
        "should report 2 violations for the inner functions": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 1];
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 2);
            assert.equal(messages[0].ruleId, RULE_ID);
        }
    },

    "When evaluating a simple function with 1 complex inner function and 1 simple inner function": {
        topic: "function a(x) {(function() {while(true){'foo';}})(); (function() {'bar';})();}",
        "should report 1 violations for 1 inner function": function(topic) {
            var config = { rules: {} };
            config.rules[RULE_ID] = [1, 1];
            var messages = eslint.verify(topic, config);
            assert.equal(messages.length, 1);
            assert.equal(messages[0].ruleId, RULE_ID);
        }
    }

}).export(module);
