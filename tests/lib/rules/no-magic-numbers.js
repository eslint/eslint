/**
 * @fileoverview Tests for no-magic-numbers rule.
 * @author Vincent Lemeunier
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-magic-numbers"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-magic-numbers", rule, {
    valid: [
        "var x = parseInt(y, 10);",
        "var x = parseInt(y, -10);",
        "var x = Number.parseInt(y, 10);",
        {
            code: "const foo = 42;",
            env: { es6: true }
        },
        {
            code: "var foo = 42;",
            options: [{
                enforceConst: false
            }],
            env: { es6: true }
        },
        "var foo = -42;",
        {
            code: "var foo = 0 + 1 - 2 + -2;",
            options: [{
                ignore: [0, 1, 2, -2]
            }]
        },
        {
            code: "var foo = 0 + 1 + 2 + 3 + 4;",
            options: [{
                ignore: [0, 1, 2, 3, 4]
            }]
        },
        "var foo = { bar:10 }",
        {
            code: "setTimeout(function() {return 1;}, 0);",
            options: [{
                ignore: [0, 1]
            }]
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[0]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[-0]", // Allowed. -0 is not the same as 0 but it will be coerced to "0", so foo[-0] refers to the element at index 0.
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[1]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[100]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[200.00]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[3e4]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[1.23e2]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[230e-1]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[0b110]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "foo[0o71]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2015 }
        },
        {
            code: "foo[0xABC]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[0123]",
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[5.0000000000000001]", // loses precision and evaluates to 5
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[4294967294]", // max array index
            options: [{
                ignoreArrayIndexes: true
            }]
        },
        {
            code: "foo[0n]", // Allowed. 0n will be coerced to "0", so foo[0n] refers to the element at index 0.
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo[-0n]", // Allowed. -0n evaluates to 0n which will be coerced to "0", so foo[-0n] refers to the element at index 0.
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo[1n]", // Allowed. 1n will be coerced to "1", so foo[1n] refers to the element at index 1.
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo[100n]", // Allowed. 100n will be coerced to "100", so foo[100n] refers to the element at index 100.
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo[0xABn]", // Allowed. 0xABn is evaluated to 171n and will be coerced to "171", so foo[0xABn] refers to the element at index 171.
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo[4294967294n]", // max array index
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var a = <input maxLength={10} />;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        {
            code: "var a = <div objectProp={{ test: 1}}></div>;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        {
            code: "f(100n)",
            options: [{ ignore: ["100n"] }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "f(-100n)",
            options: [{ ignore: ["-100n"] }],
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "const { param = 123 } = sourceObject;",
            options: [{ ignoreDefaultValues: true }],
            env: { es6: true }
        },
        {
            code: "const func = (param = 123) => {}",
            options: [{ ignoreDefaultValues: true }],
            env: { es6: true }
        },
        {
            code: "const func = ({ param = 123 }) => {}",
            options: [{ ignoreDefaultValues: true }],
            env: { es6: true }
        },
        {
            code: "const [one = 1, two = 2] = []",
            options: [{ ignoreDefaultValues: true }],
            env: { es6: true }
        },
        {
            code: "var one, two; [one = 1, two = 2] = []",
            options: [{ ignoreDefaultValues: true }],
            env: { es6: true }
        },

        // Optional chaining
        {
            code: "var x = parseInt?.(y, 10);",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var x = Number?.parseInt(y, 10);",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "var x = (Number?.parseInt)(y, 10);",
            parserOptions: { ecmaVersion: 2020 }
        },
        {
            code: "foo?.[777]",
            options: [{ ignoreArrayIndexes: true }],
            parserOptions: { ecmaVersion: 2020 }
        }
    ],
    invalid: [
        {
            code: "var foo = 42",
            options: [{
                enforceConst: true
            }],
            env: { es6: true },
            errors: [{ messageId: "useConst" }]
        },
        {
            code: "var foo = 0 + 1;",
            errors: [
                { messageId: "noMagic", data: { raw: "0" } },
                { messageId: "noMagic", data: { raw: "1" } }
            ]
        },
        {
            code: "var foo = 42n",
            options: [{
                enforceConst: true
            }],
            parserOptions: {
                ecmaVersion: 2020
            },
            errors: [{ messageId: "useConst" }]
        },
        {
            code: "var foo = 0n + 1n;",
            parserOptions: {
                ecmaVersion: 2020
            },
            errors: [
                { messageId: "noMagic", data: { raw: "0n" } },
                { messageId: "noMagic", data: { raw: "1n" } }
            ]
        },
        {
            code: "a = a + 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "a += 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "var foo = 0 + 1 + -2 + 2;",
            errors: [
                { messageId: "noMagic", data: { raw: "0" } },
                { messageId: "noMagic", data: { raw: "1" } },
                { messageId: "noMagic", data: { raw: "-2" } },
                { messageId: "noMagic", data: { raw: "2" } }
            ]
        },
        {
            code: "var foo = 0 + 1 + 2;",
            options: [{
                ignore: [0, 1]
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "2" } }
            ]
        },
        {
            code: "var foo = { bar:10 }",
            options: [{
                detectObjects: true
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "10" } }
            ]
        }, {
            code: "console.log(0x1A + 0x02); console.log(071);",
            errors: [
                { messageId: "noMagic", data: { raw: "0x1A" } },
                { messageId: "noMagic", data: { raw: "0x02" } },
                { messageId: "noMagic", data: { raw: "071" } }
            ]
        }, {
            code: "var stats = {avg: 42};",
            options: [{
                detectObjects: true
            }],
            errors: [
                { messageId: "noMagic", data: { raw: "42" } }
            ]
        }, {
            code: "var colors = {}; colors.RED = 2; colors.YELLOW = 3; colors.BLUE = 4 + 5;",
            errors: [
                { messageId: "noMagic", data: { raw: "4" } },
                { messageId: "noMagic", data: { raw: "5" } }
            ]
        },
        {
            code: "function getSecondsInMinute() {return 60;}",
            errors: [
                { messageId: "noMagic", data: { raw: "60" } }
            ]
        },
        {
            code: "function getNegativeSecondsInMinute() {return -60;}",
            errors: [
                { messageId: "noMagic", data: { raw: "-60" } }
            ]
        },
        {
            code: "var Promise = require('bluebird');\n" +
                "var MINUTE = 60;\n" +
                "var HOUR = 3600;\n" +
                "const DAY = 86400;\n" +
                "var configObject = {\n" +
                  "key: 90,\n" +
                  "another: 10 * 10,\n" +
                  "10: 'an \"integer\" key'\n" +
                "};\n" +
                "function getSecondsInDay() {\n" +
                 " return 24 * HOUR;\n" +
                "}\n" +
                "function getMillisecondsInDay() {\n" +
                  "return (getSecondsInDay() *\n" +
                    "(1000)\n" +
                  ");\n" +
                "}\n" +
                "function callSetTimeoutZero(func) {\n" +
                  "setTimeout(func, 0);\n" +
                "}\n" +
                "function invokeInTen(func) {\n" +
                  "setTimeout(func, 10);\n" +
                "}\n",
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "10" }, line: 7 },
                { messageId: "noMagic", data: { raw: "10" }, line: 7 },
                { messageId: "noMagic", data: { raw: "24" }, line: 11 },
                { messageId: "noMagic", data: { raw: "1000" }, line: 15 },
                { messageId: "noMagic", data: { raw: "0" }, line: 19 },
                { messageId: "noMagic", data: { raw: "10" }, line: 22 }
            ]
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            errors: [{
                messageId: "noMagic", data: { raw: "3" }, line: 1
            }]
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            options: [{}],
            errors: [{
                messageId: "noMagic", data: { raw: "3" }, line: 1
            }]
        },
        {
            code: "var data = ['foo', 'bar', 'baz']; var third = data[3];",
            options: [{
                ignoreArrayIndexes: false
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "3" }, line: 1
            }]
        },
        {
            code: "foo[-100]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-100" }, line: 1
            }]
        },
        {
            code: "foo[-1.5]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-1.5" }, line: 1
            }]
        },
        {
            code: "foo[-1]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-1" }, line: 1
            }]
        },
        {
            code: "foo[-0.1]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-0.1" }, line: 1
            }]
        },
        {
            code: "foo[-0b110]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "noMagic", data: { raw: "-0b110" }, line: 1
            }]
        },
        {
            code: "foo[-0o71]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2015 },
            errors: [{
                messageId: "noMagic", data: { raw: "-0o71" }, line: 1
            }]
        },
        {
            code: "foo[-0x12]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-0x12" }, line: 1
            }]
        },
        {
            code: "foo[-012]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-012" }, line: 1
            }]
        },
        {
            code: "foo[0.1]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "0.1" }, line: 1
            }]
        },
        {
            code: "foo[0.12e1]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "0.12e1" }, line: 1
            }]
        },
        {
            code: "foo[1.5]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "1.5" }, line: 1
            }]
        },
        {
            code: "foo[1.678e2]", // 167.8
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "1.678e2" }, line: 1
            }]
        },
        {
            code: "foo[56e-1]", // 5.6
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "56e-1" }, line: 1
            }]
        },
        {
            code: "foo[5.000000000000001]", // doesn't lose precision
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "5.000000000000001" }, line: 1
            }]
        },
        {
            code: "foo[100.9]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "100.9" }, line: 1
            }]
        },
        {
            code: "foo[4294967295]", // first above the max index
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "4294967295" }, line: 1
            }]
        },
        {
            code: "foo[1e300]", // Above the max, and also coerces to "1e+300"
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "1e300" }, line: 1
            }]
        },
        {
            code: "foo[1e310]", // refers to property "Infinity"
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "1e310" }, line: 1
            }]
        },
        {
            code: "foo[-1e310]", // refers to property "-Infinity"
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-1e310" }, line: 1
            }]
        },
        {
            code: "foo[-1n]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "-1n" }, line: 1
            }]
        },
        {
            code: "foo[-100n]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "-100n" }, line: 1
            }]
        },
        {
            code: "foo[-0x12n]",
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "-0x12n" }, line: 1
            }]
        },
        {
            code: "foo[4294967295n]", // first above the max index
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "4294967295n" }, line: 1
            }]
        },
        {
            code: "foo[+0]", // Consistent with the default behavior, which doesn't allow: var foo = +0
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "0" }, line: 1
            }]
        },
        {
            code: "foo[+1]", // Consistent with the default behavior, which doesn't allow: var foo = +1
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "1" }, line: 1
            }]
        },
        {
            code: "foo[-(-1)]", // Consistent with the default behavior, which doesn't allow: var foo = -(-1)
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "-1" }, line: 1
            }]
        },
        {
            code: "foo[+0n]", // Consistent with the default behavior, which doesn't allow: var foo = +0n
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "0n" }, line: 1
            }]
        },
        {
            code: "foo[+1n]", // Consistent with the default behavior, which doesn't allow: var foo = +1n
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "1n" }, line: 1
            }]
        },
        {
            code: "foo[- -1n]", // Consistent with the default behavior, which doesn't allow: var foo = - -1n
            options: [{
                ignoreArrayIndexes: true
            }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [{
                messageId: "noMagic", data: { raw: "-1n" }, line: 1
            }]
        },
        {
            code: "100 .toString()",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "100" }, line: 1
            }]
        },
        {
            code: "200[100]",
            options: [{
                ignoreArrayIndexes: true
            }],
            errors: [{
                messageId: "noMagic", data: { raw: "200" }, line: 1
            }]
        },
        {
            code: "var a = <div arrayProp={[1,2,3]}></div>;",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "2" }, line: 1 },
                { messageId: "noMagic", data: { raw: "3" }, line: 1 }
            ]
        },
        {
            code: "var min, max, mean; min = 1; max = 10; mean = 4;",
            options: [{}],
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "10" }, line: 1 },
                { messageId: "noMagic", data: { raw: "4" }, line: 1 }
            ]
        },
        {
            code: "f(100n)",
            options: [{ ignore: [100] }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "noMagic", data: { raw: "100n" }, line: 1 }
            ]
        },
        {
            code: "f(-100n)",
            options: [{ ignore: ["100n"] }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "noMagic", data: { raw: "-100n" }, line: 1 }
            ]
        },
        {
            code: "f(100n)",
            options: [{ ignore: ["-100n"] }],
            parserOptions: { ecmaVersion: 2020 },
            errors: [
                { messageId: "noMagic", data: { raw: "100n" }, line: 1 }
            ]
        },
        {
            code: "f(100)",
            options: [{ ignore: ["100n"] }],
            errors: [
                { messageId: "noMagic", data: { raw: "100" }, line: 1 }
            ]
        },
        {
            code: "const func = (param = 123) => {}",
            options: [{ ignoreDefaultValues: false }],
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "123" }, line: 1 }
            ]
        },
        {
            code: "const { param = 123 } = sourceObject;",
            options: [{}],
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "123" }, line: 1 }
            ]
        },
        {
            code: "const { param = 123 } = sourceObject;",
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "123" }, line: 1 }
            ]
        },
        {
            code: "const { param = 123 } = sourceObject;",
            options: [{ ignoreDefaultValues: false }],
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "123" }, line: 1 }
            ]
        },
        {
            code: "const [one = 1, two = 2] = []",
            options: [{ ignoreDefaultValues: false }],
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "2" }, line: 1 }
            ]
        },
        {
            code: "var one, two; [one = 1, two = 2] = []",
            options: [{ ignoreDefaultValues: false }],
            env: { es6: true },
            errors: [
                { messageId: "noMagic", data: { raw: "1" }, line: 1 },
                { messageId: "noMagic", data: { raw: "2" }, line: 1 }
            ]
        }
    ]
});
