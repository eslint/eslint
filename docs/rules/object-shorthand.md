# Require Object Literal Shorthand Syntax (object-shorthand)

EcmaScript 6 provides a concise form for defining object literal methods and properties. This
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

## Options

The rule takes an option which specifies when it should be applied. It can be set to
"always", "properties", "methods", or "never". The default is "always".

* `"always"` expects that the shorthand will be used whenever possible.
* `"methods"` ensures the method shorthand is used (also applies to generators).
* `"properties` ensures the property shorthand is used (where the key and variable name match).
* `"never"` ensures that no property or method shorthand is used in any object literal.

You can set the option in configuration like this:

```json
{
    "object-shorthand": ["error", "always"]
}
```

While set to `"always"`, `"methods"`, or `"properties"`, shorthand syntax using string literal keys can be ignored using the optional parameter `"avoidQuotes"`. This will make it so longform syntax is preferred whenever the object key is a string literal. Note: The first parameter must be specified when using this optional parameter.

```json
{
    "object-shorthand": ["error", "always", { "avoidQuotes": true }]
}
```

Examples of **incorrect** code for this rule with the `"avoidQuotes"` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidQuotes": true }]*/
/*eslint-env es6*/

var foo = {
    "bar-baz"() {}
};
```

Examples of **correct** code for this rule with the `"avoidQuotes"` option:

```js
/*eslint object-shorthand: ["error", "always", { "avoidQuotes": true }]*/
/*eslint-env es6*/

var foo = {
    "bar-baz": function() {},
    "qux": qux
};
```

While set to `"always"` or `"methods"`, constructor functions can be ignored with the optional parameter `"ignoreConstructors"` enabled. Note: The first parameter must be specified when using this optional parameter.

```json
{
    "object-shorthand": ["error", "always", { "ignoreConstructors": true }]
}
```

The following will *not* warn when `"ignoreConstructors"` is enabled:

```js
/*eslint object-shorthand: ["error", "always", { "ignoreConstructors": true }]*/
/*eslint-env es6*/

var foo = {
    ConstructorFunction: function() {}
};
```

## When Not To Use It

Anyone not yet in an ES6 environment would not want to apply this rule. Others may find the terseness of the shorthand
syntax harder to read and may not want to encourage it with this rule.

## Further Reading

[Object initializer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
