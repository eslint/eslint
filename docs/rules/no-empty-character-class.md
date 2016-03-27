# Disallow Empty Character Classes (no-empty-character-class)

Empty character classes in regular expressions do not match anything and can result in code that may not work as intended.

```js
var foo = /^abc[]/;
```

## Rule Details

This rule is aimed at highlighting possible typos and unexpected behavior in regular expressions which may arise from the use of empty character classes.

Examples of **incorrect** code for this rule:

```js
/*eslint no-empty-character-class: "error"*/

var foo = /^abc[]/;

/^abc[]/.test(foo);

bar.match(/^abc[]/);
```

Examples of **correct** code for this rule:

```js
/*eslint no-empty-character-class: "error"*/

var foo = /^abc/;

var foo = /^abc[a-z]/;

var bar = new RegExp("^abc[]");
```

## Related Rules

* [no-empty-class](no-empty-class.md) (removed)
