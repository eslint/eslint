# Disallow Node.js modules (no-restricted-modules)

Disallowing usage of specific Node.js modules can be useful if you want to control the available methods, a developer can
use, to implement a feature.

This way you can block usage of the `fs` module if you want disallow file system access.
Blocking the `os` module can be useful if you don't want to allow any operating system specific code.

## Rule Details

This rule allows you to specify modules that you don't want to use in your application.

## Options

The rule takes one or more strings as options: the names of restricted modules.

For example, to restrict the use of all Node.js core modules (via https://github.com/nodejs/node/tree/master/lib):

```json
{
    "no-restricted-modules": ["error",
        "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ]
}
```

Examples of **incorrect** code for this rule with sample `"fs", "cluster"` restricted modules:

```js
/*eslint no-restricted-modules: ["error", "fs", "cluster"]*/

var fs = require('fs');
var cluster = require(' cluster ');
```

Examples of **correct** code for this rule with sample `"fs", "cluster"` restricted modules:

```js
/*eslint no-restricted-modules: ["error", "fs", "cluster"]*/

var crypto = require('crypto');
```
