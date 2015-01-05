# Command line Interface

To run ESLint on Node.js, you must have npm installed. If npm is not installed, follow the instructions here: http://npmjs.org/

Once npm is installed, run the following

    npm i -g eslint

This installs the ESLint CLI from the npm repository. To run ESLint, use the following format:

    eslint [options] [file|dir]*

Such as:

    eslint file1.js file2.js

## Options

The command line utility has several options. You can view the options by running `eslint -h`.

```
eslint [options] file.js [file.js] [dir]

Options:
  -h, --help                  Show help
  -c, --config path::String   Use configuration from this file
  --rulesdir [path::String]   Use additional rules from this directory
  -f, --format String         Use a specific output format - default: stylish
  -v, --version               Outputs the version number
  --reset                     Set all default rules to off - default: false
  --no-eslintrc               Disable use of configuration from .eslintrc
  --env [String]              Specify environments
  --ext [String]              Specify JavaScript file extensions - default: .js
  --plugin [String]           Specify plugins
  --global [String]           Define global variables
  --rule Object               Specify rules
  --ignore-path path::String  Specify path of ignore file
  --no-ignore                 Disable use of .eslintignore
  --no-color                  Disable color in piped output
  -o, --output-file path::String  Specify file to write report to
  --quiet                     Report errors only - default: false
  --stdin                     Lint code provided on <STDIN> - default: false
```

### `-c`, `--config`

This option allows you to specify an alternate configuration file for ESLint (see [Configuring ESLint](../configuring) for more). By default, ESLint uses its own configuration file located at `conf/eslint.json`.

Example:

    eslint -c ~/my-eslint.json file.js

This example uses the configuration file at `~/my-eslint.json` instead of the default.

### `--env`

This option enables specific environments. Details about the global variables defined by each environment are available on the [configuration](../configuring) documentation. This flag only enables environments; it does not disable environments set in other configuration files. To specify multiple environments, separate them using commas, or use the flag multiple times.

Examples:

    eslint --env browser,node file.js
    eslint --env browser --env node file.js

### `--ext`

This option allows you to specify which file extensions ESLint will use when searching for JavaScript files. By default, it uses `.js` as the only file extension.

Examples:

    # Use only .js2 extension
    eslint --ext .js2

    # Use both .js and .js2
    eslint --ext .js --ext .js2

    # Also use both .js and .js2
    eslint --ext .js,.js2

### `-f`, `--format`

This option specifies the output format for the console. Possible formats are "stylish" (the default), "compact", "checkstyle", "jslint-xml", "junit" and "tap".

Example:

    eslint -f compact file.js

You can also use a custom formatter from the command line by specifying a path to the custom formatter file.

Example:

    eslint -f customformat.js file.js

When specified, the given format is output to the console. If you'd like to save that output into a file, you can do so on the command line like so:

    eslint -f compact file.js > results.txt

This saves the output into the `results.txt` file.

### `--global`

This option defines global variables so that they will not be flagged as undefined by the `no-undef` rule. Global variables are read-only by default, but appending `:true` to a variable's name makes it writable. To define multiple variables, separate them using commas, or use the flag multiple times.

Examples:

    eslint --global require,exports:true file.js
    eslint --global require --global exports:true

### `-h`, `--help`

This option outputs the help menu, displaying all of the available options. All other flags are ignored when this is present.

### `--ignore-path`

This option allows you to specify the file to use as your `.eslintignore`. By default, ESLint looks in the current working directory for `.eslintignore`. You can override this behavior by providing a path to a different file.

Example:

    eslint --ignore-path tmp/.eslintignore file.js

### `--no-color`

Disable color in piped output.

Example:

    eslint --no-color file.js

### `--no-eslintrc`

Disables use of configuration from `.eslintrc` and `package.json` files.

Example:

    eslint --no-eslintrc file.js

### `--no-ignore`

Disable use of configuration from `.eslintrc` and `package.json` files.

Example:

    eslint --no-ignore file.js

### `-o`, `--output-file`

Enable report to be written to a file.

Example:

    eslint -o ./test/test.html

When specified, the given format is output into the provided file name.

### `--plugin`

This option specifies a plugin to load. You can omit the prefix `eslint-plugin-` from the plugin name.
Before using the plugin you have to install it using npm.

Examples:

    eslint --plugin jquery file.js
    eslint --plugin eslint-plugin-mocha file.js

### `--quiet`

This option allows you to disable reporting on warnings. If you enable this option only errors are reported by ESLint.

Example:

    eslint --quiet file.js

### `--reset`

This option turns off all rules enabled in ESLint's default configuration file located at `conf/eslint.json`. ESLint will still report syntax errors.

Example:

    eslint --reset file.js

### `--rule`

This option specifies rules to be used. They will be merged into any previously defined rules. To start fresh, simply combine with the `--reset` flag. To define multiple rules, separate them using commas, or use the flag multiple times. The [levn](https://github.com/gkz/levn#levn--) format is used for specifying the rules.
If the rule is defined within a plugin you have to prefix the rule ID with the plugin name and a `/`.

Examples:

    eslint --rule 'quotes: [2, double]'
    eslint --rule 'guard-for-in: 2' --rule 'brace-style: [2, 1tbs]'
    eslint --rule 'jquery/dollar-sign: 2'

### `--rulesdir`

This option allows you to specify a second directory from which to load rules files. This allows you to dynamically loading new rules at run time. This is useful when you have custom rules that aren't suitable for being bundled with ESLint.

Example:

    eslint --rulesdir my-rules/ file.js

The rules in your custom rules directory must follow the same format as bundled rules to work properly. You can also specify multiple locations for custom rules by including multiple `--rulesdir` flags:

    eslint --rulesdir my-rules/ --rulesdir my-other-rules/ file.js

### `--stdin`

This option tells ESLint to read and lint source code from STDIN instead files. You can use this to pipe code to ESLint.

Example

    cat myfile.js | eslint --stdin

### `-v`, `--version`

This option outputs the current ESLint version onto the console. All other options are ignored when present.

Example:

    eslint -v

## Ignoring files from linting

ESLint supports `.eslintignore` files to exclude files from the linting process when ESLint operates on a directory. Files given as individual CLI arguments will be exempt from exclusion. The `.eslintignore` file is a plain text file containing one pattern per line. It can be located in any of the target directory's ancestors; it will affect files in its containing directory as well as all sub-directories. Here's a simple example of a `.eslintignore` file:

```text
node_modules/*
**/vendor/*.js
```
