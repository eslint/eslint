# Disallow Labels That Are Variables Names (no-label-var)

## Rule Details

This rule aims to create clearer code by disallowing the bad practice of creating a label that shares a name with a variable that is in scope.

The following patterns are considered problems:

```js
/*eslint no-label-var: 2*/

var x = foo;
function bar() {
x:
  for (;;) {
    break x;
  }
}
```

The following patterns are not considered problems:

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

## When Not To Use It

If you don't want to be notified about usage of labels, then it's safe to disable this rule.

## Further Reading

* ['{a}' is a statement label](http://jslinterrors.com/a-is-a-statement-label/)

## Related Rules

* [no-extra-label](./no-extra-label.md)
* [no-labels](./no-labels.md)
* [no-unused-labels](./no-unused-labels.md)
