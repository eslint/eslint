/**
 * @fileoverview Rule to enforce the number of spaces after certain keywords
 * @author Nick Fisher
 * @copyright 2014 Nick Fisher. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/space-after-keywords"),
    RuleTester = require("../../../lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("space-after-keywords", rule, {
    valid: [
        { code: "switch (a){ default: break; }", args: [1] },
        { code: "if (a) {}", args: [1] },
        { code: "if (a) {} else {}", args: [1] },
        { code: "for (;;){}", args: [1] },
        { code: "while (true) {}", args: [1]},
        { code: "do {} while (0)", args: [1]},
        { code: "do ;while (0)", args: [1]},
        { code: "do ;while ((0))", args: [1]},
        { code: "do (a);while ((0))", args: [1]},
        { code: "do (a)\nwhile ((0))", args: [1]},
        { code: "do ((a))\nwhile ((0))", args: [1]},
        { code: "do; while(0)", options: ["never"]},
        { code: "try {} catch (e) {}", args: [1]},
        { code: "with (a) {}", args: [1]},
        { code: "if(a) {}", options: ["never"]},
        { code: "if(a){}else{}", options: ["never"]},
        { code: "if(a){}else if(b){}else{}", options: ["never"]},
        { code: "if (a) {} else\nfoo();", options: ["always"]},
        { code: "if(a) {} else\nfoo();", options: ["never"]},
        { code: "if (a) {} else foo();", options: ["always"]},
        { code: "if(a) {} else foo();", options: ["never"]},
        { code: "try {}finally {}", args: [1]},
        { code: "try{} finally{}", options: ["never"]},
        { code: "(function(){})", args: [1] },
        { code: "(function(){})", args: [1] }
    ],
    invalid: [
        { code: "if (a) {} else if(b){}", args: [1], errors: [{ message: "Keyword \"if\" must be followed by whitespace.", type: "IfStatement" }] },
        { code: "if (a) {} else{}", args: [1], errors: [{ message: "Keyword \"else\" must be followed by whitespace." }] },
        { code: "switch(a){ default: break; }", errors: [{ message: "Keyword \"switch\" must be followed by whitespace.", type: "SwitchStatement" }] },
        { code: "if(a){}", errors: [{ message: "Keyword \"if\" must be followed by whitespace.", type: "IfStatement" }] },
        { code: "do{} while (0)", args: [1], errors: [{ message: "Keyword \"do\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do ;while(0)", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do ;while((0))", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do (a);while((0))", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do (a)\nwhile((0))", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do ((a))\nwhile((0))", args: [1], errors: [{ message: "Keyword \"while\" must be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "do;while (0)", options: ["never"], errors: [{ message: "Keyword \"while\" must not be followed by whitespace.", type: "DoWhileStatement" }]},
        { code: "if (a) {}", options: ["never"], errors: [{ message: "Keyword \"if\" must not be followed by whitespace.", type: "IfStatement" }]},
        { code: "if(a){}else {}", options: ["never"], errors: [{ message: "Keyword \"else\" must not be followed by whitespace." }]},
        { code: "if(a){}else if(b){}else {}", options: ["never"], errors: [{ message: "Keyword \"else\" must not be followed by whitespace." }]},
        { code: "try{}finally {}", args: [1], errors: [{ message: "Keyword \"try\" must be followed by whitespace." }]},
        { code: "try {}finally{}", args: [1], errors: [{ message: "Keyword \"finally\" must be followed by whitespace." }]},
        { code: "try{}finally {}", options: ["never"], errors: [{ message: "Keyword \"finally\" must not be followed by whitespace." }]},
        { code: "try {}finally{}", options: ["never"], errors: [{ message: "Keyword \"try\" must not be followed by whitespace." }]},
        { code: "if\n(a) {} else\n{}", options: ["never"], errors: [{ message: "Keyword \"if\" must not be followed by whitespace." }, { message: "Keyword \"else\" must not be followed by whitespace." }]},
        { code: "if\n(a) {} else\n{}", options: ["always"], errors: [{ message: "Keyword \"if\" must not be followed by a newline." }, { message: "Keyword \"else\" must not be followed by a newline." }]},
        { code: "do\n{} while\n(0)", options: ["always"], errors: [{ message: "Keyword \"do\" must not be followed by a newline." }, { message: "Keyword \"while\" must not be followed by a newline." }]}
    ]
});
