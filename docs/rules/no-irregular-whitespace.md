# No irregular whitespace (no-irregular-whitespace)

Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code harder to debug in a similar nature to mixed tabs and spaces.

Various whitespace characters can be inputted by programmers by mistake for example from copying or keyboard shortcuts. Pressing Alt + Space on OS X adds in a non breaking space character for example.

Known issues these spaces cause:

-  Zero Width Space
  -  Is NOT considered a separator for tokens and is often parsed as an `Unexpected token ILLEGAL`
  -  Is NOT shown in modern browsers making code repository software expected to resolve the visualisation
-  Line Separator
  -  Is NOT a valid character within JSON which would cause parse errors

## Rule Details

This rule is aimed at catching invalid whitespace that is not a normal tab and space. Some of these characters may cause issues in modern browsers and others will be a debugging issue to spot.

With this rule enabled the following characters will cause warnings outside of strings:

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


The following examples are considered warnings:

```js
function thing()<NBSP>{
  return 'test';
}

function thing(<NBSP>){
  return 'test';
}

function thing<NBSP>(){
  return 'test';
}

function thing<MVS>(){
  return 'test';
}

function thing() {
  return 'test';<ZWSP>
}

function thing() {
  return 'test';<NBSP>
}
```

The following patterns are not considered warnings:

```js
function thing() {
  return '<NBSP>thing';
}

function thing() {
  return '<ZWSP>thing';
}

function thing() {
  return 'th<NBSP>ing';
}
```

## When Not To Use It

If you decide that you wish to use whitespace other than tabs and spaces outside of strings in your application.

## Further Reading

* [ECMA whitespace](https://es5.github.io/#x7.2 \xA0)
* [JSON whitespace issues](http://timelessrepo.com/json-isnt-a-javascript-subset)
