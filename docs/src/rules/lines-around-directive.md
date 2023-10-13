---
title: lines-around-directive
rule_type: layout
related_rules:
- lines-around-comment
- padded-blocks
---



This rule was **deprecated** in ESLint v4.0.0 and replaced by the [padding-line-between-statements](padding-line-between-statements) rule.

Directives are used in JavaScript to indicate to the execution environment that a script would like to opt into a feature such as `"strict mode"`. Directives are grouped together in a [directive prologue](https://www.ecma-international.org/ecma-262/7.0/#directive-prologue) at the top of either a file or function block and are applied to the scope in which they occur.

```js
// Strict mode is invoked for the entire script
"use strict";

var foo;

function bar() {
  var baz;
}
```

```js
var foo;

function bar() {
  // Strict mode is only invoked within this function
  "use strict";

  var baz;
}
```

## Rule Details

This rule requires or disallows blank newlines around directive prologues. This rule does not enforce any conventions about blank newlines between the individual directives. In addition, it does not require blank newlines before directive prologues unless they are preceded by a comment. Please use the [padded-blocks](padded-blocks) rule if this is a style you would like to enforce.

## Options

This rule has one option. It can either be a string or an object:

* `"always"` (default) enforces blank newlines around directives.
* `"never"` disallows blank newlines around directives.

or

```js
{
  "before": "always" or "never"
  "after": "always" or "never",
}
```

### always

This is the default option.

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "always"] */

// comment
"use strict";
var foo;

function foo() {
  "use strict";
  "use asm";
  var bar;
}

function foo() {
  // comment
  "use strict";
  var bar;
}
```

:::

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "always"] */

// comment
"use strict";
"use asm";
var foo;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "always"] */

// comment

"use strict";

var foo;

function foo() {
  "use strict";
  "use asm";

  var bar;
}

function foo() {
  // comment

  "use strict";

  var bar;
}
```

:::

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "always"] */

// comment

"use strict";
"use asm";

var foo;
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "never"] */

// comment

"use strict";

var foo;

function foo() {
  "use strict";
  "use asm";

  var bar;
}

function foo() {
  // comment

  "use strict";

  var bar;
}
```

:::

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "never"] */

// comment

"use strict";
"use asm";

var foo;
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "never"] */

// comment
"use strict";
var foo;

function foo() {
  "use strict";
  "use asm";
  var bar;
}

function foo() {
  // comment
  "use strict";
  var bar;
}
```

:::

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", "never"] */

// comment
"use strict";
"use asm";
var foo;
```

:::

### before & after

Examples of **incorrect** code for this rule with the `{ "before": "never", "after": "always" }` option:

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "never", "after": "always" }] */

// comment

"use strict";
var foo;

function foo() {
  "use strict";
  "use asm";
  var bar;
}

function foo() {
  // comment

  "use strict";
  var bar;
}
```

:::

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "never", "after": "always" }] */

// comment

"use strict";
"use asm";
var foo;
```

:::

Examples of **correct** code for this rule with the `{ "before": "never", "after": "always" }`  option:

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "never", "after": "always" }] */

// comment
"use strict";

var foo;

function foo() {
  "use strict";
  "use asm";

  var bar;
}

function foo() {
  // comment
  "use strict";

  var bar;
}
```

:::

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "never", "after": "always" }] */

// comment
"use strict";
"use asm";

var foo;
```

:::

Examples of **incorrect** code for this rule with the `{ "before": "always", "after": "never" }` option:

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "always", "after": "never" }] */

// comment
"use strict";

var foo;

function foo() {
  "use strict";
  "use asm";

  var bar;
}

function foo() {
  // comment
  "use strict";

  var bar;
}
```

:::

::: incorrect { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "always", "after": "never" }] */

// comment
"use strict";
"use asm";

var foo;
```

:::

Examples of **correct** code for this rule with the `{ "before": "always", "after": "never" }` option:

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "always", "after": "never" }] */

// comment

"use strict";
var foo;

function foo() {
  "use strict";
  "use asm";
  var bar;
}

function foo() {
  // comment

  "use strict";
  var bar;
}
```

:::

::: correct { "sourceType": "script" }

```js
/* eslint lines-around-directive: ["error", { "before": "always", "after": "never" }] */

// comment

"use strict";
"use asm";
var foo;
```

:::

## When Not To Use It

You can safely disable this rule if you do not have any strict conventions about whether or not directive prologues should have blank newlines before or after them.

## Compatibility

* **JSCS**: [requirePaddingNewLinesAfterUseStrict](https://jscs-dev.github.io/rule/requirePaddingNewLinesAfterUseStrict)
* **JSCS**: [disallowPaddingNewLinesAfterUseStrict](https://jscs-dev.github.io/rule/disallowPaddingNewLinesAfterUseStrict)
