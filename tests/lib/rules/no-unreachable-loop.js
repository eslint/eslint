/**
 * @fileoverview Tests for the no-unreachable-loop rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unreachable-loop");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

const loopTemplates = {
    WhileStatement: [
        "while (a) <body>",
        "while (a && b) <body>"
    ],
    DoWhileStatement: [
        "do <body> while (a)",
        "do <body> while (a && b)"
    ],
    ForStatement: [
        "for (a; b; c) <body>",
        "for (var i = 0; i < a.length; i++) <body>",
        "for (; b; c) <body>",
        "for (; b < foo; c++) <body>",
        "for (a; ; c) <body>",
        "for (a = 0; ; c++) <body>",
        "for (a; b;) <body>",
        "for (a = 0; b < foo; ) <body>",
        "for (; ; c) <body>",
        "for (; ; c++) <body>",
        "for (; b;) <body>",
        "for (; b < foo; ) <body>",
        "for (a; ;) <body>",
        "for (a = 0; ;) <body>",
        "for (;;) <body>"
    ],
    ForInStatement: [
        "for (a in b) <body>",
        "for (a in f(b)) <body>",
        "for (var a in b) <body>",
        "for (let a in f(b)) <body>"
    ],
    ForOfStatement: [
        "for (a of b) <body>",
        "for (a of f(b)) <body>",
        "for ({ a, b } of c) <body>",
        "for (var a of f(b)) <body>",
        "async function foo() { for await (const a of b) <body> }"
    ]
};

const validLoopBodies = [
    ";",
    "{}",
    "{ bar(); }",
    "continue;",
    "{ continue; }",
    "{ if (foo) break; }",
    "{ if (foo) { return; } bar(); }",
    "{ if (foo) { bar(); } else { break; } }",
    "{ if (foo) { continue; } return; }",
    "{ switch (foo) { case 1: return; } }",
    "{ switch (foo) { case 1: break; default: return; } }",
    "{ switch (foo) { case 1: continue; default: return; } throw err; }",
    "{ try { return bar(); } catch (e) {} }",

    // unreachable break
    "{ continue; break; }",

    // functions in loops
    "() => a;",
    "{ () => a }",
    "(() => a)();",
    "{ (() => a)() }",

    // loops in loops
    "while (a);",
    "do ; while (a)",
    "for (a; b; c);",
    "for (; b;);",
    "for (; ; c) if (foo) break;",
    "for (;;) if (foo) break;",
    "while (true) if (foo) break;",
    "while (foo) if (bar) return;",
    "for (a in b);",
    "for (a of b);"
];

const invalidLoopBodies = [
    "break;",
    "{ break; }",
    "return;",
    "{ return; }",
    "throw err;",
    "{ throw err; }",
    "{ foo(); break; }",
    "{ break; foo(); }",
    "if (foo) break; else return;",
    "{ if (foo) { return; } else { break; } bar(); }",
    "{ if (foo) { return; } throw err; }",
    "{ switch (foo) { default: throw err; } }",
    "{ switch (foo) { case 1: throw err; default: return; } }",
    "{ switch (foo) { case 1: something(); default: return; } }",
    "{ try { return bar(); } catch (e) { break; } }",

    // unreachable continue
    "{ break; continue; }",

    // functions in loops
    "{ () => a; break; }",
    "{ (() => a)(); break; }",

    // loops in loops
    "{ while (a); break; }",
    "{ do ; while (a) break; }",
    "{ for (a; b; c); break; }",
    "{ for (; b;); break; }",
    "{ for (; ; c) if (foo) break; break; }",
    "{ for(;;) if (foo) break; break; }",
    "{ for (a in b); break; }",
    "{ for (a of b); break; }",

    /**
     * Additional cases where code path analysis detects unreachable code: after loops that don't have a test condition or have a
     * constant truthy test condition, and at the same time don't have any exit statements in the body. These are special cases
     * where this rule reports error not because the outer loop's body exits in all paths, but because it has an infinite loop
     * inside, thus it (the outer loop) cannot have more than one iteration.
     */
    "for (;;);",
    "{ for (var i = 0; ; i< 10) { foo(); } }",
    "while (true);"
];

/**
 * Creates source code from the given loop template and loop body.
 * @param {string} template Loop template.
 * @param {string} body Loop body.
 * @returns {string} Source code.
 */
function getSourceCode(template, body) {
    const loop = template.replace("<body>", body);

    return body.includes("return") && !template.includes("function") ? `function someFunc() { ${loop} }` : loop;
}

/**
 * Generates basic valid tests from `loopTemplates` and `validLoopBodies`
 * @returns {IterableIterator<string>} The list of source code strings.
 */
function *getBasicValidTests() {
    for (const templates of Object.values(loopTemplates)) {
        for (const template of templates) {
            yield* validLoopBodies.map(body => getSourceCode(template, body));
        }
    }
}

/**
 * Generates basic invalid tests from `loopTemplates` and `invalidLoopBodies`
 * @returns {IterableIterator<Object>} The list of objects for the invalid[] array.
 */
function *getBasicInvalidTests() {
    for (const [type, templates] of Object.entries(loopTemplates)) {
        for (const template of templates) {
            yield* invalidLoopBodies.map(
                body => ({
                    code: getSourceCode(template, body),
                    errors: [{ type, messageId: "invalid" }]
                })
            );
        }
    }
}

ruleTester.run("no-unreachable-loop", rule, {
    valid: [

        ...getBasicValidTests(),

        // out of scope for the code path analysis and consequently out of scope for this rule
        "while (false) { foo(); }",
        "while (bar) { foo(); if (true) { break; } }",
        "do foo(); while (false)",
        "for (x = 1; x < 10; i++) { if (x > 0) { foo(); throw err; } }",
        "for (x of []);",
        "for (x of [1]);",

        // doesn't report unreachable loop statements, regardless of whether they would be valid or not in a reachable position
        "function foo() { return; while (a); }",
        "function foo() { return; while (a) break; }",
        "while(true); while(true);",
        "while(true); while(true) break;",

        // "ignore"
        {
            code: "while (a) break;",
            options: [{ ignore: ["WhileStatement"] }]
        },
        {
            code: "do break; while (a)",
            options: [{ ignore: ["DoWhileStatement"] }]
        },
        {
            code: "for (a; b; c) break;",
            options: [{ ignore: ["ForStatement"] }]
        },
        {
            code: "for (a in b) break;",
            options: [{ ignore: ["ForInStatement"] }]
        },
        {
            code: "for (a of b) break;",
            options: [{ ignore: ["ForOfStatement"] }]
        },
        {
            code: "for (var key in obj) { hasEnumerableProperties = true; break; } for (const a of b) break;",
            options: [{ ignore: ["ForInStatement", "ForOfStatement"] }]
        }
    ],

    invalid: [

        ...getBasicInvalidTests(),

        // invalid loop nested in a valid loop (valid in valid, and valid in invalid are covered by basic tests)
        {
            code: "while (foo) { for (a of b) { if (baz) { break; } else { throw err; } } }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "lbl: for (var i = 0; i < 10; i++) { while (foo) break lbl; } /* outer is valid because inner can have 0 iterations */",
            errors: [
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                }
            ]
        },

        // invalid loop nested in another invalid loop
        {
            code: "for (a in b) { while (foo) { if(baz) { break; } else { break; } } break; }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForInStatement"
                },
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                }
            ]
        },

        // loop and nested loop both invalid because of the same exit statement
        {
            code: "function foo() { for (var i = 0; i < 10; i++) { do { return; } while(i) } }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForStatement"
                },
                {
                    messageId: "invalid",
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "lbl: while(foo) { do { break lbl; } while(baz) }",
            errors: [
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                },
                {
                    messageId: "invalid",
                    type: "DoWhileStatement"
                }
            ]
        },

        // inner loop has continue, but to an outer loop
        {
            code: "lbl: for (a in b) { while(foo) { continue lbl; } }",
            errors: [
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                }
            ]
        },

        // edge cases - inner loop has only one exit path, but at the same time it exits the outer loop in the first iteration
        {
            code: "for (a of b) { for(;;) { if (foo) { throw err; } } }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "function foo () { for (a in b) { while (true) { if (bar) { return; } } } }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForInStatement"
                }
            ]
        },

        // edge cases where parts of the loops belong to the same code path segment, tests for false negatives
        {
            code: "do for (var i = 1; i < 10; i++) break; while(foo)",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForStatement"
                }
            ]
        },
        {
            code: "do { for (var i = 1; i < 10; i++) continue; break; } while(foo)",
            errors: [
                {
                    messageId: "invalid",
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "for (;;) { for (var i = 1; i < 10; i ++) break; if (foo) break; continue; }",
            errors: [
                {
                    messageId: "invalid",
                    type: "ForStatement",
                    column: 12
                }
            ]
        },

        // "ignore"
        {
            code: "while (a) break; do break; while (b); for (;;) break; for (c in d) break; for (e of f) break;",
            options: [{ ignore: [] }],
            errors: [
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                },
                {
                    messageId: "invalid",
                    type: "DoWhileStatement"
                },
                {
                    messageId: "invalid",
                    type: "ForStatement"
                },
                {
                    messageId: "invalid",
                    type: "ForInStatement"
                },
                {
                    messageId: "invalid",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "while (a) break;",
            options: [{ ignore: ["DoWhileStatement"] }],
            errors: [
                {
                    messageId: "invalid",
                    type: "WhileStatement"
                }
            ]
        },
        {
            code: "do break; while (a)",
            options: [{ ignore: ["WhileStatement"] }],
            errors: [
                {
                    messageId: "invalid",
                    type: "DoWhileStatement"
                }
            ]
        },
        {
            code: "for (a in b) break; for (c of d) break;",
            options: [{ ignore: ["ForStatement"] }],
            errors: [
                {
                    messageId: "invalid",
                    type: "ForInStatement"
                },
                {
                    messageId: "invalid",
                    type: "ForOfStatement"
                }
            ]
        },
        {
            code: "for (a in b) break; for (;;) break; for (c of d) break;",
            options: [{ ignore: ["ForInStatement", "ForOfStatement"] }],
            errors: [
                {
                    messageId: "invalid",
                    type: "ForStatement"
                }
            ]
        }
    ]
});
