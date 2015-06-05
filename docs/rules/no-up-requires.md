# Disallow Up Requires (no-up-requires)

It is sometimes customary to keep the file structure of your modules representative of the dependency tree structure in the module and never `require` to the parent directory. This rule helps you enforce this convention.

## Rule Details

When this rule is enabled, all `require` statements must not include references to the parent directory `..`.

## Examples

The following patterns are considered warnings:

```js
require('../foo');

var foo = require('../foo');

var bar = require('./../bar');
```
