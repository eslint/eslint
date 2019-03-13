/**
 * @fileoverview Build file
 * @author nzakas
 */

/* global target */
/* eslint no-use-before-define: "off", no-console: "off" */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

require("shelljs/make");

const lodash = require("lodash"),
    checker = require("npm-license"),
    ReleaseOps = require("eslint-release"),
    dateformat = require("dateformat"),
    fs = require("fs"),
    glob = require("glob"),
    markdownlint = require("markdownlint"),
    os = require("os"),
    path = require("path"),
    semver = require("semver"),
    ejs = require("ejs"),
    loadPerf = require("load-perf"),
    yaml = require("js-yaml"),
    CLIEngine = require("./lib/cli-engine");

const { cat, cd, cp, echo, exec, exit, find, ls, mkdir, pwd, rm, test } = require("shelljs");

//------------------------------------------------------------------------------
// Settings
//------------------------------------------------------------------------------

/*
 * A little bit fuzzy. My computer has a first CPU speed of 3392 and the perf test
 * always completes in < 3800ms. However, Travis is less predictable due to
 * multiple different VM types. So I'm fudging this for now in the hopes that it
 * at least provides some sort of useful signal.
 */
const PERF_MULTIPLIER = 13e6;

const OPEN_SOURCE_LICENSES = [
    /MIT/u, /BSD/u, /Apache/u, /ISC/u, /WTF/u, /Public Domain/u, /LGPL/u
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",
    TEMP_DIR = "./tmp/",
    DEBUG_DIR = "./debug/",
    BUILD_DIR = "build",
    DOCS_DIR = "../eslint.github.io/docs",
    SITE_DIR = "../eslint.github.io/",
    PERF_TMP_DIR = path.join(TEMP_DIR, "eslint", "performance"),

    // Utilities - intentional extra space at the end of each string
    MOCHA = `${NODE_MODULES}mocha/bin/_mocha `,
    ESLINT = `${NODE} bin/eslint.js --report-unused-disable-directives `,

    // Files
    JSON_FILES = find("conf/").filter(fileType("json")),
    MARKDOWN_FILES_ARRAY = find("docs/").concat(ls(".")).filter(fileType("md")),
    TEST_FILES = getTestFilePatterns(),
    PERF_ESLINTRC = path.join(PERF_TMP_DIR, "eslintrc.yml"),
    PERF_MULTIFILES_TARGET_DIR = path.join(PERF_TMP_DIR, "eslint"),
    PERF_MULTIFILES_TARGETS = `"${PERF_MULTIFILES_TARGET_DIR + path.sep}{lib,tests${path.sep}lib}${path.sep}**${path.sep}*.js"`,

    // Settings
    MOCHA_TIMEOUT = 10000;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Generates file patterns for test files
 * @returns {string} test file patterns
 * @private
 */
function getTestFilePatterns() {
    return ls("tests/lib/").filter(pathToCheck => test("-d", `tests/lib/${pathToCheck}`)).reduce((initialValue, currentValues) => {
        if (currentValues !== "rules") {
            initialValue.push(`"tests/lib/${currentValues}/**/*.js"`);
        }
        return initialValue;
    }, ["\"tests/lib/rules/**/*.js\"", "\"tests/lib/*.js\"", "\"tests/bin/**/*.js\"", "\"tests/tools/**/*.js\""]).join(" ");
}

/**
 * Simple JSON file validation that relies on ES JSON parser.
 * @param {string} filePath Path to JSON.
 * @throws Error If file contents is invalid JSON.
 * @returns {undefined}
 */
function validateJsonFile(filePath) {
    const contents = fs.readFileSync(filePath, "utf8");

    JSON.parse(contents);
}

/**
 * Generates a function that matches files with a particular extension.
 * @param {string} extension The file extension (i.e. "js")
 * @returns {Function} The function to pass into a filter method.
 * @private
 */
function fileType(extension) {
    return function(filename) {
        return filename.slice(filename.lastIndexOf(".") + 1) === extension;
    };
}

/**
 * Executes a command and returns the output instead of printing it to stdout.
 * @param {string} cmd The command string to execute.
 * @returns {string} The result of the executed command.
 */
function execSilent(cmd) {
    return exec(cmd, { silent: true }).stdout;
}

/**
 * Generates a release blog post for eslint.org
 * @param {Object} releaseInfo The release metadata.
 * @param {string} [prereleaseMajorVersion] If this is a prerelease, the next major version after this prerelease
 * @returns {void}
 * @private
 */
function generateBlogPost(releaseInfo, prereleaseMajorVersion) {
    const ruleList = ls("lib/rules")

        // Strip the .js extension
        .map(ruleFileName => ruleFileName.replace(/\.js$/u, ""))

        /*
         * Sort by length descending. This ensures that rule names which are substrings of other rule names are not
         * matched incorrectly. For example, the string "no-undefined" should get matched with the `no-undefined` rule,
         * instead of getting matched with the `no-undef` rule followed by the string "ined".
         */
        .sort((ruleA, ruleB) => ruleB.length - ruleA.length);

    const renderContext = Object.assign({ prereleaseMajorVersion, ruleList }, releaseInfo);

    const output = ejs.render(cat("./templates/blogpost.md.ejs"), renderContext),
        now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        filename = `../eslint.github.io/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;

    output.to(filename);
}

/**
 * Generates a doc page with formatter result examples
 * @param  {Object} formatterInfo Linting results from each formatter
 * @param  {string} [prereleaseVersion] The version used for a prerelease. This
 *      changes where the output is stored.
 * @returns {void}
 */
function generateFormatterExamples(formatterInfo, prereleaseVersion) {
    const output = ejs.render(cat("./templates/formatter-examples.md.ejs"), formatterInfo);
    let filename = "../eslint.github.io/docs/user-guide/formatters/index.md",
        htmlFilename = "../eslint.github.io/docs/user-guide/formatters/html-formatter-example.html";

    if (prereleaseVersion) {
        filename = filename.replace("/docs", `/docs/${prereleaseVersion}`);
        htmlFilename = htmlFilename.replace("/docs", `/docs/${prereleaseVersion}`);
        if (!test("-d", path.dirname(filename))) {
            mkdir(path.dirname(filename));
        }
    }

    output.to(filename);
    formatterInfo.formatterResults.html.result.to(htmlFilename);
}

/**
 * Generate a doc page that lists all of the rules and links to them
 * @param {string} basedir The directory in which to look for code.
 * @returns {void}
 */
function generateRuleIndexPage(basedir) {
    const outputFile = "../eslint.github.io/_data/rules.yml",
        categoryList = "conf/category-list.json",
        categoriesData = JSON.parse(cat(path.resolve(categoryList)));

    find(path.join(basedir, "/lib/rules/")).filter(fileType("js"))
        .map(filename => [filename, path.basename(filename, ".js")])
        .sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(pair => {
            const filename = pair[0];
            const basename = pair[1];
            const rule = require(filename);

            if (rule.meta.deprecated) {
                categoriesData.deprecated.rules.push({
                    name: basename,
                    replacedBy: rule.meta.replacedBy || []
                });
            } else {
                const output = {
                        name: basename,
                        description: rule.meta.docs.description,
                        recommended: rule.meta.docs.recommended || false,
                        fixable: !!rule.meta.fixable
                    },
                    category = lodash.find(categoriesData.categories, { name: rule.meta.docs.category });

                if (!category.rules) {
                    category.rules = [];
                }

                category.rules.push(output);
            }
        });

    const output = yaml.safeDump(categoriesData, { sortKeys: true });

    output.to(outputFile);
}

/**
 * Creates a git commit and tag in an adjacent `eslint.github.io` repository, without pushing it to
 * the remote. This assumes that the repository has already been modified somehow (e.g. by adding a blogpost).
 * @param {string} [tag] The string to tag the commit with
 * @returns {void}
 */
function commitSiteToGit(tag) {
    const currentDir = pwd();

    cd(SITE_DIR);
    exec("git add -A .");
    exec(`git commit -m "Autogenerated new docs and demo at ${dateformat(new Date())}"`);

    if (tag) {
        exec(`git tag ${tag}`);
    }

    exec("git fetch origin && git rebase origin/master");
    cd(currentDir);
}

/**
 * Publishes the changes in an adjacent `eslint.github.io` repository to the remote. The
 * site should already have local commits (e.g. from running `commitSiteToGit`).
 * @returns {void}
 */
function publishSite() {
    const currentDir = pwd();

    cd(SITE_DIR);
    exec("git push origin master --tags");
    cd(currentDir);
}

/**
 * Updates the changelog, bumps the version number in package.json, creates a local git commit and tag,
 * and generates the site in an adjacent `eslint.github.io` folder.
 * @returns {void}
 */
function generateRelease() {
    ReleaseOps.generateRelease();
    const releaseInfo = JSON.parse(cat(".eslint-release-info.json"));

    echo("Generating site");
    target.gensite();
    generateBlogPost(releaseInfo);
    commitSiteToGit(`v${releaseInfo.version}`);
}

/**
 * Updates the changelog, bumps the version number in package.json, creates a local git commit and tag,
 * and generates the site in an adjacent `eslint.github.io` folder.
 * @param {string} prereleaseId The prerelease identifier (alpha, beta, etc.)
 * @returns {void}
 */
function generatePrerelease(prereleaseId) {
    ReleaseOps.generateRelease(prereleaseId);
    const releaseInfo = JSON.parse(cat(".eslint-release-info.json"));
    const nextMajor = semver.inc(releaseInfo.version, "major");

    echo("Generating site");

    // always write docs into the next major directory (so 2.0.0-alpha.0 writes to 2.0.0)
    target.gensite(nextMajor);

    /*
     * Premajor release should have identical "next major version".
     * Preminor and prepatch release will not.
     * 5.0.0-alpha.0 --> next major = 5, current major = 5
     * 4.4.0-alpha.0 --> next major = 5, current major = 4
     * 4.0.1-alpha.0 --> next major = 5, current major = 4
     */
    if (semver.major(releaseInfo.version) === semver.major(nextMajor)) {

        /*
         * This prerelease is for a major release (not preminor/prepatch).
         * Blog post generation logic needs to be aware of this (as well as
         * know what the next major version is actually supposed to be).
         */
        generateBlogPost(releaseInfo, nextMajor);
    } else {
        generateBlogPost(releaseInfo);
    }

    commitSiteToGit(`v${releaseInfo.version}`);
}

/**
 * Publishes a generated release to npm and GitHub, and pushes changes to the adjacent `eslint.github.io` repo
 * to remote repo.
 * @returns {void}
 */
function publishRelease() {
    ReleaseOps.publishRelease();
    publishSite();
}

/**
 * Splits a command result to separate lines.
 * @param {string} result The command result string.
 * @returns {Array} The separated lines.
 */
function splitCommandResultToLines(result) {
    return result.trim().split("\n");
}

/**
 * Gets the first commit sha of the given file.
 * @param {string} filePath The file path which should be checked.
 * @returns {string} The commit sha.
 */
function getFirstCommitOfFile(filePath) {
    let commits = execSilent(`git rev-list HEAD -- ${filePath}`);

    commits = splitCommandResultToLines(commits);
    return commits[commits.length - 1].trim();
}

/**
 * Gets the tag name where a given file was introduced first.
 * @param {string} filePath The file path to check.
 * @returns {string} The tag name.
 */
function getFirstVersionOfFile(filePath) {
    const firstCommit = getFirstCommitOfFile(filePath);
    let tags = execSilent(`git tag --contains ${firstCommit}`);

    tags = splitCommandResultToLines(tags);
    return tags.reduce((list, version) => {
        const validatedVersion = semver.valid(version.trim());

        if (validatedVersion) {
            list.push(validatedVersion);
        }
        return list;
    }, []).sort(semver.compare)[0];
}

/**
 * Gets the commit that deleted a file.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The commit sha.
 */
function getCommitDeletingFile(filePath) {
    const commits = execSilent(`git rev-list HEAD -- ${filePath}`);

    return splitCommandResultToLines(commits)[0];
}

/**
 * Gets the first version number where a given file is no longer present.
 * @param {string} filePath The path to the deleted file.
 * @returns {string} The version number.
 */
function getFirstVersionOfDeletion(filePath) {
    const deletionCommit = getCommitDeletingFile(filePath),
        tags = execSilent(`git tag --contains ${deletionCommit}`);

    return splitCommandResultToLines(tags)
        .map(version => semver.valid(version.trim()))
        .filter(version => version)
        .sort(semver.compare)[0];
}

/**
 * Lints Markdown files.
 * @param {Array} files Array of file names to lint.
 * @returns {Object} exec-style exit code object.
 * @private
 */
function lintMarkdown(files) {
    const config = {
            default: true,

            // Exclusions for deliberate/widespread violations
            MD001: false, // Header levels should only increment by one level at a time
            MD002: false, // First header should be a h1 header
            MD007: { // Unordered list indentation
                indent: 4
            },
            MD012: false, // Multiple consecutive blank lines
            MD013: false, // Line length
            MD014: false, // Dollar signs used before commands without showing output
            MD019: false, // Multiple spaces after hash on atx style header
            MD021: false, // Multiple spaces inside hashes on closed atx style header
            MD024: false, // Multiple headers with the same content
            MD026: false, // Trailing punctuation in header
            MD029: false, // Ordered list item prefix
            MD030: false, // Spaces after list markers
            MD033: false, // Allow inline HTML
            MD034: false, // Bare URL used
            MD040: false, // Fenced code blocks should have a language specified
            MD041: false // First line in file should be a top level header
        },
        result = markdownlint.sync({
            files,
            config,
            resultVersion: 1
        }),
        resultString = result.toString(),
        returnCode = resultString ? 1 : 0;

    if (resultString) {
        console.error(resultString);
    }
    return { code: returnCode };
}

/**
 * Gets linting results from every formatter, based on a hard-coded snippet and config
 * @returns {Object} Output from each formatter
 */
function getFormatterResults() {
    const stripAnsi = require("strip-ansi");

    const formatterFiles = fs.readdirSync("./lib/formatters/"),
        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: { extends: "eslint:recommended" },
            rules: {
                "no-else-return": 1,
                indent: [1, 4],
                "space-unary-ops": 2,
                semi: [1, "always"],
                "consistent-return": 2
            }
        }),
        codeString = [
            "function addOne(i) {",
            "    if (i != NaN) {",
            "        return i ++",
            "    } else {",
            "      return",
            "    }",
            "};"
        ].join("\n"),
        rawMessages = cli.executeOnText(codeString, "fullOfProblems.js", true);

    return formatterFiles.reduce((data, filename) => {
        const fileExt = path.extname(filename),
            name = path.basename(filename, fileExt);

        if (fileExt === ".js") {
            data.formatterResults[name] = {
                result: stripAnsi(cli.getFormatter(name)(rawMessages.results))
            };
        }
        return data;
    }, { formatterResults: {} });
}

/**
 * Gets a path to an executable in node_modules/.bin
 * @param {string} command The executable name
 * @returns {string} The executable path
 */
function getBinFile(command) {
    return path.join("node_modules", ".bin", command);
}

//------------------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------------------

target.all = function() {
    target.test();
};

target.lint = function() {
    let errors = 0,
        lastReturn;

    echo("Validating JavaScript files");
    lastReturn = exec(`${ESLINT} .`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JSON Files");
    lodash.forEach(JSON_FILES, validateJsonFile);

    echo("Validating Markdown Files");
    lastReturn = lintMarkdown(MARKDOWN_FILES_ARRAY);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.fuzz = function({ amount = process.env.CI ? 1000 : 300, fuzzBrokenAutofixes = true } = {}) {
    const fuzzerRunner = require("./tools/fuzzer-runner");
    const fuzzResults = fuzzerRunner.run({ amount, fuzzBrokenAutofixes });

    if (fuzzResults.length) {

        const uniqueStackTraceCount = new Set(fuzzResults.map(result => result.error)).size;

        echo(`The fuzzer reported ${fuzzResults.length} error${fuzzResults.length === 1 ? "" : "s"} with a total of ${uniqueStackTraceCount} unique stack trace${uniqueStackTraceCount === 1 ? "" : "s"}.`);

        const formattedResults = JSON.stringify({ results: fuzzResults }, null, 4);

        if (process.env.CI) {
            echo("More details can be found below.");
            echo(formattedResults);
        } else {
            if (!test("-d", DEBUG_DIR)) {
                mkdir(DEBUG_DIR);
            }

            let fuzzLogPath;
            let fileSuffix = 0;

            // To avoid overwriting any existing fuzzer log files, append a numeric suffix to the end of the filename.
            do {
                fuzzLogPath = path.join(DEBUG_DIR, `fuzzer-log-${fileSuffix}.json`);
                fileSuffix++;
            } while (test("-f", fuzzLogPath));

            formattedResults.to(fuzzLogPath);

            // TODO: (not-an-aardvark) Create a better way to isolate and test individual fuzzer errors from the log file
            echo(`More details can be found in ${fuzzLogPath}.`);
        }

        exit(1);
    }
};

target.test = function() {
    target.lint();
    target.checkRuleFiles();
    let errors = 0,
        lastReturn;

    echo("Running unit tests");

    lastReturn = exec(`${getBinFile("istanbul")} cover ${MOCHA} -- -R progress -t ${MOCHA_TIMEOUT} -c ${TEST_FILES}`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    lastReturn = exec(`${getBinFile("istanbul")} check-coverage --statement 99 --branch 98 --function 99 --lines 99`);

    if (lastReturn.code !== 0) {
        errors++;
    }

    target.webpack();

    const browserFileLintOutput = new CLIEngine({
        useEslintrc: false,
        ignore: false,
        allowInlineConfig: false,
        baseConfig: { parserOptions: { ecmaVersion: 5 } }
    }).executeOnFiles([`${BUILD_DIR}/eslint.js`]);

    if (browserFileLintOutput.errorCount > 0) {
        echo(`error: Failed to lint ${BUILD_DIR}/eslint.js as ES5 code`);
        echo(CLIEngine.getFormatter("stylish")(browserFileLintOutput.results));
        errors++;
    }

    lastReturn = exec(`${getBinFile("karma")} start karma.conf.js`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }

    target.fuzz({ amount: 150, fuzzBrokenAutofixes: false });

    target.checkLicenses();
};

target.docs = function() {
    echo("Generating documentation");
    exec(`${getBinFile("jsdoc")} -d jsdoc lib`);
    echo("Documentation has been output to /jsdoc");
};

target.gensite = function(prereleaseVersion) {
    echo("Generating eslint.org");

    let docFiles = [
        "/rules/",
        "/user-guide/",
        "/maintainer-guide/",
        "/developer-guide/",
        "/about/"
    ];

    // append version
    if (prereleaseVersion) {
        docFiles = docFiles.map(docFile => `/${prereleaseVersion}${docFile}`);
    }

    // 1. create temp and build directory
    echo("> Creating a temporary directory (Step 1)");
    if (!test("-d", TEMP_DIR)) {
        mkdir(TEMP_DIR);
    }

    // 2. remove old files from the site
    echo("> Removing old files (Step 2)");
    docFiles.forEach(filePath => {
        const fullPath = path.join(DOCS_DIR, filePath),
            htmlFullPath = fullPath.replace(".md", ".html");

        if (test("-f", fullPath)) {

            rm("-rf", fullPath);

            if (filePath.indexOf(".md") >= 0 && test("-f", htmlFullPath)) {
                rm("-rf", htmlFullPath);
            }
        }
    });

    // 3. Copy docs folder to a temporary directory
    echo("> Copying the docs folder (Step 3)");
    cp("-rf", "docs/*", TEMP_DIR);

    let versions = test("-f", "./versions.json") ? JSON.parse(cat("./versions.json")) : {};

    if (!versions.added) {
        versions = {
            added: versions,
            removed: {}
        };
    }

    const rules = require(".").linter.getRules();

    const RECOMMENDED_TEXT = "\n\n(recommended) The `\"extends\": \"eslint:recommended\"` property in a configuration file enables this rule.";
    const FIXABLE_TEXT = "\n\n(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.";

    // 4. Loop through all files in temporary directory
    process.stdout.write("> Updating files (Steps 4-9): 0/... - ...\r");
    const tempFiles = find(TEMP_DIR);
    const length = tempFiles.length;

    tempFiles.forEach((filename, i) => {
        if (test("-f", filename) && path.extname(filename) === ".md") {

            const rulesUrl = "https://github.com/eslint/eslint/tree/master/lib/rules/",
                docsUrl = "https://github.com/eslint/eslint/tree/master/docs/rules/",
                baseName = path.basename(filename),
                sourceBaseName = `${path.basename(filename, ".md")}.js`,
                sourcePath = path.join("lib/rules", sourceBaseName),
                ruleName = path.basename(filename, ".md"),
                filePath = path.join("docs", path.relative("tmp", filename));
            let text = cat(filename),
                ruleType = "",
                title;

            process.stdout.write(`> Updating files (Steps 4-9): ${i}/${length} - ${filePath + " ".repeat(30)}\r`);

            // 5. Prepend page title and layout variables at the top of rules
            if (path.dirname(filename).indexOf("rules") >= 0) {

                // Find out if the rule requires a special docs portion (e.g. if it is recommended and/or fixable)
                const rule = rules.get(ruleName);
                const isRecommended = rule && rule.meta.docs.recommended;
                const isFixable = rule && rule.meta.fixable;

                // Incorporate the special portion into the documentation content
                const textSplit = text.split("\n");
                const ruleHeading = textSplit[0];
                const ruleDocsContent = textSplit.slice(1).join("\n");

                text = `${ruleHeading}${isRecommended ? RECOMMENDED_TEXT : ""}${isFixable ? FIXABLE_TEXT : ""}\n${ruleDocsContent}`;
                title = `${ruleName} - Rules`;

                if (rule && rule.meta) {
                    ruleType = `rule_type: ${rule.meta.type}`;
                }
            } else {

                // extract the title from the file itself
                title = text.match(/#([^#].+)\n/u);
                if (title) {
                    title = title[1].trim();
                } else {
                    title = "Documentation";
                }
            }

            text = [
                "---",
                `title: ${title}`,
                "layout: doc",
                `edit_link: https://github.com/eslint/eslint/edit/master/${filePath}`,
                ruleType,
                "---",
                "<!-- Note: No pull requests accepted for this file. See README.md in the root directory for details. -->",
                "",
                text
            ].join("\n");

            // 6. Remove .md extension for relative links and change README to empty string
            text = text.replace(/\((?!https?:\/\/)([^)]*?)\.md(.*?)\)/gu, "($1$2)").replace("README.html", "");

            // 7. Check if there's a trailing white line at the end of the file, if there isn't one, add it
            if (!/\n$/u.test(text)) {
                text = `${text}\n`;
            }

            // 8. Append first version of ESLint rule was added at.
            if (filename.indexOf("rules/") !== -1) {
                if (!versions.added[baseName]) {
                    versions.added[baseName] = getFirstVersionOfFile(sourcePath);
                }
                const added = versions.added[baseName];

                if (!versions.removed[baseName] && !test("-f", sourcePath)) {
                    versions.removed[baseName] = getFirstVersionOfDeletion(sourcePath);
                }
                const removed = versions.removed[baseName];

                text += "\n## Version\n\n";
                text += removed
                    ? `This rule was introduced in ESLint ${added} and removed in ${removed}.\n`
                    : `This rule was introduced in ESLint ${added}.\n`;

                text += "\n## Resources\n\n";
                if (!removed) {
                    text += `* [Rule source](${rulesUrl}${sourceBaseName})\n`;
                }
                text += `* [Documentation source](${docsUrl}${baseName})\n`;
            }

            // 9. Update content of the file with changes
            text.to(filename.replace("README.md", "index.md"));
        }
    });
    JSON.stringify(versions).to("./versions.json");
    echo(`> Updating files (Steps 4-9)${" ".repeat(50)}`);

    // 10. Copy temporary directory to site's docs folder
    echo("> Copying the temporary directory the site (Step 10)");
    let outputDir = DOCS_DIR;

    if (prereleaseVersion) {
        outputDir += `/${prereleaseVersion}`;
        if (!test("-d", outputDir)) {
            mkdir(outputDir);
        }
    }
    cp("-rf", `${TEMP_DIR}*`, outputDir);

    // 11. Generate rule listing page
    echo("> Generating the rule listing (Step 11)");
    generateRuleIndexPage(process.cwd());

    // 12. Delete temporary directory
    echo("> Removing the temporary directory (Step 12)");
    rm("-rf", TEMP_DIR);

    // 13. Update demos, but only for non-prereleases
    if (!prereleaseVersion) {
        echo("> Updating the demos (Step 13)");
        target.webpack("production");
        cp("-f", "build/eslint.js", `${SITE_DIR}js/app/eslint.js`);
        cp("-f", "build/espree.js", `${SITE_DIR}js/app/espree.js`);
    } else {
        echo("> Skipped updating the demos (Step 13)");
    }

    // 14. Create Example Formatter Output Page
    echo("> Creating the formatter examples (Step 14)");
    generateFormatterExamples(getFormatterResults(), prereleaseVersion);

    echo("Done generating eslint.org");
};

target.webpack = function(mode = "none") {
    exec(`${getBinFile("webpack")} --mode=${mode} --output-path=${BUILD_DIR}`);
};

target.checkRuleFiles = function() {

    echo("Validating rules");

    const ruleTypes = require("./tools/rule-types.json");
    const ruleFiles = find("lib/rules/").filter(fileType("js"));
    let errors = 0;

    ruleFiles.forEach(filename => {
        const basename = path.basename(filename, ".js");
        const docFilename = `docs/rules/${basename}.md`;

        /**
         * Check if basename is present in rule-types.json file.
         * @returns {boolean} true if present
         * @private
         */
        function isInRuleTypes() {
            return Object.prototype.hasOwnProperty.call(ruleTypes, basename);
        }

        /**
         * Check if id is present in title
         * @param {string} id id to check for
         * @returns {boolean} true if present
         * @private
         */
        function hasIdInTitle(id) {
            const docText = cat(docFilename);
            const idOldAtEndOfTitleRegExp = new RegExp(`^# (.*?) \\(${id}\\)`, "u"); // original format
            const idNewAtBeginningOfTitleRegExp = new RegExp(`^# ${id}: `, "u"); // new format is same as rules index
            /*
             * 1. Added support for new format.
             * 2. Will remove support for old format after all docs files have new format.
             * 3. Will remove this check when the main heading is automatically generated from rule metadata.
             */

            return idNewAtBeginningOfTitleRegExp.test(docText) || idOldAtEndOfTitleRegExp.test(docText);
        }

        // check for docs
        if (!test("-f", docFilename)) {
            console.error("Missing documentation for rule %s", basename);
            errors++;
        } else {

            // check for proper doc format
            if (!hasIdInTitle(basename)) {
                console.error("Missing id in the doc page's title of rule %s", basename);
                errors++;
            }
        }

        // check for recommended configuration
        if (!isInRuleTypes()) {
            console.error("Missing setting for %s in tools/rule-types.json", basename);
            errors++;
        }

        // check parity between rules index file and rules directory
        const builtInRulesIndexPath = "./lib/built-in-rules-index";
        const ruleIdsInIndex = require(builtInRulesIndexPath);
        const ruleEntryFromIndexIsMissing = !(basename in ruleIdsInIndex);

        if (ruleEntryFromIndexIsMissing) {
            console.error(`Missing rule from index (${builtInRulesIndexPath}.js): ${basename}. If you just added a ` +
                "new rule then add an entry for it in this file.");
            errors++;
        }

        // check for tests
        if (!test("-f", `tests/lib/rules/${basename}.js`)) {
            console.error("Missing tests for rule %s", basename);
            errors++;
        }

    });

    if (errors) {
        exit(1);
    }

};

target.checkLicenses = function() {

    /**
     * Check if a dependency is eligible to be used by us
     * @param {Object} dependency dependency to check
     * @returns {boolean} true if we have permission
     * @private
     */
    function isPermissible(dependency) {
        const licenses = dependency.licenses;

        if (Array.isArray(licenses)) {
            return licenses.some(license => isPermissible({
                name: dependency.name,
                licenses: license
            }));
        }

        return OPEN_SOURCE_LICENSES.some(license => license.test(licenses));
    }

    echo("Validating licenses");

    checker.init({
        start: __dirname
    }, deps => {
        const impermissible = Object.keys(deps).map(dependency => ({
            name: dependency,
            licenses: deps[dependency].licenses
        })).filter(dependency => !isPermissible(dependency));

        if (impermissible.length) {
            impermissible.forEach(dependency => {
                console.error(
                    "%s license for %s is impermissible.",
                    dependency.licenses,
                    dependency.name
                );
            });
            exit(1);
        }
    });
};

/**
 * Downloads a repository which has many js files to test performance with multi files.
 * Here, it's eslint@1.10.3 (450 files)
 * @param {Function} cb - A callback function.
 * @returns {void}
 */
function downloadMultifilesTestTarget(cb) {
    if (test("-d", PERF_MULTIFILES_TARGET_DIR)) {
        process.nextTick(cb);
    } else {
        mkdir("-p", PERF_MULTIFILES_TARGET_DIR);
        echo("Downloading the repository of multi-files performance test target.");
        exec(`git clone -b v1.10.3 --depth 1 https://github.com/eslint/eslint.git "${PERF_MULTIFILES_TARGET_DIR}"`, { silent: true }, cb);
    }
}

/**
 * Creates a config file to use performance tests.
 * This config is turning all core rules on.
 * @returns {void}
 */
function createConfigForPerformanceTest() {
    const content = [
        "root: true",
        "env:",
        "    node: true",
        "    es6: true",
        "rules:"
    ];

    content.push(...ls("lib/rules").map(fileName => `    ${path.basename(fileName, ".js")}: 1`));

    content.join("\n").to(PERF_ESLINTRC);
}

/**
 * Calculates the time for each run for performance
 * @param {string} cmd cmd
 * @param {int} runs Total number of runs to do
 * @param {int} runNumber Current run number
 * @param {int[]} results Collection results from each run
 * @param {Function} cb Function to call when everything is done
 * @returns {int[]} calls the cb with all the results
 * @private
 */
function time(cmd, runs, runNumber, results, cb) {
    const start = process.hrtime();

    exec(cmd, { silent: true }, (code, stdout, stderr) => {
        const diff = process.hrtime(start),
            actual = (diff[0] * 1e3 + diff[1] / 1e6); // ms

        if (code) {
            echo(`  Performance Run #${runNumber} failed.`);
            if (stdout) {
                echo(`STDOUT:\n${stdout}\n\n`);
            }

            if (stderr) {
                echo(`STDERR:\n${stderr}\n\n`);
            }
            return cb(null);
        }

        results.push(actual);
        echo(`  Performance Run #${runNumber}:  %dms`, actual);
        if (runs > 1) {
            return time(cmd, runs - 1, runNumber + 1, results, cb);
        }
        return cb(results);

    });

}

/**
 * Run a performance test.
 *
 * @param {string} title - A title.
 * @param {string} targets - Test targets.
 * @param {number} multiplier - A multiplier for limitation.
 * @param {Function} cb - A callback function.
 * @returns {void}
 */
function runPerformanceTest(title, targets, multiplier, cb) {
    const cpuSpeed = os.cpus()[0].speed,
        max = multiplier / cpuSpeed,
        cmd = `${ESLINT}--config "${PERF_ESLINTRC}" --no-eslintrc --no-ignore ${targets}`;

    echo("");
    echo(title);
    echo("  CPU Speed is %d with multiplier %d", cpuSpeed, multiplier);

    time(cmd, 5, 1, [], results => {
        if (!results || results.length === 0) { // No results? Something is wrong.
            throw new Error("Performance test failed.");
        }

        results.sort((a, b) => a - b);

        const median = results[~~(results.length / 2)];

        echo("");
        if (median > max) {
            echo("  Performance budget exceeded: %dms (limit: %dms)", median, max);
        } else {
            echo("  Performance budget ok:  %dms (limit: %dms)", median, max);
        }
        echo("");
        cb();
    });
}

/**
 * Run the load performance for eslint
 * @returns {void}
 * @private
 */
function loadPerformance() {
    echo("");
    echo("Loading:");

    const results = [];

    for (let cnt = 0; cnt < 5; cnt++) {
        const loadPerfData = loadPerf({
            checkDependencies: false
        });

        echo(`  Load performance Run #${cnt + 1}:  %dms`, loadPerfData.loadTime);
        results.push(loadPerfData.loadTime);
    }

    results.sort((a, b) => a - b);
    const median = results[~~(results.length / 2)];

    echo("");
    echo("  Load Performance median:  %dms", median);
    echo("");
}

target.perf = function() {
    downloadMultifilesTestTarget(() => {
        createConfigForPerformanceTest();

        loadPerformance();

        runPerformanceTest(
            "Single File:",
            "tests/performance/jshint.js",
            PERF_MULTIPLIER,
            () => {

                // Count test target files.
                const count = glob.sync(
                    process.platform === "win32"
                        ? PERF_MULTIFILES_TARGETS.slice(2).replace("\\", "/")
                        : PERF_MULTIFILES_TARGETS
                ).length;

                runPerformanceTest(
                    `Multi Files (${count} files):`,
                    PERF_MULTIFILES_TARGETS,
                    3 * PERF_MULTIPLIER,
                    () => {}
                );
            }
        );
    });
};

target.generateRelease = generateRelease;
target.generatePrerelease = ([prereleaseType]) => generatePrerelease(prereleaseType);
target.publishRelease = publishRelease;
