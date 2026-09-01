/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_6;
s1_1->s1_3;
s1_2->s1_6;
s1_3->s1_7;
s1_4->s1_7;
s1_6->final;
s1_7->thrown;
*/

let foo;

try {
    foo = "Hello";
} catch (err) {
    foo = "World";
} finally {
	console.log("Done");
}

/*DOT
    digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];
    s1_1[label="Program:enter\nVariableDeclaration:enter\nVariableDeclarator:enter\nIdentifier (foo)\nVariableDeclarator:exit\nVariableDeclaration:exit\nTryStatement:enter\nBlockStatement:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nIdentifier (foo)"];
    s1_2[label="Literal (Hello)\nAssignmentExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_3[label="CatchClause:enter\nIdentifier (err)\nBlockStatement:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nIdentifier (foo)"];
    s1_4[label="Literal (World)\nAssignmentExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nCatchClause:exit"];
    s1_6[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nMemberExpression:enter\nIdentifier (console)\nIdentifier (log)\nMemberExpression:exit\nLiteral (Done)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nProgram:exit"];
    s1_7[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nMemberExpression:enter\nIdentifier (console)\nIdentifier (log)\nMemberExpression:exit\nLiteral (Done)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_6;
    s1_1->s1_3;
    s1_2->s1_6;
    s1_3->s1_7;
    s1_4->s1_7;
    s1_6->final;
    s1_7->thrown;
}
*/
