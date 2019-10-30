# Disallow unnecessary computed property keys in objects and classes (no-useless-computed-key)

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

## Options

This rule has an object option:

* `enforceForClassMembers` set to `true` additionally applies this rule to class members (Default `false`).

### enforceForClassMembers

By default, this rule does not check class declarations and class expressions,
as the default value for `enforceForClassMembers` is `false`.

When `enforceForClassMembers` is set to `true`, the rule will also disallow unnecessary computed
keys inside of class methods, getters and setters.

Examples of **incorrect** code for `{ "enforceForClassMembers": true }`:

```js
/*eslint no-useless-computed-key: ["error", { "enforceForClassMembers": true }]*/

class Foo {
    [0]() {}
    ['a']() {}
    get ['b']() {}
    set ['c'](value) {}

    static ['a']() {}
}
```

## When Not To Use It

If you don't want to be notified about unnecessary computed property keys, you can safely disable this rule.
