# Disallow Invalid Regular Expressions (no-invalid-regexp)

This rule validates string arguments passed to the `RegExp` constructor.

## Rule Details

The following patterns are considered problems:

```js
/*eslint no-invalid-regexp: 2*/

RegExp('[')

RegExp('.', 'z')

new RegExp('\\')
```

The following patterns are not considered problems:

```js
/*eslint no-invalid-regexp: 2*/

RegExp('.')

new RegExp

this.RegExp('[')
```

## Environments

ECMAScript 6 adds the "u" ([unicode](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.unicode)) and "y" ([sticky](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.sticky)) flags. You can enable these to be recognized as valid by setting the ECMAScript version to 6 in your [ESLint configuration](../user-guide/configuring).

## Further Reading

* [Annotated ES5 §7.8.5 - Regular Expression Literals](http://es5.github.io/#x7.8.5)
