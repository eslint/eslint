# Disallow process.env (no-process-env)

The `process.env` object in Node.js is used to store deployment/configuration parameters. Littering it through out a project could lead to maintenance issues as it's another kind of global dependency. As such, it could lead to merge conflicts in a multi-user setup and deployment issues in a multi-server setup. Instead, one of the best practices is to define all those parameters in a single configuration/settings file which could be accessed throughout the project.


## Rule Details

This rule is aimed at discouraging use of `process.env` to avoid global dependencies. As such, it will warn whenever `process.env` is used.

Examples of **incorrect** code for this rule:

```js
/*eslint no-process-env: "error"*/

if(process.env.NODE_ENV === "development") {
    //...
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-process-env: "error"*/

var config = require("./config");

if(config.env === "development") {
    //...
}
```

## When Not To Use It

If prefer to use `process.env` throughout your project to retrieve values from environment variables, then you can safely disable this rule.

## Further Reading

* [How to store Node.js deployment settings/configuration files? - Stack Overflow](https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files)
* [Storing Node.js application config data - Ben Hall's blog](https://blog.benhall.me.uk/2012/02/storing-application-config-data-in/)
