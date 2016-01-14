# Blacklist certain identifiers to prevent them being used (id-blacklist)

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

Bad names can lead to hard to decipher code. Using generic names, such as `data` don't infer much about the code and the values it receives. This rule allows you to configure a blacklist of bad identifier names, that you don't want to see in your code.

## Rule Details

This rule compares assignments and function definitions to a provided list of identifier names. If the identifier is present in the list, it will return an error.

This rule will catch blacklisted identifiers that are:

- variable declarations
- function declarations
- object properties

It will not catch blacklisted identifiers that are:

- function calls (so you can still use functions you do not have control over)
- object properties (so you can still use objects you do not have control over)


### Options

This rule needs a a set of identifier names to blacklist, like so:

```json
{
    "rules": {
        "id-blacklist": [2, "data", "err", "e", "cb", "callback"]
    }
}
```

For the rule in this example, the following patterns are considered problems:

```js
/*eslint id-blacklist: [2, "data", "err", "e", "cb", "callback"] */

var data = {...};                  /*error Identifier 'data' is blacklisted*/

function callback() {              /*error Identifier 'callback' is blacklisted*/
    // ...
}

element.callback = function() {    /*error Identifier 'callback' is blacklisted*/
    // ...
};

var itemSet = {
    data: [...]                    /*error Identifier 'data' is blacklisted*/
};
```

The following patterns are not considered problems:

```js
/*eslint id-blacklist: [2, "data", "err", "e", "cb", "callback"] */

var encodingOptions = {...};

function processFileResult() {
    // ...
}

element.successHandler = function() {
    // ...
};

var itemSet = {
    entities: [...]
};

callback()  // all function calls are ignored

foo.callback() // all function calls are ignored

foo.data // all property names that are not assignments are ignored
```

## When Not To Use It

You can turn this rule off if you are happy for identifiers to be named freely.
