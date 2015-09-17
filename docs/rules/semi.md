# Enforce or Disallow Semicolons (semi)

JavaScript is unique amongst the C-like languages in that it doesn't require semicolons at the end of each statement. In many cases, the JavaScript engine can determine that a semicolon should be in a certain spot and will automatically add it. This feature is known as **automatic semicolon insertion (ASI)** and is considered one of the more controversial features of JavaScript. For example, the following lines are both valid:

```js
var name = "ESLint"
var website = "eslint.org";
```

On the first line, the JavaScript engine will automatically insert a semicolon, so this is not considered a syntax error. The JavaScript engine still knows how to interpret the line and knows that the line end indicates the end of the statement.

In the debate over ASI, there are generally two schools of thought. The first is that we should treat ASI as if it didn't exist and always include semicolons manually. The rationale is that it's easier to always include semicolons than to try to remember when they are or are not required, and thus decreases the possibility of introducing an error. For example, consider this code:

```
return
{
    name: "ESLint"
}
```

This may look like a `return` statement that returns an object literal, however, the JavaScript engine will interpret this code as:

```
return;
{
    name: "ESLint"
};
```

Effectively, an object literal is created in an unreachable part of the code. That's because a semicolon will be inserted after the `return` statement.

On the other side of the argument are those who say ASI isn't magic, it follows a set of rules as to when semicolons are inserted and it's fairly easy to remember them. In short, as once described by Isaac Schlueter, a `\n` character always ends a statement (just like a semicolon) unless one of the following is true:

1. The statement has an unclosed paren, array literal, or object literal or ends in some other way that is not a valid way to end a statement. (For instance, ending with `.` or `,`.)
1. The line is `--` or `++` (in which case it will decrement/increment the next token.)
1. It is a `for()`, `while()`, `do`, `if()`, or `else`, and there is no `{`
1. The next line starts with `[`, `(`, `+`, `*`, `/`, `-`, `,`, `.`, or some other binary operator that can only be found between two tokens in a single expression.

## Rule Details

This rule is aimed at ensuring consistent use of semicolons. You can decide whether or not to require semicolons at the end of statements.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

### Options

By using the default option, semicolons must be used any place where they are valid.

```json
semi: [2, "always"]
```

The following patterns are considered problems:

```js
/*eslint semi: 2*/

var name = "ESLint"          /*error Missing semicolon.*/

object.method = function() {
    // ...
}                            /*error Missing semicolon.*/
```

The following patterns are not considered problems:

```js
/*eslint semi: 2*/

var name = "ESLint";

object.method = function() {
    // ...
};
```

If you want to enforce that semicolons are never used, switch the configuration to:

```json
semi: [2, "never"]
```

Then, the following patterns are considered problems:

```js
/*eslint semi: [2, "never"]*/

var name = "ESLint";         /*error Extra semicolon.*/

object.method = function() {
    // ...
};                           /*error Extra semicolon.*/
```

And the following patterns are not considered problems:

```js
/*eslint semi: [2, "never"]*/

var name = "ESLint"

object.method = function() {
    // ...
}
```

Even in "never" mode, semicolons are still allowed to disambiguate statements beginning with `[`, `(`, `/`, `+`, or `-`:

```js
/*eslint semi: [2, "never"]*/

var name = "ESLint"

;(function() {
    // ...
})()
```

## When Not To Use It

If you do not want to enforce semicolon usage (or omission) in any particular way, then you can turn this rule off.

## Further Reading

* [An Open Letter to JavaScript Leaders Regarding Semicolons](http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding)
* [JavaScript Semicolon Insertion](http://inimino.org/~inimino/blog/javascript_semicolons)
* [Understanding Automatic Semicolon Insertion in JavaScript](http://jamesallardice.com/understanding-automatic-semi-colon-insertion-in-javascript/)

## Related Rules

* [no-extra-semi](no-extra-semi.md)
* [no-space-before-semi](no-space-before-semi.md)
