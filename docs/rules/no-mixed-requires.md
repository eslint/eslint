# Disallow Mixed Requires (no-mixed-requires)

In the Node.JS community it is often customary to separate the `require`d modules from other variable declarations, sometimes also grouping them by their type. This rule helps you enforce this convention.

## Rule Details

When this rule is enabled, all `var` statements must satisfy the following conditions:

* either none or all variable declarations must be require declarations
* all require declarations must be of the same type (optional)

### Options

This rule comes with option called `grouping` which is turned off by default. You can set it in your `eslint.json`:

```json
{
    "no-mixed-requires": [1, {"grouping": true}]
}
```

The second way to configure this rule is with boolean (This way of setting is deprecated).

```json
{
    "no-mixed-requires": [1, true]
}
```

If enabled, violations will be reported whenever a single `var` statement contains require declarations of mixed types (see the examples below).

### Nomenclature

This rule distinguishes between six kinds of variable declaration types:

* `core`: declaration of a required [core module][1]
* `file`: declaration of a required [file module][2]
* `module`: declaration of a required module from the [node_modules folder][3]
* `computed`: declaration of a required module whose type could not be determined (either because it is computed or because require was called without an argument)
* `uninitialized`: a declaration that is not initialized
* `other`: any other kind of declaration

In this document, the first four types are summed up under the term *require declaration*.

#### Example

```javascript
var fs = require('fs'),        // "core"     \
    async = require('async'),  // "module"   |- these are "require declaration"s
    foo = require('./foo'),    // "file"     |
    bar = require(getName()),  // "computed" /
    baz = 42,                  // "other"
    bam;                       // "uninitialized"
```

## Examples

The following patterns are not considered problems:

```js
/*eslint no-mixed-requires: 2*/

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

The following patterns are considered problems:

```js
/*eslint no-mixed-requires: 2*/

var fs = require('fs'), /*error Do not mix 'require' and other declarations.*/
    i = 0;
```

The following patterns are considered problems when grouping is turned on:

```js
/*eslint no-mixed-requires: [2, {"grouping": true}]*/

// invalid because of mixed types "core" and "file"
var fs = require('fs'),                /*error Do not mix core, module, file and computed requires.*/
    async = require('async');

// invalid because of mixed types "file" and "unknown"
var foo = require('foo'),              /*error Do not mix core, module, file and computed requires.*/
    bar = require(getBarModuleName());
```


## When Not To Use It

Internally, the list of core modules is retrieved via `require("repl")._builtinLibs`. If you use different versions of Node.JS for ESLint and your application, the list of core modules for each version may be different.
The above mentioned `_builtinLibs` property became available in 0.8, for earlier versions a hardcoded list of module names is used as a fallback. If your version of Node is older than 0.6 that list may be inaccurate.

If you use a pattern such as [UMD][4] where the `require`d modules are not loaded in variable declarations, this rule will obviously do nothing for you.

The implementation is not aware of any local functions with the name `require` that may shadow Node's global `require`.

[1]: http://nodejs.org/api/modules.html#modules_core_modules
[2]: http://nodejs.org/api/modules.html#modules_file_modules
[3]: http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
[4]: https://github.com/umdjs/umd
