# Limit Maximum Depth (max-depth)

The `max-depth` rule allows you to specify the maximum depth blocks can be nested.

```js
function foo() {
  for (;;) { // Nested 1 deep.
    if (true) { // Nested 2 deep.
      if (true) { // Nested 3 deep.

      }
    }
  }
}
```

## Rule Details

This rule aims to reduce the complexity of your code by allowing you to configure the maximum depth blocks can be nested in a function. As such, it will warn when blocks are nested too deeply.

### Options

The default depth above which this rule will warn is `4`.  You can configure the depth as an option by using the second argument in your configuration. For example, this sets the rule as an error with a maximum depth of 10:

```json
"max-depth": [2, 10]
```

The following patterns are considered problems:

```js
/*eslint max-depth: [2, 2]*/

function foo() {
  for (;;) {
    if (true) {
      if (true) { /*error Blocks are nested too deeply (3).*/

      }
    }
  }
}
```

The following patterns are not considered problems:

```js
/*eslint max-depth: [2, 2]*/

function foo() {
  for (;;) {
    if (true) {

    }
  }
}
```


## Related Rules

* [complexity](complexity.md)
* [max-len](max-len.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
