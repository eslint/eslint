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
to all methods (including generators) defined on object literals and any
properties defined where the key name matches name of the assigned variable.

Each of the following properties would warn:


```js
/*eslint object-shorthand: 2*/
/*eslint-env es6*/

var foo = {
    x: function() {},   /*error Expected method shorthand.*/
    y: function *() {}, /*error Expected method shorthand.*/
    z: z                /*error Expected property shorthand.*/
};
```

In that case the expected syntax would have been:

```js
/*eslint object-shorthand: 2*/
/*eslint-env es6*/

var foo = {
    x() {},
    *y() {},
    z
};
```

This rule does not flag arrow functions inside of object literals.
The following will *not* warn:

```js
/*eslint object-shorthand: 2*/
/*eslint-env es6*/

var foo = {
    x: (y) => y
};
```

### Options

The rule takes an option which specifies when it should be applied. It can be set to
"always", "properties", "methods", or "never". The default is "always".

1. `"always"` expects that the shorthand will be used whenever possible.
2. `"methods"` ensures the method shorthand is used (also applies to generators).
3. `"properties` ensures the property shorthand is used (where the key and variable name match).
4. `"never"` ensures that no property or method shorthand is used in any object literal.

You can set the option in configuration like this:

```json
"object-shorthand": [2, "always"]
```

## When Not To Use It

Anyone not yet in an ES6 environment would not want to apply this rule. Others may find the terseness of the shorthand
syntax harder to read and may not want to encourage it with this rule.

## Further Reading

[Object initializer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
