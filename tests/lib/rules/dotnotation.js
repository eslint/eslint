/**
 * @fileoverview Tests for dot-notation rule.
 * @author Josh Perez
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

var RULE_ID = "dot-notation";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function noViolation(topic) {
    var config = { rules: {} };
    config.rules[RULE_ID] = 1;
    var messages = eslint.verify(topic, config);
    assert.equal(messages.length, 0);
}

function violation(message) {
    return function(topic) {
        var config = { rules: {} };
        config.rules[RULE_ID] = 1;

        var messages = eslint.verify(topic, config);

        assert.equal(messages.length, 1);
        assert.equal(messages[0].ruleId, RULE_ID);
        assert.equal(messages[0].message, "['" + message + "'] is better written in dot notation.");
        assert.include(messages[0].node.type, "MemberExpression");
    }
}

vows.describe(RULE_ID).addBatch({
    "when evaluating a computed MemberExpression": {
        topic: "a['b'];",
        "should report a violation": violation("b")
    },

    "when evaluating a chained computed and uncomputed MemberExpression": {
        topic: "a.b['c'];",
        "should report a violation": violation("c")
    },

    "when evaluating an uncomputed MemberExpression": {
        topic: "a.b;",
        "should not report a violation": noViolation
    },

    "when evaluating a chained uncomputed MemberExpression": {
        topic: "a.b.c;",
        "should not report a violation": noViolation
    },

    "when evaluating a computed MemberExpression using numbers": {
        topic: "a['12'];",
        "should not report a violation": noViolation
    },

    "when evaluating a computed MemberExpression using reserved word": {
        topic: "a['while'];",
        "should not report a violation": noViolation
    },

    "when evaluating a computed MemberExpression using a function call": {
        topic: "a[b()];",
        "should not report a violation": noViolation
    }
}).export(module);
