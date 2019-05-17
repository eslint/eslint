/**
 * @fileoverview enforce a particular style for multiline comments
 * @author Teddy Katz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/multiline-comment-style");
const RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("multiline-comment-style", rule, {

    valid: [
        `
            /*
             * this is
             * a comment
             */
        `,
        `
            /**
             * this is
             * a JSDoc comment
             */
        `,
        `
            /* eslint semi: [
              "error"
            ] */
        `,
        `
            // this is a single-line comment
        `,
        `
            /* foo */
        `,
        `
            // this is a comment
            foo();
            // this is another comment
        `,
        `
            /*
             * Function overview
             * ...
             */

            // Step 1: Do the first thing
            foo();
        `,
        `
            /*
             * Function overview
             * ...
             */

            /*
             * Step 1: Do the first thing.
             * The first thing is foo().
             */
            foo();
        `,
        "\t\t/**\n\t\t * this comment\n\t\t * is tab-aligned\n\t\t */",

        "/**\r\n * this comment\r\n * uses windows linebreaks\r\n */",

        "/**\u2029 * this comment\u2029 * uses paragraph separators\u2029 */",

        `
            foo(/* this is an
                inline comment */);
        `,

        `
            // The following line comment
            // contains '*/'.
        `,
        {
            code: `
                // The following line comment
                // contains '*/'.
            `,
            options: ["bare-block"]
        },
        {
            code: `
                /*
                 * this is
                 * a comment
                 */
            `,
            options: ["starred-block"]
        },
        {
            code: `
                /**
                 * this is
                 * a JSDoc comment
                 */
            `,
            options: ["starred-block"]
        },
        {
            code: `
                /* eslint semi: [
                  "error"
                ] */
            `,
            options: ["starred-block"]
        },
        {
            code: `
                // this is a single-line comment
            `,
            options: ["starred-block"]
        },
        {
            code: `
                /* foo */
            `,
            options: ["starred-block"]
        },
        {
            code: `
                // this is
                // a comment
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                /* this is
                   a comment */ foo;
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                // a comment

                // another comment
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                // a comment

                // another comment
            `,
            options: ["bare-block"]
        },
        {
            code: `
                // a comment

                // another comment
            `,
            options: ["starred-block"]
        },
        {
            code: `
                /* eslint semi: "error" */
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                /**
                 * This is
                 * a JSDoc comment
                 */
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                /**
                 * This is
                 * a JSDoc comment
                 */
            `,
            options: ["starred-block"]
        },
        {
            code: `
                /**
                 * This is
                 * a JSDoc comment
                 */
            `,
            options: ["bare-block"]
        },
        {
            code: `
                /* This is
                   a comment */
            `,
            options: ["bare-block"]
        },
        {
            code: `
                /* This is
                         a comment */
            `,
            options: ["bare-block"]
        },
        {
            code: `
                /* eslint semi: [
                    "error"
                ] */
            `,
            options: ["separate-lines"]
        },
        {
            code: `
                /* The value of 5
                 + 4 is 9, and the value of 5
                 * 4 is 20. */
            `,
            options: ["bare-block"]
        }
    ],

    invalid: [
        {
            code: `
                // these are
                // line comments
            `,
            output: `
                /*
                 * these are
                 * line comments
                 */
            `,
            errors: [{ messageId: "expectedBlock", line: 2 }]
        },
        {
            code: `
                //foo
                ///bar
            `,
            output: null,
            errors: [{ messageId: "expectedBlock", line: 2 }]
        },
        {
            code: `
                // foo
                // bar

                // baz
                // qux
            `,
            output: `
                /*
                 * foo
                 * bar
                 */

                /*
                 * baz
                 * qux
                 */
            `,
            errors: [{ messageId: "expectedBlock", line: 2 }, { messageId: "expectedBlock", line: 5 }]
        },
        {
            code: `
                /* this block
                 * is missing a newline at the start
                 */
            `,
            output: `
                /*
                 * this block
                 * is missing a newline at the start
                 */
            `,
            errors: [{ messageId: "startNewline", line: 2 }]
        },
        {
            code: `
                /** this JSDoc comment
                 * is missing a newline at the start
                 */
            `,
            output: `
                /**
                 * this JSDoc comment
                 * is missing a newline at the start
                 */
            `,
            errors: [{ messageId: "startNewline", line: 2 }]
        },
        {
            code: `
                /*
                 * this block
                 * is missing a newline at the end*/
            `,
            output: `
                /*
                 * this block
                 * is missing a newline at the end
                 */
            `,
            errors: [{ messageId: "endNewline", line: 4 }]
        },
        {
            code: `
                /*
                 * the following line
                 is missing a '*' at the start
                 */
            `,
            output: `
                /*
                 * the following line
                 * is missing a '*' at the start
                 */
            `,
            errors: [{ messageId: "missingStar", line: 4 }]
        },
        {
            code: `
                /*
                 * the following line
                      * has a '*' with the wrong offset at the start
                 */
            `,
            output: `
                /*
                 * the following line
                 * has a '*' with the wrong offset at the start
                 */
            `,
            errors: [{ messageId: "alignment", line: 4 }]
        },
        {
            code: `
                  /*
                   * the following line
                 * has a '*' with the wrong offset at the start
                   */
            `,
            output: `
                  /*
                   * the following line
                   * has a '*' with the wrong offset at the start
                   */
            `,
            errors: [{ messageId: "alignment", line: 4 }]
        },
        {
            code: `
                /*
                 * the last line of this comment
                 * is misaligned
                   */
            `,
            output: `
                /*
                 * the last line of this comment
                 * is misaligned
                 */
            `,
            errors: [{ messageId: "alignment", line: 5 }]
        },
        {
            code: `
                /*
                 * the following line
                *
                 * is blank
                 */
            `,
            output: `
                /*
                 * the following line
                 *
                 * is blank
                 */
            `,
            errors: [{ messageId: "alignment", line: 4 }]
        },
        {
            code: `
                /*
                 * the following line
                  *
                 * is blank
                 */
            `,
            output: `
                /*
                 * the following line
                 *
                 * is blank
                 */
            `,
            errors: [{ messageId: "alignment", line: 4 }]
        },
        {
            code: `
                /*
                 * the last line of this comment
                 * is misaligned
                   */ foo
            `,
            output: `
                /*
                 * the last line of this comment
                 * is misaligned
                 */ foo
            `,
            errors: [{ messageId: "alignment", line: 5 }]
        },
        {
            code: `
                /*
                 * foo
                 * bar
                 */
            `,
            output: `
                // foo
                // bar
            `,
            options: ["separate-lines"],
            errors: [{ messageId: "expectedLines", line: 2 }]
        },
        {
            code: `
                /* foo
                 *bar
                 baz
                 qux*/
            `,
            output: `
                // foo
                // bar
                // baz
                // qux
            `,
            options: ["separate-lines"],
            errors: [{ messageId: "expectedLines", line: 2 }]
        },
        {
            code: `
                // foo
                // bar
            `,
            output: `
                /* foo
                   bar */
            `,
            options: ["bare-block"],
            errors: [{ messageId: "expectedBlock", line: 2 }]
        },
        {
            code: `
                /*
                * foo
                * bar
                */
            `,
            output: `
                /* foo
                   bar */
            `,
            options: ["bare-block"],
            errors: [{ messageId: "expectedBlock", line: 2 }]
        }
    ]
});
