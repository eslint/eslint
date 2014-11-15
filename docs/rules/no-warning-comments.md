# Disallow Warning Comments (no-warning-comments)

Often code is marked during development process for later work on it or with additional thoughts. Examples are typically `// TODO: do something` or `// FIXME: this is not a good idea`. These comments are a warning signal, that there is something not production ready in your code. Most likely you want to fix it or remove the comments before you roll out your code with a good feeling.

## Rule Details

This rule can be used to help finding these `warning-comments`. It can be configured with an array of terms you don't want to exist in your code. It will raise a warning when one or more of the configured `warning-comments` are present in the checked files.

The default configuration has this rule disabled and looks like this:

```js
...
"no-warning-comments": [0, { "terms": ["todo", "fixme", "xxx"], "location": "start" }]
...
```

This preconfigures

* the rule is disabled because it is set to `0`. Changing this to `1` for warn or `2` for error mode activates it (this works exactly the same as everywhere else in `ESLint`).
* the `terms` array is set to `todo`, `fixme` and `xxx` as `warning-comments`. `terms` has to be an array. It can hold any terms you might want to warn about in your comments - they do not have to be single words. E.g. `really bad idea` is as valid as `attention`.
* the `location`-option set to `start` configures the rule to check only the start of comments. E.g. `// TODO` would be matched, `// This is a TODO` not. You can change this to `anywhere` to check your complete comments.

As already seen above, the configuration is quite simple. Example that enables the rule and configures it to check the complete comment, not only the start:

```js
...
"no-warning-comments": [2, { "terms": ["todo", "fixme", "any other term"], "location": "anywhere" }]
...
```

The following patterns are considered warnings with the example configuration from above:

```js
// TODO: this
// todo: this too
// Even this: TODO
/*
 * The same goes for this TODO comment
 * Or a fixme
 * as well as any other term
 */
...
```

These patterns would not be considered warnings with the same example configuration:

```js
// This is to do
// even not any other    term
/*
 * The same goes for block comments
 * with any other interesting term
 * or fix me this
 */
...
```

As mentioned above, patterns are matched when they match exactly to one of the terms specified (ignoring the case).

## Rule Options

```js
...
"no-warning-comments": [<enabled>, { "terms": <terms>, "location": <location> }]
...
```

* `enabled`: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to `0`.
* `terms`: optional array of terms to match. Terms are matched ignoring the case. Defaults to `["todo", "fixme", "xxx"]`.
* `location`: optional string that configures where in your comments to check for matches. Defaults to `"start"`.

## When not to use it

* If you have a large code base that was not developed with a policy to not use such warning terms, you might get hundreds of warnings / errors which might be contra-productive if you can't fix all of them (e.g. if you don't get the time to do it) as you might overlook other warnings / errors or get used to many of them and don't pay attention on it anymore.
* Same reason as the point above: You shouldn't configure terms that are used very often (e.g. central parts of the native language used in your comments).

## Further reading

### More examples of valid configurations
1. Rule configured to warn on matches and search the complete comment, not only the start of it. Note that the `term` configuration is omitted to use the defaults terms.

   ```js
   ...
   "no-warning-comments": [1, { "location": "anywhere" }]
   ...
   ```

2. Rule configured to warn on matches of the term `bad string` at the start of comments. Note that the `location` configuration is omitted to use the default location.

   ```js
   ...
   "no-warning-comments": [1, { "terms": ["bad string"] }]
   ...
   ```

3. Rule configured to warn with error on matches of the default terms at the start of comments. Note that the complete configuration object (that normally holds `terms` and/or `location`) can be omitted for simplicity.

   ```js
   ...
   "no-warning-comments": [2]
   ...
   ```

4. Rule configured to warn on matches of the default terms at the start of comments. Note that the complete configuration object (as already seen in the example above) and even the square brackets can be omitted for simplicity.

   ```js
   ...
   "no-warning-comments": 1
   ...
   ```

5. Rule configured to warn on matches of the specified terms at the start of comments. Note that you can use as many terms as you want.

   ```js
   ...
   "no-warning-comments": [1, { "terms": ["any really", "interesting", "or even not", "term", "can be matched"] }]
   ...
   ```
