# Suggest using named capture group in regular expression (prefer-named-capture-group)

With the landing of ECMAScript 2018, named capture groups can be used in regular expressions, which can improve their readability.

```js
const regex = /(?<year>[0-9]{4})/;
```

## Rule Details

This rule is aimed at using named capture groups instead of numbered capture groups in regular expressions.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-named-capture-group: "error"*/

const foo = /(ba[rz])/;
const bar = new RegExp('(ba[rz])');
const baz = RegExp('(ba[rz])');

foo.exec('bar')[1]; // Retrieve the group result.
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-named-capture-group: "error"*/

const foo = /(?<id>ba[rz])/;
const bar = new RegExp('(?<id>ba[rz])');
const baz = RegExp('(?<id>ba[rz])');

foo.exec('bar').groups.id; // Retrieve the group result.
```

## When Not To Use It

If you are targeting ECMAScript 2017 and/or older environments, you can disable this rule, because this ECMAScript feature is only supported in ECMAScript 2018 and/or newer environments.

## Related Rules

* [no-invalid-regexp](./no-invalid-regexp.md)
