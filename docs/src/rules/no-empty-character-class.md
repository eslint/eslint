---
title: no-empty-character-class
rule_type: problem
---



Because empty character classes in regular expressions do not match anything, they might be typing mistakes.

```js
var foo = /^abc[]/;
```

## Rule Details

This rule disallows empty character classes in regular expressions.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-empty-character-class: "error"*/

/^abc[]/.test("abcdefg"); // false
"abcdefg".match(/^abc[]/); // null

/^abc[[]]/v.test("abcdefg"); // false
"abcdefg".match(/^abc[[]]/v); // null

/^abc[[]--[x]]/v.test("abcdefg"); // false
"abcdefg".match(/^abc[[]--[x]]/v); // null

/^abc[[d]&&[]]/v.test("abcdefg"); // false
"abcdefg".match(/^abc[[d]&&[]]/v); // null

const regex = /^abc[d[]]/v;
regex.test("abcdefg"); // true, the nested `[]` has no effect
"abcdefg".match(regex); // ["abcd"]
regex.test("abcefg"); // false, the nested `[]` has no effect
"abcefg".match(regex); // null
regex.test("abc"); // false, the nested `[]` has no effect
"abc".match(regex); // null
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-empty-character-class: "error"*/

/^abc/.test("abcdefg"); // true
"abcdefg".match(/^abc/); // ["abc"]

/^abc[a-z]/.test("abcdefg"); // true
"abcdefg".match(/^abc[a-z]/); // ["abcd"]

/^abc[^]/.test("abcdefg"); // true
"abcdefg".match(/^abc[^]/); // ["abcd"]
```

:::

## Known Limitations

This rule does not report empty character classes in the string argument of calls to the `RegExp` constructor.

Example of a *false negative* when this rule reports correct code:

```js
/*eslint no-empty-character-class: "error"*/

var abcNeverMatches = new RegExp("^abc[]");
```
