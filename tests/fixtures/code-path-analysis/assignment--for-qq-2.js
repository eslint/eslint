/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_2->s1_4;
s1_3->s1_5;
s1_2->s1_5->final;
*/
for (init; a ??= b;) {
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nForStatement:enter\nIdentifier (init)"];
    s1_2[label="AssignmentExpression:enter\nIdentifier (a)"];
    s1_3[label="Identifier (b)\nAssignmentExpression:exit"];
    s1_4[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_5[label="ForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_2->s1_4;
    s1_3->s1_5;
    s1_2->s1_5->final;
}
*/
