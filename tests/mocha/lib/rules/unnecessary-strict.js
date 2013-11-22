/**
 * @fileoverview Tests unnecessary-strict.
 * @author Ian Christian Myers
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require("../../../../lib/tests/eslintTester");

eslintTester.add("unnecessary-strict", {
    valid: [
        "\"use strict\"; function foo() { var bar = true; }",
        "'use strict'; function foo() { var bar = true; }",
        "function foo() { \"use strict\"; var bar = true; }",
        "function foo() { 'use strict'; var bar = true; }"
           ],
    invalid: [
        { code: "\"use strict\"; function foo() { \"use strict\"; var bar = true; }",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "'use strict'; function foo() { 'use strict'; var bar = true; }",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "\"use strict\"; (function foo() { function bar () { \"use strict\"; } }());",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] },
        { code: "'use strict'; (function foo() { function bar () { 'use strict'; } }());",
          errors: [{ message: "Unnecessary 'use strict'.", type: "Literal"}] }
    ]
});
