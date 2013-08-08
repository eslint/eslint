# grouped-requires
In the Node.JS community it is often customary to group the `require`d modules at the top of a file. Sometimes it is even wanted that they are sorted alphabetically.

#### Nomenclature
This rule distinguishes between six kinds of variable declaration types:
 - `core`: declaration of a required [core module][1]
 - `file`: declaration of a required [file module][2]
 - `module`: declaration of a required module from the [node_modules folder][3]
 - `unknown`: declaration of a required module whose type could not be determined
 - `uninitialized`: a declaration that is not initialized
 - `other`: any other kind of declaration

In this document, the first four types are summed up under the term **require declaration**.

##### Example
```javascript
var fs = require('fs'),        // "core"    \
    async = require('async'),  // "module"  |- these are "require declaration"s
    foo = require('./foo'),    // "file"    |
    bar = require('f' + 'oo'), // "unknown" /
    baz = 42,                  // "other"
    bam;                       // "uninitialized"
```

## Rule Details

When this rule is enabled, all top-level `var` statements must satisfy the following conditions:

 - either none or all variable declarations must be require declarations
 - all require declarations must be of the same type
 - the parameter for the call to `require` must be a simple string literal (see [allowUnknown](grouped-requires#allowunknown-default-false))
 - the module imports must be sorted alphabetically (see [enforceSorted](grouped-requires#enforcesorted-default-false))

The following patterns are considered okay and do not cause warnings:

```js
// only require declarations and they are all of type "core"
var eventEmitter = require('events').EventEmitter,
    util = require('util');

// only non-require declarations
var foo = 42,
    bar = 'baz';

// this is valid if the "allowUnknown" option is enabled
var fs = require('fs'),
    foo = require('foo' + 'bar');
```

The following patterns are considered warnings:

```js
// mixing core and module require declarations
var fs = require('fs'),
    async = require('async');

// mixing require and other declarations
var fs = require('fs'),
    i = 0;

// this is invalid if the "enforceSorted" option is enabled
var ftp = require('ftp'),
    async = require('async');

// ...and so is this
var FooWat = require('foo/wat'),
    FooBar = require('foo/bar');
```

### Options

This rule comes with sensible defaults and it is perfectly fine to just enable it like any other:

```js
{
    "grouped-requires": 1
}
```

If you need more fine tuning, `grouped-requires` comes with three config options:
```js
{
    "grouped-requires": [enabled:integer, {
        enforceSorted: boolean,
        allowUnknown: boolean,
        maxDepth: integer
    }]
}
```

##### enforceSorted (default: false)
If enabled, the required modules must be sorted alphabetically. The sort check respects file system structure, i.e. "a/b/c" must come before "a/c". Note that this only affects the order of the names of the required modules and not the names of the variables themselves.

##### allowUnknown (default: false)
If enabled, unknown require declarations are allowed. They are ignored when `enforceSorted` checks the correct sort order.

##### maxDepth (default: 1)
By default only top-level variable declarations are checked. You can change this behavior by setting this option so that all declarations up to (and including) the specified depth are validated. Each language construct that creates a scope (e.g., `FunctionExpression`) increases the depth counter by one. Set to 0 to enforce the rule at any depth.


## When Not To Use It
Internally, the list of core modules is retrieved via `require("repl")._builtinLibs`. If you use different versions of Node.JS for eslint and your application, `grouped-requires` may not be able to reliably determine whether a module is a core modules.

If you use file names with non-english characters the sorting logic may not work as expected.

If you use a pattern such as [UMD][4] where the `require`d modules are not loaded in variable declarations, `grouped-requires` will obviously do nothing for you.


[1]: http://nodejs.org/api/modules.html#modules_core_modules
[2]: http://nodejs.org/api/modules.html#modules_file_modules
[3]: http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
[4]: https://github.com/umdjs/umd
