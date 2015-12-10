# Limit Maximum Length of Line (max-len)

Very long lines of code in any language can be difficult to read. In order to aid in readability and maintainability many coders have developed a convention to limit lines of code to X number of characters (traditionally 80 characters).

```js
// max-len: [1, 80, 4]; // maximum length of 80 characters
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; // too long
```


## Rule Details

This rule is aimed at increasing code readability and maintainability by enforcing a line length convention. As such it will warn on lines that exceed the configured maximum.

**Note:** This rule calculates the length of a line via code points, not characters. That means if you use a double-byte character in your code, it will count as 2 code points instead of 1, and 2 will be used to calculate line length. This is a technical limitation of JavaScript that is made easier with ES2015, and we will look to update this when ES2015 is available in Node.js.

The following patterns are considered problems:

```js
/*eslint max-len: [2, 80, 4]*/ // maximum length of 80 characters

var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; /*error Line 3 exceeds the maximum line length of 80.*/
```

The following patterns are not considered problems:

```js
/*eslint max-len: [2, 80, 4]*/ // maximum length of 80 characters

var foo = {
    "bar": "This is a bar.",
    "baz": {
        "qux": "This is a qux"
    },
    "difficult": "to read"
};
```

### Options

The `max-len` rule supports the following options:

`code`: The total number of characters allowed on each line of code. This character count includes indentation. Defaults to 80.

`comments`: The total number of characters allowed on a line of comments (e.g. no code on the line). If not specified, `code` is used for comment lines.

`tabWidth`: The character count to use whenever a tab character is encountered. Defaults to 4.

`ignoreComments`: Ignores all trailing comments and comments on their own line. For example, `function foo(/*string*/ bar) { /* ... */ }` isn't collapsed.

`ignoreTrailingComments`: Only ignores comments that are trailing source.

`commentLength`: Specifies an alternate max length that applies only to full length comments.

`ignoreUrls`: Ignores lines that contain a URL.

`ignorePattern`: Ignores lines matching a regular express, such as `^\\s*var\\s.+=\\s*require\\s*\\(`. Be aware that regular expressions can only match a single line and need to be doubly escaped when written in YAML or JSON.

Optionally, you may specify `code` and `tabWidth` as integers before the options object:

```json
"max-len": [2, 80, 4, {ignoreUrls: true}]
```

is equivalent to

```json
"max-len": [2, {code: 80, tabWidth: 4, ignoreUrls: true}]
```


## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
