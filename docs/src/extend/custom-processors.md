---
title: Custom Processors
eleventyNavigation:
    key: custom processors
    parent: extend eslint
    title: Custom Processors
    order: 5

---
You can also create custom processors that tell ESLint how to process files other than JavaScript.

## Custom Processor Specification

In order to create a processor, the object that is exported from your module has to conform to the following interface:

```js
module.exports = {
    processors: {
        "processor-name": {
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

A code block has two properties `text` and `filename`; the `text` property is the content of the block and the `filename` property is the name of the block. Name of the block can be anything, but should include the file extension, that would tell the linter how to process the current block. The linter will check [`--ext` CLI option](../use/command-line-interface#--ext) to see if the current block should be linted, and resolve `overrides` configs to check how to process the current block.

It's up to the plugin to decide if it needs to return just one part, or multiple pieces. For example in the case of processing `.html` files, you might want to return just one item in the array by combining all scripts, but for `.md` file where each JavaScript block might be independent, you can return multiple items.

**The `postprocess` method** takes a two-dimensional array of arrays of lint messages and the filename. Each item in the input array corresponds to the part that was returned from the `preprocess` method. The `postprocess` method must adjust the locations of all errors to correspond to locations in the original, unprocessed code, and aggregate them into a single flat array and return it.

Reported problems have the following location information:

```typescript
{
    line: number,
    column: number,

    endLine?: number,
    endColumn?: number
}
```

By default, ESLint will not perform autofixes when a processor is used, even when the `--fix` flag is enabled on the command line. To allow ESLint to autofix code when using your processor, you should take the following additional steps:

1. Update the `postprocess` method to additionally transform the `fix` property of reported problems. All autofixable problems will have a `fix` property, which is an object with the following schema:

    ```js
    {
        range: [number, number],
        text: string
    }
    ```

    The `range` property contains two indexes in the code, referring to the start and end location of a contiguous section of text that will be replaced. The `text` property refers to the text that will replace the given range.

    In the initial list of problems, the `fix` property will refer to a fix in the processed JavaScript. The `postprocess` method should transform the object to refer to a fix in the original, unprocessed file.

2. Add a `supportsAutofix: true` property to the processor.

You can have both rules and processors in a single plugin. You can also have multiple processors in one plugin.
To support multiple extensions, add each one to the `processors` element and point them to the same object.

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

See [Specifying Processor](../use/configure/plugins#specify-a-processor) for details.

## File Extension-named Processor

If a processor name starts with `.`, ESLint handles the processor as a **file extension-named processor** especially and applies the processor to the kind of files automatically. People don't need to specify the file extension-named processors in their config files.

For example:

```js
module.exports = {
    processors: {
        // This processor will be applied to `*.md` files automatically.
        // Also, people can use this processor as "plugin-id/.md" explicitly.
        ".md": {
            preprocess(text, filename) { /* ... */ },
            postprocess(messageLists, filename) { /* ... */ }
        }
    }
}
```
