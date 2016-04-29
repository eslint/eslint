# Getting Started with ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs. In many ways, it is similar to JSLint and JSHint with a few exceptions:

* ESLint uses [Espree](https://github.com/eslint/espree) for JavaScript parsing.
* ESLint uses an AST to evaluate patterns in code.
* ESLint is completely pluggable, every single rule is a plugin and you can add more at runtime.

## Installation

You can install ESLint using npm:

    npm install -g eslint

## Usage

If it's your first time using ESLint, you should set up a config file using `--init`:

    eslint --init

After that, you can run ESLint on any JavaScript file:

    eslint test.js test2.js

**Note:** `eslint --init` is intended for setting up and configuring ESLint on a per-project basis and will perform a local installation of ESLint and its plugins in the directory in which it is run. If you prefer using a global installation of ESLint, any plugins used in your configuration must also be installed globally.

## Configuration

**Note:** If you are coming from a version before 1.0.0 please see the [migration guide](http://eslint.org/docs/user-guide/migrating-to-1.0.0).

After running `eslint --init`, you'll have a `.eslintrc.*` file in your directory. In it, you'll see some rules configured like this:

```json
{
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    }
}
```

The names `"semi"` and `"quotes"` are the names of [rules](http://eslint.org/docs/rules) in ESLint. The number is the error level of the rule and can be one of the following values:

* `"off"` or `0` - turn the rule off
* `"warn"` or `1` - turn the rule on as a warning (doesn't affect exit code)
* `"error"` or `2` - turn the rule on as an error (exit code will be 1)

The three error levels allow you fine-grained control over how ESLint applies rules (for more configuration options and details, see the [configuration docs](http://eslint.org/docs/user-guide/configuring)).

Your `.eslintrc` configuration file will also include the line:

```json
    "extends": "eslint:recommended"
```

Because of this this line, all of the rules marked "(recommended)" on the [rules page](http://eslint.org/docs/rules) will be turned on.  Alternatively, you can use configurations that others have created by searching for "eslint-config" on [npmjs.com](https://www.npmjs.com/search?q=eslint-config).  ESLint will not lint your code unless you extend from a shared configuration or explicitly turn rules on in your configuration.

---

## Next Steps

* Learn about [advanced configuration](http://eslint.org/docs/user-guide/configuring) of ESLint.
* Get familiar with the [command line options](/docs/user-guide/command-line-interface).
* Explore [ESLint integrations](http://eslint.org/docs/user-guide/integrations) into other tools like editors, build systems, and more.
* Can't find just the right rule?  Make your own [custom rule](http://eslint.org/docs/developer-guide/working-with-rules).
* Make ESLint even better by [contributing](http://eslint.org/docs/developer-guide/contributing).
