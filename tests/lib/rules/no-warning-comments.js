/**
 * @fileoverview Tests for no-warning-comments rule.
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-warning-comments"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-warning-comments", rule, {
    valid: [
        { code: "// any comment", options: [{ terms: ["fixme"] }] },
        { code: "// any comment", options: [{ terms: ["fixme", "todo"] }] },
        "// any comment",
        { code: "// any comment", options: [{ location: "anywhere" }] },
        { code: "// any comment with TODO, FIXME or XXX", options: [{ location: "start" }] },
        "// any comment with TODO, FIXME or XXX",
        { code: "/* any block comment */", options: [{ terms: ["fixme"] }] },
        { code: "/* any block comment */", options: [{ terms: ["fixme", "todo"] }] },
        "/* any block comment */",
        { code: "/* any block comment */", options: [{ location: "anywhere" }] },
        { code: "/* any block comment with TODO, FIXME or XXX */", options: [{ location: "start" }] },
        "/* any block comment with TODO, FIXME or XXX */",
        "/* any block comment with (TODO, FIXME's or XXX!) */",
        { code: "// comments containing terms as substrings like TodoMVC", options: [{ terms: ["todo"], location: "anywhere" }] },
        { code: "// special regex characters don't cause problems", options: [{ terms: ["[aeiou]"], location: "anywhere" }] },
        "/*eslint no-warning-comments: [2, { \"terms\": [\"todo\", \"fixme\", \"any other term\"], \"location\": \"anywhere\" }]*/\n\nvar x = 10;\n",
        { code: "/*eslint no-warning-comments: [2, { \"terms\": [\"todo\", \"fixme\", \"any other term\"], \"location\": \"anywhere\" }]*/\n\nvar x = 10;\n", options: [{ location: "anywhere" }] },
        { code: "foo", options: [{ terms: ["foo-bar"] }] }
    ],
    invalid: [
        {
            code: "// fixme",
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "// any fixme",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "// any fixme",
            options: [{ terms: ["fixme"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "// any FIXME",
            options: [{ terms: ["fixme"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "// any fIxMe",
            options: [{ terms: ["fixme"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "/* any fixme */",
            options: [{ terms: ["FIXME"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "FIXME" } }
            ]
        },
        {
            code: "/* any FIXME */",
            options: [{ terms: ["FIXME"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "FIXME" } }
            ]
        },
        {
            code: "/* any fIxMe */",
            options: [{ terms: ["FIXME"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "FIXME" } }
            ]
        },
        {
            code: "// any fixme or todo",
            options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } }
            ]
        },
        {
            code: "/* any fixme or todo */",
            options: [{ terms: ["fixme", "todo"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } }
            ]
        },
        {
            code: "/* any fixme or todo */",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "/* fixme and todo */",
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "/* fixme and todo */",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "/* any fixme */",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "/* fixme! */",
            options: [{ terms: ["fixme"] }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } }
            ]
        },
        {
            code: "// regex [litera|$]",
            options: [{ terms: ["[litera|$]"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "[litera|$]" } }
            ]
        },
        {
            code: "/* eslint one-var: 2 */",
            options: [{ terms: ["eslint"] }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "eslint" } }
            ]
        },
        {
            code: "/* eslint one-var: 2 */",
            options: [{ terms: ["one"], location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "one" } }
            ]
        },
        {
            code: "/* any block comment with TODO, FIXME or XXX */",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "xxx" } }
            ]
        },
        {
            code: "/* any block comment with (TODO, FIXME's or XXX!) */",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "xxx" } }
            ]
        },
        {
            code: "/** \n *any block comment \n*with (TODO, FIXME's or XXX!) **/",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "xxx" } }
            ]
        },
        {
            code: "// any comment with TODO, FIXME or XXX",
            options: [{ location: "anywhere" }],
            errors: [
                { messageId: "unexpectedComment", data: { matchedTerm: "todo" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "fixme" } },
                { messageId: "unexpectedComment", data: { matchedTerm: "xxx" } }
            ]
        }
    ]
});
