/*expected
initial->s1_1->s1_2->s1_3;
s1_1->s1_3->final;
*/

A: {
    break A;
}

bar();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nLabeledStatement\nIdentifier (A)\nBlockStatement\nBreakStatement\nIdentifier (A)"];
    s1_2[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_3[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s1_1->s1_2->s1_3;
    s1_1->s1_3->final;
}
*/
