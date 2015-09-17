# Avoid unexpected multiline expressions (no-unexpected-multiline)

Semicolons are optional in JavaScript, via a process called automatic semicolon insertion (ASI). See the documentation for [semi](./semi.md) for a fuller discussion of that feature.

The rules for ASI are relatively straightforward: In short, as once described by Isaac Schlueter, a `\n` character always ends a statement (just like a semicolon) unless one of the following is true:

1. The statement has an unclosed paren, array literal, or object literal or ends in some other way that is not a valid way to end a statement. (For instance, ending with `.` or `,`.)
2. The line is `--` or `++` (in which case it will decrement/increment the next token.)
3. It is a `for()`, `while()`, `do`, `if()`, or `else`, and there is no `{`
4. The next line starts with `[`, `(`, `+`, `*`, `/`, `-`, `,`, `.`, or some other binary operator that can only be found between two tokens in a single expression.

This particular rule aims to spot scenarios where a newline looks like it is ending a statement, but is not.

## Rule Details

This rule is aimed at ensuring that two unrelated consecutive lines are not accidentially interpreted as a single expression.

The following patterns are considered problems:

```js
/*eslint no-unexpected-multiline: 2*/

var foo = bar
(1 || 2).baz();               /*error Unexpected newline between function and ( of function call.*/

var hello = 'world'
[1, 2, 3].forEach(addNumber); /*error Unexpected newline between object and [ of property access.*/
```

The following patterns are not considered problems:

```js
/*eslint no-unexpected-multiline: 2*/

var foo = bar;
(1 || 2).baz();

var foo = bar
;(1 || 2).baz()

var hello = 'world';
[1, 2, 3].forEach(addNumber);

var hello = 'world'
void [1, 2, 3].forEach(addNumber);
```

## When Not To Use It

You can turn this rule off if you are confident that you will not accidentally introduce code like this.

Note that the patterns considered problems are **not** flagged by the [semi](semi.md) rule.

## Related Rules

* [semi](semi.md)
* [no-spaced-func](no-spaced-func.md)
* [space-unary-ops](space-unary-ops.md)
