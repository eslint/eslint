---
title: no-control-regex
rule_type: problem
related_rules:
- no-div-regex
- no-regex-spaces
---



Control characters are special, invisible characters in the ASCII range 0-31. These characters are rarely used in JavaScript strings so a regular expression containing elements that explicitly match these characters is most likely a mistake.

## Rule Details

This rule disallows control characters and some escape sequences that match control characters in regular expressions.

The following elements of regular expression patterns are considered possible errors in typing and are therefore disallowed by this rule:

* Hexadecimal character escapes from `\x00` to `\x1F`.
* Unicode character escapes from `\u0000` to `\u001F`.
* Unicode code point escapes from `\u{0}` to `\u{1F}`.
* Unescaped raw characters from U+0000 to U+001F.

Control escapes such as `\t` and `\n` are allowed by this rule.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-control-regex: "error"*/

var pattern1 = /\x00/;
var pattern2 = /\x0C/;
var pattern3 = /\x1F/;
var pattern4 = /\u000C/;
var pattern5 = /\u{C}/u;
var pattern6 = new RegExp("\x0C"); // raw U+000C character in the pattern
var pattern7 = new RegExp("\\x0C"); // \x0C pattern
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-control-regex: "error"*/

var pattern1 = /\x20/;
var pattern2 = /\u0020/;
var pattern3 = /\u{20}/u;
var pattern4 = /\t/;
var pattern5 = /\n/;
var pattern6 = new RegExp("\x20");
var pattern7 = new RegExp("\\t");
var pattern8 = new RegExp("\\n");
```

:::

## Known Limitations

When checking `RegExp` constructor calls, this rule examines evaluated regular expression patterns. Therefore, although this rule intends to allow syntax such as `\t`, it doesn't allow `new RegExp("\t")` since the evaluated pattern (string value of `"\t"`) contains a raw control character (the TAB character).

```js
/*eslint no-control-regex: "error"*/

new RegExp("\t"); // disallowed since the pattern is: <TAB>

new RegExp("\\t"); // allowed since the pattern is: \t
```

There is no difference in behavior between `new RegExp("\t")` and `new RegExp("\\t")`, and the intention to match the TAB character is clear in both cases. They are equally valid for the purpose of this rule, but it only allows `new RegExp("\\t")`.

## When Not To Use It

If you need to use control character pattern matching, then you should turn this rule off.
