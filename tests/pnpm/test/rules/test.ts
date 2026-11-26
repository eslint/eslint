import type { Rule } from "eslint";

export default {
	meta: {
		type: "suggestion",
		docs: {
			description: "Description of the rule",
		},
		fixable: "code",
		schema: [],
	},
	create(context) {
		return {
			Program() {
				const sourceCode = context.sourceCode.text;

				void sourceCode;
			},
		};
	},
} satisfies Rule.RuleModule;
