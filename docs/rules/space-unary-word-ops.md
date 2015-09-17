# Require spaces following unary word operators (space-unary-word-ops)

**Replacement notice**: This rule was removed and has been replaced by the [space-unary-ops](space-unary-ops.md) rule.

Require spaces following unary word operators.

## Rule Details

The following patterns are considered problems:

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

The following patterns are not considered problems:

```js
delete a.b
```

```js
new C
```

```js
void 0
```
