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

## New ECMAScript 6 Flags

ECMAScript 6 adds the "u" ([unicode](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.unicode)) and "y" ([sticky](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.sticky)) flags. You can enable these to be recognized as valid by adding the following to your `.eslintrc` file:

```js
"ecmaFeatures": {
  "regexYFlag": true,
  "regexUFlag": true
}
```

## Further Reading

* [Annotated ES5 §7.8.5 - Regular Expression Literals](http://es5.github.io/#x7.8.5)
