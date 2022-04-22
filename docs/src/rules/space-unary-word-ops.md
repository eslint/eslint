---
title: space-unary-word-ops
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/space-unary-word-ops.md

---

Requires spaces after unary word operators.

(removed) This rule was **removed** in ESLint v0.10.0 and **replaced** by the [space-unary-ops](space-unary-ops) rule.

Require spaces following unary word operators.

## Rule Details

Examples of **incorrect** code for this rule:

```js
typeof!a
```

```js
void{a:0}
```

```js
new[a][0]
```

```js
delete(a.b)
```

Examples of **correct** code for this rule:

```js
delete a.b
```

```js
new C
```

```js
void 0
```
