# Disallow use of constant expressions in conditions (no-constant-condition)

Comparing a literal expression in a condition is usually a typo or development trigger for a specific behavior.

```js
if (false) {
    doSomethingUnfinished();
}
```

This pattern is most likely an error and should be avoided.

## Rule Details

The rule is aimed at preventing the use of a constant expression in a condition.
As such, it warns whenever it sees a constant expression inside a condition expression.

The following patterns are considered problems:

```js
/*eslint no-constant-condition: 2*/

if (true) {             /*error Unexpected constant condition.*/
    doSomething();
}
```

```js
/*eslint no-constant-condition: 2*/

var result = 0 ? a : b; /*error Unexpected constant condition.*/
```

```js
/*eslint no-constant-condition: 2*/

while (-2) {            /*error Unexpected constant condition.*/
    doSomething();
}
```

```js
/*eslint no-constant-condition: 2*/

for (;true;) {          /*error Unexpected constant condition.*/
    doSomething();
}
```

```js
/*eslint no-constant-condition: 2*/

do{                     /*error Unexpected constant condition.*/
    something();
} while (x = -1)
```

The following patterns are not considered problems:

```js
/*eslint no-constant-condition: 2*/

if (x === 0) {
    doSomething();
}
```

```js
/*eslint no-constant-condition: 2*/

do {
    something();
} while (x)
```

```js
/*eslint no-constant-condition: 2*/

for (;;) {
    something();
}
```
