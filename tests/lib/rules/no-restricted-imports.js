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

const ruleTester = new RuleTester();

ruleTester.run("no-restricted-imports", rule, {
    valid: [
        { code: "import os from \"os\";", options: ["osx"], parserOptions: { sourceType: "module" } },
        { code: "import fs from \"fs\";", options: ["crypto"], parserOptions: { sourceType: "module" } },
        { code: "import path from \"path\";", options: ["crypto", "stream", "os"], parserOptions: { sourceType: "module" } },
        { code: "import async from \"async\";", parserOptions: { sourceType: "module" } },
        { code: "import \"foo\"", options: ["crypto"], parserOptions: { sourceType: "module" } },
        { code: "import \"foo/bar\";", options: ["foo"], parserOptions: { sourceType: "module" } },
        { code: "import withPaths from \"foo/bar\";", options: [{ paths: ["foo", "bar"] }], parserOptions: { sourceType: "module" } },
        { code: "import withPatterns from \"foo/bar\";", options: [{ patterns: ["foo/c*"] }], parserOptions: { sourceType: "module" } },
        {
            code: "import withPatternsAndPaths from \"foo/bar\";",
            options: [{ paths: ["foo"], patterns: ["foo/c*"] }],
            parserOptions: { sourceType: "module" }
        },
        {
            code: "import withGitignores from \"foo/bar\";",
            options: [{ patterns: ["foo/*", "!foo/bar"] }],
            parserOptions: { sourceType: "module" }
        }
    ],
    invalid: [{
        code: "import \"fs\"", options: ["fs"], parserOptions: { sourceType: "module" },
        errors: [{ message: "'fs' import is restricted from being used.", type: "ImportDeclaration"}]
    }, {
        code: "import os from \"os \";",
        options: ["fs", "crypto ", "stream", "os"],
        parserOptions: { sourceType: "module" },
        errors: [{ message: "'os' import is restricted from being used.", type: "ImportDeclaration"}]
    }, {
        code: "import \"foo/bar\";",
        options: ["foo/bar"],
        parserOptions: { sourceType: "module" },
        errors: [{ message: "'foo/bar' import is restricted from being used.", type: "ImportDeclaration"}]
    }, {
        code: "import withPaths from \"foo/bar\";",
        options: [{ paths: ["foo/bar"] }],
        parserOptions: { sourceType: "module" },
        errors: [{ message: "'foo/bar' import is restricted from being used.", type: "ImportDeclaration"}]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: ["foo/*"] }],
        parserOptions: { sourceType: "module" },
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration"}]
    }, {
        code: "import withGitignores from \"foo/bar\";",
        options: [{ patterns: ["foo/*", "!foo/baz"] }],
        parserOptions: { sourceType: "module" },
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration"}]
    }]
});
