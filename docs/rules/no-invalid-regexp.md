# disallow invalid regular expression strings in `RegExp` constructors (no-invalid-regexp)

An invalid pattern in a regular expression literal is a `SyntaxError` when the code is parsed, but an invalid string in `RegExp` constructors throws a `SyntaxError` only when the code is executed.

## Rule Details

This rule disallows invalid regular expression strings in `RegExp` constructors.

Examples of **incorrect** code for this rule:

```js
/*eslint no-invalid-regexp: "error"*/

RegExp('[')

RegExp('.', 'z')

new RegExp('\\')
```

Examples of **correct** code for this rule:

```js
/*eslint no-invalid-regexp: "error"*/

RegExp('.')

new RegExp

this.RegExp('[')
```

## Environments

ECMAScript 6 adds the following flag arguments to the `RegExp` constructor:

* `"u"` ([unicode](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.unicode))
* `"y"` ([sticky](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-get-regexp.prototype.sticky))

You can enable these to be recognized as valid by setting the ECMAScript version to 6 in your [ESLint configuration](../user-guide/configuring).

If you want to allow additional constructor flags for any reason, you can specify them using an `allowConstructorFlags` option in `.eslintrc`. These flags will then be ignored by the rule regardless of the `ecmaVersion` setting.

## Options

This rule has an object option for exceptions:

* `"allowConstructorFlags"` is an array of flags

### allowConstructorFlags

Examples of **correct** code for this rule with the `{ "allowConstructorFlags": ["u", "y"] }` option:

```js
/*eslint no-invalid-regexp: ["error", { "allowConstructorFlags": ["u", "y"] }]*/

new RegExp('.', 'y')

new RegExp('.', 'yu')
```

## Further Reading

* [Annotated ES5 §7.8.5 - Regular Expression Literals](https://es5.github.io/#x7.8.5)
