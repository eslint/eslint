# Allow or disallow the Unicode Byte Order Mark (BOM) (unicode-bom)

The Unicode Byte Order Mark (BOM) is used to specify whether code units are big
endian or little endian. That is, whether the most significant or least
significant bytes come first. UTF-8 does not require a BOM because byte ordering
does not matter when characters are a single byte. Since UTF-8 is the dominant
encoding of the web, we make `"never"` the default option.

## Rule Details

If the `"never"` option is used, this rule requires that the file does not begin
with the unicode BOM character U+FEFF.

## Options

This rule has a string option:

* `"always"` the unicode BOM is always allowed
* `"never"` (default) the unicode BOM is never allowed

### always

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint unicode-bom: "error"*/

U+FEFF
var abc;
```

```js
/*eslint unicode-bom: "error"*/

var abc;
```

### never

Example of **correct** code for this rule with the default `"never"` option:

```js
/*eslint unicode-bom: ["error", "never"]*/

var abc;
```

Example of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint unicode-bom: ["error", "never"]*/

U+FEFF
var abc;
```

## When Not To Use It

If your files are stored in UTF-16 or UTF-32, turn this rule off or use the
"always" option.
