# Disallow Use of the Comma Operator (no-sequences)

The comma operator includes multiple expressions where only one is expected. It evaluates each operand from left to right and returns the value of the last operand. However, this frequently obscures side effects, and its use is often an accident. Here are some examples of its use:

```js
var a = (3, 5); // a = 5

a = b += 5, a + b;

while (a = next(), a && a.length);

(0,eval)("doSomething();");
```

## Rule Details

This rule forbids the use of the comma operator, with the following exceptions:

* In the initialization or update portions of a `for` statement.
* If the expression sequence is explicitly wrapped in parentheses.

The following patterns are considered problems:

```js
/*eslint no-sequences: 2*/

foo = doSomething, val;              /*error Unexpected use of comma operator.*/

do {} while (doSomething(), !!test); /*error Unexpected use of comma operator.*/

for (; doSomething(), !!test; );     /*error Unexpected use of comma operator.*/

if (doSomething(), !!test);          /*error Unexpected use of comma operator.*/

switch (val = foo(), val) {}         /*error Unexpected use of comma operator.*/

while (val = foo(), val < 42);       /*error Unexpected use of comma operator.*/

with (doSomething(), val) {}         /*error Unexpected use of comma operator.*/
```

The following patterns are not considered problems:

```js
/*eslint no-sequences: 2*/

foo = (doSomething(), val);

(0,eval)("doSomething();");

do {} while ((doSomething(), !!test));

for (i = 0, j = 10; i < j; i++, j--);

if ((doSomething(), !!test));

switch ((val = foo(), val)) {}

while ((val = foo(), val < 42));

// with ((doSomething(), val)) {}
```

## When Not To Use It

Disable this rule if sequence expressions with the comma operator are acceptable.
