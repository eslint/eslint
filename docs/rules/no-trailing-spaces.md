# Disallow trailing spaces at the end of lines (no-trailing-spaces)

Sometimes in the course of editing files, you can end up with extra whitespace at the end of lines. These whitespace differences can be picked up by source control systems and flagged as diffs, causing frustration for developers. While this extra whitespace causes no functional issues, many code conventions require that trailing spaces be removed before checkin.

## Rule Details

The following patterns are considered warnings:

```js
// spaces, tabs and unicode whitespaces
// are not allowed at the end of lines
var foo = 0;•••••
var baz = 5;••
```

The following patterns are not warnings:

```js
var foo = 0;

var baz = 5;
```
