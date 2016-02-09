# Disallow Extra Parens (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary. It may be restricted to report only function expressions.

## Rule Details

A few cases of redundant parentheses are always allowed:

* RegExp literals: `(/abc/).test(var)` is always valid.
* IIFEs: `var x = (function () {})();`, `((function foo() {return 1;})())` are always valid.

## Options

This rule takes 1 or 2 arguments. The first one is a string which must be one of the following:

* `"all"` (default): it will report unnecessary parentheses around any expression.
* `"functions"`: only function expressions will be checked for unnecessary parentheses.

The second one is an object for more fine-grained configuration when the first option is "all".

### "all"

The following patterns are considered problems:

```js
/*eslint no-extra-parens: 2*/

a = (b * c); /*error Gratuitous parentheses around expression.*/

(a * b) + c; /*error Gratuitous parentheses around expression.*/

typeof (a);  /*error Gratuitous parentheses around expression.*/

(function(){} ? a() : b());  /*error Gratuitous parentheses around expression.*/
```

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: 2*/

(0).toString();

({}.toString.call());

(function(){}) ? a() : b();

(/^a$/).test(x);
```

#### Fine-grained control

When setting the first option as "all", an additional option can be added to allow extra parens for assignment in conditional statements.

The following patterns are not considered problems:

```js
/*eslint no-extra-parens: [2, "all", {"conditionalAssign": false}]*/

while ((foo = bar())) {}

if ((foo = bar())) {}

do; while ((foo = bar()))

for (;(a = b););
```

### "functions"

The following patterns are considered problems:

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
