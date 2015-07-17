# disallow the use of `for (x in y) {}` statements (no-for-in)

The for-in statement is usually not the right tool.  In environments which are
using ES6 for-of might find that switching between other scripting languages
and javascript might cause them to accidentally use for-in instead of for-of.

```js
var numbers = [5, 6, 7];

for (var x in numbers) {
  console.log(x);
}
// This prints:
// 0
// 1
// 2

for (var x of numbers) {
  console.log(x);
}

// This prints:
// 4
// 5
// 6

```

## Rule Details

This rule is designed to catch inadvertent uses of the for-in statement.  Its
uses in modern javascript are limited.  With most other scripting language
using for-in to do what the ES6 for-of does, it's highly likely that usages of
for-in are accidental

The following patterns are considered warnings:

```js
for (x in y) { }
```

## When Not To Use It

If you understand and truely do want to use for-in

