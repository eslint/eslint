# Require or disallow spaces before keywords (space-before-keywords)

Some styleguides require or disallow spaces preceding certain keywords.

## Rule Details

This rule will enforce consistency of spacing before the keywords `if`, `else`, `for`,
`while`, `do`, `switch`, `throw`, `try`, `catch`, `finally`, `with`, `break`, `continue`,
`return`, `function`, `yield`, `class`, `super` and variable declarations (`let`, `const`, `var`)
and label statements.

This rule takes one argument: `"always"` or `"never"`. If `"always"` then the keywords
must be followed by at least one space. If `"never"` then no spaces will be allowed before
the keywords `else`, `while` (do...while), `finally` and `catch`. The default value is `"always"`.

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

if (foo) {
    // ...
} else {}

(function() {})()

for (let foo of ['bar', 'baz', 'qux']) {}
```

## When Not To Use It

If you do not wish to enforce consistency on keyword spacing.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [space-return-throw-case](space-return-throw-case.md)
* [space-unary-ops](space-unary-ops.md)
* [space-infix-ops](space-infix-ops.md)
