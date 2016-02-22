# Disallow specific imports (no-restricted-imports)

Imports are an ES6/ES2015 standard for making the functionality of other modules available in your current module. In CommonJS this is implemented through the require() call which makes this ESLint rule roughly equivalent to its CommonJS counterpart `no-restricted-modules`.

Why would you want to restrict imports?

* Some imports might not make sense in a particular environment. For example, Node's `fs` module would not make sense in an environment that didn't have a file system.

* Some modules provide similar or identical functionality, think `lodash` and `underscore`. Your project may have standardized on a module. You want to make sure that the other alternatives are not being used as this would unnecessarily bloat the project and provide a higher maintenance cost of two dependencies when one would suffice.

## Rule Details

This rule allows you to specify imports that you don't want to use in your application.

## Options

The syntax to specify restricted modules looks like this:

```json
"no-restricted-imports": [2, "import1", "import2"]
```

To restrict the use of all Node.js core imports (via https://github.com/nodejs/node/tree/master/lib):

```json
    "no-restricted-imports": [2,
         "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ],
```

The following patterns are considered problems:

```js
/*eslint no-restricted-imports: [2, "fs"]*/

import fs from 'fs';
```

```js
/*eslint no-restricted-imports: [2, "cluster"]*/

import cluster from ' cluster ';
```

The following patterns are not considered problems:

```js
/*eslint no-restricted-imports: [2, "fs"]*/

import crypto from 'crypto';
```

## When Not To Use It

Don't use this rule or don't include a module in the list for this rule if you want to be able to import a module in your project without an ESLint error or warning.
