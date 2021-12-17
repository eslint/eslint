/**
 * @fileoverview Tests for prefer-template rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-template");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
    messageId: "unexpectedStringConcatenation",
    type: "BinaryExpression"
}];

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run("prefer-template", rule, {
    valid: [
        "'use strict';",
        "var foo = 'foo' + '\\0';",
        "var foo = 'bar';",
        "var foo = 'bar' + 'baz';",
        "var foo = foo + +'100';",
        "var foo = `bar`;",
        "var foo = `hello, ${name}!`;",

        // https://github.com/eslint/eslint/issues/3507
        "var foo = `foo` + `bar` + \"hoge\";",
        "var foo = `foo` +\n    `bar` +\n    \"hoge\";"
    ],
    invalid: [
        {
            code: "var foo = 'hello, ' + name + '!';",
            output: "var foo = `hello, ${  name  }!`;",
            errors
        },
        {
            code: "var foo = bar + 'baz';",
            output: "var foo = `${bar  }baz`;",
            errors
        },
        {
            code: "var foo = bar + `baz`;",
            output: "var foo = `${bar  }baz`;",
            errors
        },
        {
            code: "var foo = +100 + 'yen';",
            output: "var foo = `${+100  }yen`;",
            errors
        },
        {
            code: "var foo = 'bar' + baz;",
            output: "var foo = `bar${  baz}`;",
            errors
        },
        {
            code: "var foo = '￥' + (n * 1000) + '-'",
            output: "var foo = `￥${  n * 1000  }-`",
            errors
        },
        {
            code: "var foo = 'aaa' + aaa; var bar = 'bbb' + bbb;",
            output: "var foo = `aaa${  aaa}`; var bar = `bbb${  bbb}`;",
            errors: [errors[0], errors[0]]
        },
        {
            code: "var string = (number + 1) + 'px';",
            output: "var string = `${number + 1  }px`;",
            errors
        },
        {
            code: "var foo = 'bar' + baz + 'qux';",
            output: "var foo = `bar${  baz  }qux`;",
            errors
        },
        {
            code: "var foo = '0 backslashes: ${bar}' + baz;",
            output: "var foo = `0 backslashes: \\${bar}${  baz}`;",
            errors
        },
        {
            code: "var foo = '1 backslash: \\${bar}' + baz;",
            output: "var foo = `1 backslash: \\${bar}${  baz}`;",
            errors
        },
        {
            code: "var foo = '2 backslashes: \\\\${bar}' + baz;",
            output: "var foo = `2 backslashes: \\\\\\${bar}${  baz}`;",
            errors
        },
        {
            code: "var foo = '3 backslashes: \\\\\\${bar}' + baz;",
            output: "var foo = `3 backslashes: \\\\\\${bar}${  baz}`;",
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick: `' + baz;",
            output: "var foo = `${bar  }this is a backtick: \\`${  baz}`;",
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick preceded by a backslash: \\`' + baz;",
            output: "var foo = `${bar  }this is a backtick preceded by a backslash: \\`${  baz}`;",
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick preceded by two backslashes: \\\\`' + baz;",
            output: "var foo = `${bar  }this is a backtick preceded by two backslashes: \\\\\\`${  baz}`;",
            errors
        },
        {
            code: "var foo = bar + `${baz}foo`;",
            output: "var foo = `${bar  }${baz}foo`;",
            errors
        },
        {
            code:
            "var foo = 'favorites: ' + favorites.map(f => {\n" +
            "    return f.name;\n" +
            "}) + ';';",
            output:
            "var foo = `favorites: ${  favorites.map(f => {\n" +
            "    return f.name;\n" +
            "})  };`;",
            errors
        },
        {
            code: "var foo = bar + baz + 'qux';",
            output: "var foo = `${bar + baz  }qux`;",
            errors
        },
        {
            code:
            "var foo = 'favorites: ' +\n" +
            "    favorites.map(f => {\n" +
            "        return f.name;\n" +
            "    }) +\n" +
            "';';",
            output:
            "var foo = `favorites: ${ \n" +
            "    favorites.map(f => {\n" +
            "        return f.name;\n" +
            "    }) \n" +
            "};`;",
            errors
        },
        {
            code: "var foo = /* a */ 'bar' /* b */ + /* c */ baz /* d */ + 'qux' /* e */ ;",
            output: "var foo = /* a */ `bar${ /* b */  /* c */ baz /* d */  }qux` /* e */ ;",
            errors
        },
        {
            code: "var foo = bar + ('baz') + 'qux' + (boop);",
            output: "var foo = `${bar  }baz` + `qux${  boop}`;",
            errors
        },
        {
            code: "foo + 'unescapes an escaped single quote in a single-quoted string: \\''",
            output: "`${foo  }unescapes an escaped single quote in a single-quoted string: '`",
            errors
        },
        {
            code: "foo + \"unescapes an escaped double quote in a double-quoted string: \\\"\"",
            output: "`${foo  }unescapes an escaped double quote in a double-quoted string: \"`",
            errors
        },
        {
            code: "foo + 'does not unescape an escaped double quote in a single-quoted string: \\\"'",
            output: "`${foo  }does not unescape an escaped double quote in a single-quoted string: \\\"`",
            errors
        },
        {
            code: "foo + \"does not unescape an escaped single quote in a double-quoted string: \\'\"",
            output: "`${foo  }does not unescape an escaped single quote in a double-quoted string: \\'`",
            errors
        },
        {
            code: "foo + 'handles unicode escapes correctly: \\x27'", // "\x27" === "'"
            output: "`${foo  }handles unicode escapes correctly: \\x27`",
            errors
        },
        {
            code: "foo + 'does not autofix octal escape sequence' + '\\033'",
            output: null,
            errors
        },
        {
            code: "foo + 'does not autofix non-octal decimal escape sequence' + '\\8'",
            output: null,
            errors
        },
        {
            code: "foo + '\\n other text \\033'",
            output: null,
            errors
        },
        {
            code: "foo + '\\0\\1'",
            output: null,
            errors
        },
        {
            code: "foo + '\\08'",
            output: null,
            errors
        },
        {
            code: "foo + '\\\\033'",
            output: "`${foo  }\\\\033`",
            errors
        },
        {
            code: "foo + '\\0'",
            output: "`${foo  }\\0`",
            errors
        },

        // https://github.com/eslint/eslint/issues/15083
        {
            code: `"default-src 'self' https://*.google.com;"
            + "frame-ancestors 'none';"
            + "report-to " + foo + ";"`,
            output: `\`default-src 'self' https://*.google.com;\`
            + \`frame-ancestors 'none';\`
            + \`report-to \${  foo  };\``,
            errors
        },
        {
            code: "'a' + 'b' + foo",
            output: "`a` + `b${  foo}`",
            errors
        },
        {
            code: "'a' + 'b' + foo + 'c' + 'd'",
            output: "`a` + `b${  foo  }c` + `d`",
            errors
        },
        {
            code: "'a' + 'b + c' + foo + 'd' + 'e'",
            output: "`a` + `b + c${  foo  }d` + `e`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + 'd')",
            output: "`a` + `b${  foo  }c` + `d`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('a' + 'b')",
            output: "`a` + `b${  foo  }a` + `b`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + 'd') + ('e' + 'f')",
            output: "`a` + `b${  foo  }c` + `d` + `e` + `f`",
            errors
        },
        {
            code: "foo + ('a' + 'b') + ('c' + 'd')",
            output: "`${foo  }a` + `b` + `c` + `d`",
            errors
        },
        {
            code: "'a' + foo + ('b' + 'c') + ('d' + bar + 'e')",
            output: "`a${  foo  }b` + `c` + `d${  bar  }e`",
            errors
        },
        {
            code: "foo + ('b' + 'c') + ('d' + bar + 'e')",
            output: "`${foo  }b` + `c` + `d${  bar  }e`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + 'd' + 'e')",
            output: "`a` + `b${  foo  }c` + `d` + `e`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + bar + 'd')",
            output: "`a` + `b${  foo  }c${  bar  }d`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + bar + ('d' + 'e') + 'f')",
            output: "`a` + `b${  foo  }c${  bar  }d` + `e` + `f`",
            errors
        },
        {
            code: "'a' + 'b' + foo + ('c' + bar + 'e') + 'f' + test",
            output: "`a` + `b${  foo  }c${  bar  }e` + `f${  test}`",
            errors
        },
        {
            code: "'a' + foo + ('b' + bar + 'c') + ('d' + test)",
            output: "`a${  foo  }b${  bar  }c` + `d${  test}`",
            errors
        },
        {
            code: "'a' + foo + ('b' + 'c') + ('d' + bar)",
            output: "`a${  foo  }b` + `c` + `d${  bar}`",
            errors
        },
        {
            code: "foo + ('a' + bar + 'b') + 'c' + test",
            output: "`${foo  }a${  bar  }b` + `c${  test}`",
            errors
        },
        {
            code: "'a' + '`b`' + c",
            output: "`a` + `\\`b\\`${  c}`",
            errors
        },
        {
            code: "'a' + '`b` + `c`' + d",
            output: "`a` + `\\`b\\` + \\`c\\`${  d}`",
            errors
        },
        {
            code: "'a' + b + ('`c`' + '`d`')",
            output: "`a${  b  }\\`c\\`` + `\\`d\\``",
            errors
        },
        {
            code: "'`a`' + b + ('`c`' + '`d`')",
            output: "`\\`a\\`${  b  }\\`c\\`` + `\\`d\\``",
            errors
        },
        {
            code: "foo + ('`a`' + bar + '`b`') + '`c`' + test",
            output: "`${foo  }\\`a\\`${  bar  }\\`b\\`` + `\\`c\\`${  test}`",
            errors
        },
        {
            code: "'a' + ('b' + 'c') + d",
            output: "`a` + `b` + `c${  d}`",
            errors
        },
        {
            code: "'a' + ('`b`' + '`c`') + d",
            output: "`a` + `\\`b\\`` + `\\`c\\`${  d}`",
            errors
        },
        {
            code: "a + ('b' + 'c') + d",
            output: "`${a  }b` + `c${  d}`",
            errors
        },
        {
            code: "a + ('b' + 'c') + (d + 'e')",
            output: "`${a  }b` + `c${  d  }e`",
            errors
        },
        {
            code: "a + ('`b`' + '`c`') + d",
            output: "`${a  }\\`b\\`` + `\\`c\\`${  d}`",
            errors
        },
        {
            code: "a + ('`b` + `c`' + '`d`') + e",
            output: "`${a  }\\`b\\` + \\`c\\`` + `\\`d\\`${  e}`",
            errors
        },
        {
            code: "'a' + ('b' + 'c' + 'd') + e",
            output: "`a` + `b` + `c` + `d${  e}`",
            errors
        },
        {
            code: "'a' + ('b' + 'c' + 'd' + (e + 'f') + 'g' +'h' + 'i') + j",
            output: "`a` + `b` + `c` + `d${  e  }fg` +`h` + `i${  j}`",
            errors
        },
        {
            code: "a + (('b' + 'c') + 'd')",
            output: "`${a  }b` + `c` + `d`",
            errors
        },
        {
            code: "(a + 'b') + ('c' + 'd') + e",
            output: "`${a  }b` + `c` + `d${  e}`",
            errors
        },
        {
            code: "var foo = \"Hello \" + \"world \" + \"another \" + test",
            output: "var foo = `Hello ` + `world ` + `another ${  test}`",
            errors
        },
        {
            code: "'Hello ' + '\"world\" ' + test",
            output: "`Hello ` + `\"world\" ${  test}`",
            errors
        },
        {
            code: "\"Hello \" + \"'world' \" + test",
            output: "`Hello ` + `'world' ${  test}`",
            errors
        }
    ]
});
