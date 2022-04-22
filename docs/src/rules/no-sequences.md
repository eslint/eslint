---
title: no-sequences
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-sequences.md
rule_type: suggestion
---

Disallows use of the comma operator.

The comma operator includes multiple expressions where only one is expected. It evaluates each operand from left to right and returns the value of the last operand. However, this frequently obscures side effects, and its use is often an accident. Here are some examples of sequences:

```js
var a = (3, 5); // a = 5

a = b += 5, a + b;

while (a = next(), a && a.length);

(0, eval)("doSomething();");
```

## Rule Details

This rule forbids the use of the comma operator, with the following exceptions:

* In the initialization or update portions of a `for` statement.
* By default, if the expression sequence is explicitly wrapped in parentheses. This exception can be removed with the `allowInParentheses` option.

Examples of **incorrect** code for this rule:

```js
/*eslint no-sequences: "error"*/

foo = doSomething(), val;

0, eval("doSomething();");

do {} while (doSomething(), !!test);

for (; doSomething(), !!test; );

if (doSomething(), !!test);

switch (val = foo(), val) {}

while (val = foo(), val < 42);

with (doSomething(), val) {}
```

Examples of **correct** code for this rule:

```js
/*eslint no-sequences: "error"*/

foo = (doSomething(), val);

(0, eval)("doSomething();");

do {} while ((doSomething(), !!test));

for (i = 0, j = 10; i < j; i++, j--);

if ((doSomething(), !!test));

switch ((val = foo(), val)) {}

while ((val = foo(), val < 42));

with ((doSomething(), val)) {}
```

### Note about arrow function bodies

If an arrow function body is a statement rather than a block, and that statement contains a sequence, you need to use double parentheses around the statement to indicate that the sequence is intentional.

Examples of **incorrect** code for arrow functions:

```js
/*eslint no-sequences: "error"*/
const foo = (val) => (console.log('bar'), val);

const foo = () => ((bar = 123), 10);

const foo = () => { return (bar = 123), 10 }
```

Examples of **correct** code for arrow functions:

```js
/*eslint no-sequences: "error"*/
const foo = (val) => ((console.log('bar'), val));

const foo = () => (((bar = 123), 10));

const foo = () => { return ((bar = 123), 10) }
```

## Options

This rule takes one option, an object, with the following properties:

* `"allowInParentheses"`: If set to `true` (default), this rule allows expression sequences that are explicitly wrapped in parentheses.

### allowInParentheses

Examples of **incorrect** code for this rule with the `{ "allowInParentheses": false }` option:

```js
/*eslint no-sequences: ["error", { "allowInParentheses": false }]*/

foo = (doSomething(), val);

(0, eval)("doSomething();");

do {} while ((doSomething(), !!test));

for (; (doSomething(), !!test); );

if ((doSomething(), !!test));

switch ((val = foo(), val)) {}

while ((val = foo(), val < 42));

with ((doSomething(), val)) {}

const foo = (val) => ((console.log('bar'), val));
```

Examples of **correct** code for this rule with the `{ "allowInParentheses": false }` option:

```js
/*eslint no-sequences: ["error", { "allowInParentheses": false }]*/

for (i = 0, j = 10; i < j; i++, j--);
```

## When Not To Use It

Disable this rule if sequence expressions with the comma operator are acceptable.
Another case is where you might want to report all usages of the comma operator, even in a for loop. You can achieve this using rule `no-restricted-syntax`:

```js
{
    "rules": {
        "no-restricted-syntax": ["error", "SequenceExpression"]
    }
}
```
