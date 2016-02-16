/**
 * @fileoverview This option sets a specific tab width for your code
 * @author Dmitriy Shekhovtsov
 * @author Gyandeep Singh
 * @copyright 2014 Dmitriy Shekhovtsov. All rights reserved.
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/indent"),
    RuleTester = require("../../../lib/testers/rule-tester");
var fs = require("fs");
var path = require("path");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
var fixture = fs.readFileSync(path.join(__dirname, "../../fixtures/rules/indent/indent-invalid-fixture-1.js"), "utf8");
var fixedFixture = fs.readFileSync(path.join(__dirname, "../../fixtures/rules/indent/indent-valid-fixture-1.js"), "utf8");

/**
 * Create error message object for failure cases
 * @param {string} indentType indent type of string or tab
 * @param {array} errors error info
 * @returns {object} returns the error messages collection
 * @private
 */
function expectedErrors(indentType, errors) {
    if (Array.isArray(indentType)) {
        errors = indentType;
        indentType = "space";
    }

    if (!errors[0].length) {
        errors = [errors];
    }

    return errors.map(function(err) {
        var chars = err[1] === 1 ? "character" : "characters";
        return {
            message: "Expected indentation of " + err[1] + " " + indentType + " " + chars + " but found " + err[2] + ".",
            type: err[3] || "Program",
            line: err[0]
        };
    });
}

var ruleTester = new RuleTester();
ruleTester.run("indent", rule, {
    valid: [
        {
            code:
            "bridge.callHandler(\n" +
            "  'getAppVersion', 'test23', function(responseData) {\n" +
            "    window.ah.mobileAppVersion = responseData;\n" +
            "  }\n" +
            ");\n",
            options: [2]
        },
        {
            code:
            "bridge.callHandler(\n" +
            "  'getAppVersion', 'test23', function(responseData) {\n" +
            "    window.ah.mobileAppVersion = responseData;\n" +
            "  });\n",
            options: [2]
        },
        {
            code:
            "bridge.callHandler(\n" +
            "  'getAppVersion',\n" +
            "  null,\n" +
            "  function responseCallback(responseData) {\n" +
            "    window.ah.mobileAppVersion = responseData;\n" +
            "  }\n" +
            ");\n",
            options: [2]
        },
        {
            code:
            "bridge.callHandler(\n" +
            "  'getAppVersion',\n" +
            "  null,\n" +
            "  function responseCallback(responseData) {\n" +
            "    window.ah.mobileAppVersion = responseData;\n" +
            "  });\n",
            options: [2]
        },
        {
            code:
            "function doStuff(keys) {\n" +
            "    _.forEach(\n" +
            "        keys,\n" +
            "        key => {\n" +
            "            doSomething(key);\n" +
            "        }\n" +
            "   );\n" +
            "}\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "example(\n" +
            "    function () {\n" +
            "        console.log('example');\n" +
            "    }\n" +
            ");\n",
            options: [4]
        },
        {
            code:
            "let foo = somethingList\n" +
            "    .filter(x => {\n" +
            "        return x;\n" +
            "    })\n" +
            "    .map(x => {\n" +
            "        return 100 * x;\n" +
            "    });\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "require('http').request({hostname: 'localhost',\n" +
            "                         port: 80}, function(res) {\n" +
            "  res.end();\n" +
            "});\n",
            options: [2]
        },
        {
            code:
            "function test() {\n" +
            "  return client.signUp(email, PASSWORD, { preVerified: true })\n" +
            "    .then(function (result) {\n" +
            "      // hi\n" +
            "    })\n" +
            "    .then(function () {\n" +
            "      return FunctionalHelpers.clearBrowserState(self, {\n" +
            "        contentServer: true,\n" +
            "        contentServer1: true\n" +
            "      });\n" +
            "    });\n" +
            "}",
            options: [2]
        },
        {
            code:
            "it('should... some lengthy test description that is forced to be' +\n" +
            "  'wrapped into two lines since the line length limit is set', () => {\n" +
            "  expect(true).toBe(true);\n" +
            "});\n",
            options: [2],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "function test() {\n" +
            "    return client.signUp(email, PASSWORD, { preVerified: true })\n" +
            "    .then(function (result) {\n" +
            "        var x = 1;\n" +
            "        var y = 1;\n" +
            "    }, function(err){\n" +
            "        var o = 1 - 2;\n" +
            "        var y = 1 - 2;\n" +
            "        return true;\n" +
            "    });\n" +
            "}",
            options: [4]
        },
        {
            code:
            "// hi",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var Command = function() {\n" +
            "  var fileList = [],\n" +
            "      files = []\n" +
            "\n" +
            "  files.concat(fileList)\n" +
            "};\n",
            options: [2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]
        },
        {
            code:
                "  ",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "if(data) {\n" +
            "  console.log('hi');\n" +
            "  b = true;};",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "foo = () => {\n" +
            "  console.log('hi');\n" +
            "  return true;};",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "function test(data) {\n" +
            "  console.log('hi');\n" +
            "  return true;};",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var test = function(data) {\n" +
            "  console.log('hi');\n" +
            "};",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "arr.forEach(function(data) {\n" +
            "  otherdata.forEach(function(zero) {\n" +
            "    console.log('hi');\n" +
            "  }) });",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "a = [\n" +
            "    ,3\n" +
            "]",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "[\n" +
            "  ['gzip', 'gunzip'],\n" +
            "  ['gzip', 'unzip'],\n" +
            "  ['deflate', 'inflate'],\n" +
            "  ['deflateRaw', 'inflateRaw'],\n" +
            "].forEach(function(method) {\n" +
            "  console.log(method);\n" +
            "});\n",
            options: [2, {"SwitchCase": 1, "VariableDeclarator": 2}]
        },
        {
            code:
            "test(123, {\n" +
            "    bye: {\n" +
            "        hi: [1,\n" +
            "            {\n" +
            "                b: 2\n" +
            "            }\n" +
            "        ]\n" +
            "    }\n" +
            "});",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var xyz = 2,\n" +
            "    lmn = [\n" +
            "        {\n" +
            "            a: 1\n" +
            "        }\n" +
            "    ];",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "lmn = [{\n" +
            "    a: 1\n" +
            "},\n" +
            "{\n" +
            "    b: 2\n" +
            "}," +
            "{\n" +
            "    x: 2\n" +
            "}];",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "abc({\n" +
            "    test: [\n" +
            "        [\n" +
            "            c,\n" +
            "            xyz,\n" +
            "            2\n" +
            "        ].join(',')\n" +
            "    ]\n" +
            "});",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "abc = {\n" +
            "  test: [\n" +
            "    [\n" +
            "      c,\n" +
            "      xyz,\n" +
            "      2\n" +
            "    ]\n" +
            "  ]\n" +
            "};",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "abc(\n" +
            "  {\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "  }\n" +
            ");",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "abc({\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "});",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var abc = \n" +
            "  [\n" +
            "    c,\n" +
            "    xyz,\n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    }\n" +
            "  ];",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var abc = [\n" +
            "  c,\n" +
            "  xyz,\n" +
            "  {\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "  }\n" +
            "];",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var abc = 5,\n" +
            "    c = 2,\n" +
            "    xyz = \n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "var abc = \n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "var a = new abc({\n" +
            "        a: 1,\n" +
            "        b: 2\n" +
            "    }),\n" +
            "    b = 2;",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var a = 2,\n" +
            "  c = {\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "  },\n" +
            "  b = 2;",
            options: [2, {"VariableDeclarator": 1, "SwitchCase": 1}]
        },
        {
            code:
            "var x = 2,\n" +
            "    y = {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    },\n" +
            "    b = 2;",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "var e = {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    },\n" +
            "    b = 2;",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "var a = {\n" +
            "  a: 1,\n" +
            "  b: 2\n" +
            "};",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "function test() {\n" +
            "  if (true ||\n " +
            "            false){\n" +
            "    console.log(val);\n" +
            "  }\n" +
            "}",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "for (var val in obj)\n" +
            "  if (true)\n" +
            "    console.log(val);",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "if(true)\n" +
            "  if (true)\n" +
            "    if (true)\n" +
            "      console.log(val);",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "function hi(){     var a = 1;\n" +
            "  y++;                   x++;\n" +
            "}",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "for(;length > index; index++)if(NO_HOLES || index in self){\n" +
            "  x++;\n" +
            "}",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "function test(){\n" +
            "  switch(length){\n" +
            "    case 1: return function(a){\n" +
            "      return fn.call(that, a);\n" +
            "    };\n" +
            "  }\n" +
            "}",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}]
        },
        {
            code:
            "var geometry = 2,\n" +
            "rotate = 2;",
            options: [2, {VariableDeclarator: 0}]
        },
        {
            code:
            "var geometry,\n" +
            "    rotate;",
            options: [4, {VariableDeclarator: 1}]
        },
        {
            code:
            "var geometry,\n" +
            "\trotate;",
            options: ["tab", {VariableDeclarator: 1}]
        },
        {
            code:
            "var geometry,\n" +
            "  rotate;",
            options: [2, {VariableDeclarator: 1}]
        },
        {
            code:
            "var geometry,\n" +
            "    rotate;",
            options: [2, {VariableDeclarator: 2}]
        },
        {
            code:
            "let geometry,\n" +
            "    rotate;",
            options: [2, {VariableDeclarator: 2}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const geometry = 2,\n" +
            "    rotate = 3;",
            options: [2, {VariableDeclarator: 2}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,\n" +
            "  height, rotate;",
            options: [2, {SwitchCase: 1}]
        },
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;",
            options: [2, {SwitchCase: 1}]
        },
        {
            code:
            "if (1 < 2){\n" +
            "//hi sd \n" +
            "}",
            options: [2]
        },
        {
            code:
            "while (1 < 2){\n" +
            "  //hi sd \n" +
            "}",
            options: [2]
        },
        {
            code:
            "while (1 < 2) console.log('hi');",
            options: [2]
        },
        {
            code:
            "[a, b, \nc].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "[a, b, \nc].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "[a, b, c].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "[a, b, c].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "switch (x) {\n" +
            "    case \"foo\":\n" +
            "        a();\n" +
            "        break;\n" +
            "    case \"bar\":\n" +
            "        switch (y) {\n" +
            "            case \"1\":\n" +
            "                break;\n" +
            "            case \"2\":\n" +
            "                a = 6;\n" +
            "                break;\n" +
            "        }\n" +
            "    case \"test\":\n" +
            "        break;\n" +
            "}",
            options: [4, {SwitchCase: 1}]
        },
        {
            code:
            "switch (x) {\n" +
            "        case \"foo\":\n" +
            "            a();\n" +
            "            break;\n" +
            "        case \"bar\":\n" +
            "            switch (y) {\n" +
            "                    case \"1\":\n" +
            "                        break;\n" +
            "                    case \"2\":\n" +
            "                        a = 6;\n" +
            "                        break;\n" +
            "            }\n" +
            "        case \"test\":\n" +
            "            break;\n" +
            "}",
            options: [4, {SwitchCase: 2}]
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    switch(x){\n" +
            "    case '1':\n" +
            "        break;\n" +
            "    case '2':\n" +
            "        a = 6;\n" +
            "        break;\n" +
            "    }\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    if(x){\n" +
            "        a = 2;\n" +
            "    }\n" +
            "    else{\n" +
            "        a = 6;\n" +
            "    }\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    if(x){\n" +
            "        a = 2;\n" +
            "    }\n" +
            "    else\n" +
            "        a = 6;\n" +
            "}"
        },
        {
            code:
            "switch (a) {\n" +
            "case \"foo\":\n" +
            "    a();\n" +
            "    break;\n" +
            "case \"bar\":\n" +
            "    a(); break;\n" +
            "case \"baz\":\n" +
            "    a(); break;\n" +
            "}"
        },
        {
            code: "switch (0) {\n}"
        },
        {
            code:
            "function foo() {\n" +
            "    var a = \"a\";\n" +
            "    switch(a) {\n" +
            "    case \"a\":\n" +
            "        return \"A\";\n" +
            "    case \"b\":\n" +
            "        return \"B\";\n" +
            "    }\n" +
            "}\n" +
            "foo();"
        },
        {
            code:
            "switch(value){\n" +
            "    case \"1\":\n" +
            "    case \"2\":\n" +
            "        a();\n" +
            "        break;\n" +
            "    default:\n" +
            "        a();\n" +
            "        break;\n" +
            "}\n" +
            "switch(value){\n" +
            "    case \"1\":\n" +
            "        a();\n" +
            "        break;\n" +
            "    case \"2\":\n" +
            "        break;\n" +
            "    default:\n" +
            "        break;\n" +
            "}",
            options: [4, {SwitchCase: 1}]
        },
        {
            code:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "    console.log(foo + bar);\n" +
                "}\n"
        },
        {
            code:
                "if (a) {\n" +
                "    (1 + 2 + 3);\n" + // no error on this line
                "}"
        },
        {
            code:
                "switch(value){ default: a(); break; }\n"
        },
        {
            code: "import {addons} from 'react/addons'\nimport React from 'react'",
            options: [2],
            parserOptions: { sourceType: "module" }
        },
        {
            code:
            "var a = 1,\n" +
            "    b = 2,\n" +
            "    c = 3;\n",
            options: [4]
        },
        {
            code:
            "var a = 1\n" +
            "   ,b = 2\n" +
            "   ,c = 3;\n",
            options: [4]
        },
        {
            code: "while (1 < 2) console.log('hi')\n",
            options: [2]
        },
        {
            code:
                "function salutation () {\n" +
                "  switch (1) {\n" +
                "    case 0: return console.log('hi')\n" +
                "    case 1: return console.log('hey')\n" +
                "  }\n" +
                "}\n",
            options: [2, { SwitchCase: 1 }]
        },
        {
            code:
                "var items = [\n" +
                "    {\n" +
                "      foo: 'bar'\n" +
                "    }\n" +
                "];\n",
            options: [2, {"VariableDeclarator": 2}]
        },
        {
            code:
                "const geometry = 2,\n" +
                "      rotate = 3;\n" +
                "var a = 1,\n" +
                "  b = 2;\n" +
                "let light = true,\n" +
                "    shadow = false;",
            options: [2, { VariableDeclarator: { "const": 3, "let": 2 } }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const abc = 5,\n" +
            "      c = 2,\n" +
            "      xyz = \n" +
            "      {\n" +
            "        a: 1,\n" +
            "        b: 2\n" +
            "      };\n" +
            "let abc = 5,\n" +
            "  c = 2,\n" +
            "  xyz = \n" +
            "  {\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "  };\n" +
            "var abc = 5,\n" +
            "    c = 2,\n" +
            "    xyz = \n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    };\n",
            options: [2, { VariableDeclarator: { var: 2, const: 3 }, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
                "module.exports =\n" +
                "{\n" +
                "  'Unit tests':\n" +
                "  {\n" +
                "    rootPath: './',\n" +
                "    environment: 'node',\n" +
                "    tests:\n" +
                "    [\n" +
                "      'test/test-*.js'\n" +
                "    ],\n" +
                "    sources:\n" +
                "    [\n" +
                "      '*.js',\n" +
                "      'test/**.js'\n" +
                "    ]\n" +
                "  }\n" +
                "};",
            options: [2]
        },
        {
            code:
                "var path     = require('path')\n" +
                "  , crypto    = require('crypto')\n" +
                "  ;\n",
            options: [2]
        },
        {
            code:
                "var a = 1\n" +
                "   ,b = 2\n" +
                "   ;"
        },
        {
            code:
                "export function create (some,\n" +
                "                        argument) {\n" +
                "  return Object.create({\n" +
                "    a: some,\n" +
                "    b: argument\n" +
                "  });\n" +
                "};",
            parserOptions: { sourceType: "module" },
            options: [2]
        },
        {
            code:
                "export function create (id, xfilter, rawType,\n" +
                "                        width=defaultWidth, height=defaultHeight,\n" +
                "                        footerHeight=defaultFooterHeight,\n" +
                "                        padding=defaultPadding) {\n" +
                "  // ... function body, indented two spaces\n" +
                "}\n",
            parserOptions: { sourceType: "module" },
            options: [2]
        },
        {
            code:
                "var obj = {\n" +
                "  foo: function () {\n" +
                "    return new p()\n" +
                "      .then(function (ok) {\n" +
                "        return ok;\n" +
                "      }, function () {\n" +
                "        // ignore things\n" +
                "      });\n" +
                "  }\n" +
                "};\n",
            options: [2]
        },
        {
            code:
                "a.b()\n" +
                "  .c(function(){\n" +
                "    var a;\n" +
                "  }).d.e;\n",
            options: [2]
        },
        {
            code:
                "const YO = 'bah',\n" +
                "      TE = 'mah'\n" +
                "\n" +
                "var res,\n" +
                "    a = 5,\n" +
                "    b = 4\n",
            parserOptions: { ecmaVersion: 6 },
            options: [2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]
        },
        {
            code:
                "const YO = 'bah',\n" +
                "      TE = 'mah'\n" +
                "\n" +
                "var res,\n" +
                "    a = 5,\n" +
                "    b = 4\n" +
                "\n" +
                "if (YO) console.log(TE)",
            parserOptions: { ecmaVersion: 6 },
            options: [2, {"VariableDeclarator": { "var": 2, "let": 2, "const": 3}}]
        },
        {
            code:
                "var foo = 'foo',\n" +
                "  bar = 'bar',\n" +
                "  baz = function() {\n" +
                "      \n" +
                "  }\n" +
                "\n" +
                "function hello () {\n" +
                "    \n" +
                "}\n",
            options: [2]
        },
        {
            code:
                "var obj = {\n" +
                "  send: function () {\n" +
                "    return P.resolve({\n" +
                "      type: 'POST'\n" +
                "    })\n" +
                "    .then(function () {\n" +
                "      return true;\n" +
                "    }, function () {\n" +
                "      return false;\n" +
                "    });\n" +
                "  }\n" +
                "};\n",
            options: [2]
        },
        {
            code:
                "const someOtherFunction = argument => {\n" +
                "        console.log(argument);\n" +
                "    },\n" +
                "    someOtherValue = 'someOtherValue';\n",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "[\n" +
            "  'a',\n" +
            "  'b'\n" +
            "].sort().should.deepEqual([\n" +
            "  'x',\n" +
            "  'y'\n" +
            "]);\n",
            options: [2]
        },
        {
            code:
            "var a = 1,\n" +
            "    B = class {\n" +
            "      constructor(){}\n" +
            "      a(){}\n" +
            "      get b(){}\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "var a = 1,\n" +
            "    B = \n" +
            "    class {\n" +
            "      constructor(){}\n" +
            "      a(){}\n" +
            "      get b(){}\n" +
            "    },\n" +
            "    c = 3;",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "class A{\n" +
            "    constructor(){}\n" +
            "    a(){}\n" +
            "    get b(){}\n" +
            "}",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "var A = class {\n" +
            "    constructor(){}\n" +
            "    a(){}\n" +
            "    get b(){}\n" +
            "}",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "var a = {\n" +
            "  some: 1\n" +
            ", name: 2\n" +
            "};\n",
            options: [2]
        },
        {
            code:
            "a.c = {\n" +
            "    aa: function() {\n" +
            "        'test1';\n" +
            "        return 'aa';\n" +
            "    }\n" +
            "    , bb: function() {\n" +
            "        return this.bb();\n" +
            "    }\n" +
            "};\n",
            options: [4]
        },
        {
            code:
            "var a =\n" +
            "{\n" +
            "    actions:\n" +
            "    [\n" +
            "        {\n" +
            "            name: 'compile'\n" +
            "        }\n" +
            "    ]\n" +
            "};\n",
            options: [4, {"VariableDeclarator": 0, "SwitchCase": 1}]
        },
        {
            code:
            "var a =\n" +
            "[\n" +
            "    {\n" +
            "        name: 'compile'\n" +
            "    }\n" +
            "];\n",
            options: [4, {"VariableDeclarator": 0, "SwitchCase": 1}]
        },
        {
            code:
            "const func = function (opts) {\n" +
            "    return Promise.resolve()\n" +
            "    .then(() => {\n" +
            "        [\n" +
            "            'ONE', 'TWO'\n" +
            "        ].forEach(command => { doSomething(); });\n" +
            "    });\n" +
            "};",
            parserOptions: { ecmaVersion: 6 },
            options: [4]
        },
        {
            code:
            "var haveFun = function () {\n" +
            "    SillyFunction(\n" +
            "        {\n" +
            "            value: true,\n" +
            "        },\n" +
            "        {\n" +
            "            _id: true,\n" +
            "        }\n" +
            "    );\n" +
            "};",
            options: [4]
        },
        {
            code:
            "let object1 = {\n" +
            "  doThing() {\n" +
            "    return _.chain([])\n" +
            "      .map(v => (\n" +
            "        {\n" +
            "          value: true,\n" +
            "        }\n" +
            "      ))\n" +
            "      .value();\n" +
            "  }\n" +
            "};",
            parserOptions: { ecmaVersion: 6 },
            options: [2]
        }
    ],
    invalid: [
        {
            code:
                "var a = b;\n" +
                "if (a) {\n" +
                "b();\n" +
                "}\n",
            options: [2],
            errors: expectedErrors([[3, 2, 0, "ExpressionStatement"]]),
            output:
                "var a = b;\n" +
                "if (a) {\n" +
                "  b();\n" +
                "}\n"
        },
        {
            code:
                "if (array.some(function(){\n" +
                "  return true;\n" +
                "})) {\n" +
                "a++; // ->\n" +
                "  b++;\n" +
                "    c++; // <-\n" +
                "}\n",
            output:
                "if (array.some(function(){\n" +
                "  return true;\n" +
                "})) {\n" +
                "  a++; // ->\n" +
                "  b++;\n" +
                "  c++; // <-\n" +
                "}\n",
            options: [2],
            errors: expectedErrors([[4, 2, 0, "ExpressionStatement"], [6, 2, 4, "ExpressionStatement"]])
        },
        {
            code: "if (a){\n\tb=c;\n\t\tc=d;\ne=f;\n}",
            output: "if (a){\n\tb=c;\n\tc=d;\n\te=f;\n}",
            options: ["tab"],
            errors: expectedErrors("tab", [[3, 1, 2, "ExpressionStatement"], [4, 1, 0, "ExpressionStatement"]])
        },
        {
            code: "if (a){\n    b=c;\n      c=d;\n e=f;\n}",
            output: "if (a){\n    b=c;\n    c=d;\n    e=f;\n}",
            options: [4],
            errors: expectedErrors([[3, 4, 6, "ExpressionStatement"], [4, 4, 1, "ExpressionStatement"]])
        },
        {
            code: fixture,
            output: fixedFixture,
            options: [2, {SwitchCase: 1}],
            errors: expectedErrors([
                [5, 2, 4, "VariableDeclaration"],
                [10, 4, 6, "BlockStatement"],
                [11, 2, 4, "BlockStatement"],
                [15, 4, 2, "ExpressionStatement"],
                [16, 2, 4, "BlockStatement"],
                [23, 2, 4, "BlockStatement"],
                [29, 2, 4, "ForStatement"],
                [31, 4, 2, "BlockStatement"],
                [36, 4, 6, "ExpressionStatement"],
                [38, 2, 4, "BlockStatement"],
                [39, 4, 2, "ExpressionStatement"],
                [40, 2, 0, "BlockStatement"],
                [46, 0, 1, "VariableDeclaration"],
                [54, 2, 4, "BlockStatement"],
                [114, 4, 2, "VariableDeclaration"],
                [120, 4, 6, "VariableDeclaration"],
                [124, 4, 2, "BreakStatement"],
                [134, 4, 6, "BreakStatement"],
                [143, 4, 0, "ExpressionStatement"],
                [151, 4, 6, "ExpressionStatement"],
                [159, 4, 2, "ExpressionStatement"],
                [161, 4, 6, "ExpressionStatement"],
                [175, 2, 0, "ExpressionStatement"],
                [177, 2, 4, "ExpressionStatement"],
                [189, 2, 0, "VariableDeclaration"],
                [193, 6, 4, "ExpressionStatement"],
                [195, 6, 8, "ExpressionStatement"],
                [304, 4, 6, "ExpressionStatement"],
                [306, 4, 8, "ExpressionStatement"],
                [307, 2, 4, "BlockStatement"],
                [308, 2, 4, "VariableDeclarator"],
                [311, 4, 6, "Identifier"],
                [312, 4, 6, "Identifier"],
                [313, 4, 6, "Identifier"],
                [314, 2, 4, "ArrayExpression"],
                [315, 2, 4, "VariableDeclarator"],
                [318, 4, 6, "Property"],
                [319, 4, 6, "Property"],
                [320, 4, 6, "Property"],
                [321, 2, 4, "ObjectExpression"],
                [322, 2, 4, "VariableDeclarator"],
                [326, 2, 1, "Literal"],
                [327, 2, 1, "Literal"],
                [328, 2, 1, "Literal"],
                [329, 2, 1, "Literal"],
                [330, 2, 1, "Literal"],
                [331, 2, 1, "Literal"],
                [332, 2, 1, "Literal"],
                [333, 2, 1, "Literal"],
                [334, 2, 1, "Literal"],
                [335, 2, 1, "Literal"],
                [340, 2, 4, "ExpressionStatement"],
                [341, 2, 0, "ExpressionStatement"],
                [344, 2, 4, "ExpressionStatement"],
                [345, 2, 0, "ExpressionStatement"],
                [348, 2, 4, "ExpressionStatement"],
                [349, 2, 0, "ExpressionStatement"],
                [355, 2, 0, "ExpressionStatement"],
                [357, 2, 4, "ExpressionStatement"],
                [361, 4, 6, "ExpressionStatement"],
                [362, 2, 4, "BlockStatement"],
                [363, 2, 4, "VariableDeclarator"],
                [368, 2, 0, "SwitchCase"],
                [370, 2, 4, "SwitchCase"],
                [374, 4, 6, "VariableDeclaration"],
                [376, 4, 2, "VariableDeclaration"],
                [383, 2, 0, "ExpressionStatement"],
                [385, 2, 4, "ExpressionStatement"],
                [390, 2, 0, "ExpressionStatement"],
                [392, 2, 4, "ExpressionStatement"],
                [409, 2, 0, "ExpressionStatement"],
                [410, 2, 4, "ExpressionStatement"],
                [416, 2, 0, "ExpressionStatement"],
                [417, 2, 4, "ExpressionStatement"],
                [422, 2, 4, "ExpressionStatement"],
                [423, 2, 0, "ExpressionStatement"],
                [427, 2, 6, "ExpressionStatement"],
                [428, 2, 8, "ExpressionStatement"],
                [429, 2, 4, "ExpressionStatement"],
                [430, 0, 4, "BlockStatement"],
                [433, 2, 4, "ExpressionStatement"],
                [434, 0, 4, "BlockStatement"],
                [437, 2, 0, "ExpressionStatement"],
                [438, 0, 4, "BlockStatement"],
                [451, 2, 0, "ExpressionStatement"],
                [453, 2, 4, "ExpressionStatement"],
                [499, 6, 8, "BlockStatement"],
                [500, 10, 8, "ExpressionStatement"],
                [501, 8, 6, "BlockStatement"],
                [506, 6, 8, "BlockStatement"]
            ])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    default:\n" +
                "        a();\n" +
                "        break;\n" +
                "}",
            output:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        a();\n" +
                "        break;\n" +
                "}",
            options: [4, {SwitchCase: 1}],
            errors: expectedErrors([[4, 8, 4, "BreakStatement"], [7, 8, 4, "BreakStatement"]])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "    break;\n" +
                "}",
            output:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}",
            options: [4, {SwitchCase: 1}],
            errors: expectedErrors([9, 8, 4, "BreakStatement"])
        },
        {
            code:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}\n" +
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "    break;\n" +
                "    default:\n" +
                "        a();\n" +
                "    break;\n" +
                "}",
            output:
                "switch(value){\n" +
                "    case \"1\":\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}\n" +
                "switch(value){\n" +
                "    case \"1\":\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    default:\n" +
                "        a();\n" +
                "        break;\n" +
                "}",
            options: [4, {SwitchCase: 1}],
            errors: expectedErrors([[11, 8, 4, "BreakStatement"], [14, 8, 4, "BreakStatement"], [17, 8, 4, "BreakStatement"]])
        },
        {
            code:
                "switch(value){\n" +
                "case \"1\":\n" +
                "        a();\n" +
                "        break;\n" +
                "    case \"2\":\n" +
                "        break;\n" +
                "    default:\n" +
                "        break;\n" +
                "}",
            output:
                "switch(value){\n" +
                "case \"1\":\n" +
                "    a();\n" +
                "    break;\n" +
                "case \"2\":\n" +
                "    break;\n" +
                "default:\n" +
                "    break;\n" +
                "}",
            options: [4],
            errors: expectedErrors([
                [3, 4, 8, "ExpressionStatement"],
                [4, 4, 8, "BreakStatement"],
                [5, 0, 4, "SwitchCase"],
                [6, 4, 8, "BreakStatement"],
                [7, 0, 4, "SwitchCase"],
                [8, 4, 8, "BreakStatement"]
            ])
        },
        {
            code:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "console.log(foo + bar);\n" +
                "}\n",
            output:
                "var obj = {foo: 1, bar: 2};\n" +
                "with (obj) {\n" +
                "    console.log(foo + bar);\n" +
                "}\n",
            errors: expectedErrors([3, 4, 0, "ExpressionStatement"])
        },
        {
            code:
                "switch (a) {\n" +
                "case '1':\n" +
                "b();\n" +
                "break;\n" +
                "default:\n" +
                "c();\n" +
                "break;\n" +
                "}\n",
            output:
                "switch (a) {\n" +
                "    case '1':\n" +
                "        b();\n" +
                "        break;\n" +
                "    default:\n" +
                "        c();\n" +
                "        break;\n" +
                "}\n",
            options: [4, {SwitchCase: 1}],
            errors: expectedErrors([
                [2, 4, 0, "SwitchCase"],
                [3, 8, 0, "ExpressionStatement"],
                [4, 8, 0, "BreakStatement"],
                [5, 4, 0, "SwitchCase"],
                [6, 8, 0, "ExpressionStatement"],
                [7, 8, 0, "BreakStatement"]
            ])
        },
        {
            code:
                "while (a) \n" +
                "b();",
            output:
                "while (a) \n" +
                "    b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "for (;;) \n" +
            "b();",
            output:
            "for (;;) \n" +
            "    b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "for (a in x) \n" +
            "b();",
            output:
            "for (a in x) \n" +
            "    b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "do \n" +
            "b();\n" +
            "while(true)",
            output:
            "do \n" +
            "    b();\n" +
            "while(true)",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "if(true) \n" +
            "b();",
            output:
            "if(true) \n" +
            "    b();",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "ExpressionStatement"]
            ])
        },
        {
            code:
            "var test = {\n" +
            "      a: 1,\n" +
            "    b: 2\n" +
            "    };\n",
            output:
            "var test = {\n" +
            "  a: 1,\n" +
            "  b: 2\n" +
            "};\n",
            options: [2],
            errors: expectedErrors([
                [2, 2, 6, "Property"],
                [3, 2, 4, "Property"],
                [4, 0, 4, "ObjectExpression"]
            ])
        },
        {
            code:
            "var a = function() {\n" +
            "      a++;\n" +
            "    b++;\n" +
            "          c++;\n" +
            "    },\n" +
            "    b;\n",
            output:
            "var a = function() {\n" +
            "        a++;\n" +
            "        b++;\n" +
            "        c++;\n" +
            "    },\n" +
            "    b;\n",
            options: [4],
            errors: expectedErrors([
                [2, 8, 6, "ExpressionStatement"],
                [3, 8, 4, "ExpressionStatement"],
                [4, 8, 10, "ExpressionStatement"]
            ])
        },
        {
            code:
            "var a = 1,\n" +
            "b = 2,\n" +
            "c = 3;\n",
            output:
            "var a = 1,\n" +
            "    b = 2,\n" +
            "    c = 3;\n",
            options: [4],
            errors: expectedErrors([
                [2, 4, 0, "VariableDeclarator"],
                [3, 4, 0, "VariableDeclarator"]
            ])
        },
        {
            code:
            "[a, b, \nc].forEach((index) => {\n" +
            "  index;\n" +
            "});\n",
            output:
            "[a, b, \nc].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [3, 4, 2, "ExpressionStatement"]
            ])
        },
        {
            code:
            "[a, b, \nc].forEach(function(index){\n" +
            "  return index;\n" +
            "});\n",
            output:
            "[a, b, \nc].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [3, 4, 2, "ReturnStatement"]
            ])
        },
        {
            code:
            "[a, b, c].forEach((index) => {\n" +
            "  index;\n" +
            "});\n",
            output:
            "[a, b, c].forEach((index) => {\n" +
            "    index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 2, "ExpressionStatement"]
            ])
        },
        {
            code:
            "[a, b, c].forEach(function(index){\n" +
            "  return index;\n" +
            "});\n",
            output:
            "[a, b, c].forEach(function(index){\n" +
            "    return index;\n" +
            "});\n",
            options: [4],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 2, "ReturnStatement"]
            ])
        },
        {
            code: "while (1 < 2)\nconsole.log('foo')\n  console.log('bar')",
            output: "while (1 < 2)\n  console.log('foo')\nconsole.log('bar')",
            options: [2],
            errors: expectedErrors([
                [2, 2, 0, "ExpressionStatement"],
                [3, 0, 2, "ExpressionStatement"]
            ])
        },
        {
            code:
            "function salutation () {\n" +
            "  switch (1) {\n" +
            "  case 0: return console.log('hi')\n" +
            "    case 1: return console.log('hey')\n" +
            "  }\n" +
            "}\n",
            output:
            "function salutation () {\n" +
            "  switch (1) {\n" +
            "    case 0: return console.log('hi')\n" +
            "    case 1: return console.log('hey')\n" +
            "  }\n" +
            "}\n",
            options: [2, { SwitchCase: 1 }],
            errors: expectedErrors([
                [3, 4, 2, "SwitchCase"]
            ])
        },
        {
            code:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,\n" +
            "height, rotate;",
            output:
            "var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,\n" +
            "  height, rotate;",
            options: [2, {SwitchCase: 1}],
            errors: expectedErrors([
                [2, 2, 0, "VariableDeclarator"]
            ])
        },
        {
            code:
            "switch (a) {\n" +
            "case '1':\n" +
            "b();\n" +
            "break;\n" +
            "default:\n" +
            "c();\n" +
            "break;\n" +
            "}\n",
            output:
            "switch (a) {\n" +
            "        case '1':\n" +
            "            b();\n" +
            "            break;\n" +
            "        default:\n" +
            "            c();\n" +
            "            break;\n" +
            "}\n",
            options: [4, {SwitchCase: 2}],
            errors: expectedErrors([
                [2, 8, 0, "SwitchCase"],
                [3, 12, 0, "ExpressionStatement"],
                [4, 12, 0, "BreakStatement"],
                [5, 8, 0, "SwitchCase"],
                [6, 12, 0, "ExpressionStatement"],
                [7, 12, 0, "BreakStatement"]
            ])
        },
        {
            code:
            "var geometry,\n" +
            "rotate;",
            output:
            "var geometry,\n" +
            "  rotate;",
            options: [2, {VariableDeclarator: 1}],
            errors: expectedErrors([
                [2, 2, 0, "VariableDeclarator"]
            ])
        },
        {
            code:
            "var geometry,\n" +
            "  rotate;",
            output:
            "var geometry,\n" +
            "    rotate;",
            options: [2, {VariableDeclarator: 2}],
            errors: expectedErrors([
                [2, 4, 2, "VariableDeclarator"]
            ])
        },
        {
            code:
            "var geometry,\n" +
            "\trotate;",
            output:
            "var geometry,\n" +
            "\t\trotate;",
            options: ["tab", {VariableDeclarator: 2}],
            errors: expectedErrors("tab", [
                [2, 2, 1, "VariableDeclarator"]
            ])
        },
        {
            code:
            "let geometry,\n" +
            "  rotate;",
            output:
            "let geometry,\n" +
            "    rotate;",
            options: [2, {VariableDeclarator: 2}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 4, 2, "VariableDeclarator"]
            ])
        },
        {
            code:
            "if(true)\n" +
            "  if (true)\n" +
            "    if (true)\n" +
            "    console.log(val);",
            output:
            "if(true)\n" +
            "  if (true)\n" +
            "    if (true)\n" +
            "      console.log(val);",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            errors: expectedErrors([
                [4, 6, 4, "ExpressionStatement"]
            ])
        },
        {
            code:
            "var a = {\n" +
            "    a: 1,\n" +
            "    b: 2\n" +
            "}",
            output:
            "var a = {\n" +
            "  a: 1,\n" +
            "  b: 2\n" +
            "}",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            errors: expectedErrors([
                [2, 2, 4, "Property"],
                [3, 2, 4, "Property"]
            ])
        },
        {
            code:
            "var a = [\n" +
            "    a,\n" +
            "    b\n" +
            "]",
            output:
            "var a = [\n" +
            "  a,\n" +
            "  b\n" +
            "]",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            errors: expectedErrors([
                [2, 2, 4, "Identifier"],
                [3, 2, 4, "Identifier"]
            ])
        },
        {
            code:
            "let a = [\n" +
            "    a,\n" +
            "    b\n" +
            "]",
            output:
            "let a = [\n" +
            "  a,\n" +
            "  b\n" +
            "]",
            options: [2, {"VariableDeclarator": { let: 2 }, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [2, 2, 4, "Identifier"],
                [3, 2, 4, "Identifier"]
            ])
        },
        {
            code:
            "var a = new Test({\n" +
            "      a: 1\n" +
            "  }),\n" +
            "    b = 4;\n",
            output:
            "var a = new Test({\n" +
            "        a: 1\n" +
            "    }),\n" +
            "    b = 4;\n",
            options: [4],
            errors: expectedErrors([
                [2, 8, 6, "Property"],
                [3, 4, 2, "ObjectExpression"]
            ])
        },
        {
            code:
            "var a = new Test({\n" +
            "      a: 1\n" +
            "    }),\n" +
            "    b = 4;\n" +
            "const a = new Test({\n" +
            "      a: 1\n" +
            "    }),\n" +
            "    b = 4;\n",
            output:
            "var a = new Test({\n" +
            "      a: 1\n" +
            "    }),\n" +
            "    b = 4;\n" +
            "const a = new Test({\n" +
            "    a: 1\n" +
            "  }),\n" +
            "  b = 4;\n",
            options: [2, { VariableDeclarator: { var: 2 }}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([
                [6, 4, 6, "Property"],
                [7, 2, 4, "ObjectExpression"],
                [8, 2, 4, "VariableDeclarator"]
            ])
        },
        {
            code:
            "var abc = 5,\n" +
            "    c = 2,\n" +
            "    xyz = \n" +
            "     {\n" +
            "       a: 1,\n" +
            "        b: 2\n" +
            "     };",
            output:
            "var abc = 5,\n" +
            "    c = 2,\n" +
            "    xyz = \n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            errors: expectedErrors([
                [4, 4, 5, "ObjectExpression"],
                [5, 6, 7, "Property"],
                [6, 6, 8, "Property"],
                [7, 4, 5, "ObjectExpression"]
            ])
        },
        {
            code:
            "var abc = \n" +
            "     {\n" +
            "       a: 1,\n" +
            "        b: 2\n" +
            "     };",
            output:
            "var abc = \n" +
            "    {\n" +
            "      a: 1,\n" +
            "      b: 2\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            errors: expectedErrors([
                [2, 4, 5, "ObjectExpression"],
                [3, 6, 7, "Property"],
                [4, 6, 8, "Property"],
                [5, 4, 5, "ObjectExpression"]
            ])
        },
        {
            code:
                "var path     = require('path')\n" +
                " , crypto    = require('crypto')\n" +
                ";\n",
            output:
                "var path     = require('path')\n" +
                " , crypto    = require('crypto')\n" +
                " ;\n",
            options: [2],
            errors: expectedErrors([
                [3, 1, 0, "VariableDeclaration"]
            ])
        },
        {
            code:
                "var a = 1\n" +
                "   ,b = 2\n" +
                ";",
            output:
                "var a = 1\n" +
                "   ,b = 2\n" +
                "   ;",
            errors: expectedErrors([
                [3, 3, 0, "VariableDeclaration"]
            ])
        },
        {
            code:
            "class A{\n" +
            "  constructor(){}\n" +
            "    a(){}\n" +
            "    get b(){}\n" +
            "}",
            output:
            "class A{\n" +
            "    constructor(){}\n" +
            "    a(){}\n" +
            "    get b(){}\n" +
            "}",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([[2, 4, 2, "MethodDefinition"]])
        },
        {
            code:
            "var A = class {\n" +
            "  constructor(){}\n" +
            "    a(){}\n" +
            "  get b(){}\n" +
            "};",
            output:
            "var A = class {\n" +
            "    constructor(){}\n" +
            "    a(){}\n" +
            "    get b(){}\n" +
            "};",
            options: [4, {"VariableDeclarator": 1, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([[2, 4, 2, "MethodDefinition"], [4, 4, 2, "MethodDefinition"]])
        },
        {
            code:
            "var a = 1,\n" +
            "    B = class {\n" +
            "    constructor(){}\n" +
            "      a(){}\n" +
            "      get b(){}\n" +
            "    };",
            output:
            "var a = 1,\n" +
            "    B = class {\n" +
            "      constructor(){}\n" +
            "      a(){}\n" +
            "      get b(){}\n" +
            "    };",
            options: [2, {"VariableDeclarator": 2, "SwitchCase": 1}],
            parserOptions: { ecmaVersion: 6 },
            errors: expectedErrors([[3, 6, 4, "MethodDefinition"]])
        }
    ]
});
