# brace style

One true brace style is a common coding style in JavaScript, in which the opening curly brace of a block is placed on the same line as its corresponding statement or declaration.

```js
function foo()
{
  return true;
}

if (foo)
{
  bar();
}
```

## Rule Details

This rule is aimed at enforcing one true brace style across your JavaScript. As such, it warns whenever it sees a statement or declaration that does not adhere to the one true brace style.

The following patterns are considered warnings:

```js
function foo()
{
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}
```

The following patterns adhere to one true brace style and do not cause warnings:

```js
function foo() {
  return true;
}

if (foo) {
  bar();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}
```

## When Not To Use It

If your project will not be using the one true brace style, turn this rule off.
