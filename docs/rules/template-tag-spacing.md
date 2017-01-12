# Enforce Usage of Spacing in Tagged Template Literals (template-tag-spacing)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

We can create functions whose parameters consist of template literals.

This rule can force usage of spacing _between_ the tag function and the template literal.

```js
let hello = func`Hello world`;
```

## Rule Details

This rule aims to maintain consistency around the spacing between template tag functions and their template literals.

## Options

```json
{
    "template-tag-spacing": ["error", "never"]
}
```

This rule has one option which has either `"never"` or `"always"` as value.

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
