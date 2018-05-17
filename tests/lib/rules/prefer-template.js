/**
 * @fileoverview Tests for prefer-template rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/prefer-template");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{
    message: "Unexpected string concatenation.",
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
            code: "foo + '\\n other text \\033'",
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
        }
    ]
});
