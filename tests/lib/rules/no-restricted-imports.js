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
        }
    ],
    invalid: [{
        code: "import \"fs\"",
        options: ["fs"],
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
        options: [{ patterns: ["foo"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration" }]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: ["bar"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration" }]
    }, {
        code: "import withGitignores from \"foo/bar\";",
        options: [{ patterns: ["foo/*", "!foo/baz"] }],
        errors: [{ message: "'foo/bar' import is restricted from being used by a pattern.", type: "ImportDeclaration" }]
    }, {
        code: "export * from \"fs\";",
        options: ["fs"],
        errors: [{ message: "'fs' import is restricted from being used.", type: "ExportAllDeclaration" }]
    }, {
        code: "export {a} from \"fs\";",
        options: ["fs"],
        errors: [{ message: "'fs' import is restricted from being used.", type: "ExportNamedDeclaration" }]
    }, {
        code: "export {foo as b} from \"fs\";",
        options: [{
            paths: [{
                name: "fs",
                importNames: ["foo"],
                message: "Don't import 'foo'."
            }]
        }],
        errors: [{ message: "'fs' import is restricted from being used. Don't import 'foo'.", type: "ExportNamedDeclaration" }]
    }, {
        code: "import withGitignores from \"foo\";",
        options: [{
            name: "foo",
            message: "Please import from 'bar' instead."
        }],
        errors: [{
            message: "'foo' import is restricted from being used. Please import from 'bar' instead.",
            type: "ImportDeclaration"
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
            type: "ImportDeclaration"
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
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import the default import of 'foo' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "* import is invalid because 'DisallowedObject' from 'foo' is restricted.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' and 'DisallowedObjectTwo' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import the default import of 'foo' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "'foo' import is restricted from being used. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ImportDeclaration"
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
            message: "* import is invalid because 'DisallowedObject' from 'foo' is restricted.",
            type: "ImportDeclaration"
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
            message: "* import is invalid because 'DisallowedObject,DisallowedObjectTwo' from 'foo' is restricted.",
            type: "ImportDeclaration"
        }]
    }
    ]
});
