/**
 * @fileoverview Tests for the no-mixed-requires rule.
 * @author Raphael Pigulla
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-mixed-requires"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-mixed-requires", rule, {
    valid: [
        { code: "var a, b = 42, c = doStuff()", options: [false] },
        { code: "var a = require(42), b = require(), c = require('y'), d = require(doStuff())", options: [false] },
        { code: "var fs = require('fs'), foo = require('foo')", options: [false] },
        { code: "var exec = require('child_process').exec, foo = require('foo')", options: [false] },
        { code: "var fs = require('fs'), foo = require('./foo')", options: [false] },
        { code: "var foo = require('foo'), foo2 = require('./foo')", options: [false] },
        { code: "var emitter = require('events').EventEmitter, fs = require('fs')", options: [false] },
        { code: "var foo = require(42), bar = require(getName())", options: [false] },
        { code: "var foo = require(42), bar = require(getName())", options: [true] },
        { code: "var fs = require('fs'), foo = require('./foo')", options: [{ grouping: false }] },
        { code: "var foo = require('foo'), bar = require(getName())", options: [false] },
        { code: "var a;", options: [true] },
        { code: "var async = require('async'), debug = require('diagnostics')('my-module')", options: [{ allowCall: true }] }
    ],
    invalid: [
        { code: "var fs = require('fs'), foo = 42", options: [false], errors: [{ message: "Do not mix 'require' and other declarations.", type: "VariableDeclaration" }] },
        { code: "var fs = require('fs'), foo", options: [false], errors: [{ message: "Do not mix 'require' and other declarations.", type: "VariableDeclaration" }] },
        { code: "var a = require(42), b = require(), c = require('y'), d = require(doStuff())", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var fs = require('fs'), foo = require('foo')", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var fs = require('fs'), foo = require('foo')", options: [{ grouping: true }], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var exec = require('child_process').exec, foo = require('foo')", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var fs = require('fs'), foo = require('./foo')", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var foo = require('foo'), foo2 = require('./foo')", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var foo = require('foo'), bar = require(getName())", options: [true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration" }] },
        { code: "var async = require('async'), debug = require('diagnostics').someFun('my-module')", options: [{ allowCall: true }], errors: [{ message: "Do not mix 'require' and other declarations.", type: "VariableDeclaration" }] }
    ]
});
