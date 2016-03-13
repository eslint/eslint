# Disallow Use of the Comma Operator (no-sequences)

The comma operator includes multiple expressions where only one is expected. It evaluates each operand from left to right and returns the value of the last operand. However, this frequently obscures side effects, and its use is often an accident. Here are some examples of its use:

```js
var a = (3, 5); // a = 5

a = b += 5, a + b;

while (a = next(), a && a.length);

(0, eval)("doSomething();");
```

## Rule Details

This rule forbids the use of the comma operator, with the following exceptions:

* In the initialization or update portions of a `for` statement.
* If the expression sequence is explicitly wrapped in parentheses.

The following patterns are considered problems:

```js
/*eslint no-sequences: 2*/

foo = doSomething(), val;

do {} while (doSomething(), !!test);

for (; doSomething(), !!test; );

if (doSomething(), !!test);

switch (val = foo(), val) {}

while (val = foo(), val < 42);

with (doSomething(), val) {}
```

The following patterns are not considered problems:

```js
/*eslint no-sequences: 2*/

foo = (doSomething(), val);

(0, eval)("doSomething();");

do {} while ((doSomething(), !!test));

for (i = 0, j = 10; i < j; i++, j--);

if ((doSomething(), !!test));

switch ((val = foo(), val)) {}

while ((val = foo(), val < 42));

// with ((doSomething(), val)) {}
```

## Options

This rule, in its default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `ignoreParenthesized` set to `false` will warn on all sequences, even if they are parenthesized (Default: `true`).
* `allowIndirectEval` set to `false` will warn on indirect `eval` calls too such as `(0, eval)("foo")`. This check only gets active if `allowParenthesized` is set to `false` (Default: `true`).

By default the following patterns are _not_ considered problems:

```js
/*eslint no-sequences: 2*/

while ((doSomething(), !!test));

(0, eval)("foo");

a = (1, 2);

```

The following patterns are considered problems if `ignoreParenthesized` is disabled:

```js
/*eslint no-sequences: [2, { ignoreParenthesized: false }]*/

while ((doSomething(), !!test));

a = (1, 2);
```

If you disable `allowIndirectEval` along with `ignoreParenthesized`, the following pattern will also be disallowed:

```js
/*eslint no-sequences: [2, { ignoreParenthesized: false, allowIndirectEval: false }]*/

(0, eval)("foo");
```


## When Not To Use It

Disable this rule if sequence expressions with the comma operator are acceptable.
