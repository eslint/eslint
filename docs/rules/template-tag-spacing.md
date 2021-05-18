# Require or disallow spacing between template tags and their literals (template-tag-spacing)

With ES6, it's possible to create functions called [tagged template literals](#further-reading) where the function parameters consist of a template literal's strings and expressions.

When using tagged template literals, it's possible to insert whitespace between the tag function and the template literal. Since this whitespace is optional, the following lines are equivalent:

```js
let hello = func`Hello world`;
let hello = func `Hello world`;
```

## Rule Details

This rule aims to maintain consistency around the spacing between template tag functions and their template literals.

## Options

```json
{
    "template-tag-spacing": ["error", "never"]
}
```

This rule has one option whose value can be set to "never" or "always"

* `"never"` (default) - Disallows spaces between a tag function and its template literal.
* `"always"` - Requires one or more spaces between a tag function and its template literal.

## Examples

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

```js
/*eslint template-tag-spacing: "error"*/

func `Hello world`;
```

Examples of **correct** code for this rule with the default `"never"` option:

```js
/*eslint template-tag-spacing: "error"*/

func`Hello world`;
```

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint template-tag-spacing: ["error", "always"]*/

func`Hello world`;
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint template-tag-spacing: ["error", "always"]*/

func `Hello world`;
```

## When Not To Use It

If you don't want to be notified about usage of spacing between tag functions and their template literals, then it's safe to disable this rule.

## Further Reading

If you want to learn more about tagged template literals, check out the links below:

* [Template literals (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)
* [Examples of using tagged template literals (Exploring ES6)](http://exploringjs.com/es6/ch_template-literals.html#_examples-of-using-tagged-template-literals)
