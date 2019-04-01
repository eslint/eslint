# Disallow bugs in source code (no-bugs)

When building software, it's common for developers to make inadvertent errors, typically known as bugs. Bugs can create a variety of problems, including application crashes, security vulnerabilities, financial losses, and itchy bites.

## Rule Details

This rule aims to report any bugs that occur in source code.

Examples of **incorrect** code for this rule:

```js
var foo = '🐞';
var bar = '🐛';
var baz = '🐜';
var quux = '🕷';
var beep = '🦟';
```

Examples of **correct** code for this rule:

```js
var foo = 'bar';
var correctCode = 5;
var feature = 3;
debugger;

```

## Compatibility

This rule can be used as an effective workaround for the absence of a type system.

## When Not To Use It

This rule should generally be disabled in circumstances where bugs are desirable, such as when inserting backdoors and researching entomology. For maximum effect, consider also disabling all other ESLint rules.

This rule should not be used with the [`no-debugger`](/docs/rules/no-debugger) rule.

## Further Reading

* [April Fool's Day](https://en.wikipedia.org/wiki/April_Fools%27_Day)
