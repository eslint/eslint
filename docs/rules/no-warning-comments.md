# Disallow Warning Comments (no-warning-comments)

Developers often add comments to code which is not complete or needs review. Most likely you want to fix or review the code, and then remove the comment, before you consider the code to be production ready.

```js
// TODO: do something
// FIXME: this is not a good idea
```

## Rule Details

This rule reports comments that include any of the predefined terms specified in its configuration.

## Options

This rule has an options object literal:

* `"terms"`: optional array of terms to match. Defaults to `["todo", "fixme", "xxx"]`. Terms are matched case-insensitive and as whole words: `fix` would match `FIX` but not `fixing`. Terms can consist of multiple words: `really bad idea`.
* `"location"`: optional string that configures where in your comments to check for matches. Defaults to `"start"`. The other value is match `anywhere` in comments.

Example of **incorrect** code for the default `{ "terms": ["todo", "fixme", "xxx"], "location": "start" }` options:

```js
/*eslint no-warning-comments: "error"*/

function callback(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  // TODO
}
```

Example of **correct** code for the default `{ "terms": ["todo", "fixme", "xxx"], "location": "start" }` options:

```js
/*eslint no-warning-comments: "error"*/

function callback(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  // NOT READY FOR PRIME TIME
  // but too bad, it is not a predefined warning term
}
```

### terms and location

Examples of **incorrect** code for the `{ "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }` options:

```js
/*eslint no-warning-comments: ["error", { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/

// TODO: this
// todo: this too
// Even this: TODO
/* /*
 * The same goes for this TODO comment
 * Or a fixme
 * as well as any other term
 */
```

Examples of **correct** code for the `{ "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }` options:

```js
/*eslint no-warning-comments: ["error", { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]*/

// This is to do
// even not any other    term
// any other terminal
/*
 * The same goes for block comments
 * with any other interesting term
 * or fix me this
 */
```

## When Not To Use It

* If you have a large code base that was not developed with a policy to not use such warning terms, you might get hundreds of warnings / errors which might be counter-productive if you can't fix all of them (e.g. if you don't get the time to do it) as you might overlook other warnings / errors or get used to many of them and don't pay attention on it anymore.
* Same reason as the point above: You shouldn't configure terms that are used very often (e.g. central parts of the native language used in your comments).
