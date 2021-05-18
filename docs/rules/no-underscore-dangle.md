# disallow dangling underscores in identifiers (no-underscore-dangle)

As far as naming conventions for identifiers go, dangling underscores may be the most polarizing in JavaScript. Dangling underscores are underscores at either the beginning or end of an identifier, such as:

```js
var _foo;
```

There is actually a long history of using dangling underscores to indicate "private" members of objects in JavaScript (though JavaScript doesn't have truly private members, this convention served as a warning). This began with SpiderMonkey adding nonstandard methods such as `__defineGetter__()`. The intent with the underscores was to make it obvious that this method was special in some way. Since that time, using a single underscore prefix has become popular as a way to indicate "private" members of objects.

Whether or not you choose to allow dangling underscores in identifiers is purely a convention and has no effect on performance, readability, or complexity. It's purely a preference.

## Rule Details

This rule disallows dangling underscores in identifiers.

Examples of **incorrect** code for this rule:

```js
/*eslint no-underscore-dangle: "error"*/

var foo_;
var __proto__ = {};
foo._bar();
```

Examples of **correct** code for this rule:

```js
/*eslint no-underscore-dangle: "error"*/

var _ = require('underscore');
var obj = _.contains(items, item);
obj.__proto__ = {};
var file = __filename;
```

## Options

This rule has an object option:

* `"allow"` allows specified identifiers to have dangling underscores
* `"allowAfterThis": false` (default) disallows dangling underscores in members of the `this` object
* `"allowAfterSuper": false` (default) disallows dangling underscores in members of the `super` object
* `"enforceInMethodNames": false` (default) allows dangling underscores in method names

### allow

Examples of additional **correct** code for this rule with the `{ "allow": ["foo_", "_bar"] }` option:

```js
/*eslint no-underscore-dangle: ["error", { "allow": ["foo_", "_bar"] }]*/

var foo_;
foo._bar();
```

### allowAfterThis

Examples of **correct** code for this rule with the `{ "allowAfterThis": true }` option:

```js
/*eslint no-underscore-dangle: ["error", { "allowAfterThis": true }]*/

var a = this.foo_;
this._bar();
```

### allowAfterSuper

Examples of **correct** code for this rule with the `{ "allowAfterSuper": true }` option:

```js
/*eslint no-underscore-dangle: ["error", { "allowAfterSuper": true }]*/

var a = super.foo_;
super._bar();
```

### enforceInMethodNames

Examples of incorrect code for this rule with the `{ "enforceInMethodNames": true }` option:

```js
/*eslint no-underscore-dangle: ["error", { "enforceInMethodNames": true }]*/

class Foo {
  _bar() {}
}

class Foo {
  bar_() {}
}

const o = {
  _bar() {}
};

const o = {
  bar_() = {}
};
```

## When Not To Use It

If you want to allow dangling underscores in identifiers, then you can safely turn this rule off.
