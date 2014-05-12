# Disallow Node modules (no-restricted-modules)

Disallowing usage of specific node modules can be useful if you want to control the available methods, a developer can
use, to implement a feature.

This way you can block usage of the `fs` module if you want disallow file system access.
Blocking the `os` module can be useful if you don't want to allow any operating system specific code.

## Rule Details

This rule allows you to specify modules that you don't want to use in your application.

The following patterns are considered warnings:

__config:__ `no-restricted-modules: [2, "fs"]`

```js
var fs = require('fs');
```

__config:__ `no-restricted-modules: [2, "cluster"]`

```js
var fs = require(' cluster ');
```

The following patterns are not warnings:

__config:__ `no-restricted-modules: [2, "fs"]`

```js
var crypto = require('crypto');
```

### Options

The syntax to specify restricted modules looks like this:

```js
"no-restricted-modules": [<enabled>, <...moduleNames>]
```

## Further reading

__Restrict usage of all Node.js core modules__

<!-- via https://github.com/joyent/node/tree/master/lib -->

```js
    "no-restricted-modules": [2,
         "assert","buffer","child_process","cluster","crypto","dgram","dns","domain","events","freelist","fs","http","https","module","net","os","path","punycode","querystring","readline","repl","smalloc","stream","string_decoder","sys","timers","tls","tracing","tty","url","util","vm","zlib"
    ],
```
