/*expected
initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_8->s1_10->s1_2->s1_4->s1_5->s1_11;
s1_7->s1_9->s1_10;
s1_11->final;
*/
for (var i = 0; i < 10 ? true : false; ++i ? 1 : 2) {
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_2[label="ConditionalExpression\nBinaryExpression\nIdentifier (i)\nLiteral (10)"];
    s1_3[label="Literal (true)"];
    s1_5[label="ConditionalExpression:exit"];
    s1_6[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_7[label="ConditionalExpression\nUpdateExpression\nIdentifier (i)"];
    s1_8[label="Literal (1)"];
    s1_10[label="ConditionalExpression:exit"];
    s1_4[label="Literal (false)"];
    s1_11[label="ForStatement:exit\nProgram:exit"];
    s1_9[label="Literal (2)"];
    initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_8->s1_10->s1_2->s1_4->s1_5->s1_11;
    s1_7->s1_9->s1_10;
    s1_11->final;
}
*/
