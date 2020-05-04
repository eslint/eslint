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
            code: `
                (foo) =>
                  // test comment
                  bar
            `,
            output: `
                // test comment
                (foo) => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                const foo = () =>
                // comment
                []
            `,
            output: `
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
            code: `
            (foo) =>
             // comment
             // another comment
                bar`,
            output: `
            // comment
            // another comment
            (foo) => bar`,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            (foo) =>
            // comment
            (
            // another comment
            bar
            )`,
            output: `
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
            code: `
                (foo) =>
                  /* test comment */
                  bar
            `,
            output: `
                /* test comment */
                (foo) => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) =>
                  // hi
                     bar =>
                       // there
                         baz;
            `,
            output: `
                (foo) => (
                  // hi
                     bar => (
                       // there
                         baz
                     )
                 );
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
        }, {
            code: `
                (foo) =>
                  // hi
                     bar => (
                       // there
                         baz
                     )
            `,
            output: `
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
            code: `
            const foo = {
              id: 'bar',
              prop: (foo1) =>
                // comment
                'returning this string', 
            }
            `,
            output: `
            const foo = {
              id: 'bar',
              // comment
              prop: (foo1) => 'returning this string', 
            }
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            [ foo => 
              // comment
              'bar'
            ]
            `,
            output: `
            [ // comment
              foo => 'bar'
            ]
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
             "foo".split('').map((char) =>
                // comment
                char
             )
            `,
            output: `
             // comment
             "foo".split('').map((char) => char
             )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                new Promise((resolve, reject) =>
                    // comment
                    resolve()
                )
            `,
            output: `
                new Promise(// comment
                            (resolve, reject) => resolve()
                )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                () =>
                /*
                succinct
                explanation
                of code
                */
                bar
            `,
            output: `
                /*
                succinct
                explanation
                of code
                */
                () => bar
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
                stepOne =>
                    /*
                    here is
                    what is
                    happening
                    */
                    stepTwo =>
                        // then this happens
                        stepThree`,
            output: `
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
            code: `
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
            output: `
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
            code: `
               foo('', boo =>
                  // comment
                  bar
               )
            `,
            output: `
               // comment
               foo('', boo => bar
               )
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            async foo =>
                // comment
                'string'
            `,
            output: `
            // comment
            async foo => 'string'
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            async foo =>
                // comment
                // another
                bar;
            `,
            output: `
            // comment
            // another
            async foo => bar;
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            async (foo) =>
                // comment
                'string'
            `,
            output: `
            // comment
            async (foo) => 'string'
            `,
            parserOptions: { ecmaVersion: 8 },
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
              const foo = 1,
                  bar = 2,
                  baz = () => // comment
                    qux
            `,
            output: `
              const foo = 1,
                  bar = 2,
                  // comment
                  baz = () => qux
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
              const foo = () =>
                  //comment
                  qux,
                  bar = 2,
                  baz = 3
            `,
            output: `
              //comment
              const foo = () => qux,
                  bar = 2,
                  baz = 3
            `,
            errors: [UNEXPECTED_LINEBREAK]
        }, {
            code: `
            const foo = () =>
                //two
                1,
                boo = () => 
                //comment
                2,
                bop = "what"
            `,
            output: `
            //two
            const foo = () => 1,
                //comment
                boo = () => 2,
                bop = "what"
            `,
            errors: [UNEXPECTED_LINEBREAK, UNEXPECTED_LINEBREAK]
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
