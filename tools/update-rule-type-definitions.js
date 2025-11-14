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
 * Groups enum values by their keys.
 * @param {Object} prop properties of the schema with type 'object'.
 * @returns {Object} An object mapping enum keys to their corresponding property names.
 */
function getEnumGroups(prop) {
	const enumGroups = {};
	let keyGroup;
	let valueGroup;

	for (const [key, value] of Object.entries(prop)) {
		if (Array.isArray(value.enum)) {
			const enumKey = JSON.stringify(value.enum);
			if (!enumGroups[enumKey]) {
				enumGroups[enumKey] = [];
			}
			enumGroups[enumKey].push(key);
		}
	}

	if (Object.keys(enumGroups).length !== 0) {
		for (const [key, value] of Object.entries(enumGroups)) {
			if (Array.isArray(value) && value.length > 1) {
				keyGroup = value;
				valueGroup = JSON.parse(key);
			}
		}
	}

	return { keyGroup, valueGroup };
}

/**
 * Groups the properties that have equal values by their keys.
 * @param {Object} prop properties of the schema with type 'object'.
 * @returns {Object} An object mapping equal values to their corresponding property names.
 */
function getPropValueThatIsEqual(prop) {
	const equalValues = [];
	let keyValues;
	let propertyValue;

	for (const [key, value] of Object.entries(prop)) {
		if (value.type === "object") {
			const objectValue = JSON.stringify(value);

			if (!equalValues[objectValue]) {
				equalValues[objectValue] = [];
			}
			equalValues[objectValue].push(key);
		}
	}

	if (Object.keys(equalValues).length !== 0) {
		for (const [key, value] of Object.entries(equalValues)) {
			if (Array.isArray(value) && value.length > 1) {
				keyValues = JSON.parse(key);
				propertyValue = JSON.parse(key).properties;
			}
		}
	}

	return { keyValues, propertyValue };
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
function uniqueObjects(arr) {
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

	const uniqueAllObjects = uniqueObjects(allObjects);
	const requiredOptions = {
		required: obj?.required || [],
		anyOf: obj?.anyOf || [],
		oneOf: obj?.oneOf || [],
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
 * @param {string} ruleId The rule ID associated with the schema.
 * @param {Object} defaultOptions The default options for the rule.
 * @returns {string} The partial type definitions.
 */
function getPartials(schema, ruleId, defaultOptions) {
	const partials = [];
	let partialValue;

	for (const schemaItem of schema) {
		// eslint-disable-next-line no-use-before-define -- Both functions depend on each other.
		const partial = createPartials(schemaItem, ruleId, defaultOptions);

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
function createPartials(schema, ruleId, defaultOptions) {
	let partial;

	if (schema.type === "string") {
		partial = "string";
	}

	if (schema.enum) {
		if (schema.enum.length > 10) {
			partial = "string";
		} else {
			const enumValues = getArrayValues(schema.enum);
			partial = enumValues;
		}
	}

	if (schema.type === "integer") {
		partial = "number";
	}

	if (schema.const) {
		partial = `"${schema.const}"`;
	}

	if (schema.type === "array") {
		if (schema?.items?.type === "string") {
			partial = "string[]";
		} else {
			if (Array.isArray(schema.items)) {
				const itemPartials = [];
				for (const item of schema.items) {
					const itemPartial = createPartials(
						item,
						ruleId,
						defaultOptions,
					);

					if (itemPartial) {
						itemPartials.push(itemPartial);
					}
				}

				if (itemPartials.length > 0) {
					partial = `${itemPartials.join(",\n")}`;
				}
			} else {
				if (schema.items.oneOf) {
					partial = getPartials(
						schema.items.oneOf,
						ruleId,
						defaultOptions,
					);
				}

				if (schema.items.anyOf) {
					partial = getPartials(
						schema.items.anyOf,
						ruleId,
						defaultOptions,
					);
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
									requiredValues.push(
										...oneOfSchema.required,
									);
								}
							}

							const requiredObjects = [];

							for (const [
								index,
								reqValue,
							] of requiredValues.entries()) {
								const requiredObj = {};

								for (const reqValueOther of requiredValues) {
									if (
										reqValueOther === requiredValues[index]
									) {
										requiredObj[reqValue] =
											schema.items.properties[
												reqValueOther
											];
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
							}));

							const newSchema = getObjectWithoutRequired(
								schema.items,
								requiredValues,
							);
							const simplifiedObjects =
								getSimplifiedObjects(newSchema);

							const one = getPartials(
								simplifiedObjects,
								ruleId,
								defaultOptions,
							);
							const two = getPartials(
								finalObjects,
								ruleId,
								defaultOptions,
							);

							partial = `Array<(${one}) & (\n${two})>`;
						} else {
							const simplifiedObjects = getSimplifiedObjects(
								schema.items,
							);

							const allPartials = getPartials(
								simplifiedObjects,
								ruleId,
								defaultOptions,
							);

							partial = `Array<${allPartials}>`;
						}
					} else {
						const partialValue = createPartials(
							schema.items,
							ruleId,
							defaultOptions,
						);

						if (partialValue) {
							partial = `Array<${partialValue}>`;
						}
					}
				}

				if (schema.items.enum) {
					partial = "string[]";
				}
			}
		}
	}

	if (schema.oneOf) {
		partial = getPartials(schema.oneOf, ruleId, defaultOptions);
	}

	if (schema.anyOf) {
		partial = getPartials(schema.anyOf, ruleId, defaultOptions);
	}

	if (schema.type === "object") {
		if (schema.not) {
			const simplifiedObjects = getSimplifiedObjects(schema);

			partial = getPartials(simplifiedObjects, ruleId, defaultOptions);
		} else {
			const properties = schema.properties;
			const partialsValues = [];
			const partialsWithRecordValues = [];
			const { keyGroup, valueGroup } = getEnumGroups(properties);

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

			if (keyGroup) {
				partialsWithRecordValues.push(
					`Record<${keyGroup.join(" | ")}, ${valueGroup.join(" | ")}>`,
				);
			}

			const { propertyValue } = getPropValueThatIsEqual(properties);

			if (propertyValue) {
				const keys = [];
				const propValue = [];
				for (const [prop] of Object.entries(properties)) {
					keys.push(prop);
				}
				for (const [prop, val] of Object.entries(propertyValue)) {
					propValue.push(`${prop}: ${val.type};`);
				}

				const allKeys = getArrayValues(keys);
				partialsWithRecordValues.push(
					`Record<${allKeys}, Partial<{\n${propValue.join("\n")}\n}>>`,
				);
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

				if (requiredProps.length > 0) {
					keyValue = requiredProps.includes(key) ? key : `${key}?`;
				}

				if (value.type === "never") {
					partialsValues.push(`${key}?: never;`);
				}

				if (Array.isArray(value.type)) {
					if (defaultOptions && defaultOptions[key] !== void 0) {
						partialsValues.push(
							getDefaultTag(
								defaultOptions[key],
								addDeprecatedTag,
							),
						);
					}

					if ("default" in value) {
						partialsValues.push(
							getDefaultTag(value.default, addDeprecatedTag),
						);
					}

					const updated = value.type.map(item =>
						item === "integer" ? "number" : item,
					);

					partialsValues.push(`${keyValue}: ${updated.join(" | ")};`);
				}

				if (value.enum) {
					if (defaultOptions && defaultOptions[key] !== void 0) {
						const defaultValue =
							typeof defaultOptions[key] === "string"
								? `"${defaultOptions[key]}"`
								: defaultOptions[key];
						partialsValues.push(
							getDefaultTag(defaultValue, addDeprecatedTag),
						);
					}

					if (value.enum.length > 10) {
						partialsValues.push(`${keyValue}: string;`);
					} else {
						const enumValues = getArrayValues(value.enum);
						partialsValues.push(`${keyValue}: ${enumValues};`);
					}
				}

				if (value.type === "boolean" || value.type === "string") {
					if (
						defaultOptions &&
						defaultOptions[key] !== void 0 &&
						defaultOptions[key] !== ""
					) {
						partialsValues.push(
							getDefaultTag(
								defaultOptions[key],
								addDeprecatedTag,
							),
						);
					}
					if ("default" in value) {
						partialsValues.push(
							getDefaultTag(value.default, addDeprecatedTag),
						);
					}
					partialsValues.push(`${keyValue}: ${value.type};`);
				}

				if (value.type === "integer") {
					let defaultValue;

					if ("default" in value) {
						defaultValue = value.default;
					} else if (defaultOptions) {
						if (defaultOptions[key] !== void 0) {
							defaultValue = defaultOptions[key];
						} else if (Number.isInteger(defaultOptions)) {
							defaultValue = defaultOptions;
						}
					}

					if (defaultValue !== void 0) {
						partialsValues.push(
							getDefaultTag(defaultValue, addDeprecatedTag),
						);
					}
					partialsValues.push(`${keyValue}: number;`);
				}

				if (value.type === "array") {
					if (value.items?.type === "string") {
						if (ruleId === "no-console" && key === "allow") {
							partialsValues.push(
								`${keyValue}: Array<keyof Console>;`,
							);
						} else {
							if (value.items?.pattern) {
								partialsValues.push(
									`/**\n * Pattern "${value.items.pattern}"\n */`,
								);
							}

							if (
								defaultOptions &&
								defaultOptions[key] !== void 0
							) {
								const defaultValue =
									Array.isArray(defaultOptions[key]) &&
									defaultOptions[key].length === 0
										? "[]"
										: `[${defaultOptions[key].map(item => (typeof item === "string" ? `"${item}"` : item)).join(", ")}]`;
								partialsValues.push(
									getDefaultTag(
										defaultValue,
										addDeprecatedTag,
									),
								);
							}
							partialsValues.push(`${keyValue}: string[];`);
						}
					}

					if (value.items?.enum) {
						if (defaultOptions && defaultOptions[key] !== void 0) {
							const defaultValue =
								Array.isArray(defaultOptions[key]) &&
								defaultOptions[key].length === 0
									? "[]"
									: `[${defaultOptions[key].map(item => (typeof item === "string" ? `"${item}"` : item)).join(", ")}]`;
							partialsValues.push(
								getDefaultTag(defaultValue, addDeprecatedTag),
							);
						}

						const enumValues = getArrayValues(value.items.enum);

						partialsValues.push(
							`${keyValue}: Array<${enumValues}>;`,
						);
					}

					if (value.items.type === "object") {
						const propPartial = [];
						for (const [prop, val] of Object.entries(
							value.items.properties,
						)) {
							const partialValue = createPartials(
								val,
								ruleId,
								defaultOptions,
							);
							if (partialValue) {
								propPartial.push(`${prop}: ${partialValue};`);
							}
						}

						if (propPartial.length > 0) {
							partialsValues.push(
								`${keyValue}: Array<{${propPartial.join("\n")}}>;`,
							);
						}
					}

					if (value.items.type === "array") {
						if (value.items.items?.enum) {
							partialsValues.push(`${keyValue}: string[][];`);
						}
					}

					if (value.items.oneOf) {
						const oneOfPartials = getPartials(
							value.items.oneOf,
							ruleId,
							defaultOptions,
						);

						partialsValues.push(
							`${keyValue}: Array<${oneOfPartials}>;`,
						);
					}

					if (value.items.anyOf) {
						const anyOfPartials = getPartials(
							value.items.anyOf,
							ruleId,
							defaultOptions,
						);

						partialsValues.push(
							`${keyValue}: Array<${anyOfPartials}>;`,
						);
					}
				}

				if (value.type === "object") {
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

					if (value.properties) {
						const partialValue = createPartials(
							value,
							ruleId,
							defaultOptions,
						);

						if (partialValue) {
							partialsValues.push(
								`${keyValue}: ${partialValue};`,
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
				}

				if (value.oneOf) {
					const oneOfPartials = getPartials(
						value.oneOf,
						ruleId,
						defaultOptions,
					);

					partialsValues.push(`${keyValue}: \n${oneOfPartials};`);
				}

				if (value.anyOf) {
					const anyOfPartials = getPartials(
						value.anyOf,
						ruleId,
						defaultOptions,
					);

					partialsValues.push(`${keyValue}: \n${anyOfPartials};`);
				}
			}

			let partialsValue;

			if (requiredProps.length > 0) {
				partialsValue = `{\n${partialsValues.join("\n")}\n}`;
			} else {
				if (partialsValues.length > 0) {
					partialsValue = `Partial<{\n${partialsValues.join("\n")}\n}>`;
				} else if (partialsWithRecordValues.length > 0) {
					partialsValue = `Partial<\n${partialsWithRecordValues.join("\n")}\n>`;
				}
			}

			partial = partialsValue;
		}
	}

	return partial;
}

/**
 * Creates a type definition for a rule schema.
 * @param {string} ruleId The rule ID.
 * @returns {string} The created type definition.
 */
function createTypeDefinition(ruleId) {
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
			const partialValue = createPartials(
				ruleSchema[0],
				ruleId,
				defaultOptionsFirst,
			);

			if (partialValue) {
				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[${partialValue}]>;`;
			}

			if (ruleSchema[0].oneOf && Array.isArray(ruleSchema[0].oneOf)) {
				const partials = [];

				for (const schema of ruleSchema[0].oneOf) {
					const partial = createPartials(
						schema,
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
				const partial = createPartials(
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
	}

	if (typeof ruleSchema === "object") {
		const defaultOption =
			Array.isArray(defaultOptions) && defaultOptions[0];

		if (ruleSchema?.type === "array") {
			if (ruleSchema?.items?.type === "string") {
				ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[...string[]]>;`;
			} else if (!("oneOf" in ruleSchema) && !("anyOf" in ruleSchema)) {
				const partialValue = createPartials(
					ruleSchema,
					ruleId,
					defaultOption,
				);

				if (partialValue) {
					ruleTypeDefinition = `"${ruleId}": Linter.RuleEntry<[\n${partialValue}\n]>;`;
				}
			}
		}

		if (ruleSchema.anyOf && Array.isArray(ruleSchema.anyOf)) {
			const partials = [];

			for (const schema of ruleSchema.anyOf) {
				const partial = createPartials(schema, ruleId, defaultOption);
				if (partial) {
					partials.push(`Linter.RuleEntry<[\n${partial}\n]>`);
				}
			}

			ruleTypeDefinition = `"${ruleId}": ${partials.join(" |\n")};`;
		}

		if (ruleSchema.oneOf && Array.isArray(ruleSchema.oneOf)) {
			const partials = [];

			for (const schema of ruleSchema.oneOf) {
				const partial = createPartials(schema, ruleId, defaultOption);
				if (partial) {
					partials.push(`Linter.RuleEntry<[\n${partial}\n]>`);
				}
			}

			ruleTypeDefinition = `"${ruleId}": ${partials.join(" |\n")};`;
		}

		if (ruleSchema.definitions) {
			const mainSchema = resolveSchema(ruleSchema);

			const partialValue = createPartials(
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
		const tsRuleDefinition = createTypeDefinition(ruleId);

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
