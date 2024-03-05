"use strict";

const assertStrict = require("node:assert/strict");
const { parseStringLiteral, parseTemplateToken } = require("../../../../lib/rules/utils/char-source");

describe(
    "parseStringLiteral",
    () => {
        const TESTS = [
            {
                description: "works with an empty string",
                source: '""',
                expectedCodeUnits: []
            },
            {
                description: "works with surrogate pairs",
                source: '"a𝄞z"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\ud834" },
                    { start: 3, source: "\udd1e" },
                    { start: 4, source: "z" }
                ]
            },
            {
                description: "works with escape sequences for single characters",
                source: '"a\\x40\\u231Bz"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\\x40" },
                    { start: 6, source: "\\u231B" },
                    { start: 12, source: "z" }
                ]
            },
            {
                description: "works with escape sequences for code points",
                source: '"a\\u{ffff}\\u{10000}\\u{10ffff}z"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\\u{ffff}" },
                    { start: 10, source: "\\u{10000}" },
                    { start: 10, source: "\\u{10000}" },
                    { start: 19, source: "\\u{10ffff}" },
                    { start: 19, source: "\\u{10ffff}" },
                    { start: 29, source: "z" }
                ]
            },
            {
                description: "works with line continuations",
                source: '"a\\\n\\\r\n\\\u2028\\\u2029z"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 11, source: "z" }
                ]
            },
            {
                description: "works with simple escape sequences",
                source: '"\\"\\0\\b\\f\\n\\r\\t\\v"',
                expectedCodeUnits: ['\\"', "\\0", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v"]
                    .map((source, index) => ({ source, start: 1 + index * 2 }))
            },
            {
                description: "works with a <LS> character outside of a line continuation",
                source: '"a\u2028z"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\u2028" },
                    { start: 3, source: "z" }
                ]
            },
            {
                description: "works with a <PS> character outside of a line continuation",
                source: '"a\u2029z"',
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\u2029" },
                    { start: 3, source: "z" }
                ]
            },
            {
                description: "works with octal escape sequences",
                source: '"\\0123\\456"',
                expectedCodeUnits: [
                    { source: "\\012", start: 1 },
                    { source: "3", start: 5 },
                    { source: "\\45", start: 6 },
                    { source: "6", start: 9 }
                ]
            },
            {
                description: "works with an escaped 7",
                source: '"\\7"',
                expectedCodeUnits: [{ source: "\\7", start: 1 }]
            },
            {
                description: "works with an escaped 8",
                source: '"\\8"',
                expectedCodeUnits: [{ source: "\\8", start: 1 }]
            },
            {
                description: "works with an escaped 9",
                source: '"\\9"',
                expectedCodeUnits: [{ source: "\\9", start: 1 }]
            },
            {
                description: 'works with the escaped sequence "00"',
                source: '"\\00"',
                expectedCodeUnits: [{ source: "\\00", start: 1 }]
            },
            {
                description: "works with an escaped 0 followed by 8",
                source: '"\\08"',
                expectedCodeUnits: [
                    { source: "\\0", start: 1 },
                    { source: "8", start: 3 }
                ]
            },
            {
                description: "works with an escaped 0 followed by 9",
                source: '"\\09"',
                expectedCodeUnits: [
                    { source: "\\0", start: 1 },
                    { source: "9", start: 3 }
                ]
            }
        ];

        for (const { description, source, expectedCodeUnits, only } of TESTS) {
            (only ? it.only : it)(
                description,
                () => {
                    const codeUnits = parseStringLiteral(source);
                    const expectedCharCount = expectedCodeUnits.length;

                    assertStrict.equal(codeUnits.length, expectedCharCount);
                    for (let index = 0; index < expectedCharCount; ++index) {
                        const codeUnit = codeUnits[index];
                        const expectedUnit = expectedCodeUnits[index];
                        const message = `Expected values to be strictly equal at index ${index}`;

                        assertStrict.equal(codeUnit.start, expectedUnit.start, message);
                        assertStrict.equal(codeUnit.source, expectedUnit.source, message);
                    }
                }
            );
        }
    }
);

describe(
    "parseTemplateToken",
    () => {
        const TESTS =
        [
            {
                description: "works with an empty template",
                source: "``",
                expectedCodeUnits: []
            },
            {
                description: "works with surrogate pairs",
                source: "`A𝄞Z`",
                expectedCodeUnits: [
                    { start: 1, source: "A" },
                    { start: 2, source: "\ud834" },
                    { start: 3, source: "\udd1e" },
                    { start: 4, source: "Z" }
                ]
            },
            {
                description: "works with escape sequences for single characters",
                source: "`A\\x40\\u231BZ${",
                expectedCodeUnits: [
                    { start: 1, source: "A" },
                    { start: 2, source: "\\x40" },
                    { start: 6, source: "\\u231B" },
                    { start: 12, source: "Z" }
                ]
            },
            {
                description: "works with escape sequences for code points",
                source: "}A\\u{FFFF}\\u{10000}\\u{10FFFF}Z${",
                expectedCodeUnits: [
                    { start: 1, source: "A" },
                    { start: 2, source: "\\u{FFFF}" },
                    { start: 10, source: "\\u{10000}" },
                    { start: 10, source: "\\u{10000}" },
                    { start: 19, source: "\\u{10FFFF}" },
                    { start: 19, source: "\\u{10FFFF}" },
                    { start: 29, source: "Z" }
                ]
            },
            {
                description: "works with line continuations",
                source: "}A\\\n\\\r\n\\\u2028\\\u2029Z`",
                expectedCodeUnits: [
                    { start: 1, source: "A" },
                    { start: 11, source: "Z" }
                ]
            },
            {
                description: "works with simple escape sequences",
                source: "`\\0\\`\\b\\f\\n\\r\\t\\v`",
                expectedCodeUnits: ["\\0", "\\`", "\\b", "\\f", "\\n", "\\r", "\\t", "\\v"]
                    .map((source, index) => ({ source, start: 1 + index * 2 }))
            },
            {
                description: "works with a <LS> character outside of a line continuation",
                source: "`a\u2028z`",
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\u2028" },
                    { start: 3, source: "z" }
                ]
            },
            {
                description: "works with a <PS> character outside of a line continuation",
                source: "`a\u2029z`",
                expectedCodeUnits: [
                    { start: 1, source: "a" },
                    { start: 2, source: "\u2029" },
                    { start: 3, source: "z" }
                ]
            },
            {
                description: "works with unescaped <CR> <LF> sequences",
                source: "`A\r\nZ`",
                expectedCodeUnits: [
                    { start: 1, source: "A" },
                    { start: 2, source: "\r\n" },
                    { start: 4, source: "Z" }
                ]
            }
        ];

        for (const { description, source, expectedCodeUnits, only } of TESTS) {
            (only ? it.only : it)(
                description,
                () => {
                    const codeUnits = parseTemplateToken(source);
                    const expectedCharCount = expectedCodeUnits.length;

                    assertStrict.equal(codeUnits.length, expectedCharCount);
                    for (let index = 0; index < expectedCharCount; ++index) {
                        const codeUnit = codeUnits[index];
                        const expectedUnit = expectedCodeUnits[index];
                        const message = `Expected values to be strictly equal at index ${index}`;

                        assertStrict.equal(codeUnit.start, expectedUnit.start, message);
                        assertStrict.equal(codeUnit.source, expectedUnit.source, message);
                    }
                }
            );
        }
    }
);
