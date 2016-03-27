# Disallow string concatenation when using `__dirname` and `__filename` (no-path-concat)

In Node.js, the `__dirname` and `__filename` global variables contain the directory path and the file path of the currently executing script file, respectively. Sometimes, developers try to use these variables to create paths to other files, such as:

```js
var fullPath = __dirname + "/foo.js";
```

However, there are a few problems with this. First, you can't be sure what type of system the script is running on. Node.js can be run on any computer, including Windows, which uses a different path separator. It's very easy, therefore, to create an invalid path using string concatenation and assuming Unix-style separators. There's also the possibility of having double separators, or otherwise ending up with an invalid path.

In order to avoid any confusion as to how to create the correct path, Node.js provides the `path` module. This module uses system-specific information to always return the correct value. So you can rewrite the previous example as:

```js
var fullPath = path.join(__dirname, "foo.js");
```

This example doesn't need to include separators as `path.join()` will do it in the most appropriate manner. Alternately, you can use `path.resolve()` to retrieve the fully-qualified path:

```js
var fullPath = path.resolve(__dirname, "foo.js");
```

Both `path.join()` and `path.resolve()` are suitable replacements for string concatenation wherever file or directory paths are being created.

## Rule Details

This rule aims to prevent string concatenation of directory paths in Node.js

Examples of **incorrect** code for this rule:

```js
/*eslint no-path-concat: "error"*/

var fullPath = __dirname + "/foo.js";

var fullPath = __filename + "/foo.js";

```

Examples of **correct** code for this rule:

```js
/*eslint no-path-concat: "error"*/

var fullPath = dirname + "/foo.js";
```

## When Not To Use It

If you want to allow string concatenation of path names.
