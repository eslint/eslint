---
title: no-misleading-character-class
rule_type: problem
---





Unicode includes characters which are made by multiple code points.
RegExp character class syntax (`/[abc]/`) cannot handle characters which are made by multiple code points as a character; those characters will be dissolved to each code point. For example, `❇️` is made by `❇` (`U+2747`) and VARIATION SELECTOR-16 (`U+FE0F`). If this character is in a RegExp character class, it will match either `❇` (`U+2747`) or VARIATION SELECTOR-16 (`U+FE0F`) rather than `❇️`.

This rule reports regular expressions which include multiple code point characters in character class syntax. This rule considers the following characters as multiple code point characters.

**A character with combining characters:**

The combining characters are characters which belong to one of `Mc`, `Me`, and `Mn` [Unicode general categories](https://www.unicode.org/L2/L1999/UnicodeData.html#General%20Category).

```js
/^[Á]$/u.test("Á"); //→ false
/^[❇️]$/u.test("❇️"); //→ false
```

**A character with Emoji modifiers:**

```js
/^[👶🏻]$/u.test("👶🏻"); //→ false
/^[👶🏽]$/u.test("👶🏽"); //→ false
```

**A pair of regional indicator symbols:**

```js
/^[🇯🇵]$/u.test("🇯🇵"); //→ false
```

**Characters that ZWJ joins:**

```js
/^[👨‍👩‍👦]$/u.test("👨‍👩‍👦"); //→ false
```

**A surrogate pair without Unicode flag:**

```js
/^[👍]$/.test("👍"); //→ false

// Surrogate pair is OK if with u flag.
/^[👍]$/u.test("👍"); //→ true
```

## Rule Details

This rule reports regular expressions which include multiple code point characters in character class syntax.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-misleading-character-class: error */

/^[Á]$/u;
/^[❇️]$/u;
/^[👶🏻]$/u;
/^[🇯🇵]$/u;
/^[👨‍👩‍👦]$/u;
/^[👍]$/;
new RegExp("[🎵]");
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-misleading-character-class: error */

/^[abc]$/;
/^[👍]$/u;
/^[\q{👶🏻}]$/v;
new RegExp("^[]$");
new RegExp(`[Á-${z}]`, "u"); // variable pattern
```

:::

## Options

This rule has an object option:

* `"allowEscape"`: When set to `true`, the rule allows any grouping of code points inside a character class as long as they are written using escape sequences. This option only has effect on regular expression literals and on regular expressions created with the `RegExp` constructor with a literal argument as a pattern.

### allowEscape

Examples of **incorrect** code for this rule with the `{ "allowEscape": true }` option:

::: incorrect

```js
/* eslint no-misleading-character-class: ["error", { "allowEscape": true }] */

/[\👍]/; // backslash can be omitted

new RegExp("[\ud83d" + "\udc4d]");

const pattern = "[\ud83d\udc4d]";
new RegExp(pattern);
```

:::

Examples of **correct** code for this rule with the `{ "allowEscape": true }` option:

::: correct

```js
/* eslint no-misleading-character-class: ["error", { "allowEscape": true }] */

/[\ud83d\udc4d]/;
/[\u00B7\u0300-\u036F]/u;
/[👨\u200d👩]/u;
new RegExp("[\x41\u0301]");
new RegExp(`[\u{1F1EF}\u{1F1F5}]`, "u");
new RegExp("[\\u{1F1EF}\\u{1F1F5}]", "u");
```

:::

## When Not To Use It

You can turn this rule off if you don't want to check RegExp character class syntax for multiple code point characters.
