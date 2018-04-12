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
    ecmaFeatures: {
        experimentalObjectRestSpread: true
    }
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("prefer-object-spread", rule, {
    valid: [
        "Object.assign()",
        "let a = Object.assign(a, b)",
        "Object.assign(a, b)",
        "let a = Object.assign(b, { c: 1 })",
        "let a = Object.assign({}, ...b)",
        "const bar = { ...foo }",
        "Object.assign(...foo)",
        "Object.assign(foo, { bar: baz })"
    ],

    invalid: [
        {
            code: "Object.assign({}, foo)",
            output: "({...foo})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, { foo: 'bar' })",
            output: "({foo: 'bar'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, baz, { foo: 'bar' })",
            output: "({...baz, foo: 'bar'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, { foo: 'bar', baz: 'foo' })",
            output: "({foo: 'bar', baz: 'foo'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({ foo: 'bar' }, baz)",
            output: "({foo: 'bar', ...baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
                    type: "CallExpression"
                }
            ]
        },

        // TODO: Handle nested Object.assign calls
        {
            code:
                "Object.assign({ foo: 'bar' }, Object.assign({ bar: 'foo' }, baz))",
            output: "({foo: 'bar', ...Object.assign({ bar: 'foo' }, baz)})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
                    type: "CallExpression"
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                },
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
                    type: "CallExpression"
                }
            ]
        },

        // Object shorthand
        {
            code: "Object.assign({}, { foo, bar, baz })",
            output: "({foo, bar, baz})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },

        // Objects with computed properties
        {
            code: "Object.assign({}, { [bar]: 'foo' })",
            output: "({[bar]: 'foo'})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
                    type: "CallExpression"
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
            output: `({...bar, 
                // this is a bar
                foo: 'bar',
                baz: "cats"
})`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
            output: `({
                boo: "lol",
                // I'm a comment
                dog: "cat", 

                // this is a bar
                foo: 'bar',
                baz: "cats"
})`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
            output: `const test = {...bar, 
                <!-- html comment
                foo: 'bar',
                baz: "cats"
                --> weird
}`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },

        {
            code: `const test = Object.assign({ ...bar }, {
                foo: 'bar', // inline comment
                baz: "cats"
            })`,
            output: `const test = {...bar, 
                foo: 'bar', // inline comment
                baz: "cats"
}`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
            output: `const test = {...bar, 
                /**
                 * foo
                 */
                foo: 'bar',
                baz: "cats"
}`,
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
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
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({ foo: bar })",
            output: "({ foo: bar })",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression"
                }
            ]
        },

        {
            code: "let a = Object.assign({})",
            output: "let a = {}",
            errors: [
                {
                    messageId: "useLiteralMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "let a = Object.assign({}, a)",
            output: "let a = {...a}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "let a = Object.assign({ a: 1 }, b)",
            output: "let a = {a: 1, ...b}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign(  {},  a,      b,   )",
            output: "({...a, ...b})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "Object.assign({}, a ? b : {}, b => c, a = 2)",
            output: "({...(a ? b : {}), ...(b => c), ...(a = 2)})",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },

        // Cases where you don't need parens around an object literal
        {
            code: "[1, 2, Object.assign({}, a)]",
            output: "[1, 2, {...a}]",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "const foo = Object.assign({}, a)",
            output: "const foo = {...a}",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "function foo() { return Object.assign({}, a) }",
            output: "function foo() { return {...a} }",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "foo(Object.assign({}, a));",
            output: "foo({...a});",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "const x = { foo: 'bar', baz: Object.assign({}, a) }",
            output: "const x = { foo: 'bar', baz: {...a} }",
            errors: [
                {
                    messageId: "useSpreadMessage",
                    type: "CallExpression"
                }
            ]
        }
    ]
});
