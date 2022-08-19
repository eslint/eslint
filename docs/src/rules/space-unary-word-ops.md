---
title: space-unary-word-ops
layout: doc

---

Requires spaces after unary word operators.

(removed) This rule was **removed** in ESLint v0.10.0 and **replaced** by the [space-unary-ops](space-unary-ops) rule.

Require spaces following unary word operators.

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```js
typeof!a
```

:::

::: incorrect

```js
void{a:0}
```

:::

::: incorrect

```js
new[a][0]
```

:::

::: incorrect

```js
delete(a.b)
```

:::

Examples of **correct** code for this rule:

::: correct

```js
delete a.b
```

:::

::: correct

```js
new C
```

:::

::: correct

```js
void 0
```

:::
