# Disallow Self Assignment (no-self-assign)

Self assignments have no effect, so probably those are an error due to incomplete refactoring.
Those indicate that what you should do is still remaining.

```js
foo = foo;
[bar, baz] = [bar, qiz];
```

## Rule Details

This rule is aimed at eliminating self assignments.

The following patterns are considered problems:

```js
/*eslint no-self-assign: 2*/

foo = foo;              /*error 'foo' is assigned to itself.*/

[a, b] = [a, b];        /*error 'a' is assigned to itself.*/
                        /*error 'b' is assigned to itself.*/

[a, ...b] = [x, ...b];  /*error 'b' is assigned to itself.*/

({a, b} = {a, x});      /*error 'a' is assigned to itself.*/
```

The following patterns are considered not problems:

```js
/*eslint no-self-assign: 2*/

foo = bar;
[a, b] = [b, a];

// This pattern is warned by the `no-use-before-define` rule.
let foo = foo;

// The default values have an effect.
[foo = 1] = [foo];
```

## When Not To Use It

If you don't want to notify about self assignments, then it's safe to disable this rule.
