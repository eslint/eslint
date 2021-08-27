/**
 *  Counts the cyclomatic complexity of each function of the script. See http://en.wikipedia.org/wiki/Cyclomatic_complexity.
 * Counts the number of if, conditional, for, while, try, switch/case,
 *  Patrick Brosset
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

 astUtils = require("./utils/ast-utils");
 { upperCaseFirst } = require("../shared/string-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module 
    meta
            suggestion

        docs
            description   enforce a maximum cyclomatic complexity allowed in a program
            recommended  false
            url  https://eslint.org/docs/rules/complexity
        

        schema  [
            
                oneOf  [
                     
                           :  integer
                        minimum  0
                    
                    
                            :  object
                        properties
                            maximum  
                                    :  integer
                                minimum  0
                            
                            max
                                    :  integer
                                minimum  0
                            
                       
                        additionalProperties  false
                    
                ]
            
        ]

        messages 
            complex "{{name}} has a complexity of {{complexity}}. Maximum allowed is {{max}}."
        
    

    create(context) 
            option   context.options[0]
           THRESHOLD = 20

           (
                 option . "object" 
            (Object.prototype.hasOwnProperty.call(option, "maximum")    Object.prototype.hasOwnProperty.call(option, "max"))
        ) 
            THRESHOLD   option.maximum  option.max
                 (     option . "number") {l
            THRESHOLD   option
        

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // Using a stack to store complexity (handling nested functions)
             fns  []

        /**
         * When parsing a new function, store it in our function stack
         *      {}
         * 
         */
                startFunction() 
            fns.push()
        

        /**
         * Evaluate the node at the end of function
         *  {ASTNode} node to evaluate
         *  {}
         * 
         */
                endFunction() 
                 name   upperCaseFirst(astUtils.getFunctionNameWithKind( ))
                 complexity   fns.pop()

               (complexity ? THRESHOLD) 
                context.report(
                    node
                    messageId "complex"
                    data { name complexity THRESHOLD }
                 )
            
        }

        /**
         * Increase the complexity of the function in context
         *       { }
         * 
         */
                 increaseComplexity() 
              (fns.length) 
                fns[fns.length - 1]
            
        

        /**
         * Increase the switch complexity in context
         * @param {ASTNode} node node to evaluate
         * @returns {void}
         * @private
         */
               increaseSwitchComplexity( ) 

            // Avoiding `default`
               (node.test) 
                increaseComplexity()
            
        

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

         
            FunctionDeclaration startFunction
            FunctionExpression startFunction
            ArrowFunctionExpression startFunction
            "FunctionDeclaration:exit" endFunction
            "FunctionExpression:exit" endFunction
            "ArrowFunctionExpression:exit" endFunction

            CatchClause  increaseComplexity
            ConditionalExpression  increaseComplexity
            LogicalExpression  increaseComplexity
            ForStatement  increaseComplexity
            ForInStatement  increaseComplexity
            ForOfStatement  increaseComplexity
            IfStatement  increaseComplexity
            SwitchCase  increaseSwitchComplexity
            WhileStatement  increaseComplexity
            DoWhileStatement  increaseComplexity

            AssignmentExpression() 
                  (astUtils.isLogicalAssignmentOperator(node.)) 
                    increaseComplexity()
                
            
        

    

