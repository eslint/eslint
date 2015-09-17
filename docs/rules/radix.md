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

## Rule Details

This rule is aimed at preventing the unintended conversion of a string to a number of a different base than intended.

The following patterns are considered problems:

```js
/*eslint radix: 2*/

var num = parseInt("071");     /*error Missing radix parameter.*/

var num = parseInt(someValue); /*error Missing radix parameter.*/
```

The following patterns are not considered problems:

```js
/*eslint radix: 2*/

var num = parseInt("071", 10);

var num = parseFloat(someValue);
```

## When Not To Use It

If you are certain of the first argument's format, then the second argument is unnecessary and you can safely turn this rule off.

## Further Reading

* [parseInt and radix](http://davidwalsh.name/parseint-radix)
* [Missing radix parameter](http://jslinterrors.com/missing-radix-parameter/)
