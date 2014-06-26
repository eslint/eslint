# Disallow Use of `undefined` Variable (no-undefined)

This rule disallows use of the global variable `undefined` and disallows
shadowing of `undefined`. This is considered a good practice for a number of
reasons.

* In an ES3 environment, `undefined` may have been modified
* In an ES5+ environment, `undefined` may be shadowed
* Generating an undefined value avoids walking the scope chain to find the
  value of `undefined`.
* `X === undefined` comparisons are sometimes erroneously used in place of
  `typeof x === "undefined"` comparisons when `X` may not have been declared.

As an alternative to `undefined`, use the `void` operator on a simple
expression such as `void 0` to generate an undefined value. Remember that
variables are initialised to the undefined value.

## Examples

The following programs violate this rule.

```js
undefined;
```

```js
var undefined;
```

```js
function f(undefined) {}
```

The following programs do not violate this rule.

```js
void 0;
```

```js
global.undefined;
```

## When Not To Use It

There is no downside to choosing to use `void 0` instead of `undefined`, while
there are numerous downsides to using `undefined` instead of `void 0`. If it is
feared that some contributors may be confused or scared when they encounter
`void 0`, `undefined` may be prefered.

## Further Reading

* [undefined - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
* [Understanding JavaScript’s ‘undefined’ | JavaScript, JavaScript...](http://javascriptweblog.wordpress.com/2010/08/16/understanding-undefined-and-preventing-referenceerrors/)
* [ECMA262 edition 5.1 &sect;15.1.1.3: undefined](https://es5.github.io/#x15.1.1.3)
