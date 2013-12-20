# Enforce Quote Style

Enforces coding style that string literals are delimited with single or double quotes.

It takes an option as the second parameter which can be `"double"` or `"single"` for double-quotes or single-quotes respectively. There is no default.

```js
var double = "double";
var single = 'single';
```

The third parameter enables an exception to the rule to avoid escaping quotes. For example, when `"single"` is the standard, this option allows the use of double quotes to avoid escaping single quotes. This option can have the value `"allow-avoiding-escaped-quotes"` and is off by default.

## Rule Details

This rule will throw warnings when the wrong type of quote is used.

The following patterns are considered warnings:

```js
// When [1, "double"]
var single = 'single';

// When [1, "single"]
var double = "double";

// When [1, "double", "allow-avoiding-escaped-quotes"]
var single = 'single';

// When [1, "single", "allow-avoiding-escaped-quotes"]
var double = "double";
```

The follow patterns are not considered warnings:

```js
// When [1, "double"]
var double = "double";

// When [1, "single"]
var single = 'single';

// When [1, "double", "allow-avoiding-escaped-quotes"]
var single = 'a string containing "double" quotes';

// When [1, "single", "allow-avoiding-escaped-quotes"]
var double = "a string containing 'single' quotes";
```

