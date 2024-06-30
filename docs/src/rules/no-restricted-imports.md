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

Using string option, you can specify  the name of a module that you want to restrict from being imported as a value in the rule options array:

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

String options also restrict the module from being exported, as in this example:

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

You may also specify a custom message for a particular module using the `name` and `message` properties inside an object, where the value of the `name` is the name of the module and `message` property contains the custom message. (The custom message is appended to the default error message from the rule.)

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

This is an object option whose value is an array containing the names of the modules you want to restrict.

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

Custom messages for a particular module can also be specified in `paths` array using objects with `name` and `message`.

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

This option in `paths` is an array and can be used to specify the names of certain bindings exported from a module. Import names specified inside `paths` array affect the module specified in the `name` property of corresponding object, so it is required to specify the `name` property first when you are using `importNames` or `message` option.

Specifying `"default"` string inside the `importNames` array will restrict the default export from being imported.

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

If the local name assigned to a default export is the same as a string in `importNames`, this will not cause an error.

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

#### allowImportNames

This option is an array. Inverse of `importNames`, `allowImportNames` allows the imports that are specified inside this array. So it restricts all imports from a module, except specified allowed ones.

Note: `allowImportNames` cannot be used in combination with `importNames`.

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "import-foo",
    "allowImportNames": ["Bar"],
    "message": "Please use only Bar from import-foo."
  }]
}]
```

Examples of **incorrect** code for `allowImportNames` in `paths`:

Disallowing all import names except 'AllowedObject'.

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    allowImportNames: ["AllowedObject"],
    message: "Please use only 'AllowedObject' from 'foo'."
}]}]*/

import { DisallowedObject } from "foo";
```

:::

Examples of **correct** code for `allowImportNames` in `paths`:

Disallowing all import names except 'AllowedObject'.

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    allowImportNames: ["AllowedObject"],
    message: "Only use 'AllowedObject' from 'foo'."
}]}]*/

import { AllowedObject } from "foo";
```

:::

### patterns

This is also an object option whose value is an array. This option allows you to specify multiple modules to restrict using `gitignore`-style patterns or regular expressions.

Where `paths` option takes exact import paths, `patterns` option can be used to specify the import paths with more flexibility, allowing for the restriction of multiple modules within the same directory. For example:

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "import-foo",
  }]
}]
```

This configuration restricts import of the `import-foo` module but wouldn't restrict the import of `import-foo/bar` or `import-foo/baz`. You can use `patterns` to restrict both:

```json
"no-restricted-imports": ["error", {
    "paths": [{
      "name": "import-foo",
    }],
    "patterns": [{
      "group": ["import-foo/ba*"],
    }]
}]
```

This configuration restricts imports not just from `import-foo` using `path`, but also `import-foo/bar` and `import-foo/baz` using `patterns`.

To re-include a module when using `gitignore-`style patterns, add a negation (`!`) mark before the pattern. (Make sure these negated patterns are placed last in the array, as order matters)

```json
"no-restricted-imports": ["error", {
    "patterns": ["import1/private/*", "import2/*", "!import2/good"]
}]
```

You can also use regular expressions to restrict modules (see the [`regex` option](#regex)).

Examples of **incorrect** code for `patterns` option:

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

In this example, `"!import1/private/*"` is not reincluding the modules inside `private` because the negation mark (`!`) does not reinclude the files if it's parent directory is excluded by a pattern. In this case, `import1/private` directory is already excluded by the `import1/*` pattern. (The excluded directory can be reincluded using `"!import1/private"`.)

Examples of **correct** code for `patterns` option:

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

The `patterns` array can also include objects. The `group` property is used to specify the `gitignore`-style patterns for restricting modules and the `message` property is used to specify a custom message.

Either of the `group` or `regex` properties is required when using the `patterns` option.

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

#### regex

The `regex` property is used to specify the regex patterns for restricting modules.

Note: `regex` cannot be used in combination with `group`.

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "regex": "import1/private/",
      "message": "usage of import1 private modules not allowed."
    }, {
      "regex": "import2/(?!good)",
      "message": "import2 is deprecated, except the modules in import2/good."
    }]
}]
```

Examples of **incorrect** code for `regex` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    regex: "@app/(?!(api/enums$)).*",
}]}]*/

import Foo from '@app/api';
import Bar from '@app/api/bar';
import Baz from '@app/api/baz';
import Bux from '@app/api/enums/foo';
```

:::

Examples of **correct** code for `regex` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    regex: "@app/(?!(api/enums$)).*",
}]}]*/

import Foo from '@app/api/enums';
```

:::

#### caseSensitive

This is a boolean option and sets the patterns specified in the `group` or `regex` properties to be case-sensitive when `true`. Default is `false`.

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

You can also specify `importNames` within objects inside the `patterns` array. In this case, the specified names apply only to the associated `group` or `regex` property.

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

#### allowImportNames

You can also specify `allowImportNames` within objects inside the `patterns` array. In this case, the specified names apply only to the associated `group` or `regex` property.

Note: `allowImportNames` cannot be used in combination with `importNames`, `importNamePattern` or `allowImportNamePattern`.

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["utils/*"],
      "allowImportNames": ["isEmpty"],
      "message": "Please use only 'isEmpty' from utils."
    }]
}]
```

Examples of **incorrect** code for `allowImportNames` in `patterns`:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    allowImportNames: ['isEmpty'],
    message: "Please use only 'isEmpty' from utils."
}]}]*/

import { hasValues } from 'utils/collection-utils';
```

:::

Examples of **correct** code for `allowImportNames` in `patterns`:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    allowImportNames: ['isEmpty'],
    message: "Please use only 'isEmpty' from utils."
}]}]*/

import { isEmpty } from 'utils/collection-utils';
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

#### allowImportNamePattern

This is a string option. Inverse of `importNamePattern`, this option allows imports that matches the specified regex pattern. So it restricts all imports from a module, except specified allowed patterns.

Note: `allowImportNamePattern` cannot be used in combination with `importNames`, `importNamePattern` or `allowImportNames`.

```json
"no-restricted-imports": ["error", {
    "patterns": [{
      "group": ["import-foo/*"],
      "allowImportNamePattern": "^foo",
    }]
}]
```

Examples of **incorrect** code for `allowImportNamePattern` option:

::: incorrect { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    allowImportNamePattern: '^has'
}]}]*/

import { isEmpty } from 'utils/collection-utils';
```

:::

Examples of **correct** code for `allowImportNamePattern` option:

::: correct { "sourceType": "module" }

```js
/*eslint no-restricted-imports: ["error", { patterns: [{
    group: ["utils/*"],
    allowImportNamePattern: '^is'
}]}]*/

import { isEmpty } from 'utils/collection-utils';
```

:::

## When Not To Use It

Don't use this rule or don't include a module in the list for this rule if you want to be able to import a module in your project without an ESLint error or warning.
