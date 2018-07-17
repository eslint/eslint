# disallow irregular whitespace (no-irregular-whitespace)

Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code harder to debug in a similar nature to mixed tabs and spaces.

Various whitespace characters can be inputted by programmers by mistake for example from copying or keyboard shortcuts. Pressing Alt + Space on macOS adds in a non breaking space character for example.

A simple fix for this problem could be to rewrite the offending line from scratch. This might also be a problem introduced by the text editor: if rewriting the line does not fix it, try using a different editor.

Known issues these spaces cause:

* Zero Width Space
    * Is NOT considered a separator for tokens and is often parsed as an `Unexpected token ILLEGAL`
    * Is NOT shown in modern browsers making code repository software expected to resolve the visualization
* Line Separator
    * Is NOT a valid character within JSON which would cause parse errors

## Rule Details

This rule is aimed at catching invalid whitespace that is not a normal tab and space. Some of these characters may cause issues in modern browsers and others will be a debugging issue to spot.

This rule disallows the following characters except where the options allow:

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
    \u2004 - Tree-Per-Em
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

## Options

This rule has an object option for exceptions:

* `"skipStrings": true` (default) allows any whitespace characters in string literals
* `"skipComments": true` allows any whitespace characters in comments
* `"skipRegExps": true` allows any whitespace characters in regular expression literals
* `"skipTemplates": true` allows any whitespace characters in template literals

### skipStrings

Examples of **incorrect** code for this rule with the default `{ "skipStrings": true }` option:

```js
/*eslint no-irregular-whitespace: "error"*/

function thing() /*<NBSP>*/{
    return 'test';
}

function thing( /*<NBSP>*/){
    return 'test';
}

function thing /*<NBSP>*/(){
    return 'test';
}

function thing᠎/*<MVS>*/(){
    return 'test';
}

function thing() {
    return 'test'; /*<ENSP>*/
}

function thing() {
    return 'test'; /*<NBSP>*/
}

function thing() {
    // Description <NBSP>: some descriptive text
}

/*
Description <NBSP>: some descriptive text
*/

function thing() {
    return / <NBSP>regexp/;
}

/*eslint-env es6*/
function thing() {
    return `template <NBSP>string`;
}
```

Examples of **correct** code for this rule with the default `{ "skipStrings": true }` option:

```js
/*eslint no-irregular-whitespace: "error"*/

function thing() {
    return ' <NBSP>thing';
}

function thing() {
    return '​<ZWSP>thing';
}

function thing() {
    return 'th <NBSP>ing';
}
```

### skipComments

Examples of additional **correct** code for this rule with the `{ "skipComments": true }` option:

```js
/*eslint no-irregular-whitespace: ["error", { "skipComments": true }]*/

function thing() {
    // Description <NBSP>: some descriptive text
}

/*
Description <NBSP>: some descriptive text
*/
```

### skipRegExps

Examples of additional **correct** code for this rule with the `{ "skipRegExps": true }` option:

```js
/*eslint no-irregular-whitespace: ["error", { "skipRegExps": true }]*/

function thing() {
    return / <NBSP>regexp/;
}
```

### skipTemplates

Examples of additional **correct** code for this rule with the `{ "skipTemplates": true }` option:

```js
/*eslint no-irregular-whitespace: ["error", { "skipTemplates": true }]*/
/*eslint-env es6*/

function thing() {
    return `template <NBSP>string`;
}
```

## When Not To Use It

If you decide that you wish to use whitespace other than tabs and spaces outside of strings in your application.

## Further Reading

* [ECMA whitespace](https://es5.github.io/#x7.2 \xA0)
* [JSON whitespace issues](http://timelessrepo.com/json-isnt-a-javascript-subset)
