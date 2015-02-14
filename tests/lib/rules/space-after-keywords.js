/**
 * @fileoverview Rule to enforce the number of spaces after certain keywords
 * @author Nick Fisher
 * @copyright 2014 Nick Fisher. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/space-after-keywords", {
    valid: [
        { code: "switch (a){ default: break; }", args: [1] },
        { code: "if (a) {}", args: [1] },
        { code: "if (a) {} else {}", args: [1] },
        { code: "for (;;){}", args: [1] },
        { code: "while (true) {}", args: [1]},
        { code: "do {} while (0)", args: [1]},
        { code: "do ;while (0)", args: [1]},
        { code: "do; while(0)", args: [1, "never"]},
        { code: "try {} catch (e) {}", args: [1]},
        { code: "with (a) {}", args: [1]},
        { code: "if(a) {}", args: [1, "never"]},
        { code: "if(a){}else{}", args: [1, "never"]},
        { code: "if(a){}else if(b){}else{}", args: [1, "never"]},
        { code: "try {}finally {}", args: [1]},
        { code: "try{} finally{}", args: [1, "never"]},
        { code: "(function (){})", args: [1] },
        { code: "(function(){})", args: [1] }
    ],
    invalid: [
        { code: "if (a) {} else if(b){}", args: [1], errors: [{ message: "Keyword \"if\" must be followed by whitespace.", type: "IfStatement" }] },
        { code: "if (a) {} else{}", args: [1], errors: [{ message: "Keyword \"else\" must be followed by whitespace." }] },
        { code: "switch(a){ default: break; }", errors: [{ message: "Keyword \"switch\" must be followed by whitespace.", type: "SwitchStatement" }] },
        { code: "if(a){}", errors: [{ message: "Keyword \"if\" must be followed by whitespace.", type: "IfStatement" }] },
        { code: "do{} while (0)", args: [1], errors: [{ message: "Keyword \"do\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do ;while(0)", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do;while (0)", args: [1, "never"], errors: [{ message: "Keyword \"while\" must not be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "if (a) {}", args: [1, "never"], errors: [{ message: "Keyword \"if\" must not be followed by whitespace.", type: "IfStatement" }]},
        { code: "if(a){}else {}", args: [1, "never"], errors: [{ message: "Keyword \"else\" must not be followed by whitespace." }]},
        { code: "if(a){}else if(b){}else {}", args: [1, "never"], errors: [{ message: "Keyword \"else\" must not be followed by whitespace." }]},
        { code: "try{}finally {}", args: [1], errors: [{ message: "Keyword \"try\" must be followed by whitespace." }]},
        { code: "try {}finally{}", args: [1], errors: [{ message: "Keyword \"finally\" must be followed by whitespace." }]},
        { code: "try{}finally {}", args: [1, "never"], errors: [{ message: "Keyword \"finally\" must not be followed by whitespace." }]},
        { code: "try {}finally{}", args: [1, "never"], errors: [{ message: "Keyword \"try\" must not be followed by whitespace." }]}
    ]
});
