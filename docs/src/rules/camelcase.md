---
title: camelcase
rule_type: suggestion
---


When it comes to naming variables, style guides generally fall into one of two camps: camelcase (`variableName`) and underscores (`variable_name`). This rule focuses on using the camelcase approach. If your style guide calls for camelCasing your variable names, then this rule is for you!

## Rule Details

This rule looks for any underscores (`_`) located within the source code. It ignores leading and trailing underscores and only checks those in the middle of a variable name. If ESLint decides that the variable is a constant (all uppercase), then no warning will be thrown. Otherwise, a warning will be thrown. This rule only flags definitions and assignments but not function calls. In case of ES6 `import` statements, this rule only targets the name of the variable that will be imported into the local module scope.

## Options

This rule has an object option:

* `"properties": "always"` (default) enforces camelcase style for property names
* `"properties": "never"` does not check property names
* `"ignoreDestructuring": false` (default) enforces camelcase style for destructured identifiers
* `"ignoreDestructuring": true` does not check destructured identifiers (but still checks any use of those identifiers later in the code)
* `"ignoreImports": false` (default) enforces camelcase style for ES2015 imports
* `"ignoreImports": true` does not check ES2015 imports (but still checks any use of the imports later in the code except function arguments)
* `"ignoreGlobals": false` (default) enforces camelcase style for global variables
* `"ignoreGlobals": true` does not enforce camelcase style for global variables
* `allow` (`string[]`) list of properties to accept. Accept regex.

### properties: "always"

Examples of **incorrect** code for this rule with the default `{ "properties": "always" }` option:

:::incorrect

```js
/*eslint camelcase: "error"*/

import { no_camelcased } from "external-module"

var my_favorite_color = "#112C85";

function do_something() {
    // ...
}

obj.do_something = function() {
    // ...
};

function foo({ no_camelcased }) {
    // ...
};

function bar({ isCamelcased: no_camelcased }) {
    // ...
}

function baz({ no_camelcased = 'default value' }) {
    // ...
};

var obj = {
    my_pref: 1
};

var { category_id = 1 } = query;

var { foo: snake_cased } = bar;

var { foo: bar_baz = 1 } = quz;
```

:::

Examples of **correct** code for this rule with the default `{ "properties": "always" }` option:

:::correct

```js
/*eslint camelcase: "error"*/

import { no_camelcased as camelCased } from "external-module";

var myFavoriteColor   = "#112C85";
var _myFavoriteColor  = "#112C85";
var myFavoriteColor_  = "#112C85";
var MY_FAVORITE_COLOR = "#112C85";
var foo1 = bar.baz_boom;
var foo2 = { qux: bar.baz_boom };

obj.do_something();
do_something();
new do_something();

var { category_id: category } = query;

function foo({ isCamelCased }) {
    // ...
};

function bar({ isCamelCased: isAlsoCamelCased }) {
    // ...
}

function baz({ isCamelCased = 'default value' }) {
    // ...
};

var { categoryId = 1 } = query;

var { foo: isCamelCased } = bar;

var { foo: isCamelCased = 1 } = quz;

```

:::

### properties: "never"

Examples of **correct** code for this rule with the `{ "properties": "never" }` option:

:::correct

```js
/*eslint camelcase: ["error", {properties: "never"}]*/

var obj = {
    my_pref: 1
};

obj.foo_bar = "baz";
```

:::

### ignoreDestructuring: false

Examples of **incorrect** code for this rule with the default `{ "ignoreDestructuring": false }` option:

:::incorrect

```js
/*eslint camelcase: "error"*/

var { category_id } = query;

var { category_name = 1 } = query;

var { category_id: category_title } = query;

var { category_id: category_alias } = query;

var { category_id: categoryId, ...other_props } = query;
```

:::

### ignoreDestructuring: true

Examples of **incorrect** code for this rule with the `{ "ignoreDestructuring": true }` option:

:::incorrect

```js
/*eslint camelcase: ["error", {ignoreDestructuring: true}]*/

var { category_id: category_alias } = query;

var { category_id, ...other_props } = query;
```

:::

Examples of **correct** code for this rule with the `{ "ignoreDestructuring": true }` option:

:::correct

```js
/*eslint camelcase: ["error", {ignoreDestructuring: true}]*/

var { category_id } = query;

var { category_id = 1 } = query;

var { category_id: category_id } = query;
```

:::

Please note that this option applies only to identifiers inside destructuring patterns. It doesn't additionally allow any particular use of the created variables later in the code apart from the use that is already allowed by default or by other options.

Examples of additional **incorrect** code for this rule with the `{ "ignoreDestructuring": true }` option:

:::incorrect

```js
/*eslint camelcase: ["error", {ignoreDestructuring: true}]*/

var { some_property } = obj; // allowed by {ignoreDestructuring: true}
var foo = some_property + 1; // error, ignoreDestructuring does not apply to this statement
```

:::

A common use case for this option is to avoid useless renaming when the identifier is not intended to be used later in the code.

Examples of additional **correct** code for this rule with the `{ "ignoreDestructuring": true }` option:

:::correct

```js
/*eslint camelcase: ["error", {ignoreDestructuring: true}]*/

var { some_property, ...rest } = obj;
// do something with 'rest', nothing with 'some_property'
```

:::

Another common use case for this option is in combination with `{ "properties": "never" }`, when the identifier is intended to be used only as a property shorthand.

Examples of additional **correct** code for this rule with the `{ "properties": "never", "ignoreDestructuring": true }` options:

:::correct

```js
/*eslint camelcase: ["error", {"properties": "never", ignoreDestructuring: true}]*/

var { some_property } = obj;
doSomething({ some_property });
```

:::

### ignoreImports: false

Examples of **incorrect** code for this rule with the default `{ "ignoreImports": false }` option:

:::incorrect

```js
/*eslint camelcase: "error"*/

import { snake_cased } from 'mod';
```

:::

### ignoreImports: true

Examples of **incorrect** code for this rule with the `{ "ignoreImports": true }` option:

:::incorrect

```js
/*eslint camelcase: ["error", {ignoreImports: true}]*/

import default_import from 'mod';

import * as namespaced_import from 'mod';
```

:::

Examples of **correct** code for this rule with the `{ "ignoreImports": true }` option:

:::correct

```js
/*eslint camelcase: ["error", {ignoreImports: true}]*/

import { snake_cased } from 'mod';
```

:::

### ignoreGlobals: false

Examples of **incorrect** code for this rule with the default `{ "ignoreGlobals": false }` option:

:::incorrect

```js
/*eslint camelcase: ["error", {ignoreGlobals: false}]*/
/* global no_camelcased */

const foo = no_camelcased;
```

:::

### ignoreGlobals: true

Examples of **correct** code for this rule with the `{ "ignoreGlobals": true }` option:

:::correct

```js
/*eslint camelcase: ["error", {ignoreGlobals: true}]*/
/* global no_camelcased */

const foo = no_camelcased;
```

:::

### allow

Examples of **correct** code for this rule with the `allow` option:

:::correct

```js
/*eslint camelcase: ["error", {allow: ["UNSAFE_componentWillMount"]}]*/

function UNSAFE_componentWillMount() {
    // ...
}
```

:::

::: correct

```js
/*eslint camelcase: ["error", {allow: ["^UNSAFE_"]}]*/

function UNSAFE_componentWillMount() {
    // ...
}

function UNSAFE_componentWillReceiveProps() {
    // ...
}
```

:::

## When Not To Use It

If you have established coding standards using a different naming convention (separating words with underscores), turn this rule off.
