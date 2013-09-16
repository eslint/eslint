/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = Object.create(null),
    loadRules = require("./load-rules");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------
function define(ruleId, ruleModule) {
    rules[ruleId] = ruleModule;
}

function load(rulesDir) {
    var newRules = loadRules(rulesDir);
    Object.keys(newRules).forEach(function(ruleId) {
        define(ruleId, newRules[ruleId]);
    });
}
exports.load = load;

exports.get = function(ruleId) {
    return rules[ruleId];
};

exports.define = define;

//------------------------------------------------------------------------------
// Initialization
//------------------------------------------------------------------------------

// loads built-in rules
load();
