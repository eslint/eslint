# require calls to `isNaN()` when checking for `NaN` (use-isnan)

In JavaScript, `NaN` is a special value of the `Number` type. It's used to represent any of the "not-a-number" values represented by the double-precision 64-bit format as specified by the IEEE Standard for Binary Floating-Point Arithmetic.

Because `NaN` is unique in JavaScript by not being equal to anything, including itself, the results of comparisons to `NaN` are confusing:

* `NaN === NaN` or `NaN == NaN` evaluate to false
* `NaN !== NaN` or `NaN != NaN` evaluate to true

Therefore, use `Number.isNaN()` or global `isNaN()` functions to test whether a value is `NaN`.

## Rule Details

This rule disallows comparisons to 'NaN'.

Examples of **incorrect** code for this rule:

```js
/*eslint use-isnan: "error"*/

if (foo == NaN) {
    // ...
}

if (foo != NaN) {
    // ...
}
```

Examples of **correct** code for this rule:

```js
/*eslint use-isnan: "error"*/

if (isNaN(foo)) {
    // ...
}

if (!isNaN(foo)) {
    // ...
}
```

## Options

This rule has an object option, with one option:

* `"enforceForSwitchCase"` when set to `true` disallows `case NaN` and `switch(NaN)` in `switch` statements. Default is `false`, meaning
that this rule by default does not warn about `case NaN` or `switch(NaN)`.

### enforceForSwitchCase

The `switch` statement internally uses the `===` comparison to match the expression's value to a case clause.
Therefore, it can never match `case NaN`. Also, `switch(NaN)` can never match a case clause.

Set `"enforceForSwitchCase"` to `true` if you want this rule to report `case NaN` and `switch(NaN)` in `switch` statements.

Examples of **incorrect** code for this rule with `"enforceForSwitchCase"` option set to `true`:

```js
/*eslint use-isnan: ["error", {"enforceForSwitchCase": true}]*/

switch (foo) {
    case NaN:
        bar();
        break;
    case 1:
        baz();
        break;
    // ...
}

switch (NaN) {
    case a:
        bar();
        break;
    case b:
        baz();
        break;
    // ...
}
```

Examples of **correct** code for this rule with `"enforceForSwitchCase"` option set to `true`:

```js
/*eslint use-isnan: ["error", {"enforceForSwitchCase": true}]*/

if (Number.isNaN(foo)) {
    bar();
} else {
    switch (foo) {
        case 1:
            baz();
            break;
        // ...
    }
}

if (Number.isNaN(a)) {
    bar();
} else if (Number.isNaN(b)) {
    baz();
} // ...
```
