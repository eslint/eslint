/**
 * @fileoverview Main CLI object.
 * @author Nicholas C. Zakas
 */

//------------------------------------------------------------------------------
// Privates
//------------------------------------------------------------------------------

var rules = {
    "brace-style": require("./rules/brace-style"),
    "camelcase": require("./rules/camelcase"),
    "complexity": require("./rules/complexity"),
    "consistent-this": require("./rules/consistent-this"),
    "curly": require("./rules/curly"),
    "dot-notation": require("./rules/dot-notation"),
    "eqeqeq": require("./rules/eqeqeq"),
    "guard-for-in": require("./rules/guard-for-in"),
    "max-params": require("./rules/max-params"),
    "max-statements": require("./rules/max-statements"),
    "new-cap": require("./rules/new-cap"),
    "new-parens": require("./rules/new-parens"),
    "no-alert": require("./rules/no-alert"),
    "no-bitwise": require("./rules/no-bitwise"),
    "no-caller": require("./rules/no-caller"),
    "no-comma-dangle": require("./rules/no-comma-dangle"),
    "no-cond-assign": require("./rules/no-cond-assign"),
    "no-console": require("./rules/no-console"),
    "no-debugger": require("./rules/no-debugger"),
    "no-delete-var": require("./rules/no-delete-var"),
    "no-empty-label": require("./rules/no-empty-label"),
    "no-empty": require("./rules/no-empty"),
    "no-eq-null": require("./rules/no-eq-null"),
    "no-eval": require("./rules/no-eval"),
    "no-ex-assign": require("./rules/no-ex-assign"),
    "no-extra-semi": require("./rules/no-extra-semi"),
    "no-fallthrough": require("./rules/no-fallthrough"),
    "no-floating-decimal": require("./rules/no-floating-decimal"),
    "no-implied-eval": require("./rules/no-implied-eval"),
    "no-label-var": require("./rules/no-label-var"),
    "no-loop-func": require("./rules/no-loop-func"),
    "no-multi-str": require("./rules/no-multi-str"),
    "no-native-reassign": require("./rules/no-native-reassign"),
    "no-new-array": require("./rules/no-new-array"),
    "no-new-func": require("./rules/no-new-func"),
    "no-new-object": require("./rules/no-new-object"),
    "no-new-wrappers": require("./rules/no-new-wrappers"),
    "no-new": require("./rules/no-new"),
    "no-obj-calls": require("./rules/no-obj-calls"),
    "no-octal": require("./rules/no-octal"),
    "no-plusplus": require("./rules/no-plusplus"),
    "no-return-assign": require("./rules/no-return-assign"),
    "no-self-compare": require("./rules/no-self-compare"),
    "no-sync": require("./rules/no-sync"),
    "no-ternary": require("./rules/no-ternary"),
    "no-undef-init": require("./rules/no-undef-init"),
    "no-undef": require("./rules/no-undef"),
    "no-underscore-dangle": require("./rules/no-underscore-dangle"),
    "no-unreachable": require("./rules/no-unreachable"),
    "no-with": require("./rules/no-with"),
    "quote-props": require("./rules/quote-props"),
    "quotes": require("./rules/quotes"),
    "radix": require("./rules/radix"),
    "regex-spaces": require("./rules/regex-spaces"),
    "semi": require("./rules/semi"),
    "smarter-eqeqeq": require("./rules/smarter-eqeqeq"),
    "use-isnan": require("./rules/use-isnan"),
    "wrap-iife": require("./rules/wrap-iife")
};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.get = function(ruleId) {
    if({}.hasOwnProperty.call(rules, ruleId)) { return rules[ruleId]; }
};

exports.define = function(ruleId, ruleModule) {
    rules[ruleId] = ruleModule;
};
