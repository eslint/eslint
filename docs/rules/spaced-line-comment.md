# Requires or disallows a whitespace (space or tab) beginning a single-line comment (spaced-line-comment)

Some style guides require or disallow a whitespace immediately after the initial `//` of a line comment.
Whitespace after the `//` makes it easier to read text in comments.
On the other hand, commenting out code is easier without having to put a whitespace right after the `//`.


## Rule Details

This rule will enforce consistency of spacing after the start of a line comment `//`.

This rule takes two arguments. If the first is `"always"` then the `//` must be followed by at least once whitespace. 
If `"never"` then there should be no whitespace following.
The default is `"always"`.

The second argument is an object with one key, `"exceptions"`. 
The value is an array of string patterns which are considered exceptions to the rule. 
It is important to note that the exceptions are ignored if the first argument is `"never"`.
Exceptions cannot be mixed.

The following patterns are considered warnings:

```js
// When ["never"]
// This is a comment with a whitespace at the beginning
```

```js
//When ["always"]
//This is a comment with no whitespace at the beginning
var foo = 5;  
```

```js
// When ["always",{exceptions:["-","+"]}]
//------++++++++
// Comment block
//------++++++++
```

The following patterns are not warnings:

```js
// When ["always"]
// This is a comment with a whitespace at the beginning
var foo = 5;  
```

```js
//When ["never"]
//This is a comment with no whitespace at the beginning
var foo = 5;  
```

```js
// When ["always",{exceptions:["-"]}]
//--------------
// Comment block
//--------------
```

```js
// When ["always",{exceptions:["-+"]}]
//-+-+-+-+-+-+-+
// Comment block
//-+-+-+-+-+-+-+
```
