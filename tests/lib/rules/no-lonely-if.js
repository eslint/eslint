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
            "} else /* comment */ if (b) {\n" +
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
            output: null,
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
            output: null,
            errors
        },
        {
            code: "if (foo) {} else { if (bar) baz(); }",
            output: "if (foo) {} else if (bar) baz();",
            errors
        },
        {

            // Not fixed; removing the braces would cause a SyntaxError.
            code: "if (foo) {} else { if (bar) baz() } qux();",
            output: null,
            errors
        },
        {

            // This is fixed because there is a semicolon after baz().
            code: "if (foo) {} else { if (bar) baz(); } qux();",
            output: "if (foo) {} else if (bar) baz(); qux();",
            errors
        },
        {

            // Not fixed; removing the braces would change the semantics due to ASI.
            code:
            "if (foo) {\n" +
            "} else {\n" +
            "  if (bar) baz()\n" +
            "}\n" +
            "[1, 2, 3].forEach(foo);",
            output: null,
            errors
        },
        {

            // Not fixed; removing the braces would change the semantics due to ASI.
            code:
            "if (foo) {\n" +
            "} else {\n" +
            "  if (bar) baz++\n" +
            "}\n" +
            "foo;",
            output: null,
            errors
        },
        {

            // This is fixed because there is a semicolon after baz++
            code:
            "if (foo) {\n" +
            "} else {\n" +
            "  if (bar) baz++;\n" +
            "}\n" +
            "foo;",
            output:
            "if (foo) {\n" +
            "} else if (bar) baz++;\n" +
            "foo;",
            errors
        },
        {

            // Not fixed; bar() would be interpreted as a template literal tag
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if (b) bar()\n" +
            "}\n" +
            "`template literal`;",
            output: null,
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code:
            "if (a) {\n" +
            "  foo();\n" +
            "} else {\n" +
            "  if (b) {\n" +
            "    bar();\n" +
            "  } else if (c) {\n" +
            "    baz();\n" +
            "  } else {\n" +
            "    qux();\n" +
            "  }\n" +
            "}",
            output:
            "if (a) {\n" +
            "  foo();\n" +
            "} else if (b) {\n" +
            "    bar();\n" +
            "  } else if (c) {\n" +
            "    baz();\n" +
            "  } else {\n" +
            "    qux();\n" +
            "  }",
            errors
        }
    ]
});
