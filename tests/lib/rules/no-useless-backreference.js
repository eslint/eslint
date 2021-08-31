/**
 * @fileoverview Tests for the no-useless-backreference rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-useless-backreference");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018 } });

ruleTester.run("no-useless-backreference", rule, {
    valid: [

        // not a regular expression
        String.raw`'\1(a)'`,
        String.raw`regExp('\\1(a)')`,
        String.raw`new Regexp('\\1(a)', 'u')`,
        String.raw`RegExp.foo('\\1(a)', 'u')`,
        String.raw`new foo.RegExp('\\1(a)')`,

        // unknown pattern
        String.raw`RegExp(p)`,
        String.raw`new RegExp(p, 'u')`,
        String.raw`RegExp('\\1(a)' + suffix)`,
        "new RegExp(`${prefix}\\\\1(a)`)",

        // not the global RegExp
        String.raw`let RegExp; new RegExp('\\1(a)');`,
        String.raw`function foo() { var RegExp; RegExp('\\1(a)', 'u'); }`,
        String.raw`function foo(RegExp) { new RegExp('\\1(a)'); }`,
        String.raw`if (foo) { const RegExp = bar; RegExp('\\1(a)'); }`,
        String.raw`/* globals RegExp:off */ new RegExp('\\1(a)');`,
        {
            code: String.raw`RegExp('\\1(a)');`,
            globals: { RegExp: "off" }
        },

        // no capturing groups
        String.raw`/(?:)/`,
        String.raw`/(?:a)/`,
        String.raw`new RegExp('')`,
        String.raw`RegExp('(?:a)|(?:b)*')`,
        String.raw`/^ab|[cd].\n$/`,

        // no backreferences
        String.raw`/(a)/`,
        String.raw`RegExp('(a)|(b)')`,
        String.raw`new RegExp('\\n\\d(a)')`,
        String.raw`/\0(a)/`,
        String.raw`/\0(a)/u`,
        String.raw`/(?<=(a))(b)(?=(c))/`,
        String.raw`/(?<!(a))(b)(?!(c))/`,
        String.raw`/(?<foo>a)/`,

        // not really a backreference
        String.raw`RegExp('\1(a)')`, // string octal escape
        String.raw`RegExp('\\\\1(a)')`, // escaped backslash
        String.raw`/\\1(a)/`, // // escaped backslash
        String.raw`/\1/`, // group 1 doesn't exist, this is a regex octal escape
        String.raw`/^\1$/`, // group 1 doesn't exist, this is a regex octal escape
        String.raw`/\2(a)/`, // group 2 doesn't exist, this is a regex octal escape
        String.raw`/\1(?:a)/`, // group 1 doesn't exist, this is a regex octal escape
        String.raw`/\1(?=a)/`, // group 1 doesn't exist, this is a regex octal escape
        String.raw`/\1(?!a)/`, // group 1 doesn't exist, this is a regex octal escape
        String.raw`/^[\1](a)$/`, // \N in a character class is a regex octal escape
        String.raw`new RegExp('[\\1](a)')`, // \N in a character class is a regex octal escape
        String.raw`/\11(a)/`, // regex octal escape \11, regex matches "\x09a"
        String.raw`/\k<foo>(a)/`, // without the 'u' flag and any named groups this isn't a syntax error, matches "k<foo>a"
        String.raw`/^(a)\1\2$/`, // \1 is a backreference, \2 is an octal escape sequence.

        // Valid backreferences: correct position, after the group
        String.raw`/(a)\1/`,
        String.raw`/(a).\1/`,
        String.raw`RegExp('(a)\\1(b)')`,
        String.raw`/(a)(b)\2(c)/`,
        String.raw`/(?<foo>a)\k<foo>/`,
        String.raw`new RegExp('(.)\\1')`,
        String.raw`RegExp('(a)\\1(?:b)')`,
        String.raw`/(a)b\1/`,
        String.raw`/((a)\2)/`,
        String.raw`/((a)b\2c)/`,
        String.raw`/^(?:(a)\1)$/`,
        String.raw`/^((a)\2)$/`,
        String.raw`/^(((a)\3))|b$/`,
        String.raw`/a(?<foo>(.)b\2)/`,
        String.raw`/(a)?(b)*(\1)(c)/`,
        String.raw`/(a)?(b)*(\2)(c)/`,
        String.raw`/(?<=(a))b\1/`,
        String.raw`/(?<=(?=(a)\1))b/`,

        // Valid backreferences: correct position before the group when they're both in the same lookbehind
        String.raw`/(?<!\1(a))b/`,
        String.raw`/(?<=\1(a))b/`,
        String.raw`/(?<!\1.(a))b/`,
        String.raw`/(?<=\1.(a))b/`,
        String.raw`/(?<=(?:\1.(a)))b/`,
        String.raw`/(?<!(?:\1)((a)))b/`,
        String.raw`/(?<!(?:\2)((a)))b/`,
        String.raw`/(?=(?<=\1(a)))b/`,
        String.raw`/(?=(?<!\1(a)))b/`,
        String.raw`/(.)(?<=\2(a))b/`,

        // Valid backreferences: not a reference into another alternative
        String.raw`/^(a)\1|b/`,
        String.raw`/^a|(b)\1/`,
        String.raw`/^a|(b|c)\1/`,
        String.raw`/^(a)|(b)\2/`,
        String.raw`/^(?:(a)|(b)\2)$/`,
        String.raw`/^a|(?:.|(b)\1)/`,
        String.raw`/^a|(?:.|(b).(\1))/`,
        String.raw`/^a|(?:.|(?:(b)).(\1))/`,
        String.raw`/^a|(?:.|(?:(b)|c).(\1))/`,
        String.raw`/^a|(?:.|(?:(b)).(\1|c))/`,
        String.raw`/^a|(?:.|(?:(b)|c).(\1|d))/`,

        // Valid backreferences: not a reference into a negative lookaround (reference from within the same lookaround is allowed)
        String.raw`/.(?=(b))\1/`,
        String.raw`/.(?<=(b))\1/`,
        String.raw`/a(?!(b)\1)./`,
        String.raw`/a(?<!\1(b))./`,
        String.raw`/a(?!(b)(\1))./`,
        String.raw`/a(?!(?:(b)\1))./`,
        String.raw`/a(?!(?:(b))\1)./`,
        String.raw`/a(?<!(?:\1)(b))./`,
        String.raw`/a(?<!(?:(?:\1)(b)))./`,
        String.raw`/(?<!(a))(b)(?!(c))\2/`,
        String.raw`/a(?!(b|c)\1)./`,

        // ignore regular expressions with syntax errors
        String.raw`RegExp('\\1(a)[')`, // \1 would be an error, but the unterminated [ is a syntax error
        String.raw`new RegExp('\\1(a){', 'u')`, // \1 would be an error, but the unterminated { is a syntax error because of the 'u' flag
        String.raw`new RegExp('\\1(a)\\2', 'ug')`, // \1 would be an error, but \2 is syntax error because of the 'u' flag
        String.raw`const flags = 'gus'; RegExp('\\1(a){', flags);`, // \1 would be an error, but the rule is aware of the 'u' flag so this is a syntax error
        String.raw`RegExp('\\1(a)\\k<foo>', 'u')`, // \1 would be an error, but \k<foo> produces syntax error because of the u flag
        String.raw`new RegExp('\\k<foo>(?<foo>a)\\k<bar>')` // \k<foo> would be an error, but \k<bar> produces syntax error because group <bar> doesn't exist
    ],

    invalid: [

        // full message tests
        {
            code: String.raw`/(b)(\2a)/`,
            errors: [{
                message: String.raw`Backreference '\2' will be ignored. It references group '(\2a)' from within that group.`,
                type: "Literal"
            }]
        },
        {
            code: String.raw`/\k<foo>(?<foo>a)/`,
            errors: [{
                message: String.raw`Backreference '\k<foo>' will be ignored. It references group '(?<foo>a)' which appears later in the pattern.`,
                type: "Literal"
            }]
        },
        {
            code: String.raw`RegExp('(a|bc)|\\1')`,
            errors: [{
                message: String.raw`Backreference '\1' will be ignored. It references group '(a|bc)' which is in another alternative.`,
                type: "CallExpression"
            }]
        },
        {
            code: String.raw`new RegExp('(?!(?<foo>\\n))\\1')`,
            errors: [{
                message: String.raw`Backreference '\1' will be ignored. It references group '(?<foo>\n)' which is in a negative lookaround.`,
                type: "NewExpression"
            }]
        },
        {
            code: String.raw`/(?<!(a)\1)b/`,
            errors: [{
                message: String.raw`Backreference '\1' will be ignored. It references group '(a)' which appears before in the same lookbehind.`,
                type: "Literal"
            }]
        },

        // nested
        {
            code: String.raw`new RegExp('(\\1)')`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(\1)` }, type: "NewExpression" }]
        },
        {
            code: String.raw`/^(a\1)$/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(a\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^((a)\1)$/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`((a)\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp('^(a\\1b)$')`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(a\1b)` }, type: "NewExpression" }]
        },
        {
            code: String.raw`RegExp('^((\\1))$')`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`((\1))` }, type: "CallExpression" }]
        },
        {
            code: String.raw`/((\2))/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\2`, group: String.raw`(\2)` }, type: "Literal" }]
        },
        {
            code: String.raw`/a(?<foo>(.)b\1)/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(?<foo>(.)b\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`/a(?<foo>\k<foo>)b/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\k<foo>`, group: String.raw`(?<foo>\k<foo>)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(\1)*$/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:a)(?:((?:\1)))*$/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`((?:\1))` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?!(\1))/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`/a|(b\1c)/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(b\1c)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(a|(\1))/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(a|(\1))` }, type: "Literal" }]
        },
        {
            code: String.raw`/(a|(\2))/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\2`, group: String.raw`(\2)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:a|(\1))/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(\1)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(a)?(b)*(\3)/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\3`, group: String.raw`(\3)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<=(a\1))b/`,
            errors: [{ messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(a\1)` }, type: "Literal" }]
        },

        // forward
        {
            code: String.raw`/\1(a)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/\1.(a)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:\1)(?:(a))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:\1)(?:((a)))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`((a))` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:\2)(?:((a)))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:\1)(?:((?:a)))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`((?:a))` }, type: "Literal" }]
        },
        {
            code: String.raw`/(\2)(a)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`RegExp('(a)\\2(b)')`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(b)` }, type: "CallExpression" }]
        },
        {
            code: String.raw`/(?:a)(b)\2(c)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(c)` }, type: "Literal" }]
        },
        {
            code: String.raw`/\k<foo>(?<foo>a)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\k<foo>`, group: String.raw`(?<foo>a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?:a(b)\2)(c)/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(c)` }, type: "Literal" }]
        },
        {
            code: String.raw`new RegExp('(a)(b)\\3(c)')`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\3`, group: String.raw`(c)` }, type: "NewExpression" }]
        },
        {
            code: String.raw`/\1(?<=(a))./`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/\1(?<!(a))./`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<=\1)(?<=(a))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!\1)(?<!(a))/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?=\1(a))./`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?!\1(a))./`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },

        // backward in the same lookbehind
        {
            code: String.raw`/(?<=(a)\1)b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!.(a).\1.)b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(.)(?<!(b|c)\2)d/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\2`, group: String.raw`(b|c)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<=(?:(a)\1))b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<=(?:(a))\1)b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<=(a)(?:\1))b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!(?:(a))(?:\1))b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!(?:(a))(?:\1)|.)b/`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?!(?<!(a)\1))./`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?=(?<!(a)\1))./`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?!(?<=(a)\1))./`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?=(?<=(a)\1))./`,
            errors: [{ messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },

        // into another alternative
        {
            code: String.raw`/(a)|\1b/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(a)|\1b)$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(a)|b(?:c|\1))$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:a|b(?:(c)|\1))$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(c)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(a(?!b))|\1b)+$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a(?!b))` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(?:(a)(?!b))|\1b)+$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(a(?=a))|\1b)+$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a(?=a))` }, type: "Literal" }]
        },
        {
            code: String.raw`/^(?:(a)(?=a)|\1b)+$/`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?:a|(b)).|(?:(\1)|c)./`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(b)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?!(a)|\1)./`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?<=\1|(a))./`,
            errors: [{ messageId: "disjunctive", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },

        // into a negative lookaround
        {
            code: String.raw`/a(?!(b)).\1/`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(b)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!(a))b\1/`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/(?<!(a))(?:\1)/`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?<!a|(b)).\1/`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(b)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?!(a)).(?!\1)./`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?<!(a)).(?<!\1)./`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?=(?!(a))\1)./`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/.(?<!\1(?!(a)))/`,
            errors: [{ messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },

        // valid and invalid
        {
            code: String.raw`/\1(a)(b)\2/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },
        {
            code: String.raw`/\1(a)\1/`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }]
        },

        // multiple invalid
        {
            code: String.raw`/\1(a)\2(b)/`,
            errors: [
                { messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" },
                { messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(b)` }, type: "Literal" }
            ]
        },
        {
            code: String.raw`/\1.(?<=(a)\1)/`,
            errors: [
                { messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" },
                { messageId: "backward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }
            ]
        },
        {
            code: String.raw`/(?!\1(a)).\1/`,
            errors: [
                { messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" },
                { messageId: "intoNegativeLookaround", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "Literal" }
            ]
        },
        {
            code: String.raw`/(a)\2(b)/; RegExp('(\\1)');`,
            errors: [
                { messageId: "forward", data: { bref: String.raw`\2`, group: String.raw`(b)` }, type: "Literal" },
                { messageId: "nested", data: { bref: String.raw`\1`, group: String.raw`(\1)` }, type: "CallExpression" }
            ]
        },

        // when flags cannot be evaluated, it is assumed that the regex doesn't have 'u' flag set, so this will be a correct regex with a useless backreference
        {
            code: String.raw`RegExp('\\1(a){', flags);`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "CallExpression" }]
        },

        // able to evaluate some statically known expressions
        {
            code: String.raw`const r = RegExp, p = '\\1', s = '(a)'; new r(p + s);`,
            errors: [{ messageId: "forward", data: { bref: String.raw`\1`, group: String.raw`(a)` }, type: "NewExpression" }]
        }
    ]
});
