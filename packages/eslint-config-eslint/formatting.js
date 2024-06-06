"use strict";

module.exports = {
    rules: {
        "array-bracket-spacing": "error",
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": "error",
        "block-spacing": "error",
        "brace-style": ["error", "1tbs"],
        "comma-dangle": "error",
        "comma-spacing": "error",
        "comma-style": ["error", "last"],
        "computed-property-spacing": "error",
        "dot-location": ["error", "property"],
        "eol-last": "error",
        "func-call-spacing": "error",
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "consistent"],
        "generator-star-spacing": "error",
        indent: ["error", 4, { SwitchCase: 1 }],
        "key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "keyword-spacing": "error",
        "lines-around-comment": ["error",
            {
                beforeBlockComment: true,
                afterBlockComment: false,
                beforeLineComment: true,
                afterLineComment: false
            }
        ],
        "max-len": ["error", 160,
            {
                ignoreComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }
        ],
        "max-statements-per-line": "error",
        "new-parens": "error",
        "no-confusing-arrow": "error",
        "no-extra-semi": "error",
        "no-floating-decimal": "error",
        "no-mixed-spaces-and-tabs": ["error", false],
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                max: 2,
                maxBOF: 0,
                maxEOF: 0
            }
        ],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "object-curly-newline": ["error",
            {
                consistent: true,
                multiline: true
            }
        ],
        "object-curly-spacing": ["error", "always"],
        "object-property-newline": ["error",
            {
                allowAllPropertiesOnSameLine: true
            }
        ],
        "one-var-declaration-per-line": "error",
        "operator-linebreak": "error",
        "padding-line-between-statements": ["error",
            {
                blankLine: "always",
                prev: ["const", "let", "var"],
                next: "*"
            },
            {
                blankLine: "any",
                prev: ["const", "let", "var"],
                next: ["const", "let", "var"]
            }
        ],
        quotes: ["error", "double", { avoidEscape: true }],
        "quote-props": ["error", "as-needed"],
        "rest-spread-spacing": "error",
        semi: "error",
        "semi-spacing": ["error",
            {
                before: false,
                after: true
            }
        ],
        "semi-style": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": ["error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always"
            }
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": ["error",
            {
                words: true,
                nonwords: false
            }
        ],
        "spaced-comment": ["error",
            "always",
            {
                exceptions: ["-"]
            }
        ],
        "switch-colon-spacing": "error",
        "template-curly-spacing": ["error", "never"],
        "template-tag-spacing": "error",
        "wrap-iife": "error",
        "yield-star-spacing": "error"
    }
};
