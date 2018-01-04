# disallow unnecessary parentheses (no-extra-parens)

This rule restricts the use of parentheses to only where they are necessary.

## Rule Details

This rule always ignores extra parentheses around the following:

* RegExp literals such as `(/abc/).test(var)` to avoid conflicts with the [wrap-regex](wrap-regex.md) rule
* immediately-invoked function expressions (also known as IIFEs) such as `var x = (function () {})();` and `((function foo() {return 1;})())` to avoid conflicts with the [wrap-iife](wrap-iife.md) rule
* arrow function arguments to avoid conflicts with the [arrow-parens](arrow-parens.md) rule

## Options

This rule has a string option:

* `"all"` (default) disallows unnecessary parentheses around *any* expression
* `"functions"` disallows unnecessary parentheses *only* around function expressions

This rule has an object option for exceptions to the `"all"` option:

* `"conditionalAssign": false` allows extra parentheses around assignments in conditional test expressions
* `"returnAssign": false` allows extra parentheses around assignments in `return` statements
* `"nestedBinaryExpressions": false` allows extra parentheses in nested binary expressions
* `"ignoreJSX": "none|all|multi-line|single-line"` allows extra parentheses around no/all/multi-line/single-line JSX components. Defaults to `none`.
* `"enforceForArrowConditionals": false` allows extra parentheses around ternary expressions which are the body of an arrow function

### all

Examples of **incorrect** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

a = (b * c);

(a * b) + c;

for (a in (b, c));

for (a in (b));

for (a of (b));

typeof (a);

(function(){} ? a() : b());
```

Examples of **correct** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

(0).toString();

(Object.prototype.toString.call());

({}.toString.call());

(function(){}) ? a() : b();

(/^a$/).test(x);

for (a of (b, c));

for (a of b);

for (a in b, c);

for (a in b);
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

Examples of **correct** code for this rule with the `"all"` and `{ "nestedBinaryExpressions": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "nestedBinaryExpressions": false }] */

x = a || (b && c);
x = a + (b * c);
x = (a * b) / c;
```

### ignoreJSX

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "all" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "all" }] */
const Component = (<div />)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const Component = (<div />)
const Component = (<div><p /></div>)
```

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const Component = (
    <div>
        <p />
    </div>
)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const Component = (
    <div>
        <p />
    </div>
)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const Component = (<div />)
const Component = (<div><p /></div>)
```

### enforceForArrowConditionals

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForArrowConditionals": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "enforceForArrowConditionals": false }] */

const b = a => 1 ? 2 : 3;
const d = c => (1 ? 2 : 3);
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

(Object.prototype.toString.call());

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

* [arrow-parens](arrow-parens.md)
* [no-cond-assign](no-cond-assign.md)
* [no-return-assign](no-return-assign.md)
