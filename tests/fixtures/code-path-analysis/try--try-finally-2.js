/*eslint-env node*/
/*expected
initial->s1_1->s1_2->s1_3;
s1_1->s1_4;
s1_2->s1_4->final;
*/

try {
    return;
} finally {
    bar();
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nTryStatement\nBlockStatement\nReturnStatement"];
    s1_2[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nExpressionStatement\nCallExpression\nIdentifier (last)"];
    s1_4[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s1_1->s1_2->s1_3;
    s1_1->s1_4;
    s1_2->s1_4->final;
}
*/
