# Require JSDoc comment (require-jsdoc)

This rule generates warnings for nodes which do not have JSDoc comments. It considered a good practice to document the behavior of different nodes to help engineers understand the functionality of the node.
Supported nodes:

* `FunctionDeclaration`

## Rule details

The following patterns are considered problems:

```js
/*eslint require-jsdoc: 2*/

function foo() {       /*error Missing JSDoc comment.*/
    return 10;
}
```

The following patterns are not considered problems:

```js
/*eslint require-jsdoc: 2*/

/**
* It returns 10
*/
function foo() {
    return 10;
}

/**
* It returns 10
*/
var foo = function() {
    return 10;
}

var array = [1,2,3];
array.filter(function(item) {
    return item > 2;
});
```

## When not to use

If you do not require node documentation, then you can leave this rule off.

## Related Rules

* [valid-jsdoc](valid-jsdoc.md)
