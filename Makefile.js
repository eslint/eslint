/**
 * @fileoverview Build file
 * @author nzakas
 */

/* eslint no-use-before-define: "off", no-console: "off" -- CLI */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const checker = require("npm-license"),
    ReleaseOps = require("eslint-release"),
    dateformat = require("dateformat"),
    fs = require("fs"),
    glob = require("glob"),
    marked = require("marked"),
    markdownlint = require("markdownlint"),
    os = require("os"),
    path = require("path"),
    semver = require("semver"),
    ejs = require("ejs"),
    loadPerf = require("load-perf"),
    yaml = require("js-yaml"),
    { CLIEngine } = require("./lib/cli-engine"),
    builtinRules = require("./lib/rules/index");

require("shelljs/make");
/* global target -- global.target is declared in `shelljs/make.js` */
/**
 * global.target = {};
 * @see https://github.com/shelljs/shelljs/blob/124d3349af42cb794ae8f78fc9b0b538109f7ca7/make.js#L4
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3aa2d09b6408380598cfb802743b07e1edb725f3/types/shelljs/make.d.ts#L8-L11
 */
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
    /MIT/u, /BSD/u, /Apache/u, /ISC/u, /WTF/u, /Public Domain/u, /LGPL/u, /Python/u
];

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const NODE = "node ", // intentional extra space
    NODE_MODULES = "./node_modules/",
    TEMP_DIR = "./tmp/",
    DEBUG_DIR = "./debug/",
    BUILD_DIR = "build",
    DOCS_DIR = "../website/docs",
    SITE_DIR = "../website/",
    PERF_TMP_DIR = path.join(TEMP_DIR, "eslint", "performance"),

    // Utilities - intentional extra space at the end of each string
    MOCHA = `${NODE_MODULES}mocha/bin/_mocha `,
    ESLINT = `${NODE} bin/eslint.js --report-unused-disable-directives `,

    // Files
    RULE_FILES = glob.sync("lib/rules/*.js").filter(filePath => path.basename(filePath) !== "index.js"),
    JSON_FILES = find("conf/").filter(fileType("json")),
    MARKDOWNLINT_IGNORED_FILES = fs.readFileSync(path.join(__dirname, ".markdownlintignore"), "utf-8").split("\n"),
    MARKDOWN_FILES_ARRAY = find("docs/").concat(ls(".")).filter(fileType("md")).filter(file => !MARKDOWNLINT_IGNORED_FILES.includes(file)),
    TEST_FILES = "\"tests/{bin,conf,lib,tools}/**/*.js\"",
    PERF_ESLINTRC = path.join(PERF_TMP_DIR, "eslintrc.yml"),
    PERF_MULTIFILES_TARGET_DIR = path.join(PERF_TMP_DIR, "eslint"),
    PERF_MULTIFILES_TARGETS = `"${PERF_MULTIFILES_TARGET_DIR + path.sep}{lib,tests${path.sep}lib}${path.sep}**${path.sep}*.js"`,

    // Settings
    MOCHA_TIMEOUT = parseInt(process.env.ESLINT_MOCHA_TIMEOUT, 10) || 10000;

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

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
    const ruleList = RULE_FILES

        // Strip the .js extension
        .map(ruleFileName => path.basename(ruleFileName, ".js"))

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
        filename = `../website/_posts/${now.getFullYear()}-${
            month < 10 ? `0${month}` : month}-${
            day < 10 ? `0${day}` : day}-eslint-v${
            releaseInfo.version}-released.md`;

    output.to(filename);
}

/**
 * Generates a doc page with formatter result examples
 * @param {Object} formatterInfo Linting results from each formatter
 * @param {string} [prereleaseVersion] The version used for a prerelease. This
 *      changes where the output is stored.
 * @returns {void}
 */
function generateFormatterExamples(formatterInfo, prereleaseVersion) {
    const output = ejs.render(cat("./templates/formatter-examples.md.ejs"), formatterInfo);
    let filename = "../website/docs/user-guide/formatters/index.md",
        htmlFilename = "../website/docs/user-guide/formatters/html-formatter-example.html";

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
 * @returns {void}
 */
function generateRuleIndexPage() {
    const outputFile = "../website/_data/rules.yml",
        ruleTypes = "conf/rule-type-list.json",
        ruleTypesData = JSON.parse(cat(path.resolve(ruleTypes)));

    RULE_FILES
        .map(filename => [filename, path.basename(filename, ".js")])
        .sort((a, b) => a[1].localeCompare(b[1]))
        .forEach(pair => {
            const filename = pair[0];
            const basename = pair[1];
            const rule = require(path.resolve(filename));

            if (rule.meta.deprecated) {
                ruleTypesData.deprecated.rules.push({
                    name: basename,
                    replacedBy: rule.meta.replacedBy || []
                });
            } else {
                const output = {
                        name: basename,
                        description: rule.meta.docs.description,
                        recommended: rule.meta.docs.recommended || false,
                        fixable: !!rule.meta.fixable,
                        hasSuggestions: !!rule.meta.hasSuggestions
                    },
                    ruleType = ruleTypesData.types.find(c => c.name === rule.meta.type);

                if (!ruleType.rules) {
                    ruleType.rules = [];
                }

                ruleType.rules.push(output);
            }
        });

    // `.rules` will be `undefined` if all rules in category are deprecated.
    ruleTypesData.types = ruleTypesData.types.filter(ruleType => !!ruleType.rules);

    const output = yaml.dump(ruleTypesData, { sortKeys: true });

    output.to(outputFile);
}

/**
 * Creates a git commit and tag in an adjacent `website` repository, without pushing it to
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
 * Publishes the changes in an adjacent `website` repository to the remote. The
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
 * and generates the site in an adjacent `website` folder.
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
 * and generates the site in an adjacent `website` folder.
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
 * Publishes a generated release to npm and GitHub, and pushes changes to the adjacent `website` repo
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
    const config = yaml.load(fs.readFileSync(path.join(__dirname, "./.markdownlint.yml"), "utf8")),
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

    const formatterFiles = fs.readdirSync("./lib/cli-engine/formatters/"),
        rules = {
            "no-else-return": "warn",
            indent: ["warn", 4],
            "space-unary-ops": "error",
            semi: ["warn", "always"],
            "consistent-return": "error"
        },
        cli = new CLIEngine({
            useEslintrc: false,
            baseConfig: { extends: "eslint:recommended" },
            rules
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
        rawMessages = cli.executeOnText(codeString, "fullOfProblems.js", true),
        rulesMap = cli.getRules(),
        rulesMeta = {};

    Object.keys(rules).forEach(ruleId => {
        rulesMeta[ruleId] = rulesMap.get(ruleId).meta;
    });

    return formatterFiles.reduce((data, filename) => {
        const fileExt = path.extname(filename),
            name = path.basename(filename, fileExt);

        if (fileExt === ".js") {
            const formattedOutput = cli.getFormatter(name)(
                rawMessages.results,
                { rulesMeta }
            );

            data.formatterResults[name] = {
                result: stripAnsi(formattedOutput)
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

target.lint = function([fix = false] = []) {
    let errors = 0,
        lastReturn;

    echo("Validating JavaScript files");
    lastReturn = exec(`${ESLINT}${fix ? "--fix" : ""} .`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    echo("Validating JSON Files");
    JSON_FILES.forEach(validateJsonFile);

    echo("Validating Markdown Files");
    lastReturn = lintMarkdown(MARKDOWN_FILES_ARRAY);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.fuzz = function({ amount = 1000, fuzzBrokenAutofixes = false } = {}) {
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

target.mocha = () => {
    let errors = 0,
        lastReturn;

    echo("Running unit tests");

    lastReturn = exec(`${getBinFile("nyc")} -- ${MOCHA} --forbid-only -R progress -t ${MOCHA_TIMEOUT} -c ${TEST_FILES}`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    lastReturn = exec(`${getBinFile("nyc")} check-coverage --statement 98 --branch 97 --function 98 --lines 98`);
    if (lastReturn.code !== 0) {
        errors++;
    }

    if (errors) {
        exit(1);
    }
};

target.karma = () => {
    echo("Running unit tests on browsers");

    target.webpack("production");

    const lastReturn = exec(`${getBinFile("karma")} start karma.conf.js`);

    if (lastReturn.code !== 0) {
        exit(1);
    }
};

target.test = function() {
    target.lint();
    target.checkRuleFiles();
    target.mocha();
    target.karma();
    target.fuzz({ amount: 150, fuzzBrokenAutofixes: false });
    target.checkLicenses();
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

            if (filePath.includes(".md") && test("-f", htmlFullPath)) {
                rm("-rf", htmlFullPath);
            }
        }
    });

    // 3. Copy docs folder to a temporary directory
    echo("> Copying the docs folder (Step 3)");
    docFiles.forEach(filePath => {
        const pathToCopy = path.join("docs/src", filePath, "*"),
            tempPath = path.join(TEMP_DIR, filePath);

        if (!test("-d", tempPath)) {
            mkdir(tempPath);
        }

        cp("-rf", pathToCopy, tempPath);
    });

    // special case (for now)
    rm("-rf", path.join(TEMP_DIR, "pages"));

    let versions = test("-f", "./versions.json") ? JSON.parse(cat("./versions.json")) : {};

    if (!versions.added) {
        versions = {
            added: versions,
            removed: {}
        };
    }

    const { Linter } = require(".");
    const rules = new Linter().getRules();

    const RECOMMENDED_TEXT = "\n\n(recommended) The `\"extends\": \"eslint:recommended\"` property in a configuration file enables this rule.";
    const FIXABLE_TEXT = "\n\n(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.";
    const HAS_SUGGESTIONS_TEXT = "\n\n(hasSuggestions) Some problems reported by this rule are manually fixable by editor [suggestions](../developer-guide/working-with-rules#providing-suggestions).";

    // 4. Loop through all files in temporary directory
    process.stdout.write("> Updating files (Steps 4-9): 0/... - ...\r");
    const tempFiles = find(TEMP_DIR);
    const length = tempFiles.length;

    tempFiles.forEach((filename, i) => {
        if (test("-f", filename) && path.extname(filename) === ".md") {

            const rulesUrl = "https://github.com/eslint/eslint/tree/HEAD/lib/rules/",
                testsUrl = "https://github.com/eslint/eslint/tree/HEAD/tests/lib/rules/",
                docsUrl = "https://github.com/eslint/eslint/tree/HEAD/docs/src/rules/",
                baseName = path.basename(filename),
                sourceBaseName = `${path.basename(filename, ".md")}.js`,
                sourcePath = path.join("lib/rules", sourceBaseName),
                ruleName = path.basename(filename, ".md"),
                filePath = path.posix.join("docs", path.relative("tmp", filename));
            let text = cat(filename);

            process.stdout.write(`> Updating files (Steps 4-9): ${i}/${length} - ${filePath + " ".repeat(30)}\r`);

            // 5. Prepend page title and layout variables at the top of rules
            if (path.dirname(filename).includes("rules")) {

                // Find out if the rule requires a special docs portion (e.g. if it is recommended and/or fixable)
                const rule = rules.get(ruleName);
                const isRecommended = rule && rule.meta.docs.recommended;
                const isFixable = rule && rule.meta.fixable;
                const hasSuggestions = rule && rule.meta.hasSuggestions;

                text = text.replace("<!--FIXABLE-->", isFixable ? FIXABLE_TEXT : "")
                    .replace("<!--SUGGESTIONS-->", hasSuggestions ? HAS_SUGGESTIONS_TEXT : "")
                    .replace("<!--RECOMMENDED-->", isRecommended ? RECOMMENDED_TEXT : "");

            }

            // 6. Remove .md extension for relative links and change README to empty string
            text = text.replace(/\((?!https?:\/\/)([^)]*?)\.md(.*?)\)/gu, "($1$2)").replace("README.html", "");

            // 7. Check if there's a trailing white line at the end of the file, if there isn't one, add it
            if (!/\n$/u.test(text)) {
                text = `${text}\n`;
            }

            // 8. Append first version of ESLint rule was added at.
            if (filename.includes("rules/")) {
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
                    text += `* [Test source](${testsUrl}${sourceBaseName})\n`;
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
    echo("> Copying the temporary directory into the site's docs folder (Step 10)");
    let outputDir = DOCS_DIR;

    if (prereleaseVersion) {
        outputDir += `/${prereleaseVersion}`;
        if (!test("-d", outputDir)) {
            mkdir(outputDir);
        }
    }
    cp("-rf", `${TEMP_DIR}*`, outputDir);

    // 11. Generate rules index page
    if (prereleaseVersion) {
        echo("> Skipping generating rules index page because this is a prerelease (Step 11)");
    } else {
        echo("> Generating the rules index page (Step 11)");
        generateRuleIndexPage();
    }

    // 12. Delete temporary directory
    echo("> Removing the temporary directory (Step 12)");
    rm("-rf", TEMP_DIR);

    // 13. Create Example Formatter Output Page
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
    let errors = 0;

    RULE_FILES.forEach(filename => {
        const basename = path.basename(filename, ".js");
        const docFilename = `docs/src/rules/${basename}.md`;
        const docText = cat(docFilename);
        const docMarkdown = marked.lexer(docText, { gfm: true, silent: false });
        const ruleCode = cat(filename);
        const knownHeaders = ["Rule Details", "Options", "Environments", "Examples", "Known Limitations", "When Not To Use It", "Compatibility"];

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
         * @todo Will remove this check when the main heading is automatically generated from rule metadata.
         */
        function hasIdInTitle(id) {
            return new RegExp(`title: ${id}`, "u").test(docText);
        }

        /**
         * Check if all H2 headers are known and in the expected order
         * Only H2 headers are checked as H1 and H3 are variable and/or rule specific.
         * @returns {boolean} true if all headers are known and in the right order
         */
        function hasKnownHeaders() {
            const headers = docMarkdown.filter(token => token.type === "heading" && token.depth === 2).map(header => header.text);

            for (const header of headers) {
                if (!knownHeaders.includes(header)) {
                    return false;
                }
            }

            /*
             * Check only the subset of used headers for the correct order
             */
            const presentHeaders = knownHeaders.filter(header => headers.includes(header));

            for (let i = 0; i < presentHeaders.length; ++i) {
                if (presentHeaders[i] !== headers[i]) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Check if deprecated information is in rule code and README.md.
         * @returns {boolean} true if present
         * @private
         */
        function hasDeprecatedInfo() {
            const deprecatedTagRegExp = /@deprecated in ESLint/u;
            const deprecatedInfoRegExp = /This rule was .+deprecated.+in ESLint/u;

            return deprecatedTagRegExp.test(ruleCode) && deprecatedInfoRegExp.test(docText);
        }

        /**
         * Check if the rule code has the jsdoc comment with the rule type annotation.
         * @returns {boolean} true if present
         * @private
         */
        function hasRuleTypeJSDocComment() {
            const comment = "/** @type {import('../shared/types').Rule} */";

            return ruleCode.includes(comment);
        }

        // check for docs
        if (!test("-f", docFilename)) {
            console.error("Missing documentation for rule %s", basename);
            errors++;
        } else {

            // check for proper doc h1 format
            if (!hasIdInTitle(basename)) {
                console.error("Missing id in the doc page's title of rule %s", basename);
                errors++;
            }

            // check for proper doc headers
            if (!hasKnownHeaders()) {
                console.error("Unknown or misplaced header in the doc page of rule %s, allowed headers (and their order) are: '%s'", basename, knownHeaders.join("', '"));
                errors++;
            }
        }

        // check for recommended configuration
        if (!isInRuleTypes()) {
            console.error("Missing setting for %s in tools/rule-types.json", basename);
            errors++;
        }

        // check parity between rules index file and rules directory
        const ruleIdsInIndex = require("./lib/rules/index");
        const ruleDef = ruleIdsInIndex.get(basename);

        if (!ruleDef) {
            console.error(`Missing rule from index (./lib/rules/index.js): ${basename}. If you just added a new rule then add an entry for it in this file.`);
            errors++;
        } else {

            // check deprecated
            if (ruleDef.meta.deprecated && !hasDeprecatedInfo()) {
                console.error(`Missing deprecated information in ${basename} rule code or README.md. Please write @deprecated tag in code or 「This rule was deprecated in ESLint ...」 in README.md.`);
                errors++;
            }

            // check eslint:recommended
            const recommended = require("./conf/eslint-recommended");

            if (ruleDef.meta.docs.recommended) {
                if (recommended.rules[basename] !== "error") {
                    console.error(`Missing rule from eslint:recommended (./conf/eslint-recommended.js): ${basename}. If you just made a rule recommended then add an entry for it in this file.`);
                    errors++;
                }
            } else {
                if (basename in recommended.rules) {
                    console.error(`Extra rule in eslint:recommended (./conf/eslint-recommended.js): ${basename}. If you just added a rule then don't add an entry for it in this file.`);
                    errors++;
                }
            }

            if (!hasRuleTypeJSDocComment()) {
                console.error(`Missing rule type JSDoc comment from ${basename} rule code.`);
                errors++;
            }
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
 * @param {Function} cb A callback function.
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

    for (const [ruleId] of builtinRules) {
        content.push(`    ${ruleId}: 1`);
    }

    content.join("\n").to(PERF_ESLINTRC);
}

/**
 * @callback TimeCallback
 * @param {?int[]} results
 * @returns {void}
 */

/**
 * Calculates the time for each run for performance
 * @param {string} cmd cmd
 * @param {int} runs Total number of runs to do
 * @param {int} runNumber Current run number
 * @param {int[]} results Collection results from each run
 * @param {TimeCallback} cb Function to call when everything is done
 * @returns {void} calls the cb with all the results
 * @private
 */
function time(cmd, runs, runNumber, results, cb) {
    const start = process.hrtime();

    exec(cmd, { maxBuffer: 64 * 1024 * 1024, silent: true }, (code, stdout, stderr) => {
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
 * @param {string} title A title.
 * @param {string} targets Test targets.
 * @param {number} multiplier A multiplier for limitation.
 * @param {Function} cb A callback function.
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
                    (
                        process.platform === "win32"
                            ? PERF_MULTIFILES_TARGETS.replace(/\\/gu, "/")
                            : PERF_MULTIFILES_TARGETS
                    )
                        .slice(1, -1) // strip quotes
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
