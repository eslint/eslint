/**
 * @fileoverview Tests for no-floating-decimal rule.
 * @author James Allardice
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

var RULE_ID = "wrap-iife";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

function makeViolationHandler(num) {
    return function (topic) {
        var config = { rules: {} };
        config.rules[RULE_ID] = 1;

        var messages = eslint.verify(topic, config);

        assert.equal(messages.length, num || 1);
        assert.equal(messages[0].ruleId, RULE_ID);
        assert.equal(messages[0].message, "Wrap an immediate function invocation in parentheses.");
        assert.include(messages[0].node.type, "CallExpression");
    };
}

function noViolation(topic) {
    var config = { rules: {} };
    config.rules[RULE_ID] = 1;

    var messages = eslint.verify(topic, config);

    assert.equal(messages.length, 0);
}

vows.describe(RULE_ID).addBatch({

    "when evaluating 'var x = function () {}();'": {

        topic: "var x = function () {}();",

        "should report a violation": makeViolationHandler(1)
    },

    "when evaluating 'var x = function (a, b) {}(1, 2);'": {

        topic: "var x = function (a, b) {}(1, 2);",

        "should report a violation": makeViolationHandler(1)
    },

    /*
     * JSHint does not issue any warnings for this. JSLint issues 2 warnings.
     * If you wrap the entire expression in parens, JSHint still issues no
     * warnings, and JSLint issues 1.
     *
     * ESLint issues 2 warnings (one for each IIFE) regardless of the wrapping
     * of the whole expression in parens.
     */
    "when evaluating 'var x = function () { return true; }() && function () { return false; }();'": {

        topic: "var x = function () { return true; }() && function () { return false; }();",

        "should report a violation": makeViolationHandler(2)
    },

    "when evaluating 'var x = (function () {}());'": {

        topic: "var x = (function () {}());",

        "should not report a violation": noViolation
    },

    "when evaluating 'var x = (function (a, b) {}(1, 2));'": {

        topic: "var x = (function (a, b) {}(1, 2));",

        "should not report a violation": noViolation
    },

    "when evaluating 'var x = (function () {})();'": {

        topic: "var x = (function () {})();",

        "should not report a violation": noViolation
    },

    "when evaluating 'var x = (function (a, b) {})(1, 2);'": {

        topic: "var x = (function (a, b) {})(1, 2);",

        "should not report a violation": noViolation
    }

}).export(module);
