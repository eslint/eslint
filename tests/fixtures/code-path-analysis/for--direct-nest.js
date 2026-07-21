/*expected
initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_5;
s1_2->s1_9;
s1_5->s1_8->s1_4->s1_2;
s1_9->final;
*/
for (var i = 0; i < 10; ++i)
    for (var j = 0; j < 10; ++j)
        foo

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)\nIdentifier:exit (i)\nLiteral:exit (0)\nVariableDeclarator:exit\nVariableDeclaration:exit"];
    s1_2[label="BinaryExpression\nIdentifier (i)\nLiteral (10)\nIdentifier:exit (i)\nLiteral:exit (10)\nBinaryExpression:exit"];
    s1_3[label="ForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (j)\nLiteral (0)\nIdentifier:exit (j)\nLiteral:exit (0)\nVariableDeclarator:exit\nVariableDeclaration:exit"];
    s1_5[label="BinaryExpression\nIdentifier (j)\nLiteral (10)\nIdentifier:exit (j)\nLiteral:exit (10)\nBinaryExpression:exit"];
    s1_6[label="ExpressionStatement\nIdentifier (foo)\nIdentifier:exit (foo)\nExpressionStatement:exit"];
    s1_7[label="UpdateExpression\nIdentifier (j)\nIdentifier:exit (j)\nUpdateExpression:exit"];
    s1_9[label="ForStatement:exit\nProgram:exit"];
    s1_8[label="ForStatement:exit"];
    s1_4[label="UpdateExpression\nIdentifier (i)\nIdentifier:exit (i)\nUpdateExpression:exit"];
    initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_5;
    s1_2->s1_9;
    s1_5->s1_8->s1_4->s1_2;
    s1_9->final;
}
*/
