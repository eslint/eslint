# break case

`Break` is used to prevent the code from running into the next case automatically. If it's not use, it might lead to unexpected behavior and errors.

```js
switch (a) {
    case 0:
        b = "zero";
    case 1:
        b = "one";
        break;
}
```

## Rule Details

This rule is aimed at preventing possible errors and unexpected behavior that might arise from not using `break` keyword inside case statements.

The following patterns are considered warnings:

```js
switch (a) {
    case 0:
        b = "zero";
    case 1:
        b = "one";
        break;
}

switch (a) {
    case 0:
        b = "zero";
        break;
    case 1:
        b = "one";
        break;
    default:
        b = "none";
}
```

The following patterns are considered okay and do not cause warnings:

```js
switch (a) {
    case 0:
        b = "zero";
        break;
    case 1:
        b = "one";
        break;
}

switch (a) {
    case 0:
        return "zero";
    case 1:
        return "one";
}
```

## When Not To Use It

If you want to fall back to the next case statement.
