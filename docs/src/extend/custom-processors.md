---
title: Custom Processors
eleventyNavigation:
    key: custom processors
    parent: create plugins
    title: Custom Processors
    order: 3

---

You can also create custom processors that tell ESLint how to process files other than standard JavaScript. For example, you could write a custom processor to extract and process JavaScript from Markdown files ([eslint-plugin-markdown](https://www.npmjs.com/package/eslint-plugin-markdown) includes a custom processor for this).

## Custom Processor Specification

In order to create a custom processor, the object exported from your module has to conform to the following interface:

```js
module.exports = {
    processors: {
        "processor-name": {
            meta: {
                name: "eslint-processor-name",
                version: "1.2.3"
            },
            // takes text of the file and filename
            preprocess: function(text, filename) {
                // here, you can strip out any non-JS content
                // and split into multiple strings to lint

                return [ // return an array of code blocks to lint
                    { text: code1, filename: "0.js" },
                    { text: code2, filename: "1.js" },
                ];
            },

            // takes a Message[][] and filename
            postprocess: function(messages, filename) {
                // `messages` argument contains two-dimensional array of Message objects
                // where each top-level array item contains array of lint messages related
                // to the text that was returned in array from preprocess() method

                // you need to return a one-dimensional array of the messages you want to keep
                return [].concat(...messages);
            },

            supportsAutofix: true // (optional, defaults to false)
        }
    }
};
```

**The `preprocess` method** takes the file contents and filename as arguments, and returns an array of code blocks to lint. The code blocks will be linted separately but still be registered to the filename.

A code block has two properties `text` and `filename`. The `text` property is the content of the block and the `filename` property is the name of the block. The name of the block can be anything, but should include the file extension, which tells the linter how to process the current block. The linter checks the [`--ext` CLI option](../use/command-line-interface#--ext) to see if the current block should be linted and resolves `overrides` configs to check how to process the current block.

It's up to the plugin to decide if it needs to return just one part of the non-JavaScript file or multiple pieces. For example in the case of processing `.html` files, you might want to return just one item in the array by combining all scripts. However, for `.md` files, you can return multiple items because each JavaScript block might be independent.

**The `postprocess` method** takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input array corresponds to the part that was returned from the `preprocess` method. The `postprocess` method must adjust the locations of all errors to correspond to locations in the original, unprocessed code, and aggregate them into a single flat array and return it.

Reported problems have the following location information in each lint message:

```typescript
type LintMessage = {

  /// The 1-based line number where the message occurs.
  line?: number;

   /// The 1-based column number where the message occurs.
  column?: number;

  /// The 1-based line number of the end location.
  endLine?: number;

  /// The 1-based column number of the end location.
  endColumn?: number;

  /// If `true`, this is a fatal error.
  fatal?: boolean;

  /// Information for an autofix.
  fix: Fix;

  /// The error message.
  message: string;

  /// The ID of the rule which generated the message, or `null` if not applicable.
  ruleId: string | null;

  /// The severity of the message.
  severity: 0 | 1 | 2;

  /// Information for suggestions.
  suggestions?: Suggestion[];
};

type Fix = {
    range: [number, number];
    text: string;
}

type Suggestion = {
    desc?: string;
    messageId?: string;
    fix: Fix;
}

```

By default, ESLint does not perform autofixes when a custom processor is used, even when the `--fix` flag is enabled on the command line. To allow ESLint to autofix code when using your processor, you should take the following additional steps:

1. Update the `postprocess` method to additionally transform the `fix` property of reported problems. All autofixable problems have a `fix` property, which is an object with the following schema:

    ```typescript
    {
        range: [number, number],
        text: string
    }
    ```

    The `range` property contains two indexes in the code, referring to the start and end location of a contiguous section of text that will be replaced. The `text` property refers to the text that will replace the given range.

    In the initial list of problems, the `fix` property will refer to a fix in the processed JavaScript. The `postprocess` method should transform the object to refer to a fix in the original, unprocessed file.

2. Add a `supportsAutofix: true` property to the processor.

You can have both rules and custom processors in a single plugin. You can also have multiple processors in one plugin. To support multiple extensions, add each one to the `processors` element and point them to the same object.

**The `meta` object** helps ESLint cache the processor and provide more friendly debug message. The `meta.name` property should match the processor name and the `meta.version` property should match the npm package version for your processors. The easiest way to accomplish this is by reading this information from your `package.json`.

## Specifying Processor in Config Files

To use a processor, add its ID to a `processor` section in the config file. Processor ID is a concatenated string of plugin name and processor name with a slash as a separator. This can also be added to a `overrides` section of the config, to specify which processors should handle which files.

For example:

```yml
plugins:
  - a-plugin
overrides:
  - files: "*.md"
    processor: a-plugin/markdown
```

See [Specify a Processor](../use/configure/plugins#specify-a-processor) in the Plugin Configuration documentation for more details.

## File Extension-named Processor

::: warning
This feature is deprecated and only works in eslintrc-style configuration files. Flat config files do not automatically apply processors; you need to explicitly set the `processor` property.
:::

If a custom processor name starts with `.`, ESLint handles the processor as a **file extension-named processor**. ESLint applies the processor to files with that filename extension automatically. Users don't need to specify the file extension-named processors in their config files.

For example:

```js
module.exports = {
    processors: {
        // This processor will be applied to `*.md` files automatically.
        // Also, you can use this processor as "plugin-id/.md" explicitly.
        ".md": {
            preprocess(text, filename) { /* ... */ },
            postprocess(messageLists, filename) { /* ... */ }
        }
        // This processor will not be applied to any files automatically.
        // To use this processor, you must explicitly specify it
        // in your configuration as "plugin-id/markdown".
       "markdown": {
            preprocess(text, filename) { /* ... */ },
            postprocess(messageLists, filename) { /* ... */ }
        }
    }
}
```

You can also use the same custom processor with multiple filename extensions. The following example shows using the same processor for both `.md` and `.mdx` files:

```js
const myCustomProcessor = { /* processor methods */ };

module.exports = {
    // The same custom processor is applied to both
    // `.md` and `.mdx` files.
    processors: {
        ".md": myCustomProcessor,
        ".mdx": myCustomProcessor
    }
}
```
