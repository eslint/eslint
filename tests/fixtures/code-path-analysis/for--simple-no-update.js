/*expected
initial->s1_1->s1_2->s1_3->s1_2->s1_4->final;
*/
for (var i = 0; i < 10;) {
    ++i;
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_2[label="BinaryExpression\nIdentifier (i)\nLiteral (10)"];
    s1_3[label="BlockStatement\nExpressionStatement\nUpdateExpression\nIdentifier (i)"];
    s1_4[label="ForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_2->s1_4->final;
}
*/
