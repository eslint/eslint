---
title: max-len
rule_type: layout
related_rules:
- complexity
- max-depth
- max-nested-callbacks
- max-params
- max-statements
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Very long lines of code in any language can be difficult to read. In order to aid in readability and maintainability many coders have developed a convention to limit lines of code to X number of characters (traditionally 80 characters).

```js
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; // very long
```

## Rule Details

This rule enforces a maximum line length to increase code readability and maintainability. The length of a line is defined as the number of Unicode characters in the line.

## Options

This rule can have up to two numbers as positional arguments (for `code` and `tabWidth` options), followed by an object option (provided positional arguments have priority):

* `"code"` (default `80`) enforces a maximum line length
* `"tabWidth"` (default `4`) specifies the character width for tab characters
* `"comments"` enforces a maximum line length for comments; defaults to value of `code`
* `"ignorePattern"` ignores lines matching a regular expression; can only match a single line and need to be double escaped when written in YAML or JSON
* `"ignoreComments": true` ignores all trailing comments and comments on their own line
* `"ignoreTrailingComments": true` ignores only trailing comments
* `"ignoreUrls": true` ignores lines that contain a URL
* `"ignoreStrings": true` ignores lines that contain a double-quoted or single-quoted string
* `"ignoreTemplateLiterals": true` ignores lines that contain a template literal
* `"ignoreRegExpLiterals": true` ignores lines that contain a RegExp literal

### code

Examples of **incorrect** code for this rule with the default `{ "code": 80 }` option:

::: incorrect

```js
/*eslint max-len: ["error", { "code": 80 }]*/

var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" };
```

:::

Examples of **correct** code for this rule with the default `{ "code": 80 }` option:

::: correct

```js
/*eslint max-len: ["error", { "code": 80 }]*/

var foo = {
  "bar": "This is a bar.",
  "baz": { "qux": "This is a qux" },
  "easier": "to read"
};
```

:::

### tabWidth

Examples of **incorrect** code for this rule with the default `{ "tabWidth": 4 }` option:

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD010 -->
::: incorrect

```js
/*eslint max-len: ["error", { "code": 80, "tabWidth": 4 }]*/

		var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" } };
```

:::
<!-- markdownlint-restore -->

Examples of **correct** code for this rule with the default `{ "tabWidth": 4 }` option:

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD010 -->
::: correct

```js
/*eslint max-len: ["error", { "code": 80, "tabWidth": 4 }]*/

		var foo = {
				"bar": "This is a bar.",
				"baz": { "qux": "This is a qux" }
		};
```

:::
<!-- markdownlint-restore -->

### comments

Examples of **incorrect** code for this rule with the `{ "comments": 65 }` option:

::: incorrect

```js
/*eslint max-len: ["error", { "comments": 65 }]*/

/**
 * This is a comment that violates the maximum line length we have specified
**/
```

:::

### ignoreComments

Examples of **correct** code for this rule with the `{ "ignoreComments": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreComments": true }]*/

/**
 * This is a really really really really really really really really really long comment
**/
```

:::

### ignoreTrailingComments

Examples of **correct** code for this rule with the `{ "ignoreTrailingComments": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreTrailingComments": true }]*/

var foo = 'bar'; // This is a really really really really really really really long comment
```

:::

### ignoreUrls

Examples of **correct** code for this rule with the `{ "ignoreUrls": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreUrls": true }]*/

var url = 'https://www.example.com/really/really/really/really/really/really/really/long';
```

:::

### ignoreStrings

Examples of **correct** code for this rule with the `{ "ignoreStrings": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreStrings": true }]*/

var longString = 'this is a really really really really really long string!';
```

:::

### ignoreTemplateLiterals

Examples of **correct** code for this rule with the `{ "ignoreTemplateLiterals": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreTemplateLiterals": true }]*/

var longTemplateLiteral = `this is a really really really really really long template literal!`;
```

:::

### ignoreRegExpLiterals

Examples of **correct** code for this rule with the `{ "ignoreRegExpLiterals": true }` option:

::: correct

```js
/*eslint max-len: ["error", { "ignoreRegExpLiterals": true }]*/

var longRegExpLiteral = /this is a really really really really really long regular expression!/;
```

:::

### ignorePattern

Examples of **correct** code for this rule with the `ignorePattern` option:

::: correct

```js
/*eslint max-len:
["error", { "ignorePattern": "^\\s*var\\s.+=\\s*require\\s*\\(" }]*/

var dep = require('really/really/really/really/really/really/really/really/long/module');
```

:::
