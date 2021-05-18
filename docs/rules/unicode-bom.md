# Require or disallow the Unicode Byte Order Mark (BOM) (unicode-bom)

The Unicode Byte Order Mark (BOM) is used to specify whether code units are big
endian or little endian. That is, whether the most significant or least
significant bytes come first. UTF-8 does not require a BOM because byte ordering
does not matter when characters are a single byte. Since UTF-8 is the dominant
encoding of the web, we make `"never"` the default option.

## Rule Details

If the `"always"` option is used, this rule requires that files always begin
with the Unicode BOM character U+FEFF. If `"never"` is used, files must never
begin with U+FEFF.

## Options

This rule has a string option:

* `"always"` files must begin with the Unicode BOM
* `"never"` (default) files must not begin with the Unicode BOM

### always

Example of **correct** code for this rule with the `"always"` option:

```js
/*eslint unicode-bom: "error"*/

U+FEFF
var abc;
```

Example of **incorrect** code for this rule with the `"always"` option:

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

If you use some UTF-16 or UTF-32 files and you want to allow a file to
optionally begin with a Unicode BOM, you should turn this rule off.
