# Disallow Labels That Are Variables Names (no-label-var)

## Rule Details

This rule aims to create clearer code by disallowing the bad practice of creating a label that shares a name with a variable that is in scope.

The following patterns are considered warnings:

```js
/*eslint no-label-var: 2*/

var x = foo;
function bar() {
x:               /*error Found identifier with same name as label.*/
  for (;;) {
    break x;
  }
}
```

The following patterns are considered okay and do not cause warnings:

```js
/*eslint no-label-var: 2*/

// The variable that has the same name as the label is not in scope.

function foo() {
  var q = t;
}

function bar() {
q:
  for(;;) {
    break q;
  }
}
```

## Further Reading

* ['{a}' is a statement label](http://jslinterrors.com/a-is-a-statement-label/)
