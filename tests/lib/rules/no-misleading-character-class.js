/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-misleading-character-class"),
    { RuleTester } = require("../../../lib/rule-tester");

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
        "var r = new RegExp('[Á] [ ');",
        "var r = RegExp('{ [Á]', 'u');",
        { code: "var r = new globalThis.RegExp('[Á] [ ');", env: { es2020: true } },
        { code: "var r = globalThis.RegExp('{ [Á]', 'u');", env: { es2020: true } }
    ],
    invalid: [

        // RegExp Literals.
        {
            code: "var r = /[👍]/",
            output: "var r = /[👍]/u",
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: "var r = /[\\uD83D\\uDC4D]/",
            output: "var r = /[\\uD83D\\uDC4D]/u",
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: "var r = /[Á]/",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[Á]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u0041\\u0301]/",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u0041\\u0301]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u{41}\\u{301}]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[❇️]/",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[❇️]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u2747\\uFE0F]/",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u2747\\uFE0F]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[\\u{2747}\\u{FE0F}]/u",
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: "var r = /[👶🏻]/",
            output: "var r = /[👶🏻]/u",
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: "var r = /[👶🏻]/u",
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: "var r = /[\\uD83D\\uDC76\\uD83C\\uDFFB]/u",
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: "var r = /[\\u{1F476}\\u{1F3FB}]/u",
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: "var r = /[🇯🇵]/",
            output: "var r = /[🇯🇵]/u",
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: "var r = /[🇯🇵]/i",
            output: "var r = /[🇯🇵]/iu",
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: "var r = /[🇯🇵]/u",
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: "var r = /[\\uD83C\\uDDEF\\uD83C\\uDDF5]/u",
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: "var r = /[\\u{1F1EF}\\u{1F1F5}]/u",
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: "var r = /[👨‍👩‍👦]/",
            output: "var r = /[👨‍👩‍👦]/u",
            errors: [
                { messageId: "surrogatePairWithoutUFlag" },
                { messageId: "zwj" }
            ]
        },
        {
            code: "var r = /[👨‍👩‍👦]/u",
            output: null,
            errors: [{ messageId: "zwj" }]
        },
        {
            code: "var r = /[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]/u",
            output: null,
            errors: [{ messageId: "zwj" }]
        },
        {
            code: "var r = /[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]/u",
            output: null,
            errors: [{ messageId: "zwj" }]
        },

        // RegExp constructors.
        {
            code: String.raw`var r = new RegExp("[👍]", "")`,
            output: String.raw`var r = new RegExp("[👍]", "u")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC4D]", "")`,
            output: String.raw`var r = new RegExp("[\\uD83D\\uDC4D]", "u")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[Á]", "")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[Á]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u0041\\u0301]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{41}\\u{301}]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[❇️]", "")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[❇️]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u2747\\uFE0F]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{2747}\\u{FE0F}]", "u")`,
            output: null,
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new RegExp("[👶🏻]", "")`,
            output: String.raw`var r = new RegExp("[👶🏻]", "u")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[👶🏻]", "u")`,
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC76\\uD83C\\uDFFB]", "u")`,
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F476}\\u{1F3FB}]", "u")`,
            output: null,
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "")`,
            output: String.raw`var r = new RegExp("[🇯🇵]", "u")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "i")`,
            output: String.raw`var r = new RegExp("[🇯🇵]", "iu")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]")`,
            output: String.raw`var r = new RegExp("[🇯🇵]", "u")`,
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new RegExp("[🇯🇵]", "u")`,
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83C\\uDDEF\\uD83C\\uDDF5]", "u")`,
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F1EF}\\u{1F1F5}]", "u")`,
            output: null,
            errors: [{ messageId: "regionalIndicatorSymbol" }]
        },
        {
            code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "")`,
            output: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")`,
            errors: [
                { messageId: "surrogatePairWithoutUFlag" },
                { messageId: "zwj" }
            ]
        },
        {
            code: String.raw`var r = new RegExp("[👨‍👩‍👦]", "u")`,
            output: null,
            errors: [{ messageId: "zwj" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66]", "u")`,
            output: null,
            errors: [{ messageId: "zwj" }]
        },
        {
            code: String.raw`var r = new RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
            output: null,
            errors: [{ messageId: "zwj" }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[❇️]", "")`,
            output: null,
            env: { es2020: true },
            errors: [{ messageId: "combiningClass" }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[👶🏻]", "u")`,
            output: null,
            env: { es2020: true },
            errors: [{ messageId: "emojiModifier" }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "")`,
            output: String.raw`var r = new globalThis.RegExp("[🇯🇵]", "u")`,
            env: { es2020: true },
            errors: [{ messageId: "surrogatePairWithoutUFlag" }]
        },
        {
            code: String.raw`var r = new globalThis.RegExp("[\\u{1F468}\\u{200D}\\u{1F469}\\u{200D}\\u{1F466}]", "u")`,
            output: null,
            env: { es2020: true },
            errors: [{ messageId: "zwj" }]
        }
    ]
});
