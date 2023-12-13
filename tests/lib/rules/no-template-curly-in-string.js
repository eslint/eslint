/**
 * @fileoverview Warn when using template string syntax in regular strings.
 * @author Jeroen Engels
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-template-curly-in-string"),
    RuleTester = require("../../../lib/rule-tester/flat-rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const messageId = "unexpectedTemplateExpression";

ruleTester.run("no-template-curly-in-string", rule, {
    valid: [
        "`Hello, ${name}`;",
        "templateFunction`Hello, ${name}`;",
        "`Hello, name`;",
        "'Hello, name';",
        "'Hello, ' + name;",
        "`Hello, ${index + 1}`",
        "`Hello, ${name + \" foo\"}`",
        "`Hello, ${name || \"foo\"}`",
        "`Hello, ${{foo: \"bar\"}.foo}`",
        "'$2'",
        "'${'",
        "'$}'",
        "'{foo}'",
        "'{foo: \"bar\"}'",
        "const number = 3"
    ],
    invalid: [
        {
            code: "'Hello, ${name}'",
            errors: [{ messageId }]
        },
        {
            code: "\"Hello, ${name}\"",
            errors: [{ messageId }]
        },
        {
            code: "'${greeting}, ${name}'",
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${index + 1}'",
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${name + \" foo\"}'",
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${name || \"foo\"}'",
            errors: [{ messageId }]
        },
        {
            code: "'Hello, ${{foo: \"bar\"}.foo}'",
            errors: [{ messageId }]
        }
    ]
});
