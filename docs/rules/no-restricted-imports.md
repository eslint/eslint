# Disallow specific imports (no-restricted-imports)

Imports are an ES6/ES2015 standard for making the functionality of other modules available in your current module. In CommonJS this is implemented through the `require()` call which makes this ESLint rule roughly equivalent to its CommonJS counterpart `no-restricted-modules`.

Why would you want to restrict imports?

* Some imports might not make sense in a particular environment. For example, Node.js' `fs` module would not make sense in an environment that didn't have a file system.

* Some modules provide similar or identical functionality, think `lodash` and `underscore`. Your project may have standardized on a module. You want to make sure that the other alternatives are not being used as this would unnecessarily bloat the project and provide a higher maintenance cost of two dependencies when one would suffice.

## Rule Details

This rule allows you to specify imports that you don't want to use in your application.

## Options

The syntax to specify restricted imports looks like this:

```json
"no-restricted-imports": ["error", "import1", "import2"]
```

or like this:

```json
"no-restricted-imports": ["error", { "paths": ["import1", "import2"] }]
```

When using the object form, you can also specify an array of gitignore-style patterns:

```json
"no-restricted-imports": ["error", {
    "paths": ["import1", "import2"],
    "patterns": ["import1/private/*", "import2/*", "!import2/good"]
}]
```

You may also specify a custom message for any paths you want to restrict as follows:

```json
"no-restricted-imports": ["error", [{
  "name": "import-foo",
  "message": "Please use import-bar instead."
}]]
```

or like this:

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "import-foo",
    "message": "Please use import-bar instead."
  }]
}]
```

or like this if you need to restrict only certain imports from a module:

```json
"no-restricted-imports": ["error", {
  "paths": [{
    "name": "import-foo",
    "importNames": ["Bar"],
    "message": "Please use Bar from /import-bar/baz/ instead."
  }]
}]
```

The custom message will be appended to the default error message. Please note that you may not specify custom error messages for restricted patterns as a particular import may match more than one pattern.

To restrict the use of all Node.js core imports (via https://github.com/nodejs/node/tree/master/lib):

```json
    "no-restricted-imports": ["error",
         "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ],
```

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

import fs from 'fs';
```

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

export { fs } from 'fs';
```

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

export * from 'fs';
```

```js
/*eslint no-restricted-imports: ["error", { "paths": ["cluster"] }]*/

import cluster from 'cluster';
```

```js
/*eslint no-restricted-imports: ["error", { "patterns": ["lodash/*"] }]*/

import pick from 'lodash/pick';
```

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["default"],
    message: "Please use the default import from '/bar/baz/' instead."
}]}]*/

import DisallowedObject from "foo";
```

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import { DisallowedObject as AllowedObject } from "foo";
```

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import * as Foo from "foo";
```

Examples of **correct** code for this rule:

```js
/*eslint no-restricted-imports: ["error", "fs"]*/

import crypto from 'crypto';
export { foo } from "bar";
```

```js
/*eslint no-restricted-imports: ["error", { "paths": ["fs"], "patterns": ["eslint/*"] }]*/

import crypto from 'crypto';
import eslint from 'eslint';
export * from "path";
```

```js
/*eslint no-restricted-imports: ["error", { paths: [{ name: "foo", importNames: ["DisallowedObject"] }] }]*/

import DisallowedObject from "foo"
```

```js
/*eslint no-restricted-imports: ["error", { paths: [{
    name: "foo",
    importNames: ["DisallowedObject"],
    message: "Please import 'DisallowedObject' from '/bar/baz/' instead."
}]}]*/

import { AllowedObject as DisallowedObject } from "foo";
```

## When Not To Use It

Don't use this rule or don't include a module in the list for this rule if you want to be able to import a module in your project without an ESLint error or warning.
