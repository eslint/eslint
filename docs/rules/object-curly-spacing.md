# enforce consistent spacing inside braces (object-curly-spacing)

While formatting preferences are very personal, a number of style guides require
or disallow spaces between curly braces in the following situations:

```js
// simple object literals
var obj = { foo: "bar" };

// nested object literals
var obj = { foo: { zoo: "bar" } };

// destructuring assignment (EcmaScript 6)
var { x, y } = y;

// import/export declarations (EcmaScript 6)
import { foo } from "bar";
export { foo };
```

## Rule Details

This rule enforce consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers.

## Options

This rule has two options, a string option and an object option.

String option:

* `"never"` (default) disallows spacing inside of braces
* `"always"` requires spacing inside of braces (except `{}`)

Object option:

* `"arraysInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `never`)
* `"arraysInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `always`)
* `"objectsInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `never`)
* `"objectsInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `always`)
* `"import": true` requires spacing inside of braces of ES6 import statements (applies when the first option is set to `never`)
* `"import": false` disallows spacing inside of braces of ES6 import statements (applies when the first option is set to `always`)
* `"export": true` requires spacing inside of braces of ES6 export statements (applies when the first option is set to `never`)
* `"export": false` disallows spacing inside of braces of ES6 export statements (applies when the first option is set to `always`)
* `"destructuringAssignment": true` requires spacing inside of braces of ES6 destructuring assignment results (applies when the first option is set to `never`)
* `"destructuringAssignment": false` disallows spacing inside of braces of ES6 destructuring assignment results (applies when the first option is set to `always`)

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

```js
/*eslint object-curly-spacing: ["error", "never"]*/

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux'}, bar};
var {x } = y;
import { foo } from 'bar';
export { bar };
```

Examples of **correct** code for this rule with the default `"never"` option:

```js
/*eslint object-curly-spacing: ["error", "never"]*/

var obj = {'foo': 'bar'};
var obj = {'foo': {'bar': 'baz'}, 'qux': 'quxx'};
var obj = {
  'foo': 'bar'
};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var obj = {};
var {x} = y;
import {foo} from 'bar';
export {bar};
```

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint object-curly-spacing: ["error", "always"]*/

var obj = {'foo': 'bar'};
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux' }, bar};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var {x} = y;
import {foo } from 'bar';
export {bar };
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint object-curly-spacing: ["error", "always"]*/

var obj = {};
var obj = { 'foo': 'bar' };
var obj = { 'foo': { 'bar': 'baz' }, 'qux': 'quxx' };
var obj = {
  'foo': 'bar'
};
var { x } = y;
import { foo } from 'bar';
export { bar };
```

#### arraysInObjects

Examples of additional **correct** code for this rule with the `"never", { "arraysInObjects": true }` options:

```js
/*eslint object-curly-spacing: ["error", "never", { "arraysInObjects": true }]*/

var obj = {"foo": [ 1, 2 ] };
var obj = {"foo": [ "baz", "bar" ] };
```

Examples of additional **correct** code for this rule with the `"always", { "arraysInObjects": false }` options:

```js
/*eslint object-curly-spacing: ["error", "always", { "arraysInObjects": false }]*/

var obj = { "foo": [ 1, 2 ]};
var obj = { "foo": [ "baz", "bar" ]};
```


#### objectsInObjects

Examples of additional **correct** code for this rule with the `"never", { "objectsInObjects": true }` options:

```js
/*eslint object-curly-spacing: ["error", "never", { "objectsInObjects": true }]*/

var obj = {"foo": {"baz": 1, "bar": 2} };
```

Examples of additional **correct** code for this rule with the `"always", { "objectsInObjects": false }` options:

```js
/*eslint object-curly-spacing: ["error", "always", { "objectsInObjects": false }]*/

var obj = { "foo": { "baz": 1, "bar": 2 }};
```

#### import

Examples of additional **correct** code for this rule with the `"never", { "import": true }` options:

```js
/*eslint object-curly-spacing: ["error", "never", { "import": true }]*/

import {foo} from 'bar';
```

Examples of additional **correct** code for this rule with the `"always", { "import": false }` options:

```js
/*eslint object-curly-spacing: ["error", "always", { "import": false }]*/

import { foo } from 'bar';
```

#### export

Examples of additional **correct** code for this rule with the `"never", { "export": true }` options:

```js
/*eslint object-curly-spacing: ["error", "never", { "export": true }]*/

export {bar};
```

Examples of additional **correct** code for this rule with the `"always", { "export": false }` options:

```js
/*eslint object-curly-spacing: ["error", "always", { "export": false }]*/

export { bar };
```

#### destructuringAssignment

Examples of additional **correct** code for this rule with the `"never", { "destructuringAssignment": true }` options:

```js
/*eslint object-curly-spacing: ["error", "never", { "destructuringAssignment": true }]*/

var {x} = y;
```

Examples of additional **correct** code for this rule with the `"always", { "destructuringAssignment": false }` options:

```js
/*eslint object-curly-spacing: ["error", "always", { "destructuringAssignment": false }]*/

var { x } = y;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between curly braces.

## Related Rules

* [comma-spacing](comma-spacing.md)
* [space-in-parens](space-in-parens.md)
