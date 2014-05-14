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

The following patterns are considered warnings:

```js
if (true) {
    doSomething();
}
```

```js
var result = 0 ? a : b;
```

```js
while (-2) {
    doSomething();
}
```

```js
for (;true;) {
    doSomething();
}
```

```js
do{
    something();
} while (x = -1)
```

The following patterns are not warnings:

```js
if (x === 0) {
    doSomething();
}
```

```js
do {
    something();
} while (x)
```
