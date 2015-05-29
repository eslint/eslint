# Disallow Extra Parens (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary. It may be restricted to report only function expressions.

## Rule Details

### Exceptions

A few cases of redundant parentheses are always allowed:

* RegExp literals: `(/abc/).test(var)` is always valid.
* IIFEs: `var x = (function () {})();`, `((function foo() {return 1;})())` are always valid.

### Options

The default behavior of the rule is specified by `"all"` and it will report unnecessary parentheses around any expression. The following patterns are considered warnings:

```js
a = (b * c)

(a * b) + c

typeof (a)
```

The following patterns are not considered warnings:

```js
(0).toString()

({}.toString.call())

(function(){} ? a() : b())

(/^a$/).test(var)
```

If the option is set to `"functions"`, only function expressions will be checked for unnecessary parentheses. The following patterns are considered warnings:

```js
((function foo() {}))();

var y = (function () {return 1;});
```

The following patterns are not considered warnings:

```js
(0).toString()

({}.toString.call())

(function(){} ? a() : b())

(/^a$/).test(var)

a = (b * c)

(a * b) + c

typeof (a)
```


## Further Reading

* [MDN: Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
