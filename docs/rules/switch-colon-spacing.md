# Enforce spacing around colons of switch statements (switch-colon-spacing)

Spacing around colons improves readability of `case`/`default` closures.

## Rule Details

This rule reports around colons of `case`/`default` closures if it's different to configured spacing.

Examples of **incorrect** code for this rule:

```js
/*eslint switch-colon-spacing: "error"*/

switch (a) {
    case 0 :break;
    default :foo();
}
```

Examples of **correct** code for this rule:

```js
/*eslint switch-colon-spacing: "error"*/

switch (a) {
    case 0: foo(); break;
    case 1:
        bar();
        break;
    default:
        baz();
        break;
}
```

## Options

```json
{
    "switch-colon-spacing": ["error", {"after": true, "before": false}]
}
```

- `"after": true` (Default) ... requires one or more spaces after colons.
- `"after": false` ... disallows spaces after colons.
- `"before": true` ... requires one or more spaces before colons.
- `"before": false` (Default) ... disallows before colons.

## When Not To Use It

If you don't want to notify spacing around colons of switch statements, then it's safe to disable this rule.
