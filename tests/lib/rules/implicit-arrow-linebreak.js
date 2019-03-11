/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/implicit-arrow-linebreak");
const RuleTester = require("../../../lib/testers/rule-tester");

const EXPECTED_LINEBREAK = { messageId: "expected" };
const UNEXPECTED_LINEBREAK = { messageId: "unexpected" };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings) {
    const templateValue = strings[0];
    const lines = templateValue.replace(/^\n/u, "").replace(/\n\s*$/u, "").split("\n");
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)[0].length);
    const minLineIndent = Math.min(...lineIndents);

    return lines.map(line => line.slice(minLineIndent)).join("\n");
}

ruleTester.run("implicit-arrow-linebreak", rule, {

    valid: [

        // always valid
        `(foo) => {
            bar
        }`,

        // 'beside' option
        "() => bar;",
        "() => (bar);",
        "() => bar => baz;",
        "() => ((((bar))));",
        `(foo) => (
            bar
        )`,
        "(foo) => bar();",
        `
        //comment
        foo => bar;
        `,
        `
        foo => (
            // comment
            bar => (
                // another comment
                baz
            )       
        )
        `,
        `
        foo => (
            // comment
            bar => baz
        )
        `,
        `
        /* text */
        () => bar; 
        `,
        `
        /* foo */
        const bar = () => baz;
        `,
        `
        (foo) => (
                //comment
                    bar
                )
        `,
        `
          [ // comment
            foo => 'bar'
          ]
        `,
        `
         /*
         One two three four
         Five six seven nine.
         */
         (foo) => bar
        `,
        `
        const foo = {
          id: 'bar',
          // comment
          prop: (foo1) => 'returning this string', 
        }
        `,
        `
        // comment
         "foo".split('').map((char) => char
         )
        `,
        {
            code: `
            async foo => () => bar;
            `,
            parserOptions: { ecmaVersion: 8 }
        },
        {
            code: `
            // comment
            async foo => 'string'        
            `,
            parserOptions: { ecmaVersion: 8 }
        },

        // 'below' option
        {
            code: `
                (foo) =>
                    (
                        bar
                    )
            `,
            options: ["below"]
        }, {
            code: `
                () =>
                    ((((bar))));
            `,
            options: ["below"]
        }, {
            code: `
                () =>
                    bar();
            `,
            options: ["below"]
        }, {
            code: `
                () =>
                    (bar);
            `,
            options: ["below"]
        }, {
            code: `
                () =>
                    bar =>
                        baz;
            `,
            options: ["below"]
        }
    ],

    invalid: [

        // 'beside' option
        {
            code: `
                (foo) =>
                    bar();
            `,
            output: `
                (foo) => bar();
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                () =>
                    (bar);
            `,
            output: `
                () => (bar);
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                () =>
                    bar =>
                        baz;
            `,
            output: `
                () => bar => baz;
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: `
                () =>
                    ((((bar))));
            `,
            output: `
                () => ((((bar))));
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) =>
                    (
                        bar
                    )
            `,
            output: `
                (foo) => (
                        bar
                    )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                (foo) =>
                  // test comment
                  bar
            `,
            output: unIndent`
                // test comment
                (foo) => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                const foo = () =>
                // comment
                []
            `,
            output: unIndent`
                // comment
                const foo = () => []
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) =>
                    (
                    //comment
                        bar
                    )
            `,
            output: `
                (foo) => (
                    //comment
                        bar
                    )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) =>
                    (
                        bar
                    //comment
                    )
            
            `,
            output: `
                (foo) => (
                        bar
                    //comment
                    )
            
            `,
            errors: [UNEXPECTED_LINEBREAK]

        }, {
            code: unIndent`
                (foo) =>
                 // comment
                 // another comment
                    bar`,
            output: unIndent`
                // comment
                // another comment
                (foo) => bar`,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                (foo) =>
                // comment
                (
                // another comment
                bar
                )`,
            output: unIndent`
                // comment
                (foo) => (
                // another comment
                bar
                )`,
            errors: [UNEXPECTED_LINEBREAK]
        },
        {
            code: "() => // comment \n bar",
            output: "// comment \n() => bar",
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: "(foo) => //comment \n bar",
            output: "//comment \n(foo) => bar",
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                (foo) =>
                  /* test comment */
                  bar
            `,
            output: unIndent`
                /* test comment */
                (foo) => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                (foo) =>
                  // hi
                     bar =>
                       // there
                         baz;`,
            output: unIndent`
                (foo) => (
                  // hi
                     bar => (
                       // there
                         baz
                )
                );`,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                (foo) =>
                  // hi
                     bar => (
                       // there
                         baz
                     )
            `,
            output: unIndent`
                (foo) => (
                  // hi
                     bar => (
                       // there
                         baz
                     )
                )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                const foo = {
                  id: 'bar',
                  prop: (foo1) =>
                    // comment
                    'returning this string', 
                }
            `,
            output: unIndent`
                const foo = {
                  id: 'bar',
                  // comment
                prop: (foo1) => 'returning this string', 
                }
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                [ foo => 
                  // comment
                  'bar'
                ]
            `,
            output: unIndent`
                [ // comment
                foo => 'bar'
                ]
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                "foo".split('').map((char) =>
                // comment
                char
                )
            `,
            output: unIndent`
                // comment
                "foo".split('').map((char) => char
                )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                new Promise((resolve, reject) =>
                    // comment
                    resolve()
                )
            `,
            output: unIndent`
                new Promise(// comment
                (resolve, reject) => resolve()
                )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                () =>
                /*
                succinct
                explanation
                of code
                */
                bar
            `,
            output: unIndent`
                /*
                succinct
                explanation
                of code
                */
                () => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                stepOne =>
                    /*
                    here is
                    what is
                    happening
                    */
                    stepTwo =>
                        // then this happens
                        stepThree`,
            output: unIndent`
                stepOne => (
                    /*
                    here is
                    what is
                    happening
                    */
                    stepTwo => (
                        // then this happens
                        stepThree
                )
                )`,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                () =>
                    /*
                    multi
                    line
                    */
                    bar =>
                        /*
                        many
                        lines
                        */
                        baz
            `,
            output: unIndent`
                () => (
                    /*
                    multi
                    line
                    */
                    bar => (
                        /*
                        many
                        lines
                        */
                        baz
                )
                )
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                foo('', boo =>
                  // comment
                  bar
                )
            `,
            output: unIndent`
                // comment
                foo('', boo => bar
                )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                async foo =>
                    // comment
                    'string'
            `,
            output: unIndent`
                // comment
                async foo => 'string'
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                async foo =>
                    // comment
                    // another
                    bar;
            `,
            output: unIndent`
                // comment
                // another
                async foo => bar;
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                async (foo) =>
                    // comment
                    'string'
            `,
            output: unIndent`
                // comment
                async (foo) => 'string'
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                const foo = 1,
                  bar = 2,
                  baz = () => // comment
                    qux
            `,
            output: unIndent`
                const foo = 1,
                  bar = 2,
                  // comment
                baz = () => qux
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                const foo = () =>
                  //comment
                  qux,
                  bar = 2,
                  baz = 3
            `,
            output: unIndent`
                //comment
                const foo = () => qux,
                  bar = 2,
                  baz = 3
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                const foo = () =>
                    //two
                    1,
                    boo = () => 
                    //comment
                    2,
                    bop = "what"
            `,
            output: unIndent`
                //two
                const foo = () => 1,
                    //comment
                boo = () => 2,
                    bop = "what"
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
                start()
                    .then(() =>
                        /* If I put a comment here, eslint --fix breaks badly */
                        process && typeof process.send === 'function' && process.send('ready')
                    )
                    .catch(err => {
                    /* catch seems to be needed here */
                    console.log('Error: ', err)
                    })`,
            output: unIndent`
                /* If I put a comment here, eslint --fix breaks badly */
                start()
                    .then(() => process && typeof process.send === 'function' && process.send('ready')
                    )
                    .catch(err => {
                    /* catch seems to be needed here */
                    console.log('Error: ', err)
                    })`,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
            hello(response =>
                // comment
                response, param => param)`,
            output: unIndent`
            // comment
            hello(response => response, param => param)`,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: unIndent`
            start(
                arr =>
                    // cometh
                    bod => {
                        // soon
                        yyyy
                    }
            )`,
            output: unIndent`
            start(
                arr => (
                    // cometh
                    bod => {
                        // soon
                        yyyy
                    }
            )
            )`,
            errors: [UNEXPECTED_LINEBREAK]
        },

        // 'below' option
        {
            code: "(foo) => bar();",
            output: "(foo) => \nbar();",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        }, {
            code: "(foo) => bar => baz;",
            output: "(foo) => \nbar => \nbaz;",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK, EXPECTED_LINEBREAK]
        }, {
            code: "(foo) => (bar);",
            output: "(foo) => \n(bar);",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        }, {
            code: "(foo) => (((bar)));",
            output: "(foo) => \n(((bar)));",
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) => (
                    bar
                )
            `,
            output: `
                (foo) => \n(
                    bar
                )
            `,
            options: ["below"],
            errors: [EXPECTED_LINEBREAK]
        }
    ]
});
