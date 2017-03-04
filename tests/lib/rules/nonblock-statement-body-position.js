/**
 * @fileoverview enforce the location of single-line statements
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/nonblock-statement-body-position");
const RuleTester = require("../../../lib/testers/rule-tester");

const EXPECTED_LINEBREAK = { message: "Expected a linebreak before this statement." };
const UNEXPECTED_LINEBREAK = { message: "Expected no linebreak before this statement." };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("nonblock-statement-body-position", rule, {

    valid: [

        // 'beside' option
        "if (foo) bar;",
        "while (foo) bar;",
        "do foo; while (bar)",
        "for (;foo;) bar;",
        "for (foo in bar) baz;",
        "for (foo of bar) baz;",
        "if (foo) bar; else baz;",
        `
            if (foo) bar(
                baz
            );
        `,
        {
            code: "if (foo) bar();",
            options: ["beside"]
        },
        {
            code: "while (foo) bar();",
            options: ["beside"]
        },
        {
            code: "do bar(); while (foo)",
            options: ["beside"]
        },
        {
            code: "for (;foo;) bar();",
            options: ["beside"]
        },

        // 'below' option
        {
            code: `
                if (foo)
                    bar();
            `,
            options: ["below"]
        },
        {
            code: `
                while (foo)
                    bar();
            `,
            options: ["below"]
        },
        {
            code: `
                do
                    bar();
                while (foo)
            `,
            options: ["below"]
        },
        {
            code: `
                for (;foo;)
                    bar();
            `,
            options: ["below"]
        },
        {
            code: `
                for (foo in bar)
                    bar();
            `,
            options: ["below"]
        },
        {
            code: `
                for (foo of bar)
                    bar();
            `,
            options: ["below"]
        },
        {
            code: `
                if (foo)
                    bar();
                else
                    baz();
            `,
            options: ["below"]
        },

        // 'any' option
        {
            code: "if (foo) bar();",
            options: ["any"]
        },
        {
            code: `
                if (foo)
                    bar();
            `,
            options: ["any"]
        },

        // 'overrides' option
        {
            code: "if (foo) bar();",
            options: ["beside", { overrides: { while: "below" } }]
        },
        {
            code: `
                while (foo)
                    bar();
            `,
            options: ["beside", { overrides: { while: "below" } }]
        },
        {
            code: `
                while (foo)
                    bar();
            `,
            options: ["beside", { overrides: { while: "any" } }]
        },
        {
            code: "while (foo) bar();",
            options: ["beside", { overrides: { while: "any" } }]
        },
        {
            code: "while (foo) bar();",
            options: ["any", { overrides: { while: "beside" } }]
        },
        {
            code: " ",
            options: ["any", { overrides: { if: "any", else: "any", for: "any", while: "any", do: "any" } }]
        },

        // ignore 'else if'
        `
            if (foo) {
            } else if (bar) {
            }
        `,
        {
            code: `
                if (foo) {
                } else if (bar) {
                }
            `,
            options: ["below"]
        },
        `
            if (foo) {
            } else
              if (bar) {
              }
        `,
        {
            code: `
                if (foo) {
                } else
                  if (bar) {
                  }
            `,
            options: ["beside"]
        }
    ],

    invalid: [

        // 'beside' option
        {
            code: `
                if (foo)
                    bar();
            `,
            output: `
                if (foo) bar();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                while (foo)
                    bar();
            `,
            output: `
                while (foo) bar();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                do
                    bar();
                while (foo)
            `,
            output: `
                do bar();
                while (foo)
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                for (;foo;)
                    bar();
            `,
            output: `
                for (;foo;) bar();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                for (foo in bar)
                    baz();
            `,
            output: `
                for (foo in bar) baz();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                for (foo of bar)
                    baz();
            `,
            output: `
                for (foo of bar) baz();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: `
                if (foo)
                    bar();
                else
                    baz();
            `,
            output: `
                if (foo) bar();
                else baz();
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        },

        // 'below' option
        {
            code: "if (foo) bar();",
            output: "if (foo) \nbar();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: "while (foo) bar();",
            output: "while (foo) \nbar();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: "do bar(); while (foo)",
            output: "do \nbar(); while (foo)",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: "for (;foo;) bar();",
            output: "for (;foo;) \nbar();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: "for (foo in bar) baz();",
            output: "for (foo in bar) \nbaz();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: "for (foo of bar) baz();",
            output: "for (foo of bar) \nbaz();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: `
                if (foo) bar();
                else baz();
            `,
            output: `
                if (foo) \nbar();
                else \nbaz();
            `,
            options: ["below"],
            errors: [EXPECTED_LINEBREAK, EXPECTED_LINEBREAK]
        },

        // overrides
        {
            code: "if (foo) bar();",
            output: "if (foo) \nbar();",
            options: ["below", { overrides: { while: "beside" } }],
            errors: [EXPECTED_LINEBREAK]
        },
        {
            code: `
                while (foo)
                    bar();
            `,
            output: `
                while (foo) bar();
            `,
            options: ["below", { overrides: { while: "beside" } }],
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: "do bar(); while (foo)",
            output: "do \nbar(); while (foo)",
            options: ["any", { overrides: { do: "below" } }],
            errors: [EXPECTED_LINEBREAK]
        }
    ]
});
