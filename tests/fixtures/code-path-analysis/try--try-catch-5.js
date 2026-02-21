/*languageOptions
    { "sourceType": "commonjs" }
*/
/*expected
initial->s1_1->s1_2->s1_3->s1_5;
s1_1->s1_4->s1_5;
s1_2->final;
s1_5->final;
*/

try {
    bar();
    return;
} catch {}
baz();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nTryStatement\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    s1_2[label="CallExpression:exit\nExpressionStatement:exit\nReturnStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_4[label="CatchClause\nBlockStatement"];
    s1_5[label="TryStatement:exit\nExpressionStatement\nCallExpression\nIdentifier (baz)"];
    initial->s1_1->s1_2->s1_3->s1_5;
    s1_1->s1_4->s1_5;
    s1_3->s1_5;
    s1_2->final;
    s1_5->final;
}
*/
