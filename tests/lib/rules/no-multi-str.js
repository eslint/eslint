/**
 * @fileoverview Tests for no-multi-str rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-multi-str"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-multi-str", rule, {
    valid: [
        "var a = 'Line 1 Line 2';",
        { code: "var a = `Line 1 \nLine 2`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var a = `Line 1 \\\nLine 2`;", parserOptions: { ecmaVersion: 6 } },
        { code: "var a = <div>\n<h1>Wat</h1>\n</div>;", parserOptions: { ecmaVersion: 6, ecmaFeatures: { jsx: true } } }
    ],
    invalid: [
        {
            code: "var x = 'Line 1 \\\n Line 2'",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "var x = 'Line 1 ' +\n' Line 2'"
                }, {
                    messageId: "stringConcatTrim",
                    output: "var x = 'Line 1 ' +\n 'Line 2'"
                }]
            }]
        },
        {
            code: "var x = 'Line 1 \\\r\n Line 2'",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "var x = 'Line 1 ' +\r\n' Line 2'"
                }, {
                    messageId: "stringConcatTrim",
                    output: "var x = 'Line 1 ' +\r\n 'Line 2'"
                }]
            }]
        },
        {
            code: "var x = 'Line 1 \\\n        Line 2'",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "var x = 'Line 1 ' +\n'        Line 2'"
                }, {
                    messageId: "stringConcatTrim",
                    output: "var x = 'Line 1 ' +\n        'Line 2'"
                }]
            }]
        },
        {
            code: "test('Line 1 \\\n Line 2');",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "test('Line 1 ' +\n' Line 2');"
                }, {
                    messageId: "stringConcatTrim",
                    output: "test('Line 1 ' +\n 'Line 2');"
                }]
            }]
        },
        {
            code: "'foo\\\rbar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "'foo' +\r'bar';"
                }, {
                    messageId: "stringConcatTrim",
                    output: "'foo' +\r'bar';"
                }]
            }]
        },
        {
            code: "'foo\\\u2028bar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "'foo' +\u2028'bar';"
                }, {
                    messageId: "stringConcatTrim",
                    output: "'foo' +\u2028'bar';"
                }]
            }]
        },
        {
            code: "'foo\\\u2029bar';",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "'foo' +\u2029'bar';"
                }, {
                    messageId: "stringConcatTrim",
                    output: "'foo' +\u2029'bar';"
                }]
            }]
        },
        {
            code: "'foo\\\nbar\\\nbuzz';",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "'foo' +\n'bar' +\n'buzz';"
                }, {
                    messageId: "stringConcatTrim",
                    output: "'foo' +\n'bar' +\n'buzz';"
                }]
            }]
        },
        {
            code: "'  foo\\\n    bar\\\n      buzz';",
            errors: [{
                messageId: "multilineString",
                type: "Literal",
                suggestions: [{
                    messageId: "stringConcat",
                    output: "'  foo' +\n'    bar' +\n'      buzz';"
                }, {
                    messageId: "stringConcatTrim",
                    output: "'  foo' +\n    'bar' +\n      'buzz';"
                }]
            }]
        }

    ]
});
