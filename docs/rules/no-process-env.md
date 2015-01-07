# Disallow process.env (no-process-env)

The `process.env` object in Node.js is used to store deployment/configuration parameters. Littering it through out a project could lead to maintenance issues as it's another kind of global dependency. As such, it could lead to merge conflicts in a multi-user setup and deployment issues in a multi-server setup. Instead, one of the best practices is to define all those parameters in a single configuration/settings file which could be accessed throughout the project.


## Rule Details

This rule is aimed at discouraging use of `process.env` to avoid global dependencies. As such, it will warn whenever `process.env` is used.

The following patterns are considered warnings:

```js
if(process.env.NODE_ENV === "development") {
    //...
}
```

The following patterns are considered okay and do not cause warnings:

```js
var config = require("./config");

if(config.env === "development") {
    //...
}
```

## When Not To Use It

It should be not used in your configuration/settings file where `process.env` is used to assign values to parameters to be accessed throughout the project.


## Further Reading

* [How to store Node.js deployment settings/configuration files? - Stack Overflow](http://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files)
* [Storing Node.js application config data - Ben Hall's blog](http://blog.benhall.me.uk/2012/02/storing-application-config-data-in/)
