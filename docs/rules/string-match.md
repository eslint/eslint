# disallow strings that match a given regular expression (string-match)

Strings are gold mines of hidden information: I've seen type systems and enumerations implemented in strings. I've seen numbers being used as strings to get around type conversions. And sometimes, you just want to enforce some consistency in your errors. This rule allows you to highlight these issues and decide how you want to act on them.

## Rule Details

This rule disallows strings that match a specified regular expression.


## Options

This rule has a string option for the specified regular expression.

For example, to ensure no fully numeric strings appear:

```json
{
    "string-match": ["error", "^[0-9\-\.][0-9\.]*$"]
}
```

Examples of **correct** code for this rule with the `"^[0-9\.]+$"` option:

```js
/*eslint id-match: ["error", "^[0-9\.]+$"]*/

var foo = "No numbers";
var bar = "Numb3r5 4nd 13773r5";
```

Examples of **incorrect** code for this rule with the `"^[0-9\.]+$"` option:

```js
/*eslint id-match: ["error", "^[0-9\.]+$"]*/

var foo = "1";
var bar = "0.123";
var baz = "-1";
```


## When Not To Use It

Regular expressions are often a rabbit hole you don't want to go down.
