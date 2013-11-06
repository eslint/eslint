/**
 * @fileoverview Tests for eqeqeq rule.
 * @author Nicholas C. Zakas
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

var RULE_ID = "eqeqeq";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
function noViolation(topic, smart) {
    var config = { rules: {} };

    if (!!smart) {
        config.rules[RULE_ID] = [1, "smart"];
    } else {
        config.rules[RULE_ID] = [1];
    }
    var messages = eslint.verify(topic, config);
    assert.equal(messages.length, 0);
}

function violation(message, nodeType, smart) {
    return function(topic) {
        var config = { rules: {} };

        if (!!smart) {
            config.rules[RULE_ID] = [1, "smart"];
        } else {
            config.rules[RULE_ID] = [1];
        }

        var messages = eslint.verify(topic, config);

        assert.equal(messages.length, 1);
        assert.equal(messages[0].ruleId, RULE_ID);
        assert.equal(messages[0].message, message);
        assert.include(messages[0].node.type, nodeType);
    };
}

var eqViolation = violation("Expected '===' and instead saw '=='.", "BinaryExpression");
var neqViolation = violation("Expected '!==' and instead saw '!='.", "BinaryExpression");
var eqSmartViolation = violation("Expected '===' and instead saw '=='.", "BinaryExpression", true);
var neqSmartViolation = violation("Expected '!==' and instead saw '!='.", "BinaryExpression", true);
var noSmartViolation = function(topic) {
    return noViolation(topic, true);
};

vows.describe(RULE_ID).addBatch({

    "when evaluating 'a == b'": {
        topic: "a == b",
        "should report a violation": eqViolation
    },

    "when evaluating 'a != b'": {
        topic: "a != b",
        "should report a violation": neqViolation
    },


    "when evaluating 'a === b'": {
        topic: "a === b",
        "should report a violation": noViolation
    },

    "when evaluating 'a !== b'": {
        topic: "a !== b",
        "should report a violation": noViolation
    },

    "when evaluating typeof": {
        topic: "typeof a == 'number'",
        "should not report a violation": noSmartViolation
    },

    "when evaluating yoda comparison typeof": {
        topic: "'string' != typeof a",
        "should not report a violation": noSmartViolation
    },

    "when comparing two literals of type string": {
        topic: "'hello' != 'world'",
        "should not report a violation": noSmartViolation
    },

    "when comparing two literals of type number": {
        topic: "2 == 3",
        "should not report a violation": noSmartViolation
    },

    "when comparing two literals of type boolean": {
        topic: "true == true",
        "should not report a violation": noSmartViolation
    },

    "when comparing two literals of mixed types boolean and number": {
        topic: "true == 1",
        "should report a violation": eqSmartViolation
    },

    "when comparing two literals of mixed types number and string": {
        topic: "0 != '1'",
        "should report a violation": neqSmartViolation
    },

    "when comparing a string and regexp": {
        topic: "'wee' == /wee/",
        "should report a violation": eqSmartViolation
    }
}).export(module);


vows.describe(RULE_ID).addBatch({
}).export(module);
