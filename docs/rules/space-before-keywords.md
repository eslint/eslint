# space-before-keywords: enforce consistent spacing before keywords

(removed) This rule was **removed** in ESLint v2.0 and **replaced** by the [keyword-spacing](keyword-spacing.md) rule.

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixed problems reported by this rule.

Keywords are syntax elements of JavaScript, such as `function` and `if`. These identifiers have special meaning to the language and so often appear in a different color in code editors. As an important part of the language, style guides often refer to the spacing that should be used around keywords. For example, you might have a style guide that says keywords should be always be preceded by spaces, which would mean `if-else` statements must look like this:

```js
if (foo) {
    // ...
} else {
    // ...
}
```

Of course, you could also have a style guide that disallows spaces before keywords.

## Rule Details

This rule will enforce consistency of spacing before the keywords `if`, `else`, `for`,
`while`, `do`, `switch`, `throw`, `try`, `catch`, `finally`, `with`, `break`, `continue`,
`return`, `function`, `yield`, `class` and variable declarations (`let`, `const`, `var`)
and label statements.

This rule takes one argument: `"always"` or `"never"`. If `"always"` then the keywords
must be preceded by at least one space. If `"never"` then no spaces will be allowed before
the keywords `else`, `while` (do...while), `finally` and `catch`. The default value is `"always"`.

This rule will allow keywords to be preceded by an opening curly brace (`{`). If you wish to alter
this behavior, consider using the [block-spacing](block-spacing.md) rule.

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint space-before-keywords: ["error", "always"]*/
/*eslint-env es6*/

if (foo) {
    // ...
}else {}

const foo = 'bar';let baz = 'qux';

var foo =function bar () {}

function bar() {
    if (foo) {return; }
}
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint space-before-keywords: ["error", "always"]*/
/*eslint-env es6*/

if (foo) {
    // ...
} else {}

(function() {})()

<Foo onClick={function bar() {}} />

for (let foo of ['bar', 'baz', 'qux']) {}
```

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint space-before-keywords: ["error", "never"]*/

if (foo) {
    // ...
} else {}

do {

}
while (foo)

try {} finally {}

try {} catch(e) {}
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint space-before-keywords: ["error", "never"]*/

if (foo) {
    // ...
}else {}

do {}while (foo)

try {}finally {}

try{}catch(e) {}
```

## When Not To Use It

If you do not wish to enforce consistency on keyword spacing.

## Related Rules

* [space-after-keywords](space-after-keywords.md)
* [block-spacing](block-spacing.md)
* [space-return-throw-case](space-return-throw-case.md)
* [space-unary-ops](space-unary-ops.md)
* [space-infix-ops](space-infix-ops.md)
