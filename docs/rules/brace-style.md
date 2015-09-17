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

Another style is called [Allman](https://en.wikipedia.org/wiki/Indent_style#Allman_style), in which all the braces are expected to be on their own lines without any extra indentation:

```js
if (foo)
{
  bar();
}
else
{
  baz();
}
```

While no style is considered better than the other, most developers agree that having a consistent style throughout a project is important for its long-term maintainability.

## Rule Details

This rule is aimed at enforcing a particular brace style in JavaScript. As such, it warns whenever it sees a statement or declaration that does not adhere to the one true brace style.

### Options

The rule takes two options:

1. A string which must be either "1tbs", "stroustrup" or "allman". The default is "1tbs".
2. An object that further controls the behaviour of this rule. Currently, the only available parameter is `allowSingleLine`, which indicates whether start and end braces may be on the same line.

You can set the style in configuration like this:

```json
"brace-style": [2, "stroustrup", { "allowSingleLine": true }]
```

#### "1tbs"

This is the default setting for this rule and enforces one true brace style. While using this setting, the following patterns are considered problems:

```js
/*eslint brace-style: 2*/
function foo()       /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  return true;
}

if (foo)             /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  bar();
}

try                  /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  somethingRisky();
} catch(e)           /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  handleError();
}

if (foo) {
  bar();
}
else {              /*error Closing curly brace does not appear on the same line as the subsequent block.*/
  baz();
}
```

The following patterns use the one true brace style and are not considered problems:

```js
/*eslint brace-style: 2*/

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

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

With one-line form enabled, the following is also valid:

```js
/*eslint brace-style: [2, "1tbs", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); } else { baz(); }

try { somethingRisky(); } catch(e) { handleError(); }
```

#### "stroustrup"


This enforces Stroustrup style. While using this setting, the following patterns are considered problems:

```js
/*eslint brace-style: [2, "stroustrup"]*/

function foo()        /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  return true;
}

if (foo)              /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  bar();
}

try                   /*error Opening curly brace does not appear on the same line as controlling statement.*/
{
  somethingRisky();
} catch(e)            /*error Opening curly brace does not appear on the same line as controlling statement.*/ /*error Closing curly brace appears on the same line as the subsequent block.*/
{
  handleError();
}

if (foo) {
  bar();
} else {              /*error Closing curly brace appears on the same line as the subsequent block.*/
  baz();
}
```

The following patterns use the Stroustrup style and are not considered problems:

```js
/*eslint brace-style: [2, "stroustrup"]*/

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

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

With one-line form enabled, the following is also valid:

```js
/*eslint brace-style: [2, "stroustrup", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); }
else { baz(); }

try { somethingRisky(); }
catch(e) { handleError(); }
```

#### "allman"


This enforces Allman style. While using this setting, the following patterns are considered problems:

```js
/*eslint brace-style: [2, "allman"]*/

function foo() {     /*error Opening curly brace appears on the same line as controlling statement.*/
  return true;
}

if (foo)
{
  bar(); }           /*error Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.*/

try
{
  somethingRisky();
} catch(e)           /*error Closing curly brace appears on the same line as the subsequent block.*/
{
  handleError();
}

if (foo) {           /*error Opening curly brace appears on the same line as controlling statement.*/ /*error Opening curly brace appears on the same line as controlling statement.*/
  bar();
} else {             /*error Closing curly brace appears on the same line as the subsequent block.*/
  baz();
}
```

The following patterns use the Allman style and are not considered problems:

```js
/*eslint brace-style: [2, "allman"]*/

function foo()
{
  return true;
}

if (foo)
{
  bar();
}

if (foo)
{
  bar();
}
else
{
  baz();
}

try
{
  somethingRisky();
}
catch(e)
{
  handleError();
}

// when there are no braces, there are no problems
if (foo) bar();
else if (baz) boom();
```

With one-line form enabled, the following is also valid:

```js
/*eslint brace-style: [2, "allman", { "allowSingleLine": true }]*/

function nop() { return; }

if (foo) { bar(); }

if (foo) { bar(); }
else { baz(); }

try { somethingRisky(); }
catch(e) { handleError(); }
```

## When Not To Use It

If your project will not be using the one true brace style, turn this rule off.

## Further Reading

* [Indent style](http://en.wikipedia.org/wiki/Indent_style)
