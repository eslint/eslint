/**
 * @fileoverview Tests for no-restricted-imports.
 * @author Guy Ellis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-imports"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6, sourceType: "module" } });

ruleTester.run("no-restricted-imports", rule, {
    valid: [
        "import os from \"os\";",
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
        },
        {
            code: "import AllowedObject from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"]
                }]
            }]
        },
        {
            code: "import DisallowedObject from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"]
                }]
            }]
        },
        {
            code: "import * as DisallowedObject from \"foo\";",
            options: [{
                paths: [{
                    name: "bar",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { AllowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "bar",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { AllowedObject as DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { AllowedObject, AllowedObjectTwo } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { AllowedObject, AllowedObjectTwo  as DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import AllowedObjectThree, { AllowedObject as AllowedObjectTwo } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import AllowedObject, { AllowedObjectTwo as DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import AllowedObject, { AllowedObjectTwo as DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject", "DisallowedObjectTwo"],
                    message: "Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import AllowedObject, * as DisallowedObject from \"foo\";",
            options: [{
                paths: [{
                    name: "bar",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject", "DisallowedObjectTwo"],
                    message: "Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import {\nAllowedObject,\nDisallowedObject, // eslint-disable-line\n} from \"foo\";",
            options: [{ paths: [{ name: "foo", importNames: ["DisallowedObject"] }] }]
        }
    ],
    invalid: [{
        code: "import \"fs\"",
        options: ["fs"],
        errors: [{
            message: "'fs' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 12
        }]
    }, {
        code: "import os from \"os \";",
        options: ["fs", "crypto ", "stream", "os"],
        errors: [{
            message: "'os' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 22
        }]
    }, {
        code: "import \"foo/bar\";",
        options: ["foo/bar"],
        errors: [{
            message: "'foo/bar' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 18
        }]
    }, {
        code: "import withPaths from \"foo/bar\";",
        options: [{ paths: ["foo/bar"] }],
        errors: [{
            message: "'foo/bar' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 33
        }]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: ["foo"] }],
        errors: [{
            message: "'foo/bar' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 36
        }]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: ["bar"] }],
        errors: [{
            message: "'foo/bar' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 36
        }]
    }, {
        code: "import withGitignores from \"foo/bar\";",
        options: [{ patterns: ["foo/*", "!foo/baz"] }],
        errors: [{
            message: "'foo/bar' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 38
        }]
    }, {
        code: "export * from \"fs\";",
        options: ["fs"],
        errors: [{
            message: "'fs' import is restricted from being used.",
            type: "ExportAllDeclaration",
            line: 1,
            column: 1,
            endColumn: 20
        }]
    }, {
        code: "export {a} from \"fs\";",
        options: ["fs"],
        errors: [{
            message: "'fs' import is restricted from being used.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 1,
            endColumn: 22
        }]
    }, {
        code: "export {foo as b} from \"fs\";",
        options: [{
            paths: [{
                name: "fs",
                importNames: ["foo"],
                message: "Don't import 'foo'."
            }]
        }],
        errors: [{
            message: "'foo' import from 'fs' is restricted. Don't import 'foo'.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 9,
            endColumn: 17
        }]
    }, {
        code: "import withGitignores from \"foo\";",
        options: [{
            name: "foo",
            message: "Please import from 'bar' instead."
        }],
        errors: [{
            message: "'foo' import is restricted from being used. Please import from 'bar' instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 34
        }]
    }, {
        code: "import withGitignores from \"bar\";",
        options: [
            "foo",
            {
                name: "bar",
                message: "Please import from 'baz' instead."
            },
            "baz"
        ],
        errors: [{
            message: "'bar' import is restricted from being used. Please import from 'baz' instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 34
        }]
    }, {
        code: "import withGitignores from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                message: "Please import from 'bar' instead."
            }]
        }],
        errors: [{
            message: "'foo' import is restricted from being used. Please import from 'bar' instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 34
        }]
    },
    {
        code: "import DisallowedObject from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["default"],
                message: "Please import the default import of 'foo' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'default' import from 'foo' is restricted. Please import the default import of 'foo' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 24
        }]
    },
    {
        code: "import * as All from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'DisallowedObject' from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 16
        }]
    },
    {
        code: "import { DisallowedObject } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 26
        }]
    },
    {
        code: "import { DisallowedObject as AllowedObject } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 43
        }]
    },
    {
        code: "import { AllowedObject, DisallowedObject } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 41
        }]
    },
    {
        code: "import { AllowedObject, DisallowedObject as AllowedObjectTwo } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 61
        }]
    },
    {
        code: "import { AllowedObject, DisallowedObject as AllowedObjectTwo } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObjectTwo", "DisallowedObject"],
                message: "Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 61
        }]
    },
    {
        code: "import { AllowedObject, DisallowedObject as AllowedObjectTwo } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject", "DisallowedObjectTwo"],
                message: "Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 61
        }]
    },
    {
        code: "import DisallowedObject, { AllowedObject as AllowedObjectTwo } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["default"],
                message: "Please import the default import of 'foo' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'default' import from 'foo' is restricted. Please import the default import of 'foo' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 24
        }]
    },
    {
        code: "import AllowedObject, { DisallowedObject as AllowedObjectTwo } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 61
        }]
    },
    {
        code: "import AllowedObject, * as AllowedObjectTwo from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'DisallowedObject' from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 23,
            endColumn: 44
        }]
    },
    {
        code: "import AllowedObject, * as AllowedObjectTwo from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject", "DisallowedObjectTwo"],
                message: "Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'DisallowedObject,DisallowedObjectTwo' from 'foo' is restricted. Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 23,
            endColumn: 44
        }]
    },
    {
        code: "import { DisallowedObjectOne, DisallowedObjectTwo, AllowedObject } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObjectOne", "DisallowedObjectTwo"]
            }]
        }],
        errors: [{
            message: "'DisallowedObjectOne' import from 'foo' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 29
        }, {
            message: "'DisallowedObjectTwo' import from 'foo' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 31,
            endColumn: 50
        }]
    },
    {
        code: "import { DisallowedObjectOne, DisallowedObjectTwo, AllowedObject } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObjectOne", "DisallowedObjectTwo"],
                message: "Please import this module from /bar/ instead."
            }]
        }],
        errors: [{
            message: "'DisallowedObjectOne' import from 'foo' is restricted. Please import this module from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 29
        }, {
            message: "'DisallowedObjectTwo' import from 'foo' is restricted. Please import this module from /bar/ instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 31,
            endColumn: 50
        }]
    },
    {
        code: "import { AllowedObject, DisallowedObject as Bar } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"]
            }]
        }],
        errors: [{
            message: "'DisallowedObject' import from 'foo' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 25,
            endColumn: 48
        }]
    },
    {
        code: "import foo, { bar } from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["bar"]
            }]
        }],
        errors: [{
            message: "'bar' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 15,
            endColumn: 18
        }]
    },
    {
        code: "import foo, { bar } from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["default"]
            }]
        }],
        errors: [{
            message: "'default' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 11
        }]
    },
    {
        code: "import foo, * as bar from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["default"]
            }]
        }],
        errors: [{
            message: "'default' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 11
        }, {
            message: "* import is invalid because 'default' from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 13,
            endColumn: 21
        }]
    }, {
        code: "import * as bar from 'foo';",
        options: ["foo"],
        errors: [{
            message: "'foo' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 28
        }]
    }, {
        code: "import { a, a as b } from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["a"]
            }]
        }],
        errors: [{
            message: "'a' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 11
        }, {
            message: "'a' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 13,
            endColumn: 19
        }]
    }, {
        code: "export { x as y, x as z } from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["x"]
            }]
        }],
        errors: [{
            message: "'x' import from 'mod' is restricted.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 10,
            endColumn: 16
        }, {
            message: "'x' import from 'mod' is restricted.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 18,
            endColumn: 24
        }]
    }, {
        code: "import foo, { default as bar } from 'mod';",
        options: [{
            paths: [{
                name: "mod",
                importNames: ["default"]
            }]
        }],
        errors: [{
            message: "'default' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 11
        }, {
            message: "'default' import from 'mod' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 15,
            endColumn: 29
        }]
    }
    ]
});
