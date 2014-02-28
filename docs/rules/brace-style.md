# Require One True Brace Style

One true brace style is a common coding style in JavaScript, in which the opening curly brace of a block is placed on the same line as its corresponding statement or declaration.

```js
if (foo) {
  bar();
} else {
  baz();
}

if (foo) {
  bar();
} 
else {
  baz();
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

// When "brace-style": ["2", "1tbs"]

if (foo) {
  bar();
} 
else {
  baz();
}

// When "brace-style": ["2", "stroustrup"]

if (foo) {
  bar();
} else {
  baz();
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

// When "brace-style": ["2", "1tbs"]

if (foo) {
  bar();
} else {
  baz();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}

// When "brace-style": ["2", "stroustrup"]

if (foo) {
  bar();
} 
else {
  baz();
}

try {
  somethingRisky();
} 
catch(e) {
  handleError();
}
```

### Options

The rule takes one option, a string which must be either "1tbs" or "stroustrup". The default is "1tbs". 

The "1tbs" option requires that the `else`, `catch`, and `finally` statements appear on the same line as the closing curly brace from the previous statement.

```js
if (foo) {
  bar();
} else {
  baz();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}
```

The "stroustrup" option requires that the `else`, `catch`, and `finally` statements appear on a new line after the closing curly brace from the previous statement.

```js
if (foo) {
  bar();
} 
else {
  baz();
}

try {
  somethingRisky();
} 
catch(e) {
  handleError();
}
```

## When Not To Use It

If your project will not be using the one true brace style, turn this rule off.
