# Disallow unnecessary computed property keys on objects (no-useless-computed-key)

It's unnecessary to use computed properties with literals such as:

```js
var foo = {["a"]: "b"};
```

The code can be rewritten as:

```js
var foo = {"a": "b"};
```

## Rule Details

This rule disallows unnecessary usage of computed property keys.

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint no-useless-computed-key: "error"*/
/*eslint-env es6*/

var a = { ['0']: 0 };
var a = { ['0+1,234']: 0 };
var a = { [0]: 0 };
var a = { ['x']: 0 };
var a = { ['x']() {} };
```

Examples of **correct** code for this rule:

```js
/*eslint no-useless-computed-key: "error"*/

var c = { 'a': 0 };
var c = { 0: 0 };
var a = { x() {} };
var c = { a: 0 };
var c = { '0+1,234': 0 };
```

## When Not To Use It

If you don't want to be notified about unnecessary computed property keys, you can safely disable this rule.
