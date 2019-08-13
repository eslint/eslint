# Checks whether the final clause of a switch statement ends in unnecessary `break;`. (switch-final-break)

Examples of **correct** code:

```js
switch (x) {
  case 0: {
    foo();
  }
}
```

Examples of **incorrect** code:

```js
switch (x) {
  case 0: {
    foo();
    break;
  }
}
```

## Options

Can get `never` (the default) or `always` (always ends with `break;`):

```json
{
  "switch-final-break": ["error", "always"]
}
```
