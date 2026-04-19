---
title: arrow-body-style
rule_type: suggestion
---

Arrow functions have two syntactic forms for their function bodies.  They may be defined with a *block* body (denoted by curly braces) `() => { ... }` or with a single expression `() => ...`, whose value is implicitly returned.

## Rule Details

This rule can enforce or disallow the use of braces around arrow function body.

## Options

The rule takes one or two options. The first is a string, which can be:

* `"always"` enforces braces around the function body
* `"as-needed"` enforces no braces where they can be omitted (default)
* `"never"` enforces no braces around the function body (constrains arrow functions to the role of returning an expression)

The second one is an object for more fine-grained configuration when the first option is `"as-needed"`. Currently, the only available option is `requireReturnForObjectLiteral`, a boolean property. It's `false` by default. If set to `true`, it requires braces and an explicit return for object literals.

```json
"arrow-body-style": ["error", "always"]
```

### always

Examples of **incorrect** code for this rule with the `"always"` option:

:::incorrect

```js
/*eslint arrow-body-style: ["error", "always"]*/

const foo = () => 0;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

:::correct

```js
/*eslint arrow-body-style: ["error", "always"]*/

const foo = () => {
    return 0;
};

const bar = (retv, name) => {
    retv[name] = true;
    return retv;
};
```

:::

### as-needed

Examples of **incorrect** code for this rule with the default `"as-needed"` option:

:::incorrect

```js
/*eslint arrow-body-style: ["error", "as-needed"]*/

const foo = () => {
    return 0;
};

const bar = () => {
    return {
       bar: {
            foo: 1,
            bar: 2,
        }
    };
};
```

:::

Examples of **correct** code for this rule with the default `"as-needed"` option:

:::correct

```js
/*eslint arrow-body-style: ["error", "as-needed"]*/

const foo1 = () => 0;

const foo2 = (retv, name) => {
    retv[name] = true;
    return retv;
};

const foo3 = () => ({
    bar: {
        foo: 1,
        bar: 2,
    }
});

const foo4 = () => { bar(); };
const foo5 = () => {};
const foo6 = () => { /* do nothing */ };

const foo7 = () => {
    // do nothing.
};

const foo8 = () => ({ bar: 0 });
```

:::

#### requireReturnForObjectLiteral

> This option is only applicable when used in conjunction with the `"as-needed"` option.

Examples of **incorrect** code for this rule with the `{ "requireReturnForObjectLiteral": true }` option:

:::incorrect

```js
/*eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }]*/

const foo = () => ({});

const bar = () => ({ bar: 0 });
```

:::

Examples of **correct** code for this rule with the `{ "requireReturnForObjectLiteral": true }` option:

:::correct

```js
/*eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }]*/

const foo = () => {};

const bar = () => { return { bar: 0 }; };
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

:::incorrect

```js
/*eslint arrow-body-style: ["error", "never"]*/

const foo = () => {
    return 0;
};

const bar = (retv, name) => {
    retv[name] = true;
    return retv;
};
```

:::

Examples of **correct** code for this rule with the `"never"` option:

:::correct

```js
/*eslint arrow-body-style: ["error", "never"]*/

const foo = () => 0;

const bar = () => ({ foo: 0 });
```

:::
