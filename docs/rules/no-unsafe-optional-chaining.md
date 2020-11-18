# disallow optional chaining that possibly errors (no-unsafe-optional-chaining)

The optional chaining(`?.`) expression can short-circuit with `undefined`. Therefore, treating an evaluated optional chaining expression as a function, object, number, etc., can cause TypeError or unexpected result. For example:

```js
var obj = {};
(obj?.foo)(); // TypeError: obj?.foo is not a function
```

## Rule Details

This rule disallows some cases that might be an TypeError.

Examples of **incorrect** code for this rule:

```js
/*eslint no-unsafe-optional-chaining: "error"*/

(obj?.foo)();

(obj?.foo).bar;

(obj?.foo)`template`;

new (obj?.foo)();

[...obj?.foo];

bar(...obj?.foo);

1 in obj?.foo;

bar instanceof obj?.foo;

for (bar of obj?.foo);

[{ bar } = obj?.foo] = [];

with (obj?.foo);
```

Examples of **correct** code for this rule:

```js
/*eslint no-unsafe-optional-chaining: "error"*/

(obj?.foo)?.();

obj?.foo?.bar;

(obj?.foo ?? bar)`template`;

new (obj?.foo ?? bar)();

var baz = {...obj.?foo};
```

## Options

This rule has an object option:

- `disallowArithmeticOperators`: Disallow arithmetic operation on optional chaining expression (Default `false`). If this is `true`, this rule warns arithmetic operations on optional chaining expression which possibly result in `NaN`.

### disallowArithmeticOperators

Examples of additional **incorrect** code for this rule with the `{ "disallowArithmeticOperators": true }` option:

```js
/*eslint no-unsafe-optional-chaining: ["error", { "disallowArithmeticOperators": true }]*/

obj?.foo + bar;

obj?.foo * bar;

+obj?.foo;

baz += obj?.foo;
```
