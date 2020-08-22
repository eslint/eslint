# Disallow redundant continue statements (no-useless-continue)

A `continue;` statement with nothing after it is redundant, and has no effect on the runtime behavior of a function. This can be confusing, so it's better to disallow these redundant statements.

## Rule Details

This rule aims to report redundant `continue` statements.

Examples of **incorrect** code for this rule:

```js
/* eslint no-useless-continue: "error" */

function foo() {
  for (const foo of bar) {
    continue;
  }
}

function foo() {
  for(i = 0; i < 10; i++) {
    continue;
  }
}

function foo() {
  var i = 0;
  while (i < 10) {
    i++;
    continue;
  }
}

function foo() {
  var i = 0;
  do {
    i++;
    continue;
  } while (i < 10);
}

```

Examples of **correct** code for this rule:

```js
/* eslint no-useless-continue: "error" */

var sum = 0,
    i;

for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue;
    }

    a += i;
}
```

```js
/* eslint no-useless-continue: "error" */

var sum = 0,
    i;

labeledLoop: for(i = 0; i < 10; i++) {
    if(i >= 5) {
        continue labeledLoop;
    }

    a += i;
}

```

## When Not To Use It

If you don't care about disallowing redundant continue statements, you can turn off this rule.
