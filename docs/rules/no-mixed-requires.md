# disallow `require` calls to be mixed with regular variable declarations (no-mixed-requires)

In the Node.js community it is often customary to separate initializations with calls to `require` modules from other variable declarations, sometimes also grouping them by the type of module. This rule helps you enforce this convention.

## Rule Details

When this rule is enabled, each `var` statement must satisfy the following conditions:

* either none or all variable declarations must be require declarations (default)
* all require declarations must be of the same type (grouping)

This rule distinguishes between six kinds of variable declaration types:

* `core`: declaration of a required [core module][1]
* `file`: declaration of a required [file module][2]
* `module`: declaration of a required module from the [node_modules folder][3]
* `computed`: declaration of a required module whose type could not be determined (either because it is computed or because require was called without an argument)
* `uninitialized`: a declaration that is not initialized
* `other`: any other kind of declaration

In this document, the first four types are summed up under the term *require declaration*.

```js
var fs = require('fs'),        // "core"     \
    async = require('async'),  // "module"   |- these are "require declaration"s
    foo = require('./foo'),    // "file"     |
    bar = require(getName()),  // "computed" /
    baz = 42,                  // "other"
    bam;                       // "uninitialized"
```

## Options

This rule can have an object literal option whose two properties have `false` values by default.

Configuring this rule with one boolean option `true` is deprecated.

Examples of **incorrect** code for this rule with the default `{ "grouping": false, "allowCall": false }` options:

```js
/*eslint no-mixed-requires: "error"*/

var fs = require('fs'),
    i = 0;

var async = require('async'),
    debug = require('diagnostics').someFunction('my-module'),
    eslint = require('eslint');
```

Examples of **correct** code for this rule with the default `{ "grouping": false, "allowCall": false }` options:

```js
/*eslint no-mixed-requires: "error"*/

// only require declarations (grouping off)
var eventEmitter = require('events').EventEmitter,
    myUtils = require('./utils'),
    util = require('util'),
    bar = require(getBarModuleName());

// only non-require declarations
var foo = 42,
    bar = 'baz';

// always valid regardless of grouping because all declarations are of the same type
var foo = require('foo' + VERSION),
    bar = require(getBarModuleName()),
    baz = require();
```

### grouping

Examples of **incorrect** code for this rule with the `{ "grouping": true }` option:

```js
/*eslint no-mixed-requires: ["error", { "grouping": true }]*/

// invalid because of mixed types "core" and "module"
var fs = require('fs'),
    async = require('async');

// invalid because of mixed types "file" and "unknown"
var foo = require('foo'),
    bar = require(getBarModuleName());
```

### allowCall

Examples of **incorrect** code for this rule with the `{ "allowCall": true }` option:

```js
/*eslint no-mixed-requires: ["error", { "allowCall": true }]*/

var async = require('async'),
    debug = require('diagnostics').someFunction('my-module'), /* allowCall doesn't allow calling any function */
    eslint = require('eslint');
```

Examples of **correct** code for this rule with the `{ "allowCall": true }` option:

```js
/*eslint no-mixed-requires: ["error", { "allowCall": true }]*/

var async = require('async'),
    debug = require('diagnostics')('my-module'),
    eslint = require('eslint');
```

## Known Limitations

* The implementation is not aware of any local functions with the name `require` that may shadow Node.js' global `require`.

* Internally, the list of core modules is retrieved via `require("repl")._builtinLibs`. If you use different versions of Node.js for ESLint and your application, the list of core modules for each version may be different.
  The above mentioned `_builtinLibs` property became available in 0.8, for earlier versions a hardcoded list of module names is used as a fallback. If your version of Node.js is older than 0.6 that list may be inaccurate.

## When Not To Use It

If you use a pattern such as [UMD][4] where the `require`d modules are not loaded in variable declarations, this rule will obviously do nothing for you.

[1]: https://nodejs.org/api/modules.html#modules_core_modules
[2]: https://nodejs.org/api/modules.html#modules_file_modules
[3]: https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
[4]: https://github.com/umdjs/umd
