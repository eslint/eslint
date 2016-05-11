# require a newline after each call in a method chain (newline-per-chained-call)

Chained method calls on a single line without line breaks are harder to read, so some developers place a newline character after each method call in the chain to make it more readable and easy to maintain.

Let's look at the following perfectly valid (but single line) code.

```js
d3.select("body").selectAll("p").data([4, 8, 15, 16, 23, 42 ]).enter().append("p").text(function(d) { return "I'm number " + d + "!"; });
```

However, with appropriate new lines, it becomes easy to read and understand. Look at the same code written below with line breaks after each call.

```js
d3
    .select("body")
    .selectAll("p")
    .data([
        4,
        8,
        15,
        16,
        23,
        42
    ])
    .enter()
    .append("p")
    .text(function (d) {
        return "I'm number " + d + "!";
    });
```

Another argument in favor of this style is that it improves the clarity of diffs when something in the method chain is changed:

Less clear:

```diff
-d3.select("body").selectAll("p").style("color", "white");
+d3.select("body").selectAll("p").style("color", "blue");
```

More clear:

```diff
d3
    .select("body")
    .selectAll("p")
-    .style("color", "white");
+    .style("color", "blue");
```

## Rule Details

This rule requires a newline after each call in a method chain or deep member access. Computed property accesses such as `instance[something]` are excluded.

## Options

This rule has an object option:

* `"ignoreChainWithDepth"` (default: `2`) allows chains up to a specified depth.

### ignoreChainWithDepth

Examples of **incorrect** code for this rule with the default `{ "ignoreChainWithDepth": 2 }` option:

```js
/*eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 2 }]*/

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

Examples of **correct** code for this rule with the default `{ "ignoreChainWithDepth": 2 }` option:

```js
/*eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 2 }]*/

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

## When Not To Use It

If you have conflicting rules or when you are fine with chained calls on one line, you can safely turn this rule off.
