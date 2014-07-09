# Limit Maximum Length of Line (max-len)

Very long lines of code in any language can be difficult to read. In order to aid in readability and maintainability many coders have developed a convention to limit lines of code to X number of characters (traditionally 80 characters).

```js
// max-len: [1, 80, 4]; // maximum length of 80 characters
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; // too long
```

## Rule Details

This rule is aimed at increading code readability and maintainability by enforcing a line length convention. As such it will warn on lines that exceed the configured maximum.

The following patterns are considered warnings:

```js
// max-len: [1, 80, 4]; // maximum length of 80 characters
var foo = { "bar": "This is a bar.", "baz": { "qux": "This is a qux" }, "difficult": "to read" }; // too long
```

The following patterns are not considered warnings:

```js
// max-len: [1, 80, 4]; // maximum length of 80 characters
var foo = {
    "bar": "This is a bar.",
    "baz": {
        "qux": "This is a qux"
    },
    "difficult": "to read"
};
```

### Options

The `max-len` rule has two required options:

* The total number of characters allowed on each line of code. This character count includes indentation.
* The character count to use whenever a tab character is encountered.

For example, to specify a maximum line length of 80 characters with each tab counting as 4 characters, use the following configuration:

```
"max-len": [2, 80, 4]
```


## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
