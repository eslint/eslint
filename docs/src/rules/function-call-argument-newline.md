---
title: function-call-argument-newline
rule_type: layout
related_rules:
- function-paren-newline
- func-call-spacing
- object-property-newline
- array-element-newline
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/function-call-argument-newline) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

A number of style guides require or disallow line breaks between arguments of a function call.

## Rule Details

This rule enforces line breaks between arguments of a function call.

## Options

This rule has a string option:

* `"always"` (default) requires line breaks between arguments
* `"never"` disallows line breaks between arguments
* `"consistent"` requires consistent usage of line breaks between arguments

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint function-call-argument-newline: ["error", "always"]*/

foo("one", "two", "three");

bar("one", "two", {
    one: 1,
    two: 2
});

baz("one", "two", (x) => {
    console.log(x);
});
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint function-call-argument-newline: ["error", "always"]*/

foo(
    "one",
    "two",
    "three"
);

bar(
    "one",
    "two",
    { one: 1, two: 2 }
);
// or
bar(
    "one",
    "two",
    {
        one: 1,
        two: 2
    }
);

baz(
    "one",
    "two",
    (x) => {
        console.log(x);
    }
);
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint function-call-argument-newline: ["error", "never"]*/

foo(
    "one",
    "two", "three"
);

bar(
    "one",
    "two", {
        one: 1,
        two: 2
    }
);

baz(
    "one",
    "two", (x) => {
        console.log(x);
    }
);
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint function-call-argument-newline: ["error", "never"]*/

foo("one", "two", "three");
// or
foo(
    "one", "two", "three"
);

bar("one", "two", { one: 1, two: 2 });
// or
bar("one", "two", {
    one: 1,
    two: 2
});

baz("one", "two", (x) => {
    console.log(x);
});
```

:::

### consistent

Examples of **incorrect** code for this rule with the `"consistent"` option:

::: incorrect

```js
/*eslint function-call-argument-newline: ["error", "consistent"]*/

foo("one", "two",
    "three");
//or
foo("one",
    "two", "three");

bar("one", "two",
    { one: 1, two: 2}
);

baz("one", "two",
    (x) => { console.log(x); }
);
```

:::

Examples of **correct** code for this rule with the `"consistent"` option:

::: correct

```js
/*eslint function-call-argument-newline: ["error", "consistent"]*/

foo("one", "two", "three");
// or
foo(
    "one",
    "two",
    "three"
);

bar("one", "two", {
    one: 1,
    two: 2
});
// or
bar(
    "one",
    "two",
    { one: 1, two: 2 }
);
// or
bar(
    "one",
    "two",
    {
        one: 1,
        two: 2
    }
);

baz("one", "two", (x) => {
    console.log(x);
});
// or
baz(
    "one",
    "two",
    (x) => {
        console.log(x);
    }
);
```

:::

## When Not To Use It

If you don't want to enforce line breaks between arguments, don't enable this rule.
