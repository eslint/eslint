# Disallow Variables Deletion (no-delete-var)

This rule prevents the use of `delete` operator on variables:

```js
/*eslint no-delete-var: 2*/

var x;
delete x;  /*error Variables should not be deleted.*/
```

The delete operator will only delete the properties of objects. It cannot "delete" variables or anything else. Using them on variables might lead to unexpected behavior.

## Further Reading

* [Only properties should be deleted](http://jslinterrors.com/only-properties-should-be-deleted/)
