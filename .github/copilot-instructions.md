# ESLint Project Knowledge

## Project Structure

- The ESLint project is organized into several directories:
    - `bin`: Contains the command-line interface (CLI) files
    - `conf`: Contains configuration data for ESLint
    - `docs`: Contains the documentation website for ESLint
    - `lib`: Contains the main source code for ESLint
    - `messages`: Contains verbose error messages for certain errors in ESLint
    - `packages`: Contains additional packages that are published separately
        - `eslint-config-eslint`: Contains the ESLint configuration package
        - `js`: Contains the `@eslint/js` package
    - `templates`: Contains templates tools that generate files
    - `tests`: Contains the test files for ESLint
    - `tools`: Contains scripts for building, testing, and other tasks
- Test files mirror the structure of the source code files they're testing
- Configuration files are in the root directory, including `eslint.config.js`.

## Source File Conventions

- Source files follow a standard structure:
    - Header with `@fileoverview` and `@author`
    - Requirements section with necessary imports
    - Optionally a type definitions section for importing types
    - Optionally a helpers section with utility functions and constants
    - Optionally an exports section where the file has its classes, functions, and constants to export
    - For tools and scripts, a main section that executes code

## Testing Conventions

- Tests use Mocha for the testing framework
- Chai is used for assertions with `const assert = require("chai").assert`
- Test files follow a standard structure:
    - Header with `@fileoverview` and `@author`
    - Requirements section with necessary imports
    - Optionally a helpers section with utility functions and constants
    - Tests section with describe/it blocks
- Tests are organized in describe blocks for classes and methods
- Before running tests, objects like mock contexts/configs are set up
- Testing patterns include:
    - Verifying object properties are set correctly
    - Testing for expected behaviors and edge cases
    - Validating error handling scenarios
    - Testing deprecated methods for backward compatibility
- All new exported functions and public class members require writing new tests
- All bug fixes must have corresponding tests
- Never delete existing tests even if they are failing
- `npm test` command runs all tests in the `tests` directory
- `npx mocha <filename>` command runs a specific test file

## Rules

- Rules are located in the `lib/rules` directory
- Documentation for rules is located in the `docs/src/rules` directory
- Each rule module exports an object with the following structure:
    - `meta`: Contains metadata about the rule, including:
        - `type`: The type of rule (e.g., "suggestion", "problem", "layout")
        - `docs`: Documentation properties including description, recommended status, and URL
        - `schema`: JSON Schema for rule configuration options
        - `fixable`: Whether the rule provides auto-fixes (e.g., "code", "whitespace")
        - `messages`: Message IDs and text templates for reporting
    - `create`: A function that accepts a context object and returns an object with AST visitor methods

## Rule Implementation Patterns

- Rules use the visitor pattern to analyze JavaScript AST nodes
- Helper functions should be defined outside the `create` function to avoid recreating them on each execution
- Common utilities for working with ASTs are available in `./utils/ast-utils`
- Rules that need to fix code should implement a fixer function that returns corrections to apply
- Rules should avoid duplicate computations by factoring out common checks into helper functions
- The rule tester configuration now uses flat configuration format (`languageOptions` instead of `parserOptions`)

## Rule Documentation

- Documentation files use frontmatter with `title` and `rule_type` fields
- Rule documentation should include:
    - A description of what the rule checks
    - The rule details section explaining when the rule reports issues
    - Examples of incorrect and correct code wrapped in ::: incorrect and ::: correct blocks
    - A "When Not To Use It" section explaining when the rule might not be appropriate
    - Optional version information and additional resources
- Code examples in the documentation should include the enabling comment (e.g., `/*eslint rule-name: "error"*/`)

## Rules Registration

- New rules must be added to the `lib/rules/index.js` file to be available in ESLint
- Rules are registered in an alphabetically sorted object using the `LazyLoadingRuleMap` for efficient loading
