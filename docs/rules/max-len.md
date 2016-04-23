# enforce a maximum line length (max-len)

Very long lines of code in any language can be difficult to read. In order to aid in readability and maintainability many coders have developed a convention to limit lines of code to X number of characters (traditionally 80 characters).

```js
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; // very long
```

## Rule Details

This rule enforces a maximum line length to increase code readability and maintainability.

**Note:** This rule calculates the length of a line via code points, not characters. That means if you use a double-byte character in your code, it will count as 2 code points instead of 1, and 2 will be used to calculate line length. This is a technical limitation of JavaScript that is made easier with ES2015, and we will look to update this when ES2015 is available in Node.js.

## Options

This rule has a number or object option:

* `"code"` (default `80`) enforces a maximum line length
* `"tabWidth"` (default `4`) specifies the character width for tab characters
* `"comments"` enforces a maximum line length for comments; defaults to value of `code`
* `"ignorePattern"` ignores lines matching a regular expression; can only match a single line and need to be double escaped when written in YAML or JSON
* `"ignoreComments": true` ignores all trailing comments and comments on their own line
* `"ignoreTrailingComments": true` ignores only trailing comments
* `"ignoreUrls": true` ignores lines that contain a URL

### code

Examples of **incorrect** code for this rule with the default `{ "code": 80 }` option:

```js
/*eslint max-len: ["error", 80]*/

var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" };
```

Examples of **correct** code for this rule with the default `{ "code": 80 }` option:

```js
/*eslint max-len: ["error", 80]*/

var foo = {
  "bar": "This is a bar.",
  "baz": { "qux": "This is a qux" },
  "easier": "to read"
};
```

### tabWidth

Examples of **incorrect** code for this rule with the default `{ "tabWidth": 4 }` option:

```js
/*eslint max-len: ["error", 80, 4]*/

\t  \t  var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" } };
```

Examples of **correct** code for this rule with the default `{ "tabWidth": 4 }` option:

```js
/*eslint max-len: ["error", 80, 4]*/

\t  \t  var foo = {
\t  \t  \t  \t  "bar": "This is a bar.",
\t  \t  \t  \t  "baz": { "qux": "This is a qux" }
\t  \t  };
```

### comments

Examples of **incorrect** code for this rule with the `{ "comments": 65 }` option:

```js
/*eslint max-len: ["error", { "comments": 65 }]*/

/**
 * This is a comment that violates the maximum line length we have specified
**/
```

### ignoreComments

Examples of **correct** code for this rule with the `{ "ignoreComments": true }` option:

```js
/*eslint max-len: ["error", { "ignoreComments": true }]*/

/**
 * This is a really really really really really really really really really long comment
**/
```

### ignoreTrailingComments

Examples of **correct** code for this rule with the `{ "ignoreTrailingComments": true }` option:

```js
/*eslint max-len: ["error", { "ignoreTrailingComments": true }]*/

var foo = 'bar'; // This is a really really really really really really really long comment
```

### ignoreUrls

Examples of **correct** code for this rule with the `{ "ignoreUrls": true }` option:

```js
/*eslint max-len: ["error", { "ignoreUrls": true }]*/

var url = 'https://www.example.com/really/really/really/really/really/really/really/long';
```

### ignorePattern

Examples of **correct** code for this rule with the `{ "ignorePattern": true }` option:

```js
/*eslint max-len: ["error", { "ignorePattern": "^\\s*var\\s.+=\\s*require\\s*\\(/" }]*/

var dep = require('really/really/really/really/really/really/really/really/long/module');
```

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
