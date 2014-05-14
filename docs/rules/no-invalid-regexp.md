# Disallow Invalid Regular Expressions (no-invalid-regexp)

This rule validates string arguments passed to the `RegExp` constructor.

## Rule Details

The following patterns are considered warnings:

```js
RegExp('['])
```

```js
RegExp('.', 'z') // invalid flags
```

```js
new RegExp('\\')
```

The following patterns are not considered warnings:

```js
RegExp('.')
```

```js
new RegExp
```

```js
this.RegExp('[')
```

## Further Reading

* [Annotated ES5 §7.8.5 - Regular Expression Literals](http://es5.github.io/#x7.8.5)
