/**
 * @fileoverview Prefers object spread property over Object.assign
 * @author Sharmila Jesupaul
 * See LICENSE file in root directory for full license.
 */

"use strict";

const rule = require("../../../lib/rules/prefer-object-spread");

const RuleTester = require("../../../lib/testers/rule-tester");

const parserOptions = {
    ecmaVersion: 2018,
    sourceType: "module"
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("prefer-object-spread", rule, {
    valid: [
        "Object.assign()",
        "let a = Object.assign(a, b)",
        "Object.assign(a, b)",
        "let a = Object.assign(b, { c: 1 })",
        "const bar = { ...foo }",
        "Object.assign(...foo)",
        "Object.assign(foo, { bar: baz })",
        "Object.assign({}, ...objects)",
        "foo({ foo: 'bar' })",
        `
        const Object = {};
        Object.assign({}, foo);
        `,
        `
        Object = {};
        Object.assign({}, foo);
        `,
        `
        const Object = {};
        Object.assign({ foo: 'bar' });
        `,
        `
        Object = {};
        Object.assign({ foo: 'bar' });
        `,
        `
        const Object = require('foo');
        Object.assign({ foo: 'bar' });
        `,
        `
        import Object from 'foo';
        Object.assign({ foo: 'bar' });
        `,
        `
        import { Something as Object } from 'foo';
        Object.assign({ foo: 'bar' });
        `,
        `
        import { Object, Array } from 'globals';
        Object.assign({ foo: 'bar' });
        `
    ],

    invalid: [
        {
            code: "Object.assign({}, foo)",
            output: "({ ...foo})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        {
            code: "Object.assign({}, { foo: 'bar' })",
            output: "({ foo: 'bar'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({}, baz, { foo: 'bar' })",
            output: "({ ...baz, foo: 'bar'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({}, { foo: 'bar', baz: 'foo' })",
            output: "({ foo: 'bar', baz: 'foo'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({ foo: 'bar' }, baz)",
            output: "({foo: 'bar', ...baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Many args
        {
            code: "Object.assign({ foo: 'bar' }, cats, dogs, trees, birds)",
            output: "({foo: 'bar', ...cats, ...dogs, ...trees, ...birds})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        {
            code:
                "Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, baz))",
            output: "({foo: 'bar', ...Object.assign({ bar: 'foo' }, baz)})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 31
                }
            ]
        },
        {
            code:
                "Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, Object.assign({}, { superNested: 'butwhy' })))",
            output: "({foo: 'bar', ...Object.assign({ bar: 'foo' }, Object.assign({}, { superNested: 'butwhy' }))})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 31
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 61
                }
            ]
        },

        // Mix spread in argument
        {
            code: "Object.assign({foo: 'bar', ...bar}, baz)",
            output: "({foo: 'bar', ...bar, ...baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Object shorthand
        {
            code: "Object.assign({}, { foo, bar, baz })",
            output: "({ foo, bar, baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Objects with computed properties
        {
            code: "Object.assign({}, { [bar]: 'foo' })",
            output: "({ [bar]: 'foo'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Objects with spread properties
        {
            code: "Object.assign({ ...bar }, { ...baz })",
            output: "({...bar, ...baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // Multiline objects
        {
            code: `Object.assign({ ...bar }, {
                // this is a bar
                foo: 'bar',
                baz: "cats"
            })`,
            output: `({...bar, // this is a bar
                foo: 'bar',
                baz: "cats"})`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        {
            code: `Object.assign({
                boo: "lol",
                // I'm a comment
                dog: "cat"
             }, {
                // this is a bar
                foo: 'bar',
                baz: "cats"
            })`,
            output: `({boo: "lol",
                // I'm a comment
                dog: "cat", // this is a bar
                foo: 'bar',
                baz: "cats"})`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        // HTML comment
        {
            code: `const test = Object.assign({ ...bar }, {
                <!-- html comment
                foo: 'bar',
                baz: "cats"
                --> weird
            })`,
            output: `const test = {...bar, <!-- html comment
                foo: 'bar',
                baz: "cats"
                --> weird
            }`,
            parserOptions: {
                sourceType: "script"
            },
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 14
                }
            ]
        },

        {
            code: `const test = Object.assign({ ...bar }, {
                foo: 'bar', // inline comment
                baz: "cats"
            })`,
            output: `const test = {...bar, foo: 'bar', // inline comment
                baz: "cats"}`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 14
                }
            ]
        },


        {
            code: `const test = Object.assign({ ...bar }, {
                /**
                 * foo
                 */
                foo: 'bar',
                baz: "cats"
            })`,
            output: `const test = {...bar, /**
                 * foo
                 */
                foo: 'bar',
                baz: "cats"}`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 14
                }
            ]
        },


        /*
         * This is a special case where Object.assign is called with a single argument
         * and that argument is an object expression. In this case we warn and display
         * a message to use an object literal instead.
         */
        {
            code: "Object.assign({})",
            output: "({})",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({ foo: bar })",
            output: "({foo: bar})",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },

        {
            code: `
                const foo = 'bar';
                Object.assign({ foo: bar })
            `,
            output: `
                const foo = 'bar';
                ({foo: bar})
            `,
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },

        {
            code: `
                foo = 'bar';
                Object.assign({ foo: bar })
            `,
            output: `
                foo = 'bar';
                ({foo: bar})
            `,
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },

        {
            code: "let a = Object.assign({})",
            output: "let a = {}",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "let a = Object.assign({}, a)",
            output: "let a = { ...a}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "let a = Object.assign({ a: 1 }, b)",
            output: "let a = {a: 1, ...b}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 9
                }
            ]
        },
        {
            code: "Object.assign(  {},  a,      b,   )",
            output: "({    ...a,      ...b,   })",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({}, a ? b : {}, b => c, a = 2)",
            output: "({ ...(a ? b : {}), ...(b => c), ...(a = 2)})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: `
                const someVar = 'foo';
                Object.assign({}, a ? b : {}, b => c, a = 2)
            `,
            output: `
                const someVar = 'foo';
                ({ ...(a ? b : {}), ...(b => c), ...(a = 2)})
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                someVar = 'foo';
                Object.assign({}, a ? b : {}, b => c, a = 2)
            `,
            output: `
                someVar = 'foo';
                ({ ...(a ? b : {}), ...(b => c), ...(a = 2)})
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },

        // Cases where you don't need parens around an object literal
        {
            code: "[1, 2, Object.assign({}, a)]",
            output: "[1, 2, { ...a}]",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "const foo = Object.assign({}, a)",
            output: "const foo = { ...a}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 13
                }
            ]
        },
        {
            code: "function foo() { return Object.assign({}, a) }",
            output: "function foo() { return { ...a} }",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 25
                }
            ]
        },
        {
            code: "foo(Object.assign({}, a));",
            output: "foo({ ...a});",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "const x = { foo: 'bar', baz: Object.assign({}, a) }",
            output: "const x = { foo: 'bar', baz: { ...a} }",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 30
                }
            ]
        },
        {
            code: `
                import Foo from 'foo';
                Object.assign({ foo: Foo });
            `,
            output: `
                import Foo from 'foo';
                ({foo: Foo});
            `,
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                import Foo from 'foo';
                Object.assign({}, Foo);
            `,
            output: `
                import Foo from 'foo';
                ({ ...Foo});
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                const Foo = require('foo');
                Object.assign({ foo: Foo });
            `,
            output: `
                const Foo = require('foo');
                ({foo: Foo});
            `,
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                import { Something as somethingelse } from 'foo';
                Object.assign({}, somethingelse);
            `,
            output: `
                import { Something as somethingelse } from 'foo';
                ({ ...somethingelse});
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                import { foo } from 'foo';
                Object.assign({ foo: Foo });
            `,
            output: `
                import { foo } from 'foo';
                ({foo: Foo});
            `,
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                const Foo = require('foo');
                Object.assign({}, Foo);
            `,
            output: `
                const Foo = require('foo');
                ({ ...Foo});
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 3,
                    column: 17
                }
            ]
        },
        {
            code: `
                const actions = Object.assign(
                    {
                        onChangeInput: this.handleChangeInput,
                    },
                    this.props.actions
                );
            `,
            output: `
                const actions = {
                    onChangeInput: this.handleChangeInput,
                    ...this.props.actions
                };
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 2,
                    column: 33
                }
            ]
        },
        {
            code: `
                const actions = Object.assign(
                    {
                        onChangeInput: this.handleChangeInput, //
                    },
                    this.props.actions
                );
            `,
            output: `
                const actions = {
                    onChangeInput: this.handleChangeInput, //
                    
                    ...this.props.actions
                };
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 2,
                    column: 33
                }
            ]
        },
        {
            code: `
                const actions = Object.assign(
                    {
                        onChangeInput: this.handleChangeInput //
                    },
                    this.props.actions
                );
            `,
            output: `
                const actions = {
                    onChangeInput: this.handleChangeInput //
                    ,
                    ...this.props.actions
                };
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 2,
                    column: 33
                }
            ]
        },
        {
            code: `
                const actions = Object.assign(
                    (
                        {
                            onChangeInput: this.handleChangeInput
                        }
                    ),
                    (
                        this.props.actions
                    )
                );
            `,
            output: `
                const actions = {
                    
                            onChangeInput: this.handleChangeInput
                        ,
                    ...(
                        this.props.actions
                    )
                };
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 2,
                    column: 33
                }
            ]
        },
        {
            code: `
                eventData = Object.assign({}, eventData, { outsideLocality: \`\${originLocality} - \${destinationLocality}\` })
            `,
            output: `
                eventData = { ...eventData, outsideLocality: \`\${originLocality} - \${destinationLocality}\`}
            `,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression",
                    line: 2,
                    column: 29
                }
            ]
        },

        // https://github.com/eslint/eslint/issues/10646
        {
            code: "Object.assign({ });",
            output: "({});",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "Object.assign({\n});",
            output: "({});",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression",
                    line: 1,
                    column: 1
                }
            ]
        }
    ]
});
