/*
 *@fileoverview Rule to find Layout Thrashing
 *@author Bala Sundar @jankhuter
 */

/*
 *if(lt || LT){ alert("read it as Layout thrashing"); }
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce you to read all style value before making changes to the DOM",
            category: "Rendering Best Practices",
            recommended: true,
            url: "https://eslint.org/docs/rules/layout-thrashing"
        },
        schema: [],
        messages: {
            alternate: "alternate reads and writes are detected."
        }
    },
    create(context) {
        var innerLoopNumb = -1, // eslint-disable-line no-var
            errorArray = [], // array to keep track of the reads and writes of call exp
            isCallExp = false,
            innerFuncNumb = -1,
            isFirstLeftAssignment = false, // boolean to check for firstAssignment
            /* variables to check for conditional statements like "if,else", "if,else if" and "switch" */
            ifCondition, // boolean to check for if, else if statements
            isElseIf, // boolean to check for if, else if statements
            conditionalBlockNumb = -1,
            normalIf = false,
            propVarArray = [],
            ltThresholdForLoops = [], // to check LT inside the loops
            write = [], // to check LT inside the loops
            read = [], // to check LT inside the loops
            ltThreshold = [], // indicates that the threshold for LT has reached or not(1=reached ; 0=not reached)
            readCount = [], // to keep track of the number of reads count
            writeCount = [], // to keep track of the number of writes count
            conditionalBlock = [],
            blockThreshold = [],
            tempConditionalThreshold = [], // variables used to store values between the blocks in the if,else if statements or switch case statements
            tempThresholdForLoops = [],
            objectVariables = [];

        tempConditionalThreshold[-1] = 0;

        /**
         * function that keeps track of the functions
         * @param {node} node is FunctionExpression or FunctionDeclaration
         * @returns {void}
         */
        function funcStart(node) {

            // for inner functions
            innerFuncNumb++;
            readCount[innerFuncNumb] = 0;
            writeCount[innerFuncNumb] = 0;
            ltThreshold[innerFuncNumb] = 0;
            objectVariables[innerFuncNumb] = [];
            if (innerFuncNumb === 0) {
                propVarArray = [];
            }

            // to handle function that are binded to click handlers inside loop
            if (node.parent && node.parent.callee && node.parent.callee.property && node.parent.callee.property.name !== "forEach") {
                if (ltThresholdForLoops[innerLoopNumb]) {
                    tempThresholdForLoops[innerFuncNumb] = 1;
                    ltThresholdForLoops[innerLoopNumb] = 0;
                }
            }
        }

        /**
         * function that keeps track of the functions
         * @returns {void}
         */
        function funcEnd() {

            // to handle function that are binded to click handlers inside loop
            if (tempThresholdForLoops[innerFuncNumb]) {
                ltThresholdForLoops[innerLoopNumb] = 1;
                tempThresholdForLoops[innerFuncNumb] = 0;
            }

            // decrementing the function count while function ends
            innerFuncNumb--;
        }

        /**
         * function used to set flag values in "if , else if and switch" statements
         * @param {node} node is BlockStatement
         * @returns {void}
         */
        function blockEnd(node) {

            // to check in conditional statement (if else if, switch statement)
            if (/* else if */(node.parent.parent && node.parent.parent.type === "IfStatement" && !node.parent.alternate) || /* else */(node.parent.type === "IfStatement" && node.parent.alternate === node && node.parent.alternate && node.parent.alternate.type === "BlockStatement")) {
                if (blockThreshold[conditionalBlockNumb]) {
                    ltThreshold[innerFuncNumb] = 1;
                }
                conditionalBlock[conditionalBlockNumb] = false;
                blockThreshold[conditionalBlockNumb] = false;
                tempConditionalThreshold[conditionalBlockNumb] = 0;
                conditionalBlockNumb--;
            }
        }

        /**
         * to check in conditional statement (if else if statement)
         * @param {node} node is IfStatement
         * @returns {void}
         */
        function ifStart(node) {
            if (node.alternate && (node.parent.type === "SwitchCase" || node.parent.type === "BlockStatement" || node.parent.type === "Program")) {
                conditionalBlockNumb++;
                tempConditionalThreshold[conditionalBlockNumb] = ltThreshold[innerFuncNumb];
                conditionalBlock[conditionalBlockNumb] = true;
            } else if ((!(node.parent.alternate && node.parent.alternate.type === "IfStatement")) && !node.alternate) {
                normalIf = true;
            }
            if (node.parent.type === "IfStatement") {
                isElseIf = true;
            }
            ifCondition = true;
        }

        /**
         * function that keeps track of SwitchStatements
         * @returns {void}
         */
        function switchStart() {
            conditionalBlockNumb++;
            tempConditionalThreshold[conditionalBlockNumb] = ltThreshold[innerFuncNumb];
            conditionalBlock[conditionalBlockNumb] = true;
        }

        /**
         * function that is used to set/unset flag for the BlockStatements of Conditional blocks
         * @returns {void}
         */
        function conditionalBlockStart() {
            if (conditionalBlockNumb > -1 && (conditionalBlock[conditionalBlockNumb] && !normalIf)) {
                ltThreshold[innerFuncNumb] = tempConditionalThreshold[conditionalBlockNumb];
                writeCount[innerFuncNumb] = 0;
            }
            normalIf = false;
            isElseIf = false;
            if (ifCondition) {
                ifCondition = false;
            }
        }

        /**
         * function that is used to set/unset flag for the BlockStatements of Conditional blocks
         * @returns {void}
         */
        function conditionalBlockEnd() {
            if (conditionalBlock[conditionalBlockNumb]) {
                if (ltThreshold[innerFuncNumb]) {
                    blockThreshold[conditionalBlockNumb] = true;
                }
            }
        }

        /**
         * function that keeps track of SwitchStatements
         * @returns {void}
         */
        function switchEnd() {
            if (blockThreshold[conditionalBlockNumb]) {
                ltThreshold[innerFuncNumb] = 1;
            }
            blockThreshold[conditionalBlockNumb] = false;
            conditionalBlock[conditionalBlockNumb] = false;
            tempConditionalThreshold[conditionalBlockNumb] = 0;
            conditionalBlockNumb--;
        }

        /**
         * function to keep track of loops
         * @returns {void}
         */
        function loopsStart() {
            innerLoopNumb++;
            ltThresholdForLoops[innerLoopNumb] = 1;
        }

        /**
         * function to keep track of loops
         * @returns {void}
         */
        function loopsEnd() {
            read[innerLoopNumb] = 0;
            write[innerLoopNumb] = 0;
            ltThresholdForLoops[innerLoopNumb] = 0;
            innerLoopNumb--;
        }

        /**
         * function that initializes an array for each ExpressionStatement
         * @returns {void}
         */
        function expStatement() {
            errorArray = [];
        }

        /**
         * function that checks for layout thrashing in the CallExpression
         * @returns {void}
         */
        function expStatementEnd() {
            if (isCallExp) {
                let i;

                for (i = errorArray.length - 1; i >= 0; i--) {
                    const node = errorArray[i].node;

                    if (errorArray[i].status === "read") {
                        if (!ltThresholdForLoops[innerLoopNumb] && ltThreshold[innerFuncNumb] === 1) {
                            if (!isFirstLeftAssignment) {
                                context.report({ node, messageId: "alternate" });
                            }
                        } else if (ltThresholdForLoops[innerLoopNumb]) {
                            read[innerLoopNumb] = 1;
                            if (write[innerLoopNumb] || ltThreshold[innerFuncNumb] === 1) {
                                context.report({ node, messageId: "alternate" });
                            }
                        }
                        readCount[innerFuncNumb]++;
                    }
                    if (errorArray[i].status === "write") {
                        if (!ltThresholdForLoops[innerLoopNumb]) {
                            ltThreshold[innerFuncNumb] = 1;
                        } else if (ltThresholdForLoops[innerLoopNumb]) {
                            write[innerLoopNumb] = 1;
                            ltThreshold[innerFuncNumb] = 1;
                            if (read[innerLoopNumb]) {
                                context.report({ node, messageId: "alternate" });
                            }
                        }
                        writeCount[innerFuncNumb]++;
                    }
                }
                isCallExp = false;
            }
            isFirstLeftAssignment = false;
        }

        /**
         * function to set flag/throw error for write statement
         * @param {node} node is BlockStatement
         * @returns {void}
         */
        function checkForWrite(node) {
            if (!ltThresholdForLoops[innerLoopNumb]) {
                ltThreshold[innerFuncNumb] = 1;
            } else if (ltThresholdForLoops[innerLoopNumb]) {
                write[innerLoopNumb] = 1;
                ltThreshold[innerFuncNumb] = 1;
                if (read[innerLoopNumb]) {
                    context.report({ node, messageId: "alternate" });
                }
            }
        }

        /**
         * function to set flag for each CallExpression
         * @returns {void}
         */
        function callExp() {
            isCallExp = true;
            if (ifCondition) {
                isCallExp = false;
            }
        }

        /**
         * function that invokes loopsEnd function when it is end of a 'each' loop
         * @param {node} node is CallExpression
         * @returns {void}
         */
        function callExpEnd(node) {
            if (typeof node.callee !== "undefined" && typeof node.callee.property !== "undefined" && node.callee.property.name === "forEach") {
                loopsEnd();
            }
        }

        /**
         * function to store array variables and object variables
         * @param {node} node is VariableDeclarator
         * @returns {void}
         */
        function variableDeclarator(node) {
            if (innerFuncNumb === -1) {
                return;
            }
            if (node.init && (node.init.type === "ObjectExpression" || node.init.type === "ArrayExpression")) {
                objectVariables[innerFuncNumb].push(node.id.name);
            }
        }

        /**
         * function that check for layout thrashing
         * @param {node} node is MemberExpression
         * @returns {void}
         */
        function ltValidater(node) {

            // Check for existence
            if (typeof node.property === "undefined") {
                return;
            }

            // to skip the check of conditional statement in "else if"
            if (isElseIf && conditionalBlock[conditionalBlockNumb] && !tempConditionalThreshold[conditionalBlockNumb]) {
                return;
            }

            // check for .each loop
            if (node.property.name === "forEach") {
                loopsStart();
            }
            let proceed = 1;
            const arr = ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight", "offsetParent", "clientLeft", "clientTop", "clientWidth", "clientHeight", "scrollWidth", "scrollHeight", "scrollLeft", "scrollTop", "min-width", "min-height", "max-width", "max-height", "height", "width", "top", "right", "bottom", "left", "margin", "marginTop", "marginRight", "marginLeft", "marginBottom", "padding", "paddingTop", "paddingRight", "paddingLeft", "paddingBottom", "scrollX", "scrollY", "innerWidth", "innerHeight", "outerWidth", "outerHeight", "getComputedStyle", "getBoundingClientRect", "getClientRects"], // array of styles that triggers layout
                arr1 = ["value", "innerText", "innerHTML", "className", "textContent", "dir", "normalize"],
                arr2 = ["appendTo", "prependTo", "appendChild", "removeChild", "replaceChild", "insertBefore", "insertAfter"],
                arr3 = ["class", "style", "dir", "size"],
                arr4 = ["removeAttribute", "removeAttributeNode"],
                arr5 = ["left", "top"],
                propArr = ["getClientRects", "getBoundingClientRect"];

            // to store the variables reading the propArr values
            if ((propArr.indexOf(node.property.name) > -1) && !node.parent.property && !node.parent.parent.property && node.parent.parent.id) {
                propVarArray.push(node.parent.parent.id.name);
            }

            // check for STYLE READ properties
            if (arr.indexOf(node.property.name) > -1) {
                if (typeof node.parent.arguments !== "undefined" && node.parent.arguments[node.parent.arguments.indexOf(node)] !== node) {
                    if (node.parent.arguments.length !== 0) {
                        proceed = 0;
                    }
                }
                if (node.parent.type === "AssignmentExpression") {
                    if (node.parent.left === node) {
                        proceed = 0;
                    }
                }

                // to exclude if it is read an object formed due to the read of propArr
                if (arr5.indexOf(node.property.name) > -1) {
                    if (propVarArray.indexOf(node.object.name) > -1) {
                        proceed = 0;
                    }
                }

                // to exclude if it is javascript .style read
                if (typeof node.object.property !== "undefined") {
                    if (node.object.property.name === "style") {
                        proceed = 0;
                    }
                }

                // to exclude if the value is read from an object
                if ((objectVariables[innerFuncNumb] && (objectVariables[innerFuncNumb].indexOf(node.object.name) > -1 || (node.object.object && objectVariables[innerFuncNumb].indexOf(node.object.object.name) > -1)))) { // eslint-disable-line max-len
                    proceed = 0;
                }
                if (proceed) {
                    if (isCallExp) {
                        errorArray.push({ status: "read", node });
                    } else {
                        if (!ltThresholdForLoops[innerLoopNumb] && ltThreshold[innerFuncNumb] === 1) {
                            if (!isFirstLeftAssignment) {
                                context.report({ node, messageId: "alternate" });
                            }
                        } else if (ltThresholdForLoops[innerLoopNumb]) {
                            read[innerLoopNumb] = 1;
                            if (write[innerLoopNumb] || ltThreshold[innerFuncNumb] === 1) {
                                context.report({ node, messageId: "alternate" });
                            }
                        }
                        readCount[innerFuncNumb]++;
                    }
                }
                proceed = 1;
            }

            // check for STYLE WRITE properties
            if (typeof node.object.property !== "undefined" && node.object.property.name === "style" && node.parent.left === node && node.parent.type === "AssignmentExpression") {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    if (writeCount[innerFuncNumb] < 1) {
                        isFirstLeftAssignment = true;
                    }
                    writeCount[innerFuncNumb]++;
                }
            } else if (arr.indexOf(node.property.name) > -1 && ((node.parent.type === "AssignmentExpression" && node.parent.left === node && (!objectVariables[innerFuncNumb] || (objectVariables[innerFuncNumb].indexOf(node.object.name) === -1 && (node.object.object && objectVariables[innerFuncNumb].indexOf(node.object.object.name) === -1)))) || (typeof node.parent.arguments !== "undefined" && node.parent.arguments[node.parent.arguments.indexOf(node)] !== node && node.parent.arguments.length === 1 && node.parent.arguments[0].value !== true))) {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    if (writeCount[innerFuncNumb] < 1) {
                        isFirstLeftAssignment = true;
                    }
                    writeCount[innerFuncNumb]++;
                }
            } else if (["setAttribute", "setAttributeNode"].indexOf(node.property.name) > -1) {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    writeCount[innerFuncNumb]++;
                }
            }

            // check for DOM WRITE
            if (arr1.indexOf(node.property.name) > -1 && ((typeof node.parent.arguments !== "undefined" && node.parent.arguments[node.parent.arguments.indexOf(node)] !== node && node.parent.arguments.length > 0) || (node.parent.left === node && node.parent.type === "AssignmentExpression"))) {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    if (writeCount[innerFuncNumb] < 1) {
                        isFirstLeftAssignment = true;
                    }
                    writeCount[innerFuncNumb]++;
                }
            } else if (arr4.indexOf(node.property.name) > -1 && (typeof node.parent.arguments !== "undefined" && node.parent.arguments[node.parent.arguments.indexOf(node)] !== node && node.parent.arguments.length > 0 && (arr.indexOf(node.parent.arguments[0].value) > -1 || arr3.indexOf(node.parent.arguments[0].value) > -1))) {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    writeCount[innerFuncNumb]++;
                }
            } else if (arr2.indexOf(node.property.name) > -1) {
                if (isCallExp) {
                    errorArray.push({ status: "write", node });
                } else {
                    checkForWrite(node);
                    writeCount[innerFuncNumb]++;
                }
            }
        }

        return {
            "BlockStatement:exit": blockEnd,
            FunctionExpression: funcStart,
            "FunctionExpression:exit": funcEnd,
            FunctionDeclaration: funcStart,
            "FunctionDeclaration:exit": funcEnd,
            SwitchStatement: switchStart,
            SwitchCase: conditionalBlockStart,
            "SwitchCase:exit": conditionalBlockEnd,
            "SwitchStatement:exit": switchEnd,
            IfStatement: ifStart,
            "IfStatement > BlockStatement": conditionalBlockStart,
            "IfStatement > BlockStatement:exit": conditionalBlockEnd,
            MemberExpression: ltValidater,
            ForStatement: loopsStart,
            "ForStatement:exit": loopsEnd,
            WhileStatement: loopsStart,
            "WhileStatement:exit": loopsEnd,
            DoWhileStatement: loopsStart,
            "DoWhileStatement:exit": loopsEnd,
            CallExpression: callExp,
            "CallExpression:exit": callExpEnd,
            ExpressionStatement: expStatement,
            "ExpressionStatement:exit": expStatementEnd,
            VariableDeclaration: expStatement,
            "VariableDeclaration:exit": expStatementEnd,
            VariableDeclarator: variableDeclarator
        };
    }
};
