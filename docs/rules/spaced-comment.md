# Requires or disallows a whitespace (space or tab) beginning a comment (spaced-comment)

Some style guides require or disallow a whitespace immediately after the initial `//` or `/*` of a comment.
Whitespace after the `//` or `/*` makes it easier to read text in comments.
On the other hand, commenting out code is easier without having to put a whitespace right after the `//` or `/*`.


## Rule Details

This rule will enforce consistency of spacing after the start of a comment `//` or `/*`.

This rule takes two arguments. If the first is `"always"` then the `//` or `/*` must be followed by at least once whitespace.
If `"never"` then there should be no whitespace following.
The default is `"always"`.

The second argument is an object with two keys, `"exceptions"` and `"markers"`.
The `"exceptions"` value is an array of string patterns which are considered exceptions to the rule.
It is important to note that the exceptions are ignored if the first argument is `"never"`.

Exceptions cannot be mixed. From the collection of exceptions provided only one of them can be used inside the comment. Mixing of more than one is not valid.

The `"markers"` value is an array of string patterns which are considered markers for docblock-style comments,
such as an additional `/`, used to denote documentation read by doxygen, vsdoc, etc. which must have additional characters.
The `"markers"` array will apply regardless of the value of the first argument, e.g. `"always"` or `"never"`.

The following patterns are considered warnings:

```js
// When ["never"]
// This is a comment with a whitespace at the beginning
```

```js
// When ["never"]
/* This is a comment with a whitespace at the beginning */
```

```js
// When ["never"]
/* \nThis is a comment with a whitespace at the beginning */
```

```js
//When ["always"]
//This is a comment with no whitespace at the beginning
var foo = 5;
```

```js
//When ["always"]
/*This is a comment with no whitespace at the beginning */
var foo = 5;
```

```js
// When ["always",{"exceptions":["-","+"]}]
//------++++++++
// Comment block
//------++++++++
```

```js
// When ["always",{"markers":["/"]}]
///This is a comment with a marker but without whitespace
```

```js
// When ["always",{"exceptions":["-","+"]}]
/*------++++++++*/
/* Comment block */
/*------++++++++*/
```

The following patterns are not warnings:

```js
// When ["always"]
// This is a comment with a whitespace at the beginning
var foo = 5;
```

```js
// When ["always"]
/* This is a comment with a whitespace at the beginning */
var foo = 5;
```

```js
// When ["always"]
/*\n * This is a comment with a whitespace at the beginning */
var foo = 5;
```


```js
//When ["never"]
/*This is a comment with no whitespace at the beginning */
var foo = 5;
```

```js
// When ["always",{"exceptions":["-"]}]
//--------------
// Comment block
//--------------
```

```js
// When ["always",{"exceptions":["-+"]}]
//-+-+-+-+-+-+-+
// Comment block
//-+-+-+-+-+-+-+
```

```js
// When ["always",{"exceptions":["-+"]}]
/*-+-+-+-+-+-+-+*/
// Comment block
/*-+-+-+-+-+-+-+*/
```

```js
// When ["always",{"markers":["/"]}]
/// This is a comment with a marker
```

```js
// When ["never",{"markers":["!<"]}]
//!<This is a comment with a marker
/*!<this is a block comment with a marker
subsequent lines are ignored
*/
```

```js
// When ["always"]
/**
* I am jsdoc
*/
```

```js
// When ["never"]
/**
* I am jsdoc
*/
```

