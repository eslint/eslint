/**
 * @fileoverview Tests for no-octal-escape rule.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-octal-escape"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("no-octal-escape", rule, {
	valid: [
		'var foo = "\\x51";',
		'var foo = "foo \\\\251 bar";',
		"var foo = /([abc]) \\1/g;",
		"var foo = '\\0';",
		"'\\0'",
		"'\\8'",
		"'\\9'",
		"'\\0 '",
		"' \\0'",
		"'a\\0'",
		"'\\0a'",
		"'a\\8a'",
		"'\\0\\8'",
		"'\\8\\0'",
		"'\\80'",
		"'\\81'",
		"'\\\\'",
		"'\\\\0'",
		"'\\\\08'",
		"'\\\\1'",
		"'\\\\01'",
		"'\\\\12'",
		"'\\\\\\0'",
		"'\\\\\\8'",
		"'\\0\\\\'",
		"'0'",
		"'1'",
		"'8'",
		"'01'",
		"'08'",
		"'80'",
		"'12'",
		"'\\a'",
		"'\\n'",
	],
	invalid: [
		{
			code: 'var foo = "foo \\01 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: 'var foo = "foo \\000 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "000" },
				},
			],
		},
		{
			code: 'var foo = "foo \\377 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "377" },
				},
			],
		},
		{
			code: 'var foo = "foo \\378 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "37" },
				},
			],
		},
		{
			code: 'var foo = "foo \\37a bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "37" },
				},
			],
		},
		{
			code: 'var foo = "foo \\381 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "3" },
				},
			],
		},
		{
			code: 'var foo = "foo \\3a1 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "3" },
				},
			],
		},
		{
			code: 'var foo = "foo \\251 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "251" },
				},
			],
		},
		{
			code: 'var foo = "foo \\258 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "25" },
				},
			],
		},
		{
			code: 'var foo = "foo \\25a bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "25" },
				},
			],
		},
		{
			code: 'var foo = "\\3s51";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "3" },
				},
			],
		},
		{
			code: 'var foo = "\\77";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "77" },
				},
			],
		},
		{
			code: 'var foo = "\\78";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "7" },
				},
			],
		},
		{
			code: 'var foo = "\\5a";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "5" },
				},
			],
		},
		{
			code: 'var foo = "\\751";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "75" },
				},
			],
		},
		{
			code: 'var foo = "foo \\400 bar";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "40" },
				},
			],
		},

		{
			code: 'var foo = "\\t\\1";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: 'var foo = "\\\\\\751";',
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "75" },
				},
			],
		},

		{
			code: "'\\0\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\0 \\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\0\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\0 \\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\0a\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\0a\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\0\\08'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},

		{
			code: "'\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\2'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "2" },
				},
			],
		},
		{
			code: "'\\7'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "7" },
				},
			],
		},
		{
			code: "'\\00'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "00" },
				},
			],
		},
		{
			code: "'\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\02'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "02" },
				},
			],
		},
		{
			code: "'\\07'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "07" },
				},
			],
		},
		{
			code: "'\\08'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},
		{
			code: "'\\09'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},
		{
			code: "'\\10'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "10" },
				},
			],
		},
		{
			code: "'\\12'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "12" },
				},
			],
		},
		{
			code: "' \\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\1 '",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'a\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\1a'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'a\\1a'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "' \\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\01 '",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'a\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\01a'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'a\\01a'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'a\\08a'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},
		{
			code: "'\\n\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\n\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\n\\08'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},
		{
			code: "'\\\\\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
		{
			code: "'\\\\\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\\\\\08'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},

		// Multiline string
		{
			code: "'\\\n\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},

		// Only the first one is reported
		{
			code: "'\\01\\02'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\02\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "02" },
				},
			],
		},
		{
			code: "'\\01\\2'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "01" },
				},
			],
		},
		{
			code: "'\\2\\01'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "2" },
				},
			],
		},
		{
			code: "'\\08\\1'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "0" },
				},
			],
		},
		{
			code: "'foo \\1 bar \\2'",
			errors: [
				{
					messageId: "octalEscapeSequence",
					data: { sequence: "1" },
				},
			],
		},
	],
	fatal: [
		{
			name: "options provided when schema allows none",
			options: [1],
			error: { name: "SchemaValidationError" },
		},
	],
});
