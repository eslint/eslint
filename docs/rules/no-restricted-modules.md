# Disallow Node modules (no-restricted-modules)

Disallowing usage of specific node modules can be useful if you want to control the available methods, a developer can
use, to implement a feature.

This way you can block usage of the `fs` module if you want disallow file system access.
Blocking the `os` module can be useful if you don't want to allow any operating system specific code.

## Rule Details

This rule allows you to specify modules that you don't want to use in your application.

### Options

The syntax to specify restricted modules looks like this:

```json
"no-restricted-modules": [2, <...moduleNames>]
```

The following patterns are considered problems:

```js
/*eslint no-restricted-modules: [2, "fs"]*/

var fs = require('fs'); /*error 'fs' module is restricted from being used.*/
```

```js
/*eslint no-restricted-modules: [2, "cluster"]*/

var fs = require(' cluster '); /*error 'cluster' module is restricted from being used.*/
```

The following patterns are not considered problems:

```js
/*eslint no-restricted-modules: [2, "fs"]*/

var crypto = require('crypto');
```

### Examples

To restrict the use of all Node.js core modules (via https://github.com/joyent/node/tree/master/lib):

```json
    "no-restricted-modules": [2,
         "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ],
```
