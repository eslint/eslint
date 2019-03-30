/**
 * @fileoverview Tests for no-warning-comments rule.
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-warning-comments"),
    RuleTester = require("../../../lib/testers/rule-tester");

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
        { code: "// fixme", errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "// any fixme", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "// any fixme", options: [{ terms: ["fixme"], location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "// any FIXME", options: [{ terms: ["fixme"], location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "// any fIxMe", options: [{ terms: ["fixme"], location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "/* any fixme */", options: [{ terms: ["FIXME"], location: "anywhere" }], errors: [{ message: "Unexpected 'FIXME' comment." }] },
        { code: "/* any FIXME */", options: [{ terms: ["FIXME"], location: "anywhere" }], errors: [{ message: "Unexpected 'FIXME' comment." }] },
        { code: "/* any fIxMe */", options: [{ terms: ["FIXME"], location: "anywhere" }], errors: [{ message: "Unexpected 'FIXME' comment." }] },
        { code: "// any fixme or todo", options: [{ terms: ["fixme", "todo"], location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'todo' comment." }] },
        { code: "/* any fixme or todo */", options: [{ terms: ["fixme", "todo"], location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'todo' comment." }] },
        { code: "/* any fixme or todo */", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }] },
        { code: "/* fixme and todo */", errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "/* fixme and todo */", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }] },
        { code: "/* any fixme */", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "/* fixme! */", options: [{ terms: ["fixme"] }], errors: [{ message: "Unexpected 'fixme' comment." }] },
        { code: "// regex [litera|$]", options: [{ terms: ["[litera|$]"], location: "anywhere" }], errors: [{ message: "Unexpected '[litera|$]' comment." }] },
        { code: "/* eslint one-var: 2 */", options: [{ terms: ["eslint"] }], errors: [{ message: "Unexpected 'eslint' comment." }] },
        { code: "/* eslint one-var: 2 */", options: [{ terms: ["one"], location: "anywhere" }], errors: [{ message: "Unexpected 'one' comment." }] },
        { code: "/* any block comment with TODO, FIXME or XXX */", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'xxx' comment." }] },
        { code: "/* any block comment with (TODO, FIXME's or XXX!) */", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'xxx' comment." }] },
        { code: "/** \n *any block comment \n*with (TODO, FIXME's or XXX!) **/", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'xxx' comment." }] },
        { code: "// any comment with TODO, FIXME or XXX", options: [{ location: "anywhere" }], errors: [{ message: "Unexpected 'todo' comment." }, { message: "Unexpected 'fixme' comment." }, { message: "Unexpected 'xxx' comment." }] }
    ]
});
