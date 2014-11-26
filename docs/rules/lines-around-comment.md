# (Dis)allow empty lines around comments (lines-around-comment)

The `lines-around-comment` rule forces or prohibits empty lines around single-line comments or blocks.

## Rule Details

```js
// Single-line comment

doSomething();
```

generates a warning when configured with `{afterLineComment: false}`, but is fine when it is set to `true`. Conversely:

```js
// Single-line comment
doSomething();
```

generates a warning with `{afterLineComment: true}`, but none on `false`.

Block comments are completely separate from single-line rules, and are affected by the `afterBlockComment` configuration:

```js
/*
 * multi-line block comment
 */

doSomething();
```

generates a warning under `{afterBlockComment: false}`, and:

```js
/* block comments can also be single line */
doSomething();
```

generates a warning under `{afterBlockComment: true}`.

Each `after...` option has an analogous `before...` option. For example:

```js
doSomething();
// Line comment here
```

generates a warning under `{beforeLineComment: true}`.
