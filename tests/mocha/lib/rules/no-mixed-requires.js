/**
 * @fileoverview Tests for the no-mixed-requires rule.
 * @author Raphael Pigulla
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.add("no-mixed-requires", {
    valid: [
        { code: "var a, b = 42, c = doStuff()", args: [1, false] },
        { code: "var a = require(42), b = require(), c = require('y'), d = require(doStuff())", args: [1, false] },
        { code: "var fs = require('fs'), foo = require('foo')", args: [1, false] },
        { code: "var exec = require('child_process').exec, foo = require('foo')", args: [1, false] },
        { code: "var fs = require('fs'), foo = require('./foo')", args: [1, false] },
        { code: "var foo = require('foo'), foo2 = require('./foo')", args: [1, false] },
        { code: "var emitter = require('events').EventEmitter, fs = require('fs')", args: [1, false] },
        { code: "var foo = require(42), bar = require(getName())", args: [1, false] },
        { code: "var foo = require(42), bar = require(getName())", args: [1, true] },
        { code: "var foo = require('foo'), bar = require(getName())", args: [1, false] }

    ],
    invalid: [
        { code: "var fs = require('fs'), foo = 42", args: [1, false], errors: [{ message: "Do not mix 'require' and other declarations.", type: "VariableDeclaration"}] },
        { code: "var fs = require('fs'), foo", args: [1, false], errors: [{ message: "Do not mix 'require' and other declarations.", type: "VariableDeclaration"}] },
        { code: "var a = require(42), b = require(), c = require('y'), d = require(doStuff())", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] },
        { code: "var fs = require('fs'), foo = require('foo')", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] },
        { code: "var exec = require('child_process').exec, foo = require('foo')", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] },
        { code: "var fs = require('fs'), foo = require('./foo')", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] },
        { code: "var foo = require('foo'), foo2 = require('./foo')", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] },
        { code: "var foo = require('foo'), bar = require(getName())", args: [1, true], errors: [{ message: "Do not mix core, module, file and computed requires.", type: "VariableDeclaration"}] }
    ]
});
