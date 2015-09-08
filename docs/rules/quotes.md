# Enforce Quote Style (quotes)

Enforces coding style that string literals are delimited with backticks, single or double quotes.

It takes an option as the second parameter which can be `"double"`, `"single"` or `"backtick"` for double-quotes, single-quotes or backticks respectively. There is no default.

```js
var double = "double";
var single = 'single';
var backtick = `backtick`;
```

The third parameter enables an exception to the rule to avoid escaping quotes. For example, when `"single"` is the standard, this option allows the use of outer double quotes to avoid escaping single quotes. This option can have the value `"avoid-escape"` and is off by default.

```json
quotes: [2, "single", "avoid-escape"]
```

## Rule Details

This rule will throw warnings when the wrong type of quote is used.

The following patterns are considered warnings:

```js
/*eslint quotes: [2, "double"]*/

var single = 'single';                                 /*error Strings must use doublequote.*/
var unescaped = 'a string containing "double" quotes'; /*error Strings must use doublequote.*/
```

```js
/*eslint quotes: [2, "single"]*/

var double = "double";                                 /*error Strings must use singlequote.*/
var unescaped = "a string containing 'single' quotes"; /*error Strings must use singlequote.*/
```

```js
/*eslint quotes: [2, "double", "avoid-escape"]*/

var single = 'single'; /*error Strings must use doublequote.*/
```

```js
/*eslint quotes: [2, "single", "avoid-escape"]*/

var double = "double"; /*error Strings must use singlequote.*/
```

```js
/*eslint quotes: [2, "backtick"]*/

var single = 'single';                             /*error Strings must use backtick.*/
var double = "double";                             /*error Strings must use backtick.*/
var unescaped = 'a string containing `backticks`'; /*error Strings must use backtick.*/
```

```js
/*eslint quotes: [2, "backtick", "avoid-escape"]*/

var single = 'single'; /*error Strings must use backtick.*/
var double = "double"; /*error Strings must use backtick.*/
```

The following patterns are not considered warnings:

```js
/*eslint quotes: [2, "double"]*/

var double = "double";
var backtick = `backtick`; // backticks are allowed
```

```js
/*eslint quotes: [2, "single"]*/

var single = 'single';
var backtick = `backtick`; // backticks are allowed
```

```js
/*eslint quotes: [2, "double", "avoid-escape"]*/

var single = 'a string containing "double" quotes';
```

```js
/*eslint quotes: [2, "single", "avoid-escape"]*/

var double = "a string containing 'single' quotes";
```

```js
/*eslint quotes: [2, "backtick"]*/

var backtick = `backtick`;
```

```js
/*eslint quotes: [2, "backtick", "avoid-escape"]*/

var double = "a string containing `backtick` quotes"
```
