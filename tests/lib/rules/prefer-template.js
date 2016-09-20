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

const ruleTester = new RuleTester();

ruleTester.run("prefer-template", rule, {
    valid: [
        {code: "'use strict';"},
        {code: "var foo = 'bar';"},
        {code: "var foo = 'bar' + 'baz';"},
        {code: "var foo = foo + +'100';"},
        {code: "var foo = `bar`;", parserOptions: { ecmaVersion: 6 }},
        {code: "var foo = `hello, ${name}!`;", parserOptions: { ecmaVersion: 6 }},

        // https://github.com/eslint/eslint/issues/3507
        {code: "var foo = `foo` + `bar` + \"hoge\";", parserOptions: { ecmaVersion: 6 }},
        {code: "var foo = `foo` +\n    `bar` +\n    \"hoge\";", parserOptions: { ecmaVersion: 6 }}
    ],
    invalid: [
        {
            code: "var foo = 'hello, ' + name + '!';",
            output: "var foo = `hello, ${  name  }!`;",
            errors,
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar + 'baz';",
            output: "var foo = `${bar  }baz`;",
            errors,
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "var foo = bar + `baz`;",
            output: "var foo = `${bar  }baz`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = +100 + 'yen';",
            output: "var foo = `${+100  }yen`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = 'bar' + baz;",
            output: "var foo = `bar${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = '￥' + (n * 1000) + '-'",
            output: "var foo = `￥${  n * 1000  }-`",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = 'aaa' + aaa; var bar = 'bbb' + bbb;",
            output: "var foo = `aaa${  aaa}`; var bar = `bbb${  bbb}`;",
            parserOptions: { ecmaVersion: 6 },
            errors: [errors[0], errors[0]]
        },
        {
            code: "var string = (number + 1) + 'px';",
            output: "var string = `${number + 1  }px`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = 'bar' + baz + 'qux';",
            output: "var foo = `bar${  baz  }qux`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = '0 backslashes: ${bar}' + baz;",
            output: "var foo = `0 backslashes: \\${bar}${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = '1 backslash: \\${bar}' + baz;",
            output: "var foo = `1 backslash: \\${bar}${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = '2 backslashes: \\\\${bar}' + baz;",
            output: "var foo = `2 backslashes: \\\\\\${bar}${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = '3 backslashes: \\\\\\${bar}' + baz;",
            output: "var foo = `3 backslashes: \\\\\\${bar}${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick: `' + baz;",
            output: "var foo = `${bar  }this is a backtick: \\`${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick preceded by a backslash: \\`' + baz;",
            output: "var foo = `${bar  }this is a backtick preceded by a backslash: \\`${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + 'this is a backtick preceded by two backslashes: \\\\`' + baz;",
            output: "var foo = `${bar  }this is a backtick preceded by two backslashes: \\\\\\`${  baz}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + `${baz}foo`;",
            output: "var foo = `${bar  }${baz}foo`;",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + baz + 'qux';",
            output: "var foo = `${bar + baz  }qux`;",
            parserOptions: { ecmaVersion: 6 },
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
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = /* a */ 'bar' /* b */ + /* c */ baz /* d */ + 'qux' /* e */ ;",
            output: "var foo = /* a */ `bar${ /* b */  /* c */ baz /* d */  }qux` /* e */ ;",
            parserOptions: { ecmaVersion: 6 },
            errors
        },
        {
            code: "var foo = bar + ('baz') + 'qux' + (boop);",
            output: "var foo = `${bar  }baz` + `qux${  boop}`;",
            parserOptions: { ecmaVersion: 6 },
            errors
        }
    ]
});
