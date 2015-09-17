# Disallow Assignment in Conditional Statements (no-cond-assign)

In conditional statements, it is very easy to mistype a comparison operator (such as `==`) as an assignment operator (such as `=`). For example:

```js
// Check the user's job title
if (user.jobTitle = "manager") {
    // user.jobTitle is now incorrect
}
```

There are valid reasons to use assignment operators in conditional statements. However, it can be difficult to tell whether a specific assignment was intentional.

## Rule Details

This rule is aimed at eliminating ambiguous assignments in `for`, `if`, `while`, and `do...while` conditional statements.

### Options

The rule takes one option, a string, which must contain one of the following values:

* `except-parens` (default): Disallow assignments unless they are enclosed in parentheses.
* `always`: Disallow all assignments.

#### "except-parens"

This is the default option. It disallows assignments unless they are enclosed in parentheses. This option makes it possible to use common patterns, such as reassigning a value in the condition of a `while` or `do...while` loop, without causing a warning.

The following patterns are considered problems:

```js
/*eslint no-cond-assign: 2*/

// Unintentional assignment
var x;
if (x = 0) {         /*error Expected a conditional expression and instead saw an assignment.*/
    var b = 1;
}

// Practical example that is similar to an error
function setHeight(someNode) {
    "use strict";
    do {             /*error Expected a conditional expression and instead saw an assignment.*/
        someNode.height = "100px";
    } while (someNode = someNode.parentNode);
}
```

The following patterns are not considered problems:

```js
/*eslint no-cond-assign: 2*/

// Assignment replaced by comparison
var x;
if (x === 0) {
    var b = 1;
}

// Practical example that wraps the assignment in parentheses
function setHeight(someNode) {
    "use strict";
    do {
        someNode.height = "100px";
    } while ((someNode = someNode.parentNode));
}

// Practical example that wraps the assignment and tests for 'null'
function setHeight(someNode) {
    "use strict";
    do {
        someNode.height = "100px";
    } while ((someNode = someNode.parentNode) !== null);
}
```

#### "always"

This option disallows all assignments in conditional statement tests. All assignments are treated as problems.

The following patterns are considered problems:

```js
/*eslint no-cond-assign: [2, "always"]*/

// Unintentional assignment
var x;
if (x = 0) {         /*error Unexpected assignment within an 'if' statement.*/
    var b = 1;
}

// Practical example that is similar to an error
function setHeight(someNode) {
    "use strict";
    do {             /*error Unexpected assignment within a 'do...while' statement.*/
        someNode.height = "100px";
    } while (someNode = someNode.parentNode);
}

// Practical example that wraps the assignment in parentheses
function setHeight(someNode) {
    "use strict";
    do {             /*error Unexpected assignment within a 'do...while' statement.*/
        someNode.height = "100px";
    } while ((someNode = someNode.parentNode));
}

// Practical example that wraps the assignment and tests for 'null'
function setHeight(someNode) {
    "use strict";
    do {             /*error Unexpected assignment within a 'do...while' statement.*/
        someNode.height = "100px";
    } while ((someNode = someNode.parentNode) !== null);
}
```

The following patterns are not considered problems:

```js
/*eslint no-cond-assign: [2, "always"]*/

// Assignment replaced by comparison
var x;
if (x === 0) {
    var b = 1;
}
```

## Further Reading

* [JSLint -- Unexpected assignment expression](http://jslinterrors.com/unexpected-assignment-expression/)
