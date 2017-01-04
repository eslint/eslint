# enforce placing object properties on separate lines (object-property-newline)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

While formatting preferences are very personal, a number of style guides require that object properties be placed on separate lines for better readability.

Another argument in favor of this style is that it improves the readability of diffs when a property is changed:

```diff
// More readable
 var obj = {
     foo: "foo",
-    bar: "bar",
+    bar: "bazz",
     baz: "baz"
 };
```

```diff
// Less readable
-var obj = { foo: "foo", bar: "bar", baz: "baz" };
+var obj = { foo: "foo", bar: "bazz", baz: "baz" };
```

## Rule Details

This rule aims to maintain consistency of newlines between object properties.

Examples of **incorrect** code for this rule:

```js
/*eslint object-property-newline: "error"*/

var obj = { foo: "foo", bar: "bar", baz: "baz" };

var obj2 = {
    foo: "foo", bar: "bar", baz: "baz"
};

var obj3 = {
    foo: "foo", bar: "bar",
    baz: "baz"
};
```

Examples of **correct** code for this rule:

```js
/*eslint object-property-newline: "error"*/

var obj = {
    foo: "foo",
    bar: "bar",
    baz: "baz"
};
```

## Options

This rule has an object option:

* `"allowMultiplePropertiesPerLine"`: `true` allows all keys and values to be on the same line

### allowMultiplePropertiesPerLine

Examples of additional **correct** code for this rule with the `{ "allowMultiplePropertiesPerLine": true }` option:

```js
/*eslint object-property-newline: ["error", { "allowMultiplePropertiesPerLine": true }]*/

var obj = { foo: "foo", bar: "bar", baz: "baz" };

var obj2 = {
    foo: "foo", bar: "bar", baz: "baz"
};
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of newlines between object properties.

## Compatibility

* **JSCS**: [requireObjectKeysOnNewLine](http://jscs.info/rule/requireObjectKeysOnNewLine)

## Related Rules

* [brace-style](brace-style.md)
* [comma-dangle](comma-dangle.md)
* [key-spacing](key-spacing.md)
* [object-curly-spacing](object-curly-spacing.md)
