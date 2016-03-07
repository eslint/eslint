/**
 * @fileoverview Tests for require newline before `return` statement
 * @author Kai Cataldo
 * @copyright 2016 Kai Cataldo. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/newline-before-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run("newline-before-return", rule, {
    valid: [
        "function a() {\nreturn;\n}",
        "function a() {\nvar b;\n\nreturn;\n}",
        "function a() {\nif (b) return;\n}",
        "function a() {\nif (b) { return; }\n}",
        "function a() {\nif (b) {\nreturn;\n}\n}",
        "function a() {\nif (b) {\nreturn;\n}\n\nreturn c;\n}",
        "function a() {\nif (!b) {\nreturn;\n} else {\nreturn b;\n}\n}",
        "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n}\n}",
        "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n}",
        "function a() {\nif (b) {\nreturn b;\n} else if (c) {\nreturn c;\n} else {\nreturn d;\n}\n\nreturn a;\n}",
        "function a() {\nif (b) return b;\nelse if (c) return c;\nelse return d;\n}",
        "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\nreturn d;\n}\n}",
        "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
        "function a() {\nwhile (b) return;\n}",
        "function a() {\n while (b) \nreturn;\n}",
        "function a() {\n while (b) { return; }\n}",
        "function a() {\n while (b) {\nreturn;\n}\n}",
        "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
        "function a() {\ndo return;\nwhile (b);\n}",
        "function a() {\ndo \nreturn;\nwhile (b);\n}",
        "function a() {\ndo { return; } while (b);\n}",
        "function a() {\ndo { return; }\nwhile (b);\n}",
        "function a() {\ndo {\nreturn;\n} while (b);\n}",
        "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
        "function a() {\nfor (var b; b < c; b++) return;\n}",
        "function a() {\nfor (var b; b < c; b++)\nreturn;\n}",
        "function a() {\nfor (var b; b < c; b++) {\nreturn;\n}\n}",
        "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
        "function a() {\nfor (b in c)\nreturn;\n}",
        "function a() {\nfor (b in c) { return; }\n}",
        "function a() {\nfor (b in c) {\nreturn;\n}\n}",
        "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
        "function a() {\nvar b = {\n//comment\n};\n\nreturn;\n}",
        {
            code: "function a() {\nfor (b of c) return;\n}",
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function a() {\nfor (b of c)\nreturn;\n}",
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function a() {\nfor (b of c) {\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 }
        }, {
            code: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 }
        },
        "function a() {\nswitch (b) {\ncase 'b': return;\n}\n}",
        "function a() {\nswitch (b) {\ncase 'b':\nreturn;\n}\n}",
        "function a() {\nswitch (b) {\ncase 'b': {\nreturn;\n}\n}\n}",
        "function a() {\n//comment\nreturn b;\n}",
        "function a() {/*multi-line\ncomment*/return b;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nreturn b;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nif (b) return;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
        "function a() {\nif (b) { //comment\nreturn;\n}\n\nreturn c;\n}",
        "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
        "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
        "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}"
    ],

    invalid: [
        {
            code: "function a() {\n\nreturn;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nvar b;\nreturn;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\n\nreturn;\n}\nreturn c;\n}",
            errors: ["Unexpected newline before return statement.", "Expected newline before return statement."]
        }, {
            code: "function a() {\nif (!b) {\nreturn;\n} else {\n\nreturn b;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\n\nreturn c;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\nreturn b;\n} else if (c) {\n\nreturn c;\n} else {\n\nreturn d;\n}\n}",
            errors: ["Unexpected newline before return statement.", "Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\n\nreturn b;\n} else {\nreturn d;\n}\nreturn a;\n}",
            errors: ["Unexpected newline before return statement.", "Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\n\nreturn d;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\nreturn d;\n}\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\n while (b) \n\nreturn;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\n while (b) {\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\n while (b) {\nc();\nreturn;\n}\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\ndo \n\nreturn;\nwhile (b);\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\ndo {\n\nreturn;\n} while (b);\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\ndo {\nc();\nreturn;\n} while (b);\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nfor (var b; b < c; b++)\n\nreturn;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (var b; b < c; b++) {\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\nreturn;\n}\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nfor (b in c)\n\nreturn;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (b in c) {\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (b in c) {\nd();\nreturn;\n}\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nfor (b of c)\n\nreturn;\n}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (b of c) {\n\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nfor (b of c) {\nd();\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 },
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nswitch (b) {\ncase 'b':\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nswitch (b) {\ncase 'b': {\n\nreturn;\n}\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\n//comment\n\nreturn b;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\n/*comment\ncomment*/\n//comment\n\nreturn b;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\n//comment\nif (b) {\n/*comment\ncomment*/\n\nreturn;\n}\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}",
            errors: ["Expected newline before return statement.", "Unexpected newline before return statement.", "Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) { //comment\n\nreturn;\n}\n\nreturn c;\n}",
            errors: ["Unexpected newline before return statement."]
        }, {
            code: "function a() {\nif (b) { return; } //comment\nreturn c;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\nreturn c;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) { return; }\n/*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected newline before return statement."]
        }, {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/ return c;\n}",
            errors: ["Expected newline before return statement."]
        }
    ]
});
