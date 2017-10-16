# Disallow Use of the Comma Operator (no-sequences)

The comma operator includes multiple expressions where only one is expected. It evaluates each operand from left to right and returns the value of the last operand. However, this frequently obscures side effects, and its use is often an accident. Here are some examples of sequences:

```js
var a = (3, 5); // a = 5

a = b += 5, a + b;

while (a = next(), a && a.length);

(0, eval)("doSomething();");
```

## Rule Details

This rule forbids unexpected usages of the comma operator.

## Options

This rule has a string option:

* `"ambiguous"` (default) report usages of the comma operator, except in some non-ambiguous cases:

    * In the initialization or update portions of a `for` statement.
    * If the expression sequence is explicitly wrapped in parentheses.

* `"always"` report any usage of the comma operator.


### ambiguous

Examples of **incorrect** code for this rule with the default `"ambiguous"` option:

```js
/*eslint no-sequences: ["error", "ambiguous"]*/

foo = doSomething(), val;

0, eval("doSomething();");

do {} while (doSomething(), !!test);

for (; doSomething(), !!test; );

if (doSomething(), !!test);

switch (val = foo(), val) {}

while (val = foo(), val < 42);

with (doSomething(), val) {}
```

Examples of **correct** code for this rule with the default `"ambiguous"` option:

```js
/*eslint no-sequences: ["error", "ambiguous"]*/

foo = (doSomething(), val);

(0, eval)("doSomething();");

do {} while ((doSomething(), !!test));

for (i = 0, j = 10; i < j; i++, j--);

if ((doSomething(), !!test));

switch ((val = foo(), val)) {}

while ((val = foo(), val < 42));

// with ((doSomething(), val)) {}
```

### always

All examples above are **incorrect** for this rule with the `"always"` option.

The comma is still acceptable outside of its operator role. Example of **correct** code for this
rule with the `"always"` option:

```js
/*eslint no-sequences: ["error", "always"]*/

var i = 1, j = 2;

foo = [doSomething(), vla];
```

## When Not To Use It

Disable this rule if sequence expressions with the comma operator are acceptable.
