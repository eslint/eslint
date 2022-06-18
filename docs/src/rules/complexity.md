---
title: complexity
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/complexity.md
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

Enforces a maximum cyclomatic complexity.

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
```

Examples of **correct** code for a maximum of 2:

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

Class field initializers and class static blocks are implicit functions. Therefore, their complexity is calculated separately for each initializer and each static block, and it doesn't contribute to the complexity of the enclosing code.

Examples of additional **incorrect** code for a maximum of 2:

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

Examples of additional **correct** code for a maximum of 2:

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

## Options

Optionally, you may specify a `max` object property:

```json
"complexity": ["error", 2]
```

is equivalent to

```json
"complexity": ["error", { "max": 2 }]
```

**Deprecated:** the object property `maximum` is deprecated. Please use the property `max` instead.

## When Not To Use It

If you can't determine an appropriate complexity limit for your code, then it's best to disable this rule.
