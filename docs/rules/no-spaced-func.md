# Disallow Spaces in Function Calls (no-spaced-func)

While it's possible to have whitespace between the name of a function and the parentheses that execute it, such patterns tend to look more like errors.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule does not allow gaps between the function identifier and application.

```js
fn ()
```

The following patterns are considered problems:

```js
/*eslint no-spaced-func: 2*/

fn () /*error Unexpected space between function name and paren.*/

fn    /*error Unexpected space between function name and paren.*/
()
```

The following patterns are not considered problems:

```js
/*eslint no-spaced-func: 2*/

fn()
```

