# Disallow new require (no-new-require)

The `require` function is used to include modules that exist in separate files, such as:

```js
var appHeader = require('app-header');
```

Some modules return a constructor which can potentially lead to code such as:

```js
var appHeader = new require('app-header');
```

Unfortunately, this introduces a high potential for confusion since the code author likely meant to write:

```js
var appHeader = new (require('app-header'));
```

For this reason, it is usually best to disallow this particular expression.

## Rule Details

This rule aims to eliminate use of the `new require` expression. As such, it warns whenever `new require` is found in code.

The following pattern is considered a warning:

```js
/*eslint no-new-require: 2*/

var appHeader = new require('app-header'); /*error Unexpected use of new with require.*/
```

The following pattern is not a warning:

```js
/*eslint no-new-require: 2*/

var AppHeader = require('app-header');
```

## When Not To Use It

If you are using a custom implementation of `require` and your code will never be used in projects where a standard `require` (CommonJS, Node.js, AMD) is expected, you can safely turn this rule off.

