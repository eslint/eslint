# Disallow Use of the Comma Operator (no-sequences)

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
* If the expression sequence is explicitly wrapped in parentheses.

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

// with ((doSomething(), val)) {}
```

## When Not To Use It

Disable this rule if sequence expressions with the comma operator are acceptable.
Another case is where you might want to report all usages of the comma operator, even if they are wrapped in parentheses or in a for loop. You can achieve this using rule `no-restricted-syntax`:

```js
{
    "rules": {
        "no-restricted-syntax": ["error", "SequenceExpression"]
    }
}
```
