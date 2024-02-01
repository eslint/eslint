/**
 * @fileoverview Tests for no-restricted-imports.
 * @author Guy Ellis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-restricted-imports"),
    RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: "module" } });

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
        { code: "import foo from 'foo';", options: ["../foo"] },
        { code: "import foo from 'foo';", options: [{ paths: ["../foo"] }] },
        { code: "import foo from 'foo';", options: [{ patterns: ["../foo"] }] },
        { code: "import foo from 'foo';", options: ["/foo"] },
        { code: "import foo from 'foo';", options: [{ paths: ["/foo"] }] },
        "import relative from '../foo';",
        { code: "import relative from '../foo';", options: ["../notFoo"] },
        { code: "import relativeWithPaths from '../foo';", options: [{ paths: ["../notFoo"] }] },
        { code: "import relativeWithPatterns from '../foo';", options: [{ patterns: ["notFoo"] }] },
        "import absolute from '/foo';",
        { code: "import absolute from '/foo';", options: ["/notFoo"] },
        { code: "import absoluteWithPaths from '/foo';", options: [{ paths: ["/notFoo"] }] },
        { code: "import absoluteWithPatterns from '/foo';", options: [{ patterns: ["notFoo"] }] },
        {
            code: "import withPatternsAndPaths from \"foo/bar\";",
            options: [{ paths: ["foo"], patterns: ["foo/c*"] }]
        },
        {
            code: "import withGitignores from \"foo/bar\";",
            options: [{ patterns: ["foo/*", "!foo/bar"] }]
        },
        {
            code: "import withPatterns from \"foo/bar\";",
            options: [{ patterns: [{ group: ["foo/*", "!foo/bar"], message: "foo is forbidden, use bar instead" }] }]
        },
        {
            code: "import withPatternsCaseSensitive from 'foo';",
            options: [{
                patterns: [{
                    group: ["FOO"],
                    message: "foo is forbidden, use bar instead",
                    caseSensitive: true
                }]
            }]
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
            code: "import { 'AllowedObject' as bar } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"],
                    message: "Please import 'DisallowedObject' from /bar/ instead."
                }]
            }]
        },
        {
            code: "import { ' ' as bar } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: [""]
                }]
            }]
        },
        {
            code: "import { '' as bar } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: [" "]
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
            code: "import { 'AllowedObject' as DisallowedObject } from \"foo\";",
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
        },
        {
            code: "export * from \"foo\";",
            options: ["bar"]
        },
        {
            code: "export * from \"foo\";",
            options: [{
                name: "bar",
                importNames: ["DisallowedObject"]
            }]
        },
        {
            code: "export { 'AllowedObject' } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"]
                }]
            }]
        },
        {
            code: "export { 'AllowedObject' as DisallowedObject } from \"foo\";",
            options: [{
                paths: [{
                    name: "foo",
                    importNames: ["DisallowedObject"]
                }]
            }]
        },
        {
            code: "import { Bar } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNames: ["Foo"]
                }]
            }]
        },
        {

            // Default import should not be reported unless importNames includes 'default'
            code: "import Foo from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNames: ["Foo"]
                }]
            }]
        },
        {
            code: "import Foo from 'foo';",
            options: [{
                patterns: [{
                    group: ["foo"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import Foo from 'foo';",
            options: [{
                patterns: [{
                    importNames: ["Foo"],
                    group: ["foo"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import Foo from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import { Bar } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import { Bar as Foo } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import { Bar as Foo } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    importNames: ["Foo"],
                    group: ["**/my/relative-module"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "import Foo, { Baz as Bar } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    group: ["**/my/relative-module"],
                    importNamePattern: "^(Foo|Bar)"
                }]
            }]
        },
        {
            code: "import Foo, { Baz as Bar } from '../../my/relative-module';",
            options: [{
                patterns: [{
                    importNames: ["Foo"],
                    group: ["**/my/relative-module"],
                    importNamePattern: "^Bar"
                }]
            }]
        },
        {
            code: "export { Bar } from 'foo';",
            options: [{
                patterns: [{
                    group: ["foo"],
                    importNamePattern: "^Foo"
                }]
            }]
        },
        {
            code: "export { Bar as Foo } from 'foo';",
            options: [{
                patterns: [{
                    group: ["foo"],
                    importNamePattern: "^Foo"
                }]
            }]
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
        code: "import withPatterns from \"foo/baz\";",
        options: [{ patterns: [{ group: ["foo/*", "!foo/bar"], message: "foo is forbidden, use foo/bar instead" }] }],
        errors: [{
            message: "'foo/baz' import is restricted from being used by a pattern. foo is forbidden, use foo/bar instead",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 36
        }]
    }, {
        code: "import withPatterns from \"foo/baz\";",
        options: [{ patterns: [{ group: ["foo/bar", "foo/baz"], message: "some foo subimports are restricted" }] }],
        errors: [{
            message: "'foo/baz' import is restricted from being used by a pattern. some foo subimports are restricted",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 36
        }]
    }, {
        code: "import withPatterns from \"foo/bar\";",
        options: [{ patterns: [{ group: ["foo/bar"] }] }],
        errors: [{
            message: "'foo/bar' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 36
        }]
    }, {
        code: "import withPatternsCaseInsensitive from 'foo';",
        options: [{ patterns: [{ group: ["FOO"] }] }],
        errors: [{
            message: "'foo' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 47
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
        code: "export * as ns from \"fs\";",
        options: ["fs"],
        errors: [{
            message: "'fs' import is restricted from being used.",
            type: "ExportAllDeclaration",
            line: 1,
            column: 1,
            endColumn: 26
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
        code: "export {'foo' as b} from \"fs\";",
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
            endColumn: 19
        }]
    }, {
        code: "export {'foo'} from \"fs\";",
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
            endColumn: 14
        }]
    }, {
        code: "export {'👍'} from \"fs\";",
        options: [{
            paths: [{
                name: "fs",
                importNames: ["👍"],
                message: "Don't import '👍'."
            }]
        }],
        errors: [{
            message: "'👍' import from 'fs' is restricted. Don't import '👍'.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 9,
            endColumn: 13
        }]
    }, {
        code: "export {''} from \"fs\";",
        options: [{
            paths: [{
                name: "fs",
                importNames: [""],
                message: "Don't import ''."
            }]
        }],
        errors: [{
            message: "'' import from 'fs' is restricted. Don't import ''.",
            type: "ExportNamedDeclaration",
            line: 1,
            column: 9,
            endColumn: 11
        }]
    }, {
        code: "export * as ns from \"fs\";",
        options: [{
            paths: [{
                name: "fs",
                importNames: ["foo"],
                message: "Don't import 'foo'."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'foo' from 'fs' is restricted. Don't import 'foo'.",
            type: "ExportAllDeclaration",
            line: 1,
            column: 8,
            endColumn: 9
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
        code: "export * from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["DisallowedObject"],
                message: "Please import 'DisallowedObject' from /bar/ instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'DisallowedObject' from 'foo' is restricted. Please import 'DisallowedObject' from /bar/ instead.",
            type: "ExportAllDeclaration",
            line: 1,
            column: 8,
            endColumn: 9
        }]
    },
    {
        code: "export * from \"foo\";",
        options: [{
            name: "foo",
            importNames: ["DisallowedObject1, DisallowedObject2"]
        }],
        errors: [{
            message: "* import is invalid because 'DisallowedObject1, DisallowedObject2' from 'foo' is restricted.",
            type: "ExportAllDeclaration",
            line: 1,
            column: 8,
            endColumn: 9
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
        code: "import { 'DisallowedObject' as AllowedObject } from \"foo\";",
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
            endColumn: 45
        }]
    },
    {
        code: "import { '👍' as bar } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: ["👍"]
            }]
        }],
        errors: [{
            message: "'👍' import from 'foo' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 21
        }]
    },
    {
        code: "import { '' as bar } from \"foo\";",
        options: [{
            paths: [{
                name: "foo",
                importNames: [""]
            }]
        }],
        errors: [{
            message: "'' import from 'foo' is restricted.",
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 19
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

    // https://github.com/eslint/eslint/issues/15261
    {
        code: "import { Image, Text, ScrollView } from 'react-native'",
        options: [{
            paths: [
                {
                    name: "react-native",
                    importNames: ["Text"],
                    message: "import Text from ui/_components instead"
                },
                {
                    name: "react-native",
                    importNames: ["TextInput"],
                    message: "import TextInput from ui/_components instead"
                },
                { name: "react-native", importNames: ["View"], message: "import View from ui/_components instead " },
                {
                    name: "react-native",
                    importNames: ["ScrollView"],
                    message: "import ScrollView from ui/_components instead"
                },
                {
                    name: "react-native",
                    importNames: ["KeyboardAvoidingView"],
                    message: "import KeyboardAvoidingView from ui/_components instead"
                },
                {
                    name: "react-native",
                    importNames: ["ImageBackground"],
                    message: "import ImageBackground from ui/_components instead"
                },
                {
                    name: "react-native",
                    importNames: ["Image"],
                    message: "import Image from ui/_components instead"
                }
            ]
        }],
        errors: [
            {
                message: "'Image' import from 'react-native' is restricted. import Image from ui/_components instead",
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 15
            },
            {
                message: "'Text' import from 'react-native' is restricted. import Text from ui/_components instead",
                type: "ImportDeclaration",
                line: 1,
                column: 17,
                endColumn: 21
            },
            {
                message: "'ScrollView' import from 'react-native' is restricted. import ScrollView from ui/_components instead",
                type: "ImportDeclaration",
                line: 1,
                column: 23,
                endColumn: 33
            }
        ]
    },
    {
        code: "import { foo, bar, baz } from 'mod'",
        options: [{
            paths: [
                {
                    name: "mod",
                    importNames: ["foo"],
                    message: "Import foo from qux instead."
                },
                {
                    name: "mod",
                    importNames: ["baz"],
                    message: "Import baz from qux instead."
                }
            ]
        }],
        errors: [
            {
                message: "'foo' import from 'mod' is restricted. Import foo from qux instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13
            },
            {
                message: "'baz' import from 'mod' is restricted. Import baz from qux instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 20,
                endColumn: 23
            }
        ]
    },
    {
        code: "import { foo, bar, baz, qux } from 'mod'",
        options: [{
            paths: [
                {
                    name: "mod",
                    importNames: ["bar"],
                    message: "Use `barbaz` instead of `bar`."
                },
                {
                    name: "mod",
                    importNames: ["foo", "qux"],
                    message: "Don't use 'foo' and `qux` from 'mod'."
                }
            ]
        }],
        errors: [
            {
                message: "'foo' import from 'mod' is restricted. Don't use 'foo' and `qux` from 'mod'.",
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13
            },
            {
                message: "'bar' import from 'mod' is restricted. Use `barbaz` instead of `bar`.",
                type: "ImportDeclaration",
                line: 1,
                column: 15,
                endColumn: 18
            },
            {
                message: "'qux' import from 'mod' is restricted. Don't use 'foo' and `qux` from 'mod'.",
                type: "ImportDeclaration",
                line: 1,
                column: 25,
                endColumn: 28
            }
        ]
    },
    {
        code: "import { foo, bar, baz, qux } from 'mod'",
        options: [{
            paths: [
                {
                    name: "mod",
                    importNames: ["foo", "baz"],
                    message: "Don't use 'foo' or 'baz' from 'mod'."
                },
                {
                    name: "mod",
                    importNames: ["a", "c"],
                    message: "Don't use 'a' or 'c' from 'mod'."
                },
                {
                    name: "mod",
                    importNames: ["b", "bar"],
                    message: "Use 'b' or `bar` from 'quux/mod' instead."
                }
            ]
        }],
        errors: [
            {
                message: "'foo' import from 'mod' is restricted. Don't use 'foo' or 'baz' from 'mod'.",
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13
            },
            {
                message: "'bar' import from 'mod' is restricted. Use 'b' or `bar` from 'quux/mod' instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 15,
                endColumn: 18
            },
            {
                message: "'baz' import from 'mod' is restricted. Don't use 'foo' or 'baz' from 'mod'.",
                type: "ImportDeclaration",
                line: 1,
                column: 20,
                endColumn: 23
            }
        ]
    },
    {
        code: "import * as mod from 'mod'",
        options: [{
            paths: [
                {
                    name: "mod",
                    importNames: ["foo"],
                    message: "Import foo from qux instead."
                },
                {
                    name: "mod",
                    importNames: ["bar"],
                    message: "Import bar from qux instead."
                }
            ]
        }],
        errors: [
            {
                message: "* import is invalid because 'foo' from 'mod' is restricted. Import foo from qux instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 8,
                endColumn: 16
            },
            {
                message: "* import is invalid because 'bar' from 'mod' is restricted. Import bar from qux instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 8,
                endColumn: 16
            }
        ]
    },
    {
        code: "import { foo } from 'mod'",
        options: [{
            paths: [

                // restricts importing anything from the module
                {
                    name: "mod"
                },

                // message for a specific import name
                {
                    name: "mod",
                    importNames: ["bar"],
                    message: "Import bar from qux instead."
                }
            ]
        }],
        errors: [
            {
                message: "'mod' import is restricted from being used.",
                type: "ImportDeclaration",
                line: 1,
                column: 1,
                endColumn: 26
            }
        ]
    },
    {
        code: "import { bar } from 'mod'",
        options: [{
            paths: [

                // restricts importing anything from the module
                {
                    name: "mod"
                },

                // message for a specific import name
                {
                    name: "mod",
                    importNames: ["bar"],
                    message: "Import bar from qux instead."
                }
            ]
        }],
        errors: [
            {
                message: "'mod' import is restricted from being used.",
                type: "ImportDeclaration",
                line: 1,
                column: 1,
                endColumn: 26
            },
            {
                message: "'bar' import from 'mod' is restricted. Import bar from qux instead.",
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13
            }
        ]
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
    },
    {
        code: "import relative from '../foo';",
        options: ["../foo"],
        errors: [{
            message: "'../foo' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 31
        }]
    },
    {
        code: "import relativeWithPaths from '../foo';",
        options: [{ paths: ["../foo"] }],
        errors: [{
            message: "'../foo' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 40
        }]
    },
    {
        code: "import relativeWithPatterns from '../foo';",
        options: [{ patterns: ["../foo"] }],
        errors: [{
            message: "'../foo' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 43
        }]
    },
    {
        code: "import absolute from '/foo';",
        options: ["/foo"],
        errors: [{
            message: "'/foo' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 29
        }]
    },
    {
        code: "import absoluteWithPaths from '/foo';",
        options: [{ paths: ["/foo"] }],
        errors: [{
            message: "'/foo' import is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 38
        }]
    },
    {
        code: "import absoluteWithPatterns from '/foo';",
        options: [{ patterns: ["foo"] }],
        errors: [{
            message: "'/foo' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 41
        }]
    },
    {
        code: "import absoluteWithPatterns from '#foo/bar';",
        options: [{ patterns: ["\\#foo"] }],
        errors: [{
            message: "'#foo/bar' import is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 1,
            endColumn: 45
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNames: ["Foo"]
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo, Bar } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNames: ["Foo", "Bar"],
                message: "Import from @/utils instead."
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern. Import from @/utils instead."
        }, {
            type: "ImportDeclaration",
            line: 1,
            column: 15,
            endColumn: 18,
            message: "'Bar' import from '../../my/relative-module' is restricted from being used by a pattern. Import from @/utils instead."
        }]
    },
    {

        /*
         * Star import should be reported for consistency with `paths` option (see: https://github.com/eslint/eslint/pull/16059#discussion_r908749964)
         * For example, import * as All allows for calling/referencing the restricted import All.Foo
         */
        code: "import * as All from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNames: ["Foo"]
            }]
        }],
        errors: [{
            message: "* import is invalid because 'Foo' from '../../my/relative-module' is restricted from being used by a pattern.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 16
        }]
    },
    {

        /*
         * Star import should be reported for consistency with `paths` option (see: https://github.com/eslint/eslint/pull/16059#discussion_r908749964)
         * For example, import * as All allows for calling/referencing the restricted import All.Foo
         */
        code: "import * as AllWithCustomMessage from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNames: ["Foo"],
                message: "Import from @/utils instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'Foo' from '../../my/relative-module' is restricted from being used by a pattern. Import from @/utils instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 33
        }]
    },
    {
        code: "import def, * as ns from 'mod';",
        options: [{
            patterns: [{
                group: ["mod"],
                importNames: ["default"]
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 11,
            message: "'default' import from 'mod' is restricted from being used by a pattern."
        },
        {
            type: "ImportDeclaration",
            line: 1,
            column: 13,
            endColumn: 20,
            message: "* import is invalid because 'default' from 'mod' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import Foo from 'mod';",
        options: [{
            patterns: [{
                group: ["mod"],
                importNames: ["default"]
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 11,
            message: "'default' import from 'mod' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo } from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo as Bar } from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 20,
            message: "'Foo' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import Foo, { Bar } from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^(Foo|Bar)"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 15,
            endColumn: 18,
            message: "'Bar' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { FooBar } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 16,
            message: "'FooBar' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import Foo, { Bar } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo|^Bar"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 15,
            endColumn: 18,
            message: "'Bar' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo, Bar } from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^(Foo|Bar)"
            }]
        }],
        errors: [
            {
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13,
                message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
            },
            {
                type: "ImportDeclaration",
                line: 1,
                column: 15,
                endColumn: 18,
                message: "'Bar' import from '../../my/relative-module' is restricted from being used by a pattern."
            }
        ]
    },
    {
        code: "import * as Foo from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            message: "* import is invalid because import name matching '/^Foo/u' pattern from 'foo' is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 16
        }]
    },
    {
        code: "import * as All from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            message: "* import is invalid because import name matching '/^Foo/u' pattern from '../../my/relative-module' is restricted from being used.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 16
        }]
    },
    {
        code: "import * as AllWithCustomMessage from '../../my/relative-module';",
        options: [{
            patterns: [{
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo",
                message: "Import from @/utils instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because import name matching '/^Foo/u' pattern from '../../my/relative-module' is restricted from being used. Import from @/utils instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 33
        }]
    },
    {
        code: "import * as AllWithCustomMessage from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Foo"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo",
                message: "Import from @/utils instead."
            }]
        }],
        errors: [{
            message: "* import is invalid because 'Foo' from '../../my/relative-module' is restricted from being used by a pattern. Import from @/utils instead.",
            type: "ImportDeclaration",
            line: 1,
            column: 8,
            endColumn: 33
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Foo"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Foo", "Bar"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Bar"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo } from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Foo"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Bar"
            }]
        }],
        errors: [{
            type: "ImportDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
        }]
    },
    {
        code: "import { Foo, Bar } from '../../my/relative-module';",
        options: [{
            patterns: [{
                importNames: ["Foo"],
                group: ["**/my/relative-module"],
                importNamePattern: "^Bar"
            }]
        }],
        errors: [
            {
                type: "ImportDeclaration",
                line: 1,
                column: 10,
                endColumn: 13,
                message: "'Foo' import from '../../my/relative-module' is restricted from being used by a pattern."
            },
            {
                type: "ImportDeclaration",
                line: 1,
                column: 15,
                endColumn: 18,
                message: "'Bar' import from '../../my/relative-module' is restricted from being used by a pattern."
            }
        ]
    },
    {
        code: "export { Foo } from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ExportNamedDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "export { Foo as Bar } from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ExportNamedDeclaration",
            line: 1,
            column: 10,
            endColumn: 20,
            message: "'Foo' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "export { Foo } from 'foo';",
        options: [{
            patterns: [{
                importNames: ["Bar"],
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ExportNamedDeclaration",
            line: 1,
            column: 10,
            endColumn: 13,
            message: "'Foo' import from 'foo' is restricted from being used by a pattern."
        }]
    },
    {
        code: "export * from 'foo';",
        options: [{
            patterns: [{
                group: ["foo"],
                importNamePattern: "^Foo"
            }]
        }],
        errors: [{
            type: "ExportAllDeclaration",
            line: 1,
            column: 8,
            endColumn: 9,
            message: "* import is invalid because import name matching '/^Foo/u' pattern from 'foo' is restricted from being used."
        }]
    }
    ]
});
