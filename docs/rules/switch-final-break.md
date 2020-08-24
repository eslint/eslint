# Checks whether the final clause of a switch statement ends in unnecessary `break;`. (switch-final-break)

The final clause of a switch statement can end with an unnecessary `break;` statement, which can lead to inconsistency within a codebase.
This rule improve codebase consistency by preventing this last `break;` statement.

## Options

### "never"

When using the default `"never"` option, an unnecessary `break;` statement at the end of a switch statement is not allowed.

```json
{
  "switch-final-break": ["error"]
}
```

or

```json
{
  "switch-final-break": ["error", "never"]
}
```

Examples of **incorrect** code for this rule with `"never"`:

```js
/*eslint switch-final-break: ["error", "never"]*/

switch (x) {
  case 0: {
    foo();
    break;
  }
}
```

Examples of **correct** code for this rule with `"never"`:

```js
/*eslint switch-final-break: ["error", "never"]*/

switch (x) {
  case 0: {
    foo();
  }
}
```

### "always"

When using the `"always"` option, a `break;` statement at the end of a switch statement is required.

```json
{
  "switch-final-break": ["error", "always"]
}
```

Examples of **incorrect** code for this rule with `"always"`:

```js
/*eslint switch-final-break: ["error", "always"]*/

switch (x) {
  case 0: {
    foo();
  }
}
```

Examples of **correct** code for this rule with `"always"`:

```js
/*eslint switch-final-break: ["error", "always"]*/

switch (x) {
  case 0: {
    foo();
    break;
  }
}
```

## When Not To Use It

You can safely disable this rule if you do not care about enforcing consistent in the last clause of a switch statement regarding the use of the `break` statement.
