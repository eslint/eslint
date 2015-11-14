# Disallow Dangling Underscores in Identifiers (no-underscore-dangle)

As far as naming conventions for identifiers go, dangling underscores may be the most polarizing in JavaScript. Dangling underscores are underscores at either the beginning or end of an identifier, such as:

```js
var _foo;
```

There is actually a long history of using dangling underscores to indicate "private" members of objects in JavaScript (though JavaScript doesn't have truly private members, this convention served as a warning). This began with SpiderMonkey adding nonstandard methods such as `__defineGetter__()`. The intent with the underscores was to make it obvious that this method was special in some way. Since that time, using a single underscore prefix has become popular as a way to indicate "private" members of objects.

Whether or not you choose to allow dangling underscores in identifiers is purely a convention and has no effect on performance, readability, or complexity. It's purely a preference.

## Rule Details

This rule aims to eliminate the use of dangling underscores in identifiers.

### Options

#### allow

```json
"no-underscore-dangle": [2, { "allow": [] }]
```

Array of variable names that are permitted to be used with underscore. If provided, it must be an `Array`.

The following patterns are considered problems:

```js
/*eslint no-underscore-dangle: 2*/

var foo_;           /*error Unexpected dangling "_" in "foo_".*/
var __proto__ = {}; /*error Unexpected dangling "_" in "__proto__".*/
foo._bar();         /*error Unexpected dangling "_" in "_bar".*/
```

The following patterns are not considered problems:

```js
/*eslint no-underscore-dangle: 2*/

var _ = require('underscore');
var obj = _.contains(items, item);
obj.__proto__ = {};
var file = __filename;
```


```js
/*eslint no-underscore-dangle: [2, { "allow": ["foo_", "_bar"] }]*/

var foo_;
foo._bar();
```

## When Not To Use It

If you want to allow dangling underscores in identifiers, then you can safely turn this rule off.

