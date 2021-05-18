# no-arrow-condition: disallow arrow functions where test conditions are expected

(removed) This rule was **removed** in ESLint v2.0 and **replaced** by a combination of the [no-confusing-arrow](no-confusing-arrow.md) and [no-constant-condition](no-constant-condition.md) rules.

Arrow functions (`=>`) are similar in syntax to some comparison operators (`>`, `<`, `<=`, and `>=`). This rule warns against using the arrow function syntax in places where a condition is expected. Even if the arguments of the arrow function are wrapped with parens, this rule still warns about it.

Here's an example where the usage of `=>` is most likely a typo:

```js
// This is probably a typo
if (a => 1) {}
// And should instead be
if (a >= 1) {}
```

There are also cases where the usage of `=>` can be ambiguous and should be rewritten to more clearly show the author's intent:

```js
// The intent is not clear
var x = a => 1 ? 2 : 3
// Did the author mean this
var x = function (a) { return a >= 1 ? 2 : 3 }
// Or this
var x = a <= 1 ? 2 : 3
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint no-arrow-condition: "error"*/
/*eslint-env es6*/

if (a => 1) {}
while (a => 1) {}
for (var a = 1; a => 10; a++) {}
a => 1 ? 2 : 3
(a => 1) ? 2 : 3
var x = a => 1 ? 2 : 3
var x = (a) => 1 ? 2 : 3
```

## Related Rules

* [arrow-parens](arrow-parens.md)
* [no-confusing-arrow](no-confusing-arrow.md)
* [no-constant-condition](no-constant-condition.md)
