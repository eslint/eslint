# Disallow use of constant expressions in conditions (no-constant-condition)

Comparing a literal expression in a condition is usually a typo or development trigger for a specific behavior.

```js
if (false) {
    doSomethingUnfinished();
}
```

This pattern is most likely an error and should be avoided.

## Rule Details

The rule is aimed at preventing a constant expression in the test of:

* `if`, `for`, `while`, or `do...while` statement
* `?:` ternary expression

Examples of **incorrect** code for this rule:

```js
/*eslint no-constant-condition: "error"*/

if (false) {
    doSomethingUnfinished();
}

for (;true;) {
    doSomethingForever();
}

while (-2) {
    doSomethingForever();
}

do{
    doSomethingForever();
} while (x = -1);

var result = 0 ? a : b;
```

```js
/*eslint no-constant-condition: "error"*/

if (typeof x) {
    doSomething();
}
```


Examples of **correct** code for this rule:

```js
/*eslint no-constant-condition: "error"*/

if (x === 0) {
    doSomething();
}

for (;;) {
    doSomethingForever();
}

while (x) {
    doSomething();
}

do{
    doSomething();
} while (x);

var result = x !== 0 ? a : b;
```

```js
/*eslint no-constant-condition: "error"*/

if (typeof x === 'undefined') {
    doSomething();
}
```
