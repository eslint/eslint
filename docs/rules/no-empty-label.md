# No empty labels (no-empty-label)

Labeled statements are only used in conjunction with labeled break and continue statements. ECMAScript has no goto statement.


## Rule Details

This error occurs when a label is used to mark a statement that is not an iteration or switch

The following patterns are considered problems:

```js
/*eslint no-empty-label: 2*/

labeled:     /*error Unexpected label "labeled"*/
var x = 10;
```

The following patterns are not considered problems:

```js
/*eslint no-empty-label: 2*/

labeled:
for (var i=10; i; i--) {
    // ...
}
```
