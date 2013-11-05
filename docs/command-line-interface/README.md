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
  -h, --help    Show help.
  -c, --config  Load configuration data from this file.
  --rulesdir    Load additional rules from this directory.
  -f, --format  Use a specific output format.               [default: "compact"]
  -v, --version  Outputs the version number.
```

### `-h`, `--help`

This option outputs the help menu, displaying all of the available options. All other flags are ignored when this is present.

### `-c`, `--config`

This option allows you to specify an alternate [configuration file](config-files.md) for ESLint. By default, it uses `conf/eslint.json`.

Example:

    eslint -c ~/my-eslint.json file.js

This example uses the configuration file at `~/my-eslint.json` instead of the default.

### `-f`, `--format`

This options specifies the output format for the console. At the moment, there is only `compact`, but more will be added soon.

Example:

    eslint -f compact file.js

When specified, the given format is output to the console. If you'd like to save that output into a file, you can do so on the command line like so:

    eslint -f compact file.js > results.txt

This saves the output into the `results.txt` file.

### `--rulesdir`

This option allows you to specify a second directory from which to load rules files. This allows you to dynamically loading new rules at run time. This is useful when you have custom rules that aren't suitable for being bundled with ESLint.

Example:

    eslint --rulesdir my-rules/ file.js

The rules in your custom rules directory must following the same format as bundled rules to work properly.

### `-v`, `--version`

This option outputs the current ESLint version onto the console. All other options are ignored when present.

Example:

    eslint -v
