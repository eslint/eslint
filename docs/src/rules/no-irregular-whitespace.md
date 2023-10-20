---
title: no-irregular-whitespace
rule_type: problem
further_reading:
- https://es5.github.io/#x7.2
- https://web.archive.org/web/20200414142829/http://timelessrepo.com/json-isnt-a-javascript-subset
- https://codepoints.net/U+1680
---



Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code harder to debug in a similar nature to mixed tabs and spaces.

Various whitespace characters can be inputted by programmers by mistake for example from copying or keyboard shortcuts. Pressing Alt + Space on macOS adds in a non breaking space character for example.

A simple fix for this problem could be to rewrite the offending line from scratch. This might also be a problem introduced by the text editor: if rewriting the line does not fix it, try using a different editor.

Known issues these spaces cause:

* Ogham Space Mark
    * Is a valid token separator, but is rendered as a visible glyph in most typefaces, which may be misleading in source code.
* Mongolian Vowel Separator
    * Is no longer considered a space separator since Unicode 6.3. It will result in a syntax error in current parsers when used in place of a regular token separator.
* Line Separator and Paragraph Separator
    * These have always been valid whitespace characters and line terminators, but were considered illegal in string literals prior to ECMAScript 2019.
* Zero Width Space
    * Is NOT considered a separator for tokens and is often parsed as an `Unexpected token ILLEGAL`.
    * Is NOT shown in modern browsers making code repository software expected to resolve the visualization.

In JSON, none of the characters listed as irregular whitespace by this rule may appear outside of a string.

## Rule Details

This rule is aimed at catching invalid whitespace that is not a normal tab and space. Some of these characters may cause issues in modern browsers and others will be a debugging issue to spot.

This rule disallows the following characters except where the options allow:

```text
\u000B - Line Tabulation (\v) - <VT>
\u000C - Form Feed (\f) - <FF>
\u00A0 - No-Break Space - <NBSP>
\u0085 - Next Line
\u1680 - Ogham Space Mark
\u180E - Mongolian Vowel Separator - <MVS>
\ufeff - Zero Width No-Break Space - <BOM>
\u2000 - En Quad
\u2001 - Em Quad
\u2002 - En Space - <ENSP>
\u2003 - Em Space - <EMSP>
\u2004 - Three-Per-Em
\u2005 - Four-Per-Em
\u2006 - Six-Per-Em
\u2007 - Figure Space
\u2008 - Punctuation Space - <PUNCSP>
\u2009 - Thin Space
\u200A - Hair Space
\u200B - Zero Width Space - <ZWSP>
\u2028 - Line Separator
\u2029 - Paragraph Separator
\u202F - Narrow No-Break Space
\u205f - Medium Mathematical Space
\u3000 - Ideographic Space
```

## Options

This rule has an object option for exceptions:

* `"skipStrings": true` (default) allows any whitespace characters in string literals
* `"skipComments": true` allows any whitespace characters in comments
* `"skipRegExps": true` allows any whitespace characters in regular expression literals
* `"skipTemplates": true` allows any whitespace characters in template literals
* `"skipJSXText": true` allows any whitespace characters in JSX text

### skipStrings

Examples of **incorrect** code for this rule with the default `{ "skipStrings": true }` option:

::: incorrect

```js
/*eslint no-irregular-whitespace: "error"*/

var thing = function() /*<NBSP>*/{
    return 'test';
}

var thing = function( /*<NBSP>*/){
    return 'test';
}

var thing = function /*<NBSP>*/(){
    return 'test';
}

var thing = function /*<Ogham Space Mark>*/(){
    return 'test';
}

var thing = function() {
    return 'test'; /*<ENSP>*/
}

var thing = function() {
    return 'test'; /*<NBSP>*/
}

var thing = function() {
    // Description <NBSP>: some descriptive text
}

/*
Description <NBSP>: some descriptive text
*/

var thing = function() {
    return / <NBSP>regexp/;
}

/*eslint-env es6*/
var thing = function() {
    return `template <NBSP>string`;
}
```

:::

Examples of **correct** code for this rule with the default `{ "skipStrings": true }` option:

::: correct

```js
/*eslint no-irregular-whitespace: "error"*/

var thing = function() {
    return ' <NBSP>thing';
}

var thing = function() {
    return '​<ZWSP>thing';
}

var thing = function() {
    return 'th <NBSP>ing';
}
```

:::

### skipComments

Examples of additional **correct** code for this rule with the `{ "skipComments": true }` option:

::: correct

```js
/*eslint no-irregular-whitespace: ["error", { "skipComments": true }]*/

function thing() {
    // Description <NBSP>: some descriptive text
}

/*
Description <NBSP>: some descriptive text
*/
```

:::

### skipRegExps

Examples of additional **correct** code for this rule with the `{ "skipRegExps": true }` option:

::: correct

```js
/*eslint no-irregular-whitespace: ["error", { "skipRegExps": true }]*/

function thing() {
    return / <NBSP>regexp/;
}
```

:::

### skipTemplates

Examples of additional **correct** code for this rule with the `{ "skipTemplates": true }` option:

::: correct

```js
/*eslint no-irregular-whitespace: ["error", { "skipTemplates": true }]*/
/*eslint-env es6*/

function thing() {
    return `template <NBSP>string`;
}
```

:::

### skipJSXText

Examples of additional **correct** code for this rule with the `{ "skipJSXText": true }` option:

::: correct { "ecmaFeatures": { "jsx": true } }

```jsx
/*eslint no-irregular-whitespace: ["error", { "skipJSXText": true }]*/
/*eslint-env es6*/

function Thing() {
    return <div>text in JSX</div>; // <NBSP> before `JSX`
}
```

:::

## When Not To Use It

If you decide that you wish to use whitespace other than tabs and spaces outside of strings in your application.
