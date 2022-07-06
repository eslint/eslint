/*expected
initial->s1_1->s1_2->s1_3->s1_2->s1_4;
s1_3->s1_4->final;
*/
do {
    foo();
    break;
} while (a);

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nDoWhileStatement"];
    s1_2[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)\nBreakStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nIdentifier (a)"];
    s1_4[label="DoWhileStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_2->s1_4;
    s1_3->s1_4->final;
}
*/
