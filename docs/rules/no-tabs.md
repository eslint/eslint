# disallow all tabs (no-tabs)

Some style guides don't allow the use of tab characters at all, including within comments.

## Rule Details

This rule looks for tabs anywhere inside a file: code, comments or anything else.

Examples of **incorrect** code for this rule:

```js
var a /t= 2;

/**
* /t/t its a test function
*/
function test(){}

var x = 1; // /t test
```

Examples of **correct** code for this rule:

```js
var a = 2;

/**
* its a test function
*/
function test(){}

var x = 1; // test
```

## When Not To Use It

If you have established a standard where having tabs is fine.

## Compatibility

* **JSCS**: [disallowTabs](http://jscs.info/rule/disallowTabs)
