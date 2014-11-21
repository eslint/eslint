# Require or disallow spaces before/after unary operators (space-unary-ops)

Some styleguides require or disallow spaces before or after unary operators. This is mainly a stylistic issue, however, some JavaScript expressions can be written without spacing which makes it harder to read and maintain.

## Rule Details

This rule enforces consistency regarding the spaces after `words` unary operators and after/before `nonwords` unary operators.

### Examples

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are considered warnings:

Word unary operators (i.e. "typeof") should be followed by a whitespace.

```js
typeof!foo
```

Word unary operators (i.e. "void") should be followed by a whitespace.

```js
void{foo:0}
```

Word unary operators (i.e. "new") should be followed by a whitespace.

```js
new[foo][0]
```

Word unary operators (i.e. "delete") should be followed by a whitespace.

```js
delete(foo.bar)
```

Unary operator "++" should not be followed by whitespace.

```js
++ foo
```

Unary operator "--" should not be preceeded by whitespace.

```js
foo --
```

Unary operator "-" should not be preceeded by whitespace.

```js
- 1
```

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are not considered warnings:

Word unary operator "delete" is followed by a whitespace.

```js
delete foo.bar
```

Word unary operator "new" is followed by a whitespace.

```js
new Foo
```

Word unary operator "void" is followed by a whitespace.

```js
void 0
```

Unary operator "++" is not followed by whitespace.

```js
++foo
```

Unary operator "--" is not preceeded by whitespace.

```js
foo--
```

Unary operator "-" is not followed by whitespace.

```js
-1
```

### Options

This rule have two options: `words` and `nonwords`:
- `words` - applies to unary word operators such as: `new`, `delete`, `typeof`, `void`
- `nonwords` - applies to unary operators such as: `-`, `+`, `--`, `++`, `!`, `!!`

Default values are:

```js
"space-unary-ops": [1, { "words": true, "nonwords": false }]
```

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
