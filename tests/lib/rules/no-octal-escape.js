/* eslint no-octal-escape: 0 */
/**
 * @fileoverview Tests for no-octal-escape rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-octal-escape"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-octal-escape", rule, {
    valid: [
        "var foo = \"\\x51\";",
        "var foo = \"foo \\\\251 bar\";",
        "var foo = /([abc]) \\1/g;",
        "var foo = '\\0';",
        "'\\0 '",
        "'\\0a'",
        "'\\\\1'",
        "'\\\\01'",
        "'\\08'",
        "'\\09'"
    ],
    invalid: [

        // Test full message
        { code: "var foo = \"foo \\01 bar\";", errors: [{ message: "Don't use octal: '\\01'. Use '\\u....' instead.", type: "Literal" }] },

        { code: "var foo = \"foo \\251 bar\";", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "251" }, type: "Literal" }] },
        { code: "var foo = \"\\751\";", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "75" }, type: "Literal" }] },
        { code: "var foo = \"\\3s51\";", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "3" }, type: "Literal" }] },
        { code: "var foo = \"\\\\\\751\";", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "75" }, type: "Literal" }] },
        { code: "'\\0\\1'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "1" }, type: "Literal" }] },
        { code: "'\\0 \\1'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "1" }, type: "Literal" }] },
        { code: "'\\0\\01'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "01" }, type: "Literal" }] },
        { code: "'\\0 \\01'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "01" }, type: "Literal" }] },
        { code: "'\\08\\1'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "1" }, type: "Literal" }] },
        { code: "'\\08\\01'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "01" }, type: "Literal" }] },

        // Only the first one is reported
        { code: "'\\01\\02'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "01" }, type: "Literal" }] },
        { code: "'\\02\\01'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "02" }, type: "Literal" }] },
        { code: "'\\01\\2'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "01" }, type: "Literal" }] },
        { code: "'\\2\\01'", errors: [{ messageId: "octalEscapeSequence", data: { sequence: "2" }, type: "Literal" }] }
    ]
});
