/**
 * @fileoverview Tests for no-warning-comments rule.
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-warning-comments", {
    valid: [
        { code: "// any comment", args: [1, { "terms": ["fixme"] } ] },
        { code: "// any comment", args: [1, { "terms": ["fixme", "todo"] } ] },
        { code: "// any comment", args: [1] },
        { code: "// any comment", args: [1, { "location": "anywhere" } ] },
        { code: "// any comment with TODO, FIXME or XXX", args: [1, { "location": "start" } ] },
        { code: "// any comment with TODO, FIXME or XXX", args: [1] },
        { code: "// any comment with TODO, FIXME or XXX", args: 1 },
        { code: "/* any block comment */", args: [1, { "terms": ["fixme"] } ] },
        { code: "/* any block comment */", args: [1, { "terms": ["fixme", "todo"] } ] },
        { code: "/* any block comment */", args: [1] },
        { code: "/* any block comment */", args: [1, { "location": "anywhere" } ] },
        { code: "/* any block comment with TODO, FIXME or XXX */", args: [1, { "location": "start" } ] },
        { code: "/* any block comment with TODO, FIXME or XXX */", args: [1] },
        { code: "/* any block comment with TODO, FIXME or XXX */", args: 1 },
        { code: "/* any block comment with (TODO, FIXME's or XXX!) */", args: 1 },
        { code: "// comments containing terms as substrings like TodoMVC", args: [1, { "terms": ["todo"], "location": "anywhere" } ] },
        { code: "// special regex characters don't cause problems", args: [1, { "terms": ["[aeiou]"], "location": "anywhere" } ] }
    ],
    invalid: [
        { code: "// fixme", args: [1], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "// any fixme", args: [1, { "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "// any fixme", args: [1, { "terms": ["fixme"], "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "// any FIXME", args: [1, { "terms": ["fixme"], "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "// any fIxMe", args: [1, { "terms": ["fixme"], "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "/* any fixme */", args: [1, { "terms": ["FIXME"], "location": "anywhere" } ], errors: [ { message: "Unexpected FIXME comment." } ] },
        { code: "/* any FIXME */", args: [1, { "terms": ["FIXME"], "location": "anywhere" } ], errors: [ { message: "Unexpected FIXME comment." } ] },
        { code: "/* any fIxMe */", args: [1, { "terms": ["FIXME"], "location": "anywhere" } ], errors: [ { message: "Unexpected FIXME comment." } ] },
        { code: "// any fixme or todo", args: [1, { "terms": ["fixme", "todo"], "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." }, { message: "Unexpected todo comment." } ] },
        { code: "/* any fixme or todo */", args: [1, { "terms": ["fixme", "todo"], "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." }, { message: "Unexpected todo comment." } ] },
        { code: "/* any fixme or todo */", args: [1, { "location": "anywhere" } ], errors: [ { message: "Unexpected todo comment." }, { message: "Unexpected fixme comment." } ] },
        { code: "/* fixme and todo */", args: [1], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "/* any fixme */", args: [1, { "location": "anywhere" } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "/* fixme! */", args: [1, { "terms": ["fixme"] } ], errors: [ { message: "Unexpected fixme comment." } ] },
        { code: "// regex [litera|$]", args: [1, { "terms": ["[litera|$]"], "location": "anywhere" } ], errors: [ { message: "Unexpected [litera|$] comment." } ] }
    ]
});
