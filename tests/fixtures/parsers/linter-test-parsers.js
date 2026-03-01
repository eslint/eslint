// Accumulates all of the parsers used by `tests/lib/linter.js`.
// This file will get bundled so that those tests can be run in a browser.

module.exports = {
    enhancedParser: require("./enhanced-parser"),
    stubParser: require("./stub-parser"),
    unknownLogicalOperator: require("./unknown-operators/unknown-logical-operator"),
    unknownLogicalOperatorNested: require("./unknown-operators/unknown-logical-operator-nested"),
    lineError: require("./line-error"),
    noLineError: require("./no-line-error"),
    enhancedParser2: require("./enhanced-parser2"),
    enhancedParser3: require("./enhanced-parser3"),
    throwsWithOptions: require("./throws-with-options"),
    nonJSParser: require('./non-js-parser')
};
