---
title: no-useless-backreference
rule_type: problem
related_rules:
- no-control-regex
- no-empty-character-class
- no-invalid-regexp
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
---



In JavaScript regular expressions, it's syntactically valid to define a backreference to a group that belongs to another alternative part of the pattern, a backreference to a group that appears after the backreference, a backreference to a group that contains that backreference, or a backreference to a group that is inside a negative lookaround. However, by the specification, in any of these cases the backreference always ends up matching only zero-length (the empty string), regardless of the context in which the backreference and the group appear.

Backreferences that always successfully match zero-length and cannot match anything else are useless. They are basically ignored and can be removed without changing the behavior of the regular expression.

```js
var regex = /^(?:(a)|\1b)$/;

regex.test("a"); // true
regex.test("b"); // true!
regex.test("ab"); // false

var equivalentRegex = /^(?:(a)|b)$/;

equivalentRegex.test("a"); // true
equivalentRegex.test("b"); // true
equivalentRegex.test("ab"); // false
```

Useless backreference is a possible error in the code. It usually indicates that the regular expression does not work as intended.

## Rule Details

This rule aims to detect and disallow the following backreferences in regular expression:

* Backreference to a group that is in another alternative, e.g., `/(a)|\1b/`. In such constructed regular expression, the backreference is expected to match what's been captured in, at that point, a non-participating group.
* Backreference to a group that appears later in the pattern, e.g., `/\1(a)/`. The group hasn't captured anything yet, and ECMAScript doesn't support forward references. Inside lookbehinds, which match backward, the opposite applies and this rule disallows backreference to a group that appears before in the same lookbehind, e.g., `/(?<=(a)\1)b/`.
* Backreference to a group from within the same group, e.g., `/(\1)/`. Similar to the previous, the group hasn't captured anything yet, and ECMAScript doesn't support nested references.
* Backreference to a group that is in a negative lookaround, if the backreference isn't in the same negative lookaround, e.g., `/a(?!(b)).\1/`. A negative lookaround (lookahead or lookbehind) succeeds only if its pattern cannot match, meaning that the group has failed.

By the ECMAScript specification, all backreferences listed above are valid, always succeed to match zero-length, and cannot match anything else. Consequently, they don't produce parsing or runtime errors, but also don't affect the behavior of their regular expressions. They are syntactically valid but useless.

This might be surprising to developers coming from other languages where some of these backreferences can be used in a meaningful way.

```js
// in some other languages, this pattern would successfully match "aab"

/^(?:(a)(?=a)|\1b)+$/.test("aab"); // false
```

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-useless-backreference: "error"*/

/^(?:(a)|\1b)$/; // reference to (a) into another alternative

/^(?:(a)|b(?:c|\1))$/; // reference to (a) into another alternative

/^(?:a|b(?:(c)|\1))$/; // reference to (c) into another alternative

/\1(a)/; // forward reference to (a)

RegExp('(a)\\2(b)'); // forward reference to (b)

/(?:a)(b)\2(c)/; // forward reference to (c)

/\k<foo>(?<foo>a)/; // forward reference to (?<foo>a)

/(?<=(a)\1)b/; // backward reference to (a) from within the same lookbehind

/(?<!(a)\1)b/; // backward reference to (a) from within the same lookbehind

new RegExp('(\\1)'); // nested reference to (\1)

/^((a)\1)$/; // nested reference to ((a)\1)

/a(?<foo>(.)b\1)/; // nested reference to (?<foo>(.)b\1)

/a(?!(b)).\1/; // reference to (b) into a negative lookahead

/(?<!(a))b\1/; // reference to (a) into a negative lookbehind
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-useless-backreference: "error"*/

/^(?:(a)|(b)\2)$/; // reference to (b)

/(a)\1/; // reference to (a)

RegExp('(a)\\1(b)'); // reference to (a)

/(a)(b)\2(c)/; // reference to (b)

/(?<foo>a)\k<foo>/; // reference to (?<foo>a)

/(?<=\1(a))b/; // reference to (a), correctly before the group as they're in the same lookbehind

/(?<=(a))b\1/; // reference to (a), correctly after the group as the backreference isn't in the lookbehind

new RegExp('(.)\\1'); // reference to (.)

/^(?:(a)\1)$/; // reference to (a)

/^((a)\2)$/; // reference to (a)

/a(?<foo>(.)b\2)/; // reference to (.)

/a(?!(b|c)\1)./; // reference to (b|c), correct as it's from within the same negative lookahead

/(?<!\1(a))b/; // reference to (a), correct as it's from within the same negative lookbehind
```

:::

Please note that this rule does not aim to detect and disallow a potentially erroneous use of backreference syntax in regular expressions, like the use in character classes or an attempt to reference a group that doesn't exist. Depending on the context, a `\1`...`\9` sequence that is not a syntactically valid backreference may produce syntax error, or be parsed as something else (e.g., as a legacy octal escape sequence).

Examples of additional **correct** code for this rule:

::: correct

```js
/*eslint no-useless-backreference: "error"*/

// comments describe behavior in a browser

/^[\1](a)$/.test("\x01a"); // true. In a character class, \1 is treated as an octal escape sequence.
/^\1$/.test("\x01"); // true. Since the group 1 doesn't exist, \1 is treated as an octal escape sequence.
/^(a)\1\2$/.test("aa\x02"); // true. In this case, \1 is a backreference, \2 is an octal escape sequence.
```

:::
