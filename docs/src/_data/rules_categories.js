module.exports = eleventy => {
    const PATH_PREFIX = eleventy.PATH_PREFIX;

    return {
        problem: {
            displayName: "Possible Problems",
            description: "These rules relate to possible logic errors in code:"
        },
        suggestion: {
            displayName: "Suggestions",
            description: "These rules suggest alternate ways of doing things:"
        },
        layout: {
            displayName: "Layout & Formatting",
            description: "These rules care about how the code looks rather than how it executes:"
        },
        deprecated: {
            displayName: "Deprecated",
            description: `These rules have been deprecated in accordance with the <a href="${PATH_PREFIX}use/rule-deprecation">deprecation policy</a>, and replaced by newer rules:`
        },
        removed: {
            displayName: "Removed",
            description: `These rules from older versions of ESLint (before the <a href="${PATH_PREFIX}use/rule-deprecation">deprecation policy</a> existed) have been replaced by newer rules:`
        }
    }
};
