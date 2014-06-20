# Require Brace Style (brace-style)

Brace style is closely related to [indent style](http://en.wikipedia.org/wiki/Indent_style) in programming and describes the placement of curly braces relative to their control statement and body. There are probably a dozen, if not more, brace styles in the world.

The *one true brace style* is one of the most common brace styles in JavaScript, in which the opening curly brace of a block is placed on the same line as its corresponding statement or declaration. For example:

```js
if (foo) {
  bar();
} else {
  baz();
}
```

One common variant of one true brace style is called Stroustrup, in which the `else` statements in an `if-else` construct, as well as `catch` and `finally`, must be on its own line after the preceding closing brace, as in this example:

```js
if (foo) {
  bar();
}
else {
  baz();
}
```

While no style is considered better than the other, most developers agree that having a consistent style throughout a project is important for its long-term maintainability.

## Rule Details

This rule is aimed at enforcing a particular brace style in JavaScript. As such, it warns whenever it sees a statement or declaration that does not adhere to the one true brace style.

### Options

The rule takes one option, a string which must be either "1tbs" or "stroustrup". The default is "1tbs". You can set the style in configuration like this:

```json
"brace-style": [2, "stroustrup"]
```

#### "1tbs"

This is the default setting for this rule and enforces one true brace style. While using this setting, the following patterns are considered warnings:

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

if (foo) {
  bar();
}
else {
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

#### "stroustrup"


This enforces Stroustrup style. While using this setting, the following patterns are considered warnings:

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

if (foo) {
  bar();
} else {
  baz();
}
```

The following patterns adhere to Stroustrup style and do not cause warnings:

```js
function foo() {
  return true;
}

if (foo) {
  bar();
}

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

## Further Reading

* [Indent style](http://en.wikipedia.org/wiki/Indent_style)
