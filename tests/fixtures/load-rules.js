module.exports = function() {
    var rules = Object.create(null);
    rules["custom-rule"] = require("./rules/custom-rule");
    rules["fixture-rule"] = require("./rules/fixture-rule");
    rules["make-syntax-error-rule"] = require("./rules/make-syntax-error-rule");
    rules["test-multi-rulesdirs"] = require("./rules/test-multi-rulesdirs");

    return rules;
};
