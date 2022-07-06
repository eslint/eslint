/*expected
initial->s1_1->s1_2->s1_3->s1_4;
s1_1->s1_5;
s1_2->s1_5;
s1_3->s1_5->thrown;
*/

try {
    throw err;
} finally {
    bar();
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize];
    s1_1[label="Program\nTryStatement\nBlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_2[label="ThrowStatement:exit"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nExpressionStatement\nCallExpression\nIdentifier (last)"];
    s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s1_1->s1_2->s1_3->s1_4;
    s1_1->s1_5;
    s1_2->s1_5;
    s1_3->s1_5->thrown;
}
*/
