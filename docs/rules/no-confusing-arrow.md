# Disallow arrow functions where they could be confused with comparisons (no-confusing-arrow)

Arrow functions (`=>`) are similar in syntax to some comparison operators (`>`, `<`, `<=`, and `>=`). This rule warns against using the arrow function syntax in places where it could be confused with a comparison operator. Even if the arguments of the arrow function are wrapped with parens, this rule still warns about it.

Here's an example where the usage of `=>` could be confusing:

```js
// The intent is not clear
var x = a => 1 ? 2 : 3
// Did the author mean this
var x = function (a) { return a >= 1 ? 2 : 3 }
// Or this
var x = a <= 1 ? 2 : 3
```

## Rule Details

The following patterns are considered warnings:

```js
/*eslint no-confusing-arrow: 2*/
/*eslint-env es6*/

var x = a => 1 ? 2 : 3
var x = (a) => 1 ? 2 : 3
```

The following patterns are not considered warnings:

```js
/*eslint no-confusing-arrow: 2*/
/*eslint-env es6*/

var x = a => { return 1 ? 2 : 3; }
var x = (a) => { return 1 ? 2 : 3; }
```

## Related Rules

* [no-constant-condition](no-constant-condition.md)
* [arrow-parens](arrow-parens.md)
