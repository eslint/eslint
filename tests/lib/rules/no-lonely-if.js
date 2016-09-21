/**
 * @fileoverview Tests for no-lonely-if rule.
 * @author Brandon Mills
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-lonely-if"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const errors = [{ message: "Unexpected if as the only statement in an else block.", type: "IfStatement" }];

ruleTester.run("no-lonely-if", rule, {

    // Examples of code that should not trigger the rule
    valid: [
        "if (a) {;} else if (b) {;}",
        "if (a) {;} else { if (b) {;} ; }"
    ],

    // Examples of code that should trigger the rule
    invalid: [
        {
            code: "if (a) {;} else { if (b) {;} }",
            output: "if (a) {;} else if (b) {;}",
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if (b) {\n" +
            "    bar();\n" +
            "  }\n" +
            "}",
            output:
            "if (a) {\n" +
            "  foo();\n" +
            "} else if (b) {\n" +
            "    bar();\n" +
            "  }",
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else /* comment */ {\n" +
            "  if (b) {\n" +
            "    bar();\n" +
            "  }\n" +
            "}",
            output:
            "if (a) {\n" +
            "  foo();\n" +
            "} else if (b) /* comment */ {\n" +
            "    bar();\n" +
            "  }",
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  /* otherwise, do the other thing */ if (b) {\n" +
            "    bar();\n" +
            "  }\n" +
            "}",
            output: // Not fixed, comment interferes
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  /* otherwise, do the other thing */ if (b) {\n" +
            "    bar();\n" +
            "  }\n" +
            "}",
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if /* this comment is ok */ (b) {\n" +
            "    bar();\n" +
            "  }\n" +
            "}",
            output:
            "if (a) {\n" +
            "  foo();\n" +
            "} else if /* this comment is ok */ (b) {\n" +
            "    bar();\n" +
            "  }",
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if (b) {\n" +
            "    bar();\n" +
            "  } /* this comment will prevent this test case from being autofixed. */\n" +
            "}",
            output:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if (b) {\n" +
            "    bar();\n" +
            "  } /* this comment will prevent this test case from being autofixed. */\n" +
            "}",
            errors
        },
        {
            code: "if (foo) {} else { if (bar) baz(); }",
            output: "if (foo) {} else if (bar) {baz();}",
            errors
        }
    ]
});
