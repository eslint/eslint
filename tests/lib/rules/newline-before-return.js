/**
 * @fileoverview Tests for require newline before `return` statement
 * @author Kai Cataldo
 * @deprecated
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/newline-before-return"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const error = { messageId: "expected" };

ruleTester.run("newline-before-return", rule, {
    valid: [
        "function a() {\nreturn;\n}",
        "function a() {\n\nreturn;\n}",
        "function a() {\nvar b;\n\nreturn;\n}",
        "function a() {\nif (b) return;\n}",
        "function a() {\nif (b) { return; }\n}",
        "function a() {\nif (b) {\nreturn;\n}\n}",
        "function a() {\nif (b) {\n\nreturn;\n}\n}",
        "function a() {\nif (b) {\nreturn;\n}\n\nreturn c;\n}",
        "function a() {\nif (b) {\n\nreturn;\n}\n\nreturn c;\n}",
        "function a() {\nif (!b) {\nreturn;\n} else {\nreturn b;\n}\n}",
        "function a() {\nif (!b) {\nreturn;\n} else {\n\nreturn b;\n}\n}",
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
        "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
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
        "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
        "function a() {\nfor (b in c)\nreturn;\n}",
        "function a() {\nfor (b in c) { return; }\n}",
        "function a() {\nfor (b in c) {\nreturn;\n}\n}",
        "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
        {
            code: "function a() {\nfor (b of c) return;\n}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function a() {\nfor (b of c)\nreturn;\n}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function a() {\nfor (b of c) {\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 }
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 }
        },
        "function a() {\nswitch (b) {\ncase 'b': return;\n}\n}",
        "function a() {\nswitch (b) {\ncase 'b':\nreturn;\n}\n}",
        "function a() {\nswitch (b) {\ncase 'b': {\nreturn;\n}\n}\n}",
        "function a() {\n//comment\nreturn b;\n}",
        "function a() {\n{\n//comment\n}\n\nreturn\n}",
        "function a() {\nvar b = {\n//comment\n};\n\nreturn;\n}",
        "function a() {/*multi-line\ncomment*/return b;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nreturn b;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nif (b) return;\n}",
        "function a() {\n/*comment\ncomment*/\n//comment\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\nreturn d;\n}\n\n/*multi-line\ncomment*/\nreturn e;\n}",
        "function a() {\nif (b) { //comment\nreturn;\n}\n\nreturn c;\n}",
        "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
        "function a() {\nif (b) { return; } /*multi-line\ncomment*/\n\nreturn c;\n}",
        "function a() {\nif (b) { return; }\n\n/*multi-line\ncomment*/ return c;\n}",
        {
            code: "return;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "var a;\n\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "// comment\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "/* comment */\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        },
        {
            code: "/* multi-line\ncomment */\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } }
        }
    ],

    invalid: [
        {
            code: "function a() {\nvar b; return;\n}",
            output: "function a() {\nvar b; \n\nreturn;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\nreturn;\n}",
            output: "function a() {\nvar b;\n\nreturn;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\nreturn d;\n}\n}",
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne();\n\nreturn d;\n}\n}",
            errors: [error]
        },
        {
            code: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne(); return d;\n}\n}",
            output: "function a() {\nif (b) return b;\nelse if (c) return c;\nelse {\ne(); \n\nreturn d;\n}\n}",
            errors: [error]
        },
        {
            code: "function a() {\n while (b) {\nc();\nreturn;\n}\n}",
            output: "function a() {\n while (b) {\nc();\n\nreturn;\n}\n}",
            errors: [error]
        },
        {
            code: "function a() {\ndo {\nc();\nreturn;\n} while (b);\n}",
            output: "function a() {\ndo {\nc();\n\nreturn;\n} while (b);\n}",
            errors: [error]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nc();\nreturn;\n}\n}",
            output: "function a() {\nfor (var b; b < c; b++) {\nc();\n\nreturn;\n}\n}",
            errors: [error]
        },
        {
            code: "function a() {\nfor (b in c) {\nd();\nreturn;\n}\n}",
            output: "function a() {\nfor (b in c) {\nd();\n\nreturn;\n}\n}",
            errors: [error]
        },
        {
            code: "function a() {\nfor (b of c) {\nd();\nreturn;\n}\n}",
            output: "function a() {\nfor (b of c) {\nd();\n\nreturn;\n}\n}",
            parserOptions: { ecmaVersion: 6 },
            errors: [error]
        },
        {
            code: "function a() {\nif (b) {\nc();\n}\n//comment\nreturn b;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}",
            output: "function a() {\n/*comment\ncomment*/\nif (b) {\nc();\n\nreturn b;\n} else {\n//comment\n\nreturn d;\n}\n/*multi-line\ncomment*/\nreturn e;\n}",
            errors: [error, error]
        },
        {
            code: "function a() {\nif (b) { return; } //comment\nreturn c;\n}",
            output: "function a() {\nif (b) { return; } //comment\n\nreturn c;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/\nreturn c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nif (b) { return; }\n/*multi-line\ncomment*/ return c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nif (b) { return; } /*multi-line\ncomment*/ return c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "var a;\nreturn;",
            output: "var a;\n\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [error]
        },
        {
            code: "var a; return;",
            output: "var a; \n\nreturn;",
            parserOptions: { ecmaFeatures: { globalReturn: true } },
            errors: [error]
        },
        {
            code: "function a() {\n{\n//comment\n}\nreturn\n}",
            output: "function a() {\n{\n//comment\n}\n\nreturn\n}",
            errors: [error]
        },
        {
            code: "function a() {\n{\n//comment\n} return\n}",
            output: "function a() {\n{\n//comment\n} \n\nreturn\n}",
            errors: [error]
        },
        {
            code: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\nreturn c;\n}",
            output: "function a() {\nvar c;\nwhile (b) {\n c = d; //comment\n}\n\nreturn c;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\nreturn;\n}\n}",
            output: "function a() {\nfor (var b; b < c; b++) {\nif (d) {\nbreak; //comment\n}\n\nreturn;\n}\n}",
            errors: [error]
        },

        /*
         * Testing edge cases of the fixer when the `return` statement has leading comments.
         * https://github.com/eslint/eslint/issues/5958
         */
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/\nreturn c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\n/*multi-line\ncomment*/ return c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b; /*multi-line\ncomment*/ return c;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\n//comment\nreturn;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b; //comment\nreturn;\n}",
            output: "function a() {\nvar b; //comment\n\nreturn;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\n/* comment */ return;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\n//comment\n/* comment */ return;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b; /* comment */ return;\n}",
            output: null,
            errors: [error]
        },
        {
            code: "function a() {\nvar b; /* comment */\nreturn;\n}",
            output: "function a() {\nvar b; /* comment */\n\nreturn;\n}",
            errors: [error]
        },
        {
            code: "function a() {\nvar b;\nreturn; //comment\n}",
            output: "function a() {\nvar b;\n\nreturn; //comment\n}",
            errors: [error]
        },
        {
            code: "function a() {\nvar b; return; //comment\n}",
            output: "function a() {\nvar b; \n\nreturn; //comment\n}",
            errors: [error]
        }
    ]
});
