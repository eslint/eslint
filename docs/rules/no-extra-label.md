# Disallow Unnecessary Labels (no-extra-label)

If a loop contains no nested loops or switches, labeling the loop is unnecessary.

```js
A: while (a) {
    break A;
}
```

You can achieve the same result by removing the label and using `break` or `continue` without a label.
Probably those labels would confuse developers because they expect labels to jump to further.

## Rule Details

This rule is aimed at eliminating unnecessary labels.

The following patterns are considered problems:

```js
/*eslint no-extra-label: 2*/

A: while (a) {
    break A;      /*error This label 'A' is unnecessary.*/
}

B: for (let i = 0; i < 10; ++i) {
    break B;      /*error This label 'B' is unnecessary.*/
}

C: switch (a) {
    case 0:
        break C;  /*error This label 'C' is unnecessary.*/
}
```

The following patterns are not considered problems:

```js
/*eslint no-extra-label: 2*/

while (a) {
    break;
}

for (let i = 0; i < 10; ++i) {
    break;
}

switch (a) {
    case 0:
        break;
}

A: {
    break A;
}

B: while (a) {
    while (b) {
        break B;
    }
}

C: switch (a) {
    case 0:
        while (b) {
            break C;
        }
        break;
}
```

## Related Rules

* [no-labels](./no-labels.md)
* [no-label-var](./no-label-var.md)
* [no-unused-labels](./no-unused-labels.md)

## When Not To Use It

If you don't want to be notified about usage of labels, then it's safe to disable this rule.
