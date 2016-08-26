# Disallow tabs in file (no-tabs)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule. Tabs used for whitespace (indentation) are replaced by four spaces (you can use the rule [`indent`](../rules/indent) to further fix these to match the desired indentation width) and tabs in string/regex literals are replaced by the tab escape sequence `\t`.

Some style guides don't allow the use of tab characters anywhere. So they would want to disallow tab anywhere inside a file including comments.

## Rule Details

This rule looks for tabs inside the file. It can be anywhere inside code or comments or anything.

Examples of **incorrect** code for this rule:

```js
const a \t= 2;

/**
* \t\t its a test function
*/
function test() {}

const x = 1; // \t test
```

Examples of **correct** code for this rule:

```js
const a = 2;

/**
* It's a test function
*/
function test() {}

const x = 1; // test
```

## When Not To Use It

If you have established a standard where tabs are the preferred way of indenting your code you can safely disable this rule.

## Compatibility

* **JSCS**: [disallowTabs](http://jscs.info/rule/disallowTabs)
