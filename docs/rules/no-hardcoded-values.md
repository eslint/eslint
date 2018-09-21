# Disallow hardcoded values specified by a RegExp  (no-hardcoded-values)

According to the [Twelve Factor App](https://12factor.net/config) convention environment-specific configuration should be stored separately from the source code. Hardcode is the software development practice of embedding data directly into the source code, as opposed to obtaining the data from external sources or generating it at run-time. This rule helps you avoid deploying your app with hardcoded environemt-specific values. Most of the time these values are:

* `URLs`
* `Paths`
* `Tokens`

## Rule Details

This rule disallows hardcoded values specified by a RegExp as a parameter.
Environment-specific and sensitive data should be stored separately.

## Options

This rule has a string option for the specified regular expression.

For example, to show an error on hardcoded URLs and Email Addresses:

```json
{
    "no-hardcoded-values": [
        "error", [
            "https?://.+\\.com", // RegExp for URL
            ".+@.+\\.com" // RegExp for email
            ]
        ]
}
```

Examples of **incorrect** code for this rule:

```js
/*eslint no-hardcoded-values: "error"*/
const url = "https://dev.hardcode-url.com";

```

```js
/*eslint no-hardcoded-values: "error"*/
checkEmail("username@mail.com");
```

Examples of **correct** code for this rule:

```js
/*eslint no-hardcoded-values: "error"*/
const { SOME_URL } = require('./env');

const url = SOME_URL;
```

```js
/*eslint no-hardcoded-values: "error"*/
const { USER_MAIL } = require('./env');

checkEmail(USER_MAIL);
```

```js
/*eslint no-hardcoded-values: "error"*/
const { SOME_URL } = require('./env');

const version = fetchData(SOME_URL)
    .then(externalData => getVersion(externalData));

```

## When Not To Use It

If your data is neither sensible nor environment-specific.

## Related Rules

* [id-match](id-match.md)

