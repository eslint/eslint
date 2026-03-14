/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_2->s1_8;
s1_3->s1_6->s1_7->s1_2;
s1_4->s1_5->s1_7;
s1_8->final;
*/

while (c) {
    try {
        bar();
        continue;
    } catch {}
    baz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="WhileStatement\nIdentifier (c)"];
    s1_2[label="TryStatement\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nCallExpression:exit\nExpressionStatement:exit\nContinueStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_4[label="CatchClause\nBlockStatement"];
    s1_5[label="TryStatement:exit\nExpressionStatement\nCallExpression\nIdentifier (baz)"];
    initial->s1_1->s1_2->s1_3->s1_5;
    s1_1->s1_4->s1_5;
    s1_5->s1_1;
    s1_5->final;
}
*/
