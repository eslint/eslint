/**
 * @fileoverview Test enforcement of lines around comments.
 * @author Jamund Ferguson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-around-comment"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("lines-around-comment", rule, {

    valid: [

        // default rules
        "bar()\n\n/** block block block\n * block \n */\n\nvar a = 1;",
        "bar()\n\n/** block block block\n * block \n */\nvar a = 1;",
        "bar()\n// line line line \nvar a = 1;",
        "bar()\n\n// line line line\nvar a = 1;",
        "bar()\n// line line line\n\nvar a = 1;",

        // line comments
        {
            code: "bar()\n// line line line\n\nvar a = 1;",
            options: [{ afterLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\nvar a = 1;",
            options: [{ beforeLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },
        {
            code: "foo()\n\n// line line line\n// line line\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },
        {
            code: "// line line line\n// line line",
            options: [{ beforeLineComment: true, afterLineComment: true }]
        },

        // block comments
        {
            code: "bar()\n\n/** A Block comment with a an empty line after\n *\n */\nvar a = 1;",
            options: [{ afterBlockComment: false, beforeBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\nvar a = 1;",
            options: [{ afterBlockComment: false }]
        },
        {
            code: "/** \nblock \nblock block\n */\n/* block \n block \n */",
            options: [{ afterBlockComment: true, beforeBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }]
        },

        // inline comments (should not ever warn)
        {
            code: "foo() // An inline comment with a an empty line after\nvar a = 1;",
            options: [{ afterLineComment: true, beforeLineComment: true }]
        },
        {
            code: "foo();\nbar() /* An inline block comment with a an empty line after\n *\n */\nvar a = 1;",
            options: [{ beforeBlockComment: true }]
        },

        // mixed comment (some block & some line)
        {
            code: "bar()\n\n/** block block block\n * block \n */\n//line line line\nvar a = 1;",
            options: [{ afterBlockComment: true }]
        },
        {
            code: "bar()\n\n/** block block block\n * block \n */\n//line line line\nvar a = 1;",
            options: [{ beforeLineComment: true }]
        },

        // check for block start comments
        {
            code: "var a,\n\n// line\nb;",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "var foo = function(){\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "var foo = function(){\n// line at block start\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n// line at block start\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){ bar(); } else {\n// line at block start\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\n\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "var foo = function(){\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "if(true){\n\n/* block comment at block start */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "while(true){\n\n/* \nblock comment at block start\n */\nvar g = 1;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "class A {\n/**\n* hi\n */\nconstructor() {}\n}",
            options: [{
                allowBlockStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A {\n/**\n* hi\n */\nconstructor() {}\n}",
            options: [{
                allowClassStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class A {\n/**\n* hi\n */\nconstructor() {}\n}",
            options: [{
                allowBlockStart: false,
                allowClassStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch ('foo'){\ncase 'foo':\n/* block comment at switch case start */\nbreak;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\n\n/* block comment at switch case start */\nbreak;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n/* block comment at switch case start */\nbreak;\n}",
            options: [{
                allowBlockStart: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n\n/* block comment at switch case start */\nbreak;\n}",
            options: [{
                allowBlockStart: true
            }]
        },

        // check for block end comments
        {
            code: "var a,\n// line\n\nb;",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 91;\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 61;\n\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "var foo = function(){\nvar g = 1;\n\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n\n// line at block end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n// line at switch case end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n// line at switch case end\n\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n// line at switch case end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n// line at switch case end\n\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                afterLineComment: true,
                beforeLineComment: true,
                allowBlockStart: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }]
        },
        {
            code: "function foo(){   \nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "function foo(){\nvar g = 1;\n/* block comment at block end */}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "var foo = function(){\nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n/* block comment at block end */\n}",
            options: [{
                beforeBlockComment: false,
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "if(true){\nvar g = 1;\n\n/* block comment at block end */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "while(true){\n\nvar g = 1;\n\n/* \nblock comment at block end\n */}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "class B {\nconstructor() {}\n\n/**\n* hi\n */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class B {\nconstructor() {}\n\n/**\n* hi\n */\n}",
            options: [{
                afterBlockComment: true,
                allowClassEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "class B {\nconstructor() {}\n\n/**\n* hi\n */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: false,
                allowClassEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n/* block comment at switch case end */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n/* block comment at switch case end */\n\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n/* block comment at switch case end */\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n/* block comment at switch case end */\n\n}",
            options: [{
                afterBlockComment: true,
                allowBlockEnd: true
            }]
        },

        // check for object start comments
        {
            code:
            "var a,\n\n" +
            "// line\n" +
            "b;",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }]
        },
        {
            code:
            "var obj = {\n" +
            "  // line at object start\n" +
            "  g: 1\n" +
            "};",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    // hi\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }]
        },
        {
            code:
            "var obj = {\n" +
            "  /* block comment at object start*/\n" +
            "  g: 1\n" +
            "};",
            options: [{
                beforeBlockComment: true,
                allowObjectStart: true
            }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }]
        },
        {
            code:
            "const {\n" +
            "  // line at object start\n" +
            "  g: a\n" +
            "} = {};",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  // line at object start\n" +
            "  g\n" +
            "} = {};",
            options: [{
                beforeLineComment: true,
                allowObjectStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  /* block comment at object-like start*/\n" +
            "  g: a\n" +
            "} = {};",
            options: [{
                beforeBlockComment: true,
                allowObjectStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  /* block comment at object-like start*/\n" +
            "  g\n" +
            "} = {};",
            options: [{
                beforeBlockComment: true,
                allowObjectStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },

        // check for object end comments
        {
            code:
            "var a,\n" +
            "// line\n\n" +
            "b;",
            options: [{
                afterLineComment: true,
                allowObjectEnd: true
            }]
        },
        {
            code:
            "var obj = {\n" +
            "  g: 1\n" +
            "  // line at object end\n" +
            "};",
            options: [{
                afterLineComment: true,
                allowObjectEnd: true
            }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    // hi\n" +
            "  }\n" +
            "}",
            options: [{
                afterLineComment: true,
                allowObjectEnd: true
            }]
        },
        {
            code:
            "var obj = {\n" +
            "  g: 1\n" +
            "  \n" +
            "  /* block comment at object end*/\n" +
            "};",
            options: [{
                afterBlockComment: true,
                allowObjectEnd: true
            }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    \n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "  }\n" +
            "}",
            options: [{
                afterBlockComment: true,
                allowObjectEnd: true
            }]
        },
        {
            code:
            "const {\n" +
            "  g: a\n" +
            "  // line at object end\n" +
            "} = {};",
            options: [{
                afterLineComment: true,
                allowObjectEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  g\n" +
            "  // line at object end\n" +
            "} = {};",
            options: [{
                afterLineComment: true,
                allowObjectEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  g: a\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "} = {};",
            options: [{
                afterBlockComment: true,
                allowObjectEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const {\n" +
            "  g\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "} = {};",
            options: [{
                afterBlockComment: true,
                allowObjectEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },

        // check for array start comments
        {
            code:
            "var a,\n\n" +
            "// line\n" +
            "b;",
            options: [{
                beforeLineComment: true,
                allowArrayStart: true
            }]
        },
        {
            code:
            "var arr = [\n" +
            "  // line at array start\n" +
            "  1\n" +
            "];",
            options: [{
                beforeLineComment: true,
                allowArrayStart: true
            }]
        },
        {
            code:
            "var arr = [\n" +
            "  /* block comment at array start*/\n" +
            "  1\n" +
            "];",
            options: [{
                beforeBlockComment: true,
                allowArrayStart: true
            }]
        },
        {
            code:
            "const [\n" +
            "  // line at array start\n" +
            "  a\n" +
            "] = [];",
            options: [{
                beforeLineComment: true,
                allowArrayStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const [\n" +
            "  /* block comment at array start*/\n" +
            "  a\n" +
            "] = [];",
            options: [{
                beforeBlockComment: true,
                allowArrayStart: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },

        // check for array end comments
        {
            code:
            "var a,\n" +
            "// line\n\n" +
            "b;",
            options: [{
                afterLineComment: true,
                allowArrayEnd: true
            }]
        },
        {
            code:
            "var arr = [\n" +
            "  1\n" +
            "  // line at array end\n" +
            "];",
            options: [{
                afterLineComment: true,
                allowArrayEnd: true
            }]
        },
        {
            code:
            "var arr = [\n" +
            "  1\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "];",
            options: [{
                afterBlockComment: true,
                allowArrayEnd: true
            }]
        },
        {
            code:
            "const [\n" +
            "  a\n" +
            "  // line at array end\n" +
            "] = [];",
            options: [{
                afterLineComment: true,
                allowArrayEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code:
            "const [\n" +
            "  a\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "] = [];",
            options: [{
                afterBlockComment: true,
                allowArrayEnd: true
            }],
            parserOptions: { ecmaVersion: 6 }
        },

        // ignorePattern
        {
            code:
            "foo;\n\n" +
            "/* eslint-disable no-underscore-dangle */\n\n" +
            "this._values = values;\n" +
            "this._values2 = true;\n" +
            "/* eslint-enable no-underscore-dangle */\n" +
            "bar",
            options: [{
                beforeBlockComment: true,
                afterBlockComment: true
            }]
        },
        "foo;\n/* eslint */",
        "foo;\n/* jshint */",
        "foo;\n/* jslint */",
        "foo;\n/* istanbul */",
        "foo;\n/* global */",
        "foo;\n/* globals */",
        "foo;\n/* exported */",
        "foo;\n/* jscs */",
        {
            code: "foo\n/* this is pragmatic */",
            options: [{ ignorePattern: "pragma" }]
        },
        {
            code: "foo\n/* this is pragmatic */",
            options: [{ applyDefaultIgnorePatterns: false, ignorePattern: "pragma" }]
        }
    ],

    invalid: [

        // default rules
        {
            code: "bar()\n/** block block block\n * block \n */\nvar a = 1;",
            output: "bar()\n\n/** block block block\n * block \n */\nvar a = 1;",
            errors: [{ messageId: "before", type: "Block" }]
        },

        // line comments
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            output: "baz()\n// A line comment with no empty line after\n\nvar a = 1;",
            options: [{ afterLineComment: true }],
            errors: [{ messageId: "after", type: "Line" }]
        },
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            output: "baz()\n\n// A line comment with no empty line after\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: false }],
            errors: [{ messageId: "before", type: "Line" }]
        },
        {
            code: "// A line comment with no empty line after\nvar a = 1;",
            output: "// A line comment with no empty line after\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }],
            errors: [{ messageId: "after", type: "Line", line: 1, column: 1 }]
        },
        {
            code: "baz()\n// A line comment with no empty line after\nvar a = 1;",
            output: "baz()\n\n// A line comment with no empty line after\n\nvar a = 1;",
            options: [{ beforeLineComment: true, afterLineComment: true }],
            errors: [{ messageId: "before", type: "Line", line: 2 }, { messageId: "after", type: "Line", line: 2 }]
        },

        // block comments
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            output: "bar()\n\n/**\n * block block block\n */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }],
            errors: [{ messageId: "before", type: "Block", line: 2 }, { messageId: "after", type: "Block", line: 2 }]
        },
        {
            code: "bar()\n/* first block comment */ /* second block comment */\nvar a = 1;",
            output: "bar()\n\n/* first block comment */ /* second block comment */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }],
            errors: [
                { messageId: "before", type: "Block", line: 2 },
                { messageId: "after", type: "Block", line: 2 }
            ]
        },
        {
            code: "bar()\n/* first block comment */ /* second block\n comment */\nvar a = 1;",
            output: "bar()\n\n/* first block comment */ /* second block\n comment */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: true }],
            errors: [
                { messageId: "before", type: "Block", line: 2 },
                { messageId: "after", type: "Block", line: 2 }
            ]
        },
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            output: "bar()\n/**\n * block block block\n */\n\nvar a = 1;",
            options: [{ afterBlockComment: true, beforeBlockComment: false }],
            errors: [{ messageId: "after", type: "Block", line: 2 }]
        },
        {
            code: "bar()\n/**\n * block block block\n */\nvar a = 1;",
            output: "bar()\n\n/**\n * block block block\n */\nvar a = 1;",
            options: [{ afterBlockComment: false, beforeBlockComment: true }],
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },
        {
            code: "var a,\n// line\nb;",
            output: "var a,\n\n// line\nb;",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code: "function foo(){\nvar a = 1;\n// line at block start\nvar g = 1;\n}",
            output: "function foo(){\nvar a = 1;\n\n// line at block start\nvar g = 1;\n}",
            options: [{
                beforeLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 3 }]
        },
        {
            code: "var a,\n// line\nb;",
            output: "var a,\n// line\n\nb;",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 2 }]
        },
        {
            code: "function foo(){\nvar a = 1;\n\n// line at block start\nvar g = 1;\n}",
            output: "function foo(){\nvar a = 1;\n\n// line at block start\n\nvar g = 1;\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 4 }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\n// line at switch case start\nbreak;\n}",
            output: "switch ('foo'){\ncase 'foo':\n\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 3 }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n// line at switch case start\nbreak;\n}",
            output: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\n\n// line at switch case start\nbreak;\n}",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 6 }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            output: "while(true){\n// line at block start and end\n\n}",
            options: [{
                afterLineComment: true,
                allowBlockStart: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 2 }]
        },
        {
            code: "while(true){\n// line at block start and end\n}",
            output: "while(true){\n\n// line at block start and end\n}",
            options: [{
                beforeLineComment: true,
                allowBlockEnd: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code: "class A {\n// line at class start\nconstructor() {}\n}",
            output: "class A {\n\n// line at class start\nconstructor() {}\n}",
            options: [{
                beforeLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code: "class A {\n// line at class start\nconstructor() {}\n}",
            output: "class A {\n\n// line at class start\nconstructor() {}\n}",
            options: [{
                allowBlockStart: true,
                allowClassStart: false,
                beforeLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code: "class B {\nconstructor() {}\n\n// line at class end\n}",
            output: "class B {\nconstructor() {}\n\n// line at class end\n\n}",
            options: [{
                afterLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Line", line: 4 }]
        },
        {
            code: "class B {\nconstructor() {}\n\n// line at class end\n}",
            output: "class B {\nconstructor() {}\n\n// line at class end\n\n}",
            options: [{
                afterLineComment: true,
                allowBlockEnd: true,
                allowClassEnd: false
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Line", line: 4 }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n// line at switch case end\n}",
            output: "switch ('foo'){\ncase 'foo':\nvar g = 1;\n\n// line at switch case end\n\n}",
            options: [{
                afterLineComment: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 5 }]
        },
        {
            code: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n// line at switch case end\n}",
            output: "switch ('foo'){\ncase 'foo':\nbreak;\n\ndefault:\nvar g = 1;\n\n// line at switch case end\n\n}",
            options: [{
                afterLineComment: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 8 }]
        },

        // object start comments
        {
            code:
            "var obj = {\n" +
            "  // line at object start\n" +
            "  g: 1\n" +
            "};",
            output:
            "var obj = {\n" +
            "\n" +
            "  // line at object start\n" +
            "  g: 1\n" +
            "};",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    // hi\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            output:
            "function hi() {\n" +
            "  return {\n" +
            "\n" +
            "    // hi\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 3 }]
        },
        {
            code:
            "var obj = {\n" +
            "  /* block comment at object start*/\n" +
            "  g: 1\n" +
            "};",
            output:
            "var obj = {\n" +
            "\n" +
            "  /* block comment at object start*/\n" +
            "  g: 1\n" +
            "};",
            options: [{
                beforeBlockComment: true
            }],
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            output:
            "function hi() {\n" +
            "  return {\n" +
            "\n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "    test: function() {\n" +
            "    }\n" +
            "  }\n" +
            "}",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Block", line: 3 }]
        },
        {
            code:
            "const {\n" +
            "  // line at object start\n" +
            "  g: a\n" +
            "} = {};",
            output:
            "const {\n" +
            "\n" +
            "  // line at object start\n" +
            "  g: a\n" +
            "} = {};",
            options: [{
                beforeLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code:
            "const {\n" +
            "  // line at object start\n" +
            "  g\n" +
            "} = {};",
            output:
            "const {\n" +
            "\n" +
            "  // line at object start\n" +
            "  g\n" +
            "} = {};",
            options: [{
                beforeLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code:
            "const {\n" +
            "  /* block comment at object-like start*/\n" +
            "  g: a\n" +
            "} = {};",
            output:
            "const {\n" +
            "\n" +
            "  /* block comment at object-like start*/\n" +
            "  g: a\n" +
            "} = {};",
            options: [{
                beforeBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },
        {
            code:
            "const {\n" +
            "  /* block comment at object-like start*/\n" +
            "  g\n" +
            "} = {};",
            output:
            "const {\n" +
            "\n" +
            "  /* block comment at object-like start*/\n" +
            "  g\n" +
            "} = {};",
            options: [{
                beforeBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },

        // object end comments
        {
            code:
            "var obj = {\n" +
            "  g: 1\n" +
            "  // line at object end\n" +
            "};",
            output:
            "var obj = {\n" +
            "  g: 1\n" +
            "  // line at object end\n" +
            "\n" +
            "};",
            options: [{
                afterLineComment: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 3 }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    // hi\n" +
            "  }\n" +
            "}",
            output:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    // hi\n" +
            "\n" +
            "  }\n" +
            "}",
            options: [{
                afterLineComment: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 5 }]
        },
        {
            code:
            "var obj = {\n" +
            "  g: 1\n" +
            "  \n" +
            "  /* block comment at object end*/\n" +
            "};",
            output:
            "var obj = {\n" +
            "  g: 1\n" +
            "  \n" +
            "  /* block comment at object end*/\n" +
            "\n" +
            "};",
            options: [{
                afterBlockComment: true
            }],
            errors: [{ messageId: "after", type: "Block", line: 4 }]
        },
        {
            code:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    \n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "  }\n" +
            "}",
            output:
            "function hi() {\n" +
            "  return {\n" +
            "    test: function() {\n" +
            "    }\n" +
            "    \n" +
            "    /**\n" +
            "    * hi\n" +
            "    */\n" +
            "\n" +
            "  }\n" +
            "}",
            options: [{
                afterBlockComment: true
            }],
            errors: [{ messageId: "after", type: "Block", line: 6 }]
        },
        {
            code:
            "const {\n" +
            "  g: a\n" +
            "  // line at object end\n" +
            "} = {};",
            output:
            "const {\n" +
            "  g: a\n" +
            "  // line at object end\n" +
            "\n" +
            "} = {};",
            options: [{
                afterLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Line", line: 3 }]
        },
        {
            code:
            "const {\n" +
            "  g\n" +
            "  // line at object end\n" +
            "} = {};",
            output:
            "const {\n" +
            "  g\n" +
            "  // line at object end\n" +
            "\n" +
            "} = {};",
            options: [{
                afterLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Line", line: 3 }]
        },
        {
            code:
            "const {\n" +
            "  g: a\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "} = {};",
            output:
            "const {\n" +
            "  g: a\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "\n" +
            "} = {};",
            options: [{
                afterBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Block", line: 4 }]
        },
        {
            code:
            "const {\n" +
            "  g\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "} = {};",
            output:
            "const {\n" +
            "  g\n" +
            "  \n" +
            "  /* block comment at object-like end*/\n" +
            "\n" +
            "} = {};",
            options: [{
                afterBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Block", line: 4 }]
        },

        // array start comments
        {
            code:
            "var arr = [\n" +
            "  // line at array start\n" +
            "  1\n" +
            "];",
            output:
            "var arr = [\n" +
            "\n" +
            "  // line at array start\n" +
            "  1\n" +
            "];",
            options: [{
                beforeLineComment: true
            }],
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code:
            "var arr = [\n" +
            "  /* block comment at array start*/\n" +
            "  1\n" +
            "];",
            output:
            "var arr = [\n" +
            "\n" +
            "  /* block comment at array start*/\n" +
            "  1\n" +
            "];",
            options: [{
                beforeBlockComment: true
            }],
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },
        {
            code:
            "const [\n" +
            "  // line at array start\n" +
            "  a\n" +
            "] = [];",
            output:
            "const [\n" +
            "\n" +
            "  // line at array start\n" +
            "  a\n" +
            "] = [];",
            options: [{
                beforeLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Line", line: 2 }]
        },
        {
            code:
            "const [\n" +
            "  /* block comment at array start*/\n" +
            "  a\n" +
            "] = [];",
            output:
            "const [\n" +
            "\n" +
            "  /* block comment at array start*/\n" +
            "  a\n" +
            "] = [];",
            options: [{
                beforeBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "before", type: "Block", line: 2 }]
        },

        // array end comments
        {
            code:
            "var arr = [\n" +
            "  1\n" +
            "  // line at array end\n" +
            "];",
            output:
            "var arr = [\n" +
            "  1\n" +
            "  // line at array end\n" +
            "\n" +
            "];",
            options: [{
                afterLineComment: true
            }],
            errors: [{ messageId: "after", type: "Line", line: 3 }]
        },
        {
            code:
            "var arr = [\n" +
            "  1\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "];",
            output:
            "var arr = [\n" +
            "  1\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "\n" +
            "];",
            options: [{
                afterBlockComment: true
            }],
            errors: [{ messageId: "after", type: "Block", line: 4 }]
        },
        {
            code:
            "const [\n" +
            "  a\n" +
            "  // line at array end\n" +
            "] = [];",
            output:
            "const [\n" +
            "  a\n" +
            "  // line at array end\n" +
            "\n" +
            "] = [];",
            options: [{
                afterLineComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Line", line: 3 }]
        },
        {
            code:
            "const [\n" +
            "  a\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "] = [];",
            output:
            "const [\n" +
            "  a\n" +
            "  \n" +
            "  /* block comment at array end*/\n" +
            "\n" +
            "] = [];",
            options: [{
                afterBlockComment: true
            }],
            parserOptions: { ecmaVersion: 6 },
            errors: [{ messageId: "after", type: "Block", line: 4 }]
        },

        // ignorePattern
        {
            code:
            "foo;\n\n" +
            "/* eslint-disable no-underscore-dangle */\n\n" +
            "this._values = values;\n" +
            "this._values2 = true;\n" +
            "/* eslint-enable no-underscore-dangle */\n" +
            "bar",
            output:
            "foo;\n\n" +
            "/* eslint-disable no-underscore-dangle */\n\n" +
            "this._values = values;\n" +
            "this._values2 = true;\n" +
            "\n" +
            "/* eslint-enable no-underscore-dangle */\n" +
            "\n" +
            "bar",
            options: [{
                beforeBlockComment: true,
                afterBlockComment: true,
                applyDefaultIgnorePatterns: false
            }],
            errors: [
                { messageId: "before", type: "Block", line: 7 },
                { messageId: "after", type: "Block", line: 7 }
            ]
        },
        {
            code: "foo;\n/* eslint */",
            output: "foo;\n\n/* eslint */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* jshint */",
            output: "foo;\n\n/* jshint */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* jslint */",
            output: "foo;\n\n/* jslint */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* istanbul */",
            output: "foo;\n\n/* istanbul */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* global */",
            output: "foo;\n\n/* global */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* globals */",
            output: "foo;\n\n/* globals */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* exported */",
            output: "foo;\n\n/* exported */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo;\n/* jscs */",
            output: "foo;\n\n/* jscs */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo\n/* something else */",
            output: "foo\n\n/* something else */",
            options: [{ ignorePattern: "pragma" }],
            errors: [{ messageId: "before", type: "Block" }]
        },
        {
            code: "foo\n/* eslint */",
            output: "foo\n\n/* eslint */",
            options: [{ applyDefaultIgnorePatterns: false }],
            errors: [{ messageId: "before", type: "Block" }]
        },

        // "fallthrough" patterns are not ignored by default
        {
            code: "foo;\n/* fallthrough */",
            output: "foo;\n\n/* fallthrough */",
            options: [],
            errors: [{ messageId: "before", type: "Block" }]
        }
    ]

});
