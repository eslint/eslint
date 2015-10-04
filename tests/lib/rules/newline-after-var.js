/**
 * @fileoverview Tests for newline-after-var rule.
 * @author Gopal Venkatesan
 * @copyright 2015 Gopal Venkatesan. All rights reserved.
 * @copyright 2015 Casey Visco. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/newline-after-var"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Fixtures
//------------------------------------------------------------------------------

// Valid for both "Always" and "Never"
var NO_VAR = "console.log(greet);",
    ONLY_VAR = "var greet = 'hello';",
    FOR_LOOP_WITH_LET = "for(let a = 1; a < 1; a++){\n break;\n}",
    FOR_LOOP_WITH_VAR = "for(var a = 1; a < 1; a++){\n break;\n}",
    FOR_IN_LOOP_WITH_LET = "for(let a in obj){\n break;\n}",
    FOR_IN_LOOP_WITH_VAR = "for(var a in obj){\n break;\n}",
    FOR_OF_LOOP_WITH_LET = "for(let a in obj){\n break;\n}",
    FOR_OF_LOOP_WITH_VAR = "for(var a in obj){\n break;\n}",
    EXPORT_WITH_LET = "export let a = 1;\nexport let b = 2;",
    EXPORT_WITH_VAR = "export var a = 1;\nexport var b = 2;",
    EXPORT_WITH_CONST = "export const a = 1;\nexport const b = 2;",
    END_OF_FUNCTION = "function example() {\nvar greet = 'hello'\n}",
    END_OF_FUNCTION_EXPRESSION = "var f = function() {\nvar greet = 'hello'\n};",
    END_OF_ARROW_FUNCTION = "() => {\nvar greet = 'hello';\n}";


// Valid for "Always"
var ONE_BLANK = "var greet = 'hello';\n\nconsole.log(greet);",
    TWO_BLANKS = "var greet = 'hello';\n\n\nconsole.log(greet);",
    THREE_BLANKS = "var greet = 'hello';\n\n\n\nconsole.log(greet);",
    ONE_BLANK_WITH_TRAILING_WS = "var greet = 'hello';    \n\nconsole.log(greet);",
    ONE_BLANK_WITH_INLINE_COMMENT = "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
    NEXT_LINE_COMMENT_ONE_BLANK = "var greet = 'hello';\n// next-line comment\n\nconsole.log(greet);",
    NEXT_LINE_BLOCK_COMMENT_ONE_BLANK = "var greet = 'hello';\n/* block comment\nblock comment */\n\nconsole.log(greet);",
    NEXT_LINE_TWO_COMMENTS_ONE_BLANK = "var greet = 'hello';\n// next-line comment\n// second-line comment\n\nconsole.log(greet);",
    MIXED_COMMENT_ONE_BLANK = "var greet = 'hello';\n// inline comment\nvar name = 'world';\n\nconsole.log(greet, name);",
    MIXED_BLOCK_COMMENT_ONE_BLANK = "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\n\nconsole.log(greet, name);",
    MULTI_VAR_ONE_BLANK = "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
    MULTI_DEC_ONE_BLANK = "var greet = 'hello', name = 'world';\n\nconsole.log(greet, name);",
    MULTI_LINE_ONE_BLANK = "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
    MULTI_LINE_ONE_BLANK_WITH_COMMENTS = "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
    LET_ONE_BLANK = "let greet = 'hello';\n\nconsole.log(greet);",
    CONST_ONE_BLANK = "const greet = 'hello';\n\nconsole.log(greet);",
    MIXED_LET_VAR = "let greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
    MIXED_CONST_VAR = "const greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
    MIXED_LET_CONST = "let greet = 'hello';\nconst name = 'world';\n\nconsole.log(greet, name);";


// Valid for "Never"
var NO_BREAK = "var greet = 'hello'; console.log(greet);",
    NO_BLANK = "var greet = 'hello';\nconsole.log(greet);",
    NO_BLANK_WITH_TRAILING_WS = "var greet = 'hello';    \nconsole.log(greet);",
    NO_BLANK_WITH_INLINE_COMMENT = "var greet = 'hello'; // inline comment\nconsole.log(greet);",
    NEXT_LINE_COMMENT = "var greet = 'hello';\n// next-line comment\nconsole.log(greet);",
    NEXT_LINE_BLOCK_COMMENT = "var greet = 'hello';\n/* block comment\nblock comment */\nconsole.log(greet);",
    NEXT_LINE_TWO_COMMENTS_NO_BLANK = "var greet = 'hello';\n// next-line comment\n// second-line comment\nconsole.log(greet);",
    NEXT_LINE_COMMENT_BLOCK_COMMENT_NO_BLANK = "var greet = 'hello';\n// next-line comment\n/* block comment\nblock comment */\nconsole.log(greet);",
    MIXED_COMMENT_NO_BLANK = "var greet = 'hello';\n// inline comment\nvar name = 'world';\nconsole.log(greet, name);",
    MIXED_BLOCK_COMMENT_NO_BLANK = "var greet = 'hello';\n/* block comment\nblock comment */\nvar name = 'world';\nconsole.log(greet, name);",
    MULTI_VAR_NO_BREAK = "var greet = 'hello'; var name = 'world'; console.log(greet, name);",
    MULTI_VAR_NO_BLANK = "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
    MULTI_DEC_NO_BREAK = "var greet = 'hello', name = 'world'; console.log(greet, name);",
    MULTI_DEC_NO_BLANK = "var greet = 'hello', name = 'world';\nconsole.log(greet, name);",
    MULTI_LINE_NO_BLANK = "var greet = 'hello',\nname = 'world';\nconsole.log(greet, name);",
    MULTI_LINE_NO_BLANK_WITH_COMMENTS = "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\nconsole.log(greet, name);",
    MULTI_LINE_NEXT_LINE_COMMENT = "var greet = 'hello',\nname = 'world';\n// next-line comment\nconsole.log(greet);",
    MULTI_LINE_NEXT_LINE_BLOCK_COMMENT = "var greet = 'hello',\nname = 'world';\n/* block comment\nblock comment */\nconsole.log(greet);",
    LET_NO_BLANK = "let greet = 'hello';\nconsole.log(greet);",
    CONST_NO_BLANK = "const greet = 'hello';\nconsole.log(greet);",
    NOT_END_OF_FUNCTION = "function example() {\nvar greet = 'hello';\nconsole.log(greet);\n}",
    NOT_END_OF_FUNCTION_EXPRESSION = "var f = function() {\nvar greet = 'hello';\nconsole.log(greet);\n};",
    NOT_END_OF_ARROW_FUNCTION = "() => {\nvar greet = 'hello';\nconsole.log(greet);\n}";

var ALWAYS_ERROR = {
    message: "Expected blank line after variable declarations.",
    type: "VariableDeclaration"
};

var NEVER_ERROR = {
    message: "Unexpected blank line after variable declarations.",
    type: "VariableDeclaration"
};

var BLOCK_BINDINGS = { blockBindings: true };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("newline-after-var", rule, {
    valid: [
        // should skip rule entirely
        { code: NO_VAR, options: ["always"] },
        { code: NO_VAR, options: ["never"] },

        // should ignore a `var` with no following token
        { code: ONLY_VAR, options: ["always"] },
        { code: ONLY_VAR, options: ["never"] },

        // should allow no line break in "never" mode
        { code: NO_BREAK, options: ["never"] },

        // should allow no blank line in "never" mode
        { code: NO_BLANK, options: ["never"] },

        // should allow one blank line in "always" mode
        { code: ONE_BLANK, options: ["always"] },

        // should allow two or more blank lines in "always" mode
        { code: TWO_BLANKS, options: ["always"] },
        { code: THREE_BLANKS, options: ["always"] },

        // should allow trailing whitespace after the `var`
        { code: ONE_BLANK_WITH_TRAILING_WS, options: ["always"] },
        { code: NO_BLANK_WITH_TRAILING_WS, options: ["never"] },

        // should allow inline comments after the `var`
        { code: ONE_BLANK_WITH_INLINE_COMMENT, options: ["always"] },
        { code: NO_BLANK_WITH_INLINE_COMMENT, options: ["never"] },

        // should allow a comment on the next line in "never" mode
        { code: NEXT_LINE_COMMENT, options: ["never"] },
        { code: NEXT_LINE_BLOCK_COMMENT, options: ["never"] },

        // should allow comments on the next line followed by a blank in "always" mode
        { code: NEXT_LINE_COMMENT_ONE_BLANK, options: ["always"] },
        { code: NEXT_LINE_BLOCK_COMMENT_ONE_BLANK, options: ["always"] },
        { code: NEXT_LINE_TWO_COMMENTS_ONE_BLANK, options: ["always"] },

        // should allow comments on the next line followed by no blank in "never" mode
        { code: NEXT_LINE_TWO_COMMENTS_NO_BLANK, options: ["never"] },
        { code: NEXT_LINE_COMMENT_BLOCK_COMMENT_NO_BLANK, options: ["never"] },

        // should allow another `var` statement to follow without blank line
        { code: MULTI_VAR_NO_BREAK, options: ["never"] },
        { code: MULTI_VAR_NO_BLANK, options: ["never"] },
        { code: MULTI_VAR_ONE_BLANK, options: ["always"] },

        // should allow a comment directly between `var` statements
        { code: MIXED_COMMENT_ONE_BLANK, options: ["always"] },
        { code: MIXED_BLOCK_COMMENT_ONE_BLANK, options: ["always"] },
        { code: MIXED_COMMENT_NO_BLANK, options: ["never"] },
        { code: MIXED_BLOCK_COMMENT_NO_BLANK, options: ["never"] },

        // should handle single `var` statement with multiple declarations
        { code: MULTI_DEC_NO_BREAK, options: ["never"] },
        { code: MULTI_DEC_NO_BLANK, options: ["never"] },
        { code: MULTI_DEC_ONE_BLANK, options: ["always"] },

        // should handle single `var` statement with multi-line declaration
        { code: MULTI_LINE_ONE_BLANK, options: ["always"] },
        { code: MULTI_LINE_NO_BLANK, options: ["never"] },
        { code: MULTI_LINE_ONE_BLANK_WITH_COMMENTS, options: ["always"] },
        { code: MULTI_LINE_NO_BLANK_WITH_COMMENTS, options: ["never"] },
        { code: MULTI_LINE_NEXT_LINE_COMMENT, options: ["never"] },
        { code: MULTI_LINE_NEXT_LINE_BLOCK_COMMENT, options: ["never"] },

        // should handle ES6 `let` block binding
        { code: LET_ONE_BLANK, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: LET_NO_BLANK, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },

        // should handle ES6 `const` block binding
        { code: CONST_ONE_BLANK, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: CONST_NO_BLANK, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },

        // should handle a mix of `var`, `let`, or `const`
        { code: MIXED_LET_VAR, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: MIXED_CONST_VAR, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: MIXED_LET_CONST, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },

        // should handle a mix of `var` or `let` inside for variations
        { code: FOR_LOOP_WITH_LET, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_LOOP_WITH_VAR, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_LOOP_WITH_LET, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_LOOP_WITH_VAR, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_IN_LOOP_WITH_LET, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_IN_LOOP_WITH_VAR, options: ["always"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_IN_LOOP_WITH_LET, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_IN_LOOP_WITH_VAR, options: ["never"], ecmaFeatures: BLOCK_BINDINGS },
        { code: FOR_OF_LOOP_WITH_LET, options: ["always"], ecmaFeatures: { blockBindings: true, forOf: true } },
        { code: FOR_OF_LOOP_WITH_VAR, options: ["always"], ecmaFeatures: { blockBindings: true, forOf: true } },
        { code: FOR_OF_LOOP_WITH_LET, options: ["never"], ecmaFeatures: { blockBindings: true, forOf: true } },
        { code: FOR_OF_LOOP_WITH_VAR, options: ["never"], ecmaFeatures: { blockBindings: true, forOf: true } },

        // should handle export specifiers
        { code: EXPORT_WITH_LET, options: ["never"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: EXPORT_WITH_LET, options: ["always"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: EXPORT_WITH_VAR, options: ["never"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: EXPORT_WITH_VAR, options: ["always"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: EXPORT_WITH_CONST, options: ["never"], ecmaFeatures: { blockBindings: true, modules: true } },
        { code: EXPORT_WITH_CONST, options: ["always"], ecmaFeatures: { blockBindings: true, modules: true } },

        // should allow no blank line at end of function
        { code: END_OF_FUNCTION, options: ["always"] },
        { code: END_OF_FUNCTION, options: ["never"] },
        { code: NOT_END_OF_FUNCTION, options: ["never"]},
        { code: END_OF_FUNCTION_EXPRESSION, options: ["always"] },
        { code: END_OF_FUNCTION_EXPRESSION, options: ["never"] },
        { code: NOT_END_OF_FUNCTION_EXPRESSION, options: ["never"]},
        { code: END_OF_ARROW_FUNCTION, options: ["always"], ecmaFeatures: {arrowFunctions: true}},
        { code: END_OF_ARROW_FUNCTION, options: ["never"], ecmaFeatures: {arrowFunctions: true}},
        { code: NOT_END_OF_ARROW_FUNCTION, options: ["never"], ecmaFeatures: {arrowFunctions: true}}
    ],

    invalid: [
        // should disallow no line break in "always" mode
        { code: NO_BREAK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_VAR_NO_BREAK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_DEC_NO_BREAK, options: ["always"], errors: [ALWAYS_ERROR] },

        // should disallow no blank line in "always" mode
        { code: NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NO_BLANK_WITH_TRAILING_WS, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NO_BLANK_WITH_INLINE_COMMENT, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_VAR_NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_DEC_NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_LINE_NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: LET_NO_BLANK, options: ["always"], ecmaFeatures: BLOCK_BINDINGS, errors: [ALWAYS_ERROR] },
        { code: CONST_NO_BLANK, options: ["always"], ecmaFeatures: BLOCK_BINDINGS, errors: [ALWAYS_ERROR] },
        { code: NOT_END_OF_FUNCTION, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NOT_END_OF_FUNCTION_EXPRESSION, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NOT_END_OF_ARROW_FUNCTION, options: ["always"], ecmaFeatures: {arrowFunctions: true}, errors: [ALWAYS_ERROR]},

        // should disallow blank lines in "never" mode
        { code: ONE_BLANK, options: ["never"], errors: [NEVER_ERROR] },
        { code: TWO_BLANKS, options: ["never"], errors: [NEVER_ERROR] },
        { code: THREE_BLANKS, options: ["never"], errors: [NEVER_ERROR] },
        { code: ONE_BLANK_WITH_TRAILING_WS, options: ["never"], errors: [NEVER_ERROR] },
        { code: ONE_BLANK_WITH_INLINE_COMMENT, options: ["never"], errors: [NEVER_ERROR] },
        { code: MULTI_VAR_ONE_BLANK, options: ["never"], errors: [NEVER_ERROR] },
        { code: MULTI_DEC_ONE_BLANK, options: ["never"], errors: [NEVER_ERROR] },
        { code: MULTI_LINE_ONE_BLANK, options: ["never"], errors: [NEVER_ERROR] },
        { code: MULTI_LINE_ONE_BLANK_WITH_COMMENTS, options: ["never"], errors: [NEVER_ERROR] },
        { code: LET_ONE_BLANK, options: ["never"], ecmaFeatures: BLOCK_BINDINGS, errors: [NEVER_ERROR] },
        { code: CONST_ONE_BLANK, options: ["never"], ecmaFeatures: BLOCK_BINDINGS, errors: [NEVER_ERROR] },

        // should disallow a comment on the next line that's not in turn followed by a blank in "always" mode
        { code: NEXT_LINE_COMMENT, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NEXT_LINE_BLOCK_COMMENT, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_LINE_NEXT_LINE_COMMENT, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: MULTI_LINE_NEXT_LINE_BLOCK_COMMENT, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NEXT_LINE_TWO_COMMENTS_NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] },
        { code: NEXT_LINE_COMMENT_BLOCK_COMMENT_NO_BLANK, options: ["always"], errors: [ALWAYS_ERROR] }
    ]
});
