# Rule to disallow a duplicate case label (no-duplicate-case)

If a switch statement has duplicate case labels, it is likely that a programmer copied a case but forgot to change the label.

## Rule Details

This rule is aimed at eliminating duplicate case labels in switch statements

Examples of **incorrect** code for this rule:

```js
/*eslint no-duplicate-case: 2*/

var a = 1,
    one = 1;

switch (a) {
    case 1:
        break;
    case 2:
        break;
    case 1:         // duplicate case label
        break;
    default:
        break;
}

switch (a) {
    case one:
        break;
    case 2:
        break;
    case one:         // duplicate case label
        break;
    default:
        break;
}

switch (a) {
    case "1":
        break;
    case "2":
        break;
    case "1":         // duplicate case label
        break;
    default:
        break;
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-duplicate-case: 2*/

var a = 1,
    one = 1;

switch (a) {
    case 1:
        break;
    case 2:
        break;
    case 3:
        break;
    default:
        break;
}

switch (a) {
    case one:
        break;
    case 2:
        break;
    case 3:
        break;
    default:
        break;
}

switch (a) {
    case "1":
        break;
    case "2":
        break;
    case "3":
        break;
    default:
        break;
}
```
