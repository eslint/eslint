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

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ALWAYS_MESSAGE = "Expected blank line after variable declarations.",
    NEVER_MESSAGE = "Unexpected blank line after variable declarations.";

var eslintTester = new ESLintTester(eslint);

eslintTester.addRuleTest("lib/rules/newline-after-var", {
    valid: [
        {
            // ignore `var` with no following token
            code: "var greet = 'hello';",
            options: ["always"]
        },
        {
            // ignore `var` with no following token
            code: "var greet = 'hello';",
            options: ["never"]
        },
        {
            code: "var greet = 'hello'; console.log(greet);",
            options: ["never"]
        },
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            options: ["always"]
        },
        {
            code: "var greet = 'hello';\n\n\nconsole.log(greet);",
            options: ["always"]
        },
        {
            // single-line `var` with inline comment
            code: "var greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: ["always"]
        },
        {
            // multi-line `var`
            code: "var greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        {
            // multi-line `var` with inline comments
            code: "var greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        {
            code: "var greet = 'hello'; var name = 'world';\n\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        {
            code: "var greet = 'hello';\nvar name = 'world';\n\n\nconsole.log(greet, name);",
            options: ["always"]
        },
        {
            // invalid configuration option
            code: "var greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["foobar"]
        },

        // ES6 block bindings

        {
            // ignore `let` with no following token
            code: "let greet = 'hello';",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // ignore `let` with no following token
            code: "let greet = 'hello';",
            options: ["never"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "let greet = 'hello';\n\nconsole.log(greet);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "let greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "let greet = 'hello';\nconst name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // single-line `let` with inline comment
            code: "let greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // multi-line `let`
            code: "let greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // multi-line `let` with inline comments
            code: "let greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // ignore `const` with no following token
            code: "const greet = 'hello';",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // ignore `const` with no following token
            code: "const greet = 'hello';",
            options: ["never"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "const greet = 'hello';\nvar name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            code: "const greet = 'hello';\nlet name = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // single-line `const` with inline comment
            code: "const greet = 'hello'; // inline comment\n\nconsole.log(greet);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // multi-line `const`
            code: "const greet = 'hello',\nname = 'world';\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        },
        {
            // multi-line `const` with inline comments
            code: "const greet = 'hello', // inline comment\nname = 'world'; // inline comment\n\nconsole.log(greet, name);",
            options: ["always"],
            ecmaFeatures: {
                blockBindings: true
            }
        }
    ],

    invalid: [
        {
            code: "var greet = 'hello';\n\nconsole.log(greet);",
            options: ["never"],
            errors: [{
                message: NEVER_MESSAGE,
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; console.log(greet);",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                type: "VariableDeclaration"
            }]
        },
        {
            code: "var greet = 'hello'; var name = 'world'; console.log(greet);",
            options: ["always"],
            errors: [{
                message: ALWAYS_MESSAGE,
                type: "VariableDeclaration"
            }]
        },

        // ES6 block bindings

        {
            code: "let greet = 'hello'; const name = 'world';\n\nconsole.log(greet);",
            options: ["never"],
            ecmaFeatures: {
                blockBindings: true
            },
            errors: [{
                message: NEVER_MESSAGE,
                type: "VariableDeclaration"
            }]
        },
        {
            code: "const greet = 'hello';\nlet name = 'world';\n\nconsole.log(greet, name);",
            options: ["never"],
            ecmaFeatures: {
                blockBindings: true
            },
            errors: [{
                message: NEVER_MESSAGE,
                type: "VariableDeclaration"
            }]
        },
        {
            // invalid configuration option
            code: "var greet = 'hello';\nvar name = 'world';\nconsole.log(greet, name);",
            options: ["foobar"],
            errors: [{
                message: ALWAYS_MESSAGE,
                type: "VariableDeclaration"
            }]
        }
    ]
});
