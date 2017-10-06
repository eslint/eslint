/**
 * @fileoverview Tests for no-console rule.
 * @author Nicholas C. Zakas
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-console"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-console", rule, {
    valid: [
        "Console.info(foo)",

        // single array item
        { code: "console.info(foo)", options: [{ allow: ["info"] }] },
        { code: "console.warn(foo)", options: [{ allow: ["warn"] }] },
        { code: "console.error(foo)", options: [{ allow: ["error"] }] },
        { code: "console.log(foo)", options: [{ allow: ["log"] }] },

        // multiple array items
        { code: "console.info(foo)", options: [{ allow: ["warn", "info"] }] },
        { code: "console.warn(foo)", options: [{ allow: ["error", "warn"] }] },
        { code: "console.error(foo)", options: [{ allow: ["log", "error"] }] },
        { code: "console.log(foo)", options: [{ allow: ["info", "log", "warn"] }] },

        // https://github.com/eslint/eslint/issues/7010
        "var console = require('myconsole'); console.log(foo)"
    ],
    invalid: [

        // no options
        { code: "console.log(foo)", output: "", errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.error(foo)", output: "", errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.info(foo)", output: "", errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.warn(foo)", output: "", errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },

        //  one option
        { code: "console.log(foo)", output: "", options: [{ allow: ["error"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.error(foo)", output: "", options: [{ allow: ["warn"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.info(foo)", output: "", options: [{ allow: ["log"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.warn(foo)", output: "", options: [{ allow: ["error"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },

        // multiple options
        { code: "console.log(foo)", output: "", options: [{ allow: ["warn", "info"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.error(foo)", output: "", options: [{ allow: ["warn", "info", "log"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.info(foo)", output: "", options: [{ allow: ["warn", "error", "log"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.warn(foo)", output: "", options: [{ allow: ["info", "log"] }], errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },

        // In case that implicit global variable of 'console' exists
        { code: "console.log(foo)", output: "", errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }], env: { node: true } },

        { code: "console.log(`foo`)", output: "", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.log(`foo${bar}`)", output: "", parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },

        // should not autofix in some cases(side effect).
        { code: "console.log(foo())", output: null, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.log(foo, bar())", output: null, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "console.log(`${foo()}`)", output: null, parserOptions: { ecmaVersion: 6 }, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] },
        { code: "if (cond) console.log(foo())", output: null, errors: [{ message: "Unexpected console statement.", type: "MemberExpression" }] }
    ]
});
