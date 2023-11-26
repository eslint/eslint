---
title: max-lines-per-function
rule_type: suggestion
related_rules:
- complexity
- max-depth
- max-lines
- max-nested-callbacks
- max-params
- max-statements
- max-statements-per-line
---


Some people consider large functions a code smell. Large functions tend to do a lot of things and can make it hard following what's going on. Many coding style guides dictate a limit of the number of lines that a function can comprise of. This rule can help enforce that style.

## Rule Details

This rule enforces a maximum number of lines per function, in order to aid in maintainability and reduce complexity.

### Why not use `max-statements` or other complexity measurement rules instead?

Nested long method chains like the below example are often broken onto separate lines for readability:

```js
function() {
    return m("div", [
        m("table", {className: "table table-striped latest-data"}, [
            m("tbody",
                data.map(function(db) {
                    return m("tr", {key: db.dbname}, [
                        m("td", {className: "dbname"}, db.dbname),
                        m("td", {className: "query-count"},  [
                            m("span", {className: db.lastSample.countClassName}, db.lastSample.nbQueries)
                        ])
                    ])
                })
            )
        ])
    ])
}
```

* `max-statements` will only report this as 1 statement, despite being 16 lines of code.
* `complexity` will only report a complexity of 1
* `max-nested-callbacks` will only report 1
* `max-depth` will report a depth of 0

## Options

This rule has the following options that can be specified using an object:

* `"max"` (default `50`) enforces a maximum number of lines in a function.

* `"skipBlankLines"` (default `false`) ignore lines made up purely of whitespace.

* `"skipComments"` (default `false`) ignore lines containing just comments.

* `"IIFEs"` (default `false`) include any code included in IIFEs.

Alternatively, you may specify a single integer for the `max` option:

```json
"max-lines-per-function": ["error", 20]
```

is equivalent to

```json
"max-lines-per-function": ["error", { "max": 20 }]
```

### code

Examples of **incorrect** code for this rule with a particular max value:

::: incorrect

```js
/*eslint max-lines-per-function: ["error", 2]*/
function foo() {
    var x = 0;
}
```

:::

::: incorrect

```js
/*eslint max-lines-per-function: ["error", 3]*/
function foo() {
    // a comment
    var x = 0;
}
```

:::

::: incorrect

```js
/*eslint max-lines-per-function: ["error", 4]*/
function foo() {
    // a comment followed by a blank line

    var x = 0;
}
```

:::

Examples of **correct** code for this rule with a particular max value:

::: correct

```js
/*eslint max-lines-per-function: ["error", 3]*/
function foo() {
    var x = 0;
}
```

:::

::: correct

```js
/*eslint max-lines-per-function: ["error", 4]*/
function foo() {
    // a comment
    var x = 0;
}
```

:::

::: correct

```js
/*eslint max-lines-per-function: ["error", 5]*/
function foo() {
    // a comment followed by a blank line

    var x = 0;
}
```

:::

### skipBlankLines

Examples of **incorrect** code for this rule with the `{ "skipBlankLines": true }` option:

::: incorrect

```js
/*eslint max-lines-per-function: ["error", {"max": 2, "skipBlankLines": true}]*/
function foo() {

    var x = 0;
}
```

:::

Examples of **correct** code for this rule with the `{ "skipBlankLines": true }` option:

::: correct

```js
/*eslint max-lines-per-function: ["error", {"max": 3, "skipBlankLines": true}]*/
function foo() {

    var x = 0;
}
```

:::

### skipComments

Examples of **incorrect** code for this rule with the `{ "skipComments": true }` option:

::: incorrect

```js
/*eslint max-lines-per-function: ["error", {"max": 2, "skipComments": true}]*/
function foo() {
    // a comment
    var x = 0;
}
```

:::

Examples of **correct** code for this rule with the `{ "skipComments": true }` option:

::: correct

```js
/*eslint max-lines-per-function: ["error", {"max": 3, "skipComments": true}]*/
function foo() {
    // a comment
    var x = 0;
}
```

:::

### IIFEs

Examples of **incorrect** code for this rule with the `{ "IIFEs": true }` option:

::: incorrect

```js
/*eslint max-lines-per-function: ["error", {"max": 2, "IIFEs": true}]*/
(function(){
    var x = 0;
}());

(() => {
    var x = 0;
})();
```

:::

Examples of **correct** code for this rule with the `{ "IIFEs": true }` option:

::: correct

```js
/*eslint max-lines-per-function: ["error", {"max": 3, "IIFEs": true}]*/
(function(){
    var x = 0;
}());

(() => {
    var x = 0;
})();
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the number of lines in your functions.
