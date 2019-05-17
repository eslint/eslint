/**
 * @fileoverview Require or disallow newlines around directives.
 * @author Kai Cataldo
 * @deprecated
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
const expectedBeforeStrictError = { messageId: "expected", data: { location: "before", value: "use strict" } };
const expectedAfterStrictError = { messageId: "expected", data: { location: "after", value: "use strict" } };
const expectedAfterAsmError = { messageId: "expected", data: { location: "after", value: "use asm" } };
const unexpectedBeforeStrictError = { messageId: "unexpected", data: { location: "before", value: "use strict" } };
const unexpectedAfterStrictError = { messageId: "unexpected", data: { location: "after", value: "use strict" } };
const unexpectedAfterAsmError = { messageId: "unexpected", data: { location: "after", value: "use asm" } };

ruleTester.run("lines-around-directive", rule, {
    valid: [

        // use "always" by default
        "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",

        /*
         * "always"
         * at top of file
         * single directive
         */
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

        /*
         * after comment at top of file
         * single directive
         */
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

        // does not warn about lack of blank newlines between directives
        {
            code: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"]
        },

        /*
         * at the top of function blocks
         * single directive
         */
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 }
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

        /*
         * "never"
         * at top of file
         * single directive
         */
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

        /*
         * after comment at top of file
         * single directive
         */
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

        /*
         * at the top of function blocks
         * single directive
         */
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
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
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 }
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

        /*
         * { "before": "never", "after": "always" }
         * at top of file
         * single directive
         */
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

        /*
         * after comment at top of file
         * single directive
         */
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

        /*
         * at the top of function blocks
         * single directive
         */
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
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
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
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * { "before": "always", "after": "never" }
         * at top of file
         * single directive
         */
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

        /*
         * after comment at top of file
         * single directive
         */
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

        /*
         * at the top of function blocks
         * single directive
         */
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
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
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
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
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
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 }
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

        /*
         * "always"
         * at top of file
         * single directive
         */
        {
            code: "'use strict';\nvar foo;",
            output: "'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [expectedAfterStrictError]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            output: "'use strict';\n\n//comment\nvar foo;",
            options: ["always"],
            errors: [expectedAfterStrictError]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"],
            errors: [expectedAfterStrictError]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            output: "'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [expectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: ["always"],
            errors: [expectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["always"],
            errors: [expectedAfterAsmError]
        },

        /*
         * after comment at top of file
         * single directive
         */
        {
            code: "#!/usr/bin/env node\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "//comment\n'use strict';\nvar foo;",
            output: "//comment\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\nvar foo;",
            output: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },

        /*
         * at the top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: [expectedAfterStrictError]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            output: "() => {\n'use strict';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterStrictError]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: [expectedAfterAsmError]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterAsmError]
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n//comment\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: ["always"],
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: ["always"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },

        /*
         * "never"
         * at top of file
         * single directive
         */
        {
            code: "'use strict';\n\nvar foo;",
            output: "'use strict';\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            output: "'use strict';\n//comment\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterStrictError]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            output: "'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: ["never"],
            errors: [unexpectedAfterAsmError]
        },

        /*
         * after comment at top of file
         * single directive
         */
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "//comment\n\n'use strict';\n\nvar foo;",
            output: "//comment\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "#!/usr/bin/env node\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "//comment\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },

        /*
         * at the top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterStrictError]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterAsmError]
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n//comment\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar bar;\n}",
            options: ["never"],
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n'use asm';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\nvar foo;\n}",
            options: ["never"],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },


        /*
         * { "before": "never", "after": "always" }
         * at top of file
         * single directive
         */
        {
            code: "'use strict';\nvar foo;",
            output: "'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },
        {
            code: "'use strict';\n//comment\nvar foo;",
            output: "'use strict';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },
        {
            code: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\nvar foo;",
            output: "'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterAsmError]
        },

        /*
         * after comment at top of file
         * single directive
         */
        {
            code: "#!/usr/bin/env node\n\n'use strict';\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "//comment\n\n'use strict';\nvar foo;",
            output: "//comment\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\nvar foo;",
            output: "#!/usr/bin/env node\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "//comment\n\n'use strict';\n'use asm';\nvar foo;",
            output: "//comment\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;",
            output: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },

        /*
         * at the top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },
        {
            code: "function foo() {\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },
        {
            code: "() => {\n'use strict';\nvar foo;\n}",
            output: "() => {\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterStrictError]
        },
        {
            code: "() => {\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterStrictError]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterAsmError]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterAsmError]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterAsmError]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [expectedAfterAsmError]
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n//comment\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n//comment\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar bar;\n}",
            options: [{ before: "never", after: "always" }],
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "() => {\n//comment\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n//comment\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            options: [{ before: "never", after: "always" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                unexpectedBeforeStrictError,
                expectedAfterAsmError
            ]
        },

        /*
         * { "before": "always", "after": "never" }
         * at top of file
         * single directive
         */
        {
            code: "'use strict';\n\nvar foo;",
            output: "'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "'use strict';\n\n//comment\nvar foo;",
            output: "'use strict';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "'use strict';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },

        // multiple directives
        {
            code: "'use strict';\n'use asm';\n\nvar foo;",
            output: "'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n\n//comment\nvar foo;",
            output: "'use strict';\n'use asm';\n//comment\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "'use strict';\n'use asm';\n\n/*\nmultiline comment\n*/\nvar foo;",
            output: "'use strict';\n'use asm';\n/*\nmultiline comment\n*/\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterAsmError]
        },

        /*
         * after comment at top of file
         * single directive
         */
        {
            code: "#!/usr/bin/env node\n'use strict';\n\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "//comment\n'use strict';\n\nvar foo;",
            output: "//comment\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "#!/usr/bin/env node\n'use strict';\n'use asm';\n\nvar foo;",
            output: "#!/usr/bin/env node\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "//comment\n'use strict';\n'use asm';\n\nvar foo;",
            output: "//comment\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;",
            output: "/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },

        /*
         * at the top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "function foo() {\n\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "() => {\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "() => {\n\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterStrictError]
        },

        // multiple directives
        {
            code: "function foo() {\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "function foo() {\n\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "() => {\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterAsmError]
        },
        {
            code: "() => {\n\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [unexpectedAfterAsmError]
        },

        /*
         * after comment at top of function blocks
         * single directive
         */
        {
            code: "function foo() {\n//comment\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterStrictError
            ]
        },

        // multiple directives
        {
            code: "function foo() {\n//comment\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n//comment\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar bar;\n}",
            output: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar bar;\n}",
            options: [{ before: "always", after: "never" }],
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "() => {\n//comment\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n//comment\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },
        {
            code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n'use asm';\n\nvar foo;\n}",
            output: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n'use asm';\nvar foo;\n}",
            options: [{ before: "always", after: "never" }],
            parserOptions: { ecmaVersion: 6 },
            errors: [
                expectedBeforeStrictError,
                unexpectedAfterAsmError
            ]
        },

        // https://github.com/eslint/eslint/issues/7450
        {

            code: "'use strict'\n\n;foo();",
            output: "'use strict'\n;foo();",
            options: [{ before: "never", after: "never" }],
            errors: [unexpectedAfterStrictError]
        },
        {
            code: "'use strict'\n;foo();",
            output: "'use strict'\n\n;foo();",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        },
        {
            code: "'use strict'\n;\nfoo();",
            output: "'use strict'\n\n;\nfoo();",
            options: [{ before: "never", after: "always" }],
            errors: [expectedAfterStrictError]
        }
    ]
});
