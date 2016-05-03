# disallow empty character classes in regular expressions (no-empty-character-class)

Because empty character classes in regular expressions do not match anything, they might be typing mistakes.

```js
var foo = /^abc[]/;
```

## Rule Details

This rule disallows empty character classes in regular expressions.

Examples of **incorrect** code for this rule:

```js
/*eslint no-empty-character-class: "error"*/

/^abc[]/.test("abcdefg"); // false
"abcdefg".match(/^abc[]/); // null
```

Examples of **correct** code for this rule:

```js
/*eslint no-empty-character-class: "error"*/

/^abc/.test("abcdefg"); // true
"abcdefg".match(/^abc/); // ["abc"]

/^abc[a-z]/.test("abcdefg"); // true
"abcdefg".match(/^abc[a-z]/); // ["abcd"]
```

## Known Limitations

This rule does not report empty character classes in the string argument of calls to the `RegExp` constructor.

Example of a *false negative* when this rule reports correct code:

```js
/*eslint no-empty-character-class: "error"*/

var abcNeverMatches = new RegExp("^abc[]");
```
