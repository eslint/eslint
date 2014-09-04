/**
 * @fileoverview Tests no-extra-strict.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-extra-strict", {
    valid: [
        "\"use strict\"; function foo() { var bar = true; }",
        "'use strict'; function foo() { var bar = true; }",
        "function foo() { \"use strict\"; var bar = true; }",
        "function foo() { 'use strict'; var bar = true; }",
        "function foo() { 'use strict'; f('use strict'); }",
        "function foo() { 'use strict'; { 'use strict'; } }",
        "a = function () { 'use strict'; return true; }",
        "a = function foo() { 'use strict'; return true; }",
        "this.a = function b() { 'use strict'; return 1; };"
    ],
    invalid: [
        { code: "\"use strict\"; function foo() { \"use strict\"; var bar = true; }",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "'use strict'; function foo() { 'use strict'; var bar = true; }",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "\"use strict\"; (function foo() { function bar () { \"use strict\"; } }());",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "'use strict'; (function foo() { function bar () { 'use strict'; } }());",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "(function foo() { 'use strict'; 'use strict'; }());",
          errors: [{ message: "Multiple 'use strict' directives.", type: "Literal"}] },
        { code: "'use strict'; a = function foo() { 'use strict'; return true; }",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}]
        }

    ]
});
