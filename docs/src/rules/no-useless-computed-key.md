---
title: no-useless-computed-key
rule_type: suggestion
---



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

::: incorrect

```js
/*eslint no-useless-computed-key: "error"*/

var a = { ['0']: 0 };
var a = { ['0+1,234']: 0 };
var a = { [0]: 0 };
var a = { ['x']: 0 };
var a = { ['x']() {} };

class Foo {
    ["foo"] = "bar";

    [0]() {}
    ['a']() {}
    get ['b']() {}
    set ['c'](value) {}

    static ["foo"] = "bar";

    static ['a']() {}
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-useless-computed-key: "error"*/

var c = { 'a': 0 };
var c = { 0: 0 };
var a = { x() {} };
var c = { a: 0 };
var c = { '0+1,234': 0 };

class Foo {
    "foo" = "bar";

    0() {}
    'a'() {}
    get 'b'() {}
    set 'c'(value) {}

    static "foo" = "bar";

    static 'a'() {}
}
```

:::

Examples of additional **correct** code for this rule:

::: correct

```js
/*eslint no-useless-computed-key: "error"*/

var c = {
    "__proto__": foo, // defines object's prototype

    ["__proto__"]: bar // defines a property named "__proto__"
};

class Foo {
    ["constructor"]; // instance field named "constructor"

    "constructor"() {} // the constructor of this class

    ["constructor"]() {} // method named "constructor"

    static ["constructor"]; // static field named "constructor"

    static ["prototype"]; // runtime error, it would be a parsing error without `[]`
}
```

:::

## Options

This rule has an object option:

* `enforceForClassMembers` set to `false` disables this rule for class members (Default `true`).

### enforceForClassMembers

By default, this rule also checks class declarations and class expressions,
as the default value for `enforceForClassMembers` is `true`.

When `enforceForClassMembers` is set to `false`, the rule will allow unnecessary computed keys inside of class fields, class methods, class getters, and class setters.

Examples of **incorrect** code for this rule with the `{ "enforceForClassMembers": false }` option:

::: incorrect

```js
/*eslint no-useless-computed-key: ["error", { "enforceForClassMembers": false }]*/

const obj = {
    ["foo"]: "bar",
    [42]: "baz",

    ['a']() {},
    get ['b']() {},
    set ['c'](value) {}
};
```

:::

Examples of **correct** code for this rule with the `{ "enforceForClassMembers": false }` option:

::: correct

```js
/*eslint no-useless-computed-key: ["error", { "enforceForClassMembers": false }]*/

class SomeClass {
    ["foo"] = "bar";
    [42] = "baz";

    ['a']() {}
    get ['b']() {}
    set ['c'](value) {}

    static ["foo"] = "bar";
    static ['baz']() {}
}
```

:::

## When Not To Use It

If you don't want to be notified about unnecessary computed property keys, you can safely disable this rule.
