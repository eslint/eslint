# Require or disallow spaces before keywords (space-before-keywords)

Keywords are syntax elements of JavaScript, such as `function` and `if`. These identifiers have special meaning to the language and so often appear in a different color in code editors. As an important part of the language, style guides often refer to the spacing that should be used around keywords. For example, you might have a style guide that says keywords should be always be preceeded by spaces, which would mean `if-else` statements must look like this:

```js
if (foo) {
    // ...
} else {
    // ...
}
```

Of course, you could also have a style guide that disallows spaces before keywords.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule will enforce consistency of spacing before the keywords `if`, `else`, `for`,
`while`, `do`, `switch`, `throw`, `try`, `catch`, `finally`, `with`, `break`, `continue`,
`return`, `function`, `yield`, `class` and variable declarations (`let`, `const`, `var`)
and label statements.

This rule takes one argument: `"always"` or `"never"`. If `"always"` then the keywords
must be preceded by at least one space. If `"never"` then no spaces will be allowed before
the keywords `else`, `while` (do...while), `finally` and `catch`. The default value is `"always"`.

This rule will allow keywords to be preceded by an opening curly brace (`{`). If you wish to alter
this behaviour, consider using the [block-spacing](block-spacing.md) rule.

The following patterns are considered errors when configured `"never"`:

```js
/*eslint space-before-keywords: [2, "never"]*/

if (foo) {
    // ...
} else {}         /*error Unexpected space before keyword "else".*/

do {

}
while (foo)       /*error Unexpected space before keyword "while".*/

try {} finally {} /*error Unexpected space before keyword "finally".*/

try {} catch(e) {} /*error Unexpected space before keyword "catch".*/
```

The following patterns are not considered errors when configured `"never"`:

```js
/*eslint space-before-keywords: [2, "never"]*/

if (foo) {
    // ...
}else {}

do {}while (foo)

try {}finally {}

try{}catch(e) {}
```

The following patterns are considered errors when configured `"always"`:

```js
/*eslint space-before-keywords: [2, "always"]*/
/*eslint-env es6*/

if (foo) {
    // ...
}else {}                           /*error Missing space before keyword "else".*/

const foo = 'bar';let baz = 'qux'; /*error Missing space before keyword "let".*/

var foo =function bar () {}        /*error Missing space before keyword "function".*/

function bar() {
    if (foo) {return; }            /*error Missing space before keyword "return".*/
}
```

The following patterns are not considered errors when configured `"always"`:

```js
/*eslint space-before-keywords: [2, "always"]*/
/*eslint-env es6*/

if (foo) {
    // ...
} else {}

(function() {})()

<Foo onClick={function bar() {}} />

for (let foo of ['bar', 'baz', 'qux']) {}
```

## When Not To Use It

If you do not wish to enforce consistency on keyword spacing.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [block-spacing](block-spacing.md)
* [space-return-throw-case](space-return-throw-case.md)
* [space-unary-ops](space-unary-ops.md)
* [space-infix-ops](space-infix-ops.md)
