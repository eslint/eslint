# Getting Started with ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses [Espree](https://github.com/eslint/espree) for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Getting Started Tutorial

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/hppJw2REb8g?rel=0" frameborder="0" allowfullscreen></iframe>
*Why ESLint* @0:00, *Installing and using ESLint* @2:20.  <a href="https://www.pluralsight.com/courses/eslint-better-code-quality?utm_source=eslint-dot-org&utm_medium=video&utm_campaign=authordemo" target="_blank">Full ESLint Course at Pluralsight</a>

## Installation and Usage

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.14), npm version 3+.

There are two ways to install ESLint: globally and locally.

### Local Installation and Usage

If you want to include ESLint as part of your project's build system, we recommend installing it locally. You can do so using npm:

```
$ npm install eslint --save-dev
```

You should then setup a configuration file:

```
$ ./node_modules/.bin/eslint --init
```

After that, you can run ESLint in your project's root directory like this:

```
$ ./node_modules/.bin/eslint yourfile.js
```

Instead of navigating to `./node_modules/.bin/` you may also use `npx` to run `eslint`:

```
$ npx eslint
```

**Note:** If ESLint wasn't manually installed (via `npm`), `npx` will install `eslint` to a temporary directory and execute it.

Any plugins or shareable configs that you use must also be installed locally to work with a locally-installed ESLint.

### Global Installation and Usage

If you want to make ESLint available to tools that run across all of your projects, we recommend installing ESLint globally. You can do so using npm:

```
$ npm install -g eslint
```

You should then setup a configuration file:

```
$ eslint --init
```

After that, you can run ESLint on any file or directory like this:

```
$ eslint yourfile.js
```

Any plugins or shareable configs that you use must also be installed globally to work with a globally-installed ESLint.

**Note:** `eslint --init` is intended for setting up and configuring ESLint on a per-project basis and will perform a local installation of ESLint and its plugins in the directory in which it is run. If you prefer using a global installation of ESLint, any plugins used in your configuration must also be installed globally.

## Configuration

**Note:** If you are coming from a version before 1.0.0 please see the [migration guide](migrating-to-1.0.0.md).

After running `eslint --init`, you'll have a `.eslintrc` file in your directory. In it, you'll see some rules configured like this:

```json
{
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
}
```

The names `"semi"` and `"quotes"` are the names of [rules](/docs/rules) in ESLint. The first value is the error level of the rule and can be one of these values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the [configuration docs](configuring.md)).

Your `.eslintrc` configuration file will also include the line:

```json
    "extends": "eslint:recommended"
```

Because of this line, all of the rules marked "(recommended)" on the [rules page](/docs/rules) will be turned on.  Alternatively, you can use configurations that others have created by searching for "eslint-config" on [npmjs.com](https://www.npmjs.com/search?q=eslint-config).  ESLint will not lint your code unless you extend from a shared configuration or explicitly turn rules on in your configuration.

---

## Next Steps

* Learn about [advanced configuration](configuring.md) of ESLint.
* Get familiar with the [command line options](command-line-interface.md).
* Explore [ESLint integrations](integrations.md) into other tools like editors, build systems, and more.
* Can't find just the right rule?  Make your own [custom rule](/docs/developer-guide/working-with-rules.md).
* Make ESLint even better by [contributing](/docs/developer-guide/contributing/).
