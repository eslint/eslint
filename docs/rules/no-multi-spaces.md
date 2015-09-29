# Disallow multiple spaces (no-multi-spaces)

Multiple spaces in a row that are not used for indentation are typically mistakes. For example:

```js

if(foo  === "bar") {}

```

It's hard to tell, but there are two spaces between `foo` and `===`. Multiple spaces such as this are generally frowned upon in favor of single spaces:

```js

if(foo === "bar") {}

```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters.

The following patterns are considered problems:

```js
/*eslint no-multi-spaces: 2*/

var a =  1;            /*error Multiple spaces found before '1'.*/

if(foo   === "bar") {} /*error Multiple spaces found before '==='.*/

a <<  b                /*error Multiple spaces found before 'b'.*/

var arr = [1,  2];     /*error Multiple spaces found before '2'.*/

a ?  b: c              /*error Multiple spaces found before 'b'.*/
```

The following patterns are not considered problems:

```js
/*eslint no-multi-spaces: 2*/

var a = 1;

if(foo === "bar") {}

a << b

var arr = [1, 2];

a ? b: c
```

### Exceptions

Some rules, like key-spacing in one of its alignment modes, might require multiple spaces in some instances. To support this case, this rule accepts an options object with a property named `exceptions`. The `exceptions` object expects property names to be AST node types as defined by [ESTree](https://github.com/estree/estree). The easiest way to determine the node types for `exceptions` is to use the [online demo](http://eslint.org/parser).

You can ignore certain parts of your code by setting node types as properties on the `exceptions` object with a value of `true`. By default, all node types are `false` except for `Property`, which is `true` by default in order to skip properties.

With this option, The following patterns are not considered problems:

```js
/* eslint no-multi-spaces: 2 */
/* eslint key-spacing: [2, { align: "value" }] */

var obj = {
    first:  "first",
    second: "second"
};
```

```js
/* eslint no-multi-spaces: [2, { exceptions: { "BinaryExpression": true } }] */
var a = 1  *  2;
```

The default `Property` exception can be disabled by setting it to `false`, so the following pattern is considered a warning:

```js
/* eslint no-multi-spaces: [2, { exceptions: { "Property": false } }] */
/* eslint key-spacing: [2, { align: "value" }] */

var obj = {
    first:  "first",  /*error Multiple spaces found before '"first"'.*/
    second: "second"
};
```

You may wish to align variable declarations or import declarations with spaces. You can add exceptions for these cases:

```js
/* eslint no-multi-spaces: [2, { exceptions: { "VariableDeclarator": true } }] */

var someVar      = 'foo';
var someOtherVar = 'barBaz';
```

```
/* eslint no-multi-spaces: [2, { exceptions: { "ImportDeclaration": true } }] */

import mod          from 'mod';
import someOtherMod from 'some-other-mod';
```

## When Not To Use It

If you don't want to check and disallow multiple spaces, then you should turn this rule off.

## Related Rules

* [key-spacing](key-spacing.md)
* [space-infix-ops](space-infix-ops.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
* [space-in-parens](space-in-parens.md)
* [space-after-keywords](space-after-keywords)
* [space-unary-ops](space-unary-ops)
* [space-return-throw-case](space-return-throw-case)
