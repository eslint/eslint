---
title: no-else-return
rule_type: suggestion
---



If an `if` block contains a `return` statement, the `else` block becomes unnecessary. Its contents can be placed outside of the block.

```js
function foo() {
    if (x) {
        return y;
    } else {
        return z;
    }
}
```

## Rule Details

This rule is aimed at highlighting an unnecessary block of code following an `if` containing a `return` statement. As such, it will warn when it encounters an `else` following a chain of `if`s, all of them containing a `return` statement.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-else-return: "error"*/

function foo1() {
    if (x) {
        return y;
    } else {
        return z;
    }
}

function foo2() {
    if (x) {
        return y;
    } else {
        const t = "foo";
    }
}

function foo3() {
    if (error) {
        return 'It failed';
    } else {
        if (loading) {
            return "It's still loading";
        }
    }
}

// Two warnings for nested occurrences
function foo4() {
    if (x) {
        if (y) {
            return y;
        } else {
            return x;
        }
    } else {
        return z;
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-else-return: "error"*/

function foo1() {
    if (x) {
        return y;
    }

    return z;
}

function foo2() {
    if (x) {
        return y;
    }

    const t = "foo";
}

function foo3() {
    if (error) {
        return 'It failed';
    }

    if (loading) {
        return "It's still loading";
    }   
}

function foo4() {
    if (x) {
        if (y) {
            return y;
        }

        return x;
    }

    return z;    
}

function foo5() {
  if (x) {
    const t = "foo";
  } else {
    return y
  }
}
```

:::

## Options

### allowElseIf

This rule has an object option:

* `allowElseIf: true` (default) - If true, allows `else if` blocks after a `return`

Examples of **correct** code for the default `{"allowElseIf": true}` option:

::: correct

```js
/*eslint no-else-return: ["error", {allowElseIf: true}]*/

function foo() {
    if (error) {
        return 'It failed';
    } else if (loading) {
        return "It's still loading";
    }
}

// Using multiple `if` statements instead of `else if` is also allowed
function foo2() {
    if (error) {
        return 'It failed';
    }
  
    if (loading) {
        return "It's still loading";
    }
}
```

:::

Examples of **incorrect** code for the `{"allowElseIf": false}` option:

::: incorrect

```js
/*eslint no-else-return: ["error", {allowElseIf: false}]*/

function foo() {
    if (error) {
        return 'It failed';
    } else if (loading) {
        return "It's still loading";
    }
}
```

:::

Examples of **correct** code for the `{"allowElseIf": false}` option:

::: correct

```js
/*eslint no-else-return: ["error", {allowElseIf: false}]*/

function foo() {
    if (error) {
        return 'It failed';
    }

    if (loading) {
        return "It's still loading";
    }
}
```

:::
