/**
 * @fileoverview Tests for padded-multilines rule.
 * @author Jinxuan Zhu <https://github.com/zhujinxuan>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/padded-multilines"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const parserOptions = {
    ecmaVersion: 2018
};

const ruleTester = new RuleTester({ parserOptions });

const valid = {
    if: "function test(a){\n let b = a\n \nif (a.find(x => {\n if (x.checked) return true;\n return x.actual === x.expected})) {\n b = []\n }\n\n return b\n}",
    for: "function test(a){\n let b = 0;\n \nfor (;a > 0; a-- ) {\n b++\n }\n\n return b\n}",
    while: "function test(a){\n let b = 0;\n \nwhile (a > 0) {\n b++\n }\n\n return b\n}",
    dowhile: "function test(a){\n let b = 0;\n \ndo {\n b++\n } while (a > 0);\n \n return b\n}",
    call: "function test(a){\n let b = a;\n \nsetTimeout(() => {\n console.log(a)}, 1000)\n\n return b\n}"
};

const invalid = {
    if: "function test(a){\n let b = a\n if (a.find(x => {\n if (x.checked) return true;\n return x.actual === x.expected})) {\n b = []\n }\n return b\n}",
    for: "function test(a){\n let b = 0;\n for (;a > 0; a-- ) {\n b++\n }\n return b\n}",
    while: "function test(a){\n let b = 0;\n while (a > 0) {\n b++\n }\n return b\n}",
    dowhile: "function test(a){\n let b = 0;\n do {\n b++\n } while (a > 0); \n return b\n}",
    call: "function test(a){\n let b = a;\n setTimeout(() => {\n console.log(a)}, 1000)\n return b\n}"
};

const validAllowReturn = {
    if: "function test(a){\n let b = a\n \nif (a.find(x => {\n if (x.checked) return true;\n return x.actual === x.expected})) {\n b = []\n }\n return b\n}",
    for: "function test(a){\n let b = 0;\n \nfor (;a > 0; a-- ) {\n b++\n }\n return b\n}",
    while: "function test(a){\n let b = 0;\n \nwhile (a > 0) {\n b++\n }\n return b\n}",
    dowhile: "function test(a){\n let b = 0;\n \ndo {\n b++\n } while (a > 0); \n return b\n}"
};


ruleTester.run("padded-multilines", rule, {
    valid: [
        valid.if,
        "function test(a){\n if (a ===1) {\n b =1\n } else if (a === 2) {\n b= 2\n } \n}",
        "function test(a){\n if (\na.find(x => {\nreturn x && x.checked})\n || \n a.find(x => {\nreturn x && x.ischecked})) {\n b =1\n } else if (a === 2) {\n b= 2\n } \n}",
        valid.for,
        valid.while,
        valid.dowhile,
        valid.call,
        { code: "function test(a){\n let b = 0;\n \n//Line 1\n//Line2\nwhile (a > 0) {\n b++\n }\n return b\n}", options: ["comment", "return"] },
        { code: "function test(a){\n let b = 0;\n \n/* Line 1\nLine2 */\nwhile (a > 0) {\n b++\n }\n return b\n}", options: ["comment", "return"] }
    ],
    invalid: [
        {
            code: invalid.if,
            output: valid.if,
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 7, column: 3 }]
        },
        {
            code: invalid.for,
            output: valid.for,
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, columb: 3 }]
        },
        {
            code: invalid.while,
            output: valid.while,
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, column: 3 }]
        },
        {
            code: invalid.dowhile,
            output: valid.dowhile,
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, column: 18 }]
        },
        {
            code: invalid.call,
            output: valid.call,
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 4, column: 24 }]
        },
        {
            code: invalid.if,
            output: valid.if,
            options: ["comment"],
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 7, column: 3 }]
        },
        {
            code: invalid.for,
            output: valid.for,
            options: ["comment"],
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, columb: 3 }]
        },
        {
            code: invalid.while,
            output: valid.while,
            options: ["comment"],
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, column: 3 }]
        },
        {
            code: invalid.dowhile,
            output: valid.dowhile,
            options: ["comment"],
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 5, column: 18 }]
        },
        {
            code: invalid.call,
            output: valid.call,
            options: ["comment"],
            errors: [{ messageId: "before", line: 3, column: 2 }, { messageId: "after", line: 4, column: 24 }]
        },
        {
            code: invalid.if,
            output: validAllowReturn.if,
            options: ["return"],
            errors: [{ messageId: "before", line: 3, column: 2 }]
        },
        {
            code: invalid.for,
            output: validAllowReturn.for,
            options: ["return"],
            errors: [{ messageId: "before", line: 3, column: 2 }]
        },
        {
            code: invalid.while,
            output: validAllowReturn.while,
            options: ["return"],
            errors: [{ messageId: "before", line: 3, column: 2 }]
        },
        {
            code: invalid.dowhile,
            output: validAllowReturn.dowhile,
            options: ["return"],
            errors: [{ messageId: "before", line: 3, column: 2 }]
        },
        {
            code: "function test(a){\n let b = 0;\n//Line 1\n//Line2\nwhile (a > 0) {\n b++\n }\n return b\n}",
            output: "function test(a){\n let b = 0;\n//Line 1\n//Line2\n\nwhile (a > 0) {\n b++\n }\n return b\n}",
            options: ["comment", "return"],
            errors: [{ messageId: "before", line: 5, column: 1 }]
        },
        {
            code: "function test(a){\n let b = 0;\n/*Line 1\nLine2*/ \nwhile (a > 0) {\n b++\n }\n return b\n}",
            output: "function test(a){\n let b = 0;\n/*Line 1\nLine2*/ \n\nwhile (a > 0) {\n b++\n }\n return b\n}",
            options: ["comment", "return"],
            errors: [{ messageId: "before", line: 5, column: 1 }]
        }

    ]
});
