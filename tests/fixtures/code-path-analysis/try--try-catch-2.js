/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5;
s1_1->s1_3;
s1_2->s1_5->final;
s1_3->thrown;
*/

try {
    foo();
} catch (err) {
    throw err;
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize];
    s1_1[label="Program\nTryStatement\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_2[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_3[label="CatchClause\nIdentifier (err)\nBlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit\nCatchClause:exit"];
    s1_5[label="TryStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5;
    s1_1->s1_3;
    s1_2->s1_5->final;
    s1_3->thrown;
}
*/
