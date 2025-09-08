---
title: no-default-case
rule_type: suggestion
related_rules:
- default-case
- default-case-last
- no-fallthrough
---

Some developers prefer to handle all possible cases in switch statements explicitly rather than relying on a `default` clause. This approach can help catch bugs when new values are added to enums or when refactoring code, as the switch statement will not silently handle unexpected values.

## Rule Details

This rule disallows `default` clauses in `switch` statements to encourage explicit handling of all possible cases.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-default-case: "error"*/

function getColorName(color) {
    switch (color) {
        case 'red':
            return 'Red';
        case 'blue':
            return 'Blue';
        default:
            return 'Unknown';
    }
}

function getStatusMessage(status) {
    switch (status) {
        case 'pending':
            return 'Waiting';
        case 'active':
            return 'Running';
        default:
            throw new Error('Invalid status');
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-default-case: "error"*/

function getColorName(color) {
    switch (color) {
        case 'red':
            return 'Red';
        case 'blue':
            return 'Blue';
        case 'green':
            return 'Green';
    }
    throw new Error(`Unknown color: ${color}`);
}

function getStatusMessage(status) {
    switch (status) {
        case 'pending':
            return 'Waiting';
        case 'active':
            return 'Running';
        case 'completed':
            return 'Finished';
    }
}
```

:::

## Options

This rule has an object option:

- `"allowEmpty": false` (default) disallows all `default` clauses
- `"allowEmpty": true` allows empty `default` clauses (useful as placeholders)

### allowEmpty

Examples of **correct** code for this rule with the `{ "allowEmpty": true }` option:

::: correct

```js
/*eslint no-default-case: ["error", { "allowEmpty": true }]*/

function processValue(value) {
    switch (value) {
        case 1:
            return 'one';
        case 2:
            return 'two';
        default:
            // TODO: handle other cases
    }
}

switch (type) {
    case 'A':
        process();
        break;
    case 'B':
        handle();
        break;
    default:
        // intentionally empty
}
```

:::

Examples of **incorrect** code for this rule with the `{ "allowEmpty": true }` option:

::: incorrect

```js
/*eslint no-default-case: ["error", { "allowEmpty": true }]*/

function processValue(value) {
    switch (value) {
        case 1:
            return 'one';
        case 2:
            return 'two';
        default:
            console.log('default case'); // not empty
            break;
    }
}
```

:::

## When Not To Use It

If you prefer to always have a `default` case in your switch statements to handle unexpected values, then you should not use this rule. The [`default-case`](default-case) rule might be more appropriate in such cases.

This rule is also not suitable if you're working with code that intentionally uses `default` cases as part of the application logic or error handling strategy.

## Compatibility

This rule complements but conflicts with the [`default-case`](default-case) rule. You should use one or the other, but not both.
