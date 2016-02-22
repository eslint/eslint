# Disallow Variables Deletion (no-delete-var)

The purpose of the `delete` operator is to remove a property from an object. Using the `delete` operator on a variable might lead to unexpected behavior.

## Rule Details

This rule prevents the use of `delete` operator on variables.

Examples of **incorrect** code for this rule:

```js
/*eslint no-delete-var: 2*/

var x;
delete x;
```

## Further Reading

* [Only properties should be deleted](http://jslinterrors.com/only-properties-should-be-deleted/)
