# Requires or disallows a whitespace (space or tab) beginning a comment (spaced-comment)

Some style guides require or disallow a whitespace immediately after the initial `//` or `/*` of a comment.
Whitespace after the `//` or `/*` makes it easier to read text in comments.
On the other hand, commenting out code is easier without having to put a whitespace right after the `//` or `/*`.

## Rule Details

This rule will enforce consistency of spacing after the start of a comment `//` or `/*`.

### Options

The rule takes one option, a string, which could be either "always" or "never". If you pass `"always"` then the `//` or `/*` must be followed by at least once whitespace. If `"never"` then there should be no whitespace following. The default is `"always"`.

Here is an example of how to configure the rule:

```js
"spaced-comment": [2, "always"]
```

#### Exceptions

This rule can also take a 2nd option, an object with either of the following keys: `"exceptions"` and `"markers"`.

The `"exceptions"` value is an array of string patterns which are considered exceptions to the rule.
It is important to note that the exceptions are ignored if the first argument is `"never"`.

```js
"spaced-comment": [2, "always", "exceptions": ["-", "+"]]
```

The `"markers"` value is an array of string patterns which are considered markers for docblock-style comments,
such as an additional `/`, used to denote documentation read by doxygen, vsdoc, etc. which must have additional characters.
The `"markers"` array will apply regardless of the value of the first argument, e.g. `"always"` or `"never"`.

```js
"spaced-comment": [2, "always", "markers": ["/"]]
```

#### Examples

The following patterns **are** considered warnings:

Configuration: `[2, "never"]`
```js
// This is a comment with a whitespace at the beginning
```

Configuration: `[2, "never"]`
```js
/* This is a comment with a whitespace at the beginning */
```

Configuration: `[2, "never"]`
```js
/* \nThis is a comment with a whitespace at the beginning */
```

Configuration: `[2, "always"]`
```js
//This is a comment with no whitespace at the beginning
var foo = 5;
```
 
Configuration: `[2, "always"]`
```js
/*This is a comment with no whitespace at the beginning */
var foo = 5;
```

Configuration: `[2, "always", { "exceptions": ["-", "+"] }]`
```js
//------++++++++
// Comment block
//------++++++++
```

Configuration: `[2, "always", { "markers": ["/"] }]`
```js
///This is a comment with a marker but without whitespace
```

Configuration: `[2, "always", { "exceptions": ["-", "+"] }]`
```js
/*------++++++++*/
/* Comment block */
/*------++++++++*/
```

The following patterns **are not** warnings:

Configuration: `[2, "always"]`
```js
// This is a comment with a whitespace at the beginning
var foo = 5;
```

Configuration: `[2, "always"]`
```js
/* This is a comment with a whitespace at the beginning */
var foo = 5;
```

Configuration: `[2, "always"]`
```js
/*\n * This is a comment with a whitespace at the beginning */
var foo = 5;
```

Configuration: `[2, "never"]`
```js
/*This is a comment with no whitespace at the beginning */
var foo = 5;
```

Configuration: `[2, "always", { "exceptions": ["-"] }]`
```js
//--------------
// Comment block
//--------------
```

Options: `[2, "always", { "exceptions": ["-+"] }]`
```js
//-+-+-+-+-+-+-+
// Comment block
//-+-+-+-+-+-+-+
```

Configuration: `[2, "always", {"exceptions": ["-+"]} ]`
```js
/*-+-+-+-+-+-+-+*/
// Comment block
/*-+-+-+-+-+-+-+*/
```

Configuration: `[2, "always", { "markers": ["/"] }]`
```js
/// This is a comment with a marker
```

Configuration: `[2, "never", { "markers": ["!<"] }]`
```js
//!<This is a comment with a marker
/*!<this is a block comment with a marker
subsequent lines are ignored
*/
```

Configuration: `[2, "always"]`
```js
/**
* I am jsdoc
*/
```

Configuration: `[2, "never"]`
```js
/**
* I am jsdoc
*/
```

