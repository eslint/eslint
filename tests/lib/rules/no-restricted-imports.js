/**
 * @fileoverview Tests for no-restricted-imports.
 * @author Guy Ellis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-imports"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { sourceType: "module" } });

ruleTester.run("no-restricted-imports", rule, {
    valid: [
        { code: "import os from \"os\";", options: ["osx"] },
        { code: "import fs from \"fs\";", options: ["crypto"] },
        { code: "import path from \"path\";", options: ["crypto", "stream", "os"] },
        "import async from \"async\";",
        { code: "import \"foo\"", options: ["crypto"] },
        { code: "import \"foo/bar\";", options: ["foo"] },
        { code: "import withPaths from \"foo/bar\";", options: [{ paths: ["foo", "bar"] }] },
        { code: "import withPatterns from \"foo/bar\";", options: [{ patterns: ["foo/c*"] }] },
        {
            code: "import withPatternsAndPaths from \"foo/bar\";",
            options: [{ paths: ["foo"], patterns: ["foo/c*"] }]
        },
        {
            code: "import withGitignores from \"foo/bar\";",
            options: [{ patterns: ["foo/*", "!foo/bar"] }]
        }
    ],
    invalid: [{
        code: "import \"fs\"", options: ["fs"],
        errors: [{ message: "'fs' import is restricted from being used.", type: "ImportDeclaration" }]
    }, {
        code: "import os from \"os \";",
        options: ["fs", "crypto ", "stream", "os"],
        errors: [{ message: "'os' import is restricted from being used.", type: "ImportDeclaration" }]
    }, {
        code: "import \"foo/bar\";",
        options: ["foo/bar"],
        errors: [{ message: "'foo/bar' import is restricted from being used.", type: "ImportDeclaration" }]
    }, {
        code: "import withPaths from \"foo/bar\";",
        options: [{ paths: ["foo/bar"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used.", type: "ImportDeclaration" }]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: ["foo/*"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration" }]
    }, {
        code: "import withGitignores from \"foo/bar\";",
        options: [{ patterns: ["foo/*", "!foo/baz"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration" }]
    }]
});
