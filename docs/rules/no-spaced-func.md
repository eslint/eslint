# Disallow Spaces in Function Calls (no-spaced-func)

(fixable) The --fix option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

While it's possible to have whitespace between the name of a function and the parentheses that execute it, such patterns tend to look more like errors.

## Rule Details

This rule does not allow gaps between the function identifier and application.

```js
fn ()
```

The following patterns are considered problems:

```js
/*eslint no-spaced-func: "error"*/

fn ()

fn
()
```

The following patterns are not considered problems:

```js
/*eslint no-spaced-func: "error"*/

fn()
```
