/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_2->s1_5;
s1_3->s1_7;
s1_4->s1_7->final;
*/
for (init; a || b && c; update) {
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nIdentifier (init)"];
    s1_2[label="LogicalExpression\nIdentifier (a)"];
    s1_3[label="LogicalExpression\nIdentifier (b)"];
    s1_4[label="Identifier (c)"];
    s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_6[label="Identifier (update)"];
    s1_7[label="ForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_2->s1_5;
    s1_3->s1_7;
    s1_4->s1_7->final;
}
*/
