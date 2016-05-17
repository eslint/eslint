# disallow unnecessary parentheses (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary.

## Rule Details

This rule always ignores extra parentheses around the following:

* RegExp literals such as `(/abc/).test(var)` to avoid conflicts with the [wrap-regex](wrap-regex.md) rule
* immediately-invokes function expressions (also known as IIFEs) such as `var x = (function () {})();` and `((function foo() {return 1;})())` to avoid conflicts with the [wrap-iife](wrap-iife.md) rule

## Options

This rule has a string option:

* `"all"` (default) disallows unnecessary parentheses around *any* expression
* `"functions"` disallows unnecessary parentheses *only* around function expressions

This rule has an object option for exceptions to the `"all"` option:

* `"conditionalAssign": false` allows extra parentheses around assignments in conditional test expressions
* `"returnAssign": false` allows extra parentheses around assignments in `return` statements
* `"nestedBinaryExpressions": false` allows extra parentheses in nested binary expressions

### all

Examples of **incorrect** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

a = (b * c);

(a * b) + c;

typeof (a);

(function(){} ? a() : b());
```

Examples of **correct** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

(0).toString();

({}.toString.call());

(function(){}) ? a() : b();

(/^a$/).test(x);
```

### conditionalAssign

Examples of **correct** code for this rule with the `"all"` and `{ "conditionalAssign": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "conditionalAssign": false }] */

while ((foo = bar())) {}

if ((foo = bar())) {}

do; while ((foo = bar()))

for (;(a = b););
```

### returnAssign

Examples of **correct** code for this rule with the `"all"` and `{ "returnAssign": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "returnAssign": false }] */

function a(b) {
  return (b = 1);
}

function a(b) {
  return b ? (c = d) : (c = e);
}

b => (b = 1);

b => b ? (c = d) : (c = e);
```

### nestedBinaryExpressions

Examples of **correct** for this rule with the `"all"` and `{ "nestedBinaryExpressions": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "nestedBinaryExpressions": false }] */

x = a || (b && c);
x = a + (b * c);
x = (a * b) / c;
```

### functions

Examples of **incorrect** code for this rule with the `"functions"` option:

```js
/* eslint no-extra-parens: ["error", "functions"] */

((function foo() {}))();

var y = (function () {return 1;});
```

Examples of **correct** code for this rule with the `"functions"` option:

```js
/* eslint no-extra-parens: ["error", "functions"] */

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

## Related Rules

* [no-cond-assign](no-cond-assign.md)
* [no-return-assign](no-return-assign.md)
