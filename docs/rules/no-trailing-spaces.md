# Disallow trailing spaces at the end of lines (no-trailing-spaces)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Sometimes in the course of editing files, you can end up with extra whitespace at the end of lines. These whitespace differences can be picked up by source control systems and flagged as diffs, causing frustration for developers. While this extra whitespace causes no functional issues, many code conventions require that trailing spaces be removed before checkin.

## Rule Details

The following patterns are considered problems:

```js
/*eslint no-trailing-spaces: "error"*/

// spaces, tabs and unicode whitespaces
// are not allowed at the end of lines
var foo = 0;//•••••
var baz = 5;//••
```

The following patterns are not considered problems:

```js
/*eslint no-trailing-spaces: "error"*/

var foo = 0;

var baz = 5;
```

## Options

There is one option for this rule, `skipBlankLines`. When set to true, the rule will not flag any lines that are made up purely of whitespace. In short, if a line is zero-length after being trimmed of whitespace, then the rule will not flag that line when `skipBlankLines` is enabled.

You can enable this option in your config like this:

```json
{
    "no-trailing-spaces": ["error", { "skipBlankLines": true }]
}
```

With this option enabled, The following patterns are not considered problems:

```js
/*eslint no-trailing-spaces: ["error", { "skipBlankLines": true }]*/

var foo = 0;
//••••
var baz = 5;
```
