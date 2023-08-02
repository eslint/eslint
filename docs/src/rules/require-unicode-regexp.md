---
title: require-unicode-regexp
rule_type: suggestion
further_reading:
- https://github.com/tc39/proposal-regexp-v-flag
- https://v8.dev/features/regexp-v-flag
---


RegExp `u` flag has two effects:

1. **Make the regular expression handling UTF-16 surrogate pairs correctly.**

    Especially, character range syntax gets the correct behavior.

    ```js
    /^[👍]$/.test("👍") //→ false
    /^[👍]$/u.test("👍") //→ true
    ```

2. **Make the regular expression throwing syntax errors early as disabling [Annex B extensions](https://www.ecma-international.org/ecma-262/6.0/#sec-regular-expressions-patterns).**

    Because of historical reason, JavaScript regular expressions are tolerant of syntax errors. For example, `/\w{1, 2/` is a syntax error, but JavaScript doesn't throw the error. It matches strings such as `"a{1, 2"` instead. Such a recovering logic is defined in Annex B.

    The `u` flag disables the recovering logic Annex B defined. As a result, you can find errors early. This is similar to [the strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).

The RegExp `v` flag, introduced in ECMAScript 2024, is a superset of the `u` flag, and offers two more features:

1. **Unicode properties of strings**

    With the Unicode property escape, you can use properties of strings.

    ```js
    const re = /^\p{RGI_Emoji}$/v;

    // Match an emoji that consists of just 1 code point:
    re.test('⚽'); // '\u26BD'
    // → true ✅

    // Match an emoji that consists of multiple code points:
    re.test('👨🏾‍⚕️'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
    // → true ✅
    ```

2. **Set notation**

    It allows for set operations between character classes.

    ```js
    const re = /[\p{White_Space}&&\p{ASCII}]/v;
    re.test('\n'); // → true
    re.test('\u2028'); // → false
    ```

Therefore, the `u` and `v` flags let us work better with regular expressions.

## Rule Details

This rule aims to enforce the use of `u` or `v` flag on regular expressions.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint require-unicode-regexp: error */

const a = /aaa/
const b = /bbb/gi
const c = new RegExp("ccc")
const d = new RegExp("ddd", "gi")
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint require-unicode-regexp: error */

const a = /aaa/u
const b = /bbb/giu
const c = new RegExp("ccc", "u")
const d = new RegExp("ddd", "giu")

const e = /aaa/v
const f = /bbb/giv
const g = new RegExp("ccc", "v")
const h = new RegExp("ddd", "giv")

// This rule ignores RegExp calls if the flags could not be evaluated to a static value.
function f(flags) {
    return new RegExp("eee", flags)
}
```

:::

## When Not To Use It

If you don't want to warn on regular expressions without either a `u` or a `v` flag, then it's safe to disable this rule.
