# Require a newline after each call in a method chain (newline-per-chained-call)

Chained method calls on a single line without line breaks are harder to read, so some developers place a newline character after each method call in the chain to make it more readable and easy to maintain.

Let's look at the following perfectly valid (but single line) code:

```js
d3.select("body").selectAll("p").data([4, 8, 15, 16, 23, 42 ]).enter().append("p").text(function(d) { return "I'm number " + d + "!"; });
```

However, with appropriate new lines, it becomes easy to read and understand. Look at the same code written below with line breaks after each call:

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

Another argument in favor of this style is that it improves the clarity of diffs when something in the method chain is changed.

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
-   .style("color", "white");
+   .style("color", "blue");
```

## Rule Details

This rule requires a newline after each call in a method chain or deep member access. Computed property accesses such as `instance[something]` are optionally excluded with `includeBracketedProperties: false`.

## Options

* `"depthCalculationStyle"` (default: `"trailingMembers"`) changes the algorithm used to calculate depth is calculated.
    * `all`: once the depth of all chained members excluding invalid members exceeds `ignoreChainWithDepth`, all chained properties are dropped to newlines.
    * `trailingMembers` (default): once the depth of chained members up to an invalid member exceeds `ignoreChainWithDepth`, only properties past the `ignoreChainWithDepth` are dropped to newlines.
* `"ignoreChainWithDepth"` (default: `2`) allows chains of calls up to a specified depth.
* `"includeBracketedProperties"` (default: `true`) drop chained properties with array bracket syntax to new lines such as `array[0]`, `array['length']`, and `array['map']()`. Using this along with `includeMethodCalls` or `includeProperties` changes the behavior of which bracket syntax is included respective to those options.
* `"includeMethodCalls"` (default: `true`) drop method calls to new lines such as `array.map()`.
* `"includeProperties"` (default: `false`) drop bare properties to new lines such as `array.length`.
* `"multilineBreakStyle"` (default: `"never"`) ignore `ignoreChainWithDepth` when statement spans more than a single line.
    * `never` (default): Doesn't enforce newlines regardless of how many lines are spanned by the chain.
    * `object`: If the object beginning the chain spans more than a single line, force chained members, excluding invalid members, to newlines.
    * `statement`: If the object beginning the chain or any property in the chain itself spans more than a single line, force chained members, excluding invalid members, to newlines.

### ignoreChainWithDepth

#### depthCalculationStyle: trailingMembers

Examples of **incorrect** code for this rule with the default `{ ignoreChainWithDepth: 2 }`:

```js
/* eslint newline-per-chained-call: ["error"] */

_.chain({}).map(foo).filter(bar).value();

// Or
_.chain({}).map(foo).filter(bar);

// Or
_
  .chain({}).map(foo)
  .filter(bar);

// Or
obj.method1().method2().method3();

// Or
obj.prop.method1()['prop']['method2']().method3().method4().prop;
```

Examples of **correct** code for this rule with the default `{ ignoreChainWithDepth: 2 }`:

```js
/* eslint newline-per-chained-call: ["error"] */

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
  .method1().prop;

// Or
obj.prop.method1()
  .method2()
  .method3().prop;

// Or
obj
  .prop.method1()
  .method2()
  .method3().prop;

// Or
obj.prop.method1()['prop']['method2']().method3()
  .method4().prop;
```

#### depthCalculationStyle: all

Examples of **incorrect** code for this rule with `{ depthCalculationStyle: "all", ignoreChainWithDepth: 2 }`:

```js
/* eslint newline-per-chained-call: ["error", { depthCalculationStyle: "all" }] */

_.chain({}).map(foo).filter(bar).value();

// Or
_.chain({}).map(foo).filter(bar);

// Or
_
  .chain({}).map(foo)
  .filter(bar);

// Or
obj.method1().method2().method3();

// Or
obj.prop.method1()['prop']['method2']().method3().method4().prop;
```

Examples of **correct** code for this rule with `{ depthCalculationStyle: "all", ignoreChainWithDepth: 2 }`:

```js
/* eslint newline-per-chained-call: ["error", { depthCalculationStyle: "all" }] */

Object.keys(object);

// Or
Object
.keys(object);

// Or
_
  .chain({})
  .map(foo)
  .filter(bar)
  .value();

// Or
obj
  .prop
  .method()
  .prop;

// Or
obj
  .prop
  .method1()
  .method2()
  .method3()
  .prop;


// Or
obj
  .prop
  .method1()
  ['prop']
  ['method2']()
  .method3()
  .method4()
  .prop;
```

### multilineBreakStyle

This rule doesn't care about which options are enabled, it only cares if the statement itself spans multiple lines.

#### multilineBreakStyle: statement

Examples of **incorrect** code for this rule with `{ ignoreChainWithDepth: 2, multilineBreakStyle: "statement" }`:

```js
/* eslint newline-per-chained-call: ["error", { multilineBreakStyle: "statement" }] */

Object
.keys(object);

// Or
_
  .chain({}).map(foo).filter(bar).value();

// Or
_
  .chain({}).map(foo)
  .filter(bar);

// Or
obj
  .method1()
  .method2().method3();

// Or
obj.method1()
  .method2()
  .method3();

// Or
void [
  1,
  2,
  3
].forEach(func)

// Or
void [1, 2, 3].forEach(() => {
  return
})
```

Examples of **correct** code for this rule with `{ ignoreChainWithDepth: 2, multilineBreakStyle: "statement" }`:

```js
/* eslint newline-per-chained-call: ["error", { multilineBreakStyle: "statement" }] */

Object.keys(object);

// Or
Object
.keys(object);

// Or
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
obj
  .method1()
  .method2()
  .method3();

// Or
obj
  .method1()
  .method2()
  .method3();

// Or
void [
  1,
  2,
  3
]
.forEach(func)

// Or
void [1, 2, 3]
.forEach(() => {
  return
})
```

#### multilineBreakStyle: object

Examples of **incorrect** code for this rule with `{ ignoreChainWithDepth: 2, multilineBreakStyle: "object" }`:

```js
/* eslint newline-per-chained-call: ["error", { multilineBreakStyle: "object" }] */

// Or
void [
  1,
  2,
  3
].forEach(func)
```

Examples of **correct** code for this rule with `{ ignoreChainWithDepth: 2, multilineBreakStyle: "object" }`:

```js
/* eslint newline-per-chained-call: ["error", { multilineBreakStyle: "object" }] */

Object.keys(object);

// Or
obj
  .method1().method2();

// Or
obj.method1()
  .method2();

// Or
void [
  1,
  2,
  3
]
.forEach(func)

// Or
void [1, 2, 3].forEach(() => {
  return
})
```

### All `include` Options

#### depthCalculationStyle: trailingMembers

```js
{
  breakIfMultilineStyle: false // default,
  depthCalculationStyle: "trailingMembers", // default
  ignoreChainWithDepth: 2, // default
  includeBracketedProperties: true, // default
  includeMethodCalls: true, // default
  includeProperties: true,
}
```

Examples of **incorrect** code for these options:

```js
/* eslint newline-per-chained-call: ["error", { ignoreChainWithDepth: 2 }] */

array[a][b][c].length;

// Or
obj.method1().method2().method3()[0];

// Or
obj.method1()['foo']['bar']().method2();
```

Examples of **correct** code for these options:

```js
/* eslint newline-per-chained-call: ["error", { ignoreChainWithDepth: 2 }] */

array[a]
  [b][c].length;

// Or
obj.method1()
.method2()
.method3()
[0];

// Or
obj.method1()
['foo']
['bar']()
.method2();
```

#### depthCalculationStyle: all

```js
{
  depthCalculationStyle: "all",
  ignoreChainWithDepth: 2, // default
  includeBracketedProperties: true, // default
  includeMethodCalls: true, // default
  includeProperties: true,
}
```

Examples of **incorrect** code with these options:

```js
/* eslint newline-per-chained-call: ["error", { ignoreChainWithDepth: 2 }] */

array[a][b][c].length;

// Or
obj.method1().method2().method3()[0];

// Or
obj.method1()['foo']['bar']().method2();
```

Examples of **correct** code with these options:

```js
/* eslint newline-per-chained-call: ["error", { ignoreChainWithDepth: 2 }] */

array
[a]
[b]
[c]
.length;

// Or
obj
.method1()
.method2()
.method3()
[0];

// Or
obj
.method1()
['foo']
['bar']()
.method2();
```

## When Not To Use It

If you have conflicting rules or when you are fine with chained calls on one line, you can safely turn this rule off.
