# No empty labels

Labelled statements are only used in conjunction with labelled break and continue statements. ECMAScript has no goto statement.


## Rule Details

This error occurs when a label is used to mark a statement that is not an iteration or switch

The following patterns are considered warnings:

```js
labelled: //Label for the following var statement
    var x = 10;
};

```

The following patterns are not considered warnings:

```js
labelled:
    for (var i=10; i; i--) {
        ...
    }
};
