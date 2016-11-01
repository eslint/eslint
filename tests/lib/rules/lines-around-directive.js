/**
 * @fileoverview Require or disallow newlines around directives.
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-around-directive");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("lines-around-directive", rule, {
    valid: [

        // use "always" by default
        "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",

        // "always"
        // at top of file
        // single directive
        {
            code: "'use strict';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "\n'use strict';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            options: ["always"]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: ["always"]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;",
            options: ["always"]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"]
        },

        // does not warn about lack of blank newlines between directives
        {
            code: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },

        // is not affected by JSDoc comments when at top of function block
        {
            code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\n\nvar bar;\n}",
            options: ["always"]
        },

        // does not warn if the directive is the only statement in the function block and there are no comments
        {
            code: "function foo() {\n'use strict';\n}",
            options: ["always"]
        },

        // "never"
        // at top of file
        // single directive
        {
            code: "'use strict';\nvar foo;",
            options: ["never"]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            options: ["never"]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            options: ["never"]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: ["never"]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n'use strict';\nvar foo;",
            options: ["never"]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\nvar foo;",
            options: ["never"]
        },
        {
            code: "//comment\n'use strict';\nvar foo;",
            options: ["never"]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;",
            options: ["never"]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "function foo() {\n\n'use strict';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n'use strict';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "() => {\n//comment\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"]
        },

        // does not warn about blank newlines between directives
        {
            code: "//comment\n'use strict';\n\n'use asm';\nvar foo;",
            options: ["never"]
        },

        // is not affected by JSDoc comments when at top of function block
        {
            code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\nvar bar;\n}",
            options: ["never"]
        },

        // does not warn if the directive is the only statement in the function block and there are no comments
        {
            code: "function foo() {\n\n'use strict';\n\n}",
            options: ["never"]
        },

        // { "before": "never", "after": "always" }
        // at top of file
        // single directive
        {
            code: "'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "//comment\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n//comment\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }]
        },

        // { "before": "always", "after": "never" }
        // at top of file
        // single directive
        {
            code: "'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "//comment\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "function foo() {\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }]
        },

        // https://github.com/eslint/eslint/issues/7450
        {
            code: "'use strict'\n\n;foo();",
            options: [{ before: "never", after: "always" }]
        },
        {
            code: "'use strict'\n;foo();",
            options: [{ before: "never", after: "never" }]
        }
    ],

    invalid: [

        // "always"
        // at top of file
        // single directive
        {
            code: "'use strict';\nvar foo;",
            output: "'use strict';\n\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            output: "'use strict';\n\n//comment\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            output: "'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"],
            errors: ["Expected newline after \"use asm\" directive."]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "//comment\n'use strict';\nvar foo;",
            output: "//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\nvar foo;",
            output: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            output: "() => {\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: ["Expected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: ["Expected newline after \"use asm\" directive."]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["always"],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },

        // "never"
        // at top of file
        // single directive
        {
            code: "'use strict';\n\nvar foo;",
            output: "'use strict';\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            output: "'use strict';\n//comment\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            output: "'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "//comment\n\n'use strict';\n\nvar foo;",
            output: "//comment\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: ["never"],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },


        // { "before": "never", "after": "always" }
        // at top of file
        // single directive
        {
            code: "'use strict';\nvar foo;",
            output: "'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            output: "'use strict';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            output: "'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "//comment\n\n'use strict';\nvar foo;",
            output: "//comment\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\nvar foo;",
            output: "//comment\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "function foo() {\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            output: "() => {\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use asm\" directive."]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "never", after: "always" }],
            errors: [
                "Unexpected newline before \"use strict\" directive.",
                "Expected newline after \"use asm\" directive."
            ]
        },

        // { "before": "always", "after": "never" }
        // at top of file
        // single directive
        {
            code: "'use strict';\n\nvar foo;",
            output: "'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            output: "'use strict';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            output: "'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },

        // after comment at top of file
        // single directive
        {
            code: "#!/usr/bin/env node\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "//comment\n'use strict';\n\nvar foo;",
            output: "//comment\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\n\nvar foo;",
            output: "//comment\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },

        // at the top of function blocks
        // single directive
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: ["Unexpected newline after \"use asm\" directive."]
        },

        // after comment at top of function blocks
        // single directive
        {
            code: "function foo() {\n//comment\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use strict\" directive."
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            parserOptions: { ecmaVersion: 6 },
            options: [{ before: "always", after: "never" }],
            errors: [
                "Expected newline before \"use strict\" directive.",
                "Unexpected newline after \"use asm\" directive."
            ]
        },

        // https://github.com/eslint/eslint/issues/7450
        {

            code: "'use strict'\n\n;foo();",
            output: "'use strict'\n;foo();",
            options: [{ before: "never", after: "never" }],
            errors: ["Unexpected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict'\n;foo();",
            output: "'use strict'\n\n;foo();",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        },
        {
            code: "'use strict'\n;\nfoo();",
            output: "'use strict'\n\n;\nfoo();",
            options: [{ before: "never", after: "always" }],
            errors: ["Expected newline after \"use strict\" directive."]
        }
    ]
});
