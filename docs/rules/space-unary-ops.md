# Require or disallow spaces before/after unary operators (space-unary-ops)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Some styleguides require or disallow spaces before or after unary operators. This is mainly a stylistic issue, however, some JavaScript expressions can be written without spacing which makes it harder to read and maintain.

## Rule Details

This rule enforces consistency regarding the spaces after `words` unary operators and after/before `non-words` unary operators.

Examples of unary `words` operators:

```js
// new
var joe = new Person();

// delete
var obj = {
    foo: 'bar'
};
delete obj.foo;

// typeof
typeof {} // object

// void
void 0 // undefined
```

Examples of unary `non-words` operators:

```js
if ([1,2,3].indexOf(1) !== -1) {};
foo = --foo;
bar = bar++;
baz = !foo;
qux = !!baz;
```

## Options

This rule has three options:

* `words` - applies to unary word operators such as: `new`, `delete`, `typeof`, `void`, `yield`
* `nonwords` - applies to unary operators such as: `-`, `+`, `--`, `++`, `!`, `!!`
* `overrides` - specifies overwriting usage of spacing for each operator, word or non-word. This is empty by default, but can be used to enforce or disallow spacing around operators. For example:

```js
"space-unary-ops": [
    2, {
      "words": true,
      "nonwords": false,
      "overrides": {
        "new": false,
        "++": true
      }
}]
```

In this case, spacing will be disallowed after a `new` operator and required before/after a `++` operator.

## Examples

### defaults

Examples of **incorrect** code for this rule with the default `{ "words": true, "nonwords": false }` options:

```js
/*eslint space-unary-ops: "error"*/

typeof!foo;

void{foo:0};

new[foo][0];

delete(foo.bar);

++ foo;

foo --;

- foo;

+ "3";
```

```js
/*eslint space-unary-ops: "error"*/
/*eslint-env es6*/

function *foo() {
    yield(0)
}
```

Examples of **correct** code for this rule with the default `{ "words": true, "nonwords": false }` options:

```js
/*eslint space-unary-ops: "error"*/

// Word unary operators followed by a whitespace.
delete foo.bar;

new Foo;

void 0;

// Non-word unary operators not followed by whitespace.
++foo;

foo--;

-foo;

+"3";
```

```js
/*eslint space-unary-ops: "error"*/
/*eslint-env es6*/

function *foo() {
    yield (0)
}
```