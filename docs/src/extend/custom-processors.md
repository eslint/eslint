---
title: Custom Processors
eleventyNavigation:
    key: custom processors
    parent: create plugins
    title: Custom Processors
    order: 3
---

You can also create custom processors that tell ESLint how to process files other than standard JavaScript. For example, you could write a custom processor to extract and process JavaScript from Markdown files ([@eslint/markdown](https://www.npmjs.com/package/@eslint/markdown) includes a custom processor for this).

::: tip
This page explains how to create a custom processor for use with the flat config format.
:::

## Custom Processor Specification

In order to create a custom processor, the object exported from your module has to conform to the following interface:

```js
const plugin = {
	meta: {
		name: "eslint-plugin-example",
		version: "1.2.3",
	},
	processors: {
		"processor-name": {
			meta: {
				name: "eslint-processor-name",
				version: "1.2.3",
			},
			// takes text of the file and filename
			preprocess(text, filename) {
				// here, you can strip out any non-JS content
				// and split into multiple strings to lint

				return [
					// return an array of code blocks to lint
					{ text: code1, filename: "0.js" },
					{ text: code2, filename: "1.js" },
				];
			},

			// takes a Message[][] and filename
			postprocess(messages, filename) {
				// `messages` argument contains two-dimensional array of Message objects
				// where each top-level array item contains array of lint messages related
				// to the text that was returned in array from preprocess() method

				// you need to return a one-dimensional array of the messages you want to keep
				return [].concat(...messages);
			},

			supportsAutofix: true, // (optional, defaults to false)
		},
	},
};

// for ESM
export default plugin;

// OR for CommonJS
module.exports = plugin;
```

**The `preprocess` method** takes the file contents and filename as arguments, and returns an array of code blocks to lint. The code blocks will be linted separately but still be registered to the filename.

A code block has two properties `text` and `filename`. The `text` property is the content of the block and the `filename` property is the name of the block. The name of the block can be anything, but should include the file extension, which tells ESLint how to process the current block. ESLint checks matching `files` entries in the project's config to determine if the code blocks should be linted.

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
};

type Suggestion = {
	desc?: string;
	messageId?: string;
	fix: Fix;
};
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

### How `meta` Objects are Used

The `meta` object helps ESLint cache configurations that use a processor and to provide more friendly debug messages.

#### Plugin `meta` Object

The [plugin `meta` object](plugins#meta-data-in-plugins) provides information about the plugin itself. When a processor is specified using the string format `plugin-name/processor-name`, ESLint automatically uses the plugin `meta` to generate a name for the processor. This is the most common case for processors.

Example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"], // apply processor to text files
		plugins: {
			example,
		},
		processor: "example/processor-name",
	},
	// ... other configs
]);
```

In this example, the processor name is `"example/processor-name"`, and that's the value that will be used for serializing configurations.

#### Processor `meta` Object

Each processor can also specify its own `meta` object. This information is used when the processor object is passed directly to `processor` in a configuration. In that case, ESLint doesn't know which plugin the processor belongs to. The `meta.name` property should match the processor name and the `meta.version` property should match the npm package version for your processors. The easiest way to accomplish this is by reading this information from your `package.json`.

Example:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"],
		processor: example.processors["processor-name"],
	},
	// ... other configs
]);
```

In this example, specifying `example.processors["processor-name"]` directly uses the processor's own `meta` object, which must be defined to ensure proper handling when the processor is not referenced through the plugin name.

#### Why Both Meta Objects are Needed

It is recommended that both the plugin and each processor provide their respective meta objects. This ensures that features relying on meta objects, such as `--print-config` and `--cache`, work correctly regardless of how the processor is specified in the configuration.

## Specify Processor in Config Files

In order to use a processor from a plugin in a configuration file, import the plugin and include it in the `plugins` key, specifying a namespace. Then, use that namespace to reference the processor in the `processor` configuration, like this:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import example from "eslint-plugin-example";

export default defineConfig([
	{
		files: ["**/*.txt"],
		plugins: {
			example,
		},
		processor: "example/processor-name",
	},
]);
```

See [Specify a Processor](../use/configure/plugins#specify-a-processor) in the Plugin Configuration documentation for more details.
