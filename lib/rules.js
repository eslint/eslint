/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = require("./load-rules");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.get = function(ruleId) {
    if({}.hasOwnProperty.call(rules, ruleId)) { return rules[ruleId]; }
};

exports.define = function(ruleId, ruleModule) {
    rules[ruleId] = ruleModule;
};
