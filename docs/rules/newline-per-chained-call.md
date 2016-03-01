# Newline Per Chained Method Call (newline-per-chained-call)

Chained method calls on a single line without line breaks are harder to read. This rule enforces new line after each method call in the chain to make it more readable and easy to maintain.

Let's look at the following perfectly valid (but single line) code.

```js
d3.select('body').selectAll('p').data([4, 8, 15, 16, 23, 42 ]).enter().append('p').text(function(d) { return "I'm number " + d + "!"; });
```

However, with appropriate new lines, it becomes easy to read and understand. Look at the same code written below with line breaks after each call.

```js
d3
    .select('body')
    .selectAll('p')
    .data([
        4,
        8,
        15,
        16,
        23,
        42
    ])
    .enter()
    .append('p')
    .text(function (d) {
        return "I'm number " + d + "!";
    });
```

This rule reports such code and encourages new lines after each call in the chain as a good practice.

## Rule Details

This rule checks and reports the chained calls if there are no new lines after each call or deep member access. Computed property accesses such as `instance[something]` are excluded.

## Options

The rule takes a single option `ignoreChainWithDepth`. The level/depth to be allowed is configurable through `ignoreChainWithDepth` option. This rule, in its default state, allows 2 levels.

* `ignoreChainWithDepth` Number of depths to be allowed (Default: `2`).

Following patterns are considered problems with default configuration:

```js
/*eslint newline-per-chained-call: 2*/

_.chain({}).map(foo).filter(bar).value();

// Or
_.chain({}).map(foo).filter(bar);

// Or
_
  .chain({}).map(foo)
  .filter(bar);

// Or
obj.method().method2().method3();
```

Following patterns are not considered problems with default configuration:

```js
/*eslint newline-per-chained-call: [2]*/

_
  .chain({})
  .map(foo)
  .filter(bar)
  .value();

// Or
_
  .chain({})
  .map(foo)
  .filter(bar);

// Or
_.chain({})
  .map(foo)
  .filter(bar);

// Or
obj
  .prop
  .method().prop;

// Or
obj
  .prop.method()
  .method2()
  .method3().prop;
```

Change the option `ignoreChainWithDepth` value to allow single line chains of that depth.

For example, when configuration is like this:

```js
{
    "newline-per-chained-call": [2, {"ignoreChainWithDepth": 3}]
}
```

Following patterns are not considered problems:

```js
_.chain({}).map(foo);

// Or
obj.prop.method();

```

Following patterns are considered problems:

```js
_.chain({}).map(foo).filter(bar);

// Or
obj.prop.method().method2().method3();

// Or
obj
  .prop
  .method()
  .method2().method3();

```

## When Not To Use It

If you have conflicting rules or when you are fine with chained calls on one line, you can safely turn this rule off.
