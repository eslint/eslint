/**
 * @fileoverview Warn when using template string syntax in regular strings.
 * @author Jeroen Engels
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-template-curly-in-string"),
    { RuleTester } = require("../../../lib/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const messageId = "unexpectedTemplateExpression";
const parserOptions = { ecmaVersion: 6 };

ruleTester.run("no-template-curly-in-string", rule, {
    valid: [
        { code: "`Hello, ${name}`;", parserOptions },
        { code: "templateFunction`Hello, ${name}`;", parserOptions },
        { code: "`Hello, name`;", parserOptions },
        { code: "'Hello, name';", parserOptions },
        { code: "'Hello, ' + name;", parserOptions },
        { code: "`Hello, ${index + 1}`", parserOptions },
        { code: "`Hello, ${name + \" foo\"}`", parserOptions },
        { code: "`Hello, ${name || \"foo\"}`", parserOptions },
        { code: "`Hello, ${{foo: \"bar\"}.foo}`", parserOptions },
        { code: "'$2'", parserOptions },
        { code: "'${'", parserOptions },
        { code: "'$}'", parserOptions },
        { code: "'{foo}'", parserOptions },
        { code: "'{foo: \"bar\"}'", parserOptions },
        { code: "const number = 3", parserOptions }
    ],
    invalid: [
        {
            code: "'Hello, ${name}'",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "\"Hello, ${name}\"",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "'${greeting}, ${name}'",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${index + 1}'",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${name + \" foo\"}'",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${name || \"foo\"}'",
            parserOptions,
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${{foo: \"bar\"}.foo}'",
            parserOptions,
            errors: [{ messageId }]
        }
    ]
});
