# Enforce Usage of Spacing in Template Strings (template-curly-spacing)

(fixable) The --fix option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

We can embed expressions in template strings with using a pair of `${` and `}`.
This rule can force usage of spacing inside of the curly brace pair according to style guides.

```js
let hello = `hello, ${people.name}!`;
```

## Rule Details

This rule aims to maintain consistency around the spacing inside of template literals.

## Options

```json
{
    "template-curly-spacing": ["error", "never"]
}
```

This rule has one option which has either `"never"` or `"always"` as value.

* `"never"` (by default) - Disallows spaces inside of the curly brace pair.
* `"always"` - Requires one or more spaces inside of the curly brace pair.

The following patterns are considered problems when configured `"never"`:

```js
/*eslint template-curly-spacing: "error"*/

`hello, ${ people.name}!`;
`hello, ${people.name }!`;

`hello, ${ people.name }!`;
```

The following patterns are considered problems when configured `"always"`:

```js
/*eslint template-curly-spacing: ["error", "always"]*/

`hello, ${ people.name}!`;
`hello, ${people.name }!`;

`hello, ${people.name}!`;
```

The following patterns are not considered problems when configured `"never"`:

```js
/*eslint template-curly-spacing: "error"*/

`hello, ${people.name}!`;

`hello, ${
    people.name
}!`;
```

The following patterns are not considered problems when configured `"always"`:

```js
/*eslint template-curly-spacing: ["error", "always"]*/

`hello, ${ people.name }!`;

`hello, ${
    people.name
}!`;
```

## When Not To Use It

If you don't want to be notified about usage of spacing inside of template strings, then it's safe to disable this rule.
