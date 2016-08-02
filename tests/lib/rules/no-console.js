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
        { code: "console.info(foo)", options: [ { allow: ["info"] } ] },
        { code: "console.warn(foo)", options: [ { allow: ["warn"] } ] },
        { code: "console.error(foo)", options: [ { allow: ["error"] } ] },
        { code: "console.log(foo)", options: [ { allow: ["log"] } ] },

        // multiple array items
        { code: "console.info(foo)", options: [ { allow: ["warn", "info"] } ] },
        { code: "console.warn(foo)", options: [ { allow: ["error", "warn"] } ] },
        { code: "console.error(foo)", options: [ { allow: ["log", "error"] } ] },
        { code: "console.log(foo)", options: [ { allow: ["info", "log", "warn"] } ] }
    ],
    invalid: [

        // no options
        { code: "console.log(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.warn(foo)", errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },

        //  one option
        { code: "console.log(foo)", options: [ { allow: ["error"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", options: [ { allow: ["warn"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", options: [ { allow: ["log"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.warn(foo)", options: [ { allow: ["error"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },

        // multiple options
        { code: "console.log(foo)", options: [ { allow: ["warn", "info"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.error(foo)", options: [ { allow: ["warn", "info", "log"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.info(foo)", options: [ { allow: ["warn", "error", "log"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] },
        { code: "console.warn(foo)", options: [ { allow: ["info", "log"] } ], errors: [{ message: "Unexpected console statement.", type: "MemberExpression"}] }
    ]
});
