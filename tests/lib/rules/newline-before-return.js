/**
 * @fileoverview Rule to check empty line before "return" statement
 * @author Eric Clemmons <eric@smarterspam.com>
 * @copyright 2014 Eric Clemmons. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Fixtures
//------------------------------------------------------------------------------

var NO_RETURN = "function test() {\nconsole.log('hello');\n}";
var IF_RETURN = "function test() {\nif (a)\nreturn;\n}";
var IF_NO_BLANK_RETURN = "function test() {\nif (a)\nvar greet= 'hello';\nreturn greet;\n}";
var ONLY_RETURN = "function test() {\nreturn 'hello';\n}";
var NO_BREAK = "function test() {\nvar greet = 'hello'; return greet;\n}";
var NO_BLANK = "function test() {\nvar greet = 'hello';\nreturn greet;\n}";
var ONE_BLANK = "function test() {\nvar greet = 'hello';\n\nreturn greet;\n}";
var TWO_BLANK = "function test() {\nvar greet = 'hello';\n\n\nreturn greet;\n}";
var THREE_BLANK = "function test() {\nvar greet = 'hello';\n\n\n\nreturn greet;\n}";
var COMMENT_AND_NO_BLANK = "function test() {\nvar greet = 'hello';\n// Multi-line\n// comment\nreturn greet;\n}";
var COMMENT_AND_BLANK = "function test() {\nvar greet = 'hello';\n\n// Multi-line\n// comment\nreturn greet;\n}";
var BLANK_BEFORE_COMMENT = "function test() {\nvar greet = 'hello';\n\n// Comment\nreturn greet;\n}";
var BLANK_BEFORE_BLOCK_COMMENT = "function test() {\nvar greet = 'hello';\n\n/*\n Comment\n*/\nreturn greet;\n}";
var BLANK_AFTER_COMMENT = "function test() {\nvar greet = 'hello';\n\n// Comment\n\nreturn greet;\n}";
var GLOBAL_ONLY_RETURN = "return 'hello';";
var GLOBAL_NO_BREAK = "var greet = 'hello'; return greet;";
var GLOBAL_ONE_BLANK = "function test() {\nvar greet = 'hello';\n\nreturn greet;\n}";

var ERROR = {
    message: "Expected blank line before `return` statement.",
    type: "ReturnStatement"
};

var FEATURES = {
    globalReturn: true
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/newline-before-return", {
    valid: [
        NO_RETURN, // should skip rule entirely
        IF_RETURN, // should not require preceding blank
        ONLY_RETURN, // should not require preceding blank
        ONE_BLANK, // should be satisfied with preceding blank
        TWO_BLANK, // should be satisfied with preceding blank
        THREE_BLANK, // should be satisfied with preceding blank
        COMMENT_AND_BLANK, // should ignore commented lines
        BLANK_BEFORE_COMMENT, // should ignore commented lines
        BLANK_BEFORE_BLOCK_COMMENT, // should ignore commented lines
        BLANK_AFTER_COMMENT, // should ignore commented lines

        // // should skip rule entirely
        { code: GLOBAL_ONLY_RETURN, ecmaFeatures: FEATURES },

        // // should behave just like non-globalReturn version
        { code: GLOBAL_ONE_BLANK, ecmaFeatures: FEATURES }
    ],

    invalid: [
        { code: NO_BREAK, errors: [ERROR] },
        { code: NO_BLANK, errors: [ERROR] },
        { code: COMMENT_AND_NO_BLANK, errors: [ERROR] },
        { code: GLOBAL_NO_BREAK, ecmaFeatures: FEATURES, errors: [ERROR] },
        { code: IF_NO_BLANK_RETURN, errors: [ERROR] }
    ]
});
