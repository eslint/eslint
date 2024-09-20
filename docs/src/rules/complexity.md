---
title: complexity
rule_type: suggestion
related_rules:
- max-depth
- max-len
- max-lines
- max-lines-per-function
- max-nested-callbacks
- max-params
- max-statements
further_reading:
- https://en.wikipedia.org/wiki/Cyclomatic_complexity
- https://ariya.io/2012/12/complexity-analysis-of-javascript-code
- https://craftsmanshipforsoftware.com/2015/05/25/complexity-for-javascript/
- https://web.archive.org/web/20160808115119/http://jscomplexity.org/complexity
- https://github.com/eslint/eslint/issues/4808#issuecomment-167795140
---


Cyclomatic complexity measures the number of linearly independent paths through a program's source code. This rule allows setting a cyclomatic complexity threshold.

```js
function a(x) {
    if (true) {
        return x; // 1st path
    } else if (false) {
        return x+1; // 2nd path
    } else {
        return 4; // 3rd path
    }
}
```

## Rule Details

This rule is aimed at reducing code complexity by capping the amount of cyclomatic complexity allowed in a program. As such, it will warn when the cyclomatic complexity crosses the configured threshold (default is `20`).

Examples of **incorrect** code for a maximum of 2:

::: incorrect

```js
/*eslint complexity: ["error", 2]*/

function a(x) {
    if (true) {
        return x;
    } else if (false) {
        return x+1;
    } else {
        return 4; // 3rd path
    }
}

function b() {
    foo ||= 1;
    bar &&= 1;
}

function c(a = {}) { // default parameter -> 2nd path
    const { b = 'default' } = a; // default value during destructuring -> 3rd path
}

function d(a) {
    return a?.b?.c; // optional chaining with two optional properties creates two additional branches
}
```

:::

Examples of **correct** code for a maximum of 2:

::: correct

```js
/*eslint complexity: ["error", 2]*/

function a(x) {
    if (true) {
        return x;
    } else {
        return 4;
    }
}

function b() {
    foo ||= 1;
}
```

:::

Class field initializers and class static blocks are implicit functions. Therefore, their complexity is calculated separately for each initializer and each static block, and it doesn't contribute to the complexity of the enclosing code.

Examples of additional **incorrect** code for a maximum of 2:

::: incorrect

```js
/*eslint complexity: ["error", 2]*/

class C {
    x = a || b || c; // this initializer has complexity = 3
}

class D { // this static block has complexity = 3
    static {
        if (foo) {
            bar = baz || qux;
        }
    }
}
```

:::

Examples of additional **correct** code for a maximum of 2:

::: correct

```js
/*eslint complexity: ["error", 2]*/

function foo() { // this function has complexity = 1
    class C {
        x = a + b; // this initializer has complexity = 1
        y = c || d; // this initializer has complexity = 2
        z = e && f; // this initializer has complexity = 2

        static p = g || h; // this initializer has complexity = 2
        static q = i ? j : k; // this initializer has complexity = 2

        static { // this static block has complexity = 2
            if (foo) {
                baz = bar;
            }
        }

        static { // this static block has complexity = 2
            qux = baz || quux;
        }
    }
}
```

:::

## Options

This rule has a number or object option:

* `"max"` (default: `20`) enforces a maximum complexity

* `"variant": "classic" | "modified"` (default: `"classic"`) cyclomatic complexity variant to use

### max

Customize the threshold with the `max` property.

```json
"complexity": ["error", { "max": 2 }]
```

**Deprecated:** the object property `maximum` is deprecated. Please use the property `max` instead.

Or use the shorthand syntax:

```json
"complexity": ["error", 2]
```

### variant

Cyclomatic complexity variant to use:

* `"classic"` (default) - Classic McCabe cyclomatic complexity
* `"modified"` - Modified cyclomatic complexity

_Modified cyclomatic complexity_ is the same as the classic cyclomatic complexity, but each `switch` statement only increases the complexity value by `1`, regardless of how many `case` statements it contains.

Examples of **correct** code for this rule with the `{ "max": 3, "variant": "modified" }` option:

::: correct

```js
/*eslint complexity: ["error", {"max": 3, "variant": "modified"}]*/

function a(x) {     // initial modified complexity is 1
    switch (x) {    // switch statement increases modified complexity by 1
        case 1:
            1;
            break;
        case 2:
            2;
            break;
        case 3:
            if (x === 'foo') {  // if block increases modified complexity by 1
                3;
            }
            break;
        default:
            4;
    }
}
```

:::

The classic cyclomatic complexity of the above function is `5`, but the modified cyclomatic complexity is only `3`.

## When Not To Use It

If you can't determine an appropriate complexity limit for your code, then it's best to disable this rule.
