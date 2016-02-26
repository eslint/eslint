"use strict";

//   selectors = selector [ws ',' ws selector]*;
//     selector = node [ws relationships]*;
//        relationships = relationshipType [ws] node;
//            relationshipType = '>' | ' ';
//        node = [type][attributes];
//            type = /[A-Za-z]+/;
//            attributes = ( '[' ws query ws '=' ws '"' value '"' ws ']' )*;
//                query = property ['.' property]*;
//                    property = /[a-z]/+;
//     ws = /\s*/;

/**
 * Split selector into tokens
 * @param {string} expression - Input selector
 * @returns {string[]} - array of tokens
 */
function tokenize(expression) {
    var i = 0,
        token = [],
        tokens = [];
    while (i < expression.length) {
        var char = expression[i],
            lookbehind = i > 0 ? expression[i - 1] : "";

        switch (char) {
            case "]":
            case ",":
            case ">":
            case "=":
                if (lookbehind === " ") {
                    tokens.pop();
                }
                if (token.length > 0) {
                    tokens.push(token.join(""));
                }
                tokens.push(char);
                token = [];
                break;
            case " ":
                if (["[", "=", ",", ">"].indexOf(lookbehind) < 0) {
                    if (token.length > 0) {
                        tokens.push(token.join(""));
                    }
                    tokens.push(char);
                    token = [];
                }
                break;
            case "\"":
                if (token.length > 0) {
                    tokens.push(token.join(""));
                }
                token = [];
                break;
            case "[":
            case ".":
                if (token.length > 0) {
                    tokens.push(token.join(""));
                }
                tokens.push(char);
                token = [];
                break;
            default:
                token.push(char);
                break;
        }
        i++;
    }
    if (token.length > 0) {
        tokens.push(token.join(""));
    }
    return tokens;
}

/**
 * Parses selector into a consumable object
 * @param {string} item - Selector
 * @returns {Object} object that represents parsed selector
 */
function parse(item) {
    var tokens = tokenize(item),
        result = [],
        index = 0;

    /**
     * Remove the token from the list
     * @param {int} i - Index of the token
     * @returns {string} Removed token
     */
    function consume(i) {
        index++;
        return tokens[i];
    }


    /**
     * Parse value
     * @returns {string} value of the attribute
     */
    function parseValue() {
        return consume(index);
    }

    /**
     * Parse key
     * @returns {string} key of the attribute
     */
    function parseKey() {
        return consume(index);
    }

    /**
     * Parse query
     * @returns {Object} Query
     */
    function parseQuery() {
        var token = tokens[index];
        var query = [];
        while (token !== "=") {
            if (token !== ".") {
                query.push(parseKey());
            } else {
                token = consume(index);
            }
            token = tokens[index];
        }
        return query;
    }

    /**
     * Parse attribute
     * @returns {Object} Attribute
     */
    function parseAttribute() {
        var query = parseQuery();
        consume(index);
        var value = parseValue();
        return {
            query: query,
            value: value
        };
    }

    /**
     * Parse attributes
     * @returns {Object[]} Array of attributes
     */
    function parseAttributes() {
        var token = tokens[index],
            attributes = [];
        while (token !== "]" || tokens[index + 1] === "[") {
            if (token === "]") {
                consume();
                consume();
            }
            attributes.push(parseAttribute());
            token = tokens[index];
        }
        return attributes;
    }

    /**
     * Parse type
     * @returns {Object} Node type
     */
    function parseType() {
        return consume(index);
    }

    /**
     * Parse node
     * @returns {Object} Node
     */
    function parseNode() {
        var type,
            attributes,
            node = {};
        if (tokens[index] === "[") {
            consume(index);
            attributes = parseAttributes();
        } else {
            type = parseType();
            if (tokens[index] === "[") {
                consume(index);
                attributes = parseAttributes();
            }
        }
        if (tokens[index] === "]") {
            consume(index);
        }

        if (type) {
            node.type = type;
        }
        if (attributes) {
            node.attributes = attributes;
        }
        return node;
    }

    /**
     * Parse relationship
     * @param {Object} parent - Parent node
     * @returns {Object} node
     */
    function parseRelationship(parent) {
        var relationshipType = consume(index),
            decendant = parseNode();
        if (relationshipType === ">") {
            parent.hasDirectChild = true;
            decendant.directChild = true;
        }
        return decendant;
    }

    /**
     * Parse selector
     * @returns {Object} Selector
     */
    function parseSelector() {
        var selector = {
                event: item,
                selectors: []
            },
            node = parseNode();
        selector.selectors.push(node);
        while (index < tokens.length) {
            selector.selectors.push(parseRelationship(selector.selectors[selector.selectors.length - 1]));
        }
        return selector;
    }

    /**
     * Parse selectors
     * @returns {Object[]} Array of selectors
     */
    function parseSelectors() {
        var token = tokens[index],
            selectors = [];
        while (token) {
            if (token === ",") {
                consume(index);
            }
            selectors.push(parseSelector());
            token = tokens[index];
        }
        return selectors;
    }
    result = parseSelectors();
    return result;
}

module.exports.parse = parse;
module.exports.tokenize = tokenize;
