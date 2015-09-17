# Require IIFEs to be Wrapped (wrap-iife)

Require immediate function invocation to be wrapped in parentheses.

```js
var x = function () { return { y: 1 };}();
```

## Rule Details

Since function statements cannot be immediately invoked, and function expressions can be, a common technique to create an immediately-invoked function expression is to simply wrap a function statement in parentheses. The opening parentheses causes the contained function to be parsed as an expression, rather than a declaration.

### Options

The rule takes one option which can enforce a consistent wrapping style. The default is `outside`.

```json
"wrap-iife": [2, "outside"]
```

This configures the rule to enforce wrapping always the call expression.

```json
"wrap-iife": [2, "inside"]
```

This configures the rule to enforce wrapping always the function expression.

```json
"wrap-iife": [2, "any"]
```

This allows any wrapping style.

The following patterns are considered problems:

```js
/*eslint wrap-iife: 2*/

var x = function () { return { y: 1 };}(); /*error Wrap an immediate function invocation in parentheses.*/
```

```js
/*eslint wrap-iife: [2, "outside"]*/

var x = (function () { return { y: 1 };})(); /*error Move the invocation into the parens that contain the function.*/
```

```js
/*eslint wrap-iife: [2, "inside"]*/

var x = (function () { return { y: 1 };}()); /*error Wrap only the function expression in parens.*/
```

The following patterns are not considered problems:

```js
/*eslint wrap-iife: [2, "inside"]*/

var x = (function () { return { y: 1 };})();
```

```js
/*eslint wrap-iife: [2, "outside"]*/

var x = (function () { return { y: 1 };}());
```
