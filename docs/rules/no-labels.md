# Disallow Labeled Statements (no-labels)

Labeled statements in JavaScript are used in conjunction with `break` and `continue` to control flow around multiple loops. For example:

```js
outer:
    while (true) {

        while (true) {
            break outer;
        }
    }
```

The `break outer` statement ensures that this code will not result in an infinite loop because control is returned to the next statement after the `outer` label was applied. If this statement was changed to be just `break`, control would flow back to the outer `while` statement and an infinite loop would result.

While convenient in some cases, labels tend to be used only rarely and are frowned upon by some as a remedial form of flow control that is more error prone and harder to understand.

## Rule Details

This rule aims to eliminate the use of labeled statements in JavaScript. It will warn whenever a labeled statement is encountered and whenever `break` or `continue` are used with a label.

Examples of **incorrect** code for this rule:

```js
/*eslint no-labels: "error"*/

label:
    while(true) {
        // ...
    }

label:
    while(true) {
        break label;
    }

label:
    while(true) {
        continue label;
    }

label:
    switch (a) {
    case 0:
        break label;
    }

label:
    {
        break label;
    }

label:
    if (a) {
        break label;
    }
```

Examples of **correct** code for this rule:

```js
/*eslint no-labels: "error"*/

var f = {
    label: "foo"
};

while (true) {
    break;
}

while (true) {
    continue;
}
```

## Options

The options allow labels with loop or switch statements:

* `"allowLoop"` (`boolean`, default is `false`) - If this option was set `true`, this rule ignores labels which are sticking to loop statements.
* `"allowSwitch"` (`boolean`, default is `false`) - If this option was set `true`, this rule ignores labels which are sticking to switch statements.

Actually labeled statements in JavaScript can be used with other than loop and switch statements.
However, this way is ultra rare, not well-known, so this would be confusing developers.

### allowLoop

Examples of **correct** code for the `{ "allowLoop": true }` option:

```js
/*eslint no-labels: ["error", { "allowLoop": true }]*/

label:
    while (true) {
        break label;
    }
```

### allowSwitch

Examples of **correct** code for the `{ "allowSwitch": true }` option:

```js
/*eslint no-labels: ["error", { "allowSwitch": true }]*/

label:
    switch (a) {
        case 0:
            break label;
    }
```

## When Not To Use It

If you need to use labeled statements everywhere, then you can safely disable this rule.

## Related Rules

* [no-extra-label](./no-extra-label.md)
* [no-label-var](./no-label-var.md)
* [no-unused-labels](./no-unused-labels.md)
