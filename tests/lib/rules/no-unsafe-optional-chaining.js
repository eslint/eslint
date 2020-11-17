/**
 * @fileoverview Tests for no-unsafe-optional-chaining rule.
 * @author Yeon JuAn
 */

"use strict";

const rule = require("../../../lib/rules/no-unsafe-optional-chaining");

const { RuleTester } = require("../../../lib/rule-tester");

const parserOptions = {
    ecmaVersion: 2021,
    sourceType: "module"
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run("no-unsafe-optional-chaining", rule, {
    valid: [
        "obj?.foo();",
        "obj?.foo?.();",
        "(obj?.foo ?? bar)();",
        "(obj?.foo)?.()",
        "(obj.foo)?.();",
        "obj?.foo.bar;",
        "obj?.foo?.bar;",
        "(obj?.foo)?.bar;",
        "(obj?.foo ?? bar).baz;",
        "(obj?.foo ?? val)`template`",
        "new (obj?.foo ?? val)()",
        "obj?.foo?.()();",
        "const {foo} = obj?.baz || {};",
        "bar(...obj?.foo ?? []);",

        "var bar = {...foo?.bar};",

        // The default value option disallowArithmeticOperators is false
        "obj?.foo - bar;",
        "obj?.foo + bar;",
        "obj?.foo * bar;",
        "obj?.foo / bar;",
        "obj?.foo % bar;",
        "obj?.foo ** bar;",

        {
            code: "(obj?.foo || baz) + bar;",
            options: [{
                disallowArithmeticOperators: true
            }]
        },
        {
            code: "(obj?.foo ?? baz) + bar;",
            options: [{
                disallowArithmeticOperators: true
            }]
        },
        {
            code: "bar += obj?.foo ?? val",
            options: [{
                disallowArithmeticOperators: true
            }]
        }
    ],

    invalid: [
        {
            code: "(obj?.foo)();",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "(obj?.foo?.())();",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "(obj?.foo).bar",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "(obj?.foo)`template`",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "new (obj?.foo)();",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 6
                }
            ]
        },
        {
            code: "new (obj?.foo?.())()",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 6
                }
            ]
        },
        {
            code: "[...obj?.foo];",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 5
                }
            ]
        },
        {
            code: "bar(...obj?.foo);",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "new Bar(...obj?.foo);",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 12
                }
            ]
        },
        {
            code: "const {foo} = obj?.bar;",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "const {foo} = obj?.bar();",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "const [foo] = obj?.bar;",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "const [foo] = obj?.bar?.();",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 15
                }
            ]
        },
        {
            code: "class A extends obj?.foo {}",
            errors: [
                {
                    messageId: "unsafeOptionalChain",
                    type: "ChainExpression",
                    line: 1,
                    column: 17
                }
            ]
        },
        {
            code: "obj?.foo + bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "obj?.foo - bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "obj?.foo * bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "obj?.foo / bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "obj?.foo % bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "obj?.foo ** bar;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
            code: "+obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "-obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 2
                }
            ]
        },
        {
            code: "bar += obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "bar -= obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "bar %= obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 8
                }
            ]
        },
        {
            code: "bar **= obj?.foo;",
            options: [{
                disallowArithmeticOperators: true
            }],
            errors: [
                {
                    messageId: "unsafeArithmetic",
                    type: "ChainExpression",
                    line: 1,
                    column: 9
                }
            ]
        }
    ]
});
