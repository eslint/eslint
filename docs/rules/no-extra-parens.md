# Disallow Extra Parens (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary. It may be restricted to report only function expressions.

## Rule Details

### Exceptions

A few cases of redundant parentheses are always allowed:

* RegExp literals: `(/abc/).test(var)` is always valid.
* IIFEs: `var x = (function () {})();`, `((function foo() {return 1;})())` are always valid.

### Options

The default behavior of the rule is specified by `"all"` and it will report unnecessary parentheses around any expression. The following patterns are considered problems:

```js
/*eslint no-extra-parens: 2*/

a = (b * c); /*error Gratuitous parentheses around expression.*/

(a * b) + c; /*error Gratuitous parentheses around expression.*/

typeof (a);  /*error Gratuitous parentheses around expression.*/
```

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: 2*/

(0).toString();

({}.toString.call());

(function(){} ? a() : b())

(/^a$/).test(x);
```

If the option is set to `"functions"`, only function expressions will be checked for unnecessary parentheses. The following patterns are considered problems:

```js
/*eslint no-extra-parens: [2, "functions"]*/

((function foo() {}))();           /*error Gratuitous parentheses around expression.*/

var y = (function () {return 1;}); /*error Gratuitous parentheses around expression.*/
```

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: [2, "functions"]*/

(0).toString();

({}.toString.call());

(function(){} ? a() : b());

(/^a$/).test(x);

a = (b * c);

(a * b) + c;

typeof (a);
```


## Further Reading

* [MDN: Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
