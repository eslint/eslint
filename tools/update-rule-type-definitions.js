/**
 * @fileoverview Script to update rule type definitions.
 * If this script is run with command-line arguments, it will only update rule types that match the specified rule files.
 * E.g. running with CLI arguments `"./lib/rules/no-unused-vars.js"`
 * will only update the rule definition for the `no-unused-vars` rule.
 * If this script is run without arguments, it will update the rule definitions for all rules.
 *
 * @author Tanuj Kanti
 */

"use strict";

const { readFile, writeFile } = require("node:fs/promises");
const rules = require("../lib/rules");
const deref = require("json-schema-deref-sync");
const { basename, join, relative } = require("node:path");
const ts = require("typescript");

/**
 * Function to get type definitions from schema using `@typescript-eslint/rule-schema-to-typescript-types`.
 * @param {Object} schema The ESLint rule schema.
 * @returns {Promise<string>} The generated type definition as a string.
 */
async function getTypeDefinition(schema) {
	const { schemaToTypes } = await import(
		"@typescript-eslint/rule-schema-to-typescript-types"
	);

	const typeDefinition = schemaToTypes(schema);

	const typeOnlyPart = typeDefinition.replace(/^type\s+\w+\s*=\s*/u, "");

	return typeOnlyPart;
}

/**
 * Checks if a declared interface extends `Linter.RulesRecord`.
 * @param {ts.InterfaceDeclaration} node An `InterfaceDeclaration` node.
 * @returns {boolean} A boolean value indicating whether the specified interface extends `Linter.RulesRecord`.
 */
function extendsRulesRecord(node) {
	const { heritageClauses } = node;

	if (!heritageClauses) {
		return false;
	}
	for (const heritageClause of heritageClauses) {
		for (const { expression } of heritageClause.types) {
			if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
				if (
					expression.expression.kind === ts.SyntaxKind.Identifier &&
					expression.expression.text === "Linter" &&
					expression.name.kind === ts.SyntaxKind.Identifier &&
					expression.name.text === "RulesRecord"
				) {
					return true;
				}
			}
		}
	}
	return false;
}

/**
 * Returns the names of the rules whose paths were specified in the command line.
 * If no rule paths were specified, the names of all built-in rules are returned.
 * @param {string[]} args The command line arguments without options.
 * @returns {Set<string>} The names of the rules to be considered for the current run.
 */
function getConsideredRuleIds(args) {
	let ruleIds;

	if (args.length) {
		const ruleDir = join(__dirname, "../lib/rules");

		ruleIds = args
			.filter(
				arg =>
					relative(arg, ruleDir) === ".." &&
					basename(arg) !== "index.js",
			)
			.map(ruleFile => basename(ruleFile, ".js"));
	} else {
		ruleIds = rules.keys();
	}
	return new Set(ruleIds);
}

/**
 * Returns the locations of the rule type definition and the end of the type definition for each rule in a type declaration file.
 * If a rule has no header comment the location returned is the start position of the rule name.
 * @param {string} sourceText The source text of the type declaration file.
 * @param {Set<string>} consideredRuleIds The names of the rules to be considered for the current run.
 * @returns {Map<string, TextPositions>} A map of rule names to text positions.
 * The text positions indicate the locations of the rule type definition and the end of the type definition in the source.
 */
function getRuleTypeDefinitionPositionsMap(sourceText, consideredRuleIds) {
	const ruleDefinitionTextPositionsMap = new Map();
	const ast = ts.createSourceFile("", sourceText);

	for (const statement of ast.statements) {
		if (
			statement.kind === ts.SyntaxKind.InterfaceDeclaration &&
			extendsRulesRecord(statement)
		) {
			const { members } = statement;

			for (const member of members) {
				if (member.kind === ts.SyntaxKind.PropertySignature) {
					const ruleId = member.name.text;
					const ruleNameLength = `"${ruleId}"`.length;

					if (consideredRuleIds.has(ruleId)) {
						const ruleDefinitionTextPositions = {
							tsruleDefinitionStart:
								member.name.end - ruleNameLength,
							tsruleDefinitionEnd: member.end,
						};
						ruleDefinitionTextPositions.typeEnd = member.end;
						ruleDefinitionTextPositionsMap.set(
							ruleId,
							ruleDefinitionTextPositions,
						);
					}
				}
			}
		}
	}
	return ruleDefinitionTextPositionsMap;
}

/**
 * Resolves the schema by dereferencing any $ref pointers.
 * @param {Object} schema The schema to resolve with 'definition' property.
 * @returns {Object} The resolved schema without $ref pointers and 'definition' property.
 */
function resolveSchema(schema) {
	const resolvedSchema = deref(schema);

	if (resolvedSchema) {
		// eslint-disable-next-line no-unused-vars -- We omit definitions as we have used its values as reference.
		const { definitions, ...restSchema } = resolvedSchema;

		return restSchema;
	}

	return schema;
}

/**
 * Creates a string of enum values for a given array of enum values.
 * @param {Array} enumValue An array of enum values.
 * @returns {string} A string of enum values separated by ' | '.
 */
function getArrayValues(enumValue) {
	const enumValues = enumValue
		.filter(value => value !== null)
		.map(value => (typeof value === "string" ? `"${value}"` : value))
		.join(" | ");

	return enumValues;
}

/**
 * Creates an object mapping properties to their not required values.
 * @param {Object} obj The schema object with 'not' property that contains not required values.
 * @returns {Object} An object mapping properties to their not required values.
 */
function createObjectOfRequiredValues(obj) {
	const requiredValues = {};

	const notRequiredValues = obj?.not;

	if (notRequiredValues?.required) {
		for (const [index, value] of notRequiredValues.required.entries()) {
			requiredValues[value] = notRequiredValues.required.filter(
				(_, i) => i !== index,
			);
		}
	}

	if (notRequiredValues?.anyOf) {
		for (const anyOfObj of notRequiredValues.anyOf) {
			if (anyOfObj?.required) {
				for (const [index, value] of anyOfObj.required.entries()) {
					if (requiredValues[value]) {
						const filtered = anyOfObj.required.filter(
							(_, i) => i !== index,
						);

						requiredValues[value] = [
							...requiredValues[value],
							...filtered,
						];
					} else {
						requiredValues[value] = anyOfObj.required.filter(
							(_, i) => i !== index,
						);
					}
				}
			}
		}
	}

	return requiredValues;
}

/**
 * Filters out duplicate objects from an array of schema objects.
 * @param {Array} arr Array of schema objects.
 * @returns {Array} Array of unique schema objects.
 */
function getUniqueObjects(arr) {
	const seen = new Set();
	const result = [];

	for (const obj of arr) {
		const normalized = JSON.stringify(
			Object.keys(obj)
				.sort()
				.reduce((acc, key) => {
					acc[key] = obj[key];
					return acc;
				}, {}),
		);

		if (!seen.has(normalized)) {
			seen.add(normalized);
			result.push(obj);
		}
	}

	return result;
}

/**
 * Simplifies schema objects by giving all possible combinations of schema properties.
 * @param {Object} obj The schema object to simplify.
 * @returns {Array} An array of simplified schema objects.
 */
function getSimplifiedObjects(obj) {
	const allObjects = [];

	const requiredValues = createObjectOfRequiredValues(obj);

	for (const value of Object.values(requiredValues)) {
		const currentObj = {};
		const revisedObj = {};
		const revisedPropToRemove = [];

		for (const [prop, val] of Object.entries(obj.properties)) {
			if (!value.includes(prop)) {
				currentObj[prop] = val;
			}
		}

		const allSingle = Object.values(requiredValues).every(
			arr => Array.isArray(arr) && arr.length === 1,
		);

		if (allSingle) {
			for (const [prop, val] of Object.entries(currentObj)) {
				const propvalue = requiredValues[prop];

				const firstValue = propvalue && propvalue[0];

				if (
					firstValue in currentObj &&
					revisedPropToRemove.length < 1
				) {
					revisedPropToRemove.push(firstValue);
				}

				const propToRemove =
					revisedPropToRemove.length === 1 && revisedPropToRemove[0];

				if (prop !== propToRemove) {
					revisedObj[prop] = val;
				}
			}

			allObjects.push(revisedObj);
		} else {
			allObjects.push(currentObj);
		}
	}

	const uniqueAllObjects = getUniqueObjects(allObjects);
	const requiredOptions = {
		required: obj?.required || [],
		anyOf: obj?.anyOf || [],
		oneOf: obj?.oneOf || [],
		hasRequired:
			obj?.required?.length > 0 ||
			obj?.anyOf?.some(o => o.required?.length > 0) ||
			obj?.oneOf?.some(o => o.required?.length > 0) ||
			false,
	};

	const finalObjects = uniqueAllObjects.map(item => ({
		type: "object",
		properties: item,
		...requiredOptions,
	}));

	return finalObjects;
}

/**
 * Filters out required keys from the given schema object.
 * @param {Object} obj The schema object with 'oneOf' property with 'required' properties in it.
 * @param {Array} requiredKeys An array of required keys in 'oneOf'.
 * @returns {Object} An object without the required keys.
 */
function getObjectWithoutRequired(obj, requiredKeys) {
	const notRequiredProps = {};
	const { properties, ...rest } = obj;

	for (const [key, value] of Object.entries(properties)) {
		if (!requiredKeys.includes(key)) {
			notRequiredProps[key] = value;
		}
	}

	return { ...rest, properties: notRequiredProps };
}

/**
 * Get the default tag for type definitions options.
 * @param {string | boolean} value The default value.
 * @param {boolean} isDeprecated Whether the option is deprecated.
 * @returns {string} The default tag for the given value.
 */
function getDefaultTag(value, isDeprecated) {
	const defaultTag = `/**\n * @default ${value}\n */`;
	const defaultWithDeprecatedTag = `/**\n * @deprecated\n * @default ${value}\n */`;

	return isDeprecated ? defaultWithDeprecatedTag : defaultTag;
}

/**
 * Gets the partial type definitions for a schema.
 * @param {Object} schema The schema to get partials for.
 * @param {Object} defaultOptions The default options for the rule.
 * @returns {string} The partial type definitions.
 */
async function getPartials(schema, defaultOptions) {
	const partials = [];
	let partialValue;

	for (const schemaItem of schema) {
		// eslint-disable-next-line no-use-before-define -- Both functions depend on each other.
		const partial = await createPartials(schemaItem, defaultOptions);

		if (partial) {
			partials.push(partial);
		}
	}

	if (partials.length > 0) {
		partialValue = partials.join(" |\n");
	}

	return partialValue;
}

/**
 * Creates partial of type definitions for a schema.
 * @param {Object} schema The schema to create partials for.
 * @param {string} ruleId The rule ID associated with the schema.
 * @param {Object | Array | string} defaultOptions The default options for the rule.
 * @returns {string} The created partial type definitions.
 */
async function createPartials(schema, ruleId, defaultOptions) {
	let partial;

	if (
		schema.type === "string" ||
		schema.type === "integer" ||
		schema.type === "number" ||
		schema.type === "boolean"
	) {
		partial = await getTypeDefinition(schema);
	}

	if (schema.enum) {
		partial = getArrayValues(schema.enum);
	}

	if (schema.const) {
		partial = `"${schema.const}"`;
	}

	if (Array.isArray(schema.type)) {
		const types = schema.type.map(type =>
			type === "integer" ? "number" : type,
		);

		partial = types.join(" | ");
	}

	if (schema.type === "array") {
		if (Array.isArray(schema.items)) {
			const arrItems = schema.items;
			const defItems = [];

			for (const item of arrItems) {
				const itemPartial = await createPartials(
					item,
					ruleId,
					defaultOptions,
				);

				if (itemPartial) {
					defItems.push(itemPartial);
				}
			}

			if (defItems.length > 0) {
				partial = defItems.join(",\n");
			}
		} else {
			if (
				schema.items.type === "string" ||
				schema.items.type === "array"
			) {
				if (schema.items.not && schema.items.not.pattern) {
					partial = "string[]";
				} else {
					partial = await getTypeDefinition(schema);
				}
			}

			if (schema.items.enum) {
				const enumValues = await getTypeDefinition(schema.items);

				partial = `Array<${enumValues}>`;
			}

			if (schema.items.anyOf) {
				const anyOfPartial = await getPartials(
					schema.items.anyOf,
					ruleId,
					defaultOptions,
				);

				partial = `Array<${anyOfPartial}>`;
			}

			if (schema.items.oneOf) {
				const oneOfPartial = await getPartials(
					schema.items.oneOf,
					ruleId,
					defaultOptions,
				);

				partial = `Array<${oneOfPartial}>`;
			}

			if (schema.items.type === "object") {
				if (schema.items.not) {
					if (
						schema.items.oneOf &&
						schema.items.oneOf.every(obj => "required" in obj)
					) {
						const requiredValues = [];

						for (const oneOfSchema of schema.items.oneOf) {
							if (oneOfSchema.required) {
								requiredValues.push(...oneOfSchema.required);
							}
						}

						const requiredObjects = [];

						for (const [
							index,
							reqValue,
						] of requiredValues.entries()) {
							const requiredObj = {};

							for (const reqValueOther of requiredValues) {
								if (reqValueOther === requiredValues[index]) {
									requiredObj[reqValue] =
										schema.items.properties[reqValueOther];
								} else {
									requiredObj[reqValueOther] = {
										type: "never",
									};
								}
							}

							requiredObjects.push(requiredObj);
						}

						const finalObjects = requiredObjects.map(obj => ({
							type: "object",
							properties: obj,
							oneOf: schema.items.oneOf,
							hasRequired: true,
						}));

						const newSchema = getObjectWithoutRequired(
							schema.items,
							requiredValues,
						);
						const simplifiedObjects =
							getSimplifiedObjects(newSchema);

						const one = await getPartials(
							simplifiedObjects,
							defaultOptions,
						);

						const two = await getPartials(
							finalObjects,
							defaultOptions,
						);

						partial = `Array<(${one}) & (\n${two})>`;
					} else {
						const simplifiedObjects = getSimplifiedObjects(
							schema.items,
						);

						const allPartials = await getPartials(
							simplifiedObjects,
							defaultOptions,
						);

						partial = `Array<${allPartials}>`;
					}
				} else {
					const partialValue = await createPartials(
						schema.items,
						ruleId,
						defaultOptions,
					);

					if (partialValue) {
						partial = `Array<${partialValue}>`;
					}
				}
			}
		}
	}

	if (schema.oneOf) {
		partial = await getPartials(schema.oneOf, defaultOptions);
	}

	if (schema.anyOf) {
		partial = await getPartials(schema.anyOf, defaultOptions);
	}

	if (schema.type === "object") {
		if (schema.not) {
			const simplifiedObjects = getSimplifiedObjects(schema);

			partial = await getPartials(simplifiedObjects, defaultOptions);
		} else {
			const properties = schema.properties;
			const partialsValues = [];
			const requiredProps = [];

			if (schema.required) {
				requiredProps.push(...schema.required);
			}

			if (schema.anyOf) {
				for (const anyOfSchema of schema.anyOf) {
					if (anyOfSchema.required) {
						requiredProps.push(...anyOfSchema.required);
					}
				}
			}

			if (schema.oneOf) {
				for (const oneOfSchema of schema.oneOf) {
					if (oneOfSchema.required) {
						requiredProps.push(...oneOfSchema.required);
					}
				}
			}

			for (const [key, value] of Object.entries(properties)) {
				let keyValue = key;
				const hasDefault =
					Number.isInteger(defaultOptions) ||
					(defaultOptions && defaultOptions[key]) ||
					"default" in value;
				const addDeprecatedTag = hasDefault && value?.deprecated;

				if (value?.deprecated && !hasDefault) {
					partialsValues.push(`/**\n * @deprecated\n */`);
				}

				if (defaultOptions) {
					let defaultValue;

					if (defaultOptions[key] !== void 0) {
						if (
							typeof defaultOptions[key] === "string" &&
							defaultOptions[key] !== ""
						) {
							defaultValue = `"${defaultOptions[key]}"`;
						}

						if (
							value.type === "array" &&
							(value.items?.type === "string" ||
								value.items?.enum)
						) {
							defaultValue =
								Array.isArray(defaultOptions[key]) &&
								defaultOptions[key].length === 0
									? "[]"
									: `[${defaultOptions[key].map(item => (typeof item === "string" ? `"${item}"` : item)).join(", ")}]`;
						}

						if (
							typeof defaultOptions[key] === "boolean" ||
							typeof defaultOptions[key] === "number"
						) {
							defaultValue = defaultOptions[key];
						}
					} else {
						if (
							value.type === "integer" &&
							Number.isInteger(defaultOptions)
						) {
							defaultValue = defaultOptions;
						}
					}

					if (defaultValue !== void 0) {
						partialsValues.push(
							getDefaultTag(defaultValue, addDeprecatedTag),
						);
					}
				}

				if ("default" in value) {
					partialsValues.push(
						getDefaultTag(value.default, addDeprecatedTag),
					);
				}

				if (
					value.type === "array" &&
					value.items?.type === "string" &&
					value.items?.pattern
				) {
					partialsValues.push(
						`/**\n * Pattern "${value.items.pattern}"\n */`,
					);
				}

				if (requiredProps.length > 0) {
					keyValue = requiredProps.includes(key) ? key : `${key}?`;
				}

				if (value.type === "never") {
					partialsValues.push(`${key}?: never;`);
				}

				if (value.oneOf) {
					const oneOfPartials = await createPartials(
						value,
						ruleId,
						defaultOptions,
					);

					partialsValues.push(`${keyValue}: \n${oneOfPartials};`);
				} else if (value.anyOf) {
					const anyOfPartials = await createPartials(
						value,
						ruleId,
						defaultOptions,
					);

					partialsValues.push(`${keyValue}: \n${anyOfPartials};`);
				} else {
					if (value.type === "object" && !value.properties) {
						if (value.additionalProperties) {
							if (value.additionalProperties.type === "boolean") {
								partialsValues.push(
									`${keyValue}: Record<string, boolean>;`,
								);
							}

							if (value.additionalProperties.enum) {
								const enumValues = getArrayValues(
									value.additionalProperties.enum,
								);

								partialsValues.push(
									`${keyValue}: Record<string, ${enumValues}>;`,
								);
							}
						}

						if (value.patternProperties) {
							for (const [, patternProp] of Object.entries(
								value.patternProperties,
							)) {
								if (
									ruleId === "no-multi-spaces" &&
									key === "exceptions"
								) {
									partialsValues.push(
										`/**\n * @default { Property: true }\n */`,
									);
								}
								if (patternProp.type === "boolean") {
									partialsValues.push(
										`${keyValue}: Record<string, boolean>;`,
									);
								}
							}
						}
					} else {
						let valueObj = value;

						if (value.description) {
							// eslint-disable-next-line no-unused-vars -- We omit description for now.
							const { description, ...restValue } = value;
							valueObj = restValue;
						}

						const valuePartial = await createPartials(
							valueObj,
							ruleId,
							defaultOptions,
						);

						if (valuePartial) {
							partialsValues.push(
								`${keyValue}: ${valuePartial};`,
							);
						}
					}
				}
			}

			if (partialsValues.length > 0) {
				if (
					(schema.required && schema?.required.length > 0) ||
					schema.hasRequired
				) {
					partial = `{\n${partialsValues.join("\n")}\n}`;
				} else {
					partial = `Partial<{\n${partialsValues.join("\n")}\n}>`;
				}
			}
		}
	}

	return partial;
}

/**
 * Creates a type definition for a rule schema.
 * @param {string} ruleId The rule ID.
 * @returns {string} The created type definition.
 */
async function createTypeDefinition(ruleId) {
	const ruleMeta = rules.get(ruleId).meta;
	const ruleSchema = ruleMeta.schema;
	const defaultOptions = ruleMeta.defaultOptions;
	const defaultOptionsFirst =
		Array.isArray(defaultOptions) && defaultOptions[0];

	let ruleTypeDefinition;

	if (Array.isArray(ruleSchema)) {
		if (ruleSchema.length === 0) {
			ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[]>;`;
		} else if (ruleSchema.length === 1) {
			const ruleSchemaItem = ruleSchema[0];

			const partialValue = await createPartials(
				ruleSchemaItem,
				ruleId,
				defaultOptionsFirst,
			);

			if (partialValue) {
				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[${partialValue}]>;`;
			}

			if (ruleSchemaItem.oneOf && Array.isArray(ruleSchemaItem.oneOf)) {
				const partials = [];

				for (const schemaItem of ruleSchemaItem.oneOf) {
					const partial = await createPartials(
						schemaItem,
						ruleId,
						defaultOptionsFirst,
					);

					if (partial) {
						partials.push(partial);
					}
				}

				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[\n${partials.join(" |\n")}\n]>;`;
			}
		} else {
			const partials = [];
			let defaultIndex = 0;

			for (const schema of ruleSchema) {
				const defaultOptionsCurrent =
					Array.isArray(defaultOptions) &&
					defaultOptions[defaultIndex];
				const partial = await createPartials(
					schema,
					ruleId,
					defaultOptionsCurrent,
				);

				if (partial) {
					partials.push(partial);
				}

				defaultIndex += 1;
			}

			ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[\n${partials.join(",\n")}\n]>;`;
		}
	} else {
		const defaultOption =
			Array.isArray(defaultOptions) && defaultOptions[0];

		if (ruleSchema?.type === "array") {
			if (ruleSchema?.items?.type === "string") {
				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[...string[]]>;`;
			} else if (!("oneOf" in ruleSchema) && !("anyOf" in ruleSchema)) {
				const partialValue = await createPartials(
					ruleSchema,
					ruleId,
					defaultOption,
				);

				if (partialValue) {
					ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[\n...${partialValue}\n]>;`;
				}
			}
		}

		if (ruleSchema.anyOf && Array.isArray(ruleSchema.anyOf)) {
			const partials = [];

			for (const schema of ruleSchema.anyOf) {
				const partial = await createPartials(
					schema,
					ruleId,
					defaultOption,
				);
				if (partial) {
					if (
						schema.type === "array" &&
						typeof schema.items === "object" &&
						!Array.isArray(schema.items)
					) {
						partials.push(`Linter.RuleEntry<[\n...${partial}\n]>`);
					} else {
						partials.push(`Linter.RuleEntry<[\n${partial}\n]>`);
					}
				}
			}

			ruleTypeDefinition = `"${ruleId}": ${partials.join(" |\n")};`;
		}

		if (ruleSchema.oneOf && Array.isArray(ruleSchema.oneOf)) {
			const partials = [];

			for (const schema of ruleSchema.oneOf) {
				const partial = await createPartials(
					schema,
					ruleId,
					defaultOption,
				);
				if (partial) {
					partials.push(`Linter.RuleEntry<[\n${partial}\n]>`);
				}
			}

			ruleTypeDefinition = `"${ruleId}": ${partials.join(" |\n")};`;
		}

		if (ruleSchema.definitions) {
			const mainSchema = resolveSchema(ruleSchema);

			const partialValue = await createPartials(
				mainSchema,
				ruleId,
				defaultOption,
			);

			if (partialValue) {
				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[\n${partialValue}\n]>;`;
			}
		}
	}

	return ruleTypeDefinition;
}

/**
 * Updates rule type definition a `.d.ts` file or checks if a `.d.ts` file is up-to-date.
 * @param {string} ruleTypeFile Pathname of the `.d.ts` file.
 * @param {Set<string>} consideredRuleIds The names of the rules to be considered for the current run.
 * @param {boolean} check Whether to throw an error if the `.d.ts` file is not up-to-date.
 * @returns {Promise<Iterable<string>>} The names of the rules found in the `.d.ts` file.
 */
async function updateTypeDefinition(ruleTypeFile, consideredRuleIds, check) {
	const sourceText = await readFile(ruleTypeFile, "utf-8");
	const textPositionsMap = getRuleTypeDefinitionPositionsMap(
		sourceText,
		consideredRuleIds,
	);
	const sortedRuleIds = [...textPositionsMap.keys()].sort();
	const chunks = [];
	let lastPos = 0;

	for (const [
		,
		{ tsruleDefinitionStart: insertStart, typeEnd: insertEnd },
	] of textPositionsMap) {
		const textBeforeTSDoc = sourceText.slice(lastPos, insertStart);
		const ruleId = sortedRuleIds.shift();
		const tsRuleDefinition = await createTypeDefinition(ruleId);

		chunks.push(textBeforeTSDoc, tsRuleDefinition);
		lastPos = insertEnd;
	}
	chunks.push(sourceText.slice(Math.max(0, lastPos)));
	const newSourceText = chunks.join("");

	if (newSourceText !== sourceText) {
		if (check) {
			throw new Error(
				"The rule types are not up-to-date. Please, run `node tools/update-rule-type-headers.js` to fix.",
			);
		}
		await writeFile(ruleTypeFile, newSourceText);
	}
	return textPositionsMap.keys();
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

(async () => {
	let check = false;
	const args = process.argv.slice(2).filter(arg => {
		if (arg === "--check") {
			check = true;
			return false;
		}
		return true;
	});
	const consideredRuleIds = getConsideredRuleIds(args);
	const ruleTypeFile = join(__dirname, "../lib/types/rules.d.ts");
	const untypedRuleIds = [];

	console.log(`Considering ${consideredRuleIds.size} rule(s).`);
	const ruleIds = await updateTypeDefinition(
		ruleTypeFile,
		consideredRuleIds,
		check,
	);
	const typedRuleIds = new Set(ruleIds);

	for (const ruleId of consideredRuleIds) {
		if (!typedRuleIds.has(ruleId)) {
			untypedRuleIds.push(ruleId);
		}
	}
	if (untypedRuleIds.length) {
		console.warn(
			"The following rules have no type definition:%s",
			untypedRuleIds.map(ruleId => `\n* ${ruleId}`).join(""),
		);
		process.exitCode = 1;
	}
})();
