# Working with Plugins

Each plugin is an npm module with a name in the format of `eslint-plugin-<plugin-name>`, such as `eslint-plugin-jquery`. You can also use scoped packages in the format of `@<scope>/eslint-plugin-<plugin-name>` such as `@jquery/eslint-plugin-jquery`.

## Create a Plugin

The easiest way to start creating a plugin is to use the [Yeoman generator](https://npmjs.com/package/generator-eslint). The generator will guide you through setting up the skeleton of a plugin.

### Rules in Plugins

Plugins can expose additional rules for use in ESLint. To do so, the plugin must export a `rules` object containing a key-value mapping of rule ID to rule. The rule ID does not have to follow any naming convention (so it can just be `dollar-sign`, for instance).

```js
module.exports = {
    rules: {
        "dollar-sign": {
            create: function (context) {
                // rule implementation ...
            }
        }
    }
};
```

To use the rule in ESLint, you would use the unprefixed plugin name, followed by a slash, followed by the rule name. So if this plugin were named `eslint-plugin-myplugin`, then in your configuration you'd refer to the rule by the name `myplugin/dollar-sign`. Example: `"rules": {"myplugin/dollar-sign": 2}`.

### Environments in Plugins

Plugins can expose additional environments for use in ESLint. To do so, the plugin must export an `environments` object. The keys of the `environments` object are the names of the different environments provided and the values are the environment settings. For example:

```js
module.exports = {
    environments: {
        jquery: {
            globals: {
                $: false
            }
        }
    }
};
```

There's a `jquery` environment defined in this plugin. To use the environment in ESLint, you would use the unprefixed plugin name, followed by a slash, followed by the environment name. So if this plugin were named `eslint-plugin-myplugin`, then you would set the environment in your configuration to be `"myplugin/jquery"`.

Plugin environments can define the following objects:

1. `globals` - acts the same `globals` in a configuration file. The keys are the names of the globals and the values are `true` to allow the global to be overwritten and `false` to disallow.
1. `parserOptions` - acts the same as `parserOptions` in a configuration file.

### Processors in Plugins

You can also create plugins that would tell ESLint how to process files other than JavaScript. In order to create a processor, the object that is exported from your module has to conform to the following interface:

```js
processors: {

    // assign to the file extension you want (.js, .jsx, .html, etc.)
    ".ext": {
        // takes text of the file and filename
        preprocess: function(text, filename) {
            // here, you can strip out any non-JS content
            // and split into multiple strings to lint

            return [string];  // return an array of strings to lint
        },

        // takes a Message[][] and filename
        postprocess: function(messages, filename) {
            // `messages` argument contains two-dimensional array of Message objects
            // where each top-level array item contains array of lint messages related
            // to the text that was returned in array from preprocess() method

            // you need to return a one-dimensional array of the messages you want to keep
            return [Message];
        }
    }
}
```

The `preprocess` method takes the file contents and filename as arguments, and returns an array of strings to lint. The strings will be linted separately but still be registered to the filename. It's up to the plugin to decide if it needs to return just one part, or multiple pieces. For example in the case of processing `.html` files, you might want to return just one item in the array by combining all scripts, but for `.md` file where each JavaScript block might be independent, you can return multiple items.

The `postprocess` method takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input
array corresponds to the part that was returned from the `preprocess` method. The `postprocess` method must adjust the location of all errors and aggregate them into a single flat array and return it.

You can have both rules and processors in a single plugin. You can also have multiple processors in one plugin.
To support multiple extensions, add each one to the `processors` element and point them to the same object.

### Configs in Plugins

You can bundle configurations inside a plugin. This can be useful when you want to provide not just code style, but also some custom rules to support it. You can specify configurations under `configs` key. Please note that when exposing configurations, you have to name each one, and there is no default. So your users will have to specify the name of the configuration they want to use.

```js
configs: {
    myConfig: {
        env: ["browser"],
        rules: {
            semi: 2,
            "myPlugin/my-rule": 2,
            "eslint-plugin-myPlugin/another-rule": 2
        }
    }
}
```

**Note:** Please note that configuration will not automatically attach your rules and you have to specify your plugin name and any rules you want to enable that are part of the plugin. Any plugin rules must be prefixed with the short or long plugin name. See [Configuring Plugins](../user-guide/configuring#configuring-plugins)

### Peer Dependency

To make clear that the plugin requires ESLint to work correctly you have to declare ESLint as a `peerDependency` in your `package.json`.
The plugin support was introduced in ESLint version `0.8.0`. Ensure the `peerDependency` points to ESLint `0.8.0` or later.

```json
{
    "peerDependencies": {
        "eslint": ">=0.8.0"
    }
}
```

### Testing

ESLint provides the [`RuleTester`](/docs/developer-guide/nodejs-api#ruletester) utility to make it easy to test the rules of your plugin.

## Share Plugins

In order to make your plugin available to the community you have to publish it on npm.

Recommended keywords:

* `eslint`
* `eslintplugin`

Add these keywords into your `package.json` file to make it easy for others to find.

## Further Reading

* [npm Developer Guide](https://docs.npmjs.com/misc/developers)

## Working with Custom Parsers

If you want to use your own parser and provide additional capabilities for your rules, you can specify your own custom parser. If a `parseForESLint` method is exposed on the parser, this method will be used to parse the code. Otherwise, the `parse` method will be used. Both methods should take in the the source code as the first argument, and an optional configuration object as the second argument (provided as `parserOptions` in a config file). The `parse` method should simply return the AST. The `parseForESLint` method should return an object that contains the required property `ast` and an optional `services` property. `ast` should contain the AST. The `services` property can contain any parser-dependent services (such as type checkers for nodes). The value of the `services` property is available to rules as `context.parserServices`.

You can find an ESLint parser project [here](https://github.com/eslint/typescript-eslint-parser).

    {

        "parser": './path/to/awesome-custom-parser.js'
    }

```javascript
var espree = require("espree");
// awesome-custom-parser.js
exports.parseForESLint = function(code, options) {
    return {
        ast: espree.parse(code, options),
        services: {
            foo: function() {
                console.log("foo");
            }
        }
    };
};

```

### The AST specification

The AST that custom parsers should create is based on [ESTree](https://github.com/estree/estree). The AST requires some additional properties about detail information of the source code.

#### All nodes:

All nodes must have `range` property.

* `range` (`number[]`) is an array of two numbers. Both numbers are a 0-based index which is the position in the array of source code characters. The first is the start position of the node, the second is the end position of the node. `code.slice(node.range[0], node.range[1])` must be the text of the node. This range does not include spaces/parentheses which are around the node.
* `loc` (`SourceLocation`) must not be `null`. [The `loc` property is defined as nullable by ESTree](https://github.com/estree/estree/blob/25834f7247d44d3156030f8e8a2d07644d771fdb/es5.md#node-objects), but ESLint requires this property. On the other hand, `SourceLocation#source` property can be `undefined`. ESLint does not use the `SourceLocation#source` property.

The `parent` property of all nodes must be rewriteable. ESLint sets each node's parent properties to its parent node while traversing.

#### The `Program` node:

The `Program` node must have `tokens` and `comments` properties. Both properties are an array of the below Token interface.

```ts
interface Token {
    type: string;
    loc: SourceLocation;
    range: [number, number]; // See "All nodes:" section for details of `range` property.
    value: string;
}
```

* `tokens` (`Token[]`) is the array of tokens which affect the behavior of programs. Arbitrary spaces can exist between tokens, so rules check the `Token#range` to detect spaces between tokens. This must be sorted by `Token#range[0]`.
* `comments` (`Token[]`) is the array of comment tokens. This must be sorted by `Token#range[0]`.

The range indexes of all tokens and comments must not overlap with the range of other tokens and comments.

#### The `Literal` node:

The `Literal` node must have `raw` property.

* `raw` (`string`) is the source code of this literal. This is the same as `code.slice(node.range[0], node.range[1])`.
