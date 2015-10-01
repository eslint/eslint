# Require or disallow spaces before/after unary operators (space-unary-ops)

Some styleguides require or disallow spaces before or after unary operators. This is mainly a stylistic issue, however, some JavaScript expressions can be written without spacing which makes it harder to read and maintain.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule enforces consistency regarding the spaces after `words` unary operators and after/before `nonwords` unary operators.

### Options

This rule has two options: `words` and `nonwords`:

* `words` - applies to unary word operators such as: `new`, `delete`, `typeof`, `void`, `yield`
* `nonwords` - applies to unary operators such as: `-`, `+`, `--`, `++`, `!`, `!!`

Default values are:

```json
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

### Examples

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are considered problems:

```js
/*eslint space-unary-ops: 2*/
/*eslint-env es6*/

typeof!foo;        /*error Unary word operator "typeof" must be followed by whitespace.*/

void{foo:0};       /*error Unary word operator "void" must be followed by whitespace.*/

new[foo][0];       /*error Unary word operator "new" must be followed by whitespace.*/

delete(foo.bar);   /*error Unary word operator "delete" must be followed by whitespace.*/

function *foo() {
    yield(0)       /*error Unary word operator "yield" must be followed by whitespace.*/
}

++ foo;            /*error Unexpected space after unary operator "++".*/

foo --;            /*error Unexpected space before unary operator "--".*/

- foo;             /*error Unexpected space after unary operator "-".*/

+ "3";             /*error Unexpected space after unary operator "+".*/
```

Given the default values `words`: `true`, `nonwords`: `false`, the following patterns are not considered problems:



```js
/*eslint space-unary-ops: 2*/

// Word unary operator "delete" is followed by a whitespace.
delete foo.bar;

// Word unary operator "new" is followed by a whitespace.
new Foo;

// Word unary operator "void" is followed by a whitespace.
void 0;

// Unary operator "++" is not followed by whitespace.
++foo;

// Unary operator "--" is not preceeded by whitespace.
foo--;

// Unary operator "-" is not followed by whitespace.
-foo;

// Unary operator "+" is not followed by whitespace.
+"3";
```
