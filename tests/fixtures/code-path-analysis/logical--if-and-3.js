/*expected
initial->s1_1->s1_2->s1_3->s1_9;
s1_1->s1_4->s1_5->s1_6->s1_9;
s1_2->s1_4->s1_7->s1_9;
s1_5->s1_7;
s1_9->final;
*/
if (a && b) {
    foo();
} else if (c && d) {
    bar();
} else {
    qiz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nIfStatement\nLogicalExpression\nIdentifier (a)"];
    s1_2[label="Identifier (b)"];
    s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_9[label="IfStatement:exit\nProgram:exit"];
    s1_4[label="IfStatement\nLogicalExpression\nIdentifier (c)"];
    s1_5[label="Identifier (d)"];
    s1_6[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    s1_7[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (qiz)"];
    initial->s1_1->s1_2->s1_3->s1_9;
    s1_1->s1_4->s1_5->s1_6->s1_9;
    s1_2->s1_4->s1_7->s1_9;
    s1_5->s1_7;
    s1_9->final;
}
*/
