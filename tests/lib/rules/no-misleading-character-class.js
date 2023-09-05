/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-misleading-character-class"),
    { RuleTester } = require("../../../lib/rule-tester"),
    FlatRuleTester = require("../../../lib/rule-tester/flat-rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015 }
});

/*
 * /[👍]/ // ERROR: a surrogate pair in a character class without u flag.
 * /[❇️]/u // ERROR: variation selectors in a character class.
 * /[👨‍👩‍👦]/u // ERROR: ZWJ in a character class.
 * /[🇯🇵]/u // ERROR: a U+1F1E6-1F1FF pair in a character class.
 * /[👶🏻]/u // ERROR: an emoji which is made with an emoji and skin tone selector, in a character class.
 */

ruleTester.run("no-misleading-character-class", rule, {
    valid: [
        "var r = /[👍]/u",
        "var r = /[\\uD83D\\uDC4D]/u",
        "var r = /[\\u{1F44D}]/u",
        "var r = /❇️/",
        "var r = /Á/",
        "var r = /[❇]/",
        "var r = /👶🏻/",
        "var r = /[👶]/u",
        "var r = /🇯🇵/",
        "var r = /[JP]/",
        "var r = /👨‍👩‍👦/",

        // Ignore solo lead/tail surrogate.
        "var r = /[\\uD83D]/",
        "var r = /[\\uDC4D]/",
        "var r = /[\\uD83D]/u",
        "var r = /[\\uDC4D]/u",

        // Ignore solo combining char.
        "var r = /[\\u0301]/",
        "var r = /[\\uFE0F]/",
        "var r = /[\\u0301]/u",
        "var r = /[\\uFE0F]/u",

        // Ignore solo emoji modifier.
        "var r = /[\\u{1F3FB}]/u",
        "var r = /[\u{1F3FB}]/u",

        // Ignore solo regional indicator symbol.
        "var r = /[🇯]/u",
        "var r = /[🇵]/u",

        // Ignore solo ZWJ.
        "var r = /[\\u200D]/",
        "var r = /[\\u200D]/u",

        // don't report and don't crash on invalid regex
        "new RegExp('[Á] [ ');",
        "var r = new RegExp('[Á] [ ');",
        "var r = RegExp('{ [Á]', 'u');",
        { code: "var r = new globalThis.RegExp('[Á] [ ');", env: { es2020: true } },
        { code: "var r = globalThis.RegExp('{ [Á]', 'u');", env: { es2020: true } },

        // ES2024
        { code: "var r = /[👍]/v", parserOptions: { ecmaVersion: 2024 } },
        { code: String.raw`var r = /^[\q{👶🏻}]$/v`, parserOptions: { ecmaVersion: 2024 } },
        { code: String.raw`var r = /[🇯\q{abc}🇵]/v`, parserOptions: { ecmaVersion: 2024 } },
        { code: "var r = /[🇯[A]🇵]/v", parserOptions: { ecmaVersion: 2024 } },
        { code: "var r = /[🇯[A--B]🇵]/v", parserOptions: { ecmaVersion: 2024 } }
    ],
    invalid: [

        // RegExp Literals.
        {
            code: "var r = /[👍]/",
            errors: [{
                column: 11,
                endColumn: 12,
                line: 1,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👍]/u" }]
            }]
        },
        {
            code: "var r = /[\\uD83D\\uDC4D]/",
            errors: [{
                column: 17,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[\\uD83D\\uDC4D]/u" }]
            }]
        },
        {
            code: "var r = /[👍]/",
            parserOptions: { ecmaVersion: 3 },
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // ecmaVersion doesn't support the 'u' flag
            }]
        },
        {
            code: "var r = /[👍]/",
            parserOptions: { ecmaVersion: 5 },
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // ecmaVersion doesn't support the 'u' flag
            }]
        },
        {
            code: "var r = /[👍]\\a/",
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // pattern would be invalid with the 'u' flag
            }]
        },
        {
            code: "var r = /(?<=[👍])/",
            parserOptions: { ecmaVersion: 9 },
            errors: [{
                column: 15,
                endColumn: 16,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /(?<=[👍])/u" }]
            }]
        },
        {
            code: "var r = /(?<=[👍])/",
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                column: 15,
                endColumn: 16,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /(?<=[👍])/u" }]
            }]
        },
        {
            code: "var r = /[Á]/",
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[Á]/u",
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u0041\\u0301]/",
            errors: [{
                column: 17,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u0041\\u0301]/u",
            errors: [{
                column: 17,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u{41}\\u{301}]/u",
            errors: [{
                column: 17,
                endColumn: 24,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[❇️]/",
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[❇️]/u",
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u2747\\uFE0F]/",
            errors: [{
                column: 17,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u2747\\uFE0F]/u",
            errors: [{
                column: 17,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u{2747}\\u{FE0F}]/u",
            errors: [{
                column: 19,
                endColumn: 27,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: "var r = /[👶🏻]/",
            errors: [
                {
                    column: 11,
                    endColumn: 12,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👶🏻]/u" }]
                },
                {
                    column: 13,
                    endColumn: 14,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👶🏻]/u" }]
                }
            ]
        },
        {
            code: "var r = /[👶🏻]/u",
            errors: [{
                column: 12,
                endColumn: 14,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\uD83D\\uDC76\\uD83C\\uDFFB]/u",
            errors: [{
                column: 23,
                endColumn: 35,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u{1F476}\\u{1F3FB}]/u",
            errors: [{
                column: 20,
                endColumn: 29,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: "var r = /[🇯🇵]/",
            errors: [
                {
                    column: 11,
                    endColumn: 12,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[🇯🇵]/u" }]
                },
                {
                    column: 13,
                    endColumn: 14,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[🇯🇵]/u" }]
                }
            ]
        },
        {
            code: "var r = /[🇯🇵]/i",
            errors: [
                {
                    column: 11,
                    endColumn: 12,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[🇯🇵]/iu" }]
                },
                {
                    column: 13,
                    endColumn: 14,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[🇯🇵]/iu" }]
                }
            ]
        },
        {
            code: "var r = /[🇯🇵]/u",
            errors: [{
                column: 12,
                endColumn: 14,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\uD83C\\uDDEF\\uD83C\\uDDF5]/u",
            errors: [{
                column: 23,
                endColumn: 35,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: "var r = /[\\u{1F1EF}\\u{1F1F5}]/u",
            errors: [{
                column: 20,
                endColumn: 29,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: "var r = /[👨‍👩‍👦]/",
            errors: [
                {
                    column: 11,
                    endColumn: 12,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👨‍👩‍👦]/u" }]
                },
                {
                    column: 12,
                    endColumn: 13,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 14,
                    endColumn: 15,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👨‍👩‍👦]/u" }]
                },
                {
                    column: 15,
                    endColumn: 16,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 17,
                    endColumn: 18,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👨‍👩‍👦]/u" }]
                }
            ]
        },
        {
            code: "var r = /[👨‍👩‍👦]/u",
            errors: [
                {
                    column: 12,
                    endColumn: 13,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 15,
                    endColumn: 16,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },
        {
            code: "var r = /[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]/u",
            errors: [
                {
                    column: 23,
                    endColumn: 29,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 41,
                    endColumn: 47,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },
        {
            code: "var r = /[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]/u",
            errors: [
                {
                    column: 20,
                    endColumn: 28,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 37,
                    endColumn: 45,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },

        // RegExp constructors.
        {
            code: String.raw`var r = RegExp("[👍]", "")`,
            errors: [{
                column: 18,
                endColumn: 19,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = RegExp("[👍]", "u")` }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👍]", "")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👍]", "u")` }]
            }]
        },
        {
            code: "var r = new RegExp('[👍]', ``)",
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = new RegExp('[👍]', `u`)" }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👍]", flags)`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null
            }]
        },
        {
            code: String.raw`const flags = ""; var r = new RegExp("[👍]", flags)`,
            errors: [{
                column: 40,
                endColumn: 41,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = RegExp("[\\uD83D\\uDC4D]", "")`,
            errors: [{
                column: 25,
                endColumn: 32,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = RegExp("[\\uD83D\\uDC4D]", "u")` }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC4D]", "")`,
            errors: [{
                column: 29,
                endColumn: 36,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[\\uD83D\\uDC4D]", "u")` }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👍]", "")`,
            parserOptions: { ecmaVersion: 3 },
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // ecmaVersion doesn't support the 'u' flag
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👍]", "")`,
            parserOptions: { ecmaVersion: 5 },
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // ecmaVersion doesn't support the 'u' flag
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👍]\\a", "")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // pattern would be invalid with the 'u' flag
            }]
        },
        {
            code: String.raw`var r = new RegExp("/(?<=[👍])", "")`,
            parserOptions: { ecmaVersion: 9 },
            errors: [{
                column: 27,
                endColumn: 28,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("/(?<=[👍])", "u")` }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("/(?<=[👍])", "")`,
            parserOptions: { ecmaVersion: 2018 },
            errors: [{
                column: 27,
                endColumn: 28,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("/(?<=[👍])", "u")` }]
            }]
        },
        {
            code: String.raw`var r = new RegExp("[Á]", "")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[Á]", "u")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "")`,
            errors: [{
                column: 29,
                endColumn: 36,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "u")`,
            errors: [{
                column: 29,
                endColumn: 36,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{41}\\u{301}]", "u")`,
            errors: [{
                column: 29,
                endColumn: 37,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[❇️]", "")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[❇️]", "u")`,
            errors: [{
                column: 22,
                endColumn: 23,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "")`,
            errors: [{
                column: 29,
                endColumn: 36,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "u")`,
            errors: [{
                column: 29,
                endColumn: 36,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{2747}\\u{FE0F}]", "u")`,
            errors: [{
                column: 31,
                endColumn: 40,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👶🏻]", "")`,
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👶🏻]", "u")` }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👶🏻]", "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[👶🏻]", "u")`,
            errors: [{
                column: 23,
                endColumn: 25,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC76\\uD83C\\uDFFB]", "u")`,
            errors: [{
                column: 35,
                endColumn: 48,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F476}\\u{1F3FB}]", "u")`,
            errors: [{
                column: 32,
                endColumn: 42,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "")`,
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u")` }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "i")`,
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "iu")` }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "iu")` }]
                }
            ]
        },
        {
            code: "var r = new RegExp('[🇯🇵]', `i`)",
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = new RegExp('[🇯🇵]', `iu`)" }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = new RegExp('[🇯🇵]', `iu`)" }]
                }
            ]
        },
        {
            code: "var r = new RegExp('[🇯🇵]', `${foo}`)",
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = new RegExp('[🇯🇵]', `${foo}u`)" }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = new RegExp('[🇯🇵]', `${foo}u`)" }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]")`,
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u")` }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]",)`,
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u",)` }]
                },
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[🇯🇵]", "u",)` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp(("[🇯🇵]"))`,
            errors: [
                {
                    column: 23,
                    endColumn: 24,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp(("[🇯🇵]"), "u")` }]
                },
                {
                    column: 25,
                    endColumn: 26,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp(("[🇯🇵]"), "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp((("[🇯🇵]")))`,
            errors: [
                {
                    column: 24,
                    endColumn: 25,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp((("[🇯🇵]")), "u")` }]
                },
                {
                    column: 26,
                    endColumn: 27,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp((("[🇯🇵]")), "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp(("[🇯🇵]"),)`,
            parserOptions: { ecmaVersion: 2017 },
            errors: [
                {
                    column: 23,
                    endColumn: 24,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp(("[🇯🇵]"), "u",)` }]
                },
                {
                    column: 25,
                    endColumn: 26,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp(("[🇯🇵]"), "u",)` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "u")`,
            errors: [{
                column: 23,
                endColumn: 25,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83C\\uDDEF\\uD83C\\uDDF5]", "u")`,
            errors: [{
                column: 35,
                endColumn: 48,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F1EF}\\u{1F1F5}]", "u")`,
            errors: [{
                column: 32,
                endColumn: 42,
                messageId: "regionalIndicatorSymbol",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "")`,
            errors: [
                {
                    column: 22,
                    endColumn: 23,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")` }]
                },
                {
                    column: 23,
                    endColumn: 24,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 25,
                    endColumn: 26,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")` }]
                },
                {
                    column: 26,
                    endColumn: 27,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 28,
                    endColumn: 29,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")`,
            errors: [
                {
                    column: 23,
                    endColumn: 24,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 26,
                    endColumn: 27,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]", "u")`,
            errors: [
                {
                    column: 35,
                    endColumn: 42,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 53,
                    endColumn: 60,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
            errors: [
                {
                    column: 32,
                    endColumn: 41,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 49,
                    endColumn: 58,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[❇️]", "")`,
            env: { es2020: true },
            errors: [{
                column: 33,
                endColumn: 34,
                messageId: "combiningClass",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[👶🏻]", "u")`,
            env: { es2020: true },
            errors: [{
                column: 34,
                endColumn: 36,
                messageId: "emojiModifier",
                suggestions: null
            }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "")`,
            env: { es2020: true },
            errors: [
                {
                    column: 33,
                    endColumn: 34,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "u")` }]
                },
                {
                    column: 35,
                    endColumn: 36,
                    messageId: "surrogatePairWithoutUFlag",
                    suggestions: [{ messageId: "suggestUnicodeFlag", output: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "u")` }]
                }
            ]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
            env: { es2020: true },
            errors: [
                {
                    column: 43,
                    endColumn: 52,
                    messageId: "zwj",
                    suggestions: null
                },
                {
                    column: 60,
                    endColumn: 69,
                    messageId: "zwj",
                    suggestions: null
                }
            ]
        },


        // ES2024
        {
            code: "var r = /[[👶🏻]]/v",
            parserOptions: { ecmaVersion: 2024 },
            errors: [{
                column: 13,
                endColumn: 15,
                messageId: "emojiModifier",
                suggestions: null
            }]
        }
    ]
});

const flatRuleTester = new FlatRuleTester();

flatRuleTester.run("no-misleading-character-class", rule, {
    valid: [],

    invalid: [
        {
            code: "var r = /[👍]/",
            languageOptions: {
                ecmaVersion: 5,
                sourceType: "script"
            },
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: null // ecmaVersion doesn't support the 'u' flag
            }]
        },
        {
            code: "var r = /[👍]/",
            languageOptions: {
                ecmaVersion: 2015
            },
            errors: [{
                column: 11,
                endColumn: 12,
                messageId: "surrogatePairWithoutUFlag",
                suggestions: [{ messageId: "suggestUnicodeFlag", output: "var r = /[👍]/u" }]
            }]
        }
    ]
});
