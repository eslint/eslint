/**
 * @fileoverview Tests for sort-keys rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/sort-keys"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("sort-keys", rule, {
    valid: [

        // default (asc)
        {code: "var obj = {_:2, a:1, b:3} // default", options: []},
        {code: "var obj = {a:1, b:3, c:2}", options: []},
        {code: "var obj = {a:2, b:3, b_:1}", options: []},
        {code: "var obj = {C:3, b_:1, c:2}", options: []},
        {code: "var obj = {$:1, A:3, _:2, a:4}", options: []},
        {code: "var obj = {1:1, '11':2, 2:4, A:3}", options: []},
        {code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: []},

        // ignore non-simple computed properties.
        {code: "var obj = {a:1, b:3, [a + b]: -1, c:2}", options: [], parserOptions: {ecmaVersion: 6}},

        // ignore spread properties.
        {code: "var obj = {a:1, ...z, b:1}", options: [], parserOptions: {ecmaVersion: 6, ecmaFeatures: {experimentalObjectRestSpread: true}}},

        // ignore destructuring patterns.
        {code: "let {a, b} = {}", options: [], parserOptions: {ecmaVersion: 6}},

        // nested
        {code: "var obj = {a:1, b:{x:1, y:1}, c:1}", options: []},

        // asc
        {code: "var obj = {_:2, a:1, b:3} // asc", options: ["asc"]},
        {code: "var obj = {a:1, b:3, c:2}", options: ["asc"]},
        {code: "var obj = {a:2, b:3, b_:1}", options: ["asc"]},
        {code: "var obj = {C:3, b_:1, c:2}", options: ["asc"]},
        {code: "var obj = {$:1, A:3, _:2, a:4}", options: ["asc"]},
        {code: "var obj = {1:1, '11':2, 2:4, A:3}", options: ["asc"]},
        {code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: ["asc"]},

        // asc, insensitive
        {code: "var obj = {_:2, a:1, b:3} // asc, insensitive", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {a:1, b:3, c:2}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {a:2, b:3, b_:1}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {b_:1, C:3, c:2}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {b_:1, c:3, C:2}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {$:1, _:2, A:3, a:4}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {1:1, '11':2, 2:4, A:3}", options: ["asc", {caseSensitive: false}]},
        {code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: ["asc", {caseSensitive: false}]},

        // asc, natural
        {code: "var obj = {_:2, a:1, b:3} // asc, natural", options: ["asc", {natural: true}]},
        {code: "var obj = {a:1, b:3, c:2}", options: ["asc", {natural: true}]},
        {code: "var obj = {a:2, b:3, b_:1}", options: ["asc", {natural: true}]},
        {code: "var obj = {C:3, b_:1, c:2}", options: ["asc", {natural: true}]},
        {code: "var obj = {$:1, _:2, A:3, a:4}", options: ["asc", {natural: true}]},
        {code: "var obj = {1:1, 2:4, '11':2, A:3}", options: ["asc", {natural: true}]},
        {code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: ["asc", {natural: true}]},

        // asc, natural, insensitive
        {code: "var obj = {_:2, a:1, b:3} // asc, natural, insensitive", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {a:1, b:3, c:2}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {a:2, b:3, b_:1}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {b_:1, C:3, c:2}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {b_:1, c:3, C:2}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {$:1, _:2, A:3, a:4}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {1:1, 2:4, '11':2, A:3}", options: ["asc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {'#':1, 'Z':2, À:3, è:4}", options: ["asc", {natural: true, caseSensitive: false}]},

        // desc
        {code: "var obj = {b:3, a:1, _:2} // desc", options: ["desc"]},
        {code: "var obj = {c:2, b:3, a:1}", options: ["desc"]},
        {code: "var obj = {b_:1, b:3, a:2}", options: ["desc"]},
        {code: "var obj = {c:2, b_:1, C:3}", options: ["desc"]},
        {code: "var obj = {a:4, _:2, A:3, $:1}", options: ["desc"]},
        {code: "var obj = {A:3, 2:4, '11':2, 1:1}", options: ["desc"]},
        {code: "var obj = {è:4, À:3, 'Z':2, '#':1}", options: ["desc"]},

        // desc, insensitive
        {code: "var obj = {b:3, a:1, _:2} // desc, insensitive", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {c:2, b:3, a:1}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {b_:1, b:3, a:2}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {c:2, C:3, b_:1}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {C:2, c:3, b_:1}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {a:4, A:3, _:2, $:1}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {A:3, 2:4, '11':2, 1:1}", options: ["desc", {caseSensitive: false}]},
        {code: "var obj = {è:4, À:3, 'Z':2, '#':1}", options: ["desc", {caseSensitive: false}]},

        // desc, natural
        {code: "var obj = {b:3, a:1, _:2} // desc, natural", options: ["desc", {natural: true}]},
        {code: "var obj = {c:2, b:3, a:1}", options: ["desc", {natural: true}]},
        {code: "var obj = {b_:1, b:3, a:2}", options: ["desc", {natural: true}]},
        {code: "var obj = {c:2, b_:1, C:3}", options: ["desc", {natural: true}]},
        {code: "var obj = {a:4, A:3, _:2, $:1}", options: ["desc", {natural: true}]},
        {code: "var obj = {A:3, '11':2, 2:4, 1:1}", options: ["desc", {natural: true}]},
        {code: "var obj = {è:4, À:3, 'Z':2, '#':1}", options: ["desc", {natural: true}]},

        // desc, natural, insensitive
        {code: "var obj = {b:3, a:1, _:2} // desc, natural, insensitive", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {c:2, b:3, a:1}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {b_:1, b:3, a:2}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {c:2, C:3, b_:1}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {C:2, c:3, b_:1}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {a:4, A:3, _:2, $:1}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {A:3, '11':2, 2:4, 1:1}", options: ["desc", {natural: true, caseSensitive: false}]},
        {code: "var obj = {è:4, À:3, 'Z':2, '#':1}", options: ["desc", {natural: true, caseSensitive: false}]},
    ],
    invalid: [

        // default (asc)
        {
            code: "var obj = {a:1, _:2, b:3} // default",
            errors: ["Expected object keys to be in ascending order. '_' should be before 'a'."]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            errors: ["Expected object keys to be in ascending order. 'b' should be before 'c'."]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            errors: ["Expected object keys to be in ascending order. 'a' should be before 'b_'."]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            errors: ["Expected object keys to be in ascending order. 'C' should be before 'c'."]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            errors: ["Expected object keys to be in ascending order. 'A' should be before '_'."]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            errors: ["Expected object keys to be in ascending order. '11' should be before 'A'."]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            errors: ["Expected object keys to be in ascending order. 'Z' should be before 'À'."]
        },

        // not ignore simple computed properties.
        {
            code: "var obj = {a:1, b:3, [a]: -1, c:2}",
            parserOptions: {ecmaVersion: 6},
            errors: ["Expected object keys to be in ascending order. 'a' should be before 'b'."]
        },

        // ignore spred properties.
        {
            code: "var obj = {b:1, ...z, a:1}",
            parserOptions: {
                ecmaVersion: 6,
                ecmaFeatures: {experimentalObjectRestSpread: true}
            },
            errors: [
                "Expected object keys to be in ascending order. 'a' should be before 'b'.",
            ]
        },

        // nested
        {
            code: "var obj = {a:1, c:{y:1, x:1}, b:1}",
            errors: [
                "Expected object keys to be in ascending order. 'x' should be before 'y'.",
                "Expected object keys to be in ascending order. 'b' should be before 'c'.",
            ]
        },

        // asc
        {
            code: "var obj = {a:1, _:2, b:3} // asc",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. '_' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. 'b' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. 'a' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. 'C' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. 'A' should be before '_'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. '11' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["asc"],
            errors: [
                "Expected object keys to be in ascending order. 'Z' should be before 'À'.",
            ]
        },

        // asc, insensitive
        {
            code: "var obj = {a:1, _:2, b:3} // asc, insensitive",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. '_' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. 'b' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. 'a' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, A:3, _:2, a:4}",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. '_' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. '11' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["asc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive ascending order. 'Z' should be before 'À'.",
            ]
        },

        // asc, natural
        {
            code: "var obj = {a:1, _:2, b:3} // asc, natural",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. '_' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. 'b' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. 'a' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. 'C' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {$:1, A:3, _:2, a:4}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. '_' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. '11' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["asc", {natural: true}],
            errors: [
                "Expected object keys to be in natural ascending order. 'Z' should be before 'À'.",
            ]
        },

        // asc, natural, insensitive
        {
            code: "var obj = {a:1, _:2, b:3} // asc, natural, insensitive",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. '_' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. 'b' should be before 'c'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. 'a' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, A:3, _:2, a:4}",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. '_' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {1:1, '11':2, 2:4, A:3}",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. '2' should be before '11'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["asc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive ascending order. 'Z' should be before 'À'.",
            ]
        },

        // desc
        {
            code: "var obj = {a:1, _:2, b:3} // desc",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. 'b' should be before '_'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. 'c' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. 'b' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. 'c' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. '_' should be before '$'.",
                "Expected object keys to be in descending order. 'a' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. '2' should be before '1'.",
                "Expected object keys to be in descending order. 'A' should be before '2'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["desc"],
            errors: [
                "Expected object keys to be in descending order. 'À' should be before '#'.",
                "Expected object keys to be in descending order. 'è' should be before 'Z'.",
            ]
        },

        // desc, insensitive
        {
            code: "var obj = {a:1, _:2, b:3} // desc, insensitive",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. 'b' should be before '_'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. 'c' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. 'b' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. 'c' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. '_' should be before '$'.",
                "Expected object keys to be in insensitive descending order. 'A' should be before '_'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. '2' should be before '1'.",
                "Expected object keys to be in insensitive descending order. 'A' should be before '2'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["desc", {caseSensitive: false}],
            errors: [
                "Expected object keys to be in insensitive descending order. 'À' should be before '#'.",
                "Expected object keys to be in insensitive descending order. 'è' should be before 'Z'.",
            ]
        },

        // desc, natural
        {
            code: "var obj = {a:1, _:2, b:3} // desc, natural",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. 'b' should be before '_'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. 'c' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. 'b' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. 'c' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. '_' should be before '$'.",
                "Expected object keys to be in natural descending order. 'A' should be before '_'.",
                "Expected object keys to be in natural descending order. 'a' should be before 'A'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, A:3, '11':2}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. '2' should be before '1'.",
                "Expected object keys to be in natural descending order. 'A' should be before '2'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["desc", {natural: true}],
            errors: [
                "Expected object keys to be in natural descending order. 'À' should be before '#'.",
                "Expected object keys to be in natural descending order. 'è' should be before 'Z'.",
            ]
        },

        // desc, natural, insensitive
        {
            code: "var obj = {a:1, _:2, b:3} // desc, natural, insensitive",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. 'b' should be before '_'.",
            ]
        },
        {
            code: "var obj = {a:1, c:2, b:3}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. 'c' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, a:2, b:3}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. 'b' should be before 'a'.",
            ]
        },
        {
            code: "var obj = {b_:1, c:2, C:3}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. 'c' should be before 'b_'.",
            ]
        },
        {
            code: "var obj = {$:1, _:2, A:3, a:4}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. '_' should be before '$'.",
                "Expected object keys to be in natural insensitive descending order. 'A' should be before '_'.",
            ]
        },
        {
            code: "var obj = {1:1, 2:4, '11':2, A:3}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. '2' should be before '1'.",
                "Expected object keys to be in natural insensitive descending order. '11' should be before '2'.",
                "Expected object keys to be in natural insensitive descending order. 'A' should be before '11'.",
            ]
        },
        {
            code: "var obj = {'#':1, À:3, 'Z':2, è:4}",
            options: ["desc", {natural: true, caseSensitive: false}],
            errors: [
                "Expected object keys to be in natural insensitive descending order. 'À' should be before '#'.",
                "Expected object keys to be in natural insensitive descending order. 'è' should be before 'Z'.",
            ]
        },
    ]
});
