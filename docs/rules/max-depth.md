# enforce a maximum depth that blocks can be nested (max-depth)

Many developers consider code difficult to read if blocks are nested beyond a certain depth.

## Rule Details

This rule enforces a maximum depth that blocks can be nested to reduce code complexity.

## Options

This rule has a number or object option:

* `"max"` (default `4`) enforces a maximum depth that blocks can be nested

**Deprecated:** The object property `maximum` is deprecated; please use the object property `max` instead.

### max

Examples of **incorrect** code for this rule with the default `{ "max": 4 }` option:

```js
/*eslint max-depth: ["error", 4]*/
/*eslint-env es6*/

function foo() {
    for (;;) { // Nested 1 deep
        let val = () => (param) => { // Nested 2 deep
            if (true) { // Nested 3 deep
                if (true) { // Nested 4 deep
                    if (true) { // Nested 5 deep
                    }
                }
            }
        };
    }
}
```

Examples of **correct** code for this rule with the default `{ "max": 4 }` option:

```js
/*eslint max-depth: ["error", 4]*/
/*eslint-env es6*/

function foo() {
    for (;;) { // Nested 1 deep
        let val = () => (param) => { // Nested 2 deep
           if (true) { // Nested 3 deep
                if (true) { // Nested 4 deep
                }
            }
        };
    }
}
```

## Related Rules

* [complexity](complexity.md)
* [max-len](max-len.md)
* [max-lines](max-lines.md)
* [max-lines-per-function](max-lines-per-function.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
