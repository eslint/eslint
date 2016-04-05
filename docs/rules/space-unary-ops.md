# Require or disallow spaces before/after unary operators (space-unary-ops)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Some styleguides require or disallow spaces before or after unary operators. This is mainly a stylistic issue, however, some JavaScript expressions can be written without spacing which makes it harder to read and maintain.

## Rule Details

This rule enforces consistency regarding the spaces after `words` unary operators and after/before `nonwords` unary operators.

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

Examples of unary `nonwords` operators:

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
* `overrides` - specifies overwriting usage of spacing for each
  operator, word or non word. This is empty by default, but can be used
  to enforce or disallow spacing around operators. For example:

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

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are considered problems:

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

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are not considered problems:

```js
/*eslint space-unary-ops: "error"*/

// Word unary operator "delete" is followed by a whitespace.
delete foo.bar;

// Word unary operator "new" is followed by a whitespace.
new Foo;

// Word unary operator "void" is followed by a whitespace.
void 0;

// Unary operator "++" is not followed by whitespace.
++foo;

// Unary operator "--" is not preceded by whitespace.
foo--;

// Unary operator "-" is not followed by whitespace.
-foo;

// Unary operator "+" is not followed by whitespace.
+"3";
```

```js
/*eslint space-unary-ops: "error"*/
/*eslint-env es6*/

function *foo() {
    yield (0)
}
```
