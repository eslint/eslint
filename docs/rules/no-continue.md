# Disallow continue (no-continue)

The `continue` statement terminates execution of the statements in the current iteration of the current or labeled loop, and continues execution of the loop with the next iteration. When used incorrectly it makes code less testable, less readable and less maintainable. Structured control flow statements such as `if` should be used instead.

```js
var sum = 0,
    i;

for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue;
    }

    a += i;
}
```

## Rule Details

This rule is aimed at preventing the use of `continue` statement.
As such it warns whenever it sees `continue` statement.

The following patterns are considered problems:

```js
/*eslint no-continue: 2*/

var sum = 0,
    i;

for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue;              /*error Unexpected use of continue statement*/
    }

    a += i;
}
```

```js
/*eslint no-continue: 2*/

var sum = 0,
    i;

labeledLoop: for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue labeledLoop;  /*error Unexpected use of continue statement*/
    }

    a += i;
}
```

The following patterns are not considered problems:

```js
/*eslint no-continue: 2*/

var sum = 0,
    i;

for(i = 0; i < 10; i++) {
    if(i < 5) {
       a += i;
    }
}
```

## Compatibility

* **JSLint**: `continue`
