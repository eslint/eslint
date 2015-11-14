/*expected
initial->s1_1->s1_3->s1_2->s1_4->s1_2;
s1_3->s1_5;
s1_4->s1_5->final;
*/
for (var a of [0]) {
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForInStatement"];
    s1_3[label="ArrayExpression\nLiteral (0)"];
    s1_2[label="VariableDeclaration\nVariableDeclarator\nIdentifier (a)"];
    s1_4[label="BlockStatement"];
    s1_5[label="ForInStatement:exit\nProgram:exit"];
    initial->s1_1->s1_3->s1_2->s1_4->s1_2;
    s1_3->s1_5;
    s1_4->s1_5->final;
}
*/
