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
        { code: "console.log(foo)", errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.error(foo)", errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.info(foo)", errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.warn(foo)", errors: [{ messageId: "unexpected", type: "MemberExpression" }] },

        //  one option
        { code: "console.log(foo)", options: [{ allow: ["error"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.error(foo)", options: [{ allow: ["warn"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.info(foo)", options: [{ allow: ["log"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.warn(foo)", options: [{ allow: ["error"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },

        // multiple options
        { code: "console.log(foo)", options: [{ allow: ["warn", "info"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.error(foo)", options: [{ allow: ["warn", "info", "log"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.info(foo)", options: [{ allow: ["warn", "error", "log"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },
        { code: "console.warn(foo)", options: [{ allow: ["info", "log"] }], errors: [{ messageId: "unexpected", type: "MemberExpression" }] },

        // In case that implicit global variable of 'console' exists
        { code: "console.log(foo)", errors: [{ messageId: "unexpected", type: "MemberExpression" }], env: { node: true } }
    ]
});
