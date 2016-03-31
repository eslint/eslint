# Disallow or enforce spaces inside of curly braces in objects. (object-curly-spacing)

(fixable) The --fix option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

This rule aims to maintain consistency around the spacing inside of object literals. It also
applies to EcmaScript 6 destructured assignment and import/export specifiers.

It either requires or disallows spaces between those braces and the values inside of them.
Braces that are separated from the adjacent value by a new line are exempt from this rule.

## Options

There are two main options for the rule:

* `"always"` enforces a space inside of curly braces
* `"never"` disallows spaces inside of curly braces (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"object-curly-spacing": ["error", "always"]
```

### "never"

When `"never"` is set, the following patterns are considered problems:

```js
/*eslint object-curly-spacing: ["error", "never"]*/

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux'}, bar};
var {x } = y;
import { foo } from 'bar';
```

The following patterns are not considered problems:

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
```

### "always"

When `"always"` is used, the following patterns are considered problems:

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
```

The following patterns are not considered problems:

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
```

Note that `{}` is always exempt from spacing requirements with this rule.

### Exceptions

There are two exceptions you can apply to this rule: `objectsInObjects` and
`arraysInObjects`. Their values can be set to either `true` or `false` as part
of an object literal set as the 3rd argument for the rule.

These exceptions work in the context of the first option.
That is, if `"always"` is set to enforce spacing and an exception is set to `false`,
it will disallow spacing for cases matching the exception. Likewise,
if `"never"` is set to disallow spacing and an exception is set to `true`,
it will enforce spacing for cases matching the exception.

You can add exceptions like so:

```json
"object-curly-spacing": ["error", "always", {
  "objectsInObjects": false,
  "arraysInObjects": false
}]
```

#### `objectsInObjects`

In the case of the `"always"` option, set `objectsInObjects` exception to `false` to
enforce the following syntax (notice the `}}` at the end):

```js
var obj = { "foo": { "baz": 1, "bar": 2 }};
```

In the case of the `"never"` option, set `objectsInObjects` exception to `true` to enforce
the following style (with a space between the `}` at the end:


```js
var obj = {"foo": {"baz": 1, "bar": 2} };
```

#### `arraysInObjects`

In the case of the `"always"` option, set `arraysInObjects` exception to `false` to
enforce the following syntax (notice the `]}` at the end):

```js
var obj = { "foo": [ 1, 2 ]};
var obj = { "foo": [ "baz", "bar" ]};
```

In the case of the `"never"` option, set `arraysInObjects` exception to `true` to enforce
the following style (with a space between the `]` and  `}` at the end:

```js
var obj = {"foo": [ 1, 2 ] };
var obj = {"foo": [ "baz", "bar" ] };
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between curly braces.

## Related Rules

* [comma-spacing](comma-spacing.md)
* [space-in-parens](space-in-parens.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
