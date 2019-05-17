/**
 * @fileoverview Tests for no-catch-shadow rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-catch-shadow"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-catch-shadow", rule, {
    valid: [
        "var foo = 1; try { bar(); } catch(baz) { }",
        {
            code: [
                "'use strict';",
                "",
                "function broken() {",
                "  try {",
                "    throw new Error();",
                "  } catch (e) {",
                "    //",
                "  }",
                "}",
                "",
                "module.exports = broken;"
            ].join("\n"),
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "try {} catch (error) {}",
            env: { shelljs: false }
        },
        {
            code: "try {} catch {}",
            parserOptions: { ecmaVersion: 2019 }
        }
    ],
    invalid: [
        { code: "var foo = 1; try { bar(); } catch(foo) { }", errors: [{ messageId: "mutable", data: { name: "foo" }, type: "CatchClause" }] },
        { code: "function foo(){} try { bar(); } catch(foo) { }", errors: [{ messageId: "mutable", data: { name: "foo" }, type: "CatchClause" }] },
        { code: "function foo(){ try { bar(); } catch(foo) { } }", errors: [{ messageId: "mutable", data: { name: "foo" }, type: "CatchClause" }] },
        { code: "var foo = function(){ try { bar(); } catch(foo) { } };", errors: [{ messageId: "mutable", data: { name: "foo" }, type: "CatchClause" }] }
    ]
});
