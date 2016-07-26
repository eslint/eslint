/**
 * @fileoverview Warn when using template string syntax in regular strings.
 * @author Jeroen Engels
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/wrong-quotes-for-template-string"),
    RuleTester = require("../../../lib/testers/rule-tester");


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

var message = "Possible use of template string inside a regular string.";
var parserOptions = { ecmaVersion: 6 };

ruleTester.run("wrong-quotes-for-template-string", rule, {
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
            errors: [{ message }]
        },
        {
            code: "\"Hello, ${name}\"",
            parserOptions,
            errors: [{ message }]
        },
        {
            code: "'${greeting}, ${name}'",
            parserOptions,
            errors: [{ message }]
        },
        {
            code: "'Hello, ${index + 1}'",
            parserOptions,
            errors: [{ message }]
        },
        {
            code: "'Hello, ${name + \" foo\"}'",
            parserOptions,
            errors: [{ message }]
        },
        {
            code: "'Hello, ${name || \"foo\"}'",
            parserOptions,
            errors: [{ message }]
        },
        {
            code: "'Hello, ${{foo: \"bar\"}.foo}'",
            parserOptions,
            errors: [{ message }]
        }
    ]
});
