# Require Radix Parameter (radix)

When using the `parseInt()` function it is common to omit the second argument, the radix, and let the function try to determine from the first argument what type of number it is. By default, `parseInt()` will autodetect decimal and hexadecimal (via `0x` prefix). Prior to ECMAScript 5, `parseInt()` also autodetected octal literals, which caused problems because many developers assumed a leading `0` would be ignored.

This confusion led to the suggestion that you always use the radix parameter to `parseInt()` to eliminate unintended consequences. So instead of doing this:

```js
var num = parseInt("071");      // 57
```

Do this:

```js
var num = parseInt("071", 10);  // 71
```

ECMAScript 5 changed the behavior of `parseInt()` so that it no longer autodetects octal literals and instead treats them as decimal literals. However, the differences between hexadecimal and decimal interpretation of the first parameter causes many developers to continue using the radix parameter to ensure the string is interpreted in the intended way.

On the other hand, if the code is targeting only ES5-compliant environments passing the radix `10` may be redundant. In such a case you might want to disallow using such a radix.

## Rule Details

This rule is aimed at preventing the unintended conversion of a string to a number of a different base than intended or at preventing the redundant `10` radix if targeting modern environments only.

### Options

There are two options for this rule:

* `"always"` enforces providing a radix (default)
* `"as-needed"` disallows providing the `10` radix

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"radix": [2, "always"]
```

#### always

The following patterns are considered problems:

```js
/*eslint radix: 2*/

var num = parseInt("071");        /*error Missing radix parameter.*/

var num = parseInt(someValue);    /*error Missing radix parameter.*/

var num = parseInt("071", "abc"); /*error Invalid radix parameter.*/

var num = parseInt();             /*error Missing parameters.*/
```

The following patterns are not considered problems:

```js
/*eslint radix: 2*/

var num = parseInt("071", 10);

var num = parseInt("071", 8);

var num = parseFloat(someValue);
```

#### as-needed

The following patterns are considered problems:

```js
/*eslint radix: [2. "as-needed"] */

var num = parseInt("071", 10);    /*error Redundant radix parameter.*/

var num = parseInt("071", "abc"); /*error Invalid radix parameter.*/

var num = parseInt();             /*error Missing parameters.*/
```

The following patterns are not considered problems:

```js
/*eslint radix: [2. "as-needed"] */

var num = parseInt("071");

var num = parseInt("071", 8);

var num = parseFloat(someValue);
```

## When Not To Use It

If you don't want to enforce either presence or omission of the `10` radix value you can turn this rule off.

## Further Reading

* [parseInt and radix](http://davidwalsh.name/parseint-radix)
* [Missing radix parameter](http://jslinterrors.com/missing-radix-parameter/)
