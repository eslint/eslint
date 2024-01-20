---
title: no-restricted-imports
rule_type: suggestion
---


Imports are an ES6/ES2015 standard for making the functionality of other modules available in your current module. In CommonJS this is implemented through the `require()` call which makes this ESLint rule roughly equivalent to its CommonJS counterpart `no-restricted-modules`.

Why would you want to restrict imports?

* Some imports might not make sense in a particular environment. For example, Node.js' `fs` module would not make sense in an environment that didn't have a file system.

* Some modules provide similar or identical functionality, think `lodash` and `underscore`. Your project may have standardized on a module. You want to make sure that the other alternatives are not being used as this would unnecessarily bloat the project and provide a higher maintenance cost of two dependencies when one would suffice.

## Rule Details

This rule allows you to specify imports that you don't want to use in your application.

It applies to static imports only, not dynamic ones.

## Options

This rule has both string and object options to specify the imported modules to restrict.

Simplest way to specify a module that you want to restrict from being imported is to pass it's name as a string to the options:

```json
"no-restricted-imports": ["error", "import1", "import2"]
```

Examples of **incorrect** code for string option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

import fs from 'fs';
```

:::

Specified string can also restrict the module from being exported:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

export { fs } from 'fs';
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

export * from 'fs';
```

:::

Examples of **correct** code for string option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

import crypto from 'crypto';
export { foo } from "bar";
```

:::

You may also specify a custom message for a particular module simply using `name` and `message` properties inside an object, where the value of the `name` property will be the name of the module and `message` property will contain the custom message. The custom message will be appended to the default error message:

```json
"no-restricted-imports": ["error", {
    "name": "import-foo",
    "message": "Please use import-bar instead."
}, {
    "name": "import-baz",
    "message": "Please use import-quux instead."
}]
```

Examples of **incorrect** code for string option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", {
    "name": "disallowed-import",
    "message": "Please use 'allowed-import' instead"
}]*/

import foo from 'disallowed-import';
```

:::

### paths

This is an object option whose value is an array and the name of the module you want to restrict can be specified inside this array, same as in string option above.

```json
"no-restricted-imports": ["error", { "paths": ["import1", "import2"] }]
```

Examples of **incorrect** code for `paths`:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "paths": ["cluster"] }]*/

import cluster from 'cluster';
```

:::

Custom messages for a particular module can also be specified in `paths` array option using objects as above.

```json
"no-restricted-imports": ["error", {
    "paths": [{
        "name": "import-foo",
        "message": "Please use import-bar instead."
    }, {
        "name": "import-baz",
        "message": "Please use import-quux instead."
    }]
}]
```

#### importNames

This option in `paths` is an array and can be used to specify certain imports to restrict that are being exported from a module. Import names specified inside `paths` array looks for the module specified in the `name` property of corresponding object, so it is required to specify the `name` key with both `importNames` and `message` options.

Passing `"default"` string inside the `importNames` array will restrict the import that is being exported by default by the module.

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "import-foo",
    "importNames": ["Bar"],
    "message": "Please use Bar from /import-bar/baz/ instead."
  }]
}]
```

Examples of **incorrect** code when `importNames` in `paths` has `"default"`:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["default"],
    message: "Please use the default import from '/bar/baz/' instead."
}]}]*/

import DisallowedObject from "foo";
```

:::

Examples of **incorrect** code for `importNames` in `paths`:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import { DisallowedObject } from "foo";

import { DisallowedObject as AllowedObject } from "foo";

import { "DisallowedObject" as SomeObject } from "foo";
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import * as Foo from "foo";
```

:::

Examples of **correct** code for `importNames` in `paths`:

Other strings doesn't report default exported import even if the names are same:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{ name: "foo", importNames: ["DisallowedObject"] }] }]*/

import DisallowedObject from "foo"
```

:::

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import { AllowedObject as DisallowedObject } from "foo";
```

:::

### patterns

This is also an object option whose value is an array. This option comes handy when you need to restrict the modules present inside a perticular directory. Simply, you can specify the modules inside the directories you want to restrict as string in `gitignore-style` patterns.

Since the patterns follows the `gitignore-style` then if you want to reinclude any particular module this can be done by prefixing a negation (`!`) mark in front of the pattern and it's good to keep the negation patterns in last as `gitignore-style` follows order:

```json
"no-restricted-imports": ["error", {
    "patterns": ["import1/private/*", "import2/*", "!import2/good"]
}]
```

Examples of **incorrect** code for `pattern` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["lodash/*"] }]*/

import pick from 'lodash/pick';
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["lodash/*", "!lodash/pick"] }]*/

import pick from 'lodash/map';
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["import1/*", "!import1/private/*"] }]*/

import pick from 'import1/private/someModule';
```

:::

In last example `"!import1/private/*"` is not reincluding the modules inside private directory because in `gitignore-style` negation mark (`!`) does not reinclude the files if it's parent directory is excluded by a pattern. In this case `import1/private` directory is already excluded by the `import1/*` pattern, but excluded directory can be reincluded like using `"!import1/private"`.

Examples of **correct** code for `pattern` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["crypto/*"] }]*/

import crypto from 'crypto';
```

:::

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["lodash/*", "!lodash/pick"] }]*/

import pick from 'lodash/pick';
```

:::

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["import1/*", "!import1/private"] }]*/

import pick from 'import1/private/someModule';
```

:::

#### group

Alternatively you can use this object property which is an array to specify the `gitignore-style` patterns for restricting modules. Custom messages can also be specified like `paths`.

This is a required property if you are using object options inside the `patterns` array:

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["import1/private/*"],
      "message": "usage of import1 private modules not allowed."
    }, {
      "group": ["import2/*", "!import2/good"],
      "message": "import2 is deprecated, except the modules in import2/good."
    }]
}]
```

Examples of **incorrect** code for `group` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["lodash/*"],
    message: "Please use the default import from 'lodash' instead."
}]}]*/

import pick from 'lodash/pick';
```

:::

Examples of **correct** code for this `group` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["lodash/*"],
    message: "Please use the default import from 'lodash' instead."
}]}]*/

import lodash from 'lodash';
```

:::

#### caseSensitive

This is a boolean option and allows the patterns specified in the `group` array to be case-sensitive when sets to `true`. Default is `false`:

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["import1/private/prefix[A-Z]*"],
      "caseSensitive": true
    }]
}]
```

Examples of **incorrect** code for `caseSensitive: true` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["foo[A-Z]*"],
    caseSensitive: true
}]}]*/

import pick from 'fooBar';
```

:::

Examples of **correct** code for `caseSensitive: true` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["foo[A-Z]*"],
    caseSensitive: true
}]}]*/

import pick from 'food';
```

:::

#### importNames

`patterns` too has an `importNames` property and this works similar as in `paths`, it just looks for patterns specified inside the `group` array:

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["utils/*"],
      "importNames": ["isEmpty"],
      "message": "Use 'isEmpty' from lodash instead."
    }]
}]
```

Examples of **incorrect** code for `importNames` in `patterns`:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    importNames: ['isEmpty'],
    message: "Use 'isEmpty' from lodash instead."
}]}]*/

import { isEmpty } from 'utils/collection-utils';
```

:::

Examples of **correct** code for `importNames` in `patterns`:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    importNames: ['isEmpty'],
    message: "Use 'isEmpty' from lodash instead."
}]}]*/

import { hasValues } from 'utils/collection-utils';
```

:::

#### importNamePattern

This option allows you to use regex patterns to restrict import names:

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["import-foo/*"],
      "importNamePattern": "^foo",
    }]
}]
```

Examples of **incorrect** code for `importNamePattern` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    importNamePattern: '^is',
    message: "Use 'is*' functions from lodash instead."
}]}]*/

import { isEmpty } from 'utils/collection-utils';
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["foo/*"],
    importNamePattern: '^(is|has)',
    message: "Use 'is*' and 'has*' functions from baz/bar instead"
}]}]*/

import { isSomething, hasSomething } from 'foo/bar';
```

:::

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["foo/*"],
    importNames: ["bar"],
    importNamePattern: '^baz',
}]}]*/

import { bar, bazQux } from 'foo/quux';
```

:::

Examples of **correct** code for `importNamePattern` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    importNamePattern: '^is',
    message: "Use 'is*' functions from lodash instead."
}]}]*/

import isEmpty, { hasValue } from 'utils/collection-utils';
```

:::

To restrict the use of all Node.js core imports (via <https://github.com/nodejs/node/tree/master/lib>):

```json
    "no-restricted-imports": ["error",
         "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ],
```

## When Not To Use It

Don't use this rule or don't include a module in the list for this rule if you want to be able to import a module in your project without an ESLint error or warning.
