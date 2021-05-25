/**
 * @fileoverview Tests for dot-location.
 * @author Greg Cochard
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/dot-location"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("dot-location", rule, {
    valid: [
        "obj.\nprop",
        "obj. \nprop",
        "obj.\n prop",
        "(obj).\nprop",
        "obj\n['prop']",
        "obj['prop']",
        {
            code: "obj.\nprop",
            options: ["object"]
        },
        {
            code: "obj\n.prop",
            options: ["property"]
        },
        {
            code: "(obj)\n.prop",
            options: ["property"]
        },
        {
            code: "obj . prop",
            options: ["object"]
        },
        {
            code: "obj /* a */ . prop",
            options: ["object"]
        },
        {
            code: "obj . \nprop",
            options: ["object"]
        },
        {
            code: "obj . prop",
            options: ["property"]
        },
        {
            code: "obj . /* a */ prop",
            options: ["property"]
        },
        {
            code: "obj\n. prop",
            options: ["property"]
        },
        {
            code: "f(a\n).prop",
            options: ["object"]
        },
        {
            code: "`\n`.prop",
            options: ["object"],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "obj[prop]",
            options: ["object"]
        },
        {
            code: "obj\n[prop]",
            options: ["object"]
        },
        {
            code: "obj[\nprop]",
            options: ["object"]
        },
        {
            code: "obj\n[\nprop\n]",
            options: ["object"]
        },
        {
            code: "obj[prop]",
            options: ["property"]
        },
        {
            code: "obj\n[prop]",
            options: ["property"]
        },
        {
            code: "obj[\nprop]",
            options: ["property"]
        },
        {
            code: "obj\n[\nprop\n]",
            options: ["property"]
        },

        // https://github.com/eslint/eslint/issues/11868 (also in invalid)
        {
            code: "(obj).prop",
            options: ["object"]
        },
        {
            code: "(obj).\nprop",
            options: ["object"]
        },
        {
            code: "(obj\n).\nprop",
            options: ["object"]
        },
        {
            code: "(\nobj\n).\nprop",
            options: ["object"]
        },
        {
            code: "((obj\n)).\nprop",
            options: ["object"]
        },
        {
            code: "(f(a)\n).\nprop",
            options: ["object"]
        },
        {
            code: "((obj\n)\n).\nprop",
            options: ["object"]
        },
        {
            code: "(\na &&\nb()\n).toString()",
            options: ["object"]
        }
    ],
    invalid: [
        {
            code: "obj\n.property",
            output: "obj.\nproperty",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 2, column: 1, endLine: 2, endColumn: 2 }]
        },
        {
            code: "obj.\nproperty",
            output: "obj\n.property",
            options: ["property"],
            errors: [{ messageId: "expectedDotBeforeProperty", type: "MemberExpression", line: 1, column: 4, endLine: 1, endColumn: 5 }]
        },
        {
            code: "(obj).\nproperty",
            output: "(obj)\n.property",
            options: ["property"],
            errors: [{ messageId: "expectedDotBeforeProperty", type: "MemberExpression", line: 1, column: 6 }]
        },
        {
            code: "5\n.toExponential()",
            output: "5 .\ntoExponential()",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 2, column: 1 }]
        },
        {
            code: "-5\n.toExponential()",
            output: "-5 .\ntoExponential()",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 2, column: 1 }]
        },
        {
            code: "foo /* a */ . /* b */ \n /* c */ bar",
            output: "foo /* a */  /* b */ \n /* c */ .bar",
            options: ["property"],
            errors: [{ messageId: "expectedDotBeforeProperty", type: "MemberExpression", line: 1, column: 13 }]
        },
        {
            code: "foo /* a */ \n /* b */ . /* c */ bar",
            output: "foo. /* a */ \n /* b */  /* c */ bar",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 2, column: 10 }]
        },
        {
            code: "f(a\n)\n.prop",
            output: "f(a\n).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "`\n`\n.prop",
            output: "`\n`.\nprop",
            options: ["object"],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },

        // https://github.com/eslint/eslint/issues/11868 (also in valid)
        {
            code: "(a\n)\n.prop",
            output: "(a\n).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "(a\n)\n.\nprop",
            output: "(a\n).\n\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "(f(a)\n)\n.prop",
            output: "(f(a)\n).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "(f(a\n)\n)\n.prop",
            output: "(f(a\n)\n).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 4, column: 1 }]
        },
        {
            code: "((obj\n))\n.prop",
            output: "((obj\n)).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "((obj\n)\n)\n.prop",
            output: "((obj\n)\n).\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 4, column: 1 }]
        },
        {
            code: "(a\n) /* a */ \n.prop",
            output: "(a\n). /* a */ \nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 1 }]
        },
        {
            code: "(a\n)\n/* a */\n.prop",
            output: "(a\n).\n/* a */\nprop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 4, column: 1 }]
        },
        {
            code: "(a\n)\n/* a */.prop",
            output: "(a\n).\n/* a */prop",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 3, column: 8 }]
        },
        {
            code: "(5)\n.toExponential()",
            output: "(5).\ntoExponential()",
            options: ["object"],
            errors: [{ messageId: "expectedDotAfterObject", type: "MemberExpression", line: 2, column: 1 }]
        }
    ]
});
