# complexity

Cyclomatic complexity measures the number of linearly independent paths through a programs source code. This rule allows setting a cyclomatic complexity threshold.

```js
// complexity: [1, 2]
function a(x) {
    if (true) {
        return x;
    } else if (false) {
        return x+1;
    } else {
        return 4; // 3rd path
    }
}
```

# Rule Details

This rule is aimed at reducing code complexity by capping the amount of cyclomatic complexity allowed in a program. As such, it will warn when the cyclomatic complexity crosses the configured threshold.

The following patterns are considered warnings:

```js
// complexity: [1, 2]
function a(x) {
    if (true) {
        return x;
    } else if (false) {
        return x+1;
    } else {
        return 4; // 3rd path
    }
}
```

The following patterns are not considered warnings:

```js
// complexity: [1, 2]
function a(x) {
    if (true) {
        return x;
    } else {
        return 4;
    }
}
```
