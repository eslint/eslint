# Require Object Literal Shorthand Syntax (object-shorthand)

ECMAScript 6 provides a concise form for defining object literal methods and properties. This
syntax can make defining complex object literals much cleaner.

Here are a few common examples using the ES5 syntax:

```js
// properties
var foo = {
    x: x,
    y: y,
    z: z,
};

// methods
var foo = {
    a: function() {},
    b: function() {}
};
```

Now here are ES6 equivalents:

```js
/*eslint-env es6*/

// properties
var foo = {x, y, z};

// methods
var foo = {
    a() {},
    b() {}
};
```

## Rule Details

This rule enforces the use of the shorthand syntax. This applies
to all methods (including generators) defined in object literals and any
properties defined where the key name matches name of the assigned variable.

Each of the following properties would warn:


```js
/*eslint object-shorthand: "error"*/
/*eslint-env es6*/

var foo = {
    w: function() {},
    x: function *() {},
    [y]: function() {},
    z: z
};
```

In that case the expected syntax would have been:

```js
/*eslint object-shorthand: "error"*/
/*eslint-env es6*/

var foo = {
    w() {},
    *x() {},
    [y]() {},
    z
};
```

This rule does not flag arrow functions inside of object literals.
The following will *not* warn:

```js
/*eslint object-shorthand: "error"*/
/*eslint-env es6*/

var foo = {
    x: (y) => y
};
```

See Also:

- [`no-useless-rename`](https://eslint.org/docs/rules/no-useless-rename) which disallows renaming import, export, and destructured assignments to the same name.

## Options

The rule takes an option which specifies when it should be applied. It can be set to one of the following values:

- `"always"` (default) expects that the shorthand will be used whenever possible.
- `"methods"` ensures the method shorthand is used (also applies to generators).
- `"properties"` ensures the property shorthand is used (where the key and variable name match).
- `"never"` ensures that no property or method shorthand is used in any object literal.
- `"consistent"` ensures that either all shorthand or all long-form will be used in an object literal.
- `"consistent-as-needed"` ensures that either all shorthand or all long-form will be used in an object literal, but ensures all shorthand whenever possible.

You can set the option in configuration like this:

```json
{
    "object-shorthand": ["error", "always"]
}
```

Additionally, the rule takes an optional object configuration:

- `"avoidQuotes": true` indicates that long-form syntax is preferred whenever the object key is a string literal (default: `false`). Note that this option can only be enabled when the string option is set to `"always"`, `"methods"`, or `"properties"`.
- `"ignoreConstructors": true` can be used to prevent the rule from reporting errors for constructor functions. (By default, the rule treats constructors the same way as other functions.) Note that this option can only be enabled when the string option is set to `"always"` or `"methods"`.
- `"avoidExplicitReturnArrows": true` indicates that methods are preferred over explicit-return arrow functions for function properties. (By default, the rule allows either of these.) Note that this option can only be enabled when the string option is set to `"always"` or `"methods"`.

### `avoidQuotes`

```json
{
    "object-shorthand": ["error", "always", { "avoidQuotes": true }]
}
```

Example of **incorrect** code for this rule with the `"always", { "avoidQuotes": true }` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidQuotes": true }]*/
/*eslint-env es6*/

var foo = {
    "bar-baz"() {}
};
```

Example of **correct** code for this rule with the `"always", { "avoidQuotes": true }` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidQuotes": true }]*/
/*eslint-env es6*/

var foo = {
    "bar-baz": function() {},
    "qux": qux
};
```

### `ignoreConstructors`

```json
{
    "object-shorthand": ["error", "always", { "ignoreConstructors": true }]
}
```

Example of **correct** code for this rule with the `"always", { "ignoreConstructors": true }` option:

```js
/*eslint object-shorthand: ["error", "always", { "ignoreConstructors": true }]*/
/*eslint-env es6*/

var foo = {
    ConstructorFunction: function() {}
};
```

### `avoidExplicitReturnArrows`

```json
{
    "object-shorthand": ["error", "always", { "avoidExplicitReturnArrows": true }]
}
```

Example of **incorrect** code for this rule with the `"always", { "avoidExplicitReturnArrows": true }` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidExplicitReturnArrows": true }]*/
/*eslint-env es6*/

var foo = {
  foo: (bar, baz) => {
    return bar + baz;
  },

  qux: (foobar) => {
    return foobar * 2;
  }
};
```

Example of **correct** code for this rule with the `"always", { "avoidExplicitReturnArrows": true }` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidExplicitReturnArrows": true }]*/
/*eslint-env es6*/

var foo = {
  foo(bar, baz) {
    return bar + baz;
  },

  qux: foobar => foobar * 2
};
```

Example of **incorrect** code for this rule with the `"consistent"` option:

```js
/*eslint object-shorthand: [2, "consistent"]*/
/*eslint-env es6*/

var foo = {
    a,
    b: "foo",
};
```

Examples of **correct** code for this rule with the `"consistent"` option:

```js
/*eslint object-shorthand: [2, "consistent"]*/
/*eslint-env es6*/

var foo = {
    a: a,
    b: "foo"
};

var bar = {
    a,
    b,
};
```

Example of **incorrect** code with the `"consistent-as-needed"` option, which is very similar to `"consistent"`:

```js
/*eslint object-shorthand: [2, "consistent-as-needed"]*/
/*eslint-env es6*/

var foo = {
    a: a,
    b: b,
};
```

## When Not To Use It

Anyone not yet in an ES6 environment would not want to apply this rule. Others may find the terseness of the shorthand
syntax harder to read and may not want to encourage it with this rule.

## Further Reading

[Object initializer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
