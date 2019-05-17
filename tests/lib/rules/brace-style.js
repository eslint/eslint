/**
 * @fileoverview Tests for one-true-brace rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/brace-style"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("brace-style", rule, {
    valid: [
        "function f() {\n" +
        "   if (true)\n" +
        "       return {x: 1}\n" +
        "   else {\n" +
        "       var y = 2\n" +
        "       return y\n" +
        "   }\n" +
        "}",
        "if (tag === 1) glyph.id = pbf.readVarint();\nelse if (tag === 2) glyph.bitmap = pbf.readBytes();",
        "function foo () { \nreturn; \n}",
        "function a(b,\nc,\nd) { }",
        "!function foo () { \nreturn;\n }",
        "!function a(b,\nc,\nd) { }",
        "if (foo) { \n bar(); \n}",
        "if (a) { \nb();\n } else { \nc();\n }",
        "while (foo) { \n bar();\n }",
        "for (;;) { \n bar(); \n}",
        "with (foo) { \n bar(); \n}",
        "switch (foo) { \n case \"bar\": break;\n }",
        "try { \n bar();\n } catch (e) {\n baz(); \n }",
        "do { \n bar();\n } while (true)",
        "for (foo in bar) { \n baz(); \n }",
        "if (a &&\n b &&\n c) { \n }",
        "switch(0) {\n}",
        "class Foo {\n}",
        "(class {\n})",
        "class\nFoo {\n}",
        `
            class Foo {
                bar() {

                }
            }
        `,
        { code: "if (foo) {\n}\nelse {\n}", options: ["stroustrup"] },
        { code: "if (foo)\n{\n}\nelse\n{\n}", options: ["allman"] },
        { code: "try { \n bar();\n }\ncatch (e) {\n baz(); \n }", options: ["stroustrup"] },
        { code: "try\n{\n bar();\n}\ncatch (e)\n{\n baz(); \n}", options: ["allman"] },

        // allowSingleLine: true
        { code: "function foo () { return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "function foo () { a(); b(); return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "function a(b,c,d) { }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "!function foo () { return; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "!function a(b,c,d) { }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (a) { b(); } else { c(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "while (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "for (;;) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "with (foo) {  bar(); }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "switch (foo) {  case \"bar\": break; }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "try {  bar(); } catch (e) { baz();  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "do {  bar(); } while (true)", options: ["1tbs", { allowSingleLine: true }] },
        { code: "for (foo in bar) {  baz();  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (a && b && c) {  }", options: ["1tbs", { allowSingleLine: true }] },
        { code: "switch(0) {}", options: ["1tbs", { allowSingleLine: true }] },
        { code: "if (foo) {}\nelse {}", options: ["stroustrup", { allowSingleLine: true }] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", options: ["stroustrup", { allowSingleLine: true }] },
        { code: "var foo = () => { return; }", options: ["stroustrup", { allowSingleLine: true }], parserOptions: { ecmaVersion: 6 } },
        { code: "if (foo) {}\nelse {}", options: ["allman", { allowSingleLine: true }] },
        { code: "try {  bar(); }\ncatch (e) { baz();  }", options: ["allman", { allowSingleLine: true }] },
        { code: "var foo = () => { return; }", options: ["allman", { allowSingleLine: true }], parserOptions: { ecmaVersion: 6 } },
        {
            code: "if (tag === 1) fontstack.name = pbf.readString(); \nelse if (tag === 2) fontstack.range = pbf.readString(); \nelse if (tag === 3) {\n var glyph = pbf.readMessage(readGlyph, {});\n fontstack.glyphs[glyph.id] = glyph; \n}",
            options: ["1tbs"]
        },
        {
            code: "if (tag === 1) fontstack.name = pbf.readString(); \nelse if (tag === 2) fontstack.range = pbf.readString(); \nelse if (tag === 3) {\n var glyph = pbf.readMessage(readGlyph, {});\n fontstack.glyphs[glyph.id] = glyph; \n}",
            options: ["stroustrup"]
        },
        {
            code: "switch(x) \n{ \n case 1: \nbar(); \n }\n ",
            options: ["allman"]
        },
        {
            code: "switch(x) {}",
            options: ["allman", { allowSingleLine: true }]
        },
        {
            code: "class Foo {\n}",
            options: ["stroustrup"]
        },
        {
            code: "(class {\n})",
            options: ["stroustrup"]
        },
        {
            code: "class Foo\n{\n}",
            options: ["allman"]
        },
        {
            code: "(class\n{\n})",
            options: ["allman"]
        },
        {
            code: "class\nFoo\n{\n}",
            options: ["allman"]
        },
        {
            code: "class Foo {}",
            options: ["1tbs", { allowSingleLine: true }]
        },
        {
            code: "class Foo {}",
            options: ["allman", { allowSingleLine: true }]
        },
        {
            code: "(class {})",
            options: ["1tbs", { allowSingleLine: true }]
        },
        {
            code: "(class {})",
            options: ["allman", { allowSingleLine: true }]
        },

        // https://github.com/eslint/eslint/issues/7908
        "{}",
        `
            if (foo) {

            }

            {

            }
        `,
        `
            switch (foo) {
                case bar:
                    baz();
                    {
                        qux();
                    }
            }
        `,
        `
            {
            }
        `,
        `
            {
                {
                }
            }
        `,

        // https://github.com/eslint/eslint/issues/7974
        `
          class Ball {
            throw() {}
            catch() {}
          }
        `,
        `
          ({
            and() {},
            finally() {}
          })
        `,
        `
          (class {
            or() {}
            else() {}
          })
        `,
        `
          if (foo) bar = function() {}
          else baz()
        `
    ],

    invalid: [
        {
            code: "if (f) {\nbar;\n}\nelse\nbaz;",
            output: "if (f) {\nbar;\n} else\nbaz;",
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "var foo = () => { return; }",
            output: "var foo = () => {\n return; \n}",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "function foo() { return; }",
            output: "function foo() {\n return; \n}",
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "function foo() \n { \n return; }",
            output: "function foo() { \n return; \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "!function foo() \n { \n return; }",
            output: "!function foo() { \n return; \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo) \n { \n bar(); }",
            output: "if (foo) { \n bar(); \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { \nb();\n } else \n { c(); }",
            output: "if (a) { \nb();\n } else {\n c(); \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "blockSameLine", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "while (foo) \n { \n bar(); }",
            output: "while (foo) { \n bar(); \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "for (;;) \n { \n bar(); }",
            output: "for (;;) { \n bar(); \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "with (foo) \n { \n bar(); }",
            output: "with (foo) { \n bar(); \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "switch (foo) \n { \n case \"bar\": break; }",
            output: "switch (foo) { \n case \"bar\": break; \n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "switch (foo) \n { }",
            output: "switch (foo) { }",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try \n { \n bar(); \n } catch (e) {}",
            output: "try { \n bar(); \n } catch (e) {}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) \n {}",
            output: "try { \n bar(); \n } catch (e) {}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "do \n { \n bar(); \n} while (true)",
            output: "do { \n bar(); \n} while (true)",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "for (foo in bar) \n { \n baz(); \n }",
            output: "for (foo in bar) { \n baz(); \n }",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "for (foo of bar) \n { \n baz(); \n }",
            output: "for (foo of bar) { \n baz(); \n }",
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n }\ncatch (e) {\n}",
            output: "try { \n bar(); \n } catch (e) {\n}",
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}",
            output: "try { \n bar(); \n } catch (e) {\n} finally {\n}",
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { \nb();\n } \n else { \nc();\n }",
            output: "if (a) { \nb();\n } else { \nc();\n }",
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}",
            output: "try { \n bar(); \n }\ncatch (e) {\n}\n finally {\n}",
            options: ["stroustrup"],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}",
            output: "try { \n bar(); \n }\n catch (e) {\n}\n finally {\n}",
            options: ["stroustrup"],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { \nb();\n } else { \nc();\n }",
            output: "if (a) { \nb();\n }\n else { \nc();\n }",
            options: ["stroustrup"],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo) {\nbaz();\n} else if (bar) {\nbaz();\n}\nelse {\nqux();\n}",
            output: "if (foo) {\nbaz();\n}\n else if (bar) {\nbaz();\n}\nelse {\nqux();\n}",
            options: ["stroustrup"],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo) {\npoop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}",
            output: "if (foo) {\npoop();\n} \nelse if (bar) {\nbaz();\n}\n else if (thing) {\nboom();\n}\nelse {\nqux();\n}",
            options: ["stroustrup"],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n }\n catch (e) {\n}\n finally {\n}",
            output: "try \n{ \n bar(); \n }\n catch (e) \n{\n}\n finally \n{\n}",
            options: ["allman"],
            errors: [
                { messageId: "sameLineOpen", type: "Punctuator", line: 1 },
                { messageId: "sameLineOpen", type: "Punctuator", line: 4 },
                { messageId: "sameLineOpen", type: "Punctuator", line: 6 }
            ]
        },
        {
            code: "switch(x) { case 1: \nbar(); }\n ",
            output: "switch(x) \n{\n case 1: \nbar(); \n}\n ",
            options: ["allman"],
            errors: [
                { messageId: "sameLineOpen", type: "Punctuator", line: 1 },
                { messageId: "blockSameLine", type: "Punctuator", line: 1 },
                { messageId: "singleLineClose", type: "Punctuator", line: 2 }
            ]
        },
        {
            code: "if (a) { \nb();\n } else { \nc();\n }",
            output: "if (a) \n{ \nb();\n }\n else \n{ \nc();\n }",
            options: ["allman"],
            errors: [
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineClose", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" }
            ]
        },
        {
            code: "if (foo) {\nbaz();\n} else if (bar) {\nbaz();\n}\nelse {\nqux();\n}",
            output: "if (foo) \n{\nbaz();\n}\n else if (bar) \n{\nbaz();\n}\nelse \n{\nqux();\n}",
            options: ["allman"],
            errors: [
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineClose", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" }
            ]
        },
        {
            code: "if (foo)\n{ poop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}",
            output: "if (foo)\n{\n poop();\n} \nelse if (bar) \n{\nbaz();\n}\n else if (thing) \n{\nboom();\n}\nelse \n{\nqux();\n}",
            options: ["allman"],
            errors: [
                { messageId: "blockSameLine", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineClose", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" }
            ]
        },
        {
            code: "if (foo)\n{\n  bar(); }",
            output: "if (foo)\n{\n  bar(); \n}",
            options: ["allman"],
            errors: [
                { messageId: "singleLineClose", type: "Punctuator" }
            ]
        },
        {
            code: "try\n{\n  somethingRisky();\n} catch (e)\n{\n  handleError()\n}",
            output: "try\n{\n  somethingRisky();\n}\n catch (e)\n{\n  handleError()\n}",
            options: ["allman"],
            errors: [
                { messageId: "sameLineClose", type: "Punctuator" }
            ]
        },

        // allowSingleLine: true
        {
            code: "function foo() { return; \n}",
            output: "function foo() {\n return; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }]
        },
        {
            code: "function foo() { a(); b(); return; \n}",
            output: "function foo() {\n a(); b(); return; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }]
        },
        {
            code: "function foo() { \n return; }",
            output: "function foo() { \n return; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "function foo() {\na();\nb();\nreturn; }",
            output: "function foo() {\na();\nb();\nreturn; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "!function foo() { \n return; }",
            output: "!function foo() { \n return; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { b();\n } else { c(); }",
            output: "if (a) {\n b();\n } else { c(); }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }]
        },
        {
            code: "if (a) { b(); }\nelse { c(); }",
            output: "if (a) { b(); } else { c(); }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "while (foo) { \n bar(); }",
            output: "while (foo) { \n bar(); \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "for (;;) { bar(); \n }",
            output: "for (;;) {\n bar(); \n }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }]
        },
        {
            code: "with (foo) { bar(); \n }",
            output: "with (foo) {\n bar(); \n }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }]
        },
        {
            code: "switch (foo) \n { \n case \"bar\": break; }",
            output: "switch (foo) { \n case \"bar\": break; \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "switch (foo) \n { }",
            output: "switch (foo) { }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try {  bar(); }\ncatch (e) { baz();  }",
            output: "try {  bar(); } catch (e) { baz();  }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "try \n { \n bar(); \n } catch (e) {}",
            output: "try { \n bar(); \n } catch (e) {}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) \n {}",
            output: "try { \n bar(); \n } catch (e) {}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "do \n { \n bar(); \n} while (true)",
            output: "do { \n bar(); \n} while (true)",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "for (foo in bar) \n { \n baz(); \n }",
            output: "for (foo in bar) { \n baz(); \n }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n }\ncatch (e) {\n}",
            output: "try { \n bar(); \n } catch (e) {\n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}",
            output: "try { \n bar(); \n } catch (e) {\n} finally {\n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { \nb();\n } \n else { \nc();\n }",
            output: "if (a) { \nb();\n } else { \nc();\n }",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "nextLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n }\ncatch (e) {\n} finally {\n}",
            output: "try { \n bar(); \n }\ncatch (e) {\n}\n finally {\n}",
            options: ["stroustrup", { allowSingleLine: true }],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "try { \n bar(); \n } catch (e) {\n}\n finally {\n}",
            output: "try { \n bar(); \n }\n catch (e) {\n}\n finally {\n}",
            options: ["stroustrup", { allowSingleLine: true }],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "if (a) { \nb();\n } else { \nc();\n }",
            output: "if (a) { \nb();\n }\n else { \nc();\n }",
            options: ["stroustrup", { allowSingleLine: true }],
            errors: [{ messageId: "sameLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo)\n{ poop();\n} \nelse if (bar) {\nbaz();\n} else if (thing) {\nboom();\n}\nelse {\nqux();\n}",
            output: "if (foo)\n{\n poop();\n} \nelse if (bar) \n{\nbaz();\n}\n else if (thing) \n{\nboom();\n}\nelse \n{\nqux();\n}",
            options: ["allman", { allowSingleLine: true }],
            errors: [
                { messageId: "blockSameLine", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineClose", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "sameLineOpen", type: "Punctuator" }
            ]
        },

        // Comment interferes with fix
        {
            code: "if (foo) // comment \n{\nbar();\n}",
            output: null,
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },

        // https://github.com/eslint/eslint/issues/7493
        {
            code: "if (foo) {\n bar\n.baz }",
            output: "if (foo) {\n bar\n.baz \n}",
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo)\n{\n bar\n.baz }",
            output: "if (foo)\n{\n bar\n.baz \n}",
            options: ["allman"],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo) { bar\n.baz }",
            output: "if (foo) {\n bar\n.baz \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "blockSameLine", type: "Punctuator" }, { messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "if (foo) { bar\n.baz }",
            output: "if (foo) \n{\n bar\n.baz \n}",
            options: ["allman", { allowSingleLine: true }],
            errors: [
                { messageId: "sameLineOpen", type: "Punctuator" },
                { messageId: "blockSameLine", type: "Punctuator" },
                { messageId: "singleLineClose", type: "Punctuator" }
            ]
        },
        {
            code: "switch (x) {\n case 1: foo() }",
            output: "switch (x) {\n case 1: foo() \n}",
            options: ["1tbs", { allowSingleLine: true }],
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "class Foo\n{\n}",
            output: "class Foo {\n}",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "(class\n{\n})",
            output: "(class {\n})",
            errors: [{ messageId: "nextLineOpen", type: "Punctuator" }]
        },
        {
            code: "class Foo{\n}",
            output: "class Foo\n{\n}",
            options: ["allman"],
            errors: [{ messageId: "sameLineOpen", type: "Punctuator" }]
        },
        {
            code: "(class {\n})",
            output: "(class \n{\n})",
            options: ["allman"],
            errors: [{ messageId: "sameLineOpen", type: "Punctuator" }]
        },
        {
            code: "class Foo {\nbar() {\n}}",
            output: "class Foo {\nbar() {\n}\n}",
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "(class Foo {\nbar() {\n}})",
            output: "(class Foo {\nbar() {\n}\n})",
            errors: [{ messageId: "singleLineClose", type: "Punctuator" }]
        },
        {
            code: "class\nFoo{}",
            output: "class\nFoo\n{}",
            options: ["allman"],
            errors: [{ messageId: "sameLineOpen", type: "Punctuator" }]
        },

        // https://github.com/eslint/eslint/issues/7621
        {
            code: `
                if (foo)
                {
                    bar
                }
                else {
                    baz
                }
            `,
            output: `
                if (foo) {
                    bar
                } else {
                    baz
                }
            `,
            errors: [
                { messageId: "nextLineOpen", type: "Punctuator" },
                { messageId: "nextLineClose", type: "Punctuator" }
            ]
        }
    ]
});
