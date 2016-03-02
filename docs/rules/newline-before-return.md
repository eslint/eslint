# Require newline before `return` statement (newline-before-return)

There is no hardfast rule about whether newlines should precede `return` statements in JavaScript. However, clearly delineating where a function is returning can greatly increase the readability and clarity of the code. For example:

```js
function foo(bar) {
  var baz = 'baz';
  if (!bar) {
    bar = baz;
    return bar;
  }
  return bar;
}
```

Adding newlines visibly separates the return statements from the previous lines, making it clear where the function exits and what value it returns:

```js
function foo(bar) {
  var baz = 'baz';

  if (!bar) {
    bar = baz;

    return bar;
  }

  return bar;
}
```

## Rule Details

This rule aims to increase code clarity by requiring a blank line before `return` statements, except when the `return` is alone inside a statement group (such as an if statement). In the latter case, the `return` statement does not need to be delineated by virtue of it being alone.

When this rule is on, the following patterns are considered problems:

```js
/*eslint newline-before-return: "error"*/

function foo() {

    return;
}

function foo(bar) {
    if (!bar) {

        return;
    }
}

function foo(bar) {
    if (!bar) {
        return;
    }
    return bar;
}
```

Conversely, the following patterns are not considered problems:

```js
/*eslint newline-before-return: "error"*/

function foo() {
    return;
}

function foo(bar) {
    if (!bar) return;
}

function foo(bar) {
    if (!bar) { return };
}

function foo(bar) {
    if (!bar) {
        return;
    }
}

function foo(bar) {
    if (!bar) {
        return;
    }

    return bar;
}
```

Note: comments are ignored and do not count as blank lines. The following patterns are therefore considered problems:

```js
/*eslint newline-before-return: "error"*/

function foo() {

    // comment
    return;
}

function foo(bar) {
    if (!bar) {
        return;
    }
    /* multi-line
    comment */
    return bar;
}
```

## When Not To Use It

You can safely disable this rule if you do not have any strict conventions about whitespace before `return` statements.

## Further Information

When using this rule, consider also enabling [`newline-after-var`](http://eslint.org/docs/rules/newline-after-var).

