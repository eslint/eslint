# Disallow Node.js modules (no-restricted-modules)

Disallowing usage of specific Node.js modules can be useful if you want to control the available methods, a developer can
use, to implement a feature.

This way you can block usage of the `fs` module if you want to disallow file system access.
Blocking the `os` module can be useful if you don't want to allow any operating system specific code.

## Rule Details

This rule allows you to specify modules that you don't want to use in your application.

## Options

The rule takes one or more strings as options: the names of restricted modules.

It can also take an object with lists of "paths" and gitignore-style "patterns" strings.

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
var cluster = require('cluster');
```

```js
/*eslint no-restricted-modules: ["error", { "paths": ["cluster"] }]*/

var cluster = require('cluster');
```

```js
/*eslint no-restricted-modules: ["error", { "patterns": ["lodash/*"] }]*/

var cluster = require('lodash/pick');
```

Examples of **correct** code for this rule with sample `"fs", "cluster"` restricted modules:

```js
/*eslint no-restricted-modules: ["error", "fs", "cluster"]*/

var crypto = require('crypto');
```

```js
/*eslint no-restricted-modules: ["error", {
    "paths": ["fs", "cluster"],
    "patterns": ["lodash/*", "!lodash/pick"]
}]*/

var crypto = require('crypto');
var eslint = require('lodash/pick');
```
