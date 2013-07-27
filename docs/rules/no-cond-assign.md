# no assignment in conditional expressions

## Rule Details

This rule is aimed at eliminating ambiguous assignment operators found in 
`if, while, and dowhile` conditional expressions.

The following patterns are considered warnings:

```js
var x;
if (x = 0) {
    var b = 1;
}

// Practical example
function setHeight(someNode) {
    "use strict";
    do {
        someNode.height = '100px';
    } while (someNode = someNode.parentNode);
}

```

The following patterns are considered okay and do not cause warnings:

```js
var x;
if (x === 0) {
    var b = 1;
}

// Practical example
function setHeight(someNode) {
    "use strict";
    do {
        someNode.height = '100px';
    } while ((someNode = someNode.parentNode) !== null);
} 
```

## Notes

The evaluation of `for` statements was excluded in this rule. Presently,
`esprima` will fire an error when parsing the following code:

```js
var i = 0, foo;
for (i < 10; i += 1) {
    foo += i;
}
// line 2, col 20, Error - Unexpected token )
```

So even though there is assignment ambiguity in the conditional expression,
the parse error prevents the scenario from occuring.

## Further Reading

* [JSLint -- Expected a conditional expression and instead saw an assignment.](http://jslinterrors.com/expected-a-conditional-expression-and-saw-an-assignment/)
* [JSLine -- Unexpected assignment expression](http://jslinterrors.com/unexpected-assignment-expression/)
