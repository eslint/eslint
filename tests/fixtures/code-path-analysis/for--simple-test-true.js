/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_2;
s1_3->s1_5;
*/
for (var i = 0; true; ++i) {
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_2[label="Literal (true)"];
    s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_4[label="UpdateExpression\nIdentifier (i)"];
    s1_5[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_2;
    s1_3->s1_5;
}
*/
