# Require Default Case in Switch Statements (default-case)

In order to be sure that the `switch` statement treats all conditions,  `default` case should be included. Still, sometimes `default` case has no special treatment and can be skipped. It is preferable to mark this specially in purpose to show intention of statement more clear. This rule obligates user to follow such policy.

## Rule Details

This rule aims to require `defaut` case in `switch` statements. User must add comment `//no default` after the last `case` if there is no `default` case.

The following pattern is considered warnings:

```js

switch (a) {
    case 1:
        /* code */
        break;
}

```

The following patterns are not warnings:

```js

switch (a) {
    case 1:
        /* code */
        break;

    default:
        /* code */
        break;
}

```

```js

switch (a) {
    case 1:
        /* code */
        break;

    // no default
}

```


## When Not To Use It

If you don't make difference between `switch` statements with or without `default` case.

